# ========================================
# Makefile — CI targets para Jenkins
# ========================================

IMAGE ?= api-nest-ci:latest

# ---------- Instalação de dependências ----------
install:
	pnpm install --frozen-lockfile

# ---------- Geração do Prisma Client ----------
prisma-generate:
	pnpm prisma generate

# ---------- Build da aplicação ----------
build: install prisma-generate
	pnpm build

# ---------- Testes unitários ----------
test:
	pnpm test

# ---------- Testes com cobertura (para Sonar) ----------
test-cov:
	pnpm test:cov

# ---------- SonarQube scan ----------
sonar:
	sonar-scanner

# ---------- Docker build ----------
build-docker:
	docker build -t $(IMAGE) .

# ---------- Trivy: scan do repositório (filesystem) ----------
trivy-repo:
	trivy fs --severity HIGH,CRITICAL --exit-code 1 --no-progress .

# ---------- Trivy: scan da imagem Docker ----------
trivy-image:
	trivy image --severity HIGH,CRITICAL --exit-code 1 --no-progress $(IMAGE)

.PHONY: install prisma-generate build test test-cov sonar build-docker trivy-repo trivy-image
