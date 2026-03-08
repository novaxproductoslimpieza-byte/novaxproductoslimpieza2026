# Novax ERP — Sistema de Gestión

Sistema ERP (Enterprise Resource Planning) para **Novax Productos de Limpieza**, desarrollado con **Next.js** en el frontend y **Node.js/Express** en el backend.

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16 + React 19 + TypeScript + Tailwind CSS |
| Backend | Express + TypeScript |
| ORM / BD | Prisma + PostgreSQL |
| Auth | JWT + bcrypt |

## 📂 Estructura del Proyecto

```
PROYECTO NOVAX 1.0/
├── backend/        → API REST (Express + Prisma)
├── frontend/       → Aplicación web (Next.js)
├── database/       → Seeds y migrations
└── docs/           → Documentación técnica
```

## 🚀 Cómo iniciar el proyecto

### 1. Configurar la base de datos

```powershell
# Desde /backend
npm run db:push
npm run seed
```

### 2. Iniciar el Backend

```powershell
cd backend
npm run dev
# Servidor corriendo en http://localhost:4000
```

### 3. Iniciar el Frontend

```powershell
cd frontend
npm run dev
# App corriendo en http://localhost:3000
```

## 🔑 Credenciales de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| **Administrador** | admin@novax.com | admin1234 |
| **Cliente** | cliente@novax.com | cliente1234 |

## 📡 Endpoints de la API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Estado del servidor |
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/categories` | Lista de categorías |
| GET | `/api/products` | Catálogo de productos |
| GET | `/api/products/:id` | Detalle de producto |
| POST | `/api/orders` | Crear pedido *(auth)* |
| GET | `/api/orders` | Mis pedidos / todos *(auth)* |
| PUT | `/api/admin/orders/:id/status` | Actualizar estado *(admin)* |
| POST | `/api/admin/products` | Crear producto *(admin)* |
| PUT | `/api/admin/products/:id` | Editar producto *(admin)* |
| DELETE | `/api/admin/products/:id` | Eliminar producto *(admin)* |
| GET | `/api/users/profile` | Perfil del usuario *(auth)* |
| PUT | `/api/users/profile` | Actualizar perfil *(auth)* |
| GET | `/api/admin/clients` | Lista de clientes *(admin)* |

## 🗄️ Base de Datos

El esquema Prisma se encuentra en `backend/prisma/schema.prisma` e incluye:
- `Usuario` — Clientes y administradores
- `Categoria` / `Subcategoria` — Árbol de categorías
- `Producto` — Catálogo completo
- `Pedido` / `DetallePedido` — Órdenes de compra

## 📋 Estado de Desarrollo

- ✅ **Fase 1** — Infraestructura base
- ✅ **Fase 2** — Backend completo (API REST)
- ✅ **Fase 3** — Frontend cliente (Catálogo, Carrito, Pedidos, Perfil)
- ✅ **Fase 4** — Panel Admin (Dashboard, Productos, Pedidos, Categorías, Clientes)
- ⏳ **Fase 5** — Integración final y testing
- ⏳ **Fase 6** — Deploy a producción
