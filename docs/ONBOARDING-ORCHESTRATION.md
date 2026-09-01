# Onboarding Orchestration

Governs how any Channel Pack moves through the progression defined in `docs/CHANNEL-SYSTEM.md`:

`DRAFT → COLORS_PASS → LOGOS_PASS → TYPOGRAPHY_PASS → BRAND_PROOF_PASS → READY`

This is a continuous, self-driving loop across turns. Once onboarding is underway for a channel, do not stop and wait silently for the user to name the next task — determine it and ask for it.

## Procedure (every onboarding turn)

1. Read the channel's record (`catalog/channels/<id>/channel.json`), its existing asset/catalog files, `docs/STATUS.md`, and the schema for the gate immediately after the channel's current `status`.
2. Determine the single next unmet prerequisite in dependency order. Do not skip ahead and do not request multiple assets or decisions at once.
3. State plainly what is needed next and why (which gate it unlocks).
4. Request exactly one asset or decision. Provide the accepted format and the technical requirements (dimensions, color model, schema fields, naming, etc.) needed to pass validation on the first attempt.
5. When the user provides it:
   - Place the asset at its canonical catalog path, or record the decision in the appropriate catalog file.
   - Run the deterministic validation for that asset/decision type.
   - Update the relevant catalog record's `status` field.
   - Update `docs/STATUS.md` and `TASKS.md`.
   - Commit and push. File creation, edits, validation, commits, and pushes to the private repository are pre-authorized for this routine onboarding work; no per-step confirmation is needed.
   - Report `PASS`, or the exact blocking failure, for that step only.
6. Immediately propose the next single required step.
7. Never advance a channel's `status` field past a gate whose prerequisites are not all `PASS`.
8. If a gate's asset type has no committed schema or catalog convention yet, say so explicitly, propose the minimal schema/record shape needed, and get the user's approval on that shape before collecting the first instance of the asset.

This procedure applies identically to every channel, not only the first one onboarded.
