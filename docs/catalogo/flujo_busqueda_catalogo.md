# Flujo del Motor de Búsqueda del Catálogo

## Objetivo

Definir el comportamiento del sistema de búsqueda de productos en el catálogo.

---

# Componentes del buscador

| Componente     | Función           |
| -------------- | ----------------- |
| selector grupo | filtrar por grupo |
| campo texto    | buscar producto   |
| icono lupa     | ejecutar búsqueda |

---

# Flujo de búsqueda

```
usuario ingresa texto
        │
        ▼
selección grupo (opcional)
        │
        ▼
filtrado subgrupo (opcional)
        │
        ▼
consulta base datos
        │
        ▼
resultado productos
```

---

# Reglas de búsqueda

| Regla                 | Acción               |
| --------------------- | -------------------- |
| grupo seleccionado    | limitar consulta     |
| subgrupo seleccionado | filtrar productos    |
| texto búsqueda        | buscar coincidencias |

---

# Campos incluidos en búsqueda

| Campo           | Buscar |
| --------------- | ------ |
| nombre producto | Sí     |
| descripción     | Sí     |

---

# Resultado búsqueda

| Caso                   | Acción                           |
| ---------------------- | -------------------------------- |
| resultados encontrados | mostrar tarjetas                 |
| sin resultados         | mensaje "Producto no encontrado" |

---

# Optimización recomendada

| Mejora          | Beneficio            |
| --------------- | -------------------- |
| índice fulltext | búsquedas rápidas    |
| cache consultas | menor carga servidor |
| debounce input  | menos consultas      |
