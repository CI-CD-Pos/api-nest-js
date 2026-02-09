

IMAGE ?= api-nest-ci:latest
APP_VERSION ?= dev

install:
	pnpm install --frozen-lockfile


prisma-generate:
	pnpm prisma generate

build: install prisma-generate
	pnpm build
test:
	pnpm test


test-cov:
	pnpm test:cov


sonar:
	sonar-scanner


build-docker:
	docker build --build-arg APP_VERSION=$(APP_VERSION) -t $(IMAGE) .


trivy-repo:
	trivy fs --severity HIGH,CRITICAL --exit-code 1 --no-progress .


trivy-image:
	trivy image --severity HIGH,CRITICAL --exit-code 1 --no-progress \
		--skip-dirs usr/local/lib/node_modules/npm \
		--skip-dirs root/.cache \
		--skip-dirs opt/yarn-v1.22.22 \
		$(IMAGE)

.PHONY: install prisma-generate build test test-cov sonar build-docker trivy-repo trivy-image
