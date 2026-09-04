# Content Operations (Batch P1)

The localhost human-review surface for the Multi-Channel Design OS.

## What this is

The primary place a human looks to answer: which channel does a candidate
belong to, which post archetype/subtype, why it exists (trigger), when it
should be prepared/published, and whether content/design/review/publish are
ready. It is the surface where APPROVE / REQUEST REVISION / REJECT actually
get recorded.

## What this is NOT

- Not a second content database. All candidate state lives in
  channel-content-os's D1 (`jobs` + `review_decisions` tables, extended in
  migration `023_content_candidates.sql`) -- this app reads/writes that
  state through `/api/*` only.
- Not a replacement for channel-content-os, News, Observance, or Research.
- Not Global Mail. Global Mail (if ever built) is an optional downstream
  notification surface that may link back here -- it must never own
  candidate/review/channel state.
- Not an Instagram/Graph API publisher. Approve never publishes.

## How to start it

Two separate processes (two separate repos):

```bash
# 1. Backend API (channel-content-os/mcp-server) -- serves /api/* on :8787
cd channel-content-os/mcp-server
npm run dev

# 2. Frontend (multi_channel_design/apps/dashboard) -- serves the UI on :5183
cd multi_channel_design/apps/dashboard
pnpm install   # first time only
pnpm dev
```

Open **http://localhost:5183**. The Vite dev server proxies `/api/*` to
`http://127.0.0.1:8787`.

Local D1 must have the schema + migrations applied at least once:

```bash
cd channel-content-os/mcp-server
npm run db:init:local
for f in src/db/migrations/*.sql; do npx wrangler d1 execute channel_content_os --local --file="$f"; done
npx wrangler d1 execute channel_content_os --local --file=scripts/seed-kaduse.sql
npx wrangler d1 execute channel_content_os --local --file=scripts/seed-content-ops-demo.sql   # optional demo fixtures
```

## Canonical label model

```
CHANNEL (channelId)
  -> POST ARCHETYPE (postArchetypeId, resolved postArchetypeOrder/label)
    -> SUBTYPE (postSubtype, archetype-specific, optional)
      -> TRIGGER (triggerType, triggerId, triggerLabel)
        -> STATUS (contentStatus, designStatus, reviewStatus, publishStatus)
```

Structured metadata is resolved into display strings at render time
(`src/lib/labels.ts`) -- never stored as formatted text. See
`channel-content-os/mcp-server/src/candidates/schemas.ts` for the canonical
field-level contract this mirrors.

## Review flow

```
candidate reaches rendered/qa_passed stage
        -> reviewStatus = READY_FOR_REVIEW
        -> human clicks Approve / Request Revision / Reject
                -> APPROVED / REVISION_REQUESTED / REJECTED
        -> (if APPROVED) human clicks "Move to Publish Queue"
                -> publishStatus = READY_TO_SCHEDULE
```

APPROVE never sets `publishStatus` to anything beyond what the operator
explicitly does next -- approval and publish-queue entry are two separate,
explicit human actions. Nothing in this app calls a social API.

## Architecture diagram

```
INPUT SYSTEMS
  Observances, News, Research, Product Catalog, (future) Clinical Education, Manual Request
        |
        v
CANONICAL CONTENT CANDIDATE (channel-content-os: jobs + review_decisions)
  channel, post archetype, subtype, trigger, content/design/review/publish status
        |
        v
DESIGN PIPELINE (existing render/QA stages)
        |
        v
LOCALHOST CONTENT OPERATIONS  <-- this app
  |-- Review / Approve / Revision / Reject
  `-- Publish Queue (readiness boundary only)
        |
        v
FUTURE PUBLISH ADAPTER (not implemented) -> Instagram / other platforms
```

Global Mail is not in this critical path.
