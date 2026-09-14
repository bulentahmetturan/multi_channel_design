# Creative North Star and Art-Direction Programme

**Status:** decision document — creative authority, companion to the master development plan (P0–P9; the plan itself is not a tracked file in either repository — see the Handoff Report delivered alongside this document for its amendment map).
**Scope:** `multi_channel_design` and `channel-content-os`, all 14 channels, with Kaduse Medikal as the first proving ground.
**Relationship to other governing docs:** this document sets the creative bar every technical document (`RENDERING-SYSTEM.md`, `TYPOGRAPHY-SYSTEM.md`, `LAYOUT-GRAMMAR.md`, `COLOR-SYSTEM.md`, `SELECTION-ENGINE.md`) and every channel-content-os contract (composition-spec, creative-director) must serve. It does not replace or override any of them.

---

## Creative North Star

> The system is not merely a correctly functioning content machine. It must produce work that is creatively strong, visually original, consciously art-directed, and specific to each channel.
>
> Infrastructure, data, rendering, typography, QA, preview, and admission are subordinate systems in service of that goal. They are not goals in themselves.

Every current and future package must be evaluated against these five questions:

1. Does this work make the channel's visual character more distinct?
2. Does the resulting direction move away from generic AI social-media aesthetics?
3. Does the post have a genuine creative idea and a compositional point of view?
4. Can repeated output in the same channel vary its rhythm, typography, image treatment, and visual direction without losing channel identity?
5. Does the technical system enable that creative choice, or does it flatten it into a generic template?

A post that technically renders, passes overflow checks, and is stored correctly is **not** a visual success by itself. Conversely, a good creative direction must not be overstated as an approved or publishable outcome until a real rendered artifact and explicit human aesthetic review exist.

---

## 1. Product problem and success definition

The root problem this document addresses is not incomplete orchestration. It is that the channel visuals the system has produced or evaluated so far have not reliably felt channel-specific, creatively intentional, or visually strong — they risk reading as generic AI/social-template output even when every technical control passes.

Five outcomes are tracked separately. **No status may imply a later one** — a post can sit at any one of these and stop there indefinitely:

