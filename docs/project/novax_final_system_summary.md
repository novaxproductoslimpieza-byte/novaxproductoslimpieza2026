# NOVAX ERP - Resumen Final del Sistema (FASE 3: Validación Pre-Código)

Este documento centraliza y confirma las especificaciones y decisiones tecnológicas de NOVAX tras el análisis de la documentación original y las respuestas del cuestionario técnico (QA). Sirve como el plano definitivo previo a la generación de código.

## 1. Arquitectura General y Tecnologías Elegidas
- **Frontend:** Next.js utilizando el `App Router` (directorio `app/`). Estilos manejados con **TailwindCSS** bajo una filosofía Mobile-First (prioridad móvil y tablet).
- **Backend:** Node.js con **Express.js**, desarrollando una API RESTful ligera y flexible.
- **Base de Datos:** PostgreSQL, gestionada e interactuada mediante el ORM **Prisma**.
- **Despliegue y Escalabilidad:** Despliegue inicial en VPS. Se preparará la arquitectura para integrar Redis (caching de catálogo) y almacenamiento en la nube para imágenes (AWS S3 / Cloudinary).

## 2. Base de Datos y Entidades
La estructura de entidades (`usuarios`, `categorias`, `subcategorias`, `productos`, `pedidos`, `detalle_pedido`) se mantiene intacta según lo definido en `/docs/database`. Prisma será el encargado de mapear esto fielmente y garantizar la integridad referencial.
- **Detalle de Proveedores:** Se añade la consideración de que los proveedores están relacionados con los productos para gestionar la entrada de stock.

## 3. Contratos de API y Lógica de Negocio (Reglas Clave)
- **Autenticación (Login):** Permite el inicio de sesión cruzado (CI o correo electrónico). Implementado vía JWT.
- **Catálogo de Precios (Mayoreo/Menudeo):** La API determinará el precio a cobrar basado en el **volumen**: Si la cantidad solicitada es ≥ 50, se cobra `precio_mayorista`; si es < 50, se cobra `precio_minorista`.
- **Lógica de Inventario (Stock):**
  - El stock se descuenta *únicamente* cuando el Administrador cambia el estado del pedido a **"aprobado"**.
  - Si un pedido aprobado es devuelto, o un pedido pendiente es **cancelado** por el cliente, se gestiona el flujo inverso (reposición, de aplicar).
- **Notificaciones (Flujo de Pedidos):** Al aprobar un pedido, el sistema dispara notificaciones (correo/push).

## 4. Seguridad, Autenticación y UX
- **Roles:** `admin` y `user` (manejados vía JWT).
- **Rate Limiting:** Todas las rutas sensibles (login, pedidos, operaciones CRUD críticas) tendrán un límite de 100 solicitudes por minuto por IP.
- **Experiencia de Usuario:** Visitantes (`guest`) pueden ver el catálogo pero no ver los precios. Solo usuarios autenticados tienen acceso a precios y capacidad de ordenar.

## 5. Estructura de Proyecto
Se mantiene la estructura estricta solicitada:
```
NOVAX/
├── docs/             # (Documentación oficial - Single Source of Truth)
├── backend/          # (Express + Prisma)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/   # (Esquemas de Prisma)
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── utils/
├── frontend/         # (Next.js App Router + Tailwind)
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── services/
│   │   └── utils/
├── database/         # (Migraciones y Seeds de Prisma)
├── scripts/
├── tests/
├── config/
└── logs/
```

## 6. Resolución de Inconsistencias
**Estado de Validación:** LUZ VERDE.
Toda la documentación faltante (archivos vacíos como `novax_workflows.md`) se ha estipulado como material a completar en fases posteriores y **no bloquea** el desarrollo inicial. Las ambigüedades respecto a precios, framework, router y ORM han sido resueltas en su totalidad.

El sistema es consistente. El proyecto NOVAX está listo para su generación en código.
