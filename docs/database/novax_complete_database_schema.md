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
- _Nota: El estado CANCELADO ha sido eliminado. Los pedidos se eliminan físicamente para liberar stock._

## Table: detalle_pedido

- `id` (Primary Key, UUID/Integer)
- `pedido_id` (Foreign Key -> pedidos.id)
- `producto_id` (Foreign Key -> productos.id)
- `cantidad` (Integer)
- `precio` (Decimal)

a continuacion segunda fase de estudio de bases de datos

Se desarrolla el **Diseño de Base de Datos Profesional** alineado a todo el sistema NOVAX (ventas, clientes, inventario, distribución), preparado para escalar a futuro.

---

# 1. PRINCIPIOS DE DISEÑO

- Normalización (evitar duplicidad)
- Integridad referencial
- Escalabilidad (multi-producto, distribución, producción futura)
- Alto rendimiento (índices y relaciones claras)

---

# 2. MODELO GENERAL (VISIÓN GLOBAL)

```plaintext
Usuarios
Clientes → Pedidos → DetallePedido → Productos
                 ↓
             Inventario (Movimientos)
                 ↓
             Distribución
```

---

# 3. TABLAS PRINCIPALES

---

## 3.1 USUARIOS

| Campo      | Tipo      | Descripción      |
| ---------- | --------- | ---------------- |
| id         | INT PK    | Identificador    |
| nombre     | VARCHAR   | Nombre           |
| email      | VARCHAR   | Login            |
| password   | VARCHAR   | Seguridad        |
| rol        | ENUM      | admin / vendedor |
| activo     | BOOLEAN   | Estado           |
| created_at | TIMESTAMP | Registro         |

---

## 3.2 CLIENTES

| Campo      | Tipo      | Descripción     |
| ---------- | --------- | --------------- |
| id         | INT PK    | Identificador   |
| nombre     | VARCHAR   | Cliente         |
| telefono   | VARCHAR   | Contacto        |
| direccion  | TEXT      | Dirección       |
| latitud    | DECIMAL   | Geolocalización |
| longitud   | DECIMAL   | Geolocalización |
| activo     | BOOLEAN   | Estado          |
| created_at | TIMESTAMP | Registro        |

---

## 3.3 PRODUCTOS

| Campo        | Tipo      | Descripción   |
| ------------ | --------- | ------------- |
| id           | INT PK    | Identificador |
| nombre       | VARCHAR   | Producto      |
| descripcion  | TEXT      | Detalle       |
| precio       | DECIMAL   | Precio        |
| unidad       | VARCHAR   | Litros, galón |
| stock_actual | DECIMAL   | Stock         |
| stock_minimo | DECIMAL   | Alerta        |
| activo       | BOOLEAN   | Estado        |
| created_at   | TIMESTAMP | Registro      |

---

## 3.4 PEDIDOS

| Campo      | Tipo      | Descripción                       |
| ---------- | --------- | --------------------------------- |
| id         | INT PK    | Identificador                     |
| cliente_id | INT FK    | Relación cliente                  |
| usuario_id | INT FK    | Vendedor                          |
| estado     | ENUM      | pendiente / entregado / cancelado |
| total      | DECIMAL   | Monto                             |
| fecha      | TIMESTAMP | Registro                          |

---

## 3.5 DETALLE_PEDIDO

| Campo           | Tipo    | Descripción   |
| --------------- | ------- | ------------- |
| id              | INT PK  | Identificador |
| pedido_id       | INT FK  | Pedido        |
| producto_id     | INT FK  | Producto      |
| cantidad        | DECIMAL | Cantidad      |
| precio_unitario | DECIMAL | Precio        |
| subtotal        | DECIMAL | Total línea   |

---

## 3.6 INVENTARIO_MOVIMIENTOS

(Control real del sistema)

| Campo       | Tipo      | Descripción               |
| ----------- | --------- | ------------------------- |
| id          | INT PK    | Identificador             |
| producto_id | INT FK    | Producto                  |
| tipo        | ENUM      | entrada / salida / ajuste |
| cantidad    | DECIMAL   | Movimiento                |
| referencia  | VARCHAR   | Pedido u otro             |
| fecha       | TIMESTAMP | Registro                  |

---

## 3.7 DISTRIBUCIÓN

| Campo         | Tipo      | Descripción                     |
| ------------- | --------- | ------------------------------- |
| id            | INT PK    | Identificador                   |
| pedido_id     | INT FK    | Pedido                          |
| usuario_id    | INT FK    | Repartidor                      |
| estado        | ENUM      | pendiente / en_ruta / entregado |
| fecha_entrega | TIMESTAMP | Entrega                         |

---

## 3.8 CONFIGURACIÓN

| Campo       | Tipo    | Descripción   |
| ----------- | ------- | ------------- |
| id          | INT PK  | Identificador |
| clave       | VARCHAR | Nombre        |
| valor       | TEXT    | Valor         |
| descripcion | TEXT    | Uso           |

---

# 4. RELACIONES CLAVE

| Relación              | Tipo |
| --------------------- | ---- |
| Cliente → Pedidos     | 1:N  |
| Pedido → Detalle      | 1:N  |
| Producto → Detalle    | 1:N  |
| Producto → Inventario | 1:N  |
| Pedido → Distribución | 1:1  |

---

# 5. ÍNDICES RECOMENDADOS

| Tabla      | Campo       |
| ---------- | ----------- |
| pedidos    | fecha       |
| pedidos    | cliente_id  |
| productos  | nombre      |
| clientes   | nombre      |
| inventario | producto_id |

---

# 6. REGLAS DE NEGOCIO (EN BD)

- No permitir stock negativo
- No eliminar pedidos entregados
- Integridad en relaciones (FK obligatorias)
- Movimientos obligatorios en inventario

