# ─────────────────────────────────────────────────────────────
# Builder Stage
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Desactivar telemetría
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar dependencias primero (mejor caching)
COPY package.json package-lock.json* ./

RUN npm ci

# Copiar el resto del proyecto
COPY . .

# Variables de build (solo frontend)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Seguridad: eliminar cualquier env local
RUN rm -f .env* || true

# Build optimizado de Next
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Production Runner
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Crear usuario no-root (seguridad)
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copiar build standalone
COPY --from=builder /app/.next/standalone ./

# Copiar assets estáticos
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Permisos correctos
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]