"""Fetch OpenStreetMap layout data for the playable maps from the Overpass API and cache the raw JSON.
Data (c) OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright).
  python3 tools/osm/fetch_osm.py            # fetch both maps (skips maps already cached)
  python3 tools/osm/fetch_osm.py --force    # refetch
Output: data/osm/raw/<map>.json (Overpass JSON, `out geom`: ways with node coordinates, multipolygon relations with member geometry), data/osm/raw/<map>.meta.json (bbox, endpoint, timestamp)."""
import json, os, sys, time, urllib.parse, urllib.request
sys.path.insert(0, os.path.dirname(__file__))
from frames import FRAMES, window_bbox

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
RAW = os.path.join(ROOT, 'data', 'osm', 'raw')
ENDPOINTS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter',
             'https://overpass.private.coffee/api/interpreter']
QUERY = """[out:json][timeout:120];
(
  way["building"]({b});
  way["building:part"]({b});
  way["highway"]({b});
  way["natural"]({b});
  way["water"]({b}); way["waterway"]({b});
  way["leisure"]({b});
  way["landuse"]({b});
  way["historic"]({b});
  way["barrier"]({b});
  way["man_made"]({b});
  way["place"]({b});
  way["amenity"="parking"]({b});
  way["tourism"]({b});
  relation["type"="multipolygon"]["building"]({b});
  relation["type"="multipolygon"]["leisure"]({b});
  relation["type"="multipolygon"]["landuse"]({b});
  relation["type"="multipolygon"]["historic"]({b});
  relation["type"="multipolygon"]["tourism"]({b});
  relation["type"="multipolygon"]["natural"~"^(water|wood|scrub|grassland|beach|sand|bare_rock|wetland)$"]({b});
);
out geom;"""
# `out geom` (body verbosity) keeps relation members with their way geometry, so multipolygon buildings (Cuartel de
# Ballajá, La Fortaleza, ...) assemble into rings. Island / place / boundary relations are left out: they are huge.


def fetch(mid, force=False):
    out = os.path.join(RAW, f'{mid}.json')
    if os.path.exists(out) and not force: print(mid, 'cached', out); return
    s, w, n, e = window_bbox(mid)
    q = QUERY.replace('{b}', f'{s:.6f},{w:.6f},{n:.6f},{e:.6f}')
    last = None
    for ep in ENDPOINTS * 3:  # public Overpass instances are often busy: cycle through them a few times
        try:
            req = urllib.request.Request(ep, data=urllib.parse.urlencode({'data': q}).encode(),
                                         headers={'User-Agent': 'balloons-of-the-frontier-osm-tools/1.0'})
            body = urllib.request.urlopen(req, timeout=180).read()
            d = json.loads(body)
            os.makedirs(RAW, exist_ok=True)
            json.dump(d, open(out, 'w'), separators=(',', ':'))
            json.dump(dict(map=mid, bbox_swne=[s, w, n, e], endpoint=ep, fetched=time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
                           osm_base=d.get('osm3s', {}).get('timestamp_osm_base'), elements=len(d['elements']),
                           license='(c) OpenStreetMap contributors, ODbL 1.0', query=q), open(os.path.join(RAW, f'{mid}.meta.json'), 'w'), indent=1)
            print(mid, len(d['elements']), 'elements from', ep, f'{len(body) // 1024} KB'); return
        except Exception as ex:
            last = ex; print('  ', ep, 'failed:', ex); time.sleep(20)
    raise SystemExit(f'all Overpass endpoints failed: {last}')


if __name__ == '__main__':
    for m in FRAMES: fetch(m, '--force' in sys.argv)
