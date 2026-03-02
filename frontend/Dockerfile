# ── Frontend Dockerfile (Desarrollo) ─────────────────────────

FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package.json package-lock.json* ./
RUN npm install

# Copiar código
COPY . .

# Variables de entorno
ENV NEXT_PUBLIC_API_URL=http://localhost:4000/api

EXPOSE 3000

CMD ["npm", "run", "dev"]