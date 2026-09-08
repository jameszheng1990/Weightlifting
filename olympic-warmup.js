(()=>{
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clean=s=>String(s||'').trim().replace(/\s+/g,' ');
function weekNum(){try{return Number(currentWeek)||Number(localStorage.getItem('wl_current_week')||1)}catch(e){return Number(localStorage.getItem('wl_current_week')||1)}}
function dayOf(card){return (card.querySelector('h3')?.textContent?.match(/周[一二三四五六日]/)||[])[0]||''}
function mainRow(card){const box=card.querySelector('.choicebox');let n=box?.nextElementSibling;while(n&&!n.classList.contains('exercise'))n=n.nextElementSibling;return n&&n.classList.contains('exercise')?n:null}
function stateKey(row){const card=row.closest('.card'),day=dayOf(card),name=clean(row.querySelector('.exname')?.textContent),rx=clean(row.querySelector('.prescription')?.textContent);return `wl_olympic_warmup_${weekNum()}_${encodeURIComponent(day)}_${encodeURIComponent(name)}_${encodeURIComponent(rx)}`}
function loadState(row){try{return JSON.parse(localStorage.getItem(stateKey(row))||'{}')||{}}catch(e){return{}}}
function saveState(row,s){localStorage.setItem(stateKey(row),JSON.stringify(s))}
function add(card){
  const day=dayOf(card);if(day!=='周二'&&day!=='周四')return;
  if(card.querySelector('.olympic-warmup-record'))return;
  const row=mainRow(card);if(!row)return;
  const rec=document.createElement('div');rec.className='olympic-warmup-record';
  rec.innerHTML='<div class="olympic-warmup-head"><strong>主项热身</strong><span class="exercise-time-summary olympic-warmup-time-summary">热身用时 —</span></div><div class="olympic-warmup-actions"><button class="olympic-warmup-start" type="button">开始热身</button><button class="olympic-warmup-finish" type="button">热身完成 → 开始正式组</button></div>';
  row.insertAdjacentElement('beforebegin',rec);
  const start=rec.querySelector('.olympic-warmup-start'),finish=rec.querySelector('.olympic-warmup-finish');
  function paint(){const s=loadState(row);start.textContent=s.done?'热身已完成 ✓':s.started?'热身中 ✓':'开始热身';start.classList.toggle('done',!!s.started);start.disabled=!!s.done;finish.style.display=s.started&&!s.done?'block':'none'}
  start.onclick=()=>{const s=loadState(row);if(s.started)return;s.started=true;s.done=false;saveState(row,s);try{window.TrainingSession?.touchWarmup(row,false)}catch(e){}paint()};
  finish.onclick=()=>{const s=loadState(row);if(!s.started||s.done)return;s.done=true;saveState(row,s);try{window.TrainingSession?.touchWarmup(row,true);window.TrainingSession?.touch(row,false)}catch(e){}paint()};
  paint();
}
function inject(){$$('#content>.card').forEach(add)}
let busy=false;function schedule(){if(busy)return;busy=true;setTimeout(()=>{busy=false;inject()},80)}
window.addEventListener('DOMContentLoaded',()=>{setTimeout(inject,180);const root=document.getElementById('content');if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true})});
window.addEventListener('pageshow',()=>setTimeout(inject,220));
})();
