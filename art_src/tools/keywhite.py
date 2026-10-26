"""White-background keying for prop sheets (rembg drops items on multi-object sheets)."""
import sys, os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for name in sys.argv[1:]:
    a = np.asarray(Image.open(f'{ROOT}/gen/{name}.jpg').convert('RGB')).astype(np.float32)
    dist = 255 - a.min(axis=2) + (a.max(axis=2) - a.min(axis=2))
    fg = dist > 28
    fg = ndimage.binary_opening(fg, iterations=1)
    fg = ndimage.binary_fill_holes(fg)
    lab, n = ndimage.label(fg); sz = ndimage.sum(fg, lab, range(1, n + 1))
    fg = np.isin(lab, [i + 1 for i, s in enumerate(sz) if s > 60])
    fg = ndimage.binary_erosion(fg, iterations=1)
    al = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1))
    soft = np.clip(dist / 60, 0, 1)  # soften fringe
    al = (np.asarray(al).astype(np.float32) * np.where(fg, 1, soft)).astype(np.uint8)
    Image.fromarray(np.dstack([a.astype(np.uint8), al]), 'RGBA').save(f'{ROOT}/cut/{name}.png'); print(name)
