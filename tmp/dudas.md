# Dudas sobre el Sistema de Geolocalización (Novax ERP)

Tras analizar los archivos `novax_geoubicacion.md` y `novax_geoubicacion.html`, han surgido las siguientes dudas para asegurar que el sistema final cumpla con todas las expectativas.

## 1. Datos de Clientes e integración
1.1. **Origen de los datos**: Actualmente el sistema utiliza un array estático (`let clientes = [...]`). ¿Los datos deben obtenerse directamente de la base de datos PostgreSQL mediante una API del backend?
1.2. **Campos adicionales**: El código actual muestra Nombre, CI, Teléfono, Dirección (vía Nominatim), Latitud y Longitud. ¿Existen otros campos en la base de datos que deberían aparecer en el popup informativo (ej. Correo, Historial de pedidos, Vendedor asignado)?
1.3. **Persistencia**: Cuando un usuario "registra su ubicación" en el formulario, ¿esta información debe guardarse permanentemente en la base de datos para que otros usuarios puedan verla?

## 2. Comportamiento del Mapa
2.1. **Visualización del nombre**: En el código actual, el nombre aparece permanentemente sobre el marcador (`permanent: true`). ¿Es este el comportamiento deseado, o debería aparecer solo cuando el usuario pase el ratón por encima (hover)?
2.2. **Iconografía personalizada**: Se utiliza un icono `logonovax.png` para la ubicación actual ("Novax"). ¿Los marcadores de los clientes deberían tener un icono específico (ej. un coche, un pin de color según el estado del cliente) o el marcador por defecto de Leaflet es suficiente?
2.3. **Punto de inicio**: ¿El mapa debe centrarse automáticamente en la ubicación del usuario, o en una ubicación predeterminada (ej. Cochabamba)? ¿Qué sucede si el usuario deniega el permiso de geolocalización?

## 3. Interacción del Usuario
3.1. **Acciones desde el Popup**: Además de mostrar información, ¿el popup debería tener botones de acción? (ej. "Ver Perfil completo", "Crear Pedido para este cliente", "Llamar por WhatsApp").
3.2. **Búsqueda y Filtrado**: El buscador actual centra el mapa en un cliente. ¿Debería también filtrar la lista lateral o resaltar el marcador de alguna manera especial?
3.3. **Edición de Ubicación**: ¿Los administradores deben poder arrastrar los marcadores en el mapa para corregir la ubicación de un cliente manualmente?

## 4. Estructura y Tecnología
4.1. **Integración con Next.js**: ¿Este sistema de geolocalización se convertirá en un componente dentro de la aplicación Next.js (`frontend/src/...`) o seguirá funcionando como una herramienta independiente?
4.2. **Gestión de Direcciones**: El uso de `Nominatim (OpenStreetMap)` para obtener direcciones tiene límites de uso. ¿Se ha considerado el uso de otros proveedores (Google Maps, Mapbox) o es suficiente con la solución gratuita actual?

---
# Segunda Ronda de Consultas Técnicas (Post-Especificación)

Tras revisar la especificación oficial en `novax_geoubicacion.md`, han surgido los siguientes puntos técnicos que requieren definición antes de iniciar la codificación:

## 5. Base de Datos y Modelado (Prisma)
5.1. **Esquema de Usuario**: Actualmente, el modelo `Usuario` en `schema.prisma` no tiene campos para `latitud`, `longitud` ni `zona`. ¿Deseas que los agregue directamente a la tabla `Usuario` o prefieres una tabla separada `Direccion` (en caso de que un cliente tenga varias ubicaciones)?
5.2. **Campo Zona**: Mencionas el filtrado por "Zona". ¿Cómo se definen estas zonas? ¿Será un campo de texto libre (ej: "Zona Sur") o una tabla maestra de zonas predefinidas?
5.3. **Correo Electrónico**: La especificación pide mostrar el correo. Confirmado, usaremos el campo `correo` del modelo `Usuario`.

