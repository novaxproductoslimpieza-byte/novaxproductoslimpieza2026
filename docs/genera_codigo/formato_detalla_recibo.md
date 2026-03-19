# Tablas y Recibos - Guía de Implementación

## 1. Filosofía General

Se ha unificado la forma de mostrar información detallada en la aplicación, siguiendo estos principios:

- **Reutilización:** Tanto listas como detalles usan clases CSS comunes (`.thead-professional` para tablas, `.recibo-modal` para recibos/detalles).
- **Profesionalismo visual:** Colores claros, tipografía consistente, bordes y sombras suaves.
- **Responsive:** Todas las tablas y recibos se adaptan a dispositivos móviles.
- **Facilidad de impresión/PDF:** Estructura clara y consistente para generación de PDF o impresión directa.

## 2. Gestión de Pedidos

### 2.1 Lista de Pedidos (Tabla)

**Estructura HTML/JSX:**

```jsx
<table className="table table-hover align-middle mb-0">
  <thead className="thead-professional">...</thead>
  <tbody>...</tbody>
</table>
```

**Clases CSS aplicadas:**

- `.thead-professional` → estiliza la cabecera de la tabla.
- `.table tbody tr:nth-child(even)` → filas alternadas.
- `.table tbody tr:hover` → efecto hover.

**Notas:**

- No se requiere librería adicional.
- Funciona en listas de pedidos, clientes, o productos.

### 2.2 Detalle de Pedido (Recibo)

**Estructura HTML/JSX:**

```jsx
<div className="recibo-modal">
  <div className="info-grid">...</div> // Info general del pedido
  <div className="detail-table-wrap">
    <table className="detail-table">...</table>
  </div>
  <div className="d-flex gap-2 no-print">...</div> // Botonera
</div>
```

**Clases CSS aplicadas:**

- `.recibo-modal` → contenedor general del recibo.
- `.info-grid`, `.info-item`, `.info-label`, `.info-value` → info general del pedido/cliente.
- `.detail-table-wrap`, `.detail-table` → tabla de productos con estilo profesional.
- Botones con clases `.btn`, `.btn-primary-dark`, `.btn-outline-primary`, `.btn-outline-secondary`, `.btn-danger`, `.btn-secondary`.

**Ventajas:**

- Facilita impresión y PDF.
- Consistencia visual con la tabla de pedidos.
- Reutilizable para otros módulos (clientes, productos, proveedores, etc.).

## 3. Gestión de Clientes

### 3.1 Lista de Clientes (Tabla)

Se aplica la misma filosofía que la lista de pedidos:

- `.thead-professional` para cabecera.
- Alternancia de filas y hover.

### 3.2 Detalle de Cliente (Recibo)

**Estructura HTML/JSX:**

```jsx
<div className="recibo-modal">
  <div className="row">
    ...
    <div className="col-md-6">Información Personal</div>
    <div className="col-md-6">Ubicación y Observaciones</div>
  </div>
  <div className="d-flex gap-2 no-print">
    Botones PDF, Imprimir, Eliminar, Cerrar
  </div>
</div>
```

**Clases CSS aplicadas:**

- `.recibo-modal` → contenedor general.
- `.info-grid`, `.info-item`, `.info-label`, `.info-value` → detalles del cliente.
- Botonera reutiliza las mismas clases de botones que el detalle de pedidos.

**Notas:**

- Se puede usar la misma clase `.recibo-modal` para cualquier tipo de recibo o detalle futuro.
- Mantiene consistencia con los pedidos y tablas.

## 4. Reutilización para otros módulos

- Para productos, proveedores, facturas, etc., solo crear un contenedor con `.recibo-modal` y usar `.info-grid` y `.detail-table` según corresponda.
- Evita duplicación de CSS y mantiene la coherencia visual.
- Los botones mantienen estilo uniforme con las clases existentes.

## 5. Resumen de Clases Reutilizables

| Propósito                       | Clase CSS                                                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Cabecera profesional de tablas  | `.thead-professional`                                                                                          |
| Contenedor de recibos / detalle | `.recibo-modal`                                                                                                |
| Grid de info general            | `.info-grid`                                                                                                   |
| Item de info                    | `.info-item`                                                                                                   |
| Etiqueta de campo               | `.info-label`                                                                                                  |
| Valor de campo                  | `.info-value`                                                                                                  |
| Tabla de productos en recibo    | `.detail-table`                                                                                                |
| Botones profesionales           | `.btn`, `.btn-primary-dark`, `.btn-outline-primary`, `.btn-outline-secondary`, `.btn-danger`, `.btn-secondary` |

**Objetivo:** Cada nuevo módulo puede usar estas clases sin reescribir CSS ni HTML excesivo, siguiendo la misma filosofía de presentación profesional y reutilizable.
