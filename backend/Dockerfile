# ─────────────────────────────────────────────────────────────
# Builder Stage
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias necesarias
RUN apk add --no-cache wget

# Copiar dependencias primero (mejor cache)
COPY package*.json ./

RUN npm ci --omit=dev

# Copiar el resto del proyecto
COPY . .

# Seguridad: eliminar env locales
RUN rm -f .env* || true

# ─────────────────────────────────────────────────────────────
# Production Runner
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache wget

ENV NODE_ENV=production
ENV PORT=8080

# Crear usuario no-root
RUN addgroup -S nodejs && adduser -S expressjs -G nodejs

# Copiar app desde builder
COPY --from=builder /app /app

# Crear carpeta uploads con permisos correctos
RUN mkdir -p uploads && chown -R expressjs:nodejs /app

USER expressjs

EXPOSE 8080

# Healthcheck para Kubernetes / ALB
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

CMD ["node", "src/server.js"]