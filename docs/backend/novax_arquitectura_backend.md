Se desarrolla la **API Backend profesional (Node.js + Express + PostgreSQL)** alineada al modelo NOVAX, lista para escalar y conectar con frontend.

---

# 1. ARQUITECTURA DEL BACKEND

```plaintext id="xj2p4o"
backend/
│── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   ├── utils/
│   └── app.js
│
│── server.js
│── package.json
```

---

# 2. INSTALACIÓN

```bash
npm init -y
npm install express pg cors dotenv bcrypt jsonwebtoken
npm install nodemon --save-dev
```

---

# 3. CONFIGURACIÓN BASE

## 3.1 Conexión a PostgreSQL

```js id="c0drp8"
// src/config/db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "novax",
  password: "tu_password",
  port: 5432,
});

module.exports = pool;
```

---

## 3.2 App principal

```js id="k1m4rw"
// src/app.js
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// rutas
app.use("/api/clientes", require("./routes/clientes.routes"));
app.use("/api/productos", require("./routes/productos.routes"));
app.use("/api/pedidos", require("./routes/pedidos.routes"));

module.exports = app;
```

---

## 3.3 Server

```js id="dc0r5b"
// server.js
require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

---

# 4. MÓDULO CLIENTES

## 4.1 Rutas

```js id="g1p2ld"
// src/routes/clientes.routes.js
const router = require("express").Router();
const controller = require("../controllers/clientes.controller");

router.get("/", controller.getClientes);
router.post("/", controller.createCliente);
router.put("/:id", controller.updateCliente);

module.exports = router;
```

---

## 4.2 Controlador

```js id="z7h3vn"
// src/controllers/clientes.controller.js
const pool = require("../config/db");

exports.getClientes = async (req, res) => {
  const result = await pool.query("SELECT * FROM clientes ORDER BY id DESC");
  res.json(result.rows);
};

