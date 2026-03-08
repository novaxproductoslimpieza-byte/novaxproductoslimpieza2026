# NOVAX ERP - Complete Database Schema

## Table: usuarios
- `id` (Primary Key, UUID/Integer)
- `nombre` (String)
- `ci` (String, Unique) - Carnet de Identidad
- `telefono` (String)
- `direccion` (Text)
- `correo` (String, Unique)
- `password` (String, Hashed)
- `rol` (Enum: 'cliente', 'administrador')

## Table: categorias
- `id` (Primary Key, UUID/Integer)
- `nombre` (String)
- `descripcion` (Text)

## Table: subcategorias
- `id` (Primary Key, UUID/Integer)
- `categoria_id` (Foreign Key -> categorias.id)
- `nombre` (String)
- `descripcion` (Text)

## Table: productos
- `id` (Primary Key, UUID/Integer)
- `nombre` (String)
- `subcategoria_id` (Foreign Key -> subcategorias.id)
- `descripcion` (Text)
- `precio_minorista` (Decimal)
- `precio_mayorista` (Decimal)
- `presentacion` (String)
- `olor` (String)
- `color` (String)
- `imagen` (String, URL/Path)
- `stock` (Integer)

## Table: pedidos
- `id` (Primary Key, UUID/Integer)
- `cliente_id` (Foreign Key -> usuarios.id)
- `fecha` (Timestamp/Date)
- `estado` (Enum: 'pendiente', 'aprobado', 'en despacho', 'entregado')

## Table: detalle_pedido
- `id` (Primary Key, UUID/Integer)
- `pedido_id` (Foreign Key -> pedidos.id)
- `producto_id` (Foreign Key -> productos.id)
- `cantidad` (Integer)
- `precio` (Decimal)
