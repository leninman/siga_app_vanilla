# Documentación técnica del proyecto

## 1. Objetivo

Este proyecto es una interfaz web de tipo ERP escolar construida con JavaScript vanilla. Su intención es ofrecer una capa visual y de interacción para gestionar datos escolares, conectándose a un servicio REST seguro con JWT y tenant.

## 2. Arquitectura general

La aplicación sigue una estructura simple basada en módulos ES6:

- `index.html` y demás páginas HTML actúan como puntos de entrada.
- `*.js` contienen la lógica de cada pantalla.
- `api-client.js` centraliza todos los llamados HTTP con autenticación.
- `api-config.js` define la URL base del backend.
- `localStorage` almacena la sesión y el payload del token.

### Diagrama conceptual

```text
Usuario -> index.html -> login.js -> API /auth/login
                                      -> localStorage(token, tenantId, jwtPayload)
                                      -> home.html

home.html -> menu.js
         -> sidebar.js
         -> api-client.js
         -> endpoints REST del backend
```

## 3. Módulos principales

### `api-config.js`

Define la URL base del backend:

```js
export const API_BASE_URL = 'http://localhost:8090/siga/api/v1';
```

### `api-client.js`

Este archivo es el núcleo de comunicación con la API.

Funciones principales:

- `fetchAPI(endpoint, options)`
  - agrega `Authorization: Bearer <token>`
  - agrega el header `X-Tenant-ID`
  - maneja errores `401` y `403`
  - redirige al login cuando la sesión expira

- `getJwtPayload()`
  - obtiene y parsea el payload JWT desde `localStorage`

- `hasRole(roleName)`
  - verifica si el usuario posee un rol específico en el token

### `login.js`

Se encarga del inicio de sesión y la persistencia de la sesión:

- recibe usuario y contraseña
- envia la petición a `/auth/login`
- guarda JWT y tenant
- decodifica el payload del token
- redirige al dashboard principal

## 4. Páginas y responsabilidades

### `index.html`

Página de autenticación. Lógica operativa en `login.js`.

### `home.html`

Dashboard principal con métricas y accesos rápidos. Usa `fetchAPI` para consultar contadores de alumnos, docentes y cursos.

### `student.html`

Pantalla para listar estudiantes. La lógica está en `student-list.js`.

### `student-form.html`

Formulario para crear o editar estudiantes. La lógica está en `student-form.js`.

### `teacher.html`

Pantalla de docentes. La lógica está en `teacher-list.js`.

### `course.html`

Pantalla de cursos y materias. La lógica está en `course-list.js`.

## 5. Flujos funcionales

### Inicio de sesión

1. El usuario escribe sus credenciales.
2. `login.js` envía la petición al backend.
3. Si la autenticación es correcta, el backend devuelve un JWT.
4. El frontend salva el token y el `tenantId` en `localStorage`.
5. El usuario entra al dashboard.

### Consulta de registros

Cada colección utiliza `fetchAPI` para invocar endpoints del backend:

- alumnos -> `/alumno/listado`
- docentes -> `/docente/listado`
- cursos -> `/curso/listado`

### Edición y eliminación de registros

Los módulos validan permisos con `hasRole()`, así algunos botones solo aparecen si el usuario tiene el rol adecuado.

## 6. Dependencias

### Desarrollo

- Vite

### UI y utilidades

- Bootstrap
- jQuery
- DataTables
- Font Awesome
- SweetAlert2

## 7. Consideraciones de seguridad

- El token JWT se almacena en `localStorage`, lo cual es útil para desarrollo pero no es el método más seguro para aplicaciones empresariales.
- El tenant se envía por header `X-Tenant-ID`.
- El cliente valida roles y redirige automáticamente en caso de sesión expirada.

## 8. Limitaciones conocidas

- El proyecto es frontend puro; requiere un backend funcional para operación completa.
- Algunos módulos están parcialmente integrados o muestran mensajes de "en desarrollo".
- La gestión de cursos no tiene un formulario terminado en esta versión.

## 9. Cómo extender el proyecto

Para añadir nuevas pantallas o módulos:

1. Crear el HTML correspondiente.
2. Añadir su script JS.
3. Usar `fetchAPI()` para llamadas autenticadas.
4. Reutilizar `hasRole()` para controlar accesos.
5. Si es necesario, actualizar `vite.config.js` para nuevas entradas de build.

## 10. Comandos útiles

```bash
npm install
npm run dev -- --host 0.0.0.0
npm run build
npm run preview -- --host 0.0.0.0
```

## 11. Resumen de uso

Para usar la app correctamente:

- asegúrate de que el backend esté levantado
- inicia el frontend con `npm run dev`
- accede a `http://localhost:5173/`
- inicia sesión con un tenant válido y credenciales del backend
