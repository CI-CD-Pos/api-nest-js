# Build stage
FROM node:22-alpine AS builder

RUN apk add --no-cache bash

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar dependências (incluindo dev dependencies necessárias para o build)
RUN pnpm install --no-frozen-lockfile

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN pnpm exec prisma generate

# Build da aplicação
RUN pnpm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copiar node_modules do stage de build
COPY --from=builder /app/node_modules ./node_modules

# Copiar package.json 
COPY package.json ./

# Copiar a pasta dist do stage de build
COPY --from=builder /app/dist ./dist

# Copiar o schema do Prisma para migrations
COPY --from=builder /app/prisma ./prisma

# Copiar o cliente gerado do Prisma
COPY --from=builder /app/src/generated ./src/generated

# Expor a porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando para iniciar a aplicação
CMD ["node", "dist/src/main.js"]
