# Práctica 4 — App Full Stack con MongoDB y autenticación JWT

Aplicación web Full Stack que permite **registrar usuarios**, **iniciar sesión** y acceder a una **página protegida** mediante **JSON Web Tokens (JWT)**. El Back-End expone una API REST con Node.js, Express y MongoDB; el Front-End está hecho en React y consume esa API.

## Tecnologías utilizadas

**Back-End**
- Node.js + Express
- MongoDB + Mongoose
- bcryptjs (hash de contraseñas)
- jsonwebtoken (generación y validación de JWT)
- cors, dotenv

**Front-End**
- React (Vite)
- React Router (navegación y rutas protegidas)

## Funcionalidades implementadas

- Registro de usuarios con validaciones (nombre, email único con formato válido, contraseña de mínimo 6 caracteres).
- Contraseñas almacenadas con hash **bcrypt**; el password nunca se devuelve en las respuestas.
- Inicio de sesión que genera un **JWT** con expiración configurable.
- Middleware que valida el token (`Authorization: Bearer <token>`) y responde `401` si falta, es inválido o expiró.
- Rutas protegidas para consultar el usuario autenticado y la lista de usuarios registrados.
- Front-End con páginas de **Registro**, **Login** y **Panel protegido**.
- Redirección al login si no hay sesión o si el token deja de ser válido.
- Botón de cerrar sesión.
- Mensajes de error de la API mostrados en la interfaz (email duplicado, credenciales inválidas, token inválido, etc.).

## Endpoints

| Método | Ruta | Protegida | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | No | Registrar usuario |
| POST | `/api/auth/login` | No | Iniciar sesión y devolver JWT |
| GET | `/api/users/me` | Sí | Datos del usuario autenticado |
| GET | `/api/users` | Sí | Usuarios registrados (sin passwords) |

Códigos de respuesta usados: `200`, `201`, `400` (validación), `401` (no autorizado), `404`, `409` (email duplicado), `500`.

## Estructura

```
backend/
  src/
    config/db.js            Conexión a MongoDB
    models/User.js          Modelo de usuario (hash con bcrypt)
    controllers/            Lógica de auth y usuarios
    middleware/auth.js      Validación del JWT
    middleware/errorHandler.js
    routes/                 Rutas /api/auth y /api/users
    server.js
  .env.example
frontend/
  src/
    api.js                  Cliente de la API REST
    AuthContext.jsx         Manejo de la sesión (token)
    components/ProtectedRoute.jsx   Redirige al login si no hay sesión
    components/AuthLayout.jsx       Layout, campos y alertas de Login/Registro
    components/Icons.jsx            Íconos SVG
    pages/                  Login, Register, Dashboard
```

## Cómo ejecutar

Requisitos: Node.js 18+ y MongoDB (local, Docker o Atlas).

**1. MongoDB** (ejemplo con Docker)
```bash
docker run -d --name guia4-mongo -p 27017:27017 mongo:7
```

**2. Back-End**
```bash
cd backend
cp .env.example .env    # completar MONGODB_URI y JWT_SECRET
npm install
npm run dev             # http://localhost:4000
```

Ejemplo de `.env`:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/guia4
JWT_SECRET=una_clave_larga_y_secreta
JWT_EXPIRES_IN=1h
```

**3. Front-End**
```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

Si la API corre en otra URL, definir `VITE_API_URL` (por defecto `http://localhost:4000/api`).
