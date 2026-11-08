"""Build the offline Indonesian description catalogue from public game text.

Only this maintenance script uses the translation service; the website never does.
Numbers, parameter markers, and quoted ability names are preserved verbatim.
"""
import concurrent.futures
import json
import pathlib
import re
import sys
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent
CACHE = ROOT / '.preview-equipment' / 'description-translations.json'
GLOSSARY = {
    'Outgoing Healing': 'pemulihan HP yang diberikan',
    'Energy Regeneration Rate': 'laju pemulihan energi',
    'Effect Hit Rate': 'peluang penerapan efek', 'Effect RES': 'ketahanan efek',
    'CRIT Rate': 'peluang CRIT', 'CRIT DMG': 'kerusakan CRIT',
    'Break Effect': 'efek Break', 'Weakness Break': 'Weakness Break',
    'Super Break DMG': 'kerusakan Super Break', 'Break DMG': 'kerusakan Break',
    'Basic ATK': 'serangan biasa', 'Skill Points': 'poin Skill', 'Skill Point': 'poin Skill',
    'Ultimate': 'Ultimate', 'Skill': 'Skill', 'Talent': 'Talent',
    'Memosprite': 'Memosprite', 'memosprite': 'memosprite',
    'follow-up attack': 'serangan lanjutan', 'follow-up attacks': 'serangan lanjutan',
    'DMG': 'kerusakan', 'ATK': 'ATK', 'DEF': 'DEF', 'HP': 'HP', 'SPD': 'SPD',
    'Energy': 'energi', 'DoT': 'kerusakan berkala', 'Toughness': 'ketahanan',
    'Trailblazer': 'Trailblazer', 'Eidolon': 'Eidolon', 'Superimposition': 'Superimposition',
}
OVERRIDES = {
    "Talent's SPD Boost is stackable and can stack up to 2 times. Additionally, after entering battle, Sushang immediately gains 1 stack of her Talent's SPD Boost.":
        'Peningkatan SPD dari Talent dapat ditumpuk hingga 2 kali. Saat memasuki pertempuran, Sushang langsung mendapat 1 tumpukan peningkatan SPD dari Talent.',
    "When Shifu is on the field, increases March 7th's SPD by 10%.":
        'Saat Shifu berada di arena, SPD March 7th meningkat sebesar 10%.',
    "Increases the wearer's CRIT Rate by #1[i]%. While the wearer is in battle, for every #2[i] SPD that exceeds 100, increases DMG dealt by Basic ATK and Skill by #3[i]%. At the same time, increases the CRIT DMG of Ultimate by #4[i]%. This effect can stack up to #5[i] time(s).":
        'Peluang CRIT pengguna meningkat sebesar #1[i]%. Saat bertarung, setiap #2[i] SPD di atas 100 meningkatkan kerusakan serangan biasa dan Skill sebesar #3[i]%, serta kerusakan CRIT Ultimate sebesar #4[i]%. Efek ini dapat ditumpuk hingga #5[i] kali.',
    "Increases the wearer's DMG to debuffed enemies by #1[i]%. When the wearer uses their Skill, the Effect Hit Rate for this attack increases by #2[i]%, and ATK increases by #3[i]%.":
        'Kerusakan pengguna terhadap musuh yang terkena efek pelemahan meningkat sebesar #1[i]%. Saat pengguna memakai Skill, peluang penerapan efek untuk serangan tersebut meningkat sebesar #2[i]% dan ATK meningkat sebesar #3[i]%.',
    "At the start of the battle, the wearer's CRIT Rate increases by #1[i]% for #2[i] turn(s).":
        'Saat pertempuran dimulai, peluang CRIT pengguna meningkat sebesar #1[i]% selama #2[i] giliran.',
    "When the wearer uses their Skill or Ultimate, their Outgoing Healing increases by #1[i]%.":
        'Saat pengguna memakai Skill atau Ultimate, pemulihan HP yang diberikannya meningkat sebesar #1[i]%.',
    "The wearer's Basic ATK and Skill deal #1[i]% more DMG.":
        'Kerusakan serangan biasa dan Skill pengguna meningkat sebesar #1[i]%.',
}


