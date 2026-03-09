import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getDepartamentos = async (req: Request, res: Response) => {
  try {
    const departamentos = await prisma.departamento.findMany({
      orderBy: { nombre: 'asc' }
    });
    res.json(departamentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener departamentos' });
  }
};

export const getProvincias = async (req: Request, res: Response) => {
  try {
    const { departamentoId } = req.params;
    const provincias = await prisma.provincia.findMany({
      where: { departamento_id: Number(departamentoId) },
      orderBy: { nombre: 'asc' }
    });
    res.json(provincias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener provincias' });
  }
};

export const getZonas = async (req: Request, res: Response) => {
  try {
    const { provinciaId } = req.params;
    const zonas = await prisma.zona.findMany({
      where: { provincia_id: Number(provinciaId) },
      orderBy: { nombre: 'asc' }
    });
    res.json(zonas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener zonas' });
  }
};

export const getAdminGeolocalizacion = async (req: Request, res: Response) => {
  try {
    // Obtener usuarios que son clientes y tienen coordenadas
    const usuarios = await prisma.usuario.findMany({
      where: {
        rol: 'CLIENTE',
        latitud: { not: null },
        longitud: { not: null }
      },
      include: {
        zona: true,
        pedidos: {
          orderBy: { fecha: 'desc' },
          take: 1
        }
      }
    });

    const data = usuarios.map(u => {
      const ultimoPedido = u.pedidos[0];
      let prioridad = 'Stand By';
      
      if (ultimoPedido) {
        if (['PENDIENTE', 'APROBADO', 'EN_DESPACHO'].includes(ultimoPedido.estado)) {
          prioridad = 'Pedido';
        } else if (ultimoPedido.estado === 'ENTREGADO') {
          prioridad = 'Entregado';
        }
      }

      return {
        id: u.id,
        nombre: u.nombre,
        telefono: u.telefono,
        direccion: u.direccion,
        latitud: u.latitud,
        longitud: u.longitud,
        zona: u.zona?.nombre,
        prioridad,
        ultimoEstado: ultimoPedido?.estado || null
      };
    });

    res.json(data);
  } catch (error) {
    console.error('Error in getAdminGeolocalizacion:', error);
    res.status(500).json({ error: 'Error al obtener geolocalización de clientes' });
  }
};
