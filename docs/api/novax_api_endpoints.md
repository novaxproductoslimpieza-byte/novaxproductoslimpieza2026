# NOVAX ERP - API Endpoints Documentation

## Authenticación
- `POST /api/auth/login`: Iniciar sesión (JWT).
- `POST /api/auth/register`: Registro de clientes con geolocalización.
- `GET /api/auth/me`: Obtener datos del usuario actual.

## Geolocalización
- `GET /api/geolocation/departamentos`: Lista de los 9 departamentos de Bolivia.
- `GET /api/geolocation/provincias/:depId`: Provincias de un departamento específico.
- `GET /api/geolocation/zonas/:provId`: Zonas principales de una provincia.

## Usuarios y Perfil
- `GET /api/users/profile`: Obtener datos completos del perfil (incluye coords y zona).
- `PUT /api/users/profile`: Actualizar perfil, dirección y coordenadas en mapa.
- `GET /api/users/admin/clients`: (ADMIN) Lista completa de clientes con estado.
- `GET /api/users/admin/map`: (ADMIN) Datos de geolocalización de todos los clientes para el heatmap.

## Productos y Catálogo
- `GET /api/catalog/categories`: Lista de categorías.
- `GET /api/catalog/products`: Productos con filtros por búsqueda y categoría.

## Pedidos
- `POST /api/orders`: Crear nuevo pedido (Requiere auth).
- `GET /api/orders`: Historial de pedidos del cliente.
- `DELETE /api/orders/:id`: Eliminar pedido y restaurar stock (Reemplaza cancelación).
