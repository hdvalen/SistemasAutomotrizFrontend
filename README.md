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
- [Clonación Backend](https://github.com/LauraVargas22/SistemaAutomotriz.git)
```env
VITE_API_URL=http://localhost:5070/api
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

## Librerias Utilizadas
- React: Biblioteca principal UI
```            
npm install react
```
- Tailwind CSS: Estilos unitarios
```            
npm install tailwindcss
```
- Sweetalert: Manejo de mensajes de alerta
```            
npm install sweetalert2
```
- Lucide-react: Manejo de Iconos SVG
```            
npm install lucide-react
```
- Jspdf: Manipulación y creación de PDF
```            
npm install jspdf
```
- Html2canvas: Conversión de elementos del DOM en archivos exportables 
```            
npm install html2canvas
```

## Descarga de Factura en PDF: Lógica paso a paso

La funcionalidad de descarga de PDF en la página de **Facturación** está implementada siguiendo estos pasos en el código (`src/pages/Facturacion.tsx`):

### 1. Referencia al contenido del modal
Se crea una referencia con `React.useRef` para apuntar al contenido del modal que muestra el detalle de la factura:

```tsx
const facturaModalRef = React.useRef<HTMLDivElement>(null);
```

### 2. Renderizado del modal de detalle
Cuando el usuario selecciona una factura, se muestra un modal cuyo contenido es el que se convertirá en PDF:

```tsx
<div ref={facturaModalRef} className="...">
  {/* Contenido del detalle de la factura */}
</div>
```

### 3. Botón de descarga
Dentro del modal, hay un botón que ejecuta la descarga del PDF:

```tsx
<Button onClick={handleDownloadPDF}>
  <Download className="h-4 w-4 mr-1" />
  Descargar PDF
</Button>
```

### 4. Lógica de generación y descarga del PDF
Cuando el usuario hace clic en el botón, se ejecuta la función `handleDownloadPDF`:

```tsx
const handleDownloadPDF = async () => {
  const input = facturaModalRef.current;
  if (!input) return;
  // ...
};
```

#### a. Captura del contenido como imagen
Se utiliza la librería `html2canvas` para capturar el contenido del modal como una imagen:

```tsx
const canvas = await html2canvas(input, { scale: 2 });
const imgData = canvas.toDataURL('image/png');
```

#### b. Creación del PDF
Se crea un nuevo documento PDF usando `jsPDF`:

```tsx
const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
```

#### c. Ajuste de la imagen al tamaño de la página
Se calcula el tamaño adecuado para que la imagen ocupe el ancho de la página:

```tsx
const pageWidth = pdf.internal.pageSize.getWidth();
const imgProps = pdf.getImageProperties(imgData);
const pdfWidth = pageWidth;
const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
```

#### d. Inserción de la imagen en el PDF
La imagen capturada se agrega al PDF:

```tsx
pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
```

#### e. Descarga del archivo
Finalmente, se descarga el archivo PDF con el nombre `factura.pdf`:

```tsx
pdf.save('factura.pdf');
```

---

### Resumen del flujo
1. El usuario abre el modal de detalle de una factura.
2. El usuario hace clic en "Descargar PDF".
3. El contenido del modal se convierte en una imagen.
4. Se genera un PDF con esa imagen.
5. El PDF se descarga automáticamente.

---

**Tecnologías utilizadas:**
- [html2canvas](https://www.npmjs.com/package/html2canvas): Para capturar el DOM como imagen.
- [jsPDF](https://www.npmjs.com/package/jspdf): Para crear y descargar el PDF.

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
