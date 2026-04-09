# Documentación del Backend: LuxGem Jewelry Store

## 1. Objetivo del Sistema
El objetivo principal del backend es proveer una **API RESTFul** robusta y segura que actúe como el núcleo central de la plataforma **LuxGem Jewelry Store**. Este componente se encarga de manejar la lógica de negocio, gestionar la persistencia y lectura de datos (productos, usuarios, pedidos), facilitar la subida de archivos (como imágenes de joyas) y gestionar la autenticación y autorización de los usuarios.

## 2. Arquitectura
La arquitectura sigue un modelo cliente-servidor tradicional apoyado en un stack de tecnologías de JavaScript/Node.js:
- **Entorno de Ejecución:** Node.js.
- **Framework Web:** Express.js (`express ^4.18.2`).
- **Capa de Datos (ORM):** Sequelize (`sequelize ^6.35.2`) para conectar, consultar y modelar los datos relacionales de forma estructurada.
- **Base de Datos Relacional:** PostgreSQL (mediante el driver `pg ^8.11.3`).
- **Otros Componentes Clave:** 
  - Manejo de carga de archivos usando `multer`.
  - Validación de esquemas y peticiones con `express-validator`.
  - Seguridad mediante `bcryptjs` (hashing de contraseñas) y `jsonwebtoken` (JWT para manejo de sesiones).

## 3. Funcionamiento
El servidor se lanza mediante el archivo principal `src/server.js`. Una vez levantado en el puerto (por defecto 8080), queda a la escucha de peticiones HTTP.
- Cuando el frontend solicita información (ej. catálogo de joyas), el backend intercepta la solicitud.
- Procesa middlewares de seguridad (CORS) y validación de tokens en rutas protegidas.
- Hace uso de Sequelize para consultar o alterar registros en la base de datos PostgreSQL.
- Transforma los datos y los envía de regreso en formato JSON.

## 4. Qué Consume (Dependencias Externas)
El backend actúa como proveedor para el frontend, pero a su vez consume:
- **Base de Datos PostgreSQL:** Conexión persistente mediante el puerto `5432` hacia un contenedor o servidor PostgreSQL para su capa persistente (leer/escribir base de datos `luxgem_db`).
- **Sistema de Archivos Local / Volúmenes:** Funciona en conjunto con una carpeta `uploads` mapeada para persistir archivos físicos localmente.

## 5. Configuración de los Componentes
El proyecto se configura principalmente a través de Variables de Entorno (`.env`) garantizando prácticas de seguridad (12-Factor App):
- **Servidor:** `PORT` (puerto de escucha), `NODE_ENV` (ej. production, development).
- **Base de Datos:** `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.
- **Autenticación (JWT):** `JWT_SECRET` (Llave de encriptación) y `JWT_EXPIRES_IN` (Tiempo de sesión, ej. 24h).
- **Archivos:** `MAX_FILE_SIZE` (limite para multer).
- **CORS:** `FRONTEND_URL` para permitir explícitamente peticiones del cliente (ej. http://localhost:3000).

Para modo de desarrollo, se usa `nodemon` para reinicios automáticos tras cada cambio de código.
