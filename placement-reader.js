const FIELD={1:'本人狀態、身體、意圖與事情開端',2:'資源、財物、持有與交易',3:'消息、近人、交流與短程移動',4:'家宅、土地、父母與根基',5:'子女、懷孕、情愛、喜悅與延續',6:'疾病、受困、服務與失物',7:'伴侶、合作、對手與他者',8:'危機、遺產與他人資源',9:'遠行、信仰、學習與夢境',10:'權威、職位、事業與名聲',11:'希望、朋友、盟友與援助',12:'長期壓力、受限與隱性困局',13:'問卜者一側的見證、目的與現況',14:'被問者、目標或他方一側的見證',15:'兩側見證的衡量、平衡與裁決',16:'裁決之後的最終落點'};
const ROLE={13:'第十三宮：讀問卜者一側的狀態、目的與現況。',14:'第十四宮：讀目標、客體或他方一側的狀態。',15:'第十五宮：衡量兩側見證並形成裁決。',16:'第十六宮：讀裁決之後的最終落點。'};
const Q={1:['本人狀態','事情開端'],2:['財務與交易','資源是否留得住'],3:['消息與溝通','近人互動'],4:['家宅與土地','根基是否穩定'],5:['情愛與喜悅','子女／懷孕'],6:['健康與受困','工作服務／失物'],7:['伴侶與合作','對手與爭端'],8:['危機與風險','遺產／他人資源'],9:['遠行與遷移','學習／信仰／夢境'],10:['事業與職位','名聲／權威'],11:['希望能否實現','朋友／盟友援助'],12:['隱藏敵對','長期壓力與受限'],13:['問卜者真正狀態','問卜者內在目的'],14:['被問者／目標狀態','他方傾向'],15:['兩側如何定調','裁決傾向'],16:['最後會落在哪裡','結果之結果']};
const ROMAN=['','Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ','Ⅺ','Ⅻ','ⅩⅢ','ⅩⅣ','ⅩⅤ','ⅩⅥ'];
const ORDINAL=['','第一宮','第二宮','第三宮','第四宮','第五宮','第六宮','第七宮','第八宮','第九宮','第十宮','第十一宮','第十二宮','第十三宮','第十四宮','第十五宮','第十六宮'];
const ELEMENT={fire:'火',air:'風',water:'水',earth:'土',火:'火',風:'風',水:'水',土:'土'};
const $=s=>document.querySelector(s),arr=v=>Array.isArray(v)?v:(v==null?[]:[v]),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
function tags(v,empty){const a=arr(v).filter(Boolean);return a.length?`<div class="tags">${a.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div>`:`<p class="empty">${esc(empty)}</p>`}
function trend(p){const a=arr(p.fav),b=arr(p.unfav);if(a.length&&b.length)return{title:'機會與風險並存',text:`這個落宮同時出現有利與不利訊號。${a[0]?`主要推力是「${a[0]}」；`:''}${b[0]?`主要阻力是「${b[0]}」。`:''}關鍵不在單看吉凶，而在能否讓有利因素真正留下來。`};if(a.length)return{title:'整體偏向推進',text:`目前較強的方向是「${a[0]}」。這個組合有形成成果的條件，但仍要觀察成果是否能持續。`};if(b.length)return{title:'整體偏向受阻',text:`目前最需要注意的是「${b[0]}」。此格宜先處理阻力，再談擴張或推進。`};return{title:'結果尚未定型',text:'此格沒有單一強勢方向，需結合其他位置觀察事情如何收束。'}}
function conditionItems(p){const a=arr(p.fav),b=arr(p.unfav),out=[];if(a[0]&&b[0])out.push(`當「${a[0]}」能被穩定承接時，局勢偏向有利；若承接失敗，容易轉成「${b[0]}」。`);else if(a[0])out.push(`有利方向成立的前提，是「${a[0]}」能持續而不是只出現一次。`);else if(b[0])out.push(`若「${b[0]}」持續擴大，事情會進一步受阻。`);if(a[1])out.push(`第二個推力是「${a[1]}」，可作為改善局勢的補充條件。`);if(b[1])out.push(`第二個風險是「${b[1]}」，容易讓原本的問題擴散。`);if(!out.length)out.push('此格需結合全盤其他位置，才能判斷最後偏向。');return out}
function noteText(p){const a=arr(p.fav),b=arr(p.unfav);if(a.length&&b.length)return`本格不能只按單一吉凶判讀。${a[0]?`有利面以「${a[0]}」為主；`:''}${b[0]?`風險面以「${b[0]}」為主。`:''}應優先看哪一方在全盤中得到更多支持。`;if(a.length)return`本格整體偏向有利，但仍要確認「${a[0]}」是否能持續，避免短暫出現後迅速回落。`;if(b.length)return`本格風險較集中，應先處理「${b[0]}」，再判斷是否有逆轉空間。`;return'本格方向尚未充分定型，需與其他宮位交叉確認。'}
function roman(n){return ROMAN[Number(n)]||String(n)}
function ordinal(n){return ORDINAL[Number(n)]||`第${n}宮`}
function elementLabel(v){return ELEMENT[String(v??'').toLowerCase()]||v||'—'}
function dotFigure(code){const rows=String(code||'').split('');return `<div class="dot-figure" aria-label="卦象點圖">${rows.map(x=>`<div class="dot-row">${Array.from({length:Number(x)||1},()=>'<i></i>').join('')}</div>`).join('')}</div>`}
function meshSvg(){return `<svg class="network-svg" viewBox="0 0 720 420" preserveAspectRatio="none" aria-hidden="true"><path class="mesh" d="M40 90L180 30L360 80L540 30L680 90M40 210L180 150L360 210L540 150L680 210M40 330L180 270L360 340L540 270L680 330M180 30L180 270M360 80L360 340M540 30L540 270M40 90L40 330M680 90L680 330"/><path class="route-soft" d="M40 330L180 150L360 80L540 150L680 330M40 90L180 270L360 210L540 270L680 90"/><path class="route" d="M86 210L260 210L360 168L460 210L634 210M360 80L360 340"/><circle class="node-soft" cx="86" cy="210" r="5"/><circle class="node-soft" cx="634" cy="210" r="5"/><circle class="node-soft" cx="360" cy="80" r="5"/><circle class="node" cx="360" cy="168" r="7"/><circle class="node" cx="360" cy="340" r="7"/></svg>`}
function sectionHead(index,title){return `<div class="section-heading"><span class="section-index">${esc(index)}</span><h2>${esc(title)}</h2></div>`}
function render({f,h,figures,houses,p}){
  const label=ordinal(h.number),houseRoman=roman(h.number),field=FIELD[h.number]||label,nature=arr(f.minimalCore).join('、')||f.zhName,q=Q[h.number]||['目前如何發展','應優先注意什麼'],focus=arr(p.fav)[0]||arr(p.unfav)[0]||'整體發展',risk=arr(p.unfav)[0]||'目前沒有獨立風險標註',t=trend(p),conds=conditionItems(p),note=noteText(p),el=elementLabel(h.element);
  document.title=`${f.zhName} × ${label}｜落宮之書`;
  $('#app').innerHTML=`
  <form class="search" id="search">
    <label class="search-slot"><span class="slot-label">卦象</span><select id="sf">${figures.map(x=>`<option value="${esc(x.id)}" ${x.id===f.id?'selected':''}>${esc(x.zhName)} · ${esc(x.latinName||'')} · ${esc(x.dotCode||'')}</option>`).join('')}</select></label>
    <div class="times">×</div>
    <label class="search-slot"><span class="slot-label">宮位</span><select id="sh">${houses.map(x=>`<option value="${esc(x.id)}" ${x.id===h.id?'selected':''}>${esc(roman(x.number))} · ${esc(ordinal(x.number))}</option>`).join('')}</select></label>
    <button class="go">重新判讀</button>
  </form>

  <section class="hero placement-hero">
    <div class="hero-topline"><span>PLACEMENT ATLAS</span><span class="hero-pair">${esc(f.zhName)} × ${esc(houseRoman)}</span><span>${esc(label)}</span></div>
    <div class="hero-shell">
      <div class="hero-wing figure-wing">
        <div class="hero-kicker">FIGURE</div>
        <div class="hero-name">${esc(f.zhName)}</div>
        <div class="hero-latin">${esc(f.latinName||'')} · ${esc(f.dotCode||'')}</div>
        ${dotFigure(f.dotCode)}
      </div>
      <div class="hero-network">
        ${meshSvg()}
        <span class="network-label top">${esc(f.zhName)}</span>
        <span class="network-label left">${esc(el)}</span>
        <span class="network-label right">${esc(houseRoman)}</span>
        <span class="network-label bottom">落宮結果</span>
        <div class="network-cross">×</div>
      </div>
      <div class="hero-wing house-wing">
        <div class="hero-kicker">POSITION</div>
        <div class="house-roman">${esc(houseRoman)}</div>
        <div class="house-ordinal">${esc(label)}</div>
        <div class="house-element">${esc(el)}</div>
      </div>
    </div>
    <div class="hero-result">
      <div class="result-label">PLACEMENT READING</div>
      <p class="summary">${esc(p.core||'')}</p>
    </div>
  </section>

  <section class="section">
    ${sectionHead('01','核心判讀')}
    <div class="core-grid">
      <article class="card reading-primary"><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></article>
      <article class="card nature-card"><h3>直接表現</h3>${tags(f.minimalCore,'目前沒有獨立標註')}</article>
    </div>
  </section>

  <section class="section">
    ${sectionHead('02','表現方向')}
    <div class="direction-grid">
      <article class="card direction-card good"><h3>有利表現</h3>${tags(p.fav,'本格沒有獨立有利標註')}</article>
      <article class="card direction-card mid"><h3>條件表現</h3>${tags(conds,'需結合全盤')}</article>
      <article class="card direction-card bad"><h3>陰影表現</h3>${tags(p.unfav,'本格沒有獨立風險標註')}</article>
    </div>
  </section>

  <section class="section">
    ${sectionHead('03','為什麼這樣讀')}
    <div class="formula">
      <div class="box"><div class="step-label">FIGURE</div><b>${esc(f.zhName)}</b><span>${esc(nature)}</span></div>
      <div class="op">×</div>
      <div class="box"><div class="step-label">POSITION</div><b>${esc(houseRoman)} · ${esc(label)}</b><span>${esc(field)}</span></div>
      <div class="op">=</div>
      <div class="box result-box"><div class="step-label">PLACEMENT</div><b>落宮表現</b><span>${esc(p.core||'')}</span></div>
    </div>
  </section>

  <section class="section">
    ${sectionHead('04','實務問題入口')}
    <div class="questions-grid">
      <article class="card question-card" data-index="01"><h3>${esc(q[0])}</h3><p>${esc(p.core||'')}</p><p>優先觀察：${esc(focus)}</p></article>
      <article class="card question-card" data-index="02"><h3>${esc(q[1])}</h3><p>${esc(risk)}</p><p>請與全盤其他位置交叉確認。</p></article>
    </div>
  </section>

  <section class="section">
    ${sectionHead('05','判讀註記')}
    <article class="card note-card"><h3>READING NOTE</h3><p>${esc(note)}</p></article>
  </section>

  ${h.number>=13?`<section class="section">${sectionHead('06','裁決結構角色')}<article class="card special"><h3>${esc(houseRoman)} · ${esc(label)}</h3><p>${esc(ROLE[h.number]||'')}</p></article></section>`:''}`;
  $('#search').addEventListener('submit',e=>{e.preventDefault();location.href=`./placement.html?figure=${encodeURIComponent($('#sf').value)}&house=${encodeURIComponent($('#sh').value)}`})
}
async function load(){try{const q=new URLSearchParams(location.search),fid=q.get('figure'),hid=q.get('house');if(!fid||!hid)throw new Error('缺少卦象或宮位參數');const[fr,mr]=await Promise.all([fetch('./data/figures/public-index.json',{cache:'no-store'}),fetch('./data/placements/public/manifest.json',{cache:'no-store'})]);if(!fr.ok||!mr.ok)throw new Error('公開資料讀取失敗');const[figures,m]=await Promise.all([fr.json(),mr.json()]);if(!Array.isArray(m.houses)||m.houses.length!==16)throw new Error('宮位資料不完整');const f=figures.find(x=>x.id===fid),h=m.houses.find(x=>x.id===hid||String(x.number)===String(hid).replace(/\D/g,''));if(!f||!h)throw new Error('找不到卦象或宮位');const sr=await fetch(h.shard,{cache:'no-store'});if(!sr.ok)throw new Error('落宮內容讀取失敗');const shard=await sr.json(),p=arr(shard.records).find(x=>x.f===fid&&Number(x.h)===Number(h.number));if(!p)throw new Error('找不到此落宮組合');render({f,h,figures,houses:m.houses,p})}catch(e){$('#app').innerHTML=`<div class="loading">讀取失敗：${esc(e.message||e)}</div>`}}load();