import json
from pathlib import Path

src = Path('data/placements/v2')
out = Path('data/placements/public')
out.mkdir(parents=True, exist_ok=True)
keep = ('id', 'f', 'h', 'core', 'fav', 'unfav')
for path in src.glob('h??-content-v1.json'):
    data = json.loads(path.read_text(encoding='utf-8'))
    rows = [{k: row.get(k) for k in keep} for row in data.get('records', [])]
    public = {'v': data.get('v', '1.0'), 'house': data.get('house'), 'records': rows}
    (out / path.name).write_text(json.dumps(public, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
