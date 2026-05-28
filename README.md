# OUR_MARKET_TPV 🛒💳

Este es el **Terminal de Punto de Venta (TPV / POS)** de **OurMarket**, una aplicación moderna y optimizada construida con **React**, **Vite** y **Redux Toolkit**. Permite gestionar transacciones, controlar sesiones de caja, realizar cobros, facturar e interactuar en tiempo real con el servidor de la tienda.

El sistema está diseñado con una interfaz táctil amigable para cajeros y vendedores, soportando tanto la lectura rápida mediante escáneres de códigos de barras como la búsqueda manual.

---

## 🚀 Características Principales

### 🧑‍💼 1. Modo Vendedor
*   **Gestión de Ventas:** Interfaz rápida e intuitiva para agregar ofertas y productos al carrito.
*   **Búsqueda Flexible:** Permite buscar productos mediante:
    *   **Escáner de código de barras (`###`)**: Modo continuo para lector de mano.
    *   **Código numérico (`123`)**: Ingreso directo del identificador del producto.
    *   **Búsqueda alfabética (`abc`)**: Autocompletado dinámico e inteligente por nombre o descripción.
*   **Categorías y Ofertas:** Navegación optimizada mediante categorías visuales y paneles de ofertas/stock.

### 💰 2. Modo Cajero
*   **Control de Caja:** Inicio y cierre de sesión de cajero con control de saldo inicial y retiro de efectivo (*Cash Out*).
*   **Detalle de Pedidos:** Visualización integral del carrito, selección de clientes y asignación de direcciones.
*   **Métodos de Pago:** Integración de flujos de pago seguros.
*   **Resumen de Caja:** Estadísticas detalladas de ventas, totales y arqueo de caja de la jornada.

### 🖨️ 3. Impresión y Códigos
*   **Emisión de Tickets:** Impresión física y en PDF de los recibos de compra mediante `react-to-print`.
*   **Códigos QR y de Barras:** Generación de códigos dinámicos para los tickets y productos a través de `qrcode.react` y `react-barcode`.

### 🔄 4. Sincronización y Seguridad
*   **Tiempo Real:** Conectividad bidireccional estable mediante WebSockets (`socket.io-client`) para la actualización de stock, órdenes y estados de entrega.
*   **Autenticación Robusta:** Flujo seguro de tokens JWT con refresco automático de credenciales y soporte de **Google OAuth** (`@react-oauth/google`).

---

## 🛠️ Tecnologías Utilizadas

*   **Core:** [React](https://react.dev/) v18.2.0 (con [Vite](https://vitejs.dev/) + SWC)
*   **Estado Global:** [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) (para consumo eficiente de APIs)
*   **Enrutamiento:** [React Router Dom](https://reactrouter.com/) v6
*   **Formularios y Validación:** [Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup)
*   **Estilos:** Módulos de CSS nativos (CSS Modules)
*   **Comunicación:** [Axios](https://axios-http.com/) & [Socket.io Client](https://socket.io/docs/v4/client-api/)
*   **Notificaciones:** [SweetAlert2](https://sweetalert2.github.io/)

---

## 📋 Requisitos Previos

Asegúrate de tener instalado en tu entorno de desarrollo:
*   [Node.js](https://nodejs.org/) (Versión 16 o superior recomendada)
*   [NPM](https://www.npmjs.com/) o [Yarn](https://yarnpkg.com/)

---

## ⚙️ Instalación y Configuración

1.  **Clona el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd OUR_MARKET_TPV
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las Variables de Entorno:**
    Duplica el archivo `.env.example` y renómbralo a `.env`:
    ```bash
    cp .env.example .env
    ```
    
    Ajusta los valores en el archivo `.env` según la configuración de tu servidor:
    ```env
    VITE_APP_API_URL=http://localhost:3040/api
    VITE_APP_SOCKET_URL=http://localhost:3040
    VITE_APP_DASHBOARD=http://localhost:5174
    VITE_GOOGLE_CLIENT_ID=<tu-google-client-id>
    VITE_APP_AUTOGESTION_URL=https://autogestion-ringo.netlify.app
    ```

---

## 🗂️ Estructura del Proyecto

El código fuente principal se encuentra organizado dentro de la carpeta `src/`:

```
src/
├── api/             # Endpoints y configuración de RTK Query & Axios
├── assets/          # Imágenes, logos y recursos estáticos
├── components/      # Componentes reutilizables organizados por módulos
│   ├── cashierLayout/
│   ├── categories/
│   ├── homeLayout/
│   ├── keypad/      # Teclado interactivo para cajero
│   ├── navbar/      # Barra de navegación superior con buscador
│   ├── orderDetail/ # Detalle de la orden/carrito actual
│   ├── receipt/     # Diseño del ticket de venta impreso
│   └── ...
├── context/         # Contextos personalizados de React
├── hooks/           # Custom hooks (ej. useSocket para WebSockets)
├── pages/           # Vistas/Páginas principales de la aplicación
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── ProductsPage.jsx
│   ├── CashierPage.jsx
│   └── ResumePage.jsx
├── redux/           # Configuración del store global y slices (auth, ui, orders, etc.)
├── router/          # Enrutador de la aplicación y protección de rutas
└── utils/           # Funciones de utilidad comunes
```

---

## 🛠️ Scripts Disponibles

En el directorio del proyecto, puedes ejecutar los siguientes comandos:

### `npm run dev`
Inicia el servidor de desarrollo local usando Vite.
> Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la aplicación.

### `npm run build`
Compila y optimiza la aplicación para producción en la carpeta `dist/`.
> Genera archivos listos para ser desplegados en un servidor web.

### `npm run lint`
Analiza el código fuente con ESLint para encontrar y corregir problemas de formato o malas prácticas.

### `npm run preview`
Lanza un servidor local para previsualizar la compilación de producción generada por `npm run build`.

---

## 🔌 Variables de Entorno Explicadas

| Variable | Descripción | Valor de Ejemplo |
| :--- | :--- | :--- |
| `VITE_APP_API_URL` | URL base del backend de la tienda. | `http://localhost:3040/api` |
| `VITE_APP_SOCKET_URL` | Servidor WebSocket para actualizaciones en tiempo real. | `http://localhost:3040` |
| `VITE_APP_DASHBOARD` | URL del panel de administración principal. | `http://localhost:5174` |
| `VITE_GOOGLE_CLIENT_ID` | Client ID de Google Console para el inicio de sesión con Google. | `59325840122-...` |
| `VITE_APP_AUTOGESTION_URL` | URL de la plataforma web de autogestión de clientes. | `https://autogestion-ringo.netlify.app` |

---

## 👨‍💻 Contribución

1. Crea una rama para tu feature (`git checkout -b feature/NuevaFuncionalidad`).
2. Realiza tus cambios y haz commit (`git commit -m 'Añade nueva funcionalidad'`).
3. Sube los cambios a la rama (`git push origin feature/NuevaFuncionalidad`).
4. Abre un Pull Request describiendo tus modificaciones.
