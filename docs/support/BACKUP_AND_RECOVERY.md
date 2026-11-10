# Backup & Recovery

**No automated backup job exists in this project.** Everything below is
a manual procedure. Setting up a scheduled backup is listed as
outstanding work in
[`../handover/PROJECT_STATUS.md`](../handover/PROJECT_STATUS.md).

## 1. What needs backing up

| Item | How |
|---|---|
| PostgreSQL database (all 12 tables — employees, users, all content) | `pg_dump` |
| Uploaded video files (`backend/uploads/videos/`) | Plain file copy — **not** included in a database backup |
| `backend/.env` (credentials/secrets) | Store securely outside the repository (a password manager or secrets vault) — never in a database backup or in version control |

## 2. Backing up the database (Windows PowerShell)

```powershell
# Custom format (recommended): compressed, supports selective restore
pg_dump -U postgres -d dedat_intranet -F c -f "dedat_backup_$(Get-Date -Format yyyyMMdd).dump"

# Plain SQL (human-readable, larger, simpler to inspect)
pg_dump -U postgres -d dedat_intranet -f "dedat_backup_$(Get-Date -Format yyyyMMdd).sql"
```

## 3. Backing up uploaded videos

```powershell
Compress-Archive -Path backend\uploads -DestinationPath "uploads_backup_$(Get-Date -Format yyyyMMdd).zip"
```

## 4. Restoring the database

**To a fresh database** (e.g. setting up a new environment or recovering
from total loss):

```powershell
psql -U postgres -c "CREATE DATABASE dedat_intranet_restored;"
pg_restore -U postgres -d dedat_intranet_restored dedat_backup_20261110.dump
```

(For a plain-SQL backup: `psql -U postgres -d dedat_intranet_restored -f dedat_backup_20261110.sql`)

**To overwrite an existing, broken database** — back up the current
state first regardless of how broken it seems (you may need to diagnose
what went wrong later), then:

```powershell
psql -U postgres -c "DROP DATABASE dedat_intranet;"
psql -U postgres -c "CREATE DATABASE dedat_intranet;"
pg_restore -U postgres -d dedat_intranet dedat_backup_20261110.dump
```

**Dropping a database is irreversible — confirm you have a current
backup and are targeting the correct database name before running
`DROP DATABASE`.**

## 5. Restoring uploaded videos

```powershell
Expand-Archive -Path uploads_backup_20261110.zip -DestinationPath backend\
```

## 6. Verifying a restore

```powershell
# Expect 12 tables
psql -U postgres -d dedat_intranet -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;"

# Expect your organization's real employee count (159 in the original dataset)
psql -U postgres -d dedat_intranet -c "SELECT COUNT(*) FROM employees;"

# Expect at least one Admin account
psql -U postgres -d dedat_intranet -c "SELECT email, role, is_active FROM users WHERE role = 'Admin';"

# Confirm the migration tracking table matches what the application expects
psql -U postgres -d dedat_intranet -c "SELECT version FROM schema_migrations ORDER BY version;"
# Expect all 6: 001_schema_migrations.sql through 006_news_wellness_publishing.sql
```

If `schema_migrations` is missing rows the application expects (for
example, restoring a backup taken before migration 006 was applied), run
`npm run migrate` from `backend/` afterward — it will apply only what's
missing.

## 7. Recovery scenarios

| Scenario | Procedure |
|---|---|
| Database server lost entirely, backup available | Provision a new PostgreSQL instance, restore per §4, update `backend/.env` if connection details changed, run `npm run migrate` to catch anything newer than the backup |
| A single table/row corrupted or wrongly modified | Restore the full backup to a **separate** database, extract just the needed data with `psql`/`pg_dump --table=<name>`, then manually apply it to production — don't restore-and-overwrite the whole production database for a single-table problem |
| Uploaded video files lost but database intact | Restore from the file backup (§5); any `wellness_videos.video_url` pointing at a file not actually present will show the player's "couldn't be played" fallback until the file is restored |
| No backup exists and data is lost | Not recoverable through this project's own tooling — this is exactly why setting up scheduled backups (§ below) matters |

## 8. Recommended next step

This project has no scheduled backup job. At minimum, set up a daily
`pg_dump` (Windows Task Scheduler, or your hosting platform's managed
database backup feature if using one) with a retention policy (e.g. 7
daily + 4 weekly), stored somewhere other than the same disk as the
database itself.
