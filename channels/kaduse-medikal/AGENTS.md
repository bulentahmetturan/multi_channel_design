# Kaduse Medikal — Agent Instructions

Canonical, scoped instructions for any agent (Claude, Codex, GPT Work) doing visual, design, composition, or rendering work for this channel. Root `AGENTS.md` and `docs/INDEX.md` route here; this file does not restate their content.

## Visual system reset (2026-09-16)

`VISUAL-SYSTEM.md`, `brand/feed-grammar.json`, `brand/typography-roles.json`, and `content/visual-directions/` have been removed as part of a global visual-system reset — see `channel-content-os/VISUAL_SYSTEM_RESET.md` for the full rationale and inventory. They are not archived elsewhere in this repo; do not re-derive their content from git history or prior chat context and re-introduce it.

**Do not invent a replacement.** Visual/design/composition authority for this channel lives in an explicit FORMAT SPEC, registered in `channel-content-os`'s `format-spec/format-registry.ts`.

**Update, 2026-09-16 (same day, later batch):** the first format, `KAD-PP-SPHF-01` v1.0.0 ("Single Product Hero Feature" / "Tek Ürün Hero + Özellik", `product-promotion` archetype only), is now implemented and registered. See `channel-content-os/KAD-PP-SPHF-01.md` for the full implementation record, and this channel's own `formats/KAD-PP-SPHF-01.json` + `product-catalog/product-families/littmann-classic-iii-56.json` for the declarative mirror. It supports exactly one SKU / one dominant product image / one feature block per slide — it does not support comparison, multi-product, pricing, dense-research, or bundle layouts. For any of those, or for any other archetype, no FormatSpec is registered yet:

- Do not propose, write, or apply layout, typography-pairing, background/frame/footer, spacing, or composition rules not already declared in a registered FormatSpec.
- Do not treat any deleted file's remembered content, a prior render, or general design instinct as authoritative.
- A visual/design/composition task for this channel that has no registered FormatSpec for its (archetype, format) should report that gap (`NEW_VISUAL_SPEC_INCOMPLETE`) rather than improvise.
- A known gap on the registered format itself: none of KAD-PP-SPHF-01's custom typefaces (Cyntho Next, Spectral, Zilla Slab, Titillium Web, Saira, Raphiola) are registered as available fonts yet — see the implementation record's "Known gap" section before assuming a real render can execute.

## What is still authoritative

- `brand/colors.json` — approved palette, hex values, and real measured contrast policy (factual, unaffected by the reset).
- `brand/logo-manifest.json` — factual logo asset registry.
- `content/post-archetypes.json` — semantic archetype definitions (what the content *is*; owns no layout).
- `content/policies/*.json` — content/editorial policy per archetype (facts, cardinality, sourcing rules).
- `product-catalog/` — product data, SKU facts, verified images, geometry.
- `design-system/typography/font-pool.json`'s other channels' entries are unaffected; this channel's own `combinations` entry there was cleared (aesthetic pairing, not font-availability facts) pending the new format spec.

## Technical PASS is not aesthetic approval

A render that passes technical QA (canvas, overflow, glyph collision, mask-aware product/text collision, contextual contrast, product/logo integrity, safe zone, source integrity) has only cleared the objective-failure gate. It has not been aesthetically reviewed and must never be reported, logged, or presented as "approved," "good," or "final" on that basis alone.

## No publication without explicit user aesthetic approval

No Kaduse post may be published, scheduled, or marked publish-ready before a real person has viewed the actual rendered artifact and given explicit aesthetic approval. A technical PASS, a confident-sounding thesis, or a prior similar approval does not substitute for this.
