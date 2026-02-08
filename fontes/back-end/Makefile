IMAGE ?= api-nest-ci:latest
NODE_ENV ?= production

build:
	npm ci
	npm run build

test:
	npm test -- --runInBand

build-docker:
	docker build -t $(IMAGE) .

trivy-image:
	trivy image --no-progress $(IMAGE)