exports.createCliente = async (req, res) => {
  const { nombre, telefono, direccion, latitud, longitud } = req.body;

  const result = await pool.query(
    `INSERT INTO clientes(nombre, telefono, direccion, latitud, longitud)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [nombre, telefono, direccion, latitud, longitud],
  );

  res.json(result.rows[0]);
};

exports.updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono } = req.body;

  await pool.query(`UPDATE clientes SET nombre=$1, telefono=$2 WHERE id=$3`, [
    nombre,
    telefono,
    id,
  ]);

  res.json({ message: "Cliente actualizado" });
};
```

---

# 5. MÓDULO PRODUCTOS

## 5.1 Rutas

```js id="4dx6yt"
// src/routes/productos.routes.js
const router = require("express").Router();
const controller = require("../controllers/productos.controller");

router.get("/", controller.getProductos);
router.post("/", controller.createProducto);

module.exports = router;
```

---

## 5.2 Controlador

```js id="y8k2nf"
// src/controllers/productos.controller.js
const pool = require("../config/db");

exports.getProductos = async (req, res) => {
  const result = await pool.query("SELECT * FROM productos");
  res.json(result.rows);
};

exports.createProducto = async (req, res) => {
  const { nombre, precio, unidad } = req.body;

  const result = await pool.query(
    `INSERT INTO productos(nombre, precio, unidad)
     VALUES ($1,$2,$3) RETURNING *`,
    [nombre, precio, unidad],
  );

  res.json(result.rows[0]);
};
```

---

# 6. MÓDULO PEDIDOS (CRÍTICO)

## 6.1 Rutas

```js id="w2p9sc"
// src/routes/pedidos.routes.js
const router = require("express").Router();
const controller = require("../controllers/pedidos.controller");

router.post("/", controller.createPedido);
router.get("/", controller.getPedidos);

module.exports = router;
```

---

## 6.2 Controlador (TRANSACCIÓN COMPLETA)

```js id="l3m8qt"
// src/controllers/pedidos.controller.js
const pool = require("../config/db");

exports.createPedido = async (req, res) => {
  const client = await pool.connect();

  try {
    const { cliente_id, usuario_id, productos } = req.body;

    await client.query("BEGIN");

    const pedido = await client.query(
      `INSERT INTO pedidos(cliente_id, usuario_id)
       VALUES ($1,$2) RETURNING *`,
      [cliente_id, usuario_id],
    );

    let total = 0;

    for (let item of productos) {
      const prod = await client.query(
        "SELECT precio FROM productos WHERE id=$1",
        [item.producto_id],
      );

      const precio = prod.rows[0].precio;
      const subtotal = precio * item.cantidad;
      total += subtotal;

      await client.query(
        `INSERT INTO detalle_pedido
        (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
        VALUES ($1,$2,$3,$4,$5)`,
        [pedido.rows[0].id, item.producto_id, item.cantidad, precio, subtotal],
      );

      // movimiento inventario
      await client.query(
        `INSERT INTO inventario_movimientos(producto_id, tipo, cantidad, referencia)
         VALUES ($1,'salida',$2,$3)`,
        [item.producto_id, item.cantidad, `pedido_${pedido.rows[0].id}`],
      );
    }

    await client.query(`UPDATE pedidos SET total=$1 WHERE id=$2`, [
      total,
      pedido.rows[0].id,
    ]);

    await client.query("COMMIT");

    res.json({ message: "Pedido creado", pedido_id: pedido.rows[0].id });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

exports.getPedidos = async (req, res) => {
  const result = await pool.query(
    `SELECT p.*, c.nombre as cliente
     FROM pedidos p
     JOIN clientes c ON c.id = p.cliente_id
     ORDER BY p.id DESC`,
  );

  res.json(result.rows);
};
```

---

# 7. BUENAS PRÁCTICAS IMPLEMENTADAS

- Transacciones (BEGIN / COMMIT / ROLLBACK)
- Separación por módulos
- Uso de pool (rendimiento)
- Relaciones SQL limpias
- Preparado para autenticación futura

---

# 8. ENDPOINTS DISPONIBLES

| Método | Endpoint       | Descripción      |
| ------ | -------------- | ---------------- |
| GET    | /api/clientes  | Listar clientes  |
| POST   | /api/clientes  | Crear cliente    |
| GET    | /api/productos | Listar productos |
| POST   | /api/productos | Crear producto   |
| POST   | /api/pedidos   | Crear pedido     |
| GET    | /api/pedidos   | Listar pedidos   |

---

# 9. PRUEBA CON POSTMAN

## Crear pedido

```json id="u9z5xp"
POST /api/pedidos

{
  "cliente_id": 1,
  "usuario_id": 1,
  "productos": [
    { "producto_id": 1, "cantidad": 2 }
  ]
}
```

---

# 10. CONCLUSIÓN

Esta API ya permite:

```plaintext id="1z4x9h"
Operar ventas reales + controlar inventario automáticamente + escalar el sistema
```

---

# 11. SIGUIENTE PASO CRÍTICO

Para completar el sistema:

1. Autenticación (login + JWT)
2. Protección de rutas (roles)
3. Integración con frontend (Next.js)
4. Módulo distribución en API

Se implementa el **bloque completo profesional**: autenticación (JWT), control de roles, conexión con frontend y base del módulo de distribución.

---

# 1. AUTENTICACIÓN (LOGIN + JWT)

## 1.1 Tabla usuarios

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password TEXT,
  rol VARCHAR(20) DEFAULT 'vendedor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 1.2 Registro de usuario

```js
// src/controllers/auth.controller.js
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO usuarios(nombre,email,password,rol)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [nombre, email, hash, rol],
  );

  res.json(result.rows[0]);
};
```

---

## 1.3 Login

```js
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query("SELECT * FROM usuarios WHERE email=$1", [
    email,
  ]);

  if (result.rows.length === 0)
    return res.status(400).json({ error: "Usuario no encontrado" });

  const user = result.rows[0];

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(400).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign(
    { id: user.id, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: "8h" },
  );

  res.json({ token, user });
};
```

---

## 1.4 Rutas auth

```js
// src/routes/auth.routes.js
const router = require("express").Router();
const controller = require("../controllers/auth.controller");

router.post("/register", controller.register);
router.post("/login", controller.login);

module.exports = router;
```

---

# 2. MIDDLEWARE DE SEGURIDAD (ROLES)

## 2.1 Verificar token

```js
// src/middlewares/auth.js
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(403).json({ error: "No autorizado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
};
```

---

## 2.2 Control de roles

```js
exports.isAdmin = (req, res, next) => {
  if (req.user.rol !== "admin")
    return res.status(403).json({ error: "Acceso restringido" });

  next();
};
```

---

## 2.3 Aplicación en rutas

```js
const { verifyToken, isAdmin } = require("../middlewares/auth");

router.post("/", verifyToken, isAdmin, controller.createProducto);
```

---

# 3. INTEGRACIÓN CON FRONTEND (Next.js)

## 3.1 Cliente API

```js
// frontend/lib/api.js
const API = "http://localhost:4000/api";

export const api = async (endpoint, method = "GET", data = null) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: data ? JSON.stringify(data) : null,
  });

  return res.json();
};
```

---

## 3.2 Login desde frontend

```js
const login = async () => {
  const res = await api("/auth/login", "POST", {
    email,
    password,
  });

  localStorage.setItem("token", res.token);
};
```

---

## 3.3 Protección de rutas (ejemplo simple)

```js
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) router.push("/login");
}, []);
```

---

# 4. MÓDULO DISTRIBUCIÓN (BASE REAL)

Este módulo es clave para tu modelo (ventas + reparto).

---

## 4.1 Tabla rutas

```sql
CREATE TABLE rutas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  zona VARCHAR(100)
);
```

---

## 4.2 Tabla asignación pedidos

```sql
CREATE TABLE distribucion (
  id SERIAL PRIMARY KEY,
  pedido_id INT REFERENCES pedidos(id),
  repartidor_id INT REFERENCES usuarios(id),
  ruta_id INT REFERENCES rutas(id),
  estado VARCHAR(20) DEFAULT 'pendiente',
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4.3 Estados operativos

| Estado    | Significado         |
| --------- | ------------------- |
| pendiente | Aún no asignado     |
| asignado  | Ya tiene repartidor |
| en_ruta   | En entrega          |
| entregado | Completado          |
| cancelado | Anulado             |

---

## 4.4 Crear asignación

```js
// src/controllers/distribucion.controller.js
const pool = require("../config/db");

exports.asignarPedido = async (req, res) => {
  const { pedido_id, repartidor_id, ruta_id } = req.body;

  const result = await pool.query(
    `INSERT INTO distribucion(pedido_id,repartidor_id,ruta_id,estado)
     VALUES ($1,$2,$3,'asignado') RETURNING *`,
    [pedido_id, repartidor_id, ruta_id],
  );

  res.json(result.rows[0]);
};
```

---

## 4.5 Cambiar estado

```js
exports.cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  await pool.query(`UPDATE distribucion SET estado=$1 WHERE id=$2`, [
    estado,
    id,
  ]);

  res.json({ message: "Estado actualizado" });
};
```

---

# 5. RUTAS DISTRIBUCIÓN

```js
// src/routes/distribucion.routes.js
const router = require("express").Router();
const controller = require("../controllers/distribucion.controller");

router.post("/asignar", controller.asignarPedido);
router.put("/:id", controller.cambiarEstado);

module.exports = router;
```

---

# 6. INTEGRACIÓN FINAL EN app.js

```js
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/distribucion", require("./routes/distribucion.routes"));
```

---

# 7. FLUJO REAL DEL SISTEMA

```plaintext
1. Usuario inicia sesión → obtiene token
2. Vendedor crea pedido
3. Sistema descuenta inventario
4. Admin asigna pedido a repartidor
5. Repartidor cambia estado (en ruta → entregado)
```

---

# 8. NIVEL EMPRESARIAL (LO QUE YA TIENES)

| Área         | Estado         |
| ------------ | -------------- |
| Ventas       | Completo       |
| Inventario   | Automatizado   |
| Usuarios     | Con roles      |
| Seguridad    | JWT activo     |
| Distribución | Base funcional |

---

# 9. SUGERENCIAS (CLAVE PARA ESCALAR)

**Recomendación técnica:**

- Implementar logs de auditoría (quién hizo qué)
- Control de stock negativo (bloquear ventas sin inventario)
- Geolocalización en entregas (ya tienes lat/lng en clientes)

**Recomendación de negocio:**

- Separar:
  - ventas envasadas
  - ventas a granel

- Diferenciar precios por tipo de cliente (mayorista/minorista)

---
