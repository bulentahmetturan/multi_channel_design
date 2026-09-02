# Design references (VoltAgent/awesome-design-md)

A token-cheap way to borrow **layout/typography/spacing structure** from
[VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)'s
74 brand `DESIGN.md` analyses -- never their colors, fonts, or brand identity.

## How it stays cheap

- `index.json` -- catalog of all 74 guides: slug + real source link only.
  Descriptions are `null` until a guide is actually fetched (no bulk read at
  index time, per the project's own rule).
- On a production request, pick ONE guide (by name, or by known reputation --
  e.g. "notion" for dense structured hierarchy, "apple" for minimal restraint)
  and run `python select_reference.py fetch <slug>`. This fetches exactly that
  one `DESIGN.md`, extracts its typography/spacing/corner-radius scales, and
  writes a condensed brief to `cache/<slug>.json` with the source URL and the
  file's real GitHub commit SHA (version).
- Later requests for the same guide call `python select_reference.py brief
  <slug>` -- reads the cached JSON, zero network calls, zero re-parsing.
- Nothing here ever loads the full catalog or prior design history into
  context on a normal request -- only the one selected, already-condensed brief.

## Brand identity vs. reference structure -- never mixed

A cached brief's `structural_pattern` (typography scale ratios, spacing
rhythm, corner-radius scale) is the only thing ever applied to a channel's own
design. Colors and font families always come from that channel's own
`channels/<slug>/brand/colors.json`, `logo-manifest.json`, and
`design-system/typography/font-pool.json` -- see `demo-brief-turkiye-scholarships.json`
for a worked example: Notion's *scale* (17-step type ramp, doubling spacing
rhythm) applied to turkiye-scholarships' own crimson/charcoal/ivory palette
and its own IBM Plex Sans candidate, with Notion's actual navy/purple/pastel
identity discarded entirely.

## Fonts: verified only, never assumed

`select_reference.py` never treats a `DESIGN.md`'s named font (e.g. "Notion
Sans") as usable -- those are the referenced brand's own private typefaces,
and the awesome-design-md repo does not distribute font files at all, only
text specs. Any font actually used in an output must already exist in
`design-system/typography/font-pool.json` with a verified license and checked
Turkish-glyph coverage (Latin Extended-A: ı/İ, ğ/Ğ, ş/Ş, ç/Ç, ö/Ö, ü/Ü).

## What's NOT built yet

- **No image-generation/export/render tool exists in this repo.** `apps/dashboard`,
  `apps/worker`, and `packages/renderer` are still empty `.gitkeep` placeholders
  from the original architecture scaffold. `select_reference.py` produces a
  structured JSON *brief* (see `demo-brief-turkiye-scholarships.json`) -- turning
  that into an actual rendered PNG needs a render tool that doesn't exist here yet.
- Only `notion` has been fetched/cached so far (the worked demo). The other 73
  stay `fetched: false` until something actually needs them.
- No MCP wiring to this yet -- it's a standalone script for now. Could be
  added as a 6th tool (`find_design_reference`) on the `channel-content-os`
  MCP server later if that turns out to be worth the extra surface.
