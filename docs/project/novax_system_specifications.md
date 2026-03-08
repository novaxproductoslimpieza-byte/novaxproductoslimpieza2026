<<<<<<< HEAD
# NOVAX – Sistema Web de Catálogo, Inventario y Pedidos

## 1. Contexto del Proyecto

Novax es una empresa dedicada a la **fabricación y distribución de productos de limpieza**, incluyendo:

- detergentes para ropa
- lavavajillas
- jabones de manos
- suavizantes
- limpiadores industriales
- detergentes automotrices

Se requiere desarrollar una **plataforma web moderna** que permita:

- mostrar el catálogo de productos
- gestionar inventario
- registrar clientes
- recibir pedidos
- administrar productos y precios

El sistema debe funcionar tanto en **computadoras como en teléfonos móviles**.

---

# 2. Objetivo del Sistema

Crear una **aplicación web empresarial** que permita:

### Para clientes

- ver catálogo de productos
- consultar precios
- registrarse en el sistema
- realizar pedidos

### Para administradores

- gestionar productos
- controlar inventario
- modificar precios
- ver pedidos
- gestionar clientes
- gestionar proveedores

---

# 3. Tipos de Usuarios

El sistema tendrá **tres tipos de usuarios**.

## 3.1 Visitante

Usuario que no inicia sesión.

Permisos:

- ver catálogo
- ver productos
- ver precios

No puede:

- realizar pedidos
- modificar información

---

## 3.2 Cliente Registrado

Usuario que se registra en el sistema.

Datos requeridos:

- nombre completo
- carnet de identidad
- teléfono
- dirección
- correo electrónico
- contraseña

El **carnet de identidad** puede utilizarse como identificador del usuario.

Permisos:

- ver catálogo
- ver productos
- ver precios
- realizar pedidos
- consultar estado de pedidos

---

## 3.3 Administrador

Usuario con control total del sistema.

Permisos:

- crear productos
- editar productos
- eliminar productos
- subir imágenes
- gestionar inventario
- modificar precios
- ver pedidos
- gestionar clientes
- gestionar proveedores

---

# 4. Estructura del Sitio Web

El sitio web debe tener la siguiente estructura principal.

Inicio  
Catálogo  
Categorías  
Subcategorías  
Productos  
Login  
Registro  
Área Cliente  
Panel Administrador  

---

# 5. Catálogo de Productos

El catálogo estará organizado en **tres niveles**.

## 5.1 Categorías

Ejemplos:

- Hogar
- Automotriz
- Industrial

---

## 5.2 Subcategorías

Ejemplo dentro de la categoría Hogar:

- Lavavajillas
- Detergente para ropa
- Suavizante
- Limpiador de pisos
- Antibacterial

---

## 5.3 Productos

Cada producto debe contener la siguiente información:

- nombre
- categoría
- subcategoría
- descripción
- imagen
- precio minorista
- precio mayorista
- presentación
- aroma
- color
- stock disponible

---

# 6. Sistema de Inventario

Cada producto debe tener control de inventario.

Campos necesarios:

- producto
- cantidad disponible
- estado (disponible o agotado)

Cuando un cliente realiza un pedido, el sistema debe verificar el inventario.

---

# 7. Sistema de Precios

Cada producto tendrá dos tipos de precio:

- precio minorista
- precio mayorista

El administrador puede modificar estos precios desde el panel administrativo.

---

# 8. Sistema de Pedidos

Los clientes registrados pueden realizar pedidos.

Flujo del pedido:

Cliente selecciona producto  
Cliente agrega producto al carrito  
Cliente confirma pedido  
El pedido se guarda en la base de datos  
Administrador revisa el pedido  
Administrador verifica inventario  
Pedido se prepara para despacho  

Estados posibles del pedido:

- pendiente
- aprobado
- en despacho
- entregado

---

# 9. Base de Datos

El sistema debe utilizar una base de datos estructurada.

## Tabla usuarios

Campos:

- id
- nombre
- ci
- telefono
- direccion
- correo
- password
- rol

Roles posibles:

- cliente
- administrador

---

## Tabla categorias

Campos:

- id
- nombre
- descripcion

---

## Tabla subcategorias

Campos:

