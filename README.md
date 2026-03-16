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

Pasos mínimos para subir los cambios que ya modificaste al repositorio de GitHub:

Paso	Comando	Función
1	git status	Verifica los archivos modificados
2	git add .	Agrega los cambios al área de commit
3	git commit -m "arreglos css"	Guarda los cambios localmente
4	git push origin main	Sube los cambios a GitHub

Secuencia completa
git status
git add .
git commit -m "arreglos css"
git push origin main

Si ya tienes el proyecto en tu PC y solo quieres bajar las actualizaciones del repositorio de GitHub, el proceso es simple.

Pasos
Paso	Comando	Función
1	cd ruta/proyecto	Entrar a la carpeta del proyecto
2	git status	Verificar estado del repositorio
3	git pull origin main	Descargar y actualizar cambios desde GitHub
Secuencia completa
cd ruta/de/tu/proyecto
git status
git pull origin main

Si la rama del repositorio es master:

git pull origin master
Qué hace git pull

git pull realiza dos operaciones:

Operación	Descripción
fetch	Descarga cambios del repositorio remoto
merge	Los integra a tu proyecto local

# Base de datos que se necesita 
CREATE DATABASE novax;

# Configura tu proyecto para usar esta contraseña en .env o config.js:

DB_USER=postgres
DB_PASSWORD=Novax123
DB_NAME=novaxdb
DB_HOST=localhost
DB_PORT=5432