# NOVAX ERP - Complete Database Schema

## Table: usuarios
- `id` (Primary Key, UUID/Integer)
- `nombre` (String)
- `ci` (String, Unique) - Carnet de Identidad
- `telefono` (String)
- `direccion` (Text)
- `correo` (String, Unique)
- `password` (String, Hashed)
- `rol` (Enum: 'CLIENTE', 'ADMINISTRADOR')
- `latitud` (Float) - Coordenada para entrega
- `longitud` (Float) - Coordenada para entrega
- `zona_id` (Foreign Key -> zonas.id)
- `direccion` (Text) - Dirección descriptiva vinculada a mapa

## Table: departamentos (NEW)
- `id` (Primary Key, Integer)
- `nombre` (String, Unique) - Ej: 'Cochabamba'

## Table: provincias (NEW)
- `id` (Primary Key, Integer)
- `departamento_id` (Foreign Key -> departamentos.id)
- `nombre` (String)

## Table: zonas (NEW)
- `id` (Primary Key, Integer)
- `provincia_id` (Foreign Key -> provincias.id)
- `nombre` (String)

## Table: categorias
- `id` (Primary Key, Integer)
- `nombre` (String)
- `descripcion` (Text)

## Table: subcategorias
- `id` (Primary Key, Integer)
- `categoria_id` (Foreign Key -> categorias.id)
- `nombre` (String)
- `descripcion` (Text)

## Table: productos
- `id` (Primary Key, Integer)
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
- `id` (Primary Key, Integer)
- `cliente_id` (Foreign Key -> usuarios.id)
- `fecha` (Timestamp/Date)
- `estado` (Enum: 'PENDIENTE', 'APROBADO', 'EN_DESPACHO', 'ENTREGADO')
- *Nota: El estado CANCELADO ha sido eliminado. Los pedidos se eliminan físicamente para liberar stock.*

## Table: detalle_pedido
- `id` (Primary Key, UUID/Integer)
- `pedido_id` (Foreign Key -> pedidos.id)
- `producto_id` (Foreign Key -> productos.id)
- `cantidad` (Integer)
- `precio` (Decimal)
