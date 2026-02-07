# ========================================
# Base - Node.js com pnpm
# ========================================
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# ========================================
# Build - Instala deps e compila
# ========================================
FROM base AS build
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm prisma generate && pnpm build

# ========================================
# Prod - Imagem final de produção
# ========================================
FROM base AS prod
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/generated ./src/generated
COPY --from=build /app/package.json ./

EXPOSE 3000
CMD ["node", "dist/src/main"]
