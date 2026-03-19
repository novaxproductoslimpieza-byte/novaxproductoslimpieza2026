Se desarrolla el **Módulo 3: Dashboard Gerencial (ventas, rutas, utilidades)** orientado a toma de decisiones reales.

---

# 1. OBJETIVO DEL DASHBOARD

Controlar en tiempo real:

```plaintext
Ventas + Rentabilidad + Distribución + Rendimiento operativo
```

---

# 2. KPIs CLAVE (LO QUE DEBE VER GERENCIA)

| Área         | Indicador          | Fórmula                   | Uso                  |
| ------------ | ------------------ | ------------------------- | -------------------- |
| Ventas       | Total ventas       | SUM(pedidos.total)        | Flujo de ingresos    |
| Ventas       | Ticket promedio    | total / cantidad pedidos  | Eficiencia comercial |
| Inventario   | Rotación           | ventas / stock            | Control producción   |
| Distribución | Pedidos entregados | COUNT(estado='entregado') | Eficiencia logística |
| Distribución | Tiempo entrega     | fin - inicio              | Rendimiento          |
| Finanzas     | Utilidad           | ventas - costos           | Rentabilidad real    |

---

# 3. BACKEND – ENDPOINTS ANALÍTICOS

## 3.1 Ventas generales

```js
// src/controllers/dashboard.controller.js
const pool = require("../config/db");

exports.getVentas = async (req, res) => {
  const result = await pool.query(`
    SELECT 
      COUNT(*) as pedidos,
      SUM(total) as total_ventas,
      AVG(total) as ticket_promedio
    FROM pedidos
  `);

  res.json(result.rows[0]);
};
```

---

## 3.2 Ventas por día

```js
exports.ventasPorDia = async (req, res) => {
  const result = await pool.query(`
    SELECT 
      DATE(created_at) as fecha,
      SUM(total) as total
    FROM pedidos
    GROUP BY fecha
    ORDER BY fecha
  `);

  res.json(result.rows);
};
```

---

## 3.3 Productos más vendidos

```js
exports.productosTop = async (req, res) => {
  const result = await pool.query(`
    SELECT p.nombre, SUM(d.cantidad) as total
    FROM detalle_pedido d
    JOIN productos p ON p.id = d.producto_id
    GROUP BY p.nombre
    ORDER BY total DESC
    LIMIT 5
  `);

  res.json(result.rows);
};
```

---

## 3.4 Estado de distribución

```js
exports.estadoDistribucion = async (req, res) => {
  const result = await pool.query(`
    SELECT estado, COUNT(*) as total
    FROM distribucion
    GROUP BY estado
  `);

  res.json(result.rows);
};
```

---

## 3.5 Utilidad (base)

**Nota técnica:** aquí aún no tienes costos reales → se usa estimación.

```js
exports.utilidad = async (req, res) => {
  const result = await pool.query(`
    SELECT 
      SUM(total) as ventas,
      SUM(total) * 0.30 as utilidad_estimada
    FROM pedidos
  `);

  res.json(result.rows[0]);
};
```

---

# 4. RUTAS DASHBOARD

```js
// src/routes/dashboard.routes.js
const router = require("express").Router();
const c = require("../controllers/dashboard.controller");

router.get("/ventas", c.getVentas);
router.get("/ventas-dia", c.ventasPorDia);
router.get("/productos-top", c.productosTop);
router.get("/distribucion", c.estadoDistribucion);
router.get("/utilidad", c.utilidad);

module.exports = router;
```

---

# 5. INTEGRACIÓN FRONTEND (Next.js)

## 5.1 Librería recomendada

| Opción      | Librería |
| ----------- | -------- |
| Recomendada | Recharts |
| Alternativa | Chart.js |

---

## 5.2 Dashboard base

```js
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Dashboard() {
  const [ventas, setVentas] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setVentas(await api("/dashboard/ventas"));
    setData(await api("/dashboard/ventas-dia"));
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <div>
        <p>Total ventas: {ventas.total_ventas}</p>
        <p>Pedidos: {ventas.pedidos}</p>
        <p>Ticket promedio: {ventas.ticket_promedio}</p>
      </div>
    </div>
  );
}
```

---

# 6. GRÁFICO DE VENTAS

```js
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

<LineChart width={600} height={300} data={data}>
  <XAxis dataKey="fecha" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="total" />
</LineChart>;
```

---

# 7. GRÁFICO DISTRIBUCIÓN

```js
import { PieChart, Pie } from "recharts";

<PieChart width={400} height={400}>
  <Pie data={distribucion} dataKey="total" nameKey="estado" />
</PieChart>;
```

---

# 8. ESTRUCTURA VISUAL RECOMENDADA

```plaintext
[ KPIs ]
Ventas | Pedidos | Ticket | Utilidad

[ Gráficos ]
Ventas por día
Productos top

[ Logística ]
Estado de pedidos
Rutas activas
```

---

# 9. NIVEL EMPRESARIAL (LO IMPORTANTE)

Este dashboard te permite:

| Decisión            | Basado en            |
| ------------------- | -------------------- |
| Subir precios       | Ticket promedio      |
| Aumentar producción | Rotación             |
| Mejorar rutas       | Estados distribución |
| Reducir costos      | Utilidad             |

---

# 10. SUGERENCIAS CRÍTICAS (EXPERTO)

**Importante — esto define tu rentabilidad real:**

### 1. Implementar costos reales

- Materia prima
- Mano de obra
- Transporte

### 2. Separar ventas

- Mayorista vs minorista
- Envasado vs granel

### 3. Medir eficiencia de reparto

- Tiempo por entrega
- Pedidos por ruta

---
