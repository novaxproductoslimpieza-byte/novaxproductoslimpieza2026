import { Response } from 'express';
import prisma from '../utils/db';
import { AuthRequest } from '../middlewares/authMiddleware';
import { hashPassword } from '../utils/auth';

// GET /api/users/profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado.' }); return; }
    const user = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: { id: true, nombre: true, ci: true, telefono: true, direccion: true, correo: true, rol: true }
    });
    if (!user) { res.status(404).json({ error: 'Usuario no encontrado.' }); return; }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el perfil.' });
  }
};

// PUT /api/users/profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado.' }); return; }
    const { nombre, telefono, direccion, correo, password } = req.body;
    const updateData: any = {};
    if (nombre) updateData.nombre = nombre;
    if (telefono) updateData.telefono = telefono;
    if (direccion) updateData.direccion = direccion;
    if (correo) updateData.correo = correo;
    if (password) updateData.password = await hashPassword(password);

    const user = await prisma.usuario.update({
      where: { id: req.user.id },
      data: updateData,
      select: { id: true, nombre: true, ci: true, telefono: true, direccion: true, correo: true, rol: true }
    });
    res.json({ message: 'Perfil actualizado.', user });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el perfil.' });
  }
};

// GET /api/admin/clients
export const getClients = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const clients = await prisma.usuario.findMany({
      where: { rol: 'CLIENTE' },
      select: { id: true, nombre: true, ci: true, telefono: true, direccion: true, correo: true },
      orderBy: { nombre: 'asc' }
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los clientes.' });
  }
};
