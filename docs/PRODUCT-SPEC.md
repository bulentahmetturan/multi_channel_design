# Product Specification

## Goal

Provide one extensible system for channel branding, reusable layouts, post rendering, content monitoring, review, and publication tracking.

## Composition model

`Final Post = Content-Based Layout + Channel Brand Pack + Typography Pair + Assets + Format Profile`

## Required capabilities

- Add channels, layouts, formats, sources, and renderers through versioned data or adapters.
- Analyze each layout reference once and use stored structured metadata afterward.
- Generate posts, carousels, stories, and Reels covers with deterministic quality gates.
- Maintain `INCOMING → WILL_PUBLISH → PUBLISHED` and immediate decline deletion with minimal derived feedback.
- Learn reversible, explainable channel preferences without fine-tuning foundation models.

## Non-goals for the foundation

- Automatic Instagram publishing.
- Hosted production infrastructure.
- Provider-specific core architecture.