| Status | What it means | What it does NOT mean |
|---|---|---|
| **Technically valid** | Schema, font resolution, geometry, renderer, storage, and admission-related controls behave correctly on a real run. | Does not mean the composition has a creative idea. `RENDERED_AND_ADMITTED` (P2A's own vocabulary) is this status, nothing more. |
| **Visually coherent** | The output is recognizable as belonging to the channel's system and its hierarchy is legible. | Does not mean the composition is original or non-generic — a coherent template is still a template. |
| **Creatively strong** | The composition carries a defensible idea, an intentional compositional gesture, a non-generic visual language, and demonstrates controlled variation against the channel's own history. | Cannot be established by a deterministic check alone (see §4). Requires structured critique and/or human judgment. |
| **Human aesthetically approved** | A real person has looked at a real rendered artifact and said yes. | Does not exist until it exists — a strong Creative Director candidate set, a passing render, or a confident-sounding thesis field are not approval. |
| **Production/publish ready** | A separately governed operational state (export package, publishing route, platform admission, explicit publish action). | Is downstream of, and independent from, aesthetic approval — a technically publishable post can still be creatively rejected, and an aesthetically approved direction is not automatically cleared to publish. |

---

## 2. Diagnosis of the present creative gap — evidence-backed

Every finding below cites a real, currently accessible file or a real absence, checked directly for this document (2026-09-11), not inferred. Status tags use the vocabulary this document is required to use: `VERIFIED_CREATIVE_STRENGTH`, `VERIFIED_CREATIVE_CONSTRAINT`, `IMPLEMENTED_BUT_NOT_USED`, `MISSING_CREATIVE_INPUT`, `NOT_VERIFIED`, `PENDING_HUMAN_TASTE_DECISION`.

### 2.1 Kaduse has a real, source-traced palette with defined contrast behavior
`channels/kaduse-medikal/brand/colors.json` — 6 named colors, 9 role assignments, a `contrastPolicy` with 6 real measured `criticalPairs` (ratios computed, not asserted) and 5 `restrictedPairs` explicitly marked "do-not-use-for-text". `sourceNotes` traces every hex value to the brand's own `00_KADUSE_BIBLE.md`. **`VERIFIED_CREATIVE_STRENGTH`** — this is real raw material a creative direction can build tension from (which pairs are forbidden, which are merely restricted-to-decoration), not a placeholder palette.

### 2.2 Real, user-authored, emotionally specific copy already exists and was not used in the most recent pilot
`channels/kaduse-medikal/content/evaluation-cases/product-promotion-message-led-sparse-v1.json` carries a real headline ("İlk duyduğun kalp sesi, bir ömür aklında kalır" — roughly, "the first heartbeat you hear stays with you for a lifetime") and body, explicitly marked `isAuthoritative: true`, `provenance: "...contentProfile.source = 'user-provided-final-copy' (real, user-authored copy, not AI-invented)"`, dated 2026-09-03. This is genuinely evocative, channel-specific copy — not spec-sheet language. The P2A pilot (this session, 2026-09-10/11) instead used descriptive catalog facts ("3M Littmann Classic III... Fuşya hortum, bakır aynalı çan. 5 yıl garanti.") for the same archetype and a structurally identical evaluation case family. **`IMPLEMENTED_BUT_NOT_USED`** — the more creatively promising input was available and was not the one carried into the only structurally-complete pilot to date. This is not a quality judgment on either piece of copy; it is a finding that C1 must explicitly choose which register it is working in, not default to whichever copy happens to be handy for a technical demo.

### 2.3 Four real, structurally distinct art-direction candidates already exist for Kaduse — but were never actually seen by this session
`channels/kaduse-medikal/content/visual-directions/product-promotion-message-led-sparse-v1-direction-0{1..4}.json` (2026-09-04) record four genuinely different compositional theses against the same evaluation case: direction-01 (EDITORIAL_CONTRAST-adjacent, restraint/negative-space), direction-02 (CLINICAL_LEVELS, tiered ruled information zones, asymmetric text/image split), direction-03 (PREMIUM_SHOWCASE, "the most brand-precedented of the four... matted in generous negative space"), direction-04 (DIAGONAL_CONFRONTATION-adjacent, saturated ground, "the most scroll-stopping, expressive of the four"). Each carries a real one-sentence thesis and a distinct `compositionMode`/`ground` pair. **`VERIFIED_CREATIVE_STRENGTH`** at the structural/thesis level — this is a genuine example of ≥3 materially different directions, not four recolors. But every one of these four is also **`NOT_VERIFIED`** as an actual visual outcome: each `artifact` field states the rendered PNG was "delivered to the human reviewer... not copied into canonical repo storage" — no pixels exist anywhere this session (or, on current evidence, any session since) can inspect. A real prior human review may have happened entirely outside this repository's visibility; this document does not assume it did or didn't.

### 2.4 The most recent real pilot's own creative-direction candidate set is the generic pattern this programme exists to prevent
`channel-content-os`'s `src/pilots/kaduse-product-promotion-p2.ts` (this session, Batch P2/P2A) defines three Creative Director candidates for the exact same archetype as §2.3. All three use **identical geometry** — both roles (`headline`, `body`) resolve to the `PRESERVE` adaptation verb on the same two hand-authored base regions in every candidate, because `slotIntents` is `[]` in all three. The only differences across the set are `ground`, `compositionMode` label, `typographyWeight`, and `abstractionLevel` — i.e., three colors/labels on one fixed skeleton. This technically satisfies `validateArtDirectionSet`'s diversity rule (≥2-of-5 dimensions differ, per candidate pair) because that rule counts *labeled* dimensions, not *realized* compositional difference. **`VERIFIED_CREATIVE_CONSTRAINT`** — and a direct, honest regression against §2.3's own real prior work from one week earlier in the same channel. This is the clearest concrete evidence in the repository that the technical chain can produce "three directions" that are not three ideas.

### 2.5 At least one of the four §2.3 directions traces to a single vendored template's structure
Direction-01's `layout.provenance` names `design-catalog/guizang-templates/template-swiss-card.html` (vendored, AGPL-3.0, channel-content-os) as its structural source, explicitly noting only its "tag → statement → lead → meta vertical stack" was kept. This is legitimate, disclosed reuse of structure, not of finished design — but it means at least one quarter of Kaduse's only real prior candidate set, and (per §2.4) effectively the entirety of the newest pilot's candidate set, share lineage with the same small pool of vendored template skeletons this repo has access to (`design-catalog/guizang-templates/`, a fixed set). **`VERIFIED_CREATIVE_CONSTRAINT`** — the system's structural imagination is currently bounded by a small, named, inspectable set of borrowed skeletons, not by anything channel-specific.

### 2.6 The one hand-authored production layout is a single fixed skeleton, proven wired but not proven to vary
`kaduse-pilot-message-led-v1` (channel-content-os `layout_pool`/`layout_regions`, local D1 only, Batch P2) is exactly two roles (`headline`, `body`) in one fixed vertical arrangement. It successfully proved the geometry-resolver → CompositionSpec → renderer-routing chain end-to-end (Batch P2/P2A). **`VERIFIED_CREATIVE_STRENGTH`** for what it proves technically; **`VERIFIED_CREATIVE_CONSTRAINT`** for creative range — it is one skeleton, and every candidate that has actually reached geometry resolution to date (§2.4) reused it unchanged.

### 2.7 No channel carries an explicit visual anti-pattern or reference-territory record
`channels/kaduse-medikal/content/policies/product-promotion.json` records real, detailed *content* rules (which product facts may appear, same-series vs. cross-series handling — see the `kaduse_same_series_comparison_rule` and `kaduse_product_promotion_subtypes` project memory) but nothing about visual language: no "avoid X," no reference imagery, no named visual-tension statement. `BrandProfile.visualTone`/`prohibitedPatterns` (channel-content-os `schemas/brand-profile.ts`) are real, typed fields but are empty arrays for every channel today (confirmed both in this session's own P0 audit and by inspecting the current `projects.typography`/`brand_colors` seed content — no `visualTone` or `prohibitedPatterns` value has ever been set for `kaduse-medikal`). **`MISSING_CREATIVE_INPUT`** — the exact field the architecture already reserves for "what this channel should never look like" has never been filled in for any channel.

### 2.8 No accessible real Kaduse Instagram reference material exists inside either repository
A direct search of `channels/kaduse-medikal/` for image or reference files (beyond logo assets) returned nothing. The channel's real Instagram history is referenced conceptually in project memory and prior conversation, but no screenshot, export, or structured reference set is present for this document to inspect. **`NOT_VERIFIED`** — this document does not claim to have reviewed Kaduse's real posting history, and no future package should claim to either unless real material is actually supplied and read.

### 2.9 The validation machinery enforces label diversity, not compositional quality — by design, and honestly
`art-direction/engine.ts`'s `validateArtDirectionSet` (channel-content-os) is real, tested, and deliberately does *not* compute a fabricated "creative fit" score (its own header comment is explicit about this, contrasting it with `editorial-vision-studio`'s approach). It rejects candidate sets that are structurally identical on ≥4-of-5 labeled dimensions. §2.4 shows this is a necessary but not sufficient check: a set can pass it while being one composition wearing three colors. **`IMPLEMENTED_BUT_NOT_USED`** in the sense that mattered here — the tool that could have caught §2.4's flatness (a human or a structured visual critique) was never actually invoked in that pilot; only the deterministic label check ran.

### 2.10 Typography now has real, licensed optionality for Kaduse — but which of two real options to use, and when, is undecided
Font Pool v5 (this session, immediately prior package) gives Kaduse two real, license-verified, renderable combinations — `kaduse-clinical-information` (Libre Franklin + Inter) and `kaduse-product-editorial` (Source Sans 3 + Inter) — plus one rare display face (Stack Sans Notch). **`VERIFIED_CREATIVE_STRENGTH`** that real optionality now exists (this was not true before this session). **`PENDING_HUMAN_TASTE_DECISION`**: nothing in the repository states which combination suits which post type, mood, or moment, and no mechanism yet lets a post choose between them (`projects.typography` in D1 still holds only one fixed config — see §6).

---

## 3. Creative operating model

Four layers, deliberately concrete enough to become real contracts later without choosing a database schema now.

### 3.1 Channel Visual DNA (enduring identity)
The stable identity a channel's output must keep even as individual posts and series change. Fields: audience, editorial posture (e.g. clinical-confident vs. warm-personal), visual tension (the productive contradiction the channel's imagery works with — e.g. Kaduse's real, measured "trustworthy clinical precision vs. human warmth" implied by its palette's own restricted-pairs behavior, §2.1), palette behavior (not just hex values — which pairs are load-bearing, which are decoration-only, per §2.1's real contrast data), typography combinations (the named, licensed set from Font Pool v5, §2.10), image policy (real-photo-required vs. message-led-permitted vs. never — Kaduse's current pilot is explicitly message-led, no product photograph, §2.2/2.4), format rhythm (how format choice varies post to post), reference territory (real accessible visual references, when supplied — none exist yet for Kaduse, §2.8), and explicit anti-patterns (the field §2.7 found empty everywhere).

