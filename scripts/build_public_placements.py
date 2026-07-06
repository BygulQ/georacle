import json
from pathlib import Path

PLACEMENT_SRC = Path('data/placements/v2')
FIGURE_NUMERIC_SRC = Path('data/figures/numeric-values.json')
OUT = Path('data/placements/public')
OUT.mkdir(parents=True, exist_ok=True)

PLACEMENT_KEEP = ('id', 'f', 'h', 'core', 'fav', 'unfav')
PRIVATE_NOTE_MARKERS = (
    'SRC-', 'supportType', 'page-verified', '逐頁', '來源', '非第',
    '直接逐宮', '同系統脈絡', '脈絡推論', '結構直載'
)


def public_conditions(row):
    """Keep exact interpretive conditions while excluding audit/provenance notes."""
    out = []
    for note in row.get('notes', []) or []:
        text = str(note or '').strip()
        if not text:
            continue
        if any(marker in text for marker in PRIVATE_NOTE_MARKERS):
            continue
        if text not in out:
            out.append(text)
    return out


for path in sorted(PLACEMENT_SRC.glob('h??-content-v1.json')):
    data = json.loads(path.read_text(encoding='utf-8'))
    rows = []
    for row in data.get('records', []):
        public_row = {key: row.get(key) for key in PLACEMENT_KEEP}
        public_row['conditions'] = public_conditions(row)
        rows.append(public_row)
    public = {
        'v': data.get('v', '1.0'),
        'house': data.get('house'),
        'records': rows,
    }
    (OUT / path.name).write_text(
        json.dumps(public, ensure_ascii=False, separators=(',', ':')),
        encoding='utf-8',
    )

numeric = json.loads(FIGURE_NUMERIC_SRC.read_text(encoding='utf-8'))
public_numeric = {
    'schemaVersion': 'placement-figure-numeric-public-v1',
    'figures': [
        {
            'id': row.get('id'),
            'triangular': row.get('triangular'),
            'abjad': {
                'openOnly': (row.get('abjad') or {}).get('openOnly'),
                'weightedAll': (row.get('abjad') or {}).get('weightedAll'),
            },
            'abdah': row.get('abdah'),
            'bazdah': row.get('bazdah'),
            'physicalDots': row.get('physicalDots'),
        }
        for row in numeric.get('figures', [])
    ],
}
(OUT / 'figure-numeric-v1.json').write_text(
    json.dumps(public_numeric, ensure_ascii=False, separators=(',', ':')),
    encoding='utf-8',
)