## 6. Lógica de Negocio y Estados de Pedido
6.1. **Prioridad de Iconos**: Un cliente puede tener varios pedidos. Si tiene uno "Entregado" y otro "En Despacho", ¿qué icono debe prevalecer en el mapa? (Sugerencia: El estado más "activo" o urgente).
6.2. **Sincronización de Estados**: Los iconos de los estados ("Pedido", "Despachado") ¿deben cambiar automáticamente al actualizar el estado en el Panel de Administración de pedidos?

## 7. Interfaz y Experiencia de Usuario (Frontend)
7.1. **Destino de "Más detalle"**: Al hacer clic en este botón, ¿a qué página del sistema debe redirigir? (¿al perfil del cliente, a su historial de compras, etc.?)
7.2. **Enlace de WhatsApp**: ¿El botón de WhatsApp debe abrir directamente el chat con un mensaje preconfigurado (ej: "Hola, somos de Novax...") o solo abrir el chat vacío?
7.3. **Activos de Iconos**: ¿Dispones de las imágenes para los iconos personalizados (Stand By, Pedido, Despachado) o debo utilizar marcadores de colores/estándares por ahora?

## 8. Rendimiento y API
8.1. **Geocodificación Inversa (Nominatim)**: Para optimizar el rendimiento y respetar los límites de la API de OpenStreetMap, ¿prefieres que la dirección se obtenga y guarde en la base de datos una sola vez cuando el cliente registre su ubicación, o que se consulte en tiempo real cada vez que se abra el popup? (Sugerencia: Guardarla en la base de datos es más eficiente).
8.2. **Permisos de Ubicación**: Si el usuario bloquea el acceso a su ubicación, el sistema no podrá centrar el mapa automáticamente. ¿Deseas un centro fijo por defecto (ej: Plaza Principal de Cochabamba)?

---
# Tercera Ronda de Consultas Técnicas

Tras analizar las respuestas y compararlas con el código actual (`schema.prisma` y `seed.ts`), han surgido los últimos puntos de control para la fase de implementación:

## 9. Base de Datos y Semillas (Seed)
9.1. **Carga Inicial de Zonas**: ¿Deseas que incluya en el script de `seed.ts` una lista base de Departamentos (los 9 de Bolivia) y las Provincias principales de Cochabamba para poblar la tabla `Zonas` automáticamente?
9.2. **Relación en Usuario**: Al añadir `zonaId` a `Usuario`, ¿este campo debe ser obligatorio (required) para todos los usuarios o solo para los de rol `CLIENTE`?

## 10. Lógica de Negocio y Estados de Pedido
10.1. **Mapeo de Estados**: En `schema.prisma` tenemos 5 estados. Para la lógica de iconos del mapa:
   - ¿"Pedido" (icono carrito) agrupa a `PENDIENTE`, `APROBADO` y `EN_DESPACHO`?
   - ¿"Entregado" corresponde únicamente a `ENTREGADO`?
   - ¿"Stand By" se muestra si el cliente no tiene pedidos o si solo tiene pedidos `CANCELADO`?
10.2. **Carga de Detalles**: Para no ralentizar el mapa con muchos datos, ¿estás de acuerdo en que el detalle de productos y precios del popup se cargue mediante una llamada a la API solo cuando el usuario haga clic en el marcador?

## 11. Estructura de Proyecto y Seguridad
11.1. **Directorio de Imágenes**: En el script de semillas actual se usa `/images/`, pero en las respuestas mencionas `/imagenes/`. ¿Cuál prefieres que sea el estándar oficial para el proyecto?
11.2. **Ruta del Mapa**: Dado que solo los Administradores pueden ver todas las ubicaciones, ¿esta vista de mapa se implementará como una nueva ruta dentro del panel de administración (ej. `frontend/src/app/admin/mapa/page.tsx`)?
11.3. **Registro desde Móvil**: Mencionas que el registro será mayormente desde móviles. ¿Deseas que la interfaz de registro de ubicación sea una página dedicada y simplificada para facilitar su uso en dispositivos táctiles?

---
*Con estas respuestas finales, tendré toda la información necesaria para proceder con la implementación técnica definitiva.*
