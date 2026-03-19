Se presenta un conjunto de **casos de estudio tipo QA (Quality Assurance)** diseñados para validar el sistema NOVAX en condiciones reales. Están estructurados para pruebas funcionales, operativas y de negocio.

---

# 1. METODOLOGÍA QA APLICADA

Cada caso incluye:

- **ID**
- **Escenario**
- **Precondiciones**
- **Pasos**
- **Resultado esperado**
- **Criterio de aceptación**

---

# 2. CASOS DE PRUEBA – MÓDULO VENTAS

## 2.1 Creación de pedido

| Campo              | Detalle                                                                   |
| ------------------ | ------------------------------------------------------------------------- |
| ID                 | QA-VENT-001                                                               |
| Escenario          | Crear pedido correctamente                                                |
| Precondición       | Cliente y productos registrados                                           |
| Pasos              | 1. Seleccionar cliente <br> 2. Agregar productos <br> 3. Confirmar pedido |
| Resultado esperado | Pedido registrado con ID único                                            |
| Criterio           | Se guarda sin errores                                                     |

---

## 2.2 Validación de stock

| Campo              | Detalle                                            |
| ------------------ | -------------------------------------------------- |
| ID                 | QA-VENT-002                                        |
| Escenario          | Intentar vender sin stock                          |
| Precondición       | Producto con stock = 0                             |
| Pasos              | 1. Crear pedido <br> 2. Agregar producto sin stock |
| Resultado esperado | Sistema bloquea la venta                           |
| Criterio           | Mensaje: “Stock insuficiente”                      |

---

## 2.3 Descuento automático de stock

| Campo              | Detalle                               |
| ------------------ | ------------------------------------- |
| ID                 | QA-VENT-003                           |
| Escenario          | Confirmar pedido                      |
| Precondición       | Stock disponible                      |
| Pasos              | Confirmar pedido                      |
| Resultado esperado | Stock disminuye automáticamente       |
| Criterio           | Inventario actualizado en tiempo real |

---

## 2.4 Cancelación de pedido

| Campo              | Detalle                     |
| ------------------ | --------------------------- |
| ID                 | QA-VENT-004                 |
| Escenario          | Cancelar pedido pendiente   |
| Precondición       | Pedido no entregado         |
| Pasos              | Cancelar pedido             |
| Resultado esperado | Pedido cambia a “cancelado” |
| Criterio           | Stock se restituye          |

---

## 2.5 Restricción de eliminación

| Campo              | Detalle                   |
| ------------------ | ------------------------- |
| ID                 | QA-VENT-005               |
| Escenario          | Eliminar pedido entregado |
| Precondición       | Pedido entregado          |
| Pasos              | Intentar eliminar         |
| Resultado esperado | Sistema bloquea acción    |
| Criterio           | Mensaje de restricción    |

---

# 3. CASOS DE PRUEBA – CLIENTES

## 3.1 Registro de cliente

| ID                 | QA-CLI-001                       |
| ------------------ | -------------------------------- |
| Escenario          | Crear cliente                    |
| Resultado esperado | Cliente registrado correctamente |

---

## 3.2 Geolocalización

| ID                 | QA-CLI-002              |
| ------------------ | ----------------------- |
| Escenario          | Registrar ubicación     |
| Resultado esperado | Cliente visible en mapa |

---

## 3.3 Historial de compras

| ID                 | QA-CLI-003                 |
| ------------------ | -------------------------- |
| Escenario          | Consultar historial        |
| Resultado esperado | Lista de pedidos asociados |

---

# 4. CASOS DE PRUEBA – INVENTARIO

## 4.1 Entrada de stock

| ID                 | QA-INV-001        |
| ------------------ | ----------------- |
| Escenario          | Registrar ingreso |
| Resultado esperado | Stock incrementa  |

---

## 4.2 Salida automática

| ID                 | QA-INV-002      |
| ------------------ | --------------- |
| Escenario          | Venta realizada |
| Resultado esperado | Stock disminuye |

---

## 4.3 Alerta de stock mínimo

| ID                 | QA-INV-003            |
| ------------------ | --------------------- |
| Escenario          | Stock bajo            |
| Resultado esperado | Sistema genera alerta |

---

# 5. CASOS DE PRUEBA – DISTRIBUCIÓN

## 5.1 Asignación de pedidos

| ID                 | QA-DIST-001                    |
| ------------------ | ------------------------------ |
| Escenario          | Asignar pedido a ruta          |
| Resultado esperado | Pedido visible en distribución |

---

## 5.2 Cambio de estado de entrega

| ID                 | QA-DIST-002           |
| ------------------ | --------------------- |
| Escenario          | Marcar como entregado |
| Resultado esperado | Estado actualizado    |

---

## 5.3 Visualización en mapa

| ID                 | QA-DIST-003          |
| ------------------ | -------------------- |
| Escenario          | Ver clientes en mapa |
| Resultado esperado | Ubicación correcta   |

---

# 6. CASOS DE PRUEBA – ADMINISTRACIÓN

## 6.1 Creación de usuario

