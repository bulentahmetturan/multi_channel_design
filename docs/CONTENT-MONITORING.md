# Content Monitoring

Use one central inbox with channel-specific monitoring profiles. Prefer official APIs, RSS, and structured feeds; scrape responsibly only when required. Store summaries and structured facts rather than full articles.

Canonicalize URLs and fingerprint content before summarization. Merge exact and near duplicates while preserving provenance and first-seen/last-updated timestamps. Published records are immutable; important later developments become new incoming items.

Decline deletes visible content immediately and retains only minimal derived feedback. Accept validates and generates before moving to `WILL_PUBLISH`; successful publication moves an item to immutable `PUBLISHED`.
