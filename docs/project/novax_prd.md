# 📋 Product Requirements Document (PRD)
# NOVAX ERP — Sistema de Gestión para Empresa de Productos de Limpieza

---

| Campo | Detalle |
|---|---|
| **Versión** | 1.0 |
| **Fecha** | 2026-03-08 |
| **Estado** | En desarrollo |
| **Owner del Producto** | Novax Productos de Limpieza |
| **Repositorio** | [novaxproductoslimpieza2026](https://github.com/novaxproductoslimpieza-byte/novaxproductoslimpieza2026) |

---

## 1. Resumen Ejecutivo

**Novax ERP** es una plataforma web integral diseñada para digitalizar y automatizar las operaciones comerciales de una empresa de productos de limpieza. El sistema permite a los clientes explorar el catálogo de productos, realizar pedidos en línea y hacer seguimiento de sus entregas, mientras que los administradores disponen de un panel centralizado para gestionar productos, inventario, pedidos y clientes.

El objetivo principal es reemplazar procesos manuales (teléfono, WhatsApp, hojas de cálculo) por un flujo digital robusto, trazable y escalable.

---

## 2. Problema a Resolver

### 2.1 Contexto del Negocio
La empresa actualmente gestiona sus ventas y pedidos mediante canales informales, lo que genera:
- Pérdida de pedidos por falta de registro centralizado.
- Dificultad para controlar el stock en tiempo real.
- Imposibilidad de ofrecer precios diferenciados (minorista / mayorista) de forma sistemática.
- Ausencia de trazabilidad del ciclo de vida de un pedido.

### 2.2 Usuarios Afectados
- **Clientes:** No tienen visibilidad del catálogo actualizado ni del estado de sus pedidos.
- **Administradores:** Gestionan inventario y pedidos de forma manual, con alta probabilidad de error.

---

## 3. Objetivos del Producto

| # | Objetivo | Métrica de Éxito |
|---|---|---|
| 1 | Digitalizar el catálogo de productos | 100% del catálogo disponible online |
| 2 | Automatizar el flujo de pedidos | 0 pedidos perdidos por falta de registro |
| 3 | Control de stock en tiempo real | Stock actualizado automáticamente tras cada pedido |
| 4 | Diferenciación de precios | Precio minorista y mayorista visible según contexto |
| 5 | Panel de administración funcional | Tiempo de gestión de un pedido < 2 minutos |

---

## 4. Usuarios y Roles

### 4.1 Cliente (`rol: cliente`)
Usuario final que compra productos. Puede:
- Registrarse e iniciar sesión.
- Navegar el catálogo (productos, categorías, búsqueda).
- Agregar productos al carrito y confirmar pedidos.
- Ver el estado de sus pedidos en tiempo real.
- Actualizar su perfil personal.

### 4.2 Administrador (`rol: administrador`)
Personal interno de la empresa. Puede, además de lo anterior:
- Crear, editar y eliminar productos y sus imágenes.
- Gestionar categorías y subcategorías.
- Ajustar stock manualmente.
- Ver todos los pedidos del sistema y actualizar su estado.
- Consultar el listado de clientes registrados.

---

## 5. Funcionalidades del Sistema

### 5.1 Módulo de Autenticación

| Feature | Descripción | Prioridad |
|---|---|---|
| Registro de usuario | Formulario con nombre, CI, teléfono, dirección, correo y contraseña | Alta |
| Inicio de sesión | Login por CI o correo electrónico + contraseña | Alta |
| Generación de JWT | Token de sesión firmado con expiración | Alta |
| Hash de contraseña | Almacenamiento seguro con bcrypt | Alta |
| Actualización de perfil | Editar datos personales del usuario | Media |
| Cierre de sesión | Invalidación del token en cliente | Media |

**Endpoints:**
- `POST /api/auth/register`
- `POST /api/auth/login`

---

### 5.2 Módulo de Catálogo

| Feature | Descripción | Prioridad |
|---|---|---|
| Listado de categorías | Ver categorías con sus subcategorías anidadas | Alta |
| Listado de productos | Grid de productos filtrable por categoría y buscable por nombre | Alta |
| Ficha de producto | Detalle: nombre, descripción, precios, presentación, olor, color, imagen, stock | Alta |
| Filtrado por categoría | `GET /api/products?category_id=1` | Alta |
| Búsqueda de productos | `GET /api/products?search=detergente` | Alta |

**Endpoints:**
- `GET /api/categories`
- `GET /api/products`
- `GET /api/products/:id`

---

### 5.3 Módulo de Carrito y Pedidos (Cliente)

| Feature | Descripción | Prioridad |
|---|---|---|
| Añadir producto al carrito | Selección de producto y cantidad | Alta |
| Modificar cantidad en carrito | Incrementar / decrementar unidades | Alta |
| Eliminar producto del carrito | Quitar ítem individual | Alta |
| Confirmación del pedido | Revisión final y envío del pedido | Alta |
| Validación de stock | Verificación de disponibilidad antes de confirmar | Alta |
| Visualización de pedidos propios | Historial de pedidos del cliente autenticado | Alta |
| Seguimiento de estado | Ver estado actual: Pendiente / Aprobado / En Despacho / Entregado | Alta |

**Endpoints:**
- `POST /api/orders`
- `GET /api/orders` (filtrado por cliente)

---

### 5.4 Módulo de Administración de Productos

| Feature | Descripción | Prioridad |
|---|---|---|
| Crear producto | Formulario con todos los atributos (nombre, precios, stock, imagen, etc.) | Alta |
| Editar producto | Actualización de cualquier campo | Alta |
| Eliminar producto | Baja lógica o física del producto | Alta |
| Subida de imagen | Upload de imagen del producto | Alta |
| Vista de productos sin stock | Listado de ítems agotados | Media |

**Endpoints:**
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

---

### 5.5 Módulo de Gestión de Inventario

| Feature | Descripción | Prioridad |
|---|---|---|
| Ajuste manual de stock | El admin puede incrementar o decrementar el stock de un producto | Alta |
| Descuento automático de stock | El stock se reduce automáticamente al confirmar un pedido | Alta |
| Alerta de stock bajo | Identificación visual de productos con stock crítico | Media |

---

### 5.6 Módulo de Gestión de Categorías

| Feature | Descripción | Prioridad |
|---|---|---|
| Crear categoría | Nueva categoría principal | Alta |
| Crear subcategoría | Asociada a una categoría padre | Alta |
| Editar / Eliminar categoría | Gestión completa del árbol de categorías | Media |

---

### 5.7 Módulo de Gestión de Pedidos (Admin)

| Feature | Descripción | Prioridad |
|---|---|---|
| Ver todos los pedidos | Lista global con filtros por estado y cliente | Alta |
| Actualizar estado del pedido | Transición: Pendiente → Aprobado → En Despacho → Entregado | Alta |

**Endpoint:**
- `PUT /api/orders/:id/status`

---

### 5.8 Módulo de Gestión de Clientes (Admin)

| Feature | Descripción | Prioridad |
|---|---|---|
| Listado de clientes | Ver todos los usuarios registrados con datos de contacto | Media |
| Vista de historial de compras por cliente | Pedidos realizados por un cliente específico | Baja |

---

## 6. Flujo de Vida de un Pedido

```
Cliente confirma pedido
        │
        ▼
[PENDIENTE] ──── Admin revisa
        │
        ▼
[APROBADO] ──── Admin prepara y despacha
        │
        ▼
[EN DESPACHO] ──── Producto en camino
        │
        ▼
[ENTREGADO] ──── Pedido finalizado
```

Cada cambio de estado es visible por el cliente en su panel de seguimiento en tiempo real.

---

## 7. Modelo de Datos

### Entidades Principales

| Entidad | Atributos Clave |
|---|---|
| `usuarios` | id, nombre, ci (único), teléfono, dirección, correo (único), password (hash), rol |
| `categorias` | id, nombre, descripcion |
| `subcategorias` | id, categoria_id (FK), nombre, descripcion |
| `productos` | id, nombre, subcategoria_id (FK), descripcion, precio_minorista, precio_mayorista, presentacion, olor, color, imagen, stock |
| `pedidos` | id, cliente_id (FK), fecha, estado (enum) |
| `detalle_pedido` | id, pedido_id (FK), producto_id (FK), cantidad, precio |

### Reglas de Negocio de Datos
- `ci` y `correo` son únicos por usuario.
- El `rol` solo acepta valores: `'cliente'` o `'administrador'`.
- El `estado` del pedido solo acepta: `'pendiente'`, `'aprobado'`, `'en despacho'`, `'entregado'`.
- El `precio` en `detalle_pedido` se almacena al momento de la compra (protección ante cambios futuros de precio).
- El `stock` nunca puede quedar en negativo.

---

## 8. Arquitectura Técnica

### 8.1 Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | Next.js | 16 |
| UI Framework | React | 19 |
| Lenguaje (Frontend) | TypeScript | ^5 |
| Estilos | Tailwind CSS | ^4 |
| Backend | Express.js | ^4 |
| Lenguaje (Backend) | TypeScript | ^5 |
| ORM | Prisma | ^5.11 |
| Base de Datos | PostgreSQL (compatible Prisma) | — |
| Autenticación | JWT + bcrypt | — |
| Runtime | Node.js | ^20 |

### 8.2 Estructura del Proyecto

```
PROYECTO NOVAX 1.0/
├── backend/
│   ├── src/
│   │   ├── controllers/     ← Lógica de cada recurso
│   │   ├── routes/          ← Definición de endpoints
│   │   ├── middlewares/     ← Auth JWT, validaciones
│   │   ├── services/        ← Lógica de negocio reutilizable
│   │   ├── models/          ← Tipos e interfaces
│   │   ├── utils/           ← Helpers
│   │   ├── app.ts           ← Configuración Express
│   │   └── server.ts        ← Punto de entrada
│   └── prisma/
│       └── schema.prisma    ← Definición del esquema de BD
├── frontend/
│   └── src/
│       └── app/             ← Páginas y componentes Next.js
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── scripts/
├── docs/                    ← Documentación del proyecto
├── tests/                   ← Pruebas automatizadas
└── logs/
```

### 8.3 Seguridad
- Las contraseñas se almacenan **hasheadas** con `bcrypt` (nunca en texto plano).
- Toda ruta que requiere autenticación es protegida por **middleware JWT**.
- Las rutas de administrador validan además que `rol === 'administrador'`.
- Las variables sensibles se gestionan mediante `.env` y nunca se commitean al repositorio.

---

## 9. API — Contratos Principales

### Autenticación

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | No | Registro de nuevo usuario |
| POST | `/api/auth/login` | No | Login, retorna JWT |

### Catálogo

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/api/categories` | No | Lista categorías y subcategorías |
| GET | `/api/products` | No | Lista productos (filtros: category_id, search) |
| GET | `/api/products/:id` | No | Detalle de un producto |

### Pedidos

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/api/orders` | Cliente | Crear nuevo pedido |
| GET | `/api/orders` | Cliente/Admin | Ver pedidos (propios o todos) |
| PUT | `/api/orders/:id/status` | Admin | Actualizar estado de pedido |

### Administración (requiere rol admin)

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/api/products` | Admin | Crear producto |
| PUT | `/api/products/:id` | Admin | Editar producto |
| DELETE | `/api/products/:id` | Admin | Eliminar producto |

---

## 10. Requerimientos No Funcionales

| Categoría | Requerimiento |
|---|---|
| **Rendimiento** | Listado de productos < 1s para catálogos de hasta 500 ítems |
| **Seguridad** | Contraseñas hasheadas, tokens JWT con expiración, rutas admin protegidas |
| **Usabilidad** | Interfaz responsiva, navegable desde móvil y desktop |
| **Disponibilidad** | El sistema debe estar disponible durante el horario comercial (8am–8pm) |
| **Escalabilidad** | Arquitectura desacoplada (frontend/backend) que permita escalar independientemente |
| **Mantenibilidad** | Código en TypeScript con tipos estrictos, carpetas por responsabilidad |

---

## 11. Plan de Desarrollo — Estado Actual

### Fase 1: Infraestructura Base ✅ (Completada)
- [x] Definición de arquitectura y stack tecnológico
- [x] Creación de estructura de carpetas
- [x] Configuración del backend (Express + TypeScript)
- [x] Instalación y configuración de dependencias
- [x] Schema Prisma con todas las tablas
- [x] Inicialización del frontend (Next.js + Tailwind)
- [x] Variables de entorno base

### Fase 2: Backend — Lógica de Negocio ✅ (Completada)
- [x] Esqueleto de controladores (auth, products, orders, categories)
- [x] Implementación completa de `authController` (register, login)
- [x] Implementación completa de `productController` (CRUD)
- [x] Implementación completa de `orderController` (crear pedido, actualizar stock)
- [x] Implementación completa de `categoryController`
- [x] Middleware JWT de autenticación
- [x] Middleware de autorización por rol
- [x] Rutas completas de productos, pedidos y categorías
- [x] Ejecución de migraciones / `prisma db push`
- [x] Seeds de datos iniciales

### Fase 3: Frontend — Interfaces de Usuario ✅ (Completada)
- [x] Página de inicio / landing con catálogo
- [x] Página de login y registro
- [x] Página de detalle de producto
- [x] Carrito de compras (estado global)
- [x] Página de confirmación de pedido
- [x] Panel de seguimiento de pedidos (cliente)
- [x] Perfil de usuario

### Fase 4: Panel de Administración ✅ (Completada)
- [x] Dashboard admin con métricas básicas
- [x] CRUD de productos con upload de imágenes (referencia a URLs)
- [x] Gestión de categorías y subcategorías
- [x] Gestión de inventario (ajuste de stock)
- [x] Vista y gestión de pedidos
- [x] Listado de clientes

### Fase 5: Integración y Calidad ✅ (Completada)
- [x] Integración completa frontend ↔ backend
- [x] Manejo global de errores y estados de carga
- [x] Verificación de tipos con TypeScript (`tsc --noEmit`)
- [x] Pruebas de flujo de pedido satisfactorias

### Fase 6: Producción ⏳ (Pendiente)
- [ ] Configuración final para entorno de despliegue
- [ ] Optimización de assets y build de producción

---

## 12. Fuera de Alcance (v1.0)

Los siguientes features están **explícitamente excluidos** de la versión 1.0 para mantener el foco:

- Pasarela de pagos en línea (Stripe, PayPal, etc.) — los pagos se gestionan offline.
- Notificaciones push o SMS.
- Aplicación móvil nativa.
- Sistema de reseñas o valoraciones de productos.
- Multi-empresa o multi-sucursal.
- Reportes avanzados de BI / analytics.
- Sistema de descuentos o cupones.

---

## 13. Glosario

| Término | Definición |
|---|---|
| **CI** | Cédula de Identidad. Identificador único del usuario en Bolivia. |
| **JWT** | JSON Web Token. Estándar de autenticación stateless. |
| **ORM** | Object-Relational Mapper. Prisma actúa como puente entre el código y la BD. |
| **Stock** | Cantidad de unidades disponibles de un producto en inventario. |
| **Pedido** | Solicitud de compra realizada por un cliente, compuesta por uno o más productos. |
| **Detalle de pedido** | Línea individual del pedido que especifica producto, cantidad y precio. |
| **Precio minorista** | Precio unitario para compras en pequeñas cantidades. |
| **Precio mayorista** | Precio unitario para compras al por mayor. |

---

## 🚦 Estado General Final

```
Fase actual: IMPLEMENTACIÓN COMPLETADA Y VERIFICADA
Progreso estimado: 100% del alcance funcional v1.0

[████████████████████] 100%
```

El sistema Novax ERP se encuentra totalmente operativo según los requerimientos definidos, con integración completa entre frontend y backend, autenticación robusta y flujos administrativos validados.
