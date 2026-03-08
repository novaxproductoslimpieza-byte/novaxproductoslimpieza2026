# 📦 NOVAX ERP — Estado del Proyecto

> **Fecha de reporte:** 2026-03-08  
> **Repositorio:** [novaxproductoslimpieza2026](https://github.com/novaxproductoslimpieza-byte/novaxproductoslimpieza2026)

---

## 🧾 ¿De qué se trata el proyecto?

**Novax ERP** es un sistema de gestión empresarial (ERP) orientado a una empresa de **productos de limpieza**. Su objetivo es digitalizar y centralizar las operaciones comerciales, incluyendo:

- Catálogo de productos con categorías y subcategorías.
- Gestión de pedidos con flujo de estados (Pendiente → Aprobado → En Despacho → Entregado).
- Control de inventario y stock.
- Registro y autenticación de clientes y administradores.
- Panel de administración para gestión interna.

El sistema tiene dos tipos de usuario:
- **Cliente:** puede navegar el catálogo, hacer pedidos y hacer seguimiento de los mismos.
- **Administrador:** tiene acceso total al panel de gestión de productos, inventario, categorías, pedidos y clientes.

---

## 🏗️ Arquitectura del Sistema

| Capa | Tecnología |
|---|---|
| **Frontend** | Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 |
| **Backend** | Node.js + Express + TypeScript |
| **ORM / DB** | Prisma ORM (PostgreSQL / compatible) |
| **Autenticación** | JWT (JSON Web Tokens) + bcrypt |
| **Estructura** | Monorepo con carpetas `frontend/` y `backend/` separadas |

---

## 📂 Estructura de Carpetas (raíz del proyecto)

```
PROYECTO NOVAX 1.0/
├── backend/          ← API REST (Express + Prisma)
├── frontend/         ← App web (Next.js)
├── database/         ← Migrations, seeds, scripts SQL
├── docs/             ← Documentación técnica
├── config/           ← Configuraciones globales
├── scripts/          ← Scripts auxiliares
├── tests/            ← Pruebas
└── logs/             ← Logs del sistema
```

---

## 🗄️ Base de Datos — Tablas Definidas

| Tabla | Descripción |
|---|---|
| `usuarios` | Clientes y administradores. Campos: nombre, CI, teléfono, dirección, correo, password (hasheada), rol. |
| `categorias` | Categorías principales de productos. |
| `subcategorias` | Subcategorías ligadas a una categoría. |
| `productos` | Ficha completa del producto: precio minorista/mayorista, presentación, olor, color, stock, imagen. |
| `pedidos` | Pedidos por cliente con fecha y estado. |
| `detalle_pedido` | Líneas de pedido: producto, cantidad, precio unitario. |

---

## 🔧 Módulos del Sistema

### Frontend — Interfaz de Cliente
- [x] Módulo de Catálogo (navegación, filtros, búsqueda)
- [x] Módulo de Carrito de Compras
- [x] Módulo de Autenticación (registro, login, perfil)
- [x] Módulo de Seguimiento de Pedidos

### Frontend — Panel Admin
- [x] Gestión de Productos (CRUD + imágenes)
- [x] Gestión de Inventario
- [x] Gestión de Categorías
- [x] Gestión de Pedidos (actualización de estados)
- [x] Gestión de Clientes

### Backend — API
- [x] `authController.ts` — Autenticación y JWT
- [x] `productController.ts` — CRUD de productos
- [x] `orderController.ts` — Manejo de pedidos y stock
- [x] `categoryController.ts` — Categorías
- [x] Rutas: `authRoutes.ts`, `index.ts`
- [x] Schema Prisma completo (`schema.prisma`)

---

## 📊 Punto de Desarrollo Actual

### ✅ Completado
- Estructura de carpetas del proyecto (backend + frontend + database + docs).
- Inicialización del backend: `package.json`, `tsconfig.json`, servidor Express (`server.ts`, `app.ts`).
- Dependencias instaladas: `express`, `prisma`, `@prisma/client`, `bcrypt`, `jsonwebtoken`, `cors`, `dotenv`.
- Controladores backend creados: autenticación, productos, pedidos, categorías.
- Rutas básicas definidas.
- Schema de Prisma (`schema.prisma`) con todas las tablas del sistema.
- Inicialización del frontend con **Next.js 16 + React 19 + Tailwind CSS v4**.
- Página principal (`page.tsx`) y layout base (`layout.tsx`) generados.
- Variables de entorno base configuradas (`.env` en backend, `.env.local` en frontend).

### 🔄 En Progreso / Pendiente
- Implementación real de los controladores (lógica de negocio completa).
- Rutas de productos, pedidos y categorías en el backend.
- Pantallas/páginas del frontend (catálogo, carrito, login, panel admin, etc.).
- Integración frontend ↔ backend (llamadas API desde Next.js).
- Configuración de base de datos real y ejecución de `prisma db push` / migraciones.
- Seeds de datos iniciales.
- Modelo de permisos (`novax_permissions_model.md` aún vacío).
- Documento de arquitectura del sistema (`novax_system_architecture.md` aún vacío).
- Middleware de autenticación JWT (verificación de token para rutas protegidas).
- Panel de administración (ninguna página creada aún).
- Tests automatizados.
- Deploy / configuración de producción.

---

## 🚦 Estado General

```
Fase actual: ESQUELETO FUNCIONAL INICIALIZADO
Progreso estimado: ~20% del proyecto total

[████░░░░░░░░░░░░░░░░] 20%
```

El proyecto cuenta con su **arquitectura base definida y el esqueleto de código generado**, pero la **lógica de negocio, las pantallas del frontend y la integración completa** están pendientes de implementación.
