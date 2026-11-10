# Official Handover Checklist

Each item marked **Completed** was directly verified (code read, test
run, or live browser check) during this documentation effort — not
assumed. Items marked **Pending** require action from the receiving team
that nobody but them can take (credentials, hosting decisions, etc.).

| Area | Item | Status | Notes |
|---|---|---|---|
| **Source code** | Repository accessible and complete | Completed | All source under `src/` and `backend/`, verified via full file inventory |
| | No secrets committed to the documentation or this handover | Completed | `backend/.env` values never quoted in any doc; `.env`/`backend/.env` confirmed gitignored |
| **Project structure** | Full directory tree documented | Completed | [`handover/PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md) |
| | Dead/orphaned code identified | Completed | 8 frontend files + 1 legacy backend file, listed with evidence |
| **Frontend setup** | Dependencies documented with versions | Completed | [`handover/TECHNOLOGY_STACK.md`](TECHNOLOGY_STACK.md) |
| | Build/dev commands verified | Completed | `npm run dev` / `npm run build` run successfully during this engagement |
| **Backend setup** | Dependencies documented with versions | Completed | Same document |
| | Server starts and responds to a health check | Completed | `GET /` verified live |
| **Database setup** | Schema documented | Completed | [`technical/DATABASE_DOCUMENTATION.md`](../technical/DATABASE_DOCUMENTATION.md), verified via live `information_schema` query |
| | Migrations documented and verified idempotent | Completed | All 6 applied live; re-run confirmed to skip already-applied ones |
| | Seed/import scripts documented | Completed | `importEmployees.js`, `migrateEmployeeProfiles.js` — both run live, 159 records confirmed |
| **Environment configuration** | All environment variables documented | Completed | [`technical/BACKEND_DOCUMENTATION.md`](../technical/BACKEND_DOCUMENTATION.md) §7 |
| | `.env.example` files present and accurate | Completed | Both `.env.example` and `backend/.env.example` reviewed |
| **Authentication** | Login/registration/reset flow documented and tested | Completed | [`technical/AUTHENTICATION_AND_RBAC.md`](../technical/AUTHENTICATION_AND_RBAC.md) |
| **Admin access** | Primary Admin account configured and verified | Completed | `ungomane@ncdedat.gov.za`, confirmed logged in with `role: Admin` live |
| | Admin provisioning process documented and re-runnable | Completed | `npm run provision:admin -- <email>` |
| **User roles** | Role-permission matrix documented against actual code | Completed | [`technical/AUTHENTICATION_AND_RBAC.md`](../technical/AUTHENTICATION_AND_RBAC.md) §5 |
| **API documentation** | Every implemented endpoint listed and verified against `server.js` | Completed | [`technical/API_DOCUMENTATION.md`](../technical/API_DOCUMENTATION.md), 52 endpoints |
| **Module documentation** | Every module's status assessed | Completed | [`handover/PROJECT_STATUS.md`](PROJECT_STATUS.md) |
| **User guide** | End-user and Admin workflows documented | Completed | [`guides/END_USER_GUIDE.md`](../guides/END_USER_GUIDE.md), [`guides/ADMIN_USER_GUIDE.md`](../guides/ADMIN_USER_GUIDE.md) |
| **Deployment instructions** | Documented to the extent determinable from this codebase | Completed (with gaps noted) | [`guides/DEPLOYMENT_GUIDE.md`](../guides/DEPLOYMENT_GUIDE.md) — hosting, SSL, domain are **Pending**: not yet decided by the organization |
| **Testing instructions** | Both test suites documented and confirmed passing | Completed | 38 + 51 tests, both suites run live during this engagement |
| **Backup and recovery** | Procedures documented | Completed | [`support/BACKUP_AND_RECOVERY.md`](../support/BACKUP_AND_RECOVERY.md) — no automated backup job exists; manual procedure only |
| **External integrations** | Documented, including what's NOT integrated | Completed | [`technical/INTEGRATIONS.md`](../technical/INTEGRATIONS.md) |
| **Known issues** | Compiled and prioritized | Completed | [`support/KNOWN_ISSUES.md`](../support/KNOWN_ISSUES.md) |
| **Outstanding tasks** | Compiled and prioritized | Completed | [`handover/PROJECT_STATUS.md`](PROJECT_STATUS.md) §9 |

## Items requiring the receiving team's action (not completable from this codebase alone)

- [ ] **Pending** — Decide and provision production hosting for the
      backend (always-on Node host) and PostgreSQL.
- [ ] **Pending** — Configure `EMAIL_USER`/`EMAIL_PASSWORD` (or swap in
      the organization's real mail system) for production email delivery.
- [ ] **Pending** — Rotate `JWT_SECRET` and the database password used in
      any shared/production `.env` file — the development values in this
      environment should never be reused in production.
- [ ] **Pending** — Create at least one additional Admin account as an
      operational safety net.
- [ ] **Pending** — Decide on object storage for uploaded video files if
      a multi-instance/containerized production deployment is planned.
- [ ] **Pending** — Decide whether to invest further in the Dashboard
      page (connect it to real data) or simplify it to remove
      non-functional elements.
