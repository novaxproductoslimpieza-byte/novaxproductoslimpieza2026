# Respuestas Técnicas – Sistema de Geoubicación Novax ERP

Este documento contiene las respuestas a la **segunda ronda de consultas técnicas** planteadas tras revisar la especificación en `novax_geoubicacion.md`.

Estas respuestas sirven como base para continuar con la implementación del módulo de geoubicación dentro del proyecto **Novax ERP**.

---

# 5. Base de Datos y Modelado (Prisma)

## 5.1 Esquema de Usuario

No se debe crear una tabla separada para direcciones.

Los campos de geolocalización deben agregarse directamente al modelo **Usuario**.

Campos a agregar en `schema.prisma`:

* `latitud`
* `longitud`
* `zonaId` (relación con tabla de zonas)

Cada cliente tendrá **una sola ubicación principal**.

Esta ubicación se usará para:

* entrega de pedidos
* visualización en el mapa
* planificación logística

---

## 5.2 Tabla maestra de zonas

Se debe crear una **tabla maestra de zonas**.

Motivo:
Evitar inconsistencias al escribir zonas manualmente.

Ejemplo de problema que se quiere evitar:

* Zona Sud
* Sona Sud
* zona sud

Si se selecciona desde lista, se mantiene orden y consistencia.

### Tabla Zonas

Debe contener los siguientes campos:

* `id`
* `nombreZona`
* `provincia`
* `departamento`

### Funcionamiento

Los usuarios y clientes **no escribirán la zona manualmente**.

En su lugar:

* seleccionarán la zona desde una lista.

Esto permitirá también definir **dónde trabaja la empresa**.

Ejemplo:

Si la empresa solo trabaja en ciertas zonas, se controlará desde esta tabla.

---

### Departamentos (Bolivia)

Debe existir selección desde lista.

Ejemplos:

* La Paz
* Cochabamba
* Santa Cruz
* Oruro
* Potosí
* Chuquisaca
* Tarija
* Beni
* Pando

---

### Provincias

Las provincias también deben seleccionarse desde lista.

Ejemplo para **Cochabamba**:

* Cercado
* Quillacollo
* Sacaba
* Punata
* Capinota
* Tiquipaya

Esto permitirá que el sistema **no sea rígido** y pueda ampliarse a otros departamentos.

---

## 5.3 Correo electrónico

Por ahora se utilizará el campo existente:

`correo`

Más adelante se implementará **validación de correos electrónicos**.

---

# 6. Lógica de Negocio y Estados de Pedido

## 6.1 Prioridad de iconos

El mapa debe mostrar el estado más relevante del cliente según sus pedidos.

Prioridad definida:

1. Pedido (máxima prioridad)
2. Entregado
3. Stand By / Inactivo

Regla:

Si un cliente tiene **varios pedidos** y uno de ellos sigue activo, el icono debe mantenerse en **Pedido**.

Ejemplo:

Pedido A → Entregado
Pedido B → Pedido

Resultado:

El cliente sigue mostrando icono **Pedido**.

---

### Información adicional en el popup

En el cuadro de datos del cliente debe aparecer:

* estado actual de pedidos

Si el cliente tiene pedidos activos, debe mostrarse un **icono de carrito de compras**.

### Interacción con el carrito

Si el usuario hace clic en el carrito:

Debe abrirse una **ventana del cliente con detalle de pedidos**.

Información mostrada:

* número de pedido
* productos del pedido
* precios
* costo total
* estado del pedido

Estados posibles:

* Pedido aprobado
* Despachado
* Entregado

Si existen varios pedidos, se mostrarán **uno debajo de otro**.

Al final debe mostrarse **el costo total acumulado**.

---

### Forma de pago

La forma de pago se definirá más adelante.

Opciones futuras:

* efectivo
* QR

Se puede colocar un icono de pago **pero desactivado por ahora**.

---

## 6.2 Sincronización de estados

Los iconos del mapa deben actualizarse automáticamente.

Motivo:

Toda la información proviene de **la base de datos**.

Por lo tanto:

Si el estado del pedido cambia en el sistema, el mapa debe reflejar ese cambio.

---

# 7. Interfaz y Experiencia de Usuario

## 7.1 Botón "Más detalle"

El botón debe redirigir al **perfil del cliente**.

En esa página se mostrarán:

* datos del cliente
* foto del cliente (en el futuro)
* estado actual de pedidos

Por ahora **no se mostrará historial**, solo pedidos actuales.

Ejemplo:

Pedido 10010

Debe mostrar:

* lista de productos
* precios
* costo total

Si hay más pedidos, se mostrarán debajo.

---

## 7.2 Botón de WhatsApp

El botón debe existir en la interfaz.

Pero **debe permanecer desactivado por ahora**.

Esta funcionalidad se implementará posteriormente.

---

## 7.3 Iconos del sistema

En el proyecto se creará el siguiente directorio:

```
frontend/public/imagenes
```

Allí se almacenarán:

* `logonovax.png`

Para otros iconos del sistema:

Se pueden utilizar **iconos de librerías públicas** temporalmente.

Más adelante se crearán **iconos personalizados del sistema**.

---

# 8. Rendimiento y API

## 8.1 Geocodificación

La dirección se obtendrá **solo una vez**.

Flujo:

1. Cliente registra su ubicación
2. El sistema obtiene dirección con OpenStreetMap / Nominatim
3. La dirección se guarda en la base de datos

Después de eso:

La dirección **no se vuelve a consultar en tiempo real**.

Esto mejora:

* rendimiento
* estabilidad
* uso de la API

---

## 8.2 Permisos de ubicación

Para registrar un cliente será **obligatorio activar la ubicación**.

Condiciones necesarias para registrar cliente:

* GPS activado
* Permiso de ubicación otorgado
* Conexión a internet

Si el usuario **no activa la ubicación**, no podrá registrarse.

Motivo:

El sistema necesita obtener:

* latitud
* longitud

Normalmente el registro se realizará **desde teléfono móvil** rara vez desde pc

---

# Estado del documento

Este archivo responde las dudas técnicas para continuar con el desarrollo del sistema de geoubicación de **Novax ERP**.

Archivo relacionado:

`novax_geoubicacion.md`
