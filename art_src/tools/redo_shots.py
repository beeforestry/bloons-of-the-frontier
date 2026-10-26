import os, json
from PIL import Image, ImageDraw, ImageFont
R = 'screenshots/redo'; D = 'public/assets/v3'; M = json.load(open('src/render/art.manifest.json'))
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22); FS = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
except Exception: F = FS = ImageFont.load_default()
def sbs(before, after, out, title):
    a, b = Image.open(before).convert('RGB'), Image.open(after).convert('RGB')
    w, h = a.width, a.height; b = b.resize((w, h))
    s = Image.new('RGB', (w * 2 + 12, h + 44), (20, 22, 28)); s.paste(a, (0, 44)); s.paste(b, (w + 12, 44))
    d = ImageDraw.Draw(s); d.text((10, 10), 'BEFORE (old art)  —  ' + title, font=F, fill='#ffb3b3'); d.text((w + 22, 10), 'AFTER (v3 painted art + animation)', font=F, fill='#b3ffb8')
    s.save(out)
pairs = [('03_built_and_deployed', 'built_and_deployed'), ('07_wave_3_combat', 'wave3_combat'), ('08_bug_wave', 'bug_wave')]
for m, sub in [('garden', ''), ('jungle', 'jungle/')]:
    for f, n in pairs:
        bf, af = f'{R}/before/{sub}{f}.png', f'screenshots/{sub}{f}.png'
        if os.path.exists(bf) and os.path.exists(af): sbs(bf, af, f'{R}/before_after_{m}_{n}.png', f'{m}: {n}')
    for f in ['07_wave_3_combat', '07_wave_7_combat', '08_bug_wave']:
        p = f'screenshots/{sub}{f}.png'
        if os.path.exists(p):
            im = Image.open(p); im.save(f'{R}/midwave_{m}_{f[3:]}.png')
            # 2x zoom crop of the playfield centre to show sprite detail
            W, H = im.size; c = im.crop((int(W * .03), int(H * .12), int(W * .5), int(H * .6))); c = c.resize((c.width * 2, c.height * 2), Image.LANCZOS); c.save(f'{R}/midwave_{m}_{f[3:]}_zoom2x.png')
# ---- art sheet
groups = [
 ('Primates towers', ['dart_monkey', 'ninja_monkey', 'wizard_monkey', 'super_monkey', 'money_monkey'], 3),
 ('Flora towers', ['solar_pea_fusion', 'gatling_cherry_bomber', 'flame_melon_mortar', 'star_emperor', 'frost_wallnut_bastion'], 3),
 ('UNSC towers', ['unsc_autoturret', 'unsc_rail', 'unsc_firebase', 'unsc_depot'], 3),
 ('Units', ['marine', 'monkey_soldier', 'line_watch', 'farmhand'], 4),
]
cw, lw = 150, 230
def cell(key):
    if key in M: return Image.open(f'{D}/{key}.webp').convert('RGBA')
    return None
def turret(k, t):  # composite base + head the way the renderer draws it
    hk = {'unsc_autoturret': 'unsc_autoturret_head', 'unsc_rail': 'unsc_rail_head'}[k]
    b, h = cell(f'turret_base_{t}'), cell(f'{hk}_{t}')
    W = 320; c = Image.new('RGBA', (W, W)); bb = b.copy(); bb.thumbnail((int(W * .8),) * 2); c.paste(bb, ((W - bb.width) // 2, W - bb.height - 10), bb)
    hh = h.copy(); hh.thumbnail((int(W * .78),) * 2); c.paste(hh, (W // 2 - int(hh.width * .28), W - 10 - int(bb.height * .62) - hh.height // 2), hh); return c
rows = []
for title, ks, n in groups:
    rows.append(('#', title, None))
    for k in ks: rows.append((k, k, n))
enem = ['bloon_red', 'bloon_blue', 'bloon_green', 'bloon_yellow', 'bloon_pink', 'bloon_lead', 'bloon_ceramic', 'bloon_moab']
bugs = ['bug_scavenger', 'bug_hunter', 'bug_charger', 'bug_brood', 'bug_titan']
fx = [k for k in sorted(M) if k.startswith('fx_')] + ['drop_pod']
ncol = max(len(enem), len(fx) // 2 + 1)
hdr = 34; H = sum(hdr if r[0] == '#' else cw + 8 for r in rows) + 3 * (hdr + cw + 26) + (cw + 26) + 20
W = max(lw + 4 * cw, ncol * cw) + 20
S = Image.new('RGB', (W, H), (74, 96, 62)); d = ImageDraw.Draw(S); y = 10
def put(im, x, y, sz=cw - 10):
    im = im.copy(); im.thumbnail((sz, sz)); S.paste(im, (x + (cw - im.width) // 2, y + (cw - im.height) // 2), im)
for k, title, n in rows:
    if k == '#': d.text((10, y + 6), title, font=F, fill='#fff3b0'); y += hdr; continue
    d.text((10, y + cw // 2 - 10), title, font=FS, fill='white')
    for t in range(n):
        im = turret(k, t) if k in ('unsc_autoturret', 'unsc_rail') else cell(f'{k}_{t}')
        if im: put(im, lw + t * cw, y)
        d.text((lw + t * cw + 4, y + 2), f'T{t + 1}', font=FS, fill='#ffe14d')
    y += cw + 8
for title, ks in [('Bloons', enem), ('Bugs', bugs), ('Projectiles / FX / drop pod', fx[:ncol]), ('', fx[ncol:])]:
    if title: d.text((10, y + 6), title, font=F, fill='#fff3b0'); y += hdr
    for i, k in enumerate(ks):
        put(cell(k), 10 + i * cw, y); d.text((10 + i * cw + 4, y + cw - 4), k.replace('bloon_', '').replace('bug_', ''), font=FS, fill='white')
    y += cw + 26
S = S.crop((0, 0, W, y)); S.save(f'{R}/art_sheet.png'); print('ok', S.size)
