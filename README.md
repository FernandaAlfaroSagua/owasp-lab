# OWASP Lab

A small shop application used as the playground for a multi-session OWASP Top 10 workshop. Developers find, exploit and fix vulnerabilities in it.

This repository is the **clean baseline**: it is written securely on purpose (parameterized queries, ownership checks, output escaping, validated input). Vulnerabilities are injected per session as small, isolated, easily revertible changes.

- `api/`: NestJS + TypeORM + PostgreSQL (REST, JWT bearer auth)
- `web/`: Next.js App Router + TypeScript (plain CSS)
- `docs/`: session template and Laravel equivalents

## Quick start

Requirements: Docker with Compose.

```bash
cp .env.example .env
docker compose up --build
```

| Service | URL |
| --- | --- |
| web | http://localhost:3000 |
| api | http://localhost:3001 |
| postgres | localhost:5432 |

The API seeds the database automatically on first start when it is empty. To reset users, products and orders to the baseline at any time:

```bash
docker compose exec api npm run seed
```

To start from a clean database, run `docker compose down -v`.

## Seeded accounts (development only)

| Email | Password | Role |
| --- | --- | --- |
| alice@lab.test | alice-pass-1 | user |
| bob@lab.test | bob-pass-1 | user |
| admin@lab.test | admin-pass-1 | admin |

Alice and Bob each have a few orders. There are 15 products in four categories: electronics, office, books, kitchen.

## API overview

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | /auth/login | no | `{ email, password }` returns `{ accessToken, user }` |
| GET | /products?search=&category=&sort=&dir= | no | Query builder with bound parameters; `sort` is `name\|price\|category`, `dir` is `asc\|desc`, both allowlisted |
| GET | /products/:id | no | |
| GET | /orders | bearer | Only the current user's orders |
| GET | /orders/:id | bearer | Owner or admin, otherwise 403 |
| POST | /orders | bearer | `{ items: [{ productId, quantity }] }`; prices come from the database |
| GET | /users/me | bearer | Current user's profile |
| PATCH | /users/me | bearer | `{ name }`; the role cannot be changed through this endpoint |
| GET | /admin/orders | bearer, admin only | Every order across every customer; 403 for non-admins |

Quick check:

```bash
TOKEN=$(curl -s -X POST localhost:3001/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@lab.test","password":"alice-pass-1"}' | jq -r .accessToken)
curl -s localhost:3001/orders -H "Authorization: Bearer $TOKEN"
```

## Project map

```
owasp-lab/
  docker-compose.yml      postgres, api, web
  .env.example            copy to .env
  api/src/
    main.ts               bootstrap, CORS, validation pipe, first-start seed
    auth/                 login, JwtAuthGuard, CurrentUser decorator
    common/                Roles decorator/guard shared across modules
    users/                User entity, profile lookup/update, GET+PATCH /users/me
    products/             Product entity, public catalog endpoints, allowlisted sort
    orders/               Order entity, ownership-checked endpoints, admin-only GET /admin/orders
    seed/                 SeedService and `npm run seed` entry point
  web/
    app/                  pages: /login, /products, /products/[id], /orders, /orders/[id], /profile
    components/Nav.tsx    top navigation
    lib/api.ts            tiny API client, token kept in localStorage
  docs/
    sessions/TEMPLATE.md  template for each workshop session
    laravel/README.md     how Laravel equivalents are documented
```

Where later sessions will touch the code is deliberately narrow: query logic lives in `products.service.ts`, authorization in `orders.service.ts` and `jwt-auth.guard.ts`, credentials in `auth.service.ts`, and rendering in the `web/app` pages.

## Workshop structure

Five sessions, each focused on one or two OWASP Top 10 categories. The room is split into two groups and every session follows the same loop:

1. **Find**: each group receives a different task (see the session file). Group A and Group B look at different vulnerable spots in the same build.
2. **Exploit**: prove the issue with a concrete request or payload.
3. **Fix**: patch it in the NestJS code.
4. **Cross-teach**: the groups swap. Each group presents its finding, exploit and fix to the other, including the Laravel equivalent of the fix for the Laravel developers.

Session files live in `docs/sessions/`, copied from `TEMPLATE.md`. Each session is delivered as a small, revertible change set on top of this baseline.

## Notes

- This is a training application. Never deploy it. The dev secrets and passwords are public on purpose.
- The schema is created by TypeORM `synchronize`; this is acceptable for a lab and not for production.
- Password hashing uses `bcryptjs` (pure JavaScript implementation of bcrypt) to avoid native build problems inside containers.
