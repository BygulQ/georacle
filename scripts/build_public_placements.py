import json
from pathlib import Path

PLACEMENT_SRC = Path('data/placements/v2')
FIGURE_NUMERIC_SRC = Path('data/figures/numeric-values.json')
OUT = Path('data/placements/public')
OUT.mkdir(parents=True, exist_ok=True)

PLACEMENT_KEEP = ('id', 'f', 'h', 'fav', 'unfav')
PRIVATE_NOTE_MARKERS = (
    'SRC-', 'supportType', 'page-verified', '逐頁', '來源', '非第',
    '直接逐宮', '同系統脈絡', '脈絡推論', '結構直載'
)
PRIVATE_PUBLIC_MARKERS = (
    'SRC-', 'supportType', 'page-verified', '逐頁核實', '來源明言',
    '無直接逐宮記載', '無第13宮直載', '無第14宮直載',
    '無第15宮直載', '無第16宮直載', '未找到可核實', '同系統火宮脈絡',
    '同系統風宮脈絡', '同系統水宮脈絡', '同系統土宮脈絡'
)


def public_core(row):
    """Project the existing interpretive statement without exposing audit/provenance wording."""
    text = str(row.get('core') or '').strip()
    status = str(row.get('status') or '')
    refs = row.get('refs') or []
    structural = any(ref.get('supportType') == 'direct-structural-constraint' for ref in refs if isinstance(ref, dict))

    if structural and text.startswith('來源明言') and '；' in text:
        text = text.split('；', 1)[1].strip()

    if status == 'page-verified-contextual-inference':
        if '只能保守推論：' in text:
            text = text.split('只能保守推論：', 1)[1].strip()
        elif '只能保守推定為' in text:
            text = text.split('只能保守推定為', 1)[1].strip()
        elif '。' in text and (text.startswith('無第') or text.startswith('未找到')):
            text = text.split('。', 1)[1].strip()

    replacements = (
        ('但原文也提及', '但也提及'),
        ('原文同時保留', '同時保留'),
        ('原文另保留', '另保留'),
        ('原文要求', '需'),
    )
    for source, target in replacements:
        text = text.replace(source, target)
    text = text.replace('原文', '').strip()
    return text


def public_conditions(row):
    """Keep interpretive conditions while excluding audit/provenance notes."""
    out = []
    for note in row.get('notes', []) or []:
        text = str(note or '').strip()
        if not text:
            continue
        if any(marker in text for marker in PRIVATE_NOTE_MARKERS):
            continue
        text = text.replace('原文', '').strip()
        if text and text not in out:
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
        public_row['core'] = public_core(row)
        public_row['conditions'] = public_conditions(row)
        row_id = public_row.get('id')
        if not row_id or row_id in public_ids:
            raise RuntimeError(f'Duplicate or missing public placement id in {path}: {row_id!r}')
        if not public_row.get('core'):
            raise RuntimeError(f'Missing public placement core in {path}: {row_id}')
        serialized = json.dumps(public_row, ensure_ascii=False)
        leaked = [marker for marker in PRIVATE_PUBLIC_MARKERS if marker in serialized]
        if leaked:
            raise RuntimeError(f'Private marker leaked into {row_id}: {leaked}')
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