### 3.2 Series / Campaign Direction (bounded visual family)
A named, time- or theme-bounded visual family inside a channel's DNA — e.g. a stethoscope-launch series, a Ramazan-specific Dua Mecmuası series, a transfer-window Futboscope series. It may shift rhythm, density, or a typography combination choice while staying inside the parent DNA's tension and anti-patterns. Not yet instantiated for any channel; Kaduse's four §2.3 directions are evidence a *bounded evaluation case* can carry multiple series-shaped candidates, not yet a named Series object.

### 3.3 Post Art-Direction Card (the required pre-production decision)
The minimum fields a real post must fix before composition begins: creative thesis (one sentence, non-empty — already a real, enforced field in `CreativeDirectionCandidate.thesis`, channel-content-os), intended audience response, hierarchy (what reads first/second/third), compositional gesture (the real, dominant move — restraint, tiered structure, showcase, confrontation, per §2.3's own real vocabulary), density band (already real and computed — `SPARSE`/`MEDIUM`/`DENSE`, `content-classification/density-engine.ts`), image/illustration/material role (including "none, deliberately," Kaduse's current real state), typography combination (a named Font Pool v5 `combination_id`, §2.10), palette distribution (which roles get which colors, respecting §2.1's restricted pairs), texture/motion treatment where applicable, accessibility/legibility constraints (real safe-zone/contrast data already exists and must be respected, not re-derived), source/claim restrictions (real, enforced today via the evidence-status gate, `candidates/resolver.ts`), and anti-clichés (this specific post's own "do not do X," narrower than the channel-level list in §3.1).

### 3.4 Candidate Comparison and Selection
For any important new series or pilot: at least two, normally three, **materially distinct** directions for the same bounded brief. "Materially distinct" is defined precisely by what §2.4 failed to be: differing composition mode/gesture and/or differing image-vs-typography balance and/or differing density realization — never only color, font, or alignment. §2.3 is the existing real example of what this looks like when done; §2.4 is the existing real example of what it looks like when the label-diversity check is mistaken for this requirement.

**Why these four layers prevent template flattening:** a global template/renderer can only ever execute what a Post Art-Direction Card specifies (§3.3); the Card can only vary within what a Series permits (§3.2); a Series can only vary within what the channel's own Visual DNA and anti-patterns (§3.1) allow. A generic-looking output is therefore always traceable to a missing or under-specified layer — most concretely, per §2.7/§2.4, to an empty anti-patterns field and a Card whose "compositional gesture" was never actually set to anything beyond a color choice.

---

## 4. Creative quality gates

| Criterion | Success looks like | Failure looks like | Who/what evaluates | Ever fully automatic? |
|---|---|---|---|---|
| Channel specificity | A viewer familiar with the channel could identify it without a logo | Composition would work unchanged for any channel | Human reviewer; a structured visual critique could flag "no channel-DNA field referenced" | No |
| Creative idea / tension | A one-sentence thesis that argues something (§2.3's real examples) | Thesis field empty, generic, or restates the layout mechanically | Deterministic: non-empty thesis (already enforced). Genuine quality: human/structured critique | Partially — presence is automatic, quality is not |
| Hierarchy / compositional intent | One clear dominant element/gesture, measurable | Everything roughly equal weight, or dominance contradicts the stated thesis | Deterministic: `NO_DOMINANT_GESTURE` (real, measured, ≥15% + ≥1.5x rule already exists) as a floor; human judgment for whether the *right* thing dominates | Floor only |
| Distinctiveness from generic AI/template output | Passes a real swap-test: change subject, geometry should not still "just work" the same way | ≥90% geometric fingerprint similarity across genuinely different content | Deterministic: `check_template_dependence`'s real swap-test (already implemented, channel-content-os) | Yes, for the swap-test specifically |
| Typography as voice, not decoration | Combination choice (§2.10) matches the Card's intended tone, and weight/role usage matches the channel's own combination rules (metadata never carries body copy, per Font Pool v5's own guardrail) | Rare/display font used for body text or a claim; combination chosen arbitrarily | Deterministic: role-misuse is checkable in principle (not yet built); tone-match is human | Mixed |
| Appropriate image/material/negative-space role | Matches the Card's stated role; negative space is a real, measured, deliberate choice | Filled space with no stated reason; product forced in where the direction says none | Deterministic: real measured negative-space % exists (`check_negative_space`, Paper.js engine); "deliberate" is human | Mixed |
| Variation without identity drift | New post reads as the same channel, different moment | Either identical to the last post, or unrecognizable as the channel | Human, comparing against the channel's own recent history — no automated "history similarity" check exists today | No |
| Factual/brand/safety compliance | Every claim sourced, palette respects §2.1's restricted pairs, no invented fact | Unsourced claim, forbidden color-as-text pairing, invented price/claim | Deterministic: evidence-status gate (real, tested, P2A), contrast checker (real) | Yes |
| Actual rendered legibility / real safe-zone | Measured from the real render's own element boxes | Passes on a spec but the real render clips or crowds | Deterministic: real safe-zone-fit check runs on real render output (already implemented) — but only once a real render exists | Yes, but only post-render |

**Rejection taxonomy** (a candidate or a rendered post may be tagged with one or more):
`GENERIC_TEMPLATE`, `NO_CREATIVE_THESIS`, `CHANNEL_IDENTITY_DRIFT`, `DECORATIVE_BUT_UNREADABLE`, `OVERSTYLED_WITHOUT_CONTENT_ROLE`, `REPETITIVE_SERIES_RHYTHM`, `ASSET_OR_CLAIM_MISREPRESENTATION`, `TECHNICALLY_VALID_BUT_AESTHETICALLY_PENDING`.

`TECHNICALLY_VALID_BUT_AESTHETICALLY_PENDING` is the correct, honest tag for every artifact this programme's own C1 package (§7) is expected to produce before a human decision is made — it is not a failure tag, it is a holding state.

---

## 5. Skill orchestration principle

Installed creative/design skills are specialist roles inside one deliberate pipeline, not a substitute for a brief and not an automatic quality signal merely because a skill was invoked.

`brand/reference intelligence → creative strategy → art direction → composition → typography → image/material direction → prompt/spec compilation → render → independent visual critique → human selection/review`

| Role | Input | Output | Allowed decisions | Prohibited assumptions | Handoff |
|---|---|---|---|---|---|
| Brand/reference intelligence | Real channel DNA, real palette/copy/reference files | A compact, real-fact-only brief | Which real facts are relevant | Never invents a fact, price, claim, or reference that wasn't supplied | → Creative strategy |
| Creative strategy | The brief | The bounded creative problem (what is this post actually arguing) | Framing, register, tension to use | Never assumes a visual solution yet | → Art direction |
| Art direction | The creative problem | ≥3 materially distinct theses + composition modes (§3.4's real bar) | Ground, composition mode, dominant gesture, abstraction level | Never treats a color/font swap as a second direction | → Composition |
| Composition | One selected thesis | Concrete element geometry (real: geometry-resolver's job) | Verb/parameter choices within the thesis | Never overrides the thesis to make geometry easier | → Typography |
| Typography | Composition + Font Pool v5 | A named `combination_id` + real measured fit | Which combination and weight per role | Never selects a `LICENSE_REQUIRED` font for production | → Image/material direction |
| Image/material direction | Composition + channel's image policy | Real asset selection or an explicit "message-led, no image" decision | Crop/treatment within real asset rights | Never invents or implies product photography that doesn't exist | → Prompt/spec compilation |
| Prompt/spec compilation | All of the above | A real, structured CompositionSpec (channel-content-os, already implemented) | Assembly only | Never a creative decision of its own (already the system's own stated rule) | → Render |
| Render | CompositionSpec | A real artifact or an honest failure state (already implemented, P2A) | None — mechanical | Never fabricates a rendered result | → Independent visual critique |
| Independent visual critique | The real artifact | A structured judgment against §4's rubric, tagged with the rejection taxonomy where relevant | Flag weakness, do not silently pass | Never treats "it rendered" as "it is good" | → Human selection/review |
| Human selection/review | Critique + artifact + candidates | The only source of `human aesthetically approved` status | Select, reject, request revision | This document does not and cannot perform this role | Terminal |

A later role may challenge a weak prior direction (e.g. Typography may flag that the selected thesis has no image-role decision to typeset around) rather than cosmetically executing whatever arrived. No new skill is installed, no external generation service is called, and no skill's involvement is reported as review unless it actually happened, by this programme's own rule.

---

## 6. Relationship to existing technical architecture

| Creative layer | Existing/likely technical touchpoint | What must remain explicit |
|---|---|---|
| Channel Visual DNA | `BrandProfile.visualTone` / `.prohibitedPatterns` (real fields, currently empty for every channel, §2.7) | These are *fields*, not a filled DNA record — filling them is a real, future, per-channel decision, not automatic from having the fields |
| Typography combination | `projects.typography` (D1, single `{headline,body,label}` config today) vs. Font Pool v5's named multi-combination model (§2.10) | **A single headline/body font field cannot yet express a named combination_id** — this is a real, current architecture gap, not solved by this document |
| Post Art-Direction Card | `ContentBrief` + `CreativeDirectionCandidate` (real, tested schemas) | The Card's creative fields (thesis, gesture, anti-clichés) map closely to `CreativeDirectionCandidate` already; density/hierarchy map to real classifier output. No new schema is required to *describe* a Card — only to *select among named combinations* |
| Candidate Comparison and Selection | `validateArtDirectionSet` (real) + Creative Director contract (real, unwired to any live LLM per P2A) | The validator checks label diversity (§2.9), not realized difference — it is necessary, not sufficient, and must not be reported as sufficient |
| Geometry resolution / hand-authored regions | `layout_regions`, `sizing_basis: hand-authored` (real, P2/P2A) | Hand-authored regions are technically valid inputs; they are not evidence of aesthetic quality, and must never be described as such regardless of how clean the resulting render looks |
| Renderer routing / inline QA / formal admission | `routeRenderer`, `executeStaticComposition`, `evaluateProductionAdmission` (all real, wired, P2A) | These decide executability and platform compliance — **renderer routing cannot and must not be asked to decide whether a composition has a worthwhile creative thesis**; that is out of scope for those modules by design |
| Dashboard / review packet | `apps/dashboard`, real `/api/candidates` (not yet fed by any compose_and_render run, per P2A's own honest finding) | A review packet does not yet exist for a creatively-evaluated post; building one is real, scoped future work, not implied by any current wiring |

Proposed future data/contract changes, each labeled per this document's own required vocabulary:

- **`REQUIRED_FOR_C1`**: a way to record ≥3 candidate Art-Direction Cards against one bounded brief and mark exactly one `PENDING_HUMAN_TASTE_DECISION`/selected — the comparison packet C1 (§7) must produce. This can be a plain tracked file/JSON for C1; it does not require a database migration.
- **`DEFERRED`**: a real `combination_id` selector on `projects.typography` (or an equivalent multi-combination table) so a post can pick between `kaduse-clinical-information` and `kaduse-product-editorial` at compose time. Needed before C1's *rendering* step can honestly vary typography combination per candidate; not needed to *define* the candidates on paper.
- **`DEFERRED`**: a channel Visual DNA record (filling `visualTone`/`prohibitedPatterns` for real, plus the reference-territory/anti-pattern fields §2.7 found missing everywhere). Needed before Series-level work (§3.2) can be evaluated against a real DNA; C1 can proceed with an explicit, narrower, Kaduse-only anti-clichés list on its own Cards instead (§3.3).
- **`NOT_YET_JUSTIFIED`**: any generalized cross-channel Series/Campaign schema, any automated "creative fit" scoring model, any change to `validateArtDirectionSet`'s own diversity math. None of these are demonstrated necessary by C1's scope.

None of these are implemented in this package.

---

## 7. C1 — Kaduse Visual DNA and Art-Direction Candidate Set

**Depends on:** preview/render infrastructure becoming available (P3A's isolated calibration environment — see §8's dependency map; C1 does not require it to *begin*, only to reach real rendered previews).

### Entry criteria
- Font Pool v5's two Kaduse combinations are real and license-verified (true today, §2.10).
- A bounded brief exists: reuse the real, already-approved `product-promotion` archetype, `single-product-hero-promotion` subtype, and either the §2.2 heartbeat copy or the P2A catalog-fact copy — **an explicit human choice between these two registers is a prerequisite input to C1, not a decision C1 makes for itself.**
- No new product photography is required or assumed (message-led remains valid, per current real constraints).

### Deliverables
1. Three materially distinct Post Art-Direction Cards (§3.3) against the one bounded brief, each stating: creative thesis, composition/dominant gesture, typography combination (a named Font Pool v5 `combination_id`), palette distribution (respecting §2.1's real restricted pairs), image/material strategy (each Card states plainly whether it needs a real photograph later or is photograph-free by design), accessibility/legibility notes, and anti-clichés specific to that Card.
2. Each Card explicitly distinguishes: buildable today with zero new assets, vs. requires a real asset not yet available (per this document's own guardrail, no photography is invented to close that gap).
3. A comparison/review packet (a plain tracked document is sufficient scope for C1) presenting the three Cards side by side against §4's rubric, self-tagged with any applicable rejection-taxonomy code, including `TECHNICALLY_VALID_BUT_AESTHETICALLY_PENDING` where nothing else applies.
4. **When and only when** a real preview render is demonstrably available (a real `RENDERED` result from the P2A chain, not assumed): real preview artifacts for the selected Card(s), through the existing, unmodified `compose_post`(`execution_mode: compose_and_render`) path — no new rendering mechanism.
5. If preview infrastructure is not yet available at delivery time: a legitimate pre-render candidate pack (the three Cards + comparison packet) stands as the deliverable on its own — this is a valid, honest stopping point, not a placeholder for faked visual evidence.

### Validation
- Each Card's thesis is non-empty and distinct from the other two on more than a color/font swap (checked by the same human/structured-critique judgment §4 requires — not claimed as automatically verified).
- If a real render is produced: real safe-zone fit and inline QA results are attached, unaltered, exactly as `executeStaticComposition` reports them.
- Formal production admission is run if and only if a real render exists, and its real result (including an honest `not-admitted` outcome, since `kaduse-pilot-message-led-v1` remains `hand-authored`, never promoted to `measured-render` — explicit guardrail, restated) is reported as-is.

### Decision points (human)
- Which copy register (§2.2's heartbeat line vs. the P2A catalog-fact line) the bounded brief uses.
- Which of the three Cards, if any, is selected — left `PENDING_HUMAN_TASTE_DECISION` by this package regardless of how confident any Card's thesis reads.

### Exit criteria
Three real, materially distinct Cards exist with a comparison packet; if rendering was available, real (not fabricated) preview artifacts exist for at least the selected/leading candidate; nothing is marked published, human-approved, or `measured-render` as a side effect of this package.

### Out of scope for C1
Any other channel; any new product photography; any commercial (`LICENSE_REQUIRED`) font activation; any `combination_id` selector code (§6's `DEFERRED` item); any dashboard/candidates-table wiring; any remote/production action of any kind.

---

## 8. Portfolio roadmap correction (amendment to P0–P9)

This is an amendment, not a replacement. Exact insertion points are given in the accompanying Handoff Report. In substance:

- **P0/P1**: add, as an explicit input requirement alongside technical dependency verification, real references, the channel's Visual DNA fields (even if only partially filled), actual copy inputs (not placeholder headlines), and ≥3 candidate directions per §3.4's real bar — a P0/P1 that only verifies technical dependencies (as the existing P0/P1 for Kaduse did) is not creatively complete on its own terms, and must say so.
- **P2/P3**: the technical chain (already real, per P2A) must be described as *preserving* whichever creative decision was made upstream, never as *making* one — restate `compose_post`'s own real, existing rule (it validates, it does not invent) as a creative-process rule, not only a technical one. P3-class packages must check real render outcomes against §4's rubric, not only against technical admission.
- **P4/P5**: when a real catalog item or a second channel enters the candidate/production flow, the source-to-candidate path must not force Kaduse's own register, thesis style, or composition-mode choices onto another channel's Cards — each channel's Visual DNA (§3.1), once it exists, governs its own Cards.
- **P6**: each channel's onboarding package must include a first bounded Visual DNA pass and its own first candidate set (§7's shape, per channel) — `LOGOS_PASS`/`COLORS_PASS` remain necessary but are not sufficient for a channel to be creatively ready.
- **P7–P9**: source/format/publication expansion must not create a path where a post reaches publication without having passed through §4's rubric at least at the `TECHNICALLY_VALID_BUT_AESTHETICALLY_PENDING`-or-better level — expansion work must not implicitly bypass creative review by moving fast on the technical side.

**Every future package report must add a `creative impact` field answering the five North Star questions honestly**, including "not applicable / infrastructure-only" where genuinely true — a package may be reported complete on its own technical terms while explicitly stating it did not advance creative quality.

---

## 9. Open questions this document deliberately leaves to the user

- Which Kaduse copy register (§2.2) C1's bounded brief should use.
- Whether and when to pursue Adelle licensing for the `kaduse-editorial-product` future direction (Font Pool v5, unchanged, `LICENSE_REQUIRED`).
- Whether the §2.3 directions' external human-review outcome (if any occurred outside this repository's visibility) should be retrieved/documented before C1 restates similar ground.
- Timing of the `combination_id` selector (§6, `DEFERRED`) relative to C1.

---

*This document supersedes no prior verified finding. P0, P1, P2, P2A, and P3A's technical results stand as reported; this document adds the creative evaluation layer they did not attempt.*
