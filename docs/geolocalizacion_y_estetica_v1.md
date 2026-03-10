# Documentación del Módulo de Geoubicación y Rediseño Estético (Marzo 2026)

## 📍 Geolocalización y Mapas
Se ha integrado un sistema de geolocalización robusto basado en **Leaflet** y la API de **OpenStreetMap (Nominatim)**.

### Características Principales:
1.  **Selección de Coordenadas**: El registro y perfil de cliente incluyen un selector de mapa (`MapPicker`) para precisión exacta de entrega.
2.  **Jerarquía de Zonas**: Implementación de tablas `Departamentos`, `Provincias` y `Zonas` para estandarizar las direcciones en Bolivia.
3.  **Búsqueda Administrativa**: El panel `/admin/geoubicacion` permite localizar clientes por Nombre o CI, filtrando por Zona y Estado del Pedido.
4.  **Prioridad de Entrega**: Los marcadores cambian de color automáticamente:
    *   🔴 **Pedido (Rojo)**: Clientes con pedidos pendientes, aprobados o en despacho.
    *   🟢 **Entregado (Verde)**: Clientes cuyo último pedido fue completado satisfactoriamente.
    *   ⚪ **Stand By (Gris)**: Clientes sin actividad reciente.

## 🎨 Arquitectura Estética (Diseño Premium)
El sistema ha pasado por un rediseño "Mobile-First" utilizando **Bootstrap 5** y CSS personalizado de alta fidelidad.

### Lineamientos de Diseño:
*   **Fondo**: Degradado Slate/Navy (`#0f172a` a `#1e293b`) para máxima legibilidad.
*   **Sombras**: Sombras premium `0 20px 25px -5px rgba(0,0,0,0.2)` en tarjetas para dar profundidad.
*   **Interactividad**: Uso de Glassmorphism (efecto cristal) en Navbar y transiciones suaves (`cubic-bezier`) en todos los botones y tarjetas.
*   **Contraste**: Auditado para cumplimiento de accesibilidad en pantallas móviles bajo luz solar.

## ⚙️ Cambios Críticos en Lógica de Negocio
*   **Gestión de Stock**: Se eliminó el estado "CANCELADO". La cancelación de un pedido ahora implica su eliminación física o lógica desde el panel administrativo, restaurando automáticamente el stock comprometido para evitar descuadres en el inventario.
