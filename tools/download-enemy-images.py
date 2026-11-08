import concurrent.futures, pathlib, re, urllib.request

root = pathlib.Path(__file__).resolve().parent.parent
media = (root / 'media.js').read_text(encoding='utf-8').split('const enemyImage=')[0]
ids = set(re.findall(r"['\"]\s*:\s*['\"]([0-9]+)['\"]", media))
ids.update(re.findall(r'"icon":"([0-9]+)"', (root / 'free-enemies-data.js').read_text(encoding='utf-8')))
ids.add('battleeventicon-monster_unknown')
ids.update(['4052020','2032040'])
ids.update(['8012020','8012030','8012010','1002020','2022051','5012020'])
ids.update(['4012020','4012040','3002030','2022020','3003010','3013010'])
ids.update(['4012010','4022010','1012030','4012030','4032010','4032020','4032030','4032040','4032050','4052010','2032010','2032020','2022040','2022050','1012010','1002030','1002050','2012010','2002030','3021030','3021020','3021040','4062010','4062020','8003010','8003020','3003040','3003030','5032010'])
destination = root / 'assets' / 'enemies'
destination.mkdir(parents=True, exist_ok=True)

def download(asset_id):
    filename = ('mostericon-monster_' + asset_id) if asset_id.isdigit() else asset_id
    target = destination / (filename + '.webp')
    if target.exists() and target.stat().st_size > 100:
        return asset_id, 'cached'
    base = 'https://www.gacha.gg'
    resource = '/img/honkai-star-rail/dm/monster/' + filename + '.webp'
    for url in [base + resource, base + '/_next/image?url=' + urllib.parse.quote(resource, safe='') + '&w=128&q=75']:
        try:
            request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(request, timeout=20) as response:
                data = response.read()
            if len(data) < 100 or data[:4] != b'RIFF' or data[8:12] != b'WEBP':
                raise ValueError('Not a WebP image')
            target.write_bytes(data)
            return asset_id, str(len(data)) + ' bytes'
        except Exception as error:
            last_error = str(error)
    return asset_id, 'FAILED: ' + last_error

with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    results = list(pool.map(download, sorted(ids)))
for asset_id, result in results:
    print(asset_id, result)
if any('FAILED:' in result for _, result in results):
    raise SystemExit(1)
