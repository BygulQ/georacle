const FIELD={1:'本人狀態、身體、意圖與事情開端',2:'資源、財物、持有與交易',3:'消息、近人、交流與短程移動',4:'家宅、土地、父母與根基',5:'子女、懷孕、情愛、喜悅與延續',6:'疾病、受困、服務與失物',7:'伴侶、合作、對手與他者',8:'危機、遺產與他人資源',9:'遠行、信仰、學習與夢境',10:'權威、職位、事業與名聲',11:'希望、朋友、盟友與援助',12:'長期壓力、受限與隱性困局',13:'問卜者一側的見證、目的與現況',14:'被問者、目標或他方一側的見證',15:'兩側見證的衡量、平衡與裁決',16:'裁決之後的最終落點'};
const ROLE={13:'第十三宮：讀問卜者一側的狀態、目的與現況。',14:'第十四宮：讀目標、客體或他方一側的狀態。',15:'第十五宮：衡量兩側見證並形成裁決。',16:'第十六宮：讀裁決之後的最終落點。'};
const Q={1:['本人狀態','事情開端'],2:['財務與交易','資源是否留得住'],3:['消息與溝通','近人互動'],4:['家宅與土地','根基是否穩定'],5:['情愛與喜悅','子女／懷孕'],6:['健康與受困','工作服務／失物'],7:['伴侶與合作','對手與爭端'],8:['危機與風險','遺產／他人資源'],9:['遠行與遷移','學習／信仰／夢境'],10:['事業與職位','名聲／權威'],11:['希望能否實現','朋友／盟友援助'],12:['隱藏敵對','長期壓力與受限'],13:['問卜者真正狀態','問卜者內在目的'],14:['被問者／目標狀態','他方傾向'],15:['兩側如何定調','裁決傾向'],16:['最後會落在哪裡','結果之結果']};
const ROMAN=['','Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ','Ⅺ','Ⅻ','ⅩⅢ','ⅩⅣ','ⅩⅤ','ⅩⅥ'];
const ORDINAL=['','第一宮','第二宮','第三宮','第四宮','第五宮','第六宮','第七宮','第八宮','第九宮','第十宮','第十一宮','第十二宮','第十三宮','第十四宮','第十五宮','第十六宮'];
const ELEMENT={fire:'火',air:'風',water:'水',earth:'土',火:'火',風:'風',水:'水',土:'土'};
const $=s=>document.querySelector(s);
const arr=v=>Array.isArray(v)?v:(v==null?[]:[v]);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));

function list(v){return arr(v).map(x=>String(x??'').trim()).filter(Boolean)}
function tags(v,empty){const a=list(v);return a.length?`<div class="tags">${a.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div>`:`<p class="empty">${esc(empty)}</p>`}
function roman(n){return ROMAN[Number(n)]||String(n)}
function ordinal(n){return ORDINAL[Number(n)]||`第${n}宮`}
function elementLabel(v){return ELEMENT[String(v??'').toLowerCase()]||v||'—'}
function dotFigure(code){const rows=String(code||'').split('');return `<div class="dot-figure" aria-label="卦象點圖">${rows.map(x=>`<div class="dot-row">${Array.from({length:Number(x)||1},()=>'<i></i>').join('')}</div>`).join('')}</div>`}
function sectionHead(index,title){return `<div class="section-heading"><span class="section-index">${esc(index)}</span><h2>${esc(title)}</h2></div>`}

