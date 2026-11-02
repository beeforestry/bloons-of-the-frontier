import sys, asyncio
from playwright.async_api import async_playwright
url, out = sys.argv[1], sys.argv[2]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width':1600,'height':700})
        pg.on('console', lambda m: print('CONSOLE', m.type, m.text[:300]) if m.type in ('error','warning') else None)
        pg.on('pageerror', lambda e: print('PAGEERR', str(e)[:300]))
        await pg.goto(url)
        await pg.wait_for_function('window.__done === true', timeout=30000)
        el = await pg.query_selector('canvas')
        await el.screenshot(path=out)
        await b.close()
asyncio.run(main())
