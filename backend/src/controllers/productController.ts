import { Request, Response } from 'express';
import prisma from '../utils/db';
import { AuthRequest } from '../middlewares/authMiddleware';

// GET /api/products
export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category_id, search } = req.query;

    const whereClause: any = {};
    if (category_id) {
      whereClause.subcategoria = { categoria_id: Number(category_id) };
    }
    if (search) {
      whereClause.nombre = { contains: String(search), mode: 'insensitive' };
    }

    const productos = await prisma.producto.findMany({
      where: whereClause,
      include: {
        subcategoria: true
      }
    });

    // Anonymize prices if user is not logged in (handled mostly by frontend, but good practice if needed)
    // Actually specs say "Visitante: No puede ver precios". BUT wait, QA answer 13 says:
    // "Los usuarios guest solo pueden ver catálogo sin precios; usuarios registrados ven precios".
    
    let result = productos;
    if (!req.user) {
      // Si no hay usuario, ocultar precios
      result = productos.map(p => {
        const { precio_minorista, precio_mayorista, ...resto } = p as any;
        return resto;
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos.' });
  }
};

// GET /api/products/:id
export const getProductById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const producto = await prisma.producto.findUnique({
      where: { id: Number(id) },
      include: { subcategoria: true }
    });

    if (!producto) {
      res.status(404).json({ error: 'Producto no encontrado.' });
      return;
    }

    let result: any = producto;
    if (!req.user) {
       const { precio_minorista, precio_mayorista, ...resto } = result;
       result = resto;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error interno.' });
  }
};

// POST /api/admin/products
export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nombre, descripcion, precio_minorista, precio_mayorista, presentacion, olor, color, imagen, stock, subcategoria_id } = req.body;
    const producto = await prisma.producto.create({
      data: { nombre, descripcion, precio_minorista, precio_mayorista, presentacion, olor, color, imagen, stock: stock ?? 0, subcategoria_id: Number(subcategoria_id) }
    });
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto.' });
  }
};

// PUT /api/admin/products/:id
export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (data.subcategoria_id) data.subcategoria_id = Number(data.subcategoria_id);
    const producto = await prisma.producto.update({ where: { id: Number(id) }, data });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto.' });
  }
};

// DELETE /api/admin/products/:id
export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.producto.delete({ where: { id: Number(id) } });
    res.json({ message: 'Producto eliminado.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto.' });
  }
};

// PATCH /api/admin/products/:id/stock
export const updateStock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { cantidad, operacion } = req.body; // operacion: 'increment' | 'decrement' | 'set'
    let data: any = {};
    if (operacion === 'increment') data = { stock: { increment: Number(cantidad) } };
    else if (operacion === 'decrement') data = { stock: { decrement: Number(cantidad) } };
    else data = { stock: Number(cantidad) };
    const producto = await prisma.producto.update({ where: { id: Number(id) }, data });
    res.json({ message: 'Stock actualizado.', stock: producto.stock });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar stock.' });
  }
};
