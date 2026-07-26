# SIGA App Vanilla

Aplicación frontend en JavaScript vanilla para la gestión institucional de una escuela o colegio. La interfaz se construye con HTML, CSS y módulos ES6 y se conecta a un backend REST mediante `fetch` con autenticación JWT y tenant ID.

## Descripción general

Este proyecto funciona como una SPA (Single Page Application) ligera para administrar:

- Alumnos
- Docentes
- Cursos y materias
- Inicio y navegación institucional

El flujo principal parte desde el login, valida credenciales contra el backend, guarda el token JWT y el tenant en `localStorage` y luego redirige al panel principal.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- Un backend API corriendo en `http://localhost:8090/siga/api/v1`

## Instalación

```bash
npm install
```

## Ejecución en modo desarrollo

```bash
npm run dev -- --host 0.0.0.0
```

Luego abre la URL mostrada por Vite, normalmente:

```text
http://localhost:5173/
```

## Compilación para producción

```bash
npm run build
```

Para probar el build generado:

```bash
npm run preview -- --host 0.0.0.0
```

## Estructura del proyecto

```text
.
├── index.html           # Login principal
├── home.html            # Dashboard / panel principal
├── student.html         # Listado y gestión de alumnos
├── teacher.html         # Listado y gestión de docentes
├── course.html          # Módulo de cursos y materias
├── api-config.js        # Configuración de la base URL del backend
├── api-client.js        # Cliente HTTP con JWT + tenant + manejo de errores
├── login.js             # Lógica de autenticación
├── menu.js              # Menú y navegación
├── sidebar.js           # Sidebar del panel
├── student-list.js      # Tabla de alumnos y acciones
├── student-form.js      # Formulario de creación/edición de alumnos
├── teacher-list.js      # Tabla de docentes
├── course-list.js       # Tabla de cursos
├── style.css            # Estilos globales
└── public/              # Recursos estáticos
```

## Configuración de API

La URL base del backend está definida en:

- `api-config.js`

Configuración actual:

```js
export const API_BASE_URL = 'http://localhost:8090/siga/api/v1';
```

> El proyecto depende de un backend Spring o equivalente que exponga endpoints REST para autenticación y gestión académica.

## Flujo de autenticación

1. El usuario ingresa usuario, contraseña y tenant.
2. `login.js` llama a `POST /auth/login`.
3. El backend responde con un JWT.
4. El frontend guarda:
   - `token` en `localStorage`
   - `tenantId` en `localStorage`
   - `jwtPayload` en `localStorage`
5. El usuario es redirigido a `home.html`.

## Endpoints esperados por el frontend

Los módulos usan estos endpoints principales:

- `POST /auth/login`
- `GET /alumno/listado`
- `GET /alumno/consultarporid/{id}`
- `POST /alumno/crear`
- `PUT /alumno/desactivar/{id}/INACTIVO`
- `GET /docente/listado`
- `GET /curso/listado`

## Roles y permisos

La lógica de permisos se evalúa con `hasRole()` en `api-client.js`.

Roles esperados en el token JWT:

- `ADMINISTRATIVO`
- `DIRECTOR`

Estos permisos se usan para ocultar o mostrar acciones como:

- Crear/editar alumnos
- Crear/editar docentes
- Eliminar cursos o docentes

## Pantallas principales

### Login

Archivo: `index.html`

Permite iniciar sesión con usuario, contraseña y tenant.

### Dashboard

Archivo: `home.html`

Muestra indicadores generales de:

- alumnos
- docentes
- cursos

### Gestión de alumnos

Archivo: `student.html`

Muestra el listado y permite:

- ver detalle del alumno
- editar
- desactivar

### Gestión de docentes

Archivo: `teacher.html`

Lista docentes y permite acciones según permisos de rol.

### Gestión de cursos

Archivo: `course.html`

Módulo de cursos con una interfaz de listado y acciones preliminares.

## Observaciones importantes

- La app es frontend puro, por lo que la lógica real de negocio y persistencia depende del backend.
- Algunos formularios y acciones están parcialmente implementados o pendientes de integración completa.
- El acceso a ciertos módulos responderá según los roles que vengan en el JWT.

## Dependencias principales

- Vite
- Bootstrap
- Font Awesome
- SweetAlert2
- jQuery
- DataTables

## Scripts npm

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

## Recomendaciones

- Asegúrate de que el backend esté levantado antes de probar el login.
- Revisa la consola del navegador si aparece un error de CORS o de autenticación.
- Si cambias el puerto o host del backend, actualiza `api-config.js`.
