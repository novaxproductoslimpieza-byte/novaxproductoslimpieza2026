# NovaX Security Architecture

## 1. Introducción
La seguridad es un pilar fundamental en los sistemas web modernos, ya que protege tanto la información confidencial de la empresa como los datos personales de los clientes. NovaX implementa múltiples capas de seguridad a nivel de frontend, backend y base de datos para garantizar la confidencialidad, integridad y disponibilidad de la información, previniendo ataques malintencionados.

---

## 2. Principios de seguridad del sistema
El diseño de NovaX se basa en los siguientes principios:
- **Principio de mínimo privilegio:** Cada usuario y proceso opera únicamente con los permisos estrictamente necesarios para cumplir su función.
- **Defensa en profundidad:** Se aplican múltiples controles de seguridad en diferentes capas (red, aplicación, datos) para que, si una falla, otra proteja el sistema.
- **Validación de datos:** Toda entrada de datos (del cliente o servicios externos) es estrictamente validada y sanitizada para prevenir inyecciones.
- **Autenticación segura:** Implementación de mecanismos robustos para verificar de forma segura la identidad de los usuarios.

---

## 3. Autenticación
Los usuarios se autentican en el sistema mediante el uso de tokens JWT (JSON Web Tokens).

Flujo básico:
1. Usuario envía credenciales (correo/ci y contraseña) al backend.
2. El backend verifica la contraseña utilizando un algoritmo de hashing seguro (e.g., bcrypt).
3. Si es válida, se genera y firma un token JWT.
4. El cliente recibe y almacena el token de forma segura, usándolo en el encabezado `Authorization` en futuras solicitudes.

---

## 4. Autorización
El sistema controla el acceso a las funciones basado en roles de usuario:
- **admin:** Acceso total al panel administrativo, gestión de inventario, productos, pedidos, usuarios y proveedores.
- **user (cliente registrado):** Permiso para ver el catálogo, modificar su perfil, realizar pedidos y consultar su historial.
- **guest (visitante):** Acceso público limitado exclusivamente a visualizar el catálogo y precios.

---

## 5. Protección de la API
Para proteger la API contra ataques, el sistema implementa:
- **Validación de datos:** Uso de esquemas y middleware para garantizar el formato correcto de las peticiones.
- **Protección contra inyección SQL:** Uso de un ORM, Query Builder o consultas parametrizadas para evitar ejecución de sentencias maliciosas.
- **Limitación de solicitudes (Rate Limiting):** Restricciones en la cantidad de peticiones permitidas por IP para prevenir ataques de denegación de servicio (DDoS) y fuerza bruta.
- **Autenticación mediante token:** Verificación estricta de la validez y firma de los JWT en rutas protegidas.

---

## 6. Seguridad de la base de datos
Las prácticas de seguridad implementadas en PostgreSQL incluyen:
- **Uso de contraseñas seguras:** Las credenciales de conexión son complejas y se rotan periódicamente.
- **Acceso restringido:** La base de datos solo es accesible desde los servidores o direcciones IP autorizadas del backend, bloqueando el acceso público.
- **Cifrado de datos sensibles:** Información confidencial de los usuarios (como contraseñas) se almacena únicamente con hashing y salting.

---

## 7. Seguridad en la comunicación
El sistema utiliza HTTPS para cifrar y proteger todas las comunicaciones en tránsito entre el cliente y el servidor, evitando ataques.

---

## 8. Manejo de errores y registros
El sistema no expone información sensible al cliente durante un error. En cambio, registra y monitorea eventos importantes de forma interna para auditoría y respuesta rápida ante incidentes.

---

## 9. Buenas prácticas de seguridad
Adicionalmente, el desarrollo y mantenimiento siguen estas recomendaciones:
- **Mantener dependencias actualizadas.**
- **Validar entradas de usuario.**
- **Evitar exposición de información sensible** mediante variables de entorno configuradas de forma segura.

---

## 10. Conclusión
La arquitectura de seguridad de NovaX establece un marco robusto y moderno mediante una autenticación sólida (JWT), un control estricto de roles y autorización, validación integral y protección en tránsito. Estas múltiples capas protegen eficazmente tanto la integridad del sistema como los datos sensibles de sus usuarios.