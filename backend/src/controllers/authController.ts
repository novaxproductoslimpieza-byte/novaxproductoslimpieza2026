import { Request, Response } from 'express';
import prisma from '../utils/db';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, ci, telefono, direccion, correo, password, latitud, longitud, zona_id } = req.body;

    // Verificar si existe el CI o correo
    const existingUser = await prisma.usuario.findFirst({
      where: {
        OR: [{ correo }, { ci }]
      }
    });

    if (existingUser) {
      res.status(400).json({ error: 'El CI o el correo ya están registrados.' });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        ci,
        telefono,
        direccion,
        correo,
        password: hashedPassword,
        rol: 'CLIENTE',
        latitud: latitud ? Number(latitud) : null,
        longitud: longitud ? Number(longitud) : null,
        zona_id: zona_id ? Number(zona_id) : null,
      }
    });

    const token = generateToken({ id: newUser.id, rol: newUser.rol });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: { id: newUser.id, nombre: newUser.nombre, rol: newUser.rol }
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ci_or_correo, password } = req.body;

    const user = await prisma.usuario.findFirst({
      where: {
        OR: [
          { correo: ci_or_correo },
          { ci: ci_or_correo }
        ]
      }
    });

    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    const token = generateToken({ id: user.id, rol: user.rol });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        rol: user.rol,
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
