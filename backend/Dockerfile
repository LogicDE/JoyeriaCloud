# ── Backend Dockerfile ──────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (caching layer)
COPY package*.json ./

RUN npm ci --omit=dev

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/health || exit 1

CMD ["node", "src/server.js"]
