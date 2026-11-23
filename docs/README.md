# DEDaT Intranet — Documentation

This is the complete technical handover and user documentation package
for the DEDaT Intranet. Start with
[`handover/TECHNICAL_HANDOVER.md`](handover/TECHNICAL_HANDOVER.md) if
you want one document that covers everything at a summary level with
links to the detail — or jump straight to the section you need using the
map below.

A printable version of the technical handover and the end-user guide is
available in [`exports/`](exports/).

## Map

### Start here
| Document | For |
|---|---|
| [`handover/TECHNICAL_HANDOVER.md`](handover/TECHNICAL_HANDOVER.md) | Anyone — the one-document overview of the whole system |
| [`SETUP_AND_CHANGES.md`](SETUP_AND_CHANGES.md) | Someone pulling this repo today who wants the short version: what changed recently and how to run it |
| [`handover/HANDOVER_CHECKLIST.md`](handover/HANDOVER_CHECKLIST.md) | Sign-off checklist for this handover |

### Handover — the big picture
| Document | Covers |
|---|---|
| [`handover/PROJECT_OVERVIEW.md`](handover/PROJECT_OVERVIEW.md) | Business purpose, users, roles, core workflows, feature map |
| [`handover/PROJECT_STRUCTURE.md`](handover/PROJECT_STRUCTURE.md) | Full file tree, the "wrapper pages" pattern, dead code, task→file navigation |
| [`handover/SYSTEM_ARCHITECTURE.md`](handover/SYSTEM_ARCHITECTURE.md) | Every architecture diagram, explained in plain language |
| [`handover/TECHNOLOGY_STACK.md`](handover/TECHNOLOGY_STACK.md) | Every dependency, exact version, why it's used |
| [`handover/PROJECT_STATUS.md`](handover/PROJECT_STATUS.md) | What's verified working, partial, broken, or missing — prioritized |

### Technical reference
| Document | Covers |
|---|---|
| [`technical/DATABASE_DOCUMENTATION.md`](technical/DATABASE_DOCUMENTATION.md) | Full schema (verified against the live database), ERD, backup/restore commands |
| [`technical/API_DOCUMENTATION.md`](technical/API_DOCUMENTATION.md) | All 52 endpoints, auth requirements, example requests/responses |
| [`technical/AUTHENTICATION_AND_RBAC.md`](technical/AUTHENTICATION_AND_RBAC.md) | How login/sessions/roles work, the full permission matrix |
| [`technical/FRONTEND_DOCUMENTATION.md`](technical/FRONTEND_DOCUMENTATION.md) | Frontend architecture, every directory's purpose, task lookup table |
| [`technical/BACKEND_DOCUMENTATION.md`](technical/BACKEND_DOCUMENTATION.md) | Backend architecture, scripts, environment variables |
| [`technical/INTEGRATIONS.md`](technical/INTEGRATIONS.md) | Email, video storage, video embeds — and what's explicitly NOT integrated |

### Guides — doing things
| Document | For |
|---|---|
| [`guides/INSTALLATION_GUIDE.md`](guides/INSTALLATION_GUIDE.md) | Setting this up from a blank machine, step by step |
| [`guides/DEVELOPER_GUIDE.md`](guides/DEVELOPER_GUIDE.md) | Conventions, how to extend the system, a worked "add a module" example |
| [`guides/END_USER_GUIDE.md`](guides/END_USER_GUIDE.md) | How staff (and Admins) use the application day to day |
| [`guides/ADMIN_USER_GUIDE.md`](guides/ADMIN_USER_GUIDE.md) | Detailed Admin workflows: users, employees, departments, content |
| [`guides/DEPLOYMENT_GUIDE.md`](guides/DEPLOYMENT_GUIDE.md) | What's configured, what deploying this would require, what's undecided |
| [`guides/MAINTENANCE_GUIDE.md`](guides/MAINTENANCE_GUIDE.md) | Ongoing operational tasks: backups, updates, secret rotation |

### Support
| Document | For |
|---|---|
| [`support/TROUBLESHOOTING.md`](support/TROUBLESHOOTING.md) | Symptom → root cause → fix, for the most likely problems |
| [`support/TESTING_GUIDE.md`](support/TESTING_GUIDE.md) | Running and understanding both test suites (38 + 51 tests) |
| [`support/BACKUP_AND_RECOVERY.md`](support/BACKUP_AND_RECOVERY.md) | Manual backup/restore procedures (no automated job exists yet) |
| [`support/KNOWN_ISSUES.md`](support/KNOWN_ISSUES.md) | Every known bug and gap, prioritized, plus what was already fixed |

### Diagrams (Mermaid source — also embedded inline in the docs above)
`diagrams/SYSTEM_ARCHITECTURE.mmd` · `diagrams/AUTHENTICATION_FLOW.mmd` ·
`diagrams/DATABASE_ERD.mmd` · `diagrams/DATA_FLOW.mmd`

### Earlier narrative documents (still accurate, kept rather than duplicated)

These were written during the engagements that implemented the features
they describe, and are referenced throughout the structured package
above rather than repeated:

| Document | Covers |
|---|---|
| [`ADMIN_GUIDE.md`](ADMIN_GUIDE.md) | The story of how `ungomane@ncdedat.gov.za` became the primary Admin, and how RBAC enforcement was built |
| [`NEWS_WELLNESS_GUIDE.md`](NEWS_WELLNESS_GUIDE.md) | The story of the date-handling, full-article, and video-upload fixes, in full technical detail |
| [`USER_FLOW_AND_ADMIN.md`](USER_FLOW_AND_ADMIN.md) | The original route-by-route, endpoint-by-endpoint walkthrough |
| [`SETUP_AND_CHANGES.md`](SETUP_AND_CHANGES.md) | Quick-start setup + a plain-language changelog |

## A note on accuracy

Every fact in this documentation package — file paths, API endpoints,
database columns, dependency versions, test counts — was verified
directly against the running code, a live database query, or an executed
command during the writing of this package, not inferred from naming
conventions or assumed from how similar projects are typically
structured. Where something couldn't be verified (for example, any
real-world production deployment details, since none exists yet), the
relevant document says so explicitly rather than guessing.
