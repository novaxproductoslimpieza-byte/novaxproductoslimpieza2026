import { Request, Response } from 'express';
import prisma from '../utils/db';
import { AuthRequest } from '../middlewares/authMiddleware';

// GET /admin/categoria
export const getCategorias = async (_req: Request, res: Response): Promise<void> => {
    try {
        const categorias = await prisma.categoria.findMany({
            include: {
                subcategorias: {
                    include: { productos: true }
                }
            },
            orderBy: { nombre: 'asc' }
        });
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las categorías.' });
    }
};

// POST /admin/categoria
export const createCategoria = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { nombre, descripcion } = req.body;
        const categoria = await prisma.categoria.create({ data: { nombre, descripcion } });
        res.status(201).json(categoria);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la categoría.' });
    }
};

// PUT /admin/categoria/:id
export const updateCategoria = async (req: AuthRequest, res: Response): Promise<void> => {
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

// DELETE /admin/categoria/:id
export const deleteCategoria = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.categoria.delete({ where: { id: Number(id) } });
        res.json({ message: 'Categoría eliminada.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la categoría.' });
    }
};