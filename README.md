# Configuracoes do Projeto

## Tecnologias

- Node.js + NestJS (TypeScript)
- PostgreSQL
- Drizzle ORM / Drizzle Kit
- Docker e Docker Compose
- Vitest (testes)

## Requisitos

- Node.js 20+
- npm
- Docker e Docker Compose (opcional para ambiente containerizado)

## Variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://postgres:supersafe@localhost:5555/banking?sslmode=disable
JWT_SECRET=defina-um-segredo-seguro
PORT=5000
```

Observacoes:

- O projeto le `DATABASE_URL` para conexao com o banco.
- O modulo JWT usa `JWT_SECRET`.
- A API sobe por padrao na porta `5000` quando `PORT` nao e definido.

## Execucao local (sem Docker)

1. Instale dependencias:

```bash
npm install
```

2. Suba um PostgreSQL local ou via Docker (porta `5555` sugerida pelo compose).

3. Execute em modo desenvolvimento:

```bash
npm run start:dev
```

4. Acesse:

- API: `http://localhost:5000/api`
- Swagger: `http://localhost:5000/api/doc`

## Execucao com Docker Compose

Arquivo: `docker-compose.yml`

Servicos:

- `api`
  - Container: `banking-api`
  - Porta: `5000:5000`
  - Variaveis:
    - `PORT=5000`
    - `JWT_SECRET=019c8a95-43e4-7797-88e6-67f00573ea54`
    - `DATABASE_URL=postgresql://postgres:supersafe@postgres:5432/banking?sslmode=disable`
- `postgres`
  - Container: `postgres-local`
  - Imagem: `postgres:16-alpine`
  - Porta: `5555:5432`
  - Credenciais:
    - `POSTGRES_USER=postgres`
    - `POSTGRES_PASSWORD=supersafe`
    - `POSTGRES_DB=banking`

Comando para subir:

```bash
docker compose up --build
```

## Scripts npm

- `npm run build`: build da aplicacao
- `npm run start`: inicia app
- `npm run start:dev`: modo watch
- `npm run start:debug`: debug + watch
- `npm run start:prod`: executa build (`dist/src/main`)
- `npm run lint`: lint com ESLint
- `npm run test`: testes com Vitest
- `npm run test:cov`: cobertura de testes

## Banco e migrations

Configuracao do Drizzle:

- Arquivo: `drizzle.config.ts`
- Dialeto: `postgresql`
- Schema: `./src/db/schema/*.schema.ts`
- Saida de migrations: `./migrations`

O `DATABASE_URL` e lido de variavel de ambiente.
