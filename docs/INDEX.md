# Context Router

Read `AGENTS.md` first, then use only the route matching the task.

| Task | Read |
| --- | --- |
| Understand current work | `docs/STATUS.md`, `TASKS.md` |
| Change product scope | `docs/PRODUCT-SPEC.md`, relevant ADRs |
| Change boundaries or dependencies | `docs/SYSTEM-ARCHITECTURE.md`, relevant ADRs |
| Add or onboard a channel | `docs/CHANNEL-SYSTEM.md`, `packages/schemas/src/channel.schema.json`, and the relevant asset schema |
| Resume or run Channel Pack onboarding | `docs/ONBOARDING-ORCHESTRATION.md`, `docs/CHANNEL-SYSTEM.md`, `docs/STATUS.md` |
| Change palettes or color variation | `docs/COLOR-SYSTEM.md`, `packages/schemas/src/color-combination-registry.schema.json` |
| Analyze or add a layout | `docs/CONTENT-MORPHOLOGY.md`, `docs/LAYOUT-GRAMMAR.md`, `packages/schemas/src/layout.schema.json` |
| Change selection or ranking | `docs/CONTENT-MORPHOLOGY.md`, `docs/SELECTION-ENGINE.md` |
| Change typography | `docs/TYPOGRAPHY-SYSTEM.md`, `packages/schemas/src/typography-pair.schema.json` |
| Change formats or safe zones | `docs/SAFE-ZONES.md`, `packages/schemas/src/format-profile.schema.json` |
| Change rendering | `docs/RENDERING-SYSTEM.md`, `docs/SAFE-ZONES.md` |
| Change post records | `packages/schemas/src/post-record.schema.json`, relevant rendering and color documents |
| Change monitoring or inbox state | `docs/CONTENT-MONITORING.md`, `packages/schemas/src/content-item.schema.json` |
| Change QA or preference feedback | `docs/QA-AND-FEEDBACK.md` |
| Add an external integration | `docs/MCP-POLICY.md`, relevant provider documentation |

Architecture decisions live in `docs/decisions/`. Do not read unrelated ADRs unless the task changes their decision.
