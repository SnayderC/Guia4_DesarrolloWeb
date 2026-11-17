# SecureAuth — App Full Stack con MongoDB y autenticación JWT

**Práctica 4 · Desarrollo Web**

Aplicación web Full Stack que permite **registrar usuarios**, **iniciar sesión** y acceder a un **panel protegido** mediante **JSON Web Tokens (JWT)**.

- El **Back-End** (Node.js + Express + MongoDB) expone una API REST con registro, login y rutas protegidas.
- El **Front-End** (React) consume esa API y solo deja entrar al panel con un token válido.

---

## Contenido

1. [Tecnologías utilizadas](#tecnologías-utilizadas)
2. [Funcionalidades implementadas](#funcionalidades-implementadas)
3. [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
4. [Cómo probar la aplicación](#cómo-probar-la-aplicación)
5. [API REST](#api-rest)
6. [Estructura del proyecto](#estructura-del-proyecto)
7. [Solución de problemas](#solución-de-problemas)

---

## Tecnologías utilizadas

| Capa | Tecnología | Uso |
|---|---|---|
| Base de datos | **MongoDB** + **Mongoose** | Colección `users` con email único |
| Back-End | **Node.js** + **Express** | API REST |
| Seguridad | **bcryptjs** | Hash de contraseñas |
| Seguridad | **jsonwebtoken** | Generación y validación de JWT |
| Back-End | **cors**, **dotenv** | Acceso desde el front y variables de entorno |
| Front-End | **React** + **Vite** | Interfaz de usuario |
| Front-End | **React Router** | Navegación y ruta protegida |

---

## Funcionalidades implementadas

### Back-End
- ✅ Conexión de Express con **MongoDB** usando Mongoose.
- ✅ Modelo **User** con `name`, `email` (único) y `password`.
- ✅ **Registro** de usuarios con validaciones:
  - Nombre obligatorio (mínimo 2 caracteres).
  - Email obligatorio, con formato válido y no repetido.
  - Contraseña obligatoria (mínimo 6 caracteres).
- ✅ Contraseñas guardadas con **hash bcrypt**. El password **nunca** se devuelve en las respuestas.
- ✅ **Inicio de sesión** que devuelve un **JWT** con expiración (1 hora por defecto).
- ✅ **Middleware** que valida el token del header `Authorization: Bearer <token>`.
- ✅ **Rutas protegidas**: datos del usuario autenticado y lista de usuarios registrados.
- ✅ Respuesta **401** si no hay token, si es inválido o si expiró.
- ✅ Manejo centralizado de errores con mensajes claros en español (`400`, `401`, `404`, `409`, `500`).

### Front-End
- ✅ Página de **Registro**.
- ✅ Página de **Inicio de sesión**.
- ✅ **Panel protegido** que consume `GET /api/users/me` y `GET /api/users`.
- ✅ Si no hay sesión, el panel **redirige al login**.
- ✅ Si el token es inválido o expiró, se **cierra la sesión** automáticamente.
- ✅ Botón de **cerrar sesión**.
- ✅ Se muestran los **mensajes de error de la API** (email duplicado, credenciales inválidas, etc.).
- ✅ Diseño responsive (computador y celular).

---

## Cómo ejecutar el proyecto

### Requisitos previos

| Programa | Versión | Descarga |
|---|---|---|
| Node.js | 18 o superior | https://nodejs.org |
| Git | cualquiera | https://git-scm.com |
| MongoDB | una de las 3 opciones del paso 2 | — |

Para verificar la instalación de Node.js:

```bash
node -v
npm -v
```

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/SnayderC/Guia4_DesarrolloWeb.git
cd Guia4_DesarrolloWeb
```

### Paso 2 — Tener MongoDB funcionando

Elige **una** opción:

**Opción A: Docker** (recomendada si tienes Docker Desktop)
```bash
docker run -d --name guia4-mongo -p 27017:27017 mongo:7
```
Las siguientes veces solo hace falta `docker start guia4-mongo`.

**Opción B: MongoDB instalado en el equipo**
Instala [MongoDB Community Server](https://www.mongodb.com/try/download/community). En Windows queda corriendo como servicio automáticamente.

**Opción C: MongoDB Atlas (en la nube)**
Crea un cluster gratuito en [MongoDB Atlas](https://www.mongodb.com/atlas). Luego copia la cadena de conexión (`mongodb+srv://...`) y úsala en el paso 3.

> Con las opciones A y B la URI es `mongodb://localhost:27017/guia4`.

### Paso 3 — Configurar y levantar el Back-End

Abre una terminal en la carpeta del proyecto:

```bash
cd backend
npm install
```

Crea el archivo **`backend/.env`** copiando el ejemplo:

```bash
# Linux / macOS / Git Bash
cp .env.example .env

# Windows (CMD o PowerShell)
copy .env.example .env
```

Abre `backend/.env` y complétalo así:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/guia4
JWT_SECRET=escribe_aqui_una_clave_larga_y_secreta
JWT_EXPIRES_IN=1h
```

| Variable | Qué es |
|---|---|
| `PORT` | Puerto de la API |
| `MONGODB_URI` | Dirección de la base de datos (si usas Atlas, pega aquí tu URI) |
| `JWT_SECRET` | Clave con la que se firman los tokens; puede ser cualquier texto largo |
| `JWT_EXPIRES_IN` | Duración del token (`1h`, `30m`, etc.) |

Inicia el servidor:

```bash
npm run dev
```

✅ Si todo está bien verás:

```
MongoDB conectado: guia4
API escuchando en http://localhost:4000
```

> **Deja esta terminal abierta.**

### Paso 4 — Levantar el Front-End

Abre una **segunda terminal** en la carpeta del proyecto:

```bash
cd frontend
npm install
npm run dev
```

✅ Abre en el navegador: **http://localhost:5173**

> Para usar la app deben estar corriendo **las dos terminales** (backend y frontend) y MongoDB.

---

## Cómo probar la aplicación

La base de datos empieza vacía, así que **no hay usuarios predefinidos**. Primero hay que crear una cuenta desde la pantalla de registro.

Este recorrido demuestra todos los requisitos de la práctica:

| # | Acción | Resultado esperado |
|---|---|---|
| 1 | Escribir `http://localhost:5173/dashboard` sin haber iniciado sesión | Redirige al **login** con el aviso *"Inicia sesión para continuar"* |
| 2 | Ir a **Crear una cuenta** y registrar un usuario (ej. `Juan Pérez`, `juan@test.com`, `secreto123`) | Vuelve al login con *"Registro exitoso"* |
| 3 | Registrar 1 o 2 usuarios más | Se crean correctamente |
| 4 | Intentar registrar otra vez `juan@test.com` | Error de la API: *"El email ya está registrado"* |
| 5 | Iniciar sesión con contraseña incorrecta | Error: *"Credenciales inválidas"* |
| 6 | Iniciar sesión con los datos correctos | Entra al **Panel protegido**: muestra *Mi perfil*, la lista de *Usuarios registrados* y la hora de expiración del token |
| 7 | Recargar la página (F5) | La sesión se mantiene |
| 8 | Abrir **F12 → Application → Local Storage → `http://localhost:5173`** | Se ve el **token JWT** guardado |
| 9 | Editar el valor del `token` (cambiar algunas letras) y recargar | Se cierra la sesión: *"Acceso denegado: token inválido"* |
| 10 | Volver a iniciar sesión y pulsar **Cerrar sesión** | Vuelve al login y `/dashboard` queda bloqueado otra vez |

### Comprobar que las contraseñas se guardan cifradas (opcional)

Con **MongoDB Compass**, conéctate a `mongodb://localhost:27017` y abre `guia4 → users`. Con Docker también puedes usar:

```bash
docker exec -it guia4-mongo mongosh guia4 --eval "db.users.find().toArray()"
```

El campo `password` aparece como hash (`$2b$10$...`), nunca en texto plano.

### Probar la API directamente (opcional)

Puedes usar Postman, Thunder Client o `curl`:

```bash
# Registro
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","email":"ana@test.com","password":"secreto123"}'

# Login (copia el "token" de la respuesta)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@test.com","password":"secreto123"}'

# Ruta protegida SIN token → 401
curl http://localhost:4000/api/users/me

# Ruta protegida CON token → 200
curl http://localhost:4000/api/users/me -H "Authorization: Bearer <TOKEN>"
```

---

## API REST

URL base: `http://localhost:4000/api`

| Método | Ruta | Protegida | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | Registrar usuario |
| POST | `/auth/login` | No | Iniciar sesión y obtener el JWT |
| GET | `/users/me` | **Sí** | Datos del usuario autenticado |
| GET | `/users` | **Sí** | Lista de usuarios registrados (sin contraseñas) |

Las rutas protegidas requieren el header:

```
Authorization: Bearer <token>
```

### Ejemplos de respuesta

**`POST /auth/login` → 200**
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "_id": "...", "name": "Ana", "email": "ana@test.com", "createdAt": "..." }
}
```

**Ruta protegida sin token → 401**
```json
{ "message": "Acceso denegado: token no proporcionado" }
```

### Códigos de estado

| Código | Cuándo ocurre |
|---|---|
| `200` | Petición correcta |
| `201` | Usuario registrado |
| `400` | Datos faltantes o inválidos, o JSON mal formado |
| `401` | Credenciales incorrectas, o token ausente, inválido o expirado |
| `404` | Ruta no encontrada |
| `409` | El email ya está registrado |
| `500` | Error interno del servidor |

---

## Estructura del proyecto

```
Guia4_DesarrolloWeb/
├── backend/
│   ├── src/
│   │   ├── config/db.js                 Conexión a MongoDB
│   │   ├── models/User.js               Modelo de usuario + hash bcrypt
│   │   ├── controllers/
│   │   │   ├── authController.js        Registro y login (genera el JWT)
│   │   │   └── userController.js        Consulta de usuarios
│   │   ├── middleware/
│   │   │   ├── auth.js                  Valida el JWT (rutas protegidas)
│   │   │   └── errorHandler.js          Manejo centralizado de errores
│   │   ├── routes/
│   │   │   ├── authRoutes.js            /api/auth
│   │   │   └── userRoutes.js            /api/users (protegidas)
│   │   └── server.js                    Punto de entrada de la API
│   ├── .env.example                     Plantilla de variables de entorno
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api.js                       Cliente de la API REST
│   │   ├── AuthContext.jsx              Manejo de la sesión (token)
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx       Redirige al login si no hay sesión
│   │   │   ├── AuthLayout.jsx           Layout, campos y alertas
│   │   │   └── Icons.jsx                Íconos SVG
│   │   ├── pages/
│   │   │   ├── Register.jsx             Página de registro
│   │   │   ├── Login.jsx                Página de inicio de sesión
│   │   │   └── Dashboard.jsx            Panel protegido
│   │   ├── App.jsx                      Rutas de la aplicación
│   │   └── index.css                    Estilos
│   └── package.json
│
└── README.md
```

### Flujo de autenticación

```
1. Registro  →  POST /api/auth/register  →  contraseña con hash bcrypt  →  MongoDB
2. Login     →  POST /api/auth/login     →  se verifica la contraseña   →  se devuelve un JWT
3. React guarda el JWT en localStorage
4. Panel     →  GET /api/users/me y /api/users con "Authorization: Bearer <token>"
5. El middleware valida el token  →  válido: 200 con los datos  |  inválido/expirado: 401 → vuelve al login
```

---

## Solución de problemas

| Problema | Solución |
|---|---|
| Al registrarse aparece **"No se pudo conectar con el servidor"** | El backend no está corriendo. Revisa la terminal del backend (`npm run dev`). |
| El backend muestra **"No se pudo conectar a MongoDB"** | MongoDB no está encendido o la `MONGODB_URI` es incorrecta. Con Docker: `docker start guia4-mongo`. |
| El backend muestra **"Faltan variables de entorno"** | No existe `backend/.env` o le faltan `MONGODB_URI` o `JWT_SECRET` (ver paso 3). |
| **`EADDRINUSE`** (puerto ocupado) | Otro programa usa el puerto 4000 o 5173: ciérralo. Si cambias `PORT` del backend, crea `frontend/.env` con `VITE_API_URL=http://localhost:<puerto>/api`. |
| `docker: command not found` | Docker no está instalado: usa la opción B o C del paso 2. |
| El panel me devuelve al login | El token expiró (dura 1 hora) o fue modificado. Vuelve a iniciar sesión. |
