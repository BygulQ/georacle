(()=>{
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ORDINAL=['','第一宮','第二宮','第三宮','第四宮','第五宮','第六宮','第七宮','第八宮','第九宮','第十宮','第十一宮','第十二宮','第十三宮','第十四宮','第十五宮','第十六宮'];
  const ordinal=n=>ORDINAL[Number(n)]||`第${n}宮`;
  const level=n=>n<=4?'個位／日層':n<=8?'十位／週層':n<=12?'百位／月層':'千位／年層';
  const tile=(k,v,sub='')=>`<div class="num"><b>${esc(v)}</b><span>${esc(k)}</span>${sub?`<small>${esc(sub)}</small>`:''}</div>`;

  async function mount(){
    if(document.getElementById('placement-numeric-layer')) return true;
    const headings=[...document.querySelectorAll('.section h2')];
    const anchor=headings.find(x=>x.textContent.trim()==='為什麼這樣讀')?.closest('.section');
    if(!anchor) return false;

    const q=new URLSearchParams(location.search);
    const fid=q.get('figure');
    const raw=q.get('house')||'';
    const n=Number((raw.match(/\d+/)||[])[0]);
    if(!fid||!n) return true;

    const [fr,hr,nr]=await Promise.all([
      fetch('./data/figures/public-index.json',{cache:'no-store'}),
      fetch(`./data/houses/v2/public-${Math.ceil(n/4)}.json`,{cache:'no-store'}),
      fetch('./data/placements/public/figure-numeric-v1.json',{cache:'no-store'})
    ]);
    if(!fr.ok||!hr.ok||!nr.ok) return true;

    const [figures,houseData,numericData]=await Promise.all([fr.json(),hr.json(),nr.json()]);
    const f=figures.find(x=>x.id===fid);
    const h=(houseData.records||[]).find(x=>x.id===`house-${String(n).padStart(2,'0')}`);
    const numeric=(numericData.figures||[]).find(x=>x.id===fid);
    if(!f||!h||!numeric) return true;

    const measure=h.measure||{};
    const timing=measure.timing||{};
    const abjad=numeric.abjad||{};
    const sec=document.createElement('section');
    sec.id='placement-numeric-layer';
    sec.className='section';
    sec.innerHTML=`<h2>數值層</h2><div class="numeric-groups"><article class="card numeric-card"><h3>卦象數值｜${esc(f.zhName)}</h3><div class="numbers">${tile('三角數',numeric.triangular??'—')}${tile('Abjad',`${abjad.openOnly??'—'} / ${abjad.weightedAll??'—'}`,'開點／加權')}${tile('Abdah',numeric.abdah??'—')}${tile('Bazdah',numeric.bazdah??'—')}${tile('實點數',numeric.physicalDots??'—')}</div></article><article class="card numeric-card"><h3>宮位數值｜${esc(ordinal(n))}</h3><div class="house-numbers">${tile('宮位數值',measure.cumulative?.value??'—')}${tile('時間尺度',timing.display||'—')}${tile('數值層級',level(n))}</div></article></div>`;
    anchor.after(sec);
    return true;
  }

  const root=document.getElementById('app');
  const observer=new MutationObserver(()=>{
    mount().then(done=>{if(done) observer.disconnect()});
  });
  if(root) observer.observe(root,{childList:true,subtree:true});
  mount();
})();
