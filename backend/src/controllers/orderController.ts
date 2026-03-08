import { Response } from 'express';
import prisma from '../utils/db';
import { AuthRequest } from '../middlewares/authMiddleware';

// POST /api/orders
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productos } = req.body; // Array of { producto_id, cantidad, precio }

    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const cliente_id = req.user.id;

    const newOrder = await prisma.pedido.create({
      data: {
        cliente_id,
        estado: 'PENDIENTE',
        detalles: {
          create: productos.map((p: any) => ({
            producto_id: p.producto_id,
            cantidad: p.cantidad,
            precio: p.precio
          }))
        }
      }
    });

    res.status(201).json({ message: 'Pedido creado', pedido_id: newOrder.id });
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ error: 'Error al crear el pedido.' });
  }
};

// GET /api/orders
export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const { rol, id } = req.user;
    
    // Si es administrador ve todo, si es cliente ve sus propios pedidos
    const whereClause = rol === 'ADMINISTRADOR' ? {} : { cliente_id: id };

    const pedidos = await prisma.pedido.findMany({
      where: whereClause,
      include: {
        detalles: {
          include: { producto: true }
        },
        cliente: {
          select: { nombre: true, correo: true, ci: true }
        }
      },
      orderBy: { fecha: 'desc' }
    });

    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos.' });
  }
};

// PUT /api/orders/:id/status (Admin Only)
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const pedido = await prisma.pedido.findUnique({
      where: { id: Number(id) },
      include: { detalles: true }
    });

    if (!pedido) {
      res.status(404).json({ error: 'Pedido no encontrado' });
      return;
    }

    // QA Respuesta #5: El stock se descuenta al aprobar el pedido
    if (estado === 'APROBADO' && pedido.estado === 'PENDIENTE') {
      // Usar transacción para asegurar que el inventario y estado cambien juntos
      await prisma.$transaction(async (tx) => {
        // Descontar inventario
        for (const detalle of pedido.detalles) {
          await tx.producto.update({
            where: { id: detalle.producto_id },
            data: { stock: { decrement: detalle.cantidad } }
          });
        }
        // Actualizar estado del pedido
        await tx.pedido.update({
          where: { id: Number(id) },
          data: { estado }
        });
      });
      res.json({ message: 'Pedido aprobado y stock deducido.' });
      return;
    }

    // QA Respuesta #6: Cancelación de pedidos, retorna stock si estaba aprobado
    if (estado === 'CANCELADO' && pedido.estado === 'APROBADO') {
      await prisma.$transaction(async (tx) => {
        for (const detalle of pedido.detalles) {
          await tx.producto.update({
            where: { id: detalle.producto_id },
            data: { stock: { increment: detalle.cantidad } }
          });
        }
        await tx.pedido.update({
          where: { id: Number(id) },
          data: { estado }
        });
      });
      res.json({ message: 'Pedido cancelado y stock respuesto.' });
      return;
    }

    // Solo actualiza estado si no cae en condiciones de stock
    await prisma.pedido.update({
      where: { id: Number(id) },
      data: { estado }
    });
    
    res.json({ message: 'Estado del pedido actualizado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar pedido.' });
  }
};
