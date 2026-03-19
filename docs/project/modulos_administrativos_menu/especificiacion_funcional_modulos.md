Especificación de Arquitectura Funcional: Estándar AdminCrudModule y Catálogo de Módulos NOVAX

1. Fundamentación Estratégica del Modelo AdminCrudModule

En el ecosistema ERP de NOVAX, la robustez operativa depende directamente de la predictibilidad de sus componentes. Como Arquitecto de Software, he definido el modelo AdminCrudModule (o EntityCrudModule) como el estándar mandatorio para el desarrollo de todas las interfaces administrativas. Esta decisión estratégica busca garantizar la uniformidad visual y la escalabilidad del sistema, permitiendo que la plataforma crezca en complejidad sin degradar la experiencia del usuario ni la mantenibilidad del código fuente.

La filosofía de "cero duplicación de lógica" es el pilar de este diseño. Al centralizar el comportamiento de los formularios, tablas y validaciones en una estructura base, reducimos drásticamente la deuda técnica y los errores de consistencia. Cada nuevo módulo que se integre al sistema no se construye desde cero, sino que extiende una lógica probada, asegurando que cualquier optimización en el núcleo del estándar se propague automáticamente a toda la suite administrativa.

Esta visión arquitectónica se traduce en un conjunto de definiciones técnicas y reglas de comportamiento que rigen la interacción con los datos.


--------------------------------------------------------------------------------


2. Definición Técnica del Estándar CRUD

El modelo AdminCrudModule constituye la plantilla base para toda entidad administrativa. Su implementación asegura que el flujo de datos sea consistente, desde la captura inicial hasta la persistencia en el backend.

2.1 Operaciones Obligatorias del Modelo

Cada entidad administrativa debe implementar este núcleo de operaciones para garantizar la integridad referencial y funcional:

Operación	Descripción Técnica	Impacto en el Flujo Administrativo
Crear	Registro de una nueva entidad.	Punto de entrada de datos al sistema.
Buscar/Listar	Visualización y filtrado de registros.	Auditoría y localización inmediata de información.
Ver detalle	Despliegue de la información completa.	Base para la toma de decisiones operativas.
Actualizar	Modificación de registros existentes.	Garantiza la vigencia y precisión de los datos.
Eliminar	Borrado o desactivación lógica.	Control de integridad y depuración de la base de datos.
Imprimir	Generación de documentos (Opcional).	Soporte para procesos físicos o comprobantes legales.
Cambiar estado	Gestión del ciclo de vida (Opcional).	Controla transiciones (ej. de "Pendiente" a "Entregado").

2.2 Botonera Estándar de Formulario

Para minimizar la curva de aprendizaje, todos los formularios emplearán una botonera idéntica:

* Guardar: Ejecuta la persistencia (Create/Update). Es la vía de salida confirmada.
* Cancelar: Limpia el formulario y revierte cambios no guardados.
* Salir: Cierra el módulo y retorna a la lista de registros.
* Cerrar: Finaliza el proceso activo de forma segura.
* Eliminar: Acción de borrado (requiere confirmación previa).
* Imprimir: Genera el documento asociado a la entidad.


--------------------------------------------------------------------------------


3. Arquitectura del Frontend y Componentes Reutilizables

La arquitectura visual de NOVAX se basa en un layout predecible. La uniformidad reduce el error humano y optimiza la navegación técnica.

3.1 Estructura de Carpetas Sugerida

Para cumplir con el principio de reutilización, se establece la siguiente jerarquía de archivos en el core del sistema:

modules/
└── _baseCrud/
    ├── BaseForm        # Plantilla de formularios validados
    ├── BaseTable       # Lógica de tablas con paginación
    ├── BaseFilters     # Componentes de búsqueda
    ├── BaseActions     # Agrupación de botones estándar
    └── BaseValidation  # Esquema de validaciones transversales


3.2 Componentes Reutilizables Core

* AdminHeader: Ubicado en la parte superior. Contiene el Título, el Breadcrumb (que muestra la ruta jerárquica exacta), el Botón Crear y el Botón Actualizar (para recarga forzada de datos).
* SearchBar: Panel de localización que integra búsqueda por texto, filtros de estado/categoría, Botón Limpiar (para restablecer filtros) y lógica de Paginación.
* DataTable: Tabla central con ordenamiento por columnas, paginación y acciones por fila (Ver, Editar, Eliminar, Imprimir).
* FormContainer: Contenedor adaptable (Página completa para procesos complejos, Modal para simples, Panel lateral para ediciones rápidas).
* StatusBadge: Indicadores visuales de estado:
  * Verde (Activo): Operatividad plena.
  * Gris (Inactivo): Registro deshabilitado.
  * Amarillo (Pendiente): Requiere atención.
  * Azul (En proceso): Transición activa.
  * Rojo (Cancelado): Proceso anulado.


