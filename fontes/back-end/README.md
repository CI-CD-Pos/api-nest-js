# 🚀 Pipeline CI/CD — NestJS + Jenkins + SonarQube + Trivy (Docker Local)

> Pipeline completo de Integração Contínua para uma API NestJS com autenticação JWT, rodando **100% local** via Docker.

---

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Arquitetura](#-arquitetura)
3. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
4. [Estrutura de Arquivos](#-estrutura-de-arquivos)
5. [Explicação Detalhada de Cada Arquivo](#-explicação-detalhada-de-cada-arquivo)
6. [Pré-requisitos](#-pré-requisitos)
7. [Passo a Passo — Subindo a Infraestrutura](#-passo-a-passo--subindo-a-infraestrutura)
8. [Os 8 Estágios do Pipeline](#-os-8-estágios-do-pipeline)
9. [Deploy Manual](#-deploy-manual)
10. [Verificação Final](#-verificação-final)
11. [Troubleshooting](#-troubleshooting)
12. [Roteiro para Apresentação em Vídeo](#-roteiro-para-apresentação-em-vídeo)
13. [Ordem de Estudo dos Arquivos](#-ordem-de-estudo-dos-arquivos)
14. [Resultados Obtidos](#-resultados-obtidos)

---

## 🎯 Visão Geral

Este projeto demonstra um pipeline de **CI (Continuous Integration)** completo para uma API REST construída com NestJS. A API possui endpoints de autenticação (`sign-up`, `sign-in`, `/me`) e utiliza Prisma ORM com PostgreSQL.

O pipeline é executado pelo **Jenkins** e possui **8 estágios**:

| #   | Estágio          | Ferramenta        | Finalidade                        |
| --- | ---------------- | ----------------- | --------------------------------- |
| 1   | Checkout         | Git               | Clonar repositório                |
| 2   | Build            | pnpm + TypeScript | Instalar dependências e compilar  |
| 3   | Unit Tests       | Jest              | Executar testes com cobertura     |
| 4   | SonarQube Scan   | sonar-scanner     | Análise estática de código        |
| 5   | Trivy Repo Scan  | Trivy             | Vulnerabilidades no código-fonte  |
| 6   | Docker Build     | Docker            | Construir imagem da aplicação     |
| 7   | Trivy Image Scan | Trivy             | Vulnerabilidades na imagem Docker |
| 8   | Create Git Tag   | Git               | Criar e enviar tag de versão      |

---

## 🏗 Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        Docker Host (Local)                      │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────────┐  │
│  │  Jenkins CI   │   │  SonarQube   │   │  PostgreSQL (CI)   │  │
│  │  :8080        │   │  :9000       │   │  :5432             │  │
│  │              │   │              │   │                    │  │
│  │  Node.js 22  │   │  Análise     │   │  Banco para       │  │
│  │  pnpm        │   │  estática    │   │  desenvolvimento   │  │
│  │  Trivy       │   │  Cobertura   │   │                    │  │
│  │  sonar-scan  │   │  Quality Gate│   │                    │  │
│  │  Docker CLI  │   │              │   │                    │  │
│  └──────┬───────┘   └──────────────┘   └────────────────────┘  │
│         │                                                       │
│         │ docker.sock                                           │
│         ▼                                                       │
│  ┌──────────────────────┐                                       │
│  │  Docker Engine        │  ← Builds de imagem acontecem aqui   │
│  │  (Host compartilhado) │                                      │
│  └──────────────────────┘                                       │
│                                                                 │
│               app-network (bridge)                              │
└─────────────────────────────────────────────────────────────────┘
```

**Conceito-chave:** O Jenkins roda **dentro** de um container Docker, mas usa o `docker.sock` do host para construir imagens Docker. Isso permite que o Jenkins execute `docker build` sem Docker-in-Docker (DinD).

---

## 🛠 Tecnologias Utilizadas

| Tecnologia     | Versão                 | Função                             |
| -------------- | ---------------------- | ---------------------------------- |
| NestJS         | v11                    | Framework da API REST              |
| Prisma ORM     | v6                     | ORM + migrações do banco           |
| PostgreSQL     | latest (Bitnami)       | Banco de dados relacional          |
| Node.js        | 22 (Alpine/NodeSource) | Runtime JavaScript                 |
| pnpm           | latest                 | Gerenciador de pacotes             |
| TypeScript     | v5                     | Linguagem principal                |
| Jest           | v29                    | Framework de testes                |
| Jenkins        | LTS                    | Servidor de CI                     |
| SonarQube      | 9.9 LTS                | Análise estática de código         |
| Trivy          | v0.68.2                | Scanner de vulnerabilidades        |
| Docker         | –                      | Containerização                    |
| Docker Compose | –                      | Orquestração de containers         |
| Zod            | –                      | Validação de variáveis de ambiente |
| JWT / bcrypt   | –                      | Autenticação e hash de senhas      |

---

## 📁 Estrutura de Arquivos

```
fontes/back-end/
├── docker-compose.yml          # 🔧 Infraestrutura CI (Jenkins + SonarQube + Postgres)
├── Dockerfile                  # 🐳 Build multi-stage da API (base → build → prod)
├── Makefile                    # ⚙️  Targets de CI chamados pelo Jenkinsfile
├── Jenkinsfile                 # 📜 Pipeline declarativo com 8 estágios
├── sonar-project.properties    # 🔍 Configuração do SonarQube Scanner
├── jest.config.js              # 🧪 Configuração do Jest (cobertura lcov)
├── jest.setup.js               # 🧪 Variáveis dummy para testes no CI
├── .gitignore                  # 🚫 Arquivos ignorados pelo Git
├── package.json                # 📦 Dependências e scripts
├── prisma/
│   └── schema.prisma           # 🗄️  Schema do banco de dados
├── jenkins/
│   └── Dockerfile              # 🔧 Imagem customizada do Jenkins
├── deploy/
│   └── compose.yaml            # 🚀 Compose de deploy manual
├── src/
│   ├── main.ts                 # Entrada da aplicação
│   ├── app.module.ts           # Módulo raiz
│   ├── auth/                   # Módulo de autenticação
│   │   ├── auth.controller.ts  # Rotas: sign-up, sign-in, /me
│   │   ├── auth.service.ts     # Lógica de negócio
│   │   ├── auth.guard.ts       # Guard JWT
│   │   ├── dtos/auth.ts        # DTOs com Zod
│   │   └── schemas/            # Schemas de validação
│   ├── prisma/
│   │   └── prisma.service.ts   # Serviço do Prisma
│   └── pipe/
│       └── zod-validation.pipe.ts  # Pipe de validação Zod
└── test/
    └── app.e2e-spec.ts         # Testes e2e
```

---

## 📖 Explicação Detalhada de Cada Arquivo

### 1. `jenkins/Dockerfile` — Imagem Customizada do Jenkins

```dockerfile
FROM jenkins/jenkins:lts
```

Este é o **coração da infraestrutura CI**. A imagem oficial do Jenkins não vem com as ferramentas necessárias, então construímos uma customizada com:

| Ferramenta          | Por quê?                                        |
| ------------------- | ----------------------------------------------- |
| `docker.io`         | Para executar `docker build` dentro do Jenkins  |
| `make`              | Para rodar os targets do Makefile               |
| `Node.js 22`        | Runtime para compilar e testar o projeto NestJS |
| `pnpm`              | Gerenciador de pacotes do projeto               |
| `Trivy v0.68.2`     | Scanner de vulnerabilidades (código + imagem)   |
| `sonar-scanner CLI` | Envia métricas e cobertura para o SonarQube     |

**Fluxo:** `jenkins/jenkins:lts` → Instala Docker + Make + Trivy → Instala Node.js 22 + pnpm → Instala sonar-scanner CLI

---

### 2. `docker-compose.yml` — Infraestrutura de CI

Sobe **4 serviços** em uma rede compartilhada (`app-network`):

| Serviço     | Container          | Porta | Função                           |
| ----------- | ------------------ | ----- | -------------------------------- |
| `postgres`  | `postgres_db_auth` | 5432  | Banco para desenvolvimento local |
| `api`       | `nest_api_auth`    | 3000  | API NestJS (build local)         |
| `jenkins`   | `jenkins-ci`       | 8080  | Servidor de CI                   |
| `sonarqube` | `sonarqube`        | 9000  | Análise estática de código       |

**Detalhes importantes:**

- O Jenkins monta `/var/run/docker.sock` do host → permite construir imagens Docker
- O Jenkins roda como `user: root` → necessário para acessar o Docker socket
- O volume `jenkins_home` persiste dados entre restarts
- O SonarQube usa `SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true` para funcionar sem ajuste de `vm.max_map_count`

---

### 3. `Makefile` — Targets de CI

O Makefile abstrai os comandos complexos em targets simples, chamados pelo Jenkinsfile:

| Target            | Comando                                                | Usado no Estágio |
| ----------------- | ------------------------------------------------------ | ---------------- |
| `install`         | `pnpm install --frozen-lockfile`                       | 2 (Build)        |
| `prisma-generate` | `pnpm prisma generate`                                 | 2 (Build)        |
| `build`           | install + prisma-generate + `pnpm build`               | 2 (Build)        |
| `test-cov`        | `pnpm test:cov`                                        | 3 (Unit Tests)   |
| `build-docker`    | `docker build -t $(IMAGE) .`                           | 6 (Docker Build) |
| `trivy-repo`      | `trivy fs --severity HIGH,CRITICAL`                    | 5 (Trivy Repo)   |
| `trivy-image`     | `trivy image --severity HIGH,CRITICAL` + `--skip-dirs` | 7 (Trivy Image)  |

**Por que `--skip-dirs` no `trivy-image`?** A imagem base `node:22-alpine` inclui npm, yarn e corepack no sistema. Esses pacotes possuem vulnerabilidades conhecidas, mas não são usados pela aplicação (usamos pnpm). O `--skip-dirs` ignora esses diretórios durante o scan.

---

### 4. `Jenkinsfile` — Pipeline Declarativo

O Jenkinsfile define o pipeline com:

- **`agent any`** — Roda no próprio Jenkins
- **`environment`** — Define variáveis (imagem, repo, SonarQube URL, tokens)
- **`stages`** — 8 estágios executados em sequência
- **`post`** — Ações pós-pipeline (always, success, failure)

**Credenciais necessárias no Jenkins:**
| ID | Tipo | Função |
|----|------|--------|
| `sonar-token` | Secret Text | Token de autenticação do SonarQube |
| `github-token` | Secret Text | Personal Access Token do GitHub (scope: `repo`) |

**Notas:**

- Todo estágio usa `dir('fontes/back-end')` porque o repositório tem a API dentro de uma subpasta
- A imagem é tagueada com `${BUILD_NUMBER}` (ex.: `api-nest-ci:9`)
- A tag Git segue o padrão `v1.0.${BUILD_NUMBER}` (ex.: `v1.0.9`)

---

### 5. `Dockerfile` — Build Multi-Stage da API

O Dockerfile usa **3 estágios** para otimizar a imagem final:

```
base  →  Configura Node.js + pnpm no Alpine
build →  Instala deps + gera Prisma Client + compila TypeScript
prod  →  Copia apenas o necessário (node_modules, dist, generated)
```

**Por que multi-stage?**

- A etapa `build` contém todo o código-fonte e devDependencies
- A etapa `prod` copia apenas `node_modules`, `dist` e `src/generated`
- Resultado: imagem menor e mais segura

---

### 6. `sonar-project.properties` — Configuração SonarQube

| Propriedade                         | Valor                           | Significado                       |
| ----------------------------------- | ------------------------------- | --------------------------------- |
| `sonar.projectKey`                  | `api-nest-js`                   | Identificador único no SonarQube  |
| `sonar.sources`                     | `src`                           | Diretório do código-fonte         |
| `sonar.exclusions`                  | `src/generated/**,**/*.spec.ts` | Ignora código gerado e testes     |
| `sonar.tests`                       | `src`                           | Diretório dos testes              |
| `sonar.test.inclusions`             | `**/*.spec.ts`                  | Padrão de arquivos de teste       |
| `sonar.javascript.lcov.reportPaths` | `coverage/lcov.info`            | Caminho do relatório de cobertura |

O Jest gera o `lcov.info` e o sonar-scanner envia para o SonarQube, que exibe a **cobertura de código** no dashboard.

---

### 7. `jest.config.js` + `jest.setup.js` — Configuração de Testes

**`jest.config.js`:**

- Usa `ts-jest` para rodar TypeScript
- Gera cobertura nos formatos `text`, `lcov` e `cobertura`
- O formato `lcov` é essencial para o SonarQube

**`jest.setup.js`:**

- Define variáveis de ambiente dummy (`DATABASE_URL`, `SECRET`)
- Sem isso, o Zod falharia ao validar as variáveis no CI (onde não existe `.env`)

---

### 8. `deploy/compose.yaml` — Deploy Manual

Compose **separado** da infraestrutura CI, usado para deploy local:

```bash
# Windows PowerShell
$env:TAG="9"; docker compose -f deploy/compose.yaml up -d

# Linux/Mac
TAG=9 docker compose -f deploy/compose.yaml up -d
```

**Diferença do `docker-compose.yml` principal:**

- Não sobe Jenkins nem SonarQube
- Usa `image: api-nest-ci:${TAG:-latest}` em vez de `build`
- A imagem já foi construída pelo pipeline (Stage 6)
- Rede separada: `deploy-network`

---

## ✅ Pré-requisitos

- [x] **Docker Desktop** instalado e rodando
- [x] **Docker Compose** (já incluído no Docker Desktop)
- [x] **Git** configurado
- [x] **Conta no GitHub** com acesso ao repositório
- [x] **Personal Access Token (GitHub)** com scope `repo`

---

## 📝 Passo a Passo — Subindo a Infraestrutura

### Passo 1 — Clonar o repositório

```bash
git clone https://github.com/CI-CD-Pos/api-nest-js.git
cd api-nest-js/fontes/back-end
```

### Passo 2 — Subir os containers

```bash
docker compose up -d --build
```

Isso construirá a imagem do Jenkins (pode demorar 3-5 min na primeira vez) e subirá:

- Jenkins em `http://localhost:8080`
- SonarQube em `http://localhost:9000`
- PostgreSQL em `localhost:5432`

### Passo 3 — Configurar o Jenkins

1. Acesse `http://localhost:8080`
2. Obtenha a senha inicial:
   ```bash
   docker exec jenkins-ci cat /var/jenkins_home/secrets/initialAdminPassword
   ```
3. Instale os **plugins sugeridos**
4. Crie um usuário administrador

### Passo 4 — Configurar credenciais no Jenkins

Vá em **Manage Jenkins → Credentials → System → Global credentials**:

| Credencial      | Tipo        | ID             | Valor                     |
| --------------- | ----------- | -------------- | ------------------------- |
| SonarQube Token | Secret Text | `sonar-token`  | Token gerado no SonarQube |
| GitHub Token    | Secret Text | `github-token` | Personal Access Token     |

### Passo 5 — Gerar token no SonarQube

1. Acesse `http://localhost:9000` (login padrão: `admin` / `admin`)
2. Troque a senha quando solicitado
3. Vá em **My Account → Security → Generate Token**
4. Copie o token e cole na credencial `sonar-token` do Jenkins

### Passo 6 — Criar o Job no Jenkins

1. **New Item** → Nome: `api-nest-ci` → Tipo: **Pipeline**
2. Em **Pipeline**:
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: `https://github.com/CI-CD-Pos/api-nest-js.git`
   - Branch: `*/teste`
   - Script Path: `fontes/back-end/Jenkinsfile`
3. **Save**

### Passo 7 — Executar o Pipeline

Clique em **Build Now** e acompanhe os 8 estágios no **Stage View**.

### Passo 8 — Verificar resultados

- **Jenkins**: Todos os 8 estágios verdes ✅
- **SonarQube**: Dashboard com métricas e cobertura
- **Docker**: Imagem `api-nest-ci:<build_number>` criada
- **GitHub**: Tag `v1.0.<build_number>` no repositório

---

## 🔄 Os 8 Estágios do Pipeline

### Stage 1 — Checkout

```
git clone → clona o repositório do GitHub (branch teste)
git rev-parse --short HEAD → exibe o hash do commit
```

### Stage 2 — Build

```
pnpm install --frozen-lockfile  → instala dependências (lockfile exato)
pnpm prisma generate            → gera o Prisma Client
pnpm build                      → compila TypeScript → JavaScript
```

### Stage 3 — Unit Tests

```
pnpm test:cov → roda Jest com cobertura
                 gera coverage/lcov.info para o SonarQube
```

### Stage 4 — SonarQube Scan

```
sonar-scanner → envia código + cobertura para o SonarQube
                aguarda Quality Gate (pass/fail)
```

O SonarQube analisa: bugs, code smells, vulnerabilidades, duplicações e cobertura.

### Stage 5 — Trivy Repo Scan

```
trivy fs --severity HIGH,CRITICAL --exit-code 1 .
→ Escaneia o sistema de arquivos procurando vulnerabilidades em dependências
→ Falha o pipeline se encontrar HIGH ou CRITICAL
```

### Stage 6 — Docker Build

```
docker build -t api-nest-ci:<build_number> .
→ Constrói a imagem multi-stage da API
→ A imagem fica disponível no Docker do host (via docker.sock)
```

### Stage 7 — Trivy Image Scan

```
trivy image --severity HIGH,CRITICAL --exit-code 1 \
  --skip-dirs usr/local/lib/node_modules/npm \
  --skip-dirs root/.cache \
  --skip-dirs opt/yarn-v1.22.22 \
  api-nest-ci:<build_number>
→ Escaneia a imagem Docker procurando vulnerabilidades
→ --skip-dirs ignora pacotes do sistema não utilizados
```

### Stage 8 — Create Git Tag

```
git tag -a v1.0.<build_number> -m "Release v1.0.<build_number>"
git push https://<token>@github.com/CI-CD-Pos/api-nest-js.git v1.0.<build_number>
→ Cria tag anotada e envia para o GitHub
→ Serve como versionamento automático
```

---

## 🚀 Deploy Manual

Após o pipeline concluir com sucesso, a imagem Docker está disponível localmente.

```powershell
# Parar infraestrutura de CI (libera a porta 5432)
docker compose down

# Subir o deploy (Windows PowerShell)
$env:TAG="<build_number>"; docker compose -f deploy/compose.yaml up -d

# Testar a API
curl http://localhost:3000
```

```bash
# Linux/Mac
TAG=<build_number> docker compose -f deploy/compose.yaml up -d
```

> **Nota:** O valor de `TAG` é o número do build do Jenkins (ex.: `9`), não a tag Git (ex.: `v1.0.9`).

---

## ✔ Verificação Final

| Item         | Como verificar                      | Esperado             |
| ------------ | ----------------------------------- | -------------------- |
| Jenkins      | `http://localhost:8080`             | 8 estágios verdes    |
| SonarQube    | `http://localhost:9000`             | Quality Gate: Passed |
| Testes       | Stage 3 logs                        | Todos passando       |
| Cobertura    | SonarQube dashboard                 | > 80%                |
| Docker Image | `docker images \| grep api-nest-ci` | Imagem listada       |
| Git Tag      | `git tag -l`                        | `v1.0.<N>`           |
| Deploy       | `curl http://localhost:3000`        | Resposta da API      |

---

## 🔧 Troubleshooting

| Problema                             | Causa                          | Solução                                               |
| ------------------------------------ | ------------------------------ | ----------------------------------------------------- |
| `pnpm: not found`                    | Jenkins sem Node.js            | Rebuild: `docker compose build jenkins`               |
| `sonar-scanner: not found`           | Scanner não instalado          | Verificar `jenkins/Dockerfile`                        |
| `Quality Gate FAILED`                | SonarQube não passou           | Ver dashboard em `:9000`                              |
| `permission denied (docker.sock)`    | Jenkins sem acesso ao Docker   | Usar `user: root` no compose                          |
| `403 - Permission denied (git push)` | Token sem permissão            | Criar PAT com scope `repo` e autorizar na organização |
| Trivy falha na imagem                | Vuln em pacotes do sistema     | Adicionar `--skip-dirs` no Makefile                   |
| SonarQube não inicia                 | `vm.max_map_count` baixo       | Usar `SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true`         |
| `--frozen-lockfile` falha            | `pnpm-lock.yaml` desatualizado | Rodar `pnpm install` local e commitar o lockfile      |

---

## 🎥 Roteiro para Apresentação em Vídeo

**Duração sugerida: 15-20 minutos**

### Parte 1 — Introdução (2 min)

- Apresentar o projeto: API NestJS com autenticação
- Objetivo: pipeline CI completo rodando localmente
- Ferramentas: Jenkins + SonarQube + Trivy + Docker

### Parte 2 — Arquitetura (3 min)

- Mostrar o diagrama de arquitetura
- Explicar o conceito de Docker-in-Docker via socket
- Mostrar o `docker-compose.yml` e os 4 serviços
- Mostrar o `jenkins/Dockerfile` e as ferramentas instaladas

### Parte 3 — Configuração (3 min)

- Mostrar o Jenkins rodando (`http://localhost:8080`)
- Mostrar as credenciais configuradas
- Mostrar o job Pipeline from SCM
- Mostrar o SonarQube rodando (`http://localhost:9000`)

### Parte 4 — Pipeline em Ação (5 min)

- Clicar em **Build Now** e acompanhar o Stage View
- Explicar cada estágio enquanto executa:
  - Checkout → Build → Tests → SonarQube → Trivy → Docker → Tag
- Mostrar os logs de cada estágio

### Parte 5 — Resultados (3 min)

- Mostrar o dashboard do SonarQube (métricas, cobertura, Quality Gate)
- Mostrar `docker images | grep api-nest-ci`
- Mostrar a tag no GitHub (`git tag -l`)

### Parte 6 — Deploy (2 min)

- Parar infraestrutura CI
- Subir o deploy com `$env:TAG="<N>"`
- Testar a API com `curl` ou Postman

### Parte 7 — Conclusão (2 min)

- Resumir o fluxo completo
- Benefícios: qualidade, segurança, automação, versionamento
- Possíveis melhorias: CD, Kubernetes, notificações

---

## 📚 Ordem de Estudo dos Arquivos

Para entender o projeto progressivamente, siga esta ordem:

| #   | Arquivo                            | O que aprender                                 |
| --- | ---------------------------------- | ---------------------------------------------- |
| 1   | `package.json`                     | Scripts, dependências e estrutura do projeto   |
| 2   | `prisma/schema.prisma`             | Modelagem do banco de dados                    |
| 3   | `src/main.ts`                      | Ponto de entrada da aplicação                  |
| 4   | `src/auth/auth.controller.ts`      | Rotas da API (sign-up, sign-in, /me)           |
| 5   | `src/auth/auth.service.ts`         | Lógica de negócio (bcrypt, JWT)                |
| 6   | `jest.config.js` + `jest.setup.js` | Configuração de testes e cobertura             |
| 7   | `Dockerfile`                       | Build multi-stage da aplicação                 |
| 8   | `docker-compose.yml`               | Infraestrutura: Jenkins + SonarQube + Postgres |
| 9   | `jenkins/Dockerfile`               | Imagem customizada com todas as ferramentas    |
| 10  | `Makefile`                         | Targets de CI (abstraem comandos complexos)    |
| 11  | `sonar-project.properties`         | Configuração da análise estática               |
| 12  | `Jenkinsfile`                      | Pipeline: orquestra todos os targets           |
| 13  | `deploy/compose.yaml`              | Deploy manual usando a imagem gerada           |

**Lógica da ordem:** Código da aplicação → Testes → Docker da app → Infraestrutura CI → Ferramentas CI → Pipeline → Deploy

---

## 📊 Resultados Obtidos

| Métrica                        | Valor                           |
| ------------------------------ | ------------------------------- |
| Testes unitários               | 29 passando ✅                  |
| Cobertura de código            | ~81%                            |
| Quality Gate SonarQube         | ✅ Passed                       |
| Vulnerabilidades (Trivy Repo)  | 0 HIGH/CRITICAL                 |
| Vulnerabilidades (Trivy Image) | 0 HIGH/CRITICAL (com skip-dirs) |
| Imagem Docker                  | `api-nest-ci:<build_number>`    |
| Tag Git                        | `v1.0.<build_number>`           |
| Tempo médio do pipeline        | ~2-4 minutos                    |

---

## 📄 Licença

Projeto acadêmico para a disciplina de CI/CD — Pós-graduação.

---

> **Feito com ❤️ usando NestJS + Jenkins + SonarQube + Trivy + Docker**
