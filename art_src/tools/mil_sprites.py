import asyncio, base64, io, json, os
from playwright.async_api import async_playwright
from PIL import Image
OUT='/workspace/bloons-frontier/public/assets/military'; RAW='/workspace/bloons-frontier/art_src/military/render'
os.makedirs(RAW, exist_ok=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg = await b.new_page()
        pg.on('pageerror', lambda e: print('PAGEERR', str(e)[:300]))
        await pg.goto('http://localhost:5199/art_src/tools/mil_render/index.html?mode=sprites')
        await pg.wait_for_function('window.__done === true', timeout=240000)
        out = await pg.evaluate('window.__out'); meta = await pg.evaluate('window.__meta')
        await b.close()
    ims = {k: Image.open(io.BytesIO(base64.b64decode(v.split(',')[1]))).convert('RGBA') for k, v in out.items()}
    for kind in ('tank', 'heli'):
        for t in range(3):
            m = meta[f'{kind}_{t}']; fw, fh, n = m['fw'], m['fh'], m['n']
            sheet = Image.new('RGBA', (fw * 4, fh * 4))
            for i in range(n): sheet.paste(ims[f'{kind}_{t}_{i}'], ((i % 4) * fw, (i // 4) * fh))
            sheet.save(f'{OUT}/{kind}_{t}.webp', quality=88, method=6)
            ims[f'{kind}_{t}_14'].save(f'{RAW}/{kind}_{t}.png')
    for k, im in ims.items():
        if k.startswith('prop_'):
            im.save(f'{OUT}/{k}.webp', quality=90, method=6); im.save(f'{RAW}/{k}.png')
    json.dump(meta, open('/workspace/bloons-frontier/src/data/military.sprites.json', 'w'), indent=1)
    for f in sorted(os.listdir(OUT)):
        if f.endswith('.webp'): print(f, os.path.getsize(f'{OUT}/{f}'))
asyncio.run(main())