---

# 7. ESCALABILIDAD (PREPARADO A FUTURO)

## Ya soporta:

- Multi-producto
- Distribución
- Geolocalización

## Preparado para:

| Futuro         | Preparación                |
| -------------- | -------------------------- |
| Producción     | tabla de lotes (pendiente) |
| Proveedores    | nueva tabla                |
| Mayoristas     | precios por cliente        |
| Multi-sucursal | campo sucursal_id          |

---

# 8. FLUJO DE DATOS REAL

```plaintext
Pedido creado
   ↓
Detalle pedido
   ↓
Descuento inventario (movimiento)
   ↓
Asignación distribución
   ↓
Entrega
```

---

# 9. ERRORES QUE DEBES EVITAR

| Error                | Consecuencia      |
| -------------------- | ----------------- |
| Guardar stock manual | Inconsistencia    |
| No usar movimientos  | Sin auditoría     |
| Eliminar datos       | Pérdida histórica |
| No usar FK           | Datos corruptos   |

---

# 10. CONCLUSIÓN

Este diseño permite:

```plaintext
Control total + trazabilidad + crecimiento sin rediseño
```

Es una base sólida para:

- Operación diaria
- Control empresarial
- Escalabilidad real

---

# 11. SIGUIENTE PASO

Recomendación directa:

1. Crear **script SQL completo listo para implementar**

Se presenta el **script SQL completo listo para implementación** del sistema NOVAX, optimizado para **PostgreSQL** (recomendado por robustez).

---

# 1. CREACIÓN DE BASE DE DATOS

```sql
CREATE DATABASE novax;
```

---

# 2. USAR BASE DE DATOS

```sql
\c novax;
```

---

# 3. TABLAS PRINCIPALES

---

## 3.1 USUARIOS

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('admin','vendedor')) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3.2 CLIENTES

```sql
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3.3 PRODUCTOS

```sql
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    unidad VARCHAR(50),
    stock_actual DECIMAL(10,2) DEFAULT 0,
    stock_minimo DECIMAL(10,2) DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3.4 PEDIDOS

```sql
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL,
    usuario_id INT NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('pendiente','entregado','cancelado')) DEFAULT 'pendiente',
    total DECIMAL(10,2) DEFAULT 0,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cliente
        FOREIGN KEY(cliente_id) REFERENCES clientes(id),

    CONSTRAINT fk_usuario
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);
```

---

## 3.5 DETALLE_PEDIDO

```sql
CREATE TABLE detalle_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_pedido
        FOREIGN KEY(pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,

    CONSTRAINT fk_producto
        FOREIGN KEY(producto_id) REFERENCES productos(id)
);
```

---

## 3.6 INVENTARIO_MOVIMIENTOS

```sql
CREATE TABLE inventario_movimientos (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('entrada','salida','ajuste')) NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    referencia VARCHAR(100),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_producto_mov
        FOREIGN KEY(producto_id) REFERENCES productos(id)
);
```

---

## 3.7 DISTRIBUCION

```sql
CREATE TABLE distribucion (
    id SERIAL PRIMARY KEY,
    pedido_id INT UNIQUE,
    usuario_id INT,
    estado VARCHAR(20) CHECK (estado IN ('pendiente','en_ruta','entregado')) DEFAULT 'pendiente',
    fecha_entrega TIMESTAMP,

    CONSTRAINT fk_pedido_dist
        FOREIGN KEY(pedido_id) REFERENCES pedidos(id),

    CONSTRAINT fk_usuario_dist
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);
```

---

## 3.8 CONFIGURACION

```sql
CREATE TABLE configuracion (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descripcion TEXT
);
```

---

# 4. ÍNDICES (RENDIMIENTO)

```sql
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_clientes_nombre ON clientes(nombre);
CREATE INDEX idx_inventario_producto ON inventario_movimientos(producto_id);
```

---

# 5. TRIGGER PARA CONTROL DE STOCK

## 5.1 FUNCIÓN

```sql
CREATE OR REPLACE FUNCTION actualizar_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tipo = 'entrada' THEN
        UPDATE productos
        SET stock_actual = stock_actual + NEW.cantidad
        WHERE id = NEW.producto_id;

    ELSIF NEW.tipo = 'salida' THEN
        UPDATE productos
        SET stock_actual = stock_actual - NEW.cantidad
        WHERE id = NEW.producto_id;

    ELSIF NEW.tipo = 'ajuste' THEN
        UPDATE productos
        SET stock_actual = NEW.cantidad
        WHERE id = NEW.producto_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 5.2 TRIGGER

```sql
CREATE TRIGGER trigger_actualizar_stock
AFTER INSERT ON inventario_movimientos
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock();
```

---

# 6. VALIDACIÓN: NO PERMITIR STOCK NEGATIVO

```sql
ALTER TABLE productos
ADD CONSTRAINT chk_stock_no_negativo CHECK (stock_actual >= 0);
```

---

# 7. DATOS INICIALES (OPCIONAL)

```sql
INSERT INTO usuarios (nombre, email, password, rol)
VALUES ('Admin', 'admin@novax.com', '123456', 'admin');
```

---

# 8. PRUEBA BÁSICA

```sql
-- Crear producto
INSERT INTO productos (nombre, precio, unidad, stock_actual)
VALUES ('Detergente 1L', 10, 'litro', 100);

-- Registrar salida (venta)
INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, referencia)
VALUES (1, 'salida', 5, 'pedido_1');

-- Ver stock actualizado
SELECT * FROM productos;
```

---

# 9. CONCLUSIÓN

Este script te deja listo con:

```plaintext
Base de datos funcional + control automático de stock + estructura escalable
```

---
