# Empaquetado y Despliegue con Docker (LuxGem)

## 1. Objetivo del Empaquetado
El principal objetivo del uso de **Docker** en el proyecto LuxGem es garantizar consistencia a través de los entornos (desarrollo, pruebas y producción). Aislando las tres bases tecnológicas del programa (Base de Datos, Backend y Frontend) en contenedores individuales, se resuelve el clásico problema de "en mi máquina sí funciona" y se facilita el despliegue a servicios de Cloud como AWS (ej. archivos `Dockerrun.aws.json` que evidencian escalabilidad en plataformas como Elastic Beanstalk o ECS).

## 2. Arquitectura de Docker Compose
Se centraliza el lanzamiento y orquestación de la plataforma en el archivo de configuración declarativo global `docker-compose.yml`, que instancía 3 servicios principales bajo la red `luxgem-network`:

### Servicio 1: `postgres`
- **Imagen:** `postgres:15-alpine` (versión ligera).
- **Objetivo:** Alojamiento de la base de datos relacional.
- **Configuración:** Inyecta credenciales mediante variables (`POSTGRES_DB`, `POSTGRES_USER`, etc.). Cuenta con un *healthcheck* utilizando la instrucción nativa `pg_isready` para notificar cuándo está listos para aceptar conexiones.
- **Volúmenes:** Emplea y mapea un volumen nombrado (`luxgem_postgres_data`) para asegurar que la base de datos subsista reinicios. Además, expone y monta el `./database/init.sql` para *sembrar* la base de datos inicial automáticamente.

### Servicio 2: `backend`
- **Construcción (Build):** Compila mediante un `Dockerfile` ubicado en la carpeta `./backend`.
- **Objetivo:** Ejecutar el servidor Node API de forma persistente.
- **Configuración:** Expone el puerto `8080`. Consume su .env pasándoselos desde el compose o dependencias nativas. Tiene una directiva explícita de dependencia (`depends_on > condition: service_healthy`) hacia `postgres` asegurando que la API no inicie antes de que la DB esté completamente lista.
- **Volúmenes:** Mapea un volumen para su directorio de subida de archivos locales en la ruta `/app/uploads` (`luxgem_uploads_data`), garantizando la preservación de las imágenes cargadas vía Multer.

### Servicio 3: `frontend`
- **Construcción (Build):** Compila mediante un bloque de construcción personalizado usando su `Dockerfile` en la carpeta `./frontend`. 
- **Objetivo:** Alojar la aplicación en Next.js.
- **Configuración:** Durante el tiempo de construcción (*built-time args*) pasa las variables `NEXT_PUBLIC_API_URL` e `INTERNAL_API_URL` requeridas por Next.js para embeber la ruta estáticamente en la UI del cliente. El contenedor escucha en el puerto `3000`. También requiere explícitamente (`depends_on`) que exista el contenedor de backend.

## 3. Redes (Networking)
Para la comunicación segura entre estos contenedores se define `luxgem-network`, red de tipo puente (`bridge`). Esto permite que el componente frontend hable con el router backend resolviendo por el nombre del contenedor (es decir, el frontend consulta `http://backend:8080` de forma directa sin salir a la red de internet general) proveyendo seguridad interna entre el hub de microservicios.
