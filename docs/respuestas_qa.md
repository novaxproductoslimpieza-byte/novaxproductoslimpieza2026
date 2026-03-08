<<<<<<< HEAD
Perfecto. Podemos hacer esto: te genero un **cuestionario técnico ya con mis sugerencias/respuestas profesionales**, listo para que solo lo copies y pegues como archivo `NOVAX/docs/respuestas_qa.md`. Esto asegura que Antigravity tenga parámetros claros para generar el código.

Aquí va el archivo completo en **Markdown técnico**:

---

```markdown id="a9k3tv"
# Respuestas QA – Proyecto NOVAX

## A. Tecnologías y Frameworks
1. **Backend:** Express.js (ligero, flexible, ampliamente soportado para APIs RESTful).  
2. **Frontend:** Next.js con `App Router` (directorio app/) para aprovechar rutas modernas y layouts integrados.  
3. **ORM / Base de Datos:** Prisma ORM para PostgreSQL, por su tipado seguro, migraciones y facilidad de integración con Node.js.  
4. **Estilos Frontend:** TailwindCSS para acelerar desarrollo responsive, mantener consistencia y reducir CSS redundante.  

## B. Reglas de Negocio y Lógica de Inventario
5. **Manejo de Stock:** El stock se descuenta al aprobar el pedido por el administrador (evita conflictos si un pedido queda pendiente o cancelado).  
6. **Cancelación de Pedidos:** Los clientes pueden cancelar pedidos en estado pendiente; el stock se repone automáticamente al cancelar.  
7. **Precios Mayoreo/Menudeo:** Precio determinado por la cantidad de unidades compradas: ≥ 50 unidades → precio mayorista, < 50 → minorista.  

## C. Autenticación y API
8. **Login:** El usuario puede iniciar sesión usando CI o correo electrónico indistintamente, validando ambos campos en la API.  
9. **Almacenamiento de imágenes:** Usar almacenamiento en la nube (AWS S3 o Cloudinary) con referencia de URL en la base de datos.  
10. **Documentación faltante:** Los archivos vacíos se completarán en fases posteriores; no bloquean la generación inicial del código.  

## D. Seguridad
11. **Roles y permisos:** Roles `admin` y `user` con JWT; endpoints críticos restringidos a `admin`, lectura de catálogo abierta a `user`.  
12. **Rate Limiting:** Limitar a 100 solicitudes por minuto por IP en endpoints sensibles (login, pedidos, CRUD productos).  

## E. Frontend / UX
13. **Experiencia de usuario:** Los usuarios “guest” solo pueden ver catálogo sin precios; usuarios registrados ven precios y opciones de pedido.  
14. **Responsive:** Prioridad móvil y tablet, pero con layouts adaptativos para desktop.  

## F. Reglas de Negocio
15. **Flujo de pedidos:** Cuando el pedido es aprobado por el administrador, se envía notificación automática por correo y notificación push si aplica.  
16. **Gestión de proveedores:** Cada proveedor tiene relación con productos; stock actualizado automáticamente al recibir mercancía o al crear pedidos.  

## G. Despliegue / Escalabilidad
17. **Despliegue:** Inicialmente en VPS con Node.js y PostgreSQL; posteriormente migración a nube escalable (AWS/GCP).  
18. **Escalabilidad:** Implementar caching (Redis) para endpoints de catálogo y balanceo de carga si supera 5000 usuarios simultáneos.  

---

**Nota:** Este archivo está listo para guardarse como:

```

NOVAX/docs/respuestas_qa.md

```

y ser utilizado directamente por Antigravity para la **fase de generación de código**.
```

---


=======
Perfecto. Podemos hacer esto: te genero un **cuestionario técnico ya con mis sugerencias/respuestas profesionales**, listo para que solo lo copies y pegues como archivo `NOVAX/docs/respuestas_qa.md`. Esto asegura que Antigravity tenga parámetros claros para generar el código.

Aquí va el archivo completo en **Markdown técnico**:

---

```markdown id="a9k3tv"
# Respuestas QA – Proyecto NOVAX

## A. Tecnologías y Frameworks
1. **Backend:** Express.js (ligero, flexible, ampliamente soportado para APIs RESTful).  
2. **Frontend:** Next.js con `App Router` (directorio app/) para aprovechar rutas modernas y layouts integrados.  
3. **ORM / Base de Datos:** Prisma ORM para PostgreSQL, por su tipado seguro, migraciones y facilidad de integración con Node.js.  
4. **Estilos Frontend:** TailwindCSS para acelerar desarrollo responsive, mantener consistencia y reducir CSS redundante.  

## B. Reglas de Negocio y Lógica de Inventario
5. **Manejo de Stock:** El stock se descuenta al aprobar el pedido por el administrador (evita conflictos si un pedido queda pendiente o cancelado).  
6. **Cancelación de Pedidos:** Los clientes pueden cancelar pedidos en estado pendiente; el stock se repone automáticamente al cancelar.  
7. **Precios Mayoreo/Menudeo:** Precio determinado por la cantidad de unidades compradas: ≥ 50 unidades → precio mayorista, < 50 → minorista.  

## C. Autenticación y API
8. **Login:** El usuario puede iniciar sesión usando CI o correo electrónico indistintamente, validando ambos campos en la API.  
9. **Almacenamiento de imágenes:** Usar almacenamiento en la nube (AWS S3 o Cloudinary) con referencia de URL en la base de datos.  
10. **Documentación faltante:** Los archivos vacíos se completarán en fases posteriores; no bloquean la generación inicial del código.  

## D. Seguridad
11. **Roles y permisos:** Roles `admin` y `user` con JWT; endpoints críticos restringidos a `admin`, lectura de catálogo abierta a `user`.  
12. **Rate Limiting:** Limitar a 100 solicitudes por minuto por IP en endpoints sensibles (login, pedidos, CRUD productos).  

## E. Frontend / UX
13. **Experiencia de usuario:** Los usuarios “guest” solo pueden ver catálogo sin precios; usuarios registrados ven precios y opciones de pedido.  
14. **Responsive:** Prioridad móvil y tablet, pero con layouts adaptativos para desktop.  

## F. Reglas de Negocio
15. **Flujo de pedidos:** Cuando el pedido es aprobado por el administrador, se envía notificación automática por correo y notificación push si aplica.  
16. **Gestión de proveedores:** Cada proveedor tiene relación con productos; stock actualizado automáticamente al recibir mercancía o al crear pedidos.  

## G. Despliegue / Escalabilidad
17. **Despliegue:** Inicialmente en VPS con Node.js y PostgreSQL; posteriormente migración a nube escalable (AWS/GCP).  
18. **Escalabilidad:** Implementar caching (Redis) para endpoints de catálogo y balanceo de carga si supera 5000 usuarios simultáneos.  

---

**Nota:** Este archivo está listo para guardarse como:

```

NOVAX/docs/respuestas_qa.md

```

y ser utilizado directamente por Antigravity para la **fase de generación de código**.
```

---


>>>>>>> f83596534f8cf99255a5f3a8a8085275451c6aa2
