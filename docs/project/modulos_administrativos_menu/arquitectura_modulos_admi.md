Especificación de Arquitectura: Estándar AdminCrudModule - Sistema NOVAX

1. Fundamentos y Objetivos del Modelo AdminCrudModule

La arquitectura del ecosistema NOVAX exige una estandarización rigurosa de sus módulos administrativos para garantizar la escalabilidad y la integridad operativa a largo plazo. El estándar AdminCrudModule no es simplemente una guía de diseño, sino un marco de trabajo (framework) imperativo diseñado para mitigar la deuda técnica y desacoplar la lógica de negocio de la gestión de interfaces. La uniformidad técnica aquí descrita es el mecanismo principal para acelerar los ciclos de desarrollo, permitiendo que nuevas entidades se integren sin comprometer la estabilidad global del sistema.

* Propósito Central: Implementar un modelo estándar reutilizable (basado en la sección 22.2 del contexto) que funcione como el núcleo operativo para la gestión de entidades administrativas, asegurando una estructura predecible en formularios, tablas y flujos de datos.
* Análisis de Objetivos Estratégicos:
  * Consistencia Sistémica: Homogeneizar la interacción del usuario para reducir la carga cognitiva y eliminar errores operativos derivados de interfaces heterogéneas.
  * Reutilización de Componentes: Desacoplar la lógica específica de la entidad del manejo del estado de la interfaz, lo que mitiga el riesgo de regresiones durante actualizaciones globales.
  * Eficiencia de Desarrollo: Optimizar el despliegue de nuevos módulos mediante el uso de plantillas de código base, permitiendo una respuesta ágil a los requerimientos de negocio.
  * Escalabilidad Estructural: Establecer una taxonomía técnica que soporte el crecimiento modular del sistema NOVAX sin degradar el rendimiento o la mantenibilidad.

Esta base técnica es la que habilita la operatividad de los módulos detallados a continuación, garantizando que cada componente sea una pieza atómica y predecible del sistema.

2. Arquitectura Lógica y Operaciones Estándar (CRUD)

Para asegurar la integridad transaccional y la persistencia de datos, la implementación de cada módulo debe seguir un flujo lógico predecible. La predictibilidad en las operaciones CRUD es la salvaguarda fundamental contra la corrupción de datos y las inconsistencias de estado en el sistema.

Especificación de Operaciones

Todo módulo bajo el estándar AdminCrudModule debe implementar las siguientes operaciones con su respectivo impacto sistémico:

Operación	Descripción	Impacto en el Sistema
Crear	Registro de una nueva entidad.	Inserción atómica y activación de reglas de integridad referencial.
Buscar/Listar	Recuperación y filtrado de registros.	Optimización de lectura mediante índices y gestión de concurrencia.
Ver Detalle	Visualización exhaustiva de un registro.	Carga de datos extendidos sin afectar el estado de persistencia.
Actualizar	Modificación de datos existentes.	Gestión de persistencia de estado y control de versiones del registro.
Eliminar	Remoción (lógica o física).	Depuración del catálogo y mantenimiento de la integridad relacional.
Imprimir	Generación de documentos (Opcional).	Exportación de datos a formatos portables (PDF/Físico).
Cambiar Estado	Gestión del flujo operativo (Opcional).	Ejecución de transiciones de estado lógico (ej. Activo/Inactivo).

Componentes Reutilizables

La arquitectura se sustenta en componentes modulares que deben ser extendidos en cada implementación:

1. EntityTable: Gestión de la representación tabular de datos, paginación y ordenamiento.
2. EntityForm: Contenedor estandarizado para la edición y captura de información.
3. EntityFilters: Herramientas de segmentación y localización de registros.
4. EntityActions: Set de controles de flujo (Guardar, Cancelar, Salir, Eliminar).
5. StatusBadge: Indicador visual normalizado para la comunicación del estado del registro.

Validaciones y Reglas de Datos

La fiabilidad de la información es innegociable. La implementación debe ejecutar una validación dual:

* Frontend: Proporcionar feedback inmediato al operador para mejorar la UX.
* Backend: Garantizar la seguridad y la integridad final antes de la persistencia.
* Estándares Obligatorios: Se deben incluir validaciones para campos obligatorios, tipos de datos (fechas, numéricos), rangos (ej. Cantidad > 0) y unicidad de registros (ej. Código Único).

3. Estructura Visual y Jerarquía del Panel Administrativo

La consistencia visual en el frontend de NOVAX es una extensión directa de su lógica interna. El diseño debe ser estrictamente responsivo y seguir una jerarquía que reduzca la curva de aprendizaje del usuario administrativo.

Desglose del Layout Base

La organización jerárquica (Layout Base) se divide en:

* Navbar: Control global y estado de sesión.
* Sidebar: Navegación centralizada de módulos administrativos.
* Contenido: Área de trabajo donde se despliega el módulo activo, presidido por la Cabecera del módulo (compuesta por: Título, Breadcrumb, Botón Crear y Botón Actualizar).

Anatomía del Módulo y Presentación

La secuencia visual estándar sigue este flujo:

1. Cabecera del módulo: Identificación y acciones rápidas.
2. Panel de búsqueda/filtros: Segmentación dinámica de la información.
3. Tabla de resultados (EntityTable): Visualización de datos y acciones por fila.
4. Paginación: Control de volumen de datos.
5. Panel de formulario (EntityForm): Según la complejidad, el desarrollador debe seleccionar uno de los tres tipos de presentación: Página completa (formularios complejos), Modal grande (formularios estándar) o Panel lateral (ediciones rápidas).

Sistema de Indicadores Visuales (StatusBadge)

Para normalizar la lectura de estados, se establece la siguiente matriz de colores y significados:

