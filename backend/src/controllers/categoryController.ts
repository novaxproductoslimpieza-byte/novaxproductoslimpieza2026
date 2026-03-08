import { Request, Response } from 'express';
import prisma from '../utils/db';
import { AuthRequest } from '../middlewares/authMiddleware';

// GET /api/categories
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.categoria.findMany({
      include: { subcategorias: true },
      orderBy: { nombre: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías.' });
  }
};

// POST /api/admin/categories
export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nombre, descripcion } = req.body;
    const categoria = await prisma.categoria.create({ data: { nombre, descripcion } });
    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría.' });
  }
};

// PUT /api/admin/categories/:id
export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const categoria = await prisma.categoria.update({
      where: { id: Number(id) },
      data: { nombre, descripcion }
    });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la categoría.' });
  }
};

// DELETE /api/admin/categories/:id
export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.categoria.delete({ where: { id: Number(id) } });
    res.json({ message: 'Categoría eliminada.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría.' });
  }
};

// POST /api/admin/subcategories
export const createSubcategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nombre, descripcion, categoria_id } = req.body;
    const sub = await prisma.subcategoria.create({
      data: { nombre, descripcion, categoria_id: Number(categoria_id) }
    });
    res.status(201).json(sub);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la subcategoría.' });
  }
};

// PUT /api/admin/subcategories/:id
export const updateSubcategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, categoria_id } = req.body;
    const sub = await prisma.subcategoria.update({
      where: { id: Number(id) },
      data: { nombre, descripcion, ...(categoria_id && { categoria_id: Number(categoria_id) }) }
    });
    res.json(sub);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la subcategoría.' });
  }
};

// DELETE /api/admin/subcategories/:id
export const deleteSubcategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.subcategoria.delete({ where: { id: Number(id) } });
    res.json({ message: 'Subcategoría eliminada.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la subcategoría.' });
  }
};
