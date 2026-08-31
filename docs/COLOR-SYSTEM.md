# Color System

Every Channel Pack owns a fixed approved palette and a versioned Color Combination Registry. Posts select role-based combinations from that registry; they never assign colors randomly.

## Registry

Maintain two-, three-, and four-color combinations plus reversed variants. Every entry explicitly defines background, surface or overlay, primary text, secondary text, accent, border or data highlight, and logo treatment.

- Two colors: minimal posts.
- Three colors: standard editorial posts.
- Four colors: only when the layout supports the added hierarchy without noise.
- Reversed variants: allowed only when contrast, readability, and logo visibility pass.

Registry approval requires palette approval and applicable logo and typography validation. Each final render must also pass layout compatibility and safe-zone checks.

## Selection

Choose by content structure, selected layout, image brightness, text density, and recent feed history. Default recent window: six published posts, configurable per channel.

Do not repeat the same `(background, primaryText, accent)` signature inside the recent window unless the post belongs to an explicitly identified campaign series or the user requests consistency.

Store the registry version, combination ID, combination version, and repeat signature in each post record.