Estado	Color Sugerido	Significado Operativo
Activo	Verde	Registro operativo y habilitado para transacciones.
Inactivo	Gris	Registro deshabilitado; no disponible para procesos.
Pendiente	Amarillo	Requiere intervención o validación administrativa.
En proceso	Azul	Acción o flujo de trabajo en ejecución.
Cancelado	Rojo	Transacción anulada permanentemente.

4. Agrupación de Módulos y Jerarquía del Menú

La taxonomía de módulos en NOVAX responde a una organización lógica por áreas de negocio, facilitando una navegación intuitiva y una segregación de funciones eficiente.

Mapa de Clasificación por Áreas

1. Comercial: Gestión de ingresos y catálogo (Pedidos, Clientes, Productos, Categorías, Subcategorías).
2. Configuración y Seguridad: Gestión de acceso (Usuarios, Roles y Permisos).
3. Geoubicación: Logística y territorio (Mapa de Clientes, Departamentos, Provincias, Zonas, Geoubicación Cliente).
4. Reportes: Inteligencia de datos (Ventas, Stock, Clientes).

Matriz de Referencias y Rutas

Todo módulo administrativo debe responder a su ruta estandarizada:

Nombre del Módulo	Dirección (Ruta)	Función Principal
Dashboard Principal	admin	Resumen de KPIs y estado del sistema.
Pedidos	admin/order	Gestión del flujo de ventas y estados de pedidos.
Clientes	admin/clients	Administración de cartera y registro de clientes.
Productos	admin/products	Gestión del catálogo técnico y existencias.
Categorías	admin/categories	Clasificación de grupos de productos.
Subcategorías	admin/subcategorias	Gestión de subgrupos de productos.
Usuarios	admin/register	Control de cuentas de acceso y credenciales.
Roles y Permisos	admin/roles	Definición de niveles de acceso y perfiles.
Geoubicación Cliente	admin/geoubicacion/cliente	Asociación de coordenadas a clientes específicos.
Mapa de Clientes	admin/geoubicacion	Visualización geográfica de la cartera.
Departamentos	admin/geoubicacion/departamentos	Gestión de divisiones geográficas primarias.
Provincias	admin/geoubicacion/provincias	Gestión de divisiones territoriales secundarias.
Zonas	admin/geoubicacion/zonas	Administración de sectores o zonas de venta.
Reporte de Ventas	admin/reportes/ventas	Análisis de ingresos y exportación financiera.
Reporte de Stock	admin/reportes/stock	Consulta de inventarios y almacenes.
Reporte de Clientes	admin/reportes/clientes	Análisis de comportamiento de la cartera.

5. Reglas de Navegación, Estado y Dependencias

La seguridad transaccional y la prevención de pérdida de datos son prioridades críticas. El sistema debe imponer controles estrictos sobre el estado de la sesión y la navegación del usuario.

Lógica de Sesión y Carrito

* Estado de Autenticación: El icono del carrito debe permanecer desactivado para usuarios invitados.
* Activación: El carrito solo se activa tras un inicio de sesión exitoso.
* Reseteo de Seguridad: Al cerrar sesión, el sistema debe ejecutar un reset total de la sesión, estableciendo el carrito a cero pedidos y redirigiendo obligatoriamente a la página de inicio para proteger la privacidad de la información.

Mecanismos de Bloqueo de Navegación

Para asegurar que los procesos administrativos sean atómicos, se aplican las siguientes reglas:

1. Bloqueo de Menú: El menú principal de navegación queda inhabilitado mientras un formulario de edición o creación esté activo.
2. Bloqueo de Interfaz: Se debe impedir el acceso a cualquier otra sección de la página web base hasta que el módulo actual sea cerrado.
3. Confirmación de Salida: Si el estado isDirty es verdadero (existen cambios sin guardar), la implementación debe disparar un diálogo de confirmación de salida.
4. Finalización Obligatoria: El control solo se devuelve al sistema base mediante las acciones explícitas: Guardar, Cancelar o Salir.

6. Cronograma de Implementación y Prioridades Técnicas

El despliegue de los módulos sigue un orden lógico basado en dependencias de datos. No se puede implementar la gestión comercial sin antes haber establecido los catálogos base.

Análisis de Prioridades

Prioridad	Módulo	Ruta Correspondiente
Alta	Dashboard, Productos, Categorías, Subcategorías, Clientes, Pedidos	admin, admin/products, admin/categories, admin/subcategorias, admin/clients, admin/order
Media	Usuarios, Roles, Geoubicación (todos sus sub-módulos)	admin/register, admin/roles, admin/geoubicacion/...
Baja	Reportes (Ventas, Stock, Clientes)	admin/reportes/...

Fases del Proyecto

* Fase 1: Base del Sistema: Implementación del Dashboard y estructura jerárquica de catálogos (Productos, Categorías, Subcategorías).
* Fase 2: Gestión Comercial: Despliegue de los módulos transaccionales de Clientes y Pedidos.
* Fase 3: Seguridad: Configuración de Usuarios y la matriz de Roles y Permisos.
* Fase 4: Geoubicación: Implementación de la infraestructura territorial (Mapa, Departamentos, Provincias, Zonas).
* Fase 5: Reportes: Desarrollo de herramientas de análisis y exportación de datos.

Metodología de Avance

Cada módulo debe superar obligatoriamente cinco etapas: Diseño Visual -> Implementación CRUD -> Validaciones (Frontend/Backend) -> Integración con API/Backend -> Pruebas de QA.

Conclusión Final: El cumplimiento estricto de este estándar arquitectónico es el único camino para asegurar que el ecosistema NOVAX sea escalable, profesional y libre de inconsistencias operativas.
