import { Router } from 'express';
import * as geoController from '../controllers/geolocationController';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Rutas públicas para registro
router.get('/departamentos', geoController.getDepartamentos);
router.get('/provincias/:departamentoId', geoController.getProvincias);
router.get('/zonas/:provinciaId', geoController.getZonas);

// Ruta administrativa
router.get('/admin', authenticate, requireRole('ADMINISTRADOR'), geoController.getAdminGeolocalizacion);

export default router;
