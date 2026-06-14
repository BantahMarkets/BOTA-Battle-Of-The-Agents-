# Changelog

## Unreleased

### Added
- Pack economy system with buy/open workflow.
- Pack catalog and ownership tracking via `pack_catalog` and `pack_ownership`.
- Pack open events with audit logging via `pack_open_events`.
- Support for DB-driven drop tables via `pack_drops`.
- Admin pack drop management endpoints and admin UI component.
- Agent memory endpoints and pack decision endpoint for autonomous agent behavior.
- Client pack hooks: `useGen1Packs`, `useBuyGen1Pack`, `useOpenGen1Pack`.

### Fixed
- Wired marketplace pack modal to real backend pack purchase/open flow.
- Persisted inventory updates after pack openings.
- Added deterministic seeded RNG for pack reward selection.
- Logged RNG seed and seed integer inside `pack_open_events` for auditability.
- Added SQL migration support and manifest for new schema.
- Updated startup DB initialization to apply all migrations from `server/migrations/`.
- Added server-side integration test for pack buy/open flow.
