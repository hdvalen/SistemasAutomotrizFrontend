# 🚗 AutoTaller Manager – Frontend

**Frontend del sistema de gestión de un taller automotriz**, construido con:
- 🛠️ **React + Vite**
- 💅 **TailwindCSS**
- 🔐 Autenticación con **JWT**
- 🧠 Manejo de roles: administrador, recepcionista y mecánico

---

## ⚙️ Requisitos

Asegúrate de tener instalado:
- [Node.js (v16+ recomendado)](https://nodejs.org/)
- npm (se instala junto a Node)
- Backend corriendo en .NET (C#) que retorne JWT

---

## 📦 Instalación

1. **Clona el repositorio** (o navega al directorio `frontend/` si está junto al backend):
```bash
git clone https://github.com/hdvalen/SistemasAutomotrizFrontend.git
cd SistemasAutomotrizFrontend
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Crea un archivo `.env`** con la URL del backend:
```env
VITE_API_URL=http://localhost:5000/api
```
> **Nota:** Asegúrate de que esta URL coincida con la dirección real donde corre tu backend.

---

## 🚀 Ejecución del proyecto

```bash
npm run dev
```

Abre el navegador en:
```
http://localhost:5173
```

---

## 👤 Cuentas de prueba

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | admin@autotaller.com | admin123 |
| Recepcionista | recepcionista@autotaller.com | recep123 |
| Mecánico | mecanico@autotaller.com | mec123 |

---

## 🧩 Características

- 🔐 Login con JWT
- 🎯 Redirección automática según el rol
- 🔒 Rutas protegidas con ProtectedRoute
- 🧠 Contexto global de autenticación (AuthContext)
- 🎨 Interfaz moderna y responsiva con TailwindCSS

---

## 🗂️ Estructura básica del proyecto

```
/src
 ├── components/       # Inputs, botones y otros componentes reutilizables
 ├── contexts/         # Manejo de sesión y autenticación
 ├── pages/            # Páginas por rol (dashboard, login, etc.)
 ├── routes/           # Rutas públicas y protegidas
 ├── types/            # Tipado de usuario y auth
 └── App.tsx           # Configuración principal de rutas
```

---

## 🛠️ Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter para revisar el código

---


# Autores ✒️

- Laura Mariana Vargas  
- Isabella Stefphani Galvis  
- Hodeth Valentina Caballero  
- Andres Felipe Araque
