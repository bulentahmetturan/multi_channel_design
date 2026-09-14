# Kaduse Medikal — Agent Instructions

Canonical, scoped instructions for any agent (Claude, Codex, GPT Work) doing visual, design, composition, or rendering work for this channel. Root `AGENTS.md` and `docs/INDEX.md` route here; this file does not restate their content.

## Required reading before touching this channel's visuals

Read `VISUAL-SYSTEM.md` (this directory) before writing, editing, or reviewing any Kaduse composition, typography, product-image treatment, background, frame, footer, layout, or QA logic. It is the canonical human-readable source for this channel's visual rules — typography roles, product-image treatment, background/frame/footer families, layout and composition principles, brand expression, and the feed grammar (`brand/feed-grammar.json`). Do not re-derive these rules from prior chat context, prior renders, or general design instinct; read the file.

Also read, as needed for the specific task: `brand/colors.json` (approved palette and contrast policy), `brand/feed-grammar.json` (feed-level rhythm and continuity rules), `design-system/typography/font-pool.json`'s `kaduse-medikal` entry (licensed, renderable font combinations), and `docs/creative-north-star-and-art-direction-programme.md` (the cross-channel creative philosophy `VISUAL-SYSTEM.md` instantiates for this channel).

## Do not ask the user to repeat what is already recorded

If a rule is stated in `VISUAL-SYSTEM.md`, `brand/colors.json`, `brand/feed-grammar.json`, or the font-pool entry, apply it without asking the user to restate it. If a genuine gap exists (the rule doesn't cover the situation), say so explicitly and propose an addition to the relevant file rather than silently improvising and rather than asking the user to re-explain something already covered elsewhere.

## Technical PASS is not aesthetic approval

A render that passes technical QA (canvas, overflow, glyph collision, mask-aware product/text collision, contextual contrast, product/logo integrity, safe zone, source integrity — see `VISUAL-SYSTEM.md` § Technical QA) has only cleared the objective-failure gate. It has not been aesthetically reviewed and must never be reported, logged, or presented as "approved," "good," or "final" on that basis alone. Aesthetic review (premium quality, composition, typography character, brand distinctiveness, feed coherence, etc. — see `VISUAL-SYSTEM.md` § Aesthetic Review) is a separate, explicit step. A skipped aesthetic-review category must be reported as `INCOMPLETE_REVIEW`, never silently treated as a pass.

## No publication without explicit user aesthetic approval

No Kaduse post may be published, scheduled, or marked publish-ready before a real person has viewed the actual rendered artifact and given explicit aesthetic approval. A technical PASS, a confident-sounding thesis, or a prior similar approval does not substitute for this. User rejection of a rendered direction always overrides any automated PASS and must be recorded as negative evaluation evidence (see `VISUAL-SYSTEM.md` § Evaluation history) rather than discarded.
