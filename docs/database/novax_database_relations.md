# NOVAX ERP - Database Relations

## Entity-Relationship Overview

1. **categorias** to **subcategorias**
   - A `categoria` can have multiple `subcategorias` (1:N).
   - Relationship: `subcategorias.categoria_id` references `categorias.id`.

2. **subcategorias** to **productos**
   - A `subcategoria` can have multiple `productos` (1:N).
   - Relationship: `productos.subcategoria_id` references `subcategorias.id`.

3. **usuarios** to **pedidos**
   - A `usuario` (cliente) can have multiple `pedidos` (1:N).
   - Relationship: `pedidos.cliente_id` references `usuarios.id`.

4. **pedidos** to **detalle_pedido**
   - A `pedido` can have multiple `detalle_pedido` records (1:N).
   - Relationship: `detalle_pedido.pedido_id` references `pedidos.id`.

5. **productos** to **detalle_pedido**
   - A `producto` can appear in multiple `detalle_pedido` records (1:N).
   - Relationship: `detalle_pedido.producto_id` references `productos.id`.
