Especificación de Arquitectura: Estándar AdminCrudModule y Catálogo de Módulos NOVAX

1. Fundamentos del Estándar AdminCrudModule

El AdminCrudModule representa el pilar estructural de la arquitectura NOVAX. Como Arquitecto de Software, su implementación responde a la necesidad crítica de aplicar el principio DRY (Don't Repeat Yourself) y garantizar una Inversión de Control (IoC) efectiva en la gestión de entidades. Este modelo no es simplemente una plantilla, sino una "superclase" lógica que centraliza el comportamiento administrativo, mitigando la fragmentación del código y asegurando una experiencia de usuario (UX) predecible en todo el ecosistema.

Análisis del Modelo Base

El diseño técnico se rige por tres vectores estratégicos:

* Consistencia de Interfaz: Uniformidad en la interacción de datos, independientemente de la entidad gestionada.
* Modularidad basada en Herencia: Reducción del tiempo de comercialización (Time-to-Market) mediante la extensión de comportamientos base.
* Escalabilidad Estructural: Capacidad de integrar nuevas entidades administrativas sin alterar el núcleo del sistema, facilitando el mantenimiento preventivo y correctivo.

Componentes Reutilizables Core (modules/_baseCrud)

Para asegurar la integridad del sistema, todo módulo administrativo debe extender los componentes definidos en la estructura de carpetas estándar:

Componente	Carpeta Sugerida	Función Crítica y Valor Arquitectónico
BaseTable	BaseTable/	Renderizado de registros con lógica de ordenamiento y paginación centralizada.
BaseForm	BaseForm/	Orquestador de captura de datos con soporte para estados de creación y edición.
BaseFilters	BaseFilters/	Abstracción de criterios de búsqueda (texto, fechas, estados) para consultas eficientes.
BaseActions	BaseActions/	Despachador de eventos estandarizados para operaciones CRUD y acciones especiales.
BaseValidation	BaseValidation/	Motor de reglas de negocio que garantiza la calidad del dato antes de la persistencia.

Capa de Valor

La adopción de la arquitectura _baseCrud permite una gestión de estado centralizada. A diferencia de los módulos independientes, cualquier actualización en la lógica de validación o en la seguridad del formulario se propaga instantáneamente a todos los descendientes. Esto elimina la deuda técnica acumulada por duplicación y establece una base sólida para el crecimiento del proyecto NOVAX.


--------------------------------------------------------------------------------


2. Definición Operativa y Reglas de Validación

La gobernanza de datos en NOVAX exige que cada interacción con la base de datos sea auditable y uniforme. La estandarización de operaciones CRUD no es una sugerencia, sino un mandato operativo para mantener la integridad referencial.

Matriz de Operaciones CRUD

Operación	Tipo	Impacto en el Flujo de Trabajo
Crear	Obligatoria	Registro de nuevas entidades con validación inmediata.
Buscar/Listar	Obligatoria	Localización de información mediante el componente BaseFilters.
Ver detalle	Obligatoria	Visualización profunda de la entidad sin riesgo de modificación accidental.
Actualizar	Obligatoria	Edición controlada de registros existentes.
Eliminar	Obligatoria	Remoción de registros (lógica o física) sujeta a permisos de rol.
Imprimir	Opcional	Generación de reportes o documentos (específico para Pedidos/Reportes).
Cambiar estado	Opcional	Transición entre estados lógicos del proceso de negocio.

Sistema de Validaciones Estándar (BaseValidation)

El sistema implementa una ejecución dual (Frontend/Backend) como medida de seguridad redundante. Las reglas incluyen:

* Campos Obligatorios: Verificación de presencia de datos clave (ej. Nombre del producto).
* Integridad de Tipo: Validación estricta de formatos (Numérico, Email, Date).
* Restricciones de Rango: Control de límites lógicos (ej. Stock no puede ser < 0).
* Control de Unicidad: Bloqueo de duplicados en campos clave (ej. Código de producto, Email de usuario).
* Integridad Referencial: Validación de relaciones existentes (ej. el Cliente debe existir para procesar el Pedido).

Protocolo de Botones de Acción

Para minimizar el error humano, los formularios deben implementar esta botonera estricta:

1. Guardar: Ejecuta la persistencia y valida los datos.
2. Cancelar: Limpia el estado actual del formulario.
3. Salir: Retorna al usuario a la vista de lista (BaseTable).
4. Cerrar: Finaliza el proceso activo y libera el bloqueo de navegación.


--------------------------------------------------------------------------------


3. Arquitectura del Frontend y Experiencia de Usuario (UX)

El uso de un Layout Base Reutilizable reduce drásticamente la curva de aprendizaje. La uniformidad visual permite que un operador administrativo se familiarice con cualquier módulo de manera instantánea.

Estructura Visual del Módulo

* Cabecera (AdminHeader): Elemento superior que contiene Breadcrumbs (ruta de navegación), Título del módulo, y botones de acción primaria como "Crear" y "Actualizar".
* Panel de Búsqueda (SearchBar): Área dedicada a filtros rápidos y búsqueda por texto, posicionada sobre la tabla de resultados para facilitar el acceso.

Gestión de Estados Visuales (StatusBadge)

El uso de indicadores visuales es mandatorio para garantizar la coherencia semántica en todo el sistema:

Estado	Color Sugerido	Aplicación en NOVAX
Activo	Verde	Entidades operativas (Productos, Clientes).
Inactivo	Gris	Registros deshabilitados o históricos.
Pendiente	Amarillo	Pedidos por procesar o registros en revisión.
En proceso	Azul	Acciones en curso de ejecución.
Cancelado	Rojo	Operaciones anuladas o errores de sistema.

Capa de Valor

La predictibilidad visual no solo mejora la estética, sino que actúa como un filtro contra el error operativo. En entornos de alta carga, la estandarización de colores y posiciones de botones permite una ejecución "en piloto automático", aumentando la eficiencia del personal administrativo.


--------------------------------------------------------------------------------


4. Catálogo de Módulos: Gestión Comercial

Estos módulos constituyen el núcleo transaccional de NOVAX y deben implementar la estructura CRUD con integración total a la base de datos.

Análisis de Módulos

Módulo: Pedidos | Atributo | Detalle | Impacto Estratégico | | :--- | :--- | :--- | | Ruta | admin/order | Centro de ingresos del sistema. | | Funciones | CRUD, Cambiar estado, Imprimir. | Gestión del ciclo de vida de la venta. | | Campos | Nº Pedido, Cliente, Fecha, Estado, Total, Observaciones. | Trazabilidad completa de la transacción. |

Módulo: Clientes | Atributo | Detalle | Impacto Estratégico | | :--- | :--- | :--- | | Ruta | admin/clients | Activo principal de información. | | Funciones | CRUD, Ver historial de pedidos. | Análisis de comportamiento de compra. | | Campos | Nombre, Teléfono, Dirección, Ubicación, Estado. | Base para segmentación geográfica. |


--------------------------------------------------------------------------------


5. Catálogo de Módulos: Gestión de Productos y Categorías

La arquitectura jerárquica asegura que el inventario se organice de forma lógica, facilitando reportes y búsquedas.

Módulo	Ruta	Campos Críticos	Función Estratégica
Productos	admin/products	Código, Nombre, Categoría, Subcategoría, Precio, Stock, Estado.	Control detallado del inventario activo.
Categorías	admin/categories	Nombre del grupo, Descripción, Estado.	Segmentación de primer nivel (Macro).
Subcategorías	admin/subcategorias	Categoría Padre, Nombre, Descripción, Estado.	Clasificación granular de productos.


--------------------------------------------------------------------------------


6. Administración, Seguridad y Control de Acceso

NOVAX implementa un modelo de seguridad basado en roles para blindar la integridad de los datos financieros y comerciales.

* Usuarios (admin/register): Gestión de credenciales con campos obligatorios: Nombre, Email (único), Usuario, Contraseña y Rol.
* Roles y Permisos (admin/roles): Definición de perfiles de acceso mediante el campo Permisos, permitiendo una granularidad total sobre qué módulos puede ver o editar cada usuario.


--------------------------------------------------------------------------------


7. Sistema de Geoubicación y Organización Territorial

La geoubicación transforma direcciones estáticas en activos logísticos. Este módulo funciona como un overlay visual sobre la data de clientes para optimizar rutas y análisis territorial.

Módulo	Ruta	Dependencia / Relación	Propósito Técnico
Geoubicación Cliente	admin/geoubicacion/cliente	Asociado a Cliente	Registro de Latitud/Longitud y Dirección.
Mapa de Clientes	admin/geoubicacion	General	Visualización interactiva y filtros por zona.
Departamentos	admin/geoubicacion/departamentos	Raíz Territorial	Gestión de divisiones políticas mayores.
Provincias	admin/geoubicacion/provincias	Depto. Padre	Organización territorial intermedia.
Zonas	admin/geoubicacion/zonas	Prov. Padre	Segmentación logística final.


--------------------------------------------------------------------------------


8. Análisis de Negocio: Reportes y Dashboard

Herramientas de supervisión de nivel ejecutivo que consolidan la operación en información estratégica.

* Dashboard Principal (admin): Centro de mando con KPIs en tiempo real, resumen de ventas y accesos directos a los módulos de prioridad alta.
* Reporte de Ventas (admin/reportes/ventas): Filtrado avanzado por fecha, cliente y producto con capacidad de exportación e impresión.
* Reporte de Stock (admin/reportes/stock): Auditoría de existencias por producto y almacén para prevenir quiebres.
* Reporte de Clientes (admin/reportes/clientes): Análisis segmentado para estrategias de fidelización.


--------------------------------------------------------------------------------


9. Lógica de Navegación y Control de Sesión

Para garantizar que los procesos administrativos se completen sin interrupciones, NOVAX aplica un protocolo de bloqueo estricto.

1. Bloqueo de Navegación: Al activar un formulario, se deshabilita el menú principal y cualquier enlace externo. El sistema entra en un estado de "proceso activo" que solo se libera mediante los botones Guardar, Cancelar, Salir o Cerrar.
2. Confirmación de Salida: Si el usuario intenta abandonar un módulo con cambios pendientes, se disparará una advertencia de seguridad.
3. Gestión de Sesión y Carrito:
  * El icono del carrito está inactivo para usuarios no autenticados (Invitados).
  * Al cerrar sesión, el sistema ejecuta un reset total del carrito (0 pedidos).
  * Solo tras el inicio de sesión exitoso se habilita la funcionalidad comercial.


--------------------------------------------------------------------------------


10. Cronograma de Implementación y Prioridades

El despliegue se organiza en cinco fases para establecer primero la base operativa y luego la inteligencia de negocio.

Fase	Objetivo Principal	Prioridad	Módulos Clave
1. Base	Operatividad Esencial	Alta	Dashboard, Productos, Categorías, Subcategorías.
2. Comercial	Flujo de Ingresos	Alta	Clientes, Pedidos.
3. Seguridad	Control de Acceso	Media	Usuarios, Roles y Permisos.
4. Geoubicación	Inteligencia Logística	Media	Mapas, Departamentos, Provincias, Zonas.
5. Reportes	Análisis Estratégico	Baja	Reportes de Ventas, Stock y Clientes.

Conclusión

La arquitectura basada en el estándar AdminCrudModule asegura que el proyecto NOVAX escale con orden y eficiencia técnica. La uniformidad de sus componentes, sumada al estricto control de navegación y validación, garantiza un sistema administrativo robusto, profesional y orientado a resultados.
