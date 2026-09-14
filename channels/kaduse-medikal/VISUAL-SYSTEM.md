# Kaduse Medikal — Visual System

**Status:** canonical, active. This is the single human-readable source for Kaduse Medikal's visual rules — typography, product-image treatment, background/frame/footer, layout and composition, brand expression, feed grammar, and visual QA. `channels/kaduse-medikal/AGENTS.md` requires reading this file before any visual/design/rendering work on this channel; do not ask the user to restate anything recorded here.

**Relationship to other documents:** `docs/creative-north-star-and-art-direction-programme.md` sets the cross-channel creative philosophy, operating model (Visual DNA / Series / Post Art-Direction Card / Candidate Comparison), and quality-gate vocabulary this file instantiates for Kaduse specifically — read it for *why*, read this file for *what, for Kaduse*. `brand/colors.json` is the approved palette and contrast policy. `brand/typography-roles.json` is the machine-readable role model for §1. `brand/feed-grammar.json` is the machine-readable feed-rhythm model for §8. `content/policies/product-promotion.json` (and sibling archetype policies) own content/product-truth rules only — this file owns everything downstream of a `ContentBrief`: layout, typography, art-direction, composition, and QA. Runtime execution of everything below (composition, rendering, admission, Visual Diagnosis) is owned by `channel-content-os`, not this repo (`AGENTS.md` §Architecture, Category 11 below).

**Core principle:** do not translate aesthetic preference into rigid prohibition. Hard gates exist only for objective failures (§10). Everything else — solid backgrounds, frame usage, footer usage, product/text overlap, ground color, dark/light choice — is a contextual, scored preference. A solid background used with strong typography, composition, product treatment, and spacing is a premium result, not a violation. An intentional, mask-aware, readable, compositionally justified product/text overlap is a strong choice, not a collision.

---

## 0. Evidence boundary

The most recent canonical Product Promotion run (three A/B/C directions, `guizang-s08` layout family) was technically admitted but aesthetically rejected by the user in full. **These renders are negative evaluation evidence and must not be cosmetically patched.** Stable visual truth remains in this document; dated runtime gaps and implementation observations belong in `CURRENT-GAPS-2026-09-14.md`.

- The product read as an isolated PNG placed on a canvas, not integrated into the composition.
- Typography had no creative relationship to the product (see §6 — layout slots were treated as independent boxes).
- Backgrounds were empty or based on weak geometric splits (see §3 — no chosen background recipe was actually applied with intent).
- Facts looked appended after the composition rather than designed into it, and fact text was too small (see §1 `featureFact` — this is the exact failure `minSizePx` and the "not fine print" weight rule now guard against).
- Logo, CTA, footer, and information areas did not form one coherent system (see §5, §6).
- Product and text placement felt unbalanced; A/B/C read as recolors of one corporate template despite all technically passing the label-diversity check (see §9 and creative-north-star §2.4 — the same finding, same root cause).
- Automated admission did not represent user aesthetic approval.

Future real-render decisions must be preserved in append-only calibration evidence. The newest explicit user decision overrides an older conflicting preference without deleting history.

---

## 1. Typography

Machine-readable model: `brand/typography-roles.json`. Font families come from `design-system/typography/font-pool.json`'s `kaduse-medikal` entry — this file assigns *roles*, it does not add new families.

Two approved combinations exist:
- `kaduse-product-editorial` — EB Garamond Roman headline/product model, real EB Garamond Italic emphasis, Inter body/facts/CTA.
- `kaduse-clinical-information` — EB Garamond Roman headline/statistic, real EB Garamond Italic emphasis, IBM Plex Sans body/facts/annotations/CTA.

IBM Plex Mono is a restricted utility face for eyebrow and footer/tracked-closing-signature roles only. Kaduse has no rare-accent layer. Adelle, Libre Franklin, Source Sans 3, and Stack Sans Notch are excluded from Kaduse only; other channels remain unaffected.

Role definitions live in `brand/typography-roles.json`. Notable rules:

