#!/usr/bin/env python3
"""Bake 6-frame walk sheets from full-res v3 unit sprites (t122).

A modest biped mesh-warp (leg swing + lift, body unchanged) is applied to each
idle sprite so the walk frames keep the original size, pivot and sharpness.
Does not overwrite public/assets/v3/<id>.webp.
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
V3 = ROOT / 'public/assets/v3'
OUT = V3 / 'walk'
N = 6

IDS = [
    'farmhand_0', 'farmhand_1',
    'line_watch_0', 'line_watch_1', 'line_watch_2', 'line_watch_3',
    'marine_0', 'marine_1', 'marine_2',
    'monkey_soldier_0', 'monkey_soldier_1', 'monkey_soldier_2',
    'odst_0', 'odst_1', 'odst_2',
    'paladin_0', 'paladin_1', 'paladin_2',
    'ranger_0', 'ranger_1', 'ranger_2',
    'spartan_0', 'spartan_1', 'spartan_2',
]

FAM = {
    'farmhand': dict(band=0.78, amp=0.11, lift=0.07),
    'monkey_soldier': dict(band=0.56, amp=0.11, lift=0.06),
    'paladin': dict(band=0.62, amp=0.09, lift=0.05),
    'ranger': dict(band=0.62, amp=0.09, lift=0.05),
    'line_watch': dict(band=0.60, amp=0.10, lift=0.055),
    'marine': dict(band=0.60, amp=0.10, lift=0.055),
    'odst': dict(band=0.60, amp=0.10, lift=0.055),
    'spartan': dict(band=0.60, amp=0.10, lift=0.055),
}

def family(uid: str) -> str:
    return uid.rsplit('_', 1)[0]

def _runs(hist: np.ndarray):
    xs = np.where(hist > 0)[0]
    if xs.size == 0:
        return []
    out, s = [], int(xs[0])
    for i in range(1, len(xs)):
        if xs[i] != xs[i - 1] + 1:
            out.append((s, int(xs[i - 1]), int(hist[s:xs[i - 1] + 1].sum())))
            s = int(xs[i])
    out.append((s, int(xs[-1]), int(hist[s:xs[-1] + 1].sum())))
    return out  # (start, end, mass)

def find_feet(alpha: np.ndarray) -> tuple[float, float]:
    H, W = alpha.shape
    max_w = max(28, int(W * 0.30))
    for k in (5, 8, 12, 16):
        hist = (alpha[max(0, H - k):] > 30).sum(axis=0)
        good = [(a, b, m) for a, b, m in _runs(hist) if 4 <= (b - a + 1) <= max_w]
        if len(good) >= 2:
            good.sort(key=lambda r: r[2], reverse=True)
            (a1, b1, _), (a2, b2, _) = good[0], good[1]
            return (a1 + b1) / 2.0, (a2 + b2) / 2.0
        if len(good) == 1:
            a, b, _ = good[0]
            if (b - a + 1) >= 12:
                return a + (b - a) * 0.30, a + (b - a) * 0.70
            # keep looking with a taller window for the other foot
            one = ((a + b) / 2.0, b - a + 1)
        else:
            one = None
    if one:
        c, w = one
        mid = (np.where(alpha[int(H * 0.6):] > 30)[1].mean() if (alpha[int(H * 0.6):] > 30).any() else W / 2)
        other = c + (16 if mid >= c else -16)
        return c, float(np.clip(other, 4, W - 5))
    # last resort: split lower bbox
    ys, xs = np.where(alpha[int(H * 0.62):] > 30)
    if xs.size:
        lo, hi = xs.min(), xs.max()
        return lo + (hi - lo) * 0.3, lo + (hi - lo) * 0.7
    return W * 0.35, W * 0.65

def foot_groups(alpha: np.ndarray) -> np.ndarray:
    H, W = alpha.shape
    c1, c2 = find_feet(alpha)
    left, right = (c1, c2) if c1 < c2 else (c2, c1)
    span = max(7.0, min((right - left) * 0.42, W * 0.14))
    xs = np.arange(W, dtype=np.float64)
    wl = np.exp(-0.5 * ((xs - left) / span) ** 2)
    wr = np.exp(-0.5 * ((xs - right) / span) ** 2)
    s = wl + wr
    grp = np.zeros(W, dtype=np.float64)
    m = s > 1e-5
    grp[m] = (wl[m] - wr[m]) / s[m] * np.minimum(1.0, s[m] * 1.4)
    return grp

def bilinear(src: np.ndarray, xs: np.ndarray, ys: np.ndarray) -> np.ndarray:
    H, W, _ = src.shape
    x0 = np.floor(xs).astype(np.int32)
    y0 = np.floor(ys).astype(np.int32)
    wx = (xs - x0)[..., None]
    wy = (ys - y0)[..., None]
    valid = (x0 >= 0) & (x0 + 1 < W) & (y0 >= 0) & (y0 + 1 < H)
    x0c = np.clip(x0, 0, W - 1); x1c = np.clip(x0 + 1, 0, W - 1)
    y0c = np.clip(y0, 0, H - 1); y1c = np.clip(y0 + 1, 0, H - 1)
    Ia = src[y0c, x0c].astype(np.float64)
    Ib = src[y0c, x1c].astype(np.float64)
    Ic = src[y1c, x0c].astype(np.float64)
    Id = src[y1c, x1c].astype(np.float64)
    out = Ia * (1 - wx) * (1 - wy) + Ib * wx * (1 - wy) + Ic * (1 - wx) * wy + Id * wx * wy
    out[~valid] = 0
    return out

def warp(src: np.ndarray, grp: np.ndarray, band: float, amp: float, lift: float, phase: float) -> np.ndarray:
    H, W, _ = src.shape
    y0 = int(H * band)
    A = W * amp * 1.15
    L = H * lift * 1.15
    s = np.sin(phase)
    co = np.cos(phase)
    yy, xx = np.mgrid[0:H, 0:W]
    t = np.zeros((H, W), dtype=np.float64)
    sl = max(1, H - y0)
    t[y0:] = np.power((np.arange(H - y0)[:, None] + 0.5) / sl, 1.25)
    g = grp[None, :]
    dx = s * g * A * t
    dy = np.maximum(0.0, co * g) * L * t
    out = bilinear(src, xx - dx, yy + dy)
    out[:y0] = src[:y0]
    blend = min(6, max(2, sl // 8))
    if y0 + blend < H:
        w = np.linspace(0, 1, blend)[:, None, None]
        out[y0:y0 + blend] = src[y0:y0 + blend] * (1 - w) + out[y0:y0 + blend] * w
    return out

def make(uid: str) -> Path:
    g = FAM[family(uid)]
    im = Image.open(V3 / f'{uid}.webp').convert('RGBA')
    src = np.array(im)
    grp = foot_groups(src[..., 3])
    frames = []
    for f in range(N):
        arr = warp(src, grp, g['band'], g['amp'], g['lift'], (f / N) * np.pi * 2)
        frames.append(Image.fromarray(np.clip(np.round(arr), 0, 255).astype(np.uint8), 'RGBA'))
    sheet = Image.new('RGBA', (im.width * N, im.height), (0, 0, 0, 0))
    for i, fr in enumerate(frames):
        sheet.paste(fr, (i * im.width, 0))
    OUT.mkdir(parents=True, exist_ok=True)
    dest = OUT / f'{uid}_walk.webp'
    sheet.save(dest, 'WEBP', lossless=True, method=6)
    return dest

if __name__ == '__main__':
    for uid in IDS:
        p = make(uid)
        print(f'wrote {p.relative_to(ROOT)} {Image.open(p).size}')
