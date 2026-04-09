# Documentación del Frontend: LuxGem Jewelry Store

## 1. Objetivo del Sistema
El objetivo del frontend es proveer una interfaz de usuario (UI) moderna, atractiva, responsiva y altamente interactiva para la tienda digital **LuxGem**. Los clientes pueden navegar por el catálogo de joyería, añadir artículos al carrito de compras, e interactuar con la plataforma de forma fluida asegurando una excelente experiencia de usuario (UX).

## 2. Arquitectura
El frontend está construido sobre componentes modernos de React apoyado en el framework Next.js:
- **Framework Principal:** Next.js (versión 16.1.6) haciendo uso del nuevo sistema de enrutamiento **App Router** (carpeta `app/`).
- **Librería UI base:** React 19 con un ecosistema tipado empleando **TypeScript**.
- **Gestión del Estado Global:** Zustand (`zustand ^5.0.11`), utilizado para manejar de forma eficiente la lógica del `cart` (carrito de compras) a través de componentes sin dependencias pesadas tipo Redux.
- **Estilos y Componentes:** Tailwind CSS v4 para aplicar diseño basado en utilidades de forma ágil, complementado por PostCSS.
- **Iconografía:** Lucide React (`lucide-react`) proveyendo iconos modernos y ligeros.

## 3. Funcionamiento
Al basarse en Next.js App Router, el frontend ofrece tanto renderizado del lado del servidor (SSR) para SEO avanzado y tiempos de carga rápidos como componentes del lado del cliente para interacciones locales (ej. agregar un anillo al carrito).
- **`app/`**: Contiene la definición de las páginas (Home, Productos, Checkout) apoyándose en los archivos de Next.js como `layout.tsx`, `page.tsx`.
- **`components/`**: Interfaz de componentes reusables de React (ej. Botones, Tarjetas de Producto, Navbar).
- **`store/` y `cart/`**: Almacenan la lógica de estado provista por Zustand para el carrito de compras del usuario, asegurando que las joyas seleccionadas persistan a través de las rutas.

## 4. Qué Consume (Dependencias Externas)
El frontend como cliente no posee base de datos propia, por lo tanto:
- **Consume la API REST del Backend:** Mediante peticiones HTTP (`fetch`), accede a los recursos expuestos por el backend de LuxGem (para listado de joyas, logueo de usuarios, subida de compras). 
- Interactúa usando la URL orientada como servicio según el entorno (ej. peticiones internas en servidor vs peticiones en cliente navegador).

## 5. Configuración de los Componentes
El entorno frontend se rige por configuraciones orientadas tanto al linter y compilador (React/TypeScript) como las redes para conectar a la API:
- **Variables de Entorno (`.env.local` / config Docker):**
  - `NEXT_PUBLIC_API_URL`: URL pública de la API que usarán los componentes cliente al montarse en el navegador de los usuarios (ej. http://localhost/api).
  - `INTERNAL_API_URL`: URL interna usada durantes los Server Components SSR en Node.js (ej. http://backend:8080/api).
- **`next.config.ts`**: Modificaciones sobre el compilador de Next y el tratamiento de imagenes remotas o dominios habilitados.
- **`tsconfig.json` & `eslint.config.mjs`**: Mantienen las buenas prácticas de tipado estricto para evitar bugs durante el desarrollo.