--------------------------------------------------------------------------------


4. Lógica de Control de Navegación y Seguridad Operativa

La integridad de los datos en NOVAX es innegociable. Por ello, el sistema implementa un bloqueo total de la página web mientras un módulo administrativo está activo.

4.1 Reglas de Comportamiento

* Bloqueo de menú: Al abrir un formulario, el menú principal y la navegación externa se deshabilitan por completo.
* Finalización obligatoria: El usuario debe concluir el proceso activo (Guardar, Cancelar o Salir) para recuperar el control del sitio.
* Confirmación de salida: Se disparará una advertencia si se detectan cambios sin persistir antes de intentar cerrar el módulo.


--------------------------------------------------------------------------------


5. Catálogo Detallado de Módulos Administrativos

5.1 Gestión Comercial

* Pedidos (admin/order): Gestión del flujo de ventas.
  * Campos: Número de pedido, Cliente, Fecha, Estado, Total, Observaciones.
  * Operaciones: Cambio de estado e impresión de comprobantes.
* Clientes (admin/clients): Maestro de clientes.
  * Campos: Nombre, Teléfono, Dirección, Ubicación, Estado.
  * Acciones: Acceso directo al historial de pedidos.
* Productos (admin/products): Catálogo maestro.
  * Campos: Código, Nombre, Categoría, Subcategoría, Precio, Stock, Estado.

5.2 Estructura de Inventario (Jerarquizada)

* Categorías (admin/categories): Nombre, Descripción, Estado.
* Subcategorías (admin/subcategorias): Debe asociar obligatoriamente una Categoría existente.

5.3 Sistema de Geoubicación y Territorio

* Geoubicación Cliente (admin/geoubicacion/cliente): Registro de coordenadas. Campos: Cliente, Latitud, Longitud, Dirección.
* Mapa de Clientes (admin/geoubicacion): Visualización geográfica con Filtro por Zona.
* Departamentos (admin/geoubicacion/departamentos): Nombre, Código, Estado.
* Provincias (admin/geoubicacion/provincias): Requiere validación de Asociar Departamento.
* Zonas (admin/geoubicacion/zonas): Requiere validación de Asociar Provincia.

5.4 Seguridad y Acceso

* Usuarios (admin/register): Nombre, Email, Usuario, Contraseña, Rol, Estado.
* Roles (admin/roles): Definición de tipos de cuenta y asignación de permisos granulares.

5.5 Inteligencia de Negocio y Reportes

* Reporte de Ventas (admin/reportes/ventas): Filtros por fecha, cliente y producto. Exportación y formato de impresión.
* Reporte de Stock (admin/reportes/stock): Consulta por Almacén y Producto.
* Reporte de Clientes (admin/reportes/clientes): Análisis detallado y listado exportable.

5.6 Dashboard Principal (admin)

Panel de control con indicadores de rendimiento (KPIs), pedidos recientes y acceso rápido a los módulos críticos.

5.7 Estándar de Validaciones

Cada módulo ejecutará validaciones en frontend y backend:

1. Campos obligatorios: (ej. Nombre requerido).
2. Tipo de dato: (numérico, fecha, email).
3. Rangos: (ej. Stock/Cantidad > 0).
4. Duplicados: Verificación de código único.
5. Relación existente: Validación de integridad referencial (ej. cliente válido, categoría existente).


--------------------------------------------------------------------------------


6. Hoja de Ruta e Implementación

Prioridad de Desarrollo

Prioridad	Módulo	Ruta Técnica
Alta	Dashboard, Productos, Categorías, Subcategorías, Clientes, Pedidos	/admin, /admin/products, /admin/order, etc.
Media	Usuarios, Roles, Estructura Territorial (Geoubicación)	/admin/register, /admin/geoubicacion/*
Baja	Reportes (Ventas, Stock, Clientes)	/admin/reportes/*

Fases del Proyecto

1. Base: Establecimiento de _baseCrud y maestros de inventario.
2. Gestión Comercial: Implementación del flujo transaccional de pedidos.
3. Seguridad: Control de perfiles y auditoría de accesos.
4. Geoubicación: Despliegue de la jerarquía territorial y mapeo.
5. Reportes: Consolidación de datos para análisis directivo.

Conclusión Técnica: El estándar AdminCrudModule asegura que NOVAX sea un sistema de clase mundial, donde la consistencia técnica permite un mantenimiento simplificado y una evolución ágil hacia nuevas necesidades de negocio.
