(()=>{
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clean=s=>String(s||'').trim().replace(/\s+/g,' ');
function currentWeekNum(){try{return Number(currentWeek)||Number(localStorage.getItem('wl_current_week')||1)}catch(e){return Number(localStorage.getItem('wl_current_week')||1)}}
function dayOf(row){return clean(row.closest('.card')?.querySelector('h3')?.textContent||'').replace(/\s*\d{4}年.*$/,'')}
function exerciseKey(row,type){const week=currentWeekNum(),day=dayOf(row),name=clean(row.querySelector('.exname')?.textContent),rx=clean(row.querySelector('.prescription')?.textContent);return `wl_settrack_${week}_${encodeURIComponent(day)}_${encodeURIComponent(name)}_${encodeURIComponent(rx)}_${type}`}
function parseScheme(rx){
  const text=String(rx||'');
  const repsBySet=[];
  const re=/(\d+)\s*(?:组\s*)?[×x]\s*(\d+)\s*(?:次)?/g;
  for(const m of text.matchAll(re)){
    const sets=Number(m[1])||0,reps=Number(m[2])||0;
    for(let i=0;i<sets;i++)repsBySet.push(reps);
  }
  return repsBySet;
}
function originalCheckbox(row){return [...row.children].find(x=>x instanceof HTMLInputElement&&x.type==='checkbox')||null}
function linkedWarmup(row){const p=row.previousElementSibling;return p&&p.classList.contains('warmup-record')?p:null}
function warmupComplete(row){const rec=linkedWarmup(row);if(!rec)return true;const buttons=$$('.warmup-set-btn',rec);return buttons.length>0&&buttons.every(b=>b.classList.contains('done'))}
function workComplete(row){const buttons=$$('.work-set-btn',row);return buttons.length>0&&buttons.every(b=>b.classList.contains('done'))}
function syncSection(row){const cb=originalCheckbox(row);if(!cb)return;const should=workComplete(row)&&warmupComplete(row);if(cb.checked!==should)cb.click()}
function notifySession(row){try{window.TrainingSession?.touch(row)}catch(e){}}
function addFormalTracker(row){
  if(row.querySelector('.set-tracker'))return;
  const rx=row.querySelector('.prescription')?.textContent||'',repsBySet=parseScheme(rx),total=repsBySet.length;
  if(!total)return;
  row.classList.add('has-set-tracker');
  const body=row.querySelector(':scope > div');if(!body)return;
  const key=exerciseKey(row,'work'),stored=localStorage.getItem(key),legacyDone=!!originalCheckbox(row)?.checked;
  let done=[];try{done=stored?JSON.parse(stored):[]}catch(e){}
  if(!Array.isArray(done))done=[];
  if(!stored&&legacyDone)done=Array(total).fill(true);
  done=Array.from({length:total},(_,i)=>!!done[i]);
  const box=document.createElement('div');box.className='set-tracker';
  const head=document.createElement('div');head.className='set-tracker-top';
  const count=document.createElement('span');count.className='set-tracker-count';
  const hint=document.createElement('span');hint.className='small';hint.textContent='每做完一组点对应按钮';
  head.append(count,hint);
  const grid=document.createElement('div');grid.className='work-set-buttons';
  box.append(head,grid);
  const fields=body.querySelector('.fields');
  if(fields)body.insertBefore(box,fields);else body.appendChild(box);
  function save(){localStorage.setItem(key,JSON.stringify(done))}
  function paintHead(){const c=done.filter(Boolean).length;count.textContent=`正式组 ${c} / ${total}`;count.classList.toggle('complete',c===total)}
  for(let i=0;i<total;i++){
    const b=document.createElement('button');b.type='button';b.className='work-set-btn';
    function paint(){b.classList.toggle('done',done[i]);b.textContent=done[i]?`第${i+1}组 ×${repsBySet[i]} ✓`:`第${i+1}组 ×${repsBySet[i]}`}
    b.onclick=()=>{done[i]=!done[i];paint();paintHead();save();if(done[i])notifySession(row);syncSection(row)};
    grid.appendChild(b);paint();
  }
  paintHead();save();syncSection(row);
}
function warmupRow(box){let n=box.nextElementSibling;while(n&&!n.classList.contains('exercise'))n=n.nextElementSibling;return n&&n.classList.contains('exercise')?n:null}
function addWarmupTracker(box){
  if(box.nextElementSibling?.classList?.contains('warmup-record'))return;
  const row=warmupRow(box);if(!row)return;
  const steps=$$('.warmup-steps span',box).filter(s=>!/^正式组/.test(clean(s.textContent)));if(!steps.length)return;
  const key=exerciseKey(row,'warmup'),stored=localStorage.getItem(key),legacyDone=!!originalCheckbox(row)?.checked;
  let done=[];try{done=stored?JSON.parse(stored):[]}catch(e){}
  if(!Array.isArray(done))done=[];
  if(!stored&&legacyDone)done=Array(steps.length).fill(true);
  done=Array.from({length:steps.length},(_,i)=>!!done[i]);
  const rec=document.createElement('div');rec.className='warmup-record';
  const head=document.createElement('div');head.className='warmup-record-head';
  const label=document.createElement('span'),hint=document.createElement('span');hint.className='small';hint.textContent='每做完一组点对应按钮';head.append(label,hint);
  const list=document.createElement('div');list.className='warmup-set-buttons';rec.append(head,list);box.insertAdjacentElement('afterend',rec);
  function save(){localStorage.setItem(key,JSON.stringify(done))}
  function paintHead(){const c=done.filter(Boolean).length;label.textContent=`热身 ${c} / ${steps.length} 组`}
  steps.forEach((s,i)=>{
    const b=document.createElement('button');b.type='button';b.className='warmup-set-btn';
    const text=clean(s.childNodes[0]?.textContent||s.textContent).replace(/配重$/,'').trim();
    function paint(){b.classList.toggle('done',done[i]);b.textContent=done[i]?`${text} ✓`:text}
    b.onclick=()=>{done[i]=!done[i];paint();paintHead();save();if(done[i])notifySession(row);syncSection(row)};
    list.appendChild(b);paint();
  });
  paintHead();save();syncSection(row);
}
function cleanQuickLoad(){document.querySelectorAll('.quick-load-btn,#setCurrentBar').forEach(el=>el.style.display='none');const t=document.querySelector('#toolsView .tools-card .small');if(t&&/Quick Load/.test(t.textContent))t.textContent='组数记录、e1RM、训练复盘、备份都在这里。'}
function inject(){cleanQuickLoad();$$('.exercise').forEach(addFormalTracker);$$('.warmup-box').forEach(addWarmupTracker)}
let busy=false;function schedule(){if(busy)return;busy=true;setTimeout(()=>{busy=false;inject()},60)}
window.addEventListener('DOMContentLoaded',()=>{inject();const root=document.getElementById('content');if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true})});
window.addEventListener('pageshow',()=>setTimeout(inject,120));
})();