def read_constant(filename, name):
    source = (ROOT / filename).read_text(encoding='utf-8')
    start = re.search(r'\bconst\s+' + name + r'\s*=\s*', source).end()
    return json.JSONDecoder().raw_decode(source[start:])[0]


def sources():
    cones = read_constant('complete-gear-data.js', 'completeLightConeData')
    sets = read_constant('complete-gear-data.js', 'completeRelicSetData')
    ranks = read_constant('eidolon-data.js', 'eidolonCatalogue')
    texts = [cone['desc'] for cone in cones]
    texts += [desc for item in sets for desc in item['desc']]
    texts += [rank['desc'] for group in ranks.values() for rank in group]
    return list(dict.fromkeys(texts))


def translate(source):
    tokens = []
    def protect(match):
        tokens.append(GLOSSARY.get(match.group(), match.group()))
        return f'__HSR{len(tokens)-1:04d}__'
    terms = '|'.join(re.escape(word) for word in sorted(GLOSSARY, key=len, reverse=True))
    protected = re.sub(r'#[0-9]+\[(?:i|f\d*)\]%?|"[^"\n]+"|\d+(?:[.,]\d+)*%?|\b(?:' + terms + r')\b', protect, source)
    url = 'https://translate.googleapis.com/translate_a/single?' + urllib.parse.urlencode({
        'client': 'gtx', 'sl': 'en', 'tl': 'id', 'dt': 't', 'q': protected,
    })
    last = None
    for attempt in range(5):
        try:
            request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(request, timeout=35) as response:
                data = json.load(response)
            result = ''.join(part[0] for part in data[0] if part[0])
            for i, original in enumerate(tokens):
                marker = f'__HSR{i:04d}__'
                if marker not in result:
                    raise ValueError(f'Translation changed protected token {marker}')
                result = result.replace(marker, original)
            if re.findall(r'#[0-9]+\[(?:i|f\d*)\]%?', result) != re.findall(r'#[0-9]+\[(?:i|f\d*)\]%?', source):
                raise ValueError('Parameter markers changed')
            if sorted(re.findall(r'\d+(?:[.,]\d+)*%?', result)) != sorted(re.findall(r'\d+(?:[.,]\d+)*%?', source)):
                raise ValueError('Numeric values changed')
            return source, result
        except Exception as error:
            last = error
            if attempt < 4:
                time.sleep(2 * (attempt + 1))
    raise RuntimeError(f'{str(last)}: {source[:100]}')


def main():
    texts = sources()
    if '--sample' in sys.argv:
        for source in texts[:3]:
            print(json.dumps(translate(source), ensure_ascii=False), flush=True)
        return
    CACHE.parent.mkdir(exist_ok=True)
    cache = json.loads(CACHE.read_text(encoding='utf-8')) if CACHE.exists() else {}
    cache.update(OVERRIDES)
    pending = [text for text in texts if text not in cache]
    print(f'{len(texts)} unique descriptions; {len(pending)} remaining', flush=True)
    failures = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        futures = [pool.submit(translate, text) for text in pending]
        for count, future in enumerate(concurrent.futures.as_completed(futures), 1):
            try:
                source, result = future.result()
                cache[source] = result
            except Exception as error:
                failures.append(str(error))
                print(f'RETRY NEEDED: {error}', flush=True)
            if count % 15 == 0 or count == len(futures):
                CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding='utf-8')
                print(f'Completed {count}/{len(pending)}; cached {len(cache)}', flush=True)
    if failures:
        raise RuntimeError(f'{len(failures)} descriptions need retry; successful results cached')
    def polish(value):
        for old, new in [('pemakainya', 'pengguna'), ('putaran', 'giliran'), ('sekutu', 'rekan tim'), ('Penyembuhan Keluar', 'pemulihan HP yang diberikan')]:
            value = value.replace(old, new)
        return value
    pairs = [[source, polish(cache[source])] for source in texts]
    output = '// Offline Indonesian descriptions. Rebuild with build-description-translations.py.\n'
    output += 'globalThis.stellarDescriptionTranslations=' + json.dumps(pairs, ensure_ascii=False, separators=(',', ':')) + ';\n'
    (ROOT / 'description-translations.js').write_text(output, encoding='utf-8')
    print(f'Wrote {len(pairs)} verified description translations', flush=True)


if __name__ == '__main__':
    main()
