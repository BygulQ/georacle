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


paths = sorted(PLACEMENT_SRC.glob('h??-content-v1.json'))
if len(paths) != 16:
    raise RuntimeError(f'Expected 16 placement shards, found {len(paths)}')

public_ids = set()
public_count = 0
for path in paths:
    data = json.loads(path.read_text(encoding='utf-8'))
    rows = []
    for row in data.get('records', []):
        public_row = {key: row.get(key) for key in PLACEMENT_KEEP}
        public_row['conditions'] = public_conditions(row)
        row_id = public_row.get('id')
        if not row_id or row_id in public_ids:
            raise RuntimeError(f'Duplicate or missing public placement id in {path}: {row_id!r}')
        if not public_row.get('core'):
            raise RuntimeError(f'Missing public placement core in {path}: {row_id}')
        public_ids.add(row_id)
        public_count += 1
        rows.append(public_row)
    if len(rows) != 16:
        raise RuntimeError(f'Expected 16 placement rows in {path}, found {len(rows)}')
    public = {
        'v': data.get('v', '1.0'),
        'house': data.get('house'),
        'records': rows,
    }
    (OUT / path.name).write_text(
        json.dumps(public, ensure_ascii=False, separators=(',', ':')),
        encoding='utf-8',
    )

if public_count != 256:
    raise RuntimeError(f'Expected 256 public placements, found {public_count}')

numeric = json.loads(FIGURE_NUMERIC_SRC.read_text(encoding='utf-8'))
numeric_rows = numeric.get('figures', [])
if len(numeric_rows) != 16 or len({row.get('id') for row in numeric_rows}) != 16:
    raise RuntimeError('Expected 16 unique canonical figure numeric rows')

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
        for row in numeric_rows
    ],
}
(OUT / 'figure-numeric-v1.json').write_text(
    json.dumps(public_numeric, ensure_ascii=False, separators=(',', ':')),
    encoding='utf-8',
)
