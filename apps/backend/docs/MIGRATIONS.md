# Database migrations (PostgreSQL / Neon)

## Environment variables

Use either a single connection string or discrete fields.

**Option A — Neon (recommended)**

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
NODE_ENV=production
```

Optional:

- `DATABASE_SSL=true` — force TLS (`rejectUnauthorized: false` for managed providers)
- `DATABASE_SSL=false` — disable extra SSL options (local Postgres without TLS)

**Option B — discrete fields**

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=rentdirect
```

## Apply migrations (CLI)

From `apps/backend`:

```bash
npm install
npm run migration:run
```

Inspect pending / history:

```bash
npm run migration:show
```

Rollback last migration:

```bash
npm run migration:revert
```

## Apply migrations on app startup (production)

When `NODE_ENV=production`, the API runs pending migrations on boot unless you disable it:

```env
TYPEORM_MIGRATIONS_RUN=false
```

Default is **on** in production (`migrationsRun: true`).

## Development vs production

- **Production:** `synchronize` is **off** — schema changes go through migrations only.
- **Development:** `synchronize` is **on** by default — TypeORM can auto-update the schema. Do **not** run `migration:run` against the same DB if tables already exist from `synchronize`, or you will get duplicate-object errors. Use a separate dev database if you want to practice migrations locally.

## After `npm run build` (compiled JS)

```bash
npx typeorm migration:run -d dist/data-source.js
```

Ensure `nest build` compiled `src/data-source.ts` and `src/migrations/*.ts` into `dist/`.