- id
- categoria_id
- nombre
- descripcion

---

## Tabla productos

Campos:

- id
- nombre
- subcategoria_id
- descripcion
- precio_minorista
- precio_mayorista
- presentacion
- olor
- color
- imagen
- stock

---

## Tabla pedidos

Campos:

- id
- cliente_id
- fecha
- estado

---

## Tabla detalle_pedido

Campos:

- id
- pedido_id
- producto_id
- cantidad
- precio

---

# 10. Panel Administrador

El panel administrador debe incluir los siguientes módulos:

- gestión de productos
- gestión de categorías
- gestión de subcategorías
- gestión de inventario
- gestión de pedidos
- gestión de clientes
- gestión de proveedores

---

# 11. Interfaz de Usuario

La interfaz debe ser **moderna, simple y responsive**.

Requisitos:

- diseño adaptable a celular y computadora
- catálogo visual con tarjetas de productos
- imágenes de productos grandes
- filtros por categoría
- buscador de productos

---

# 12. Requisitos Responsive

El sistema debe adaptarse a diferentes tamaños de pantalla.

Celular  
Tablet  
Laptop  
Computadora de escritorio  

Debe utilizar diseño responsive basado en:

- Flexbox
- CSS Grid

---

# 13. Seguridad

El sistema debe implementar:

- autenticación de usuarios
- contraseñas encriptadas
- control de roles
- protección del panel administrador

---

# 14. Arquitectura Tecnológica

Tecnologías recomendadas para el proyecto.

Frontend:

React o Next.js

Backend:

Node.js

Base de datos:

PostgreSQL

Autenticación:

JWT

Mapas para futuras versiones:

Google Maps API

---

# 15. Escalabilidad

El sistema debe permitir futuras ampliaciones como:

- aplicación móvil
- geolocalización de clientes
- optimización de rutas de entrega
- sistema de facturación
- integración con pagos digitales

---

# 16. Resultado Esperado

El proyecto generado debe incluir:

- frontend completo
- backend API
- base de datos estructurada
- panel administrador
- sistema de usuarios
- catálogo dinámico de productos
- sistema de pedidos
=======
# NOVAX – Sistema Web de Catálogo, Inventario y Pedidos

## 1. Contexto del Proyecto

Novax es una empresa dedicada a la **fabricación y distribución de productos de limpieza**, incluyendo:

- detergentes para ropa
- lavavajillas
- jabones de manos
- suavizantes
- limpiadores industriales
- detergentes automotrices

Se requiere desarrollar una **plataforma web moderna** que permita:

- mostrar el catálogo de productos
- gestionar inventario
- registrar clientes
- recibir pedidos
- administrar productos y precios

El sistema debe funcionar tanto en **computadoras como en teléfonos móviles**.

---

# 2. Objetivo del Sistema

Crear una **aplicación web empresarial** que permita:

### Para clientes

- ver catálogo de productos
- consultar precios
- registrarse en el sistema
- realizar pedidos

### Para administradores

- gestionar productos
- controlar inventario
- modificar precios
- ver pedidos
- gestionar clientes
- gestionar proveedores

---

# 3. Tipos de Usuarios

El sistema tendrá **tres tipos de usuarios**.

## 3.1 Visitante

Usuario que no inicia sesión.

Permisos:

- ver catálogo
- ver productos
- ver precios

No puede:

- realizar pedidos
- modificar información

---

## 3.2 Cliente Registrado

Usuario que se registra en el sistema.

Datos requeridos:

- nombre completo
- carnet de identidad
- teléfono
- dirección
- correo electrónico
- contraseña

El **carnet de identidad** puede utilizarse como identificador del usuario.

Permisos:

- ver catálogo
- ver productos
- ver precios
- realizar pedidos
- consultar estado de pedidos

---

## 3.3 Administrador

Usuario con control total del sistema.

Permisos:

- crear productos
- editar productos
- eliminar productos
- subir imágenes
- gestionar inventario
- modificar precios
- ver pedidos
- gestionar clientes
- gestionar proveedores

---

# 4. Estructura del Sitio Web

El sitio web debe tener la siguiente estructura principal.

