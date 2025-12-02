# Alakh Mart Backend

Scaffolded Node.js + Express backend for Alakh Mart.

Quick start:

1. Install dependencies:

```
npm install
```

2. Start in development mode:

```
npm run dev
```

3. Server listens on the port defined in `PORT` env or `3000` by default.

API Endpoints (examples):


Advanced features added:

- JWT authentication: `POST /auth/register`, `POST /auth/login`
- Role-based authorization: admin-only product writes
- Input validation with `joi`
- Security: `helmet`, rate-limiting
- Logging with `winston`
- Swagger UI at `/docs`
- Tests with `jest` and `supertest` (see `src/tests`)
- `docker-compose.yml` with Postgres service for production-like env
- CI workflow: `.github/workflows/ci.yml`

Dev commands:

- `npm install` — install deps
- `npm run dev` — run with `nodemon`
- `npm test` — run tests
- `npm run lint` — lint code
- `npm run format` — format code with Prettier

Seeding and Docker Compose:

- To run the Postgres service locally (useful when DB integration is added):

```bash
docker-compose up -d
```

- To seed an initial admin user (in-memory adapter):

```bash
npm run seed
```

Notes and Next Steps:

- The app currently uses an in-memory datastore (`src/models/db.js`). For production, integrate a real database (Postgres) with an ORM such as Prisma or Sequelize and add migrations.
- After adding DB persistence, update `src/services/authService.js` and the seed script to write to the persistent DB.
- Consider adding Redis for sessions/caching and a proper logger sink (files, external logging service).

Prisma + Postgres (optional)

1. Start Postgres with Docker Compose:

```bash
docker-compose up -d
```

2. Set `DATABASE_URL` in `.env` (example):

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/alakh_mart?schema=public
```

3. Install new deps and generate Prisma client:

```bash
npm install
npm run prisma:generate
```

4. Run the migration to create tables:

```bash
npm run prisma:migrate:dev
```

After migration, the app will use Postgres automatically (Prisma client is preferred when available). The existing seed script currently writes to the in-memory adapter; after migrating to Postgres you can run a seed using Prisma or update `src/scripts/seedAdmin.js` to use the ORM.

Env variables (see `.env.example`):
- `PORT` — server port
- `JWT_SECRET` — secret used to sign tokens (default: `dev-secret`)
