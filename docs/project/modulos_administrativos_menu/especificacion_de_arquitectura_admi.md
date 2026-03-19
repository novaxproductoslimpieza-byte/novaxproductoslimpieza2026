Especificación de Arquitectura: Estándar AdminCrudModule y Catálogo de Módulos NOVAX

La madurez del ecosistema NOVAX reside en su capacidad para escalar de forma predecible y robusta. La implementación del estándar AdminCrudModule no es una sugerencia estética, sino una directriz técnica obligatoria. La uniformidad técnica en la gestión de entidades garantiza que el mantenimiento sea sostenible y que la curva de aprendizaje para nuevos desarrolladores e usuarios finales se reduzca al mínimo, permitiendo que el sistema evolucione sin comprometer la integridad operativa.


--------------------------------------------------------------------------------


1. Fundamentos del Estándar AdminCrudModule

1.1 Filosofía y Propósito del Modelo

El AdminCrudModule (o EntityCrudModule) actúa como el núcleo arquitectónico para todas las interfaces administrativas de NOVAX. Su propósito es centralizar la lógica de persistencia y manipulación de datos, aplicando el Principio de Abierto/Cerrado (Open/Closed Principle): los módulos específicos extienden las funcionalidades de la base sin modificar el código core. Esto evita la duplicación de lógica y asegura que cualquier optimización en el motor de búsqueda o validación se propague automáticamente a todo el sistema.

1.2 Operaciones Mandatarias

Todo módulo administrativo debe implementar rigurosamente las siguientes operaciones para cumplir con la certificación del estándar:

Operación	Descripción	Estado
Crear	Registro de nuevas entidades en la persistencia.	Obligatorio
Buscar/Listar	Visualización de registros con soporte para filtros y paginación.	Obligatorio
Ver detalle	Exposición de la totalidad de atributos de un registro.	Obligatorio
Actualizar	Modificación de datos de registros existentes.	Obligatorio
Eliminar	Borrado lógico o físico según la regla de negocio.	Obligatorio
Imprimir	Generación de documentos (ej. PDF de Pedidos o Reportes).	Opcional
Cambiar estado	Transición en el flujo de proceso (ej. de Pendiente a Entregado).	Opcional

1.3 Lógica de Sesión y Control de Navegación

La integridad de los procesos administrativos depende de un control estricto de la sesión y el estado de la interfaz:

* Lógica de Carrito y Sesión: Por seguridad operativa, el ícono del carrito debe permanecer desactivado cuando el usuario ingresa por primera vez sin autenticarse. Tras el login, el carrito se activa. Al cerrar la sesión, el contador de pedidos debe resetearse a cero y el estado debe volver a la configuración inicial de invitado.
* Bloqueo de Interfaz: Al activar un módulo administrativo, el sistema debe bloquear el acceso al menú principal (Sidebar) y al Navbar para prevenir inconsistencias de datos.
* Reglas de Salida: La navegación externa queda inhabilitada hasta que el proceso actual finalice formalmente. El usuario solo puede recuperar el control mediante los métodos internos: Guardar, Cancelar, Salir o Cerrar.
* Confirmación de Persistencia: Si existen cambios sin guardar, el sistema debe disparar una advertencia antes de permitir cualquier acción que destruya el estado actual.


--------------------------------------------------------------------------------


2. Arquitectura de Componentes del Frontend

2.1 Layout Base y Estructura Visual

El frontend de NOVAX utiliza un Layout Base Reutilizable que integra el Navbar principal y el Sidebar de administración. Dentro de este contenedor, cada módulo se organiza jerárquicamente:

1. Cabecera del Módulo (AdminHeader):
  * Título del Módulo: Identificador unívoco del contexto.
  * Breadcrumb: Ruta de navegación jerárquica.
  * Botón Crear: Acceso al formulario de nueva entidad.
  * Botón Actualizar: Gatilla el refresco de datos del módulo desde el servidor.
2. Panel de Búsqueda y Filtros: Búsqueda rápida por texto, filtros por estado y rangos de fechas.
3. Tabla de Resultados (DataTable): Presentación de datos con paginación obligatoria.
4. Panel de Formulario: Desplegado como página completa, modal o panel lateral según la complejidad.

2.2 Sistema de Formulación y Validación

Los formularios deben implementar los botones estándar: Guardar, Cancelar, Salir y Eliminar. La robustez se garantiza mediante una validación dual:

* Validaciones de Interfaz (Frontend): Campos obligatorios, tipos de datos (email, fecha), y rangos (ej. stock > 0).
* Validaciones de Integridad (Backend): Verificación de duplicados (códigos únicos) y Relaciones Existentes (ej. no permitir asignar un pedido a un cliente inválido o inexistente).

2.3 Componentes Reutilizables y Semántica Visual

Para garantizar la cohesión, se emplean los siguientes componentes definidos en el adminLayout:

Componente	Función Técnica
AdminHeader	Gestiona el contexto visual y acciones de cabecera.
SearchBar	Centraliza la lógica de filtrado por texto y parámetros.
DataTable	Renderiza los datos. Columnas Mandatarias: ID, Nombre, Fecha, Estado y Acciones.
FormContainer	Contenedor de inputs con gestión de estados.
FormActions	Componente de botonera estandarizada (Guardar/Cancelar/Salir/Cerrar).
StatusBadge	Indicador semántico de estado.

Guía de Colores de Badges

* Verde: Activo / Finalizado.
* Gris: Inactivo.
* Amarillo: Pendiente de acción.
* Azul: En proceso de ejecución.
* Rojo: Cancelado o Error.


--------------------------------------------------------------------------------


3. Catálogo Técnico de Módulos Administrativos

Cada módulo listado a continuación es una implementación específica que hereda las propiedades del AdminCrudModule.

3.1 Eje Comercial y Operativo

Ficha Técnica	Detalle
Nombre	Pedidos
Ruta	admin/order
Propósito	Gestión del flujo transaccional y comercial.
Funciones	Crear, buscar, editar, cambiar estado, eliminar e imprimir.
Relación	Clientes (asociación de pedido) y Productos (ítems del detalle).

Ficha Técnica	Detalle
Nombre	Clientes
Ruta	admin/clients
Propósito	Administración del padrón de compradores.
Funciones	Gestión de perfil, actualización de datos y vista de historial.
Relación	Pedidos (historial) y Geoubicación Cliente.

Ficha Técnica	Detalle
Nombre	Productos y Categorización
Ruta	admin/products, admin/categories, admin/subcategorias
Propósito	Control del inventario y jerarquía comercial.
Funciones	CRUD completo de productos y gestión de niveles de grupo/subgrupo.
Relación	Categorías (padre de Subcategorías) y Subcategorías (padre de Productos).

3.2 Eje de Configuración, Seguridad y Control

Ficha Técnica	Detalle
Nombre	Seguridad (Usuarios y Roles)
Ruta	admin/register / admin/roles
Propósito	Control de acceso y gobierno de privilegios.
Funciones	Registro de personal, definición de roles y asignación de permisos.
Relación	Transversal a todos los módulos mediante el middleware de permisos.

Ficha Técnica	Detalle
Nombre	Dashboard Principal
Ruta	admin
Propósito	Centro de comando y monitoreo de indicadores (KPIs).
Funciones	Visualización de ventas, pedidos recientes y accesos rápidos.
Relación	Consume datos de Pedidos, Clientes y Productos.

3.3 Eje de Geoubicación

Ficha Técnica	Detalle
Nombre	Inteligencia Territorial
Ruta	admin/geoubicacion/cliente, admin/geoubicacion
Propósito	Gestión de coordenadas y mapas de calor de ventas.
Funciones	Registro de latitud/longitud y filtrado espacial por zona.
Relación	Clientes (punto de entrega) y Estructura Territorial.

Ficha Técnica	Detalle
Nombre	Estructura Territorial
Ruta	.../departamentos, .../provincias, .../zonas
Propósito	Organización jerárquica de la logística.
Funciones	Gestión de divisiones geográficas.
Relación	Departamentos (contiene Provincias) -> Provincias (contiene Zonas).


--------------------------------------------------------------------------------


4. Hoja de Ruta de Implementación y Escalabilidad

El desarrollo de NOVAX se rige por un cronograma de dependencia lógica, asegurando que los cimientos técnicos existan antes de las funciones de usuario final.

4.1 Fases de Desarrollo

1. Fase 1: Base Crítica: Implementación del Dashboard y catálogo maestro de Productos (Categorías/Subcategorías).
2. Fase 2: Gestión Operativa: Despliegue de Clientes y Pedidos para habilitar la facturación.
3. Fase 3: Blindaje de Seguridad: Módulos de Usuarios y Roles para control de acceso granular.
4. Fase 4: Optimización Logística: Implementación del eje de Geoubicación y mapas.
5. Fase 5: Inteligencia de Negocio: Reportes avanzados de ventas, stock y analítica de clientes.

4.2 Metodología por Módulo

Cada implementación debe seguir este flujo vital: Diseño Visual -> Lógica CRUD -> Aplicación de Validaciones (Dual) -> Integración con Backend -> Pruebas Funcionales.

4.3 Estructura de Archivos Recomendada

Para mantener la escalabilidad, se establece la siguiente organización en el directorio modules/:

* _baseCrud/: Directorio protegido que contiene BaseForm, BaseTable, BaseFilters y BaseValidation.
* pedidos/, productos/, clientes/: Carpetas específicas que heredan y extienden el comportamiento de _baseCrud.

Esta especificación técnica constituye el estándar innegociable para el ecosistema NOVAX. Al adherirse a esta arquitectura, garantizamos un sistema robusto, mantenible y preparado para las demandas futuras del mercado global.
