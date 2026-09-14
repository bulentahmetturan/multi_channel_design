"""Analyze a product cutout PNG's real alpha mask and report compact,
retrievable metadata for composition decisions (Kaduse Visual Quality P2,
Category 2 -- product image treatment).

Real computations only, no invented values:
- Alpha-mask stats and a tight visible-pixel bounding box (ALPHA_THRESHOLD,
  not the PNG's rectangular canvas).
- Centroid and dominant axis via PCA (eigen-decomposition of the alpha-
  weighted pixel coordinate covariance) -- a real orientation, not a guess.
- Enclosed transparent regions ("holes") via border flood-fill, the same
  topological idea channel-content-os's qa/photo-integrity.ts already uses
  to flag defects -- here an enclosed hole in a stethoscope cutout is the
  expected, meaningful open tubing loop, not a defect.
- A chestpiece-region candidate via the distance-transform peak of the
  opaque mask (the thickest/most circular part of a stethoscope silhouette
  is reliably its chestpiece disc, not its thin tubing) -- reported as a
  heuristic candidate with its own confidence-relevant fields (radius,
  circularity), not asserted as ground truth.
- Suitable crop candidates (full-product tight box with margin; macro
  chestpiece box) derived from the above, not separately guessed.

Usage: python analyze_product_image.py <input.png> <output.json>
"""
import json
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

ALPHA_THRESHOLD = 32  # out of 255; matches typical cutout anti-aliasing edges


def tight_bbox(mask: np.ndarray):
    ys, xs = np.where(mask)
    if len(xs) == 0:
        return None
    return {"x": int(xs.min()), "y": int(ys.min()), "width": int(xs.max() - xs.min() + 1), "height": int(ys.max() - ys.min() + 1)}


def pca_axis(mask: np.ndarray, alpha: np.ndarray):
    ys, xs = np.where(mask)
    weights = alpha[ys, xs].astype(np.float64)
    weights /= weights.sum()
    cx = float((xs * weights).sum())
    cy = float((ys * weights).sum())
    dx = xs - cx
    dy = ys - cy
    cov = np.array([
        [(weights * dx * dx).sum(), (weights * dx * dy).sum()],
        [(weights * dx * dy).sum(), (weights * dy * dy).sum()],
    ])
    eigvals, eigvecs = np.linalg.eigh(cov)
    order = np.argsort(eigvals)[::-1]
    eigvals = eigvals[order]
    eigvecs = eigvecs[:, order]
    major = eigvecs[:, 0]
    angle_deg = float(np.degrees(np.arctan2(major[1], major[0])))
    # Normalize to [0, 180) -- an axis has no head/tail
    angle_deg %= 180.0
    aspect = float(np.sqrt(eigvals[0] / eigvals[1])) if eigvals[1] > 1e-9 else None
    return {
        "centroid": {"x": round(cx, 1), "y": round(cy, 1)},
        "angleDegFromHorizontal": round(angle_deg, 1),
        "eigenvalueRatio": round(aspect, 2) if aspect else None,
        "note": "angleDegFromHorizontal is the dominant axis of the alpha-weighted pixel mass (PCA major eigenvector), 0=horizontal, 90=vertical. eigenvalueRatio is major/minor axis spread -- higher means a more elongated (tubing-like), lower means a more compact (chestpiece-like) overall mass.",
    }


def find_holes(mask: np.ndarray):
    """Enclosed background regions = real open loop candidates (tubing loop)."""
    filled = ndimage.binary_fill_holes(mask)
    holes = filled & ~mask
    labeled, n = ndimage.label(holes)
    results = []
    h, w = mask.shape
    canvas_area = h * w
    for i in range(1, n + 1):
        ys, xs = np.where(labeled == i)
        area = len(xs)
        if area < 25:  # discard anti-aliasing noise slivers
            continue
        results.append({
            "bbox": {"x": int(xs.min()), "y": int(ys.min()), "width": int(xs.max() - xs.min() + 1), "height": int(ys.max() - ys.min() + 1)},
            "areaPx": int(area),
            "pctOfCanvas": round(100 * area / canvas_area, 2),
        })
    results.sort(key=lambda r: -r["areaPx"])
    return results


def find_chestpiece_candidate(mask: np.ndarray):
    """Distance-transform peak = thickest part of the silhouette."""
    dist = ndimage.distance_transform_edt(mask)
    peak_val = float(dist.max())
    if peak_val < 1:
        return None
    ys, xs = np.where(dist >= peak_val * 0.97)
    cx, cy = float(xs.mean()), float(ys.mean())
    radius = peak_val
    # crude circularity check: fraction of a circle of this radius, centered
    # here, that actually falls inside the mask
    yy, xx = np.ogrid[:mask.shape[0], :mask.shape[1]]
    circle = (xx - cx) ** 2 + (yy - cy) ** 2 <= radius ** 2
    circularity = float((circle & mask).sum() / max(circle.sum(), 1))
    return {
        "center": {"x": round(cx, 1), "y": round(cy, 1)},
        "estimatedRadiusPx": round(radius, 1),
        "circularity": round(circularity, 2),
        "note": "Heuristic candidate from the opaque mask's distance-transform peak (thickest point of the silhouette), not a verified anatomical detection. circularity is the fraction of a same-radius circle centered here that falls inside the product mask -- closer to 1.0 supports 'this is a round chestpiece-like region', not proof.",
    }


def analyze(path: str):
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    alpha = arr[:, :, 3]
    mask = alpha >= ALPHA_THRESHOLD
    h, w = mask.shape
    opaque_px = int(mask.sum())
    canvas_px = h * w

    bbox = tight_bbox(mask)
    axis = pca_axis(mask, alpha) if bbox else None
    holes = find_holes(mask)
    chestpiece = find_chestpiece_candidate(mask)

    margins = None
    if bbox:
        margins = {
            "top": round(100 * bbox["y"] / h, 1),
            "bottom": round(100 * (h - (bbox["y"] + bbox["height"])) / h, 1),
            "left": round(100 * bbox["x"] / w, 1),
            "right": round(100 * (w - (bbox["x"] + bbox["width"])) / w, 1),
        }

    def clamp_box(x: float, y: float, width: float, height: float) -> dict:
        """Clamps width/height to the canvas first, then re-clamps x/y so
        x+width<=canvas width and y+height<=canvas height -- clamping only
        width/height (the original bug here) can leave x+width or y+height
        slightly overshooting the canvas whenever the unclamped box was
        already near an edge, since x/y were never re-checked against the
        now-possibly-smaller box."""
        width = min(w, width)
        height = min(h, height)
        x = max(0, min(x, w - width))
        y = max(0, min(y, h - height))
        return {"x": round(x), "y": round(y), "width": round(width), "height": round(height)}

    crops = {}
    if bbox:
        margin_px = round(0.06 * max(bbox["width"], bbox["height"]))
        crops["fullProductHero"] = clamp_box(
            bbox["x"] - margin_px, bbox["y"] - margin_px,
            bbox["width"] + 2 * margin_px, bbox["height"] + 2 * margin_px,
        )
    if chestpiece:
        side = chestpiece["estimatedRadiusPx"] * 3.4
        cx, cy = chestpiece["center"]["x"], chestpiece["center"]["y"]
        crops["macroChestpieceDetail"] = clamp_box(cx - side / 2, cy - side / 2, side, side)

    critical_regions = []
    if chestpiece:
        critical_regions.append({
            "role": "chestpiece",
            "reason": "The chestpiece disc is the product's primary recognizable feature -- must not be cropped or covered by text/frame.",
            "approxCenter": chestpiece["center"],
            "approxRadiusPx": chestpiece["estimatedRadiusPx"],
        })

    return {
        "sourceFile": path.split("/")[-1].split("\\")[-1],
        "analysisMethod": "channels/kaduse-medikal/scripts/analyze_product_image.py (alpha-threshold=%d, real PIL/numpy/scipy computation, not a manual estimate)" % ALPHA_THRESHOLD,
        "canvas": {"width": w, "height": h},
        "alphaMask": {
            "opaquePx": opaque_px,
            "canvasPx": canvas_px,
            "pctOpaque": round(100 * opaque_px / canvas_px, 1),
        },
        "visiblePixelBounds": bbox,
        "negativeSpaceMarginsPct": margins,
        "dominantAxis": axis,
        "chestpieceCandidate": chestpiece,
        "openLoopRegions": holes,
        "criticalRegions": critical_regions,
        "suggestedCrops": crops,
    }


if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    result = analyze(src)
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print(json.dumps(result, indent=2, ensure_ascii=False))
