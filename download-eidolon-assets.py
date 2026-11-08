"""Prepare the bundled StarRailRes Eidolon catalogue and its original icons."""
import concurrent.futures
import json
from pathlib import Path
import re
import urllib.request

root = Path(__file__).resolve().parent
records = json.loads((root / 'assets/character-ranks.json').read_text(encoding='utf-8-sig'))
ids = re.findall(r"['\"](\d{4})['\"]\s*:", (root / 'character-bases.js').read_text(encoding='utf-8'))
catalogue = {}
for cid in ids:
    catalogue[cid] = []
    for level in range(1, 7):
        record = records[cid + '0' + str(level)]
        catalogue[cid].append({key: record[key] for key in ('rank', 'name', 'desc', 'icon')})
(root / 'eidolon-data.js').write_text(
    "// Source: https://github.com/Mar-7th/StarRailRes (index_new/en/character_ranks.json).\n"
    "// Bundled for offline viewing; descriptions retain the source English text.\n"
    'const eidolonCatalogue = ' + json.dumps(catalogue, ensure_ascii=True, separators=(',', ':')) + ';\n', encoding='utf-8')
paths = sorted({r['icon'] for ranks in catalogue.values() for r in ranks})
def download(path):
    target = root / 'assets/eidolons' / Path(path).name
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists() and target.stat().st_size > 0:
        return
    for attempt in range(3):
        try:
            with urllib.request.urlopen('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/' + path, timeout=30) as response:
                data = response.read()
            if not data.startswith(b'\x89PNG\r\n\x1a\n'):
                raise ValueError('Not a PNG: ' + path)
            target.write_bytes(data)
            return
        except Exception:
            if attempt == 2:
                raise
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
    list(pool.map(download, paths))
print(f'Prepared {len(catalogue)} characters, {sum(map(len, catalogue.values()))} Eidolons, {len(paths)} original icons.')