Inicio  
Catálogo  
Categorías  
Subcategorías  
Productos  
Login  
Registro  
Área Cliente  
Panel Administrador  

---

# 5. Catálogo de Productos

El catálogo estará organizado en **tres niveles**.

## 5.1 Categorías

Ejemplos:

- Hogar
- Automotriz
- Industrial

---

## 5.2 Subcategorías

Ejemplo dentro de la categoría Hogar:

- Lavavajillas
- Detergente para ropa
- Suavizante
- Limpiador de pisos
- Antibacterial

---

## 5.3 Productos

Cada producto debe contener la siguiente información:

- nombre
- categoría
- subcategoría
- descripción
- imagen
- precio minorista
- precio mayorista
- presentación
- aroma
- color
- stock disponible

---

# 6. Sistema de Inventario

Cada producto debe tener control de inventario.

Campos necesarios:

- producto
- cantidad disponible
- estado (disponible o agotado)

Cuando un cliente realiza un pedido, el sistema debe verificar el inventario.

---

# 7. Sistema de Precios

Cada producto tendrá dos tipos de precio:

- precio minorista
- precio mayorista

El administrador puede modificar estos precios desde el panel administrativo.

---

# 8. Sistema de Pedidos

Los clientes registrados pueden realizar pedidos.

Flujo del pedido:

Cliente selecciona producto  
Cliente agrega producto al carrito  
Cliente confirma pedido  
El pedido se guarda en la base de datos  
Administrador revisa el pedido  
Administrador verifica inventario  
Pedido se prepara para despacho  

Estados posibles del pedido:

- pendiente
- aprobado
- en despacho
- entregado

---

# 9. Base de Datos

El sistema debe utilizar una base de datos estructurada.

## Tabla usuarios

Campos:

- id
- nombre
- ci
- telefono
- direccion
- correo
- password
- rol

Roles posibles:

- cliente
- administrador

---

## Tabla categorias

Campos:

- id
- nombre
- descripcion

---

## Tabla subcategorias

Campos:

- id
- categoria_id
- nombre
- descripcion

---

## Tabla productos

Campos:

- id
- nombre
- subcategoria_id
- descripcion
- precio_minorista
- precio_mayorista
- presentacion
- olor
- color
- imagen
- stock

---

## Tabla pedidos

Campos:

- id
- cliente_id
- fecha
- estado

---

## Tabla detalle_pedido

Campos:

- id
- pedido_id
- producto_id
- cantidad
- precio

---

# 10. Panel Administrador

El panel administrador debe incluir los siguientes módulos:

- gestión de productos
- gestión de categorías
- gestión de subcategorías
- gestión de inventario
- gestión de pedidos
- gestión de clientes
- gestión de proveedores

---

# 11. Interfaz de Usuario

La interfaz debe ser **moderna, simple y responsive**.

Requisitos:

- diseño adaptable a celular y computadora
- catálogo visual con tarjetas de productos
- imágenes de productos grandes
- filtros por categoría
- buscador de productos

---

# 12. Requisitos Responsive

El sistema debe adaptarse a diferentes tamaños de pantalla.

Celular  
Tablet  
Laptop  
Computadora de escritorio  

Debe utilizar diseño responsive basado en:

- Flexbox
- CSS Grid

---

# 13. Seguridad

El sistema debe implementar:

- autenticación de usuarios
- contraseñas encriptadas
- control de roles
- protección del panel administrador

---

# 14. Arquitectura Tecnológica

Tecnologías recomendadas para el proyecto.

Frontend:

React o Next.js

Backend:

Node.js

Base de datos:

PostgreSQL

Autenticación:

JWT

Mapas para futuras versiones:

Google Maps API

---

# 15. Escalabilidad

El sistema debe permitir futuras ampliaciones como:

- aplicación móvil
- geolocalización de clientes
- optimización de rutas de entrega
- sistema de facturación
- integración con pagos digitales

---

# 16. Resultado Esperado

El proyecto generado debe incluir:

- frontend completo
- backend API
- base de datos estructurada
- panel administrador
- sistema de usuarios
- catálogo dinámico de productos
- sistema de pedidos
>>>>>>> f83596534f8cf99255a5f3a8a8085275451c6aa2
- código modular y escalable