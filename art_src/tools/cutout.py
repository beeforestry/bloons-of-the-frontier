"""Step 1: remove backgrounds from generated sheets (art_src/gen/*.jpg -> art_src/cut/*.png)."""
import os, sys, glob
import numpy as np
from PIL import Image
from rembg import remove, new_session
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.makedirs(f'{ROOT}/cut', exist_ok=True)
sess = new_session('isnet-general-use')
for f in sorted(glob.glob(f'{ROOT}/gen/*.jpg')):
    name = os.path.basename(f)[:-4]
    out = f'{ROOT}/cut/{name}.png'
    if os.path.exists(out) and '--force' not in sys.argv: continue
    im = Image.open(f).convert('RGB')
    if name == 'fx':  # glowing fx on black: luminance -> alpha (premultiplied-ish)
        a = np.asarray(im).astype(np.float32)
        lum = a.max(axis=2)
        alpha = np.clip((lum - 18) / 200, 0, 1) ** 0.8
        rgb = np.clip(a / np.maximum(alpha[..., None], 1e-3), 0, 255)
        o = np.dstack([rgb, alpha * 255]).astype(np.uint8)
        Image.fromarray(o, 'RGBA').save(out); print('fx', out); continue
    o = remove(im, session=sess, post_process_mask=True)
    o.save(out); print(name)