| ID                 | QA-ADM-001         |
| ------------------ | ------------------ |
| Escenario          | Crear usuario      |
| Resultado esperado | Usuario registrado |

---

## 6.2 Control de acceso

| ID                 | QA-ADM-002           |
| ------------------ | -------------------- |
| Escenario          | Usuario sin permisos |
| Resultado esperado | Acceso denegado      |

---

# 7. CASOS DE PRUEBA – EXPERIENCIA DE USUARIO (UX)

## 7.1 Navegación

| ID                 | QA-UX-001          |
| ------------------ | ------------------ |
| Escenario          | Uso en PC/móvil    |
| Resultado esperado | Interfaz adaptable |

---

## 7.2 Tiempo de respuesta

| ID                 | QA-UX-002      |
| ------------------ | -------------- |
| Escenario          | Cargar pedidos |
| Resultado esperado | < 2 segundos   |

---

# 8. CASOS DE PRUEBA – NEGOCIO (CRÍTICOS)

## 8.1 Seguimiento de pedidos

| ID                 | QA-BIZ-001              |
| ------------------ | ----------------------- |
| Escenario          | Cliente consulta pedido |
| Resultado esperado | Estado visible          |

---

## 8.2 Análisis de ventas

| ID                 | QA-BIZ-002                |
| ------------------ | ------------------------- |
| Escenario          | Comparar ventas mensuales |
| Resultado esperado | Datos correctos           |

---

## 8.3 Identificación de clientes inactivos

| ID                 | QA-BIZ-003            |
| ------------------ | --------------------- |
| Escenario          | Cliente sin compras   |
| Resultado esperado | Detectado por sistema |

---

# 9. CASOS CRÍTICOS DE FALLA (NEGATIVOS)

| ID         | Escenario         | Resultado esperado |
| ---------- | ----------------- | ------------------ |
| QA-ERR-001 | Sin internet      | Mensaje de error   |
| QA-ERR-002 | Datos incompletos | Validación         |
| QA-ERR-003 | Doble clic pedido | No duplicar        |
| QA-ERR-004 | Caída de servidor | Manejo de error    |

---

# 10. CRITERIOS DE ACEPTACIÓN GLOBAL

El sistema es aceptable si:

- No permite ventas sin stock
- Controla pedidos correctamente
- Mantiene integridad de datos
- Funciona en PC y móvil
- Responde en tiempos aceptables

---

# 11. CONCLUSIÓN QA

Estos casos validan:

```plaintext id="r3m8ep"
Funcionalidad + Operación + Experiencia + Negocio
```

No solo prueban que el sistema funcione, sino que:

- Sirva al cliente
- Sirva al negocio
- Permita crecer

---

# 12. SIGUIENTE NIVEL RECOMENDADO

Para continuar de forma profesional:

1. **Historias de usuario (SCRUM)** → desarrollo ordenado
2. **Matriz de trazabilidad (requisito → prueba)**
3. **Checklist QA para producción**
4. **Pruebas automatizadas (si escalarás)**

Se desarrollan los **4 niveles solicitados** con enfoque profesional para implementación real y validación completa del sistema NOVAX.

---

# 1. HISTORIAS DE USUARIO (SCRUM)

Formato:
**Como [rol], quiero [funcionalidad], para [beneficio]**

---

## 1.1 Módulo Ventas

| ID          | Historia de Usuario                                                                   | Criterio de Aceptación         |
| ----------- | ------------------------------------------------------------------------------------- | ------------------------------ |
| US-VENT-001 | Como vendedor, quiero crear un pedido rápidamente, para atender al cliente sin demora | Pedido creado < 2 min          |
| US-VENT-002 | Como sistema, quiero validar el stock antes de vender, para evitar errores            | Bloquea sin stock              |
| US-VENT-003 | Como usuario, quiero imprimir el pedido, para entregarlo al cliente                   | PDF generado correctamente     |
| US-VENT-004 | Como vendedor, quiero cancelar pedidos pendientes, para corregir errores              | Cambia estado + devuelve stock |

---

## 1.2 Clientes

| ID         | Historia                                                                 | Criterio          |
| ---------- | ------------------------------------------------------------------------ | ----------------- |
| US-CLI-001 | Como usuario, quiero registrar clientes, para venderles                  | Guardado correcto |
| US-CLI-002 | Como vendedor, quiero ver historial de compras, para entender al cliente | Lista visible     |
| US-CLI-003 | Como admin, quiero ubicar clientes en mapa, para optimizar rutas         | Mapa funcional    |

---

## 1.3 Inventario

| ID         | Historia                                                                     | Criterio                |
| ---------- | ---------------------------------------------------------------------------- | ----------------------- |
| US-INV-001 | Como sistema, quiero actualizar stock automáticamente, para mantener control | Sincronización correcta |
| US-INV-002 | Como admin, quiero ver stock actual, para tomar decisiones                   | Datos en tiempo real    |
| US-INV-003 | Como sistema, quiero alertar bajo stock, para evitar quiebres                | Alerta visible          |

---

## 1.4 Distribución