- **Fact text is never fine print.** `featureFact` has a hard floor (`minSizePx: 24`) and a medium/semibold weight band specifically so product facts read as content, not an afterthought. Overflow is solved by shortening copy, restructuring the fact cluster, or choosing a different density band — never by shrinking past the floor.
- **Maximum two primary families per post** — EB Garamond plus either Inter or IBM Plex Sans. IBM Plex Mono remains outside this count only while restricted to its approved utility roles.
- **Hierarchy over box-filling.** Every composition declares a contextual dominant element and rationale. Product, product detail, headline, statistic, date, or clinical illustration may dominate. No universal area percentage or 1.5x ratio is an aesthetic hard gate.
- **Turkish glyph support is a per-family verification, not an assumption** — see `typography-roles.json`'s `turkishGlyphSupport` block. Verify via real fontkit glyph coverage before a family is used live; record the result against the family's row in `font-pool.json`.
- **Measurement is real, twice.** Real glyph widths are measured before render (fontkit + tex-linebreak, against the actual selected font's actual bytes) and real rendered glyph bounds are measured after render (from the actual DOM/element boxes the renderer reports) — a pre-render estimate is never reported as the final answer.
- Editorial structures are explicitly in scope: this system must support bold, asymmetric, tiered, or confrontational typographic compositions, not only centered headings and small captions (see creative-north-star's real direction examples, §2.3).

---

## 2. Product image treatment

Real product cutouts now exist: `product-catalog/assets/classic-iii-5620-kadusesite-cutout.png`, `product-catalog/assets/stethoscope-cutout.png`. Treat every product asset through a product-aware analysis before composition, not as an opaque PNG dropped onto a background:

- Real alpha mask and visible product-pixel bounds (not the PNG's rectangular canvas bounds).
- Chestpiece region, tubing shape, and open loop regions (a stethoscope's tubing loop is real negotiable compositional geometry, not a fixed silhouette).
- Dominant product axis and available internal/external negative space.
- Suitable full-product vs. macro crop candidates, and which product details are critical (must never be cropped/covered) vs. decorative (may be cropped/extended past a frame intentionally).

Supported treatments (select per direction, not all at once): full product hero; macro chestpiece detail; sculptural tubing composition; edge crop; product extending beyond a non-critical decorative frame; controlled reflection/surface shadow; moonlit clinical lighting; light editorial presentation. A clean, simple isolated product crop remains valid **when the surrounding composition is strong** — the objective is preventing "PNG pasted on a blank background," not banning simplicity. §8's crop-repetition rule (`cropRepetitionPrevention`, max 1 consecutive identical crop family) is the feed-level guard against defaulting to the same crop out of convenience.

---

## 3. Background and atmosphere

Six selectable recipes, built from Kaduse's own palette (`brand/colors.json`) — none is mandatory, and a solid background is a legitimate choice among them:

| Recipe | Character |
|---|---|
| `CLINICAL_LIGHT` | Neutral/white ground, restrained clinical line work, light editorial feel |
| `MOONLIT_NAVY` | navy900-led dark ground, soft brand-color illumination, precision/engineering mood |
| `PREMIUM_SOLID` | A single confident palette color as full ground — solid is not a fallback, it is a deliberate premium choice when typography/composition/product treatment already carry the post |
| `MACRO_PHOTO_FIELD` | Macro product detail itself becomes the ground/atmosphere |
| `SCULPTURAL_GRADIENT` | Controlled tonal gradient or subtle depth/surface shadow, restrained |
| `TECHNICAL_EDITORIAL` | Very light material texture or clinical line language, information-forward |

Every non-trivial effect (gradient, texture, line work, shadow) must be justified by product support, clinical context, hierarchy, or feed continuity (§8) — never decoration for its own sake. Choice of recipe also sets the `surfaceMode` (`CLINICAL_LIGHT`/`TECHNICAL_EDITORIAL`/light `PREMIUM_SOLID` → light; `MOONLIT_NAVY`/dark `PREMIUM_SOLID`/`SCULPTURAL_GRADIENT` → dark) consumed by `feed-grammar.json`'s `surfaceRhythm`.

---

## 4. Frame system

The strongest feature of the rejected renders (§0) is preserved: the framed composition. Palette roles only (`navy900`, `blue600`, `turquoise400`, or an approved two-tone combination from `brand/colors.json`) — never an off-palette frame color.

Behaviours, selectable per direction: full perimeter; partial edge; double-line clinical frame; frame interrupted by the product; frame connected to the footer; light-frame-on-dark; dark-frame-on-light. Frame usage is **preferred when it strengthens feed continuity**, not mandatory on every post — `feed-grammar.json`'s `frameContinuity` treats `none` as a real, countable rotation state, and caps at most 2 consecutive posts in the identical frame family.

---

## 5. Closing signature and footer system

The tracked closing line observed in the approved reference direction is the preferred feed-continuity treatment. Negative-footer treatments `NEGATIVE_NAVY`, `NEGATIVE_BLUE`, and `MINIMAL_LIGHT` remain contextual options, never mandatory defaults. A justified omission is valid.

A footer may contain only what the post justifies: the Kaduse signature, one CTA, one short trust/service statement, a small product/series identifier. It must never become a dense list of services, icons, or microcopy — the footer completes the composition and strengthens feed continuity, it does not carry a second information layer. Hold footer type size inside `typography-roles.json`'s `footer` role band across posts that do carry one.

---

## 6. Layout and composition

Layout slots are relationships, not independent boxes. Model, per post: product mass, headline mass, fact cluster, brand mark, footer, frame, background field, and negative space — as one system, not six unrelated placements.

Every composition must have: a declared dominant element and rationale; balanced visual weight; deliberate alignment; a strong product–text relationship; a readable hierarchy at feed-thumbnail size; and meaningful negative space. Geometric dominance ratios may be reported as diagnostics but never operate as universal aesthetic hard gates.

**The same base layout ID may only be reused if the realized composition topology, image treatment, and module relationships genuinely differ** — reusing `guizang-s08` (or any layout family) three times with only color/label changes, as in §0's rejected set, is exactly the failure this rule exists to prevent. This restates creative-north-star §3.4/§9's "materially distinct" bar as a layout-level rule: differing composition mode/gesture and/or differing image-vs-typography balance and/or differing density realization — never only color, font, or alignment.

---

## 7. Brand expression

Kaduse identity must not depend on the logo alone. Brand character emerges from the combined behaviour of palette, typography, product crop, lighting, frame, footer, clinical line language, alignment, spacing, dark/light rhythm, and CTA treatment — each individually unremarkable, together distinctive.

Target character: premium, modern, minimal, clinical, confident, calm, product-aware, slightly moonlit in dark executions. **Coral (`coral500`) stays a selective accent** — `feed-grammar.json`'s `accentColorFrequency` caps coral-as-primary-field/shape at roughly a third of the rolling window; coral as a small CTA chip, accent dot, or single-word highlight is unrestricted.

---

## 8. Holistic modular feed system

Machine-readable model: `brand/feed-grammar.json` — relational dark/light surface rhythm, stable top-left logo preference, frame/closing continuity, accent-color frequency, image-density rhythm, typography rhythm, crop-repetition prevention, and neighboring-grid-tile relationships. Dark/light guidance is advisory, never a numerical admission gate or rigid checkerboard.

Feed context (`recentPosts`, `targetGridPosition`, and derived surface/color/crop/module history) should reach composition where technically appropriate. An individual post may receive `INDIVIDUAL_POST_APPROVAL` from its own real preview. `FEED_SYSTEM_APPROVAL` requires a real multi-post preview. `PUBLISH_APPROVAL` is always separate.

---

## 9. Art-direction generation

The three rejected directions (§0) are creative route seeds for the next pass, not permanent templates:

- **A — Precision Instrument**: macro stainless-steel chestpiece detail, dark moonlit atmosphere (`MOONLIT_NAVY`), precision/engineering feeling, strong restrained typography, product material as the primary visual evidence.
- **B — Clinical Editorial**: full product, strong asymmetric editorial typography, features tied to real product regions, light/restrained surface (`CLINICAL_LIGHT`/`TECHNICAL_EDITORIAL`), clear information hierarchy.
- **C — Sculptural Loop**: the tubing curve becomes the principal compositional form, artistic but clinically credible, typography responds to the loop and open space, strong frame/footer relationship.

A/B/C must differ on several real axes at once — image treatment, crop, background strategy, typography behaviour, text–image relationship, composition topology, brand modules, dominant gesture — not on ground color alone; ground diversity is a soft contributor (ties into `feed-grammar.json`'s rhythm targets), never the sole differentiator. Comparison must happen **at the render level** (actual rendered PNGs, per §10's Aesthetic Review), because geometry-only or label-only diversity has already been shown (§0, creative-north-star §2.4) to pass technical diversity checks while producing one composition wearing three colors.

---

## 10. QA and Visual Diagnosis

Approval and review states are separate and never implied by one another:

- **`TECHNICAL_QA`** — deterministic, objective, automatable.
- **`AESTHETIC_REVIEW`** — inspects the actual rendered PNG against contextual, scored criteria. If any required category is skipped, the correct result is `INCOMPLETE_REVIEW`, never `PASS`. A skipped check is never converted into an aesthetic pass.
- **`INDIVIDUAL_POST_APPROVAL`** — explicit user approval of one real rendered post.
- **`DIRECTION_FAMILY_APPROVAL`** — explicit user confirmation after evidence across at least two active archetypes.
- **`FEED_SYSTEM_APPROVAL`** — explicit user confirmation after a real multi-post preview.
- **`PUBLISH_APPROVAL`** — a separate explicit user action that no automated process may generate.

### Hard gates (`TECHNICAL_QA`) — objective failures only
Incorrect/unsupported product information · missing required product identity · text overflow or clipping · unreadable contrast · unintended text–text collision · unintended product–text collision (mask-aware — checked against the product's real alpha mask, §2, not its rectangular bounding box) · critical content outside the usable safe zone · broken/cropped/unreadable logo · corrupted product image · missing required source · incorrect canvas or format.

**Safe-zone admission rule:** a critical element outside the `usable` zone is `FAIL`. A critical element outside the `recommended` zone but inside `usable` is a warning, not a fail. A headline/logo missing from a required grid crop is a feed-preview warning or `FAIL` depending on the element's role. A non-critical artistic product extension past a zone boundary is permitted when intentional (§2, §4's frame-interrupted-by-product). **`allCriticalInside: false` must never result in an admitted/passed render** — if the current admission code allows this (as it did in §0's evidence), that is a fail-closed bug to fix, not an acceptable edge case; see the implementation-drift tracking note in §11.

### Soft visual preferences (`AESTHETIC_REVIEW`) — contextual, scored, never hard-gated
Premium feeling · modernity · minimalism · background richness · negative-space quality · frame usage · footer usage · dark/light surface choice · product crop · typography character · brand distinctiveness · visual balance · editorial quality · feed continuity · image–text relationship · motif purpose · direction diversity (§9). Every one of these must actually be inspected against the rendered PNG — a review that skips editorial quality, image treatment, motif meaning, or text–image relationship (as in §0) is `INCOMPLETE_REVIEW`.

### Rejection taxonomy
`GENERIC_TEMPLATE` · `NO_CREATIVE_THESIS` · `CHANNEL_IDENTITY_DRIFT` · `DECORATIVE_BUT_UNREADABLE` · `OVERSTYLED_WITHOUT_CONTENT_ROLE` · `REPETITIVE_SERIES_RHYTHM` · `ASSET_OR_CLAIM_MISREPRESENTATION` · `TECHNICALLY_VALID_BUT_AESTHETICALLY_PENDING` (creative-north-star §4 — the correct, honest tag for a technically valid render still awaiting human review; not a failure).

---

## 11. Data and repository ownership

`multi_channel_design` (this repo) owns versioned channel truth: this file, `brand/feed-grammar.json`, `brand/typography-roles.json`, `brand/colors.json`, evaluation history (§0), and user-approved aesthetic decisions as they accumulate. `channel-content-os` owns runtime execution: context ingestion, candidate generation, scene composition, layout interpretation, rendering, QA, Visual Diagnosis, job state, correction loop, and admission. This file states the rule; it does not implement the runtime side.

Layout and design decisions never belong in an archetype's content-policy file (`content/policies/product-promotion.json` and siblings) — those own content/product-truth rules only, by explicit design (`designIndependence` field in each policy file). This file, not the policy file, is where a layout, typography, or art-direction rule is recorded.

`get_project_context("kaduse-medikal")` must return this file's rules and any recorded decisions once ingestion is wired (`channel-content-os` side) — an empty `current_rules`/`current_decisions` response for this channel is a gap this file's existence is meant to close, not a state that should persist once ingestion exists.

**Implementation-drift tracking:** dated runtime observations belong in `CURRENT-GAPS-2026-09-14.md` and the runtime repository's status records. A temporary implementation snapshot must never become permanent visual truth here.
