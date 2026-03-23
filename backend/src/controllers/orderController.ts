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
    console.log('--- Order Creation Attempt ---');
    console.log('User ID:', req.user?.id);
    console.log('Products:', JSON.stringify(productos, null, 2));

    const cliente_id = req.user.id;

    const newOrder = await prisma.pedido.create({
      data: {
        cliente_id,
        estado: 'PENDIENTE',
        detalles: {
          create: productos.map((p: any) => ({
            producto_id: p.producto_id,
            cantidad: Number(p.cantidad),
            precio: Number(p.precio)
          }))
        }
      }
    });

    res.status(201).json({ message: 'Pedido creado', pedido_id: newOrder.id });
  } catch (error) {
    console.error('CRITICAL ERROR in createOrder:', error);
    res.status(500).json({ error: 'Error al crear el pedido: ' + (error instanceof Error ? error.message : String(error)) });
  }
};

// GET /api/admin/orders/:id (Admin Only)
export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pedido = await prisma.pedido.findUnique({
      where: { id: Number(id) },
      include: {
        detalles: {
          include: { producto: { select: { nombre: true, imagen: true, presentacion: true } } }
        },
        cliente: {
          select: { nombre: true, correo: true, ci: true, telefono: true, direccion: true }
        }
      }
    });
    if (!pedido) {
      res.status(404).json({ error: 'Pedido no encontrado' });
      return;
    }
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el pedido.' });
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

// DELETE /api/orders/:id (Admin or Owner)
export const deleteOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const pedido = await prisma.pedido.findUnique({
      where: { id: Number(id) },
      include: { detalles: true }
    });

    if (!pedido) {
      res.status(404).json({ error: 'Pedido no encontrado' });
      return;
    }

    // Si no es admin, solo puede borrar sus propios pedidos PENDIENTES
    if (req.user.rol !== 'ADMINISTRADOR') {
      if (pedido.cliente_id !== req.user.id) {
        res.status(403).json({ error: 'No autorizado para borrar este pedido.' });
        return;
      }
      if (pedido.estado !== 'PENDIENTE') {
        res.status(400).json({ error: 'No puedes borrar un pedido que ya ha sido procesado.' });
        return;
      }
    }

    // Si el pedido estaba aprobado o en despacho, devolver stock
    if (pedido.estado === 'APROBADO' || pedido.estado === 'EN_DESPACHO') {
      await prisma.$transaction(async (tx) => {
        for (const detalle of pedido.detalles) {
          await tx.producto.update({
            where: { id: detalle.producto_id },
            data: { stock: { increment: detalle.cantidad } }
          });
        }
        await tx.pedido.delete({
          where: { id: Number(id) }
        });
      });
    } else {
      await prisma.pedido.delete({
        where: { id: Number(id) }
      });
    }

    res.json({ message: 'Pedido eliminado correctamente.' });
  } catch (error) {
    console.error('Error in deleteOrder:', error);
    res.status(500).json({ error: 'Error al eliminar el pedido.' });
  }
};