| ID          | Historia                                                        | Criterio            |
| ----------- | --------------------------------------------------------------- | ------------------- |
| US-DIST-001 | Como operador, quiero asignar pedidos, para organizarlos        | Asignación correcta |
| US-DIST-002 | Como repartidor, quiero ver pedidos asignados, para entregarlos | Lista visible       |
| US-DIST-003 | Como cliente, quiero saber estado de entrega, para seguimiento  | Estado actualizado  |

---

## 1.5 Administración

| ID         | Historia                                                 | Criterio           |
| ---------- | -------------------------------------------------------- | ------------------ |
| US-ADM-001 | Como admin, quiero crear usuarios, para controlar acceso | Usuario creado     |
| US-ADM-002 | Como admin, quiero asignar roles, para seguridad         | Permisos aplicados |

---

# 2. MATRIZ DE TRAZABILIDAD

Relación: **Requisito → Historia → Caso QA**

| Requisito         | Historia    | Caso QA     |
| ----------------- | ----------- | ----------- |
| Crear pedido      | US-VENT-001 | QA-VENT-001 |
| Validar stock     | US-VENT-002 | QA-VENT-002 |
| Descontar stock   | US-INV-001  | QA-VENT-003 |
| Cancelar pedido   | US-VENT-004 | QA-VENT-004 |
| Registro cliente  | US-CLI-001  | QA-CLI-001  |
| Historial cliente | US-CLI-002  | QA-CLI-003  |
| Geolocalización   | US-CLI-003  | QA-CLI-002  |
| Control stock     | US-INV-002  | QA-INV-001  |
| Alertas           | US-INV-003  | QA-INV-003  |
| Distribución      | US-DIST-001 | QA-DIST-001 |

---

# 3. CHECKLIST QA PARA PRODUCCIÓN

## 3.1 FUNCIONALIDAD

| Item                | Validado |
| ------------------- | -------- |
| Crear pedidos       | ☐        |
| Editar pedidos      | ☐        |
| Cancelar pedidos    | ☐        |
| Validación de stock | ☐        |
| Impresión           | ☐        |

---

## 3.2 INVENTARIO

| Item                  | Validado |
| --------------------- | -------- |
| Stock en tiempo real  | ☐        |
| Movimientos correctos | ☐        |
| Alertas activas       | ☐        |

---

## 3.3 CLIENTES

| Item      | Validado |
| --------- | -------- |
| Registro  | ☐        |
| Historial | ☐        |
| Ubicación | ☐        |

---

## 3.4 SEGURIDAD

| Item                   | Validado |
| ---------------------- | -------- |
| Login                  | ☐        |
| Roles                  | ☐        |
| Restricción de accesos | ☐        |

---

## 3.5 RENDIMIENTO

| Item              | Validado |
| ----------------- | -------- |
| Carga < 2s        | ☐        |
| Sin errores       | ☐        |
| Funciona en móvil | ☐        |

---

## 3.6 EXPERIENCIA USUARIO

| Item             | Validado |
| ---------------- | -------- |
| Navegación clara | ☐        |
| Flujo simple     | ☐        |
| Sin confusión    | ☐        |

---

# 4. PRUEBAS AUTOMATIZADAS (ESTRATEGIA)

## 4.1 TIPOS DE PRUEBA

| Tipo        | Herramienta recomendada | Uso            |
| ----------- | ----------------------- | -------------- |
| Unitarias   | Jest                    | Funciones      |
| Integración | Supertest               | API            |
| End-to-End  | Cypress / Playwright    | Flujo completo |

---

## 4.2 CASOS AUTOMATIZABLES PRIORITARIOS

| Caso                  | Tipo        |
| --------------------- | ----------- |
| Crear pedido          | E2E         |
| Validar stock         | Integración |
| Login                 | E2E         |
| Registro cliente      | E2E         |
| Actualizar inventario | Unitario    |

---

## 4.3 EJEMPLO (E2E - PEDIDO)

```js id="v0l2bn"
describe("Crear Pedido", () => {
  it("debe crear un pedido correctamente", () => {
    cy.visit("/ventas");
    cy.get("[data-test=cliente]").select("Cliente 1");
    cy.get("[data-test=producto]").select("Detergente");
    cy.get("[data-test=confirmar]").click();
    cy.contains("Pedido creado");
  });
});
```

---

## 4.4 AUTOMATIZACIÓN MÍNIMA VIABLE

Implementar:

- 5 pruebas E2E críticas
- 5 pruebas de API
- 10 pruebas unitarias

---

# 5. CONCLUSIÓN

Con estos 4 elementos tienes:

```plaintext id="n9z26n"
Control total del desarrollo + validación + calidad del sistema
```

Esto permite:

- Evitar errores en producción
- Asegurar funcionamiento real
- Tener control técnico y de negocio
- Escalar sin romper el sistema

---

# 6. SIGUIENTE PASO ESTRATÉGICO

Para continuar como proyecto serio:

1. Diseño de **base de datos profesional**
2. Arquitectura backend (API estructurada)
3. Estructura frontend completa (Next.js organizado)

Indica cuál desarrollamos.