function render({f,h,figures,houses,p}){
  const label=ordinal(h.number);
  const houseRoman=roman(h.number);
  const field=FIELD[h.number]||label;
  const nature=list(f.minimalCore).join('、')||f.zhName;
  const questions=Q[h.number]||['目前如何發展','應優先注意什麼'];
  const conditions=list(p.conditions);
  const el=elementLabel(h.element);

  document.title=`${f.zhName} × ${label}｜落宮之書`;
  $('#app').innerHTML=`
  <form class="search" id="search">
    <label class="search-slot"><span class="slot-label">卦象</span><select id="sf">${figures.map(x=>`<option value="${esc(x.id)}" ${x.id===f.id?'selected':''}>${esc(x.zhName)} · ${esc(x.latinName||'')} · ${esc(x.dotCode||'')}</option>`).join('')}</select></label>
    <div class="times">×</div>
    <label class="search-slot"><span class="slot-label">宮位</span><select id="sh">${houses.map(x=>`<option value="${esc(x.id)}" ${x.id===h.id?'selected':''}>${esc(roman(x.number))} · ${esc(ordinal(x.number))}</option>`).join('')}</select></label>
    <button class="go">重新判讀</button>
  </form>

  <section class="hero placement-hero">
    <div class="hero-topline"><span>PLACEMENT READING</span><span class="hero-pair">${esc(f.zhName)} × ${esc(houseRoman)}</span><span>${esc(label)}</span></div>
    <div class="hero-shell">
      <div class="hero-wing figure-wing">
        <div class="hero-kicker">FIGURE</div>
        <div class="hero-name">${esc(f.zhName)}</div>
        <div class="hero-latin">${esc(f.latinName||'')} · ${esc(f.dotCode||'')}</div>
        ${dotFigure(f.dotCode)}
      </div>
      <div class="hero-network" aria-hidden="true"><div class="network-cross">×</div></div>
      <div class="hero-wing house-wing">
        <div class="hero-kicker">POSITION</div>
        <div class="house-roman">${esc(houseRoman)}</div>
        <div class="house-ordinal">${esc(label)}</div>
        <div class="house-element">${esc(el)}</div>
      </div>
    </div>
    <div class="hero-result">
      <div class="result-label">落宮結論</div>
      <p class="summary">${esc(p.core||'')}</p>
    </div>
  </section>

  <section class="section">
    ${sectionHead('01','核心判讀')}
    <div class="core-grid">
      <article class="card reading-primary"><h3>正式落宮內容</h3><p>${esc(p.core||'')}</p></article>
      <article class="card nature-card"><h3>卦象本性</h3>${tags(f.minimalCore,'目前沒有獨立公開標註')}</article>
    </div>
  </section>

  <section class="section">
    ${sectionHead('02','表現方向')}
    <div class="direction-grid">
      <article class="card direction-card good"><h3>有利表現</h3>${tags(p.fav,'本格沒有獨立有利標註')}</article>
      <article class="card direction-card mid"><h3>判讀條件</h3>${tags(conditions,'本格沒有額外公開條件註記')}</article>
      <article class="card direction-card bad"><h3>不利表現</h3>${tags(p.unfav,'本格沒有獨立不利標註')}</article>
    </div>
  </section>

  <section class="section">
    ${sectionHead('03','為什麼這樣讀')}
    <div class="formula">
      <div class="box"><div class="step-label">FIGURE</div><b>${esc(f.zhName)}</b><span>${esc(nature)}</span></div>
      <div class="op">×</div>
      <div class="box"><div class="step-label">POSITION</div><b>${esc(houseRoman)} · ${esc(label)}</b><span>${esc(field)}</span></div>
      <div class="op">=</div>
      <div class="box result-box"><div class="step-label">PLACEMENT</div><b>落宮內容</b><span>${esc(p.core||'')}</span></div>
    </div>
  </section>

  <section class="section">
    ${sectionHead('04','實務問題入口')}
    <div class="questions-grid">
      <article class="card question-card" data-index="01"><h3>${esc(questions[0])}</h3><p>${esc(p.core||'')}</p></article>
      <article class="card question-card" data-index="02"><h3>${esc(questions[1])}</h3><div class="question-evidence"><b>有利記載</b>${tags(p.fav,'沒有獨立有利標註')}<b>不利記載</b>${tags(p.unfav,'沒有獨立不利標註')}</div></article>
    </div>
  </section>

  <section class="section">
    ${sectionHead('05','判讀註記')}
    <article class="card note-card"><h3>READING NOTE</h3><div>${conditions.length?tags(conditions,''): '<p class="empty">本格沒有額外公開條件註記。</p>'}</div></article>
  </section>

  ${h.number>=13?`<section class="section">${sectionHead('06','裁決結構角色')}<article class="card special"><h3>${esc(houseRoman)} · ${esc(label)}</h3><p>${esc(ROLE[h.number]||'')}</p></article></section>`:''}`;

  $('#search').addEventListener('submit',e=>{
    e.preventDefault();
    location.href=`./placement.html?figure=${encodeURIComponent($('#sf').value)}&house=${encodeURIComponent($('#sh').value)}`;
  });
}

async function load(){
  try{
    const q=new URLSearchParams(location.search);
    const fid=q.get('figure');
    const hid=q.get('house');
    if(!fid||!hid) throw new Error('缺少卦象或宮位參數');

    const [figureResponse,manifestResponse]=await Promise.all([
      fetch('./data/figures/public-index.json',{cache:'no-store'}),
      fetch('./data/placements/public/manifest.json',{cache:'no-store'})
    ]);
    if(!figureResponse.ok||!manifestResponse.ok) throw new Error('公開資料讀取失敗');

    const [figures,manifest]=await Promise.all([figureResponse.json(),manifestResponse.json()]);
    if(!Array.isArray(manifest.houses)||manifest.houses.length!==16) throw new Error('宮位資料不完整');

    const f=figures.find(x=>x.id===fid);
    const h=manifest.houses.find(x=>x.id===hid||String(x.number)===String(hid).replace(/\D/g,''));
    if(!f||!h) throw new Error('找不到卦象或宮位');

    const shardResponse=await fetch(h.shard,{cache:'no-store'});
    if(!shardResponse.ok) throw new Error('落宮內容讀取失敗');
    const shard=await shardResponse.json();
    const p=arr(shard.records).find(x=>x.f===fid&&Number(x.h)===Number(h.number));
    if(!p) throw new Error('找不到此落宮組合');

    render({f,h,figures,houses:manifest.houses,p});
  }catch(error){
    $('#app').innerHTML=`<div class="loading">讀取失敗：${esc(error.message||error)}</div>`;
  }
}

load();
