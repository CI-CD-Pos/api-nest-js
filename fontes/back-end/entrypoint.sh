#!/bin/sh
set -e

echo "🔄 Executando migrations do Prisma..."
npx prisma migrate deploy
echo "✅ Migrations aplicadas com sucesso!"

echo "🚀 Iniciando a API..."
exec node dist/src/main
