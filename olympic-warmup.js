(()=>{
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clean=s=>String(s||'').trim().replace(/\s+/g,' ');
function weekNum(){try{return Number(currentWeek)||Number(localStorage.getItem('wl_current_week')||1)}catch(e){return Number(localStorage.getItem('wl_current_week')||1)}}
function dayOf(card){return (card.querySelector('h3')?.textContent?.match(/周[一二三四五六日]/)||[])[0]||''}
function mainRow(card){const box=card.querySelector('.choicebox');let n=box?.nextElementSibling;while(n&&!n.classList.contains('exercise'))n=n.nextElementSibling;return n&&n.classList.contains('exercise')?n:null}
function rowMeta(row){return{week:weekNum(),day:dayOf(row.closest('.card')),name:clean(row.querySelector('.exname')?.textContent),rx:clean(row.querySelector('.prescription')?.textContent)}}
function warmMeta(row){const m=rowMeta(row);return{...m,name:`${m.name} 热身`,rx:`${m.rx} [warmup]`}}
function itemKey(m){return `${m.week}|${m.day}|${m.name}|${m.rx}`}
function stateKey(row){const m=rowMeta(row);return `wl_olympic_warmup_${m.week}_${encodeURIComponent(m.day)}_${encodeURIComponent(m.name)}_${encodeURIComponent(m.rx)}`}
function loadState(row){try{return JSON.parse(localStorage.getItem(stateKey(row))||'{}')||{}}catch(e){return{}}}
function saveState(row,s){localStorage.setItem(stateKey(row),JSON.stringify(s))}
function duration(sec){sec=Math.max(0,Math.round(sec||0));const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;return `${h?String(h).padStart(2,'0')+':':''}${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
function active(){try{return JSON.parse(localStorage.getItem('wl_active_session')||'null')}catch(e){return null}}
function history(){try{const h=JSON.parse(localStorage.getItem('wl_session_history')||'[]');return Array.isArray(h)?h:[]}catch(e){return[]}}
function warmupSeconds(row){const m=warmMeta(row),key=itemKey(m);let sec=0;for(const h of history())if(Number(h.week)===m.week&&h.day===m.day)for(const it of h.items||[])if(it.name===m.name&&it.rx===m.rx)sec+=Number(it.durationSec)||0;const a=active();if(a&&Number(a.week)===m.week&&a.day===m.day){const it=a.items?.[key];if(it){let ms=Number(it.accumMs)||0;if(a.currentItemKey===key&&a.itemStartedAt&&!a.pausedAt)ms+=Math.max(0,Date.now()-a.itemStartedAt);sec+=Math.round(ms/1000)}}return sec}
function paintTime(rec,row){const b=rec.querySelector('.olympic-warmup-time-summary');if(!b)return;const sec=warmupSeconds(row);b.textContent=`热身用时 ${sec?duration(sec):'—'}`;const a=active(),key=itemKey(warmMeta(row));b.classList.toggle('active',!!(a&&a.currentItemKey===key&&!a.pausedAt))}
function add(card){
  const day=dayOf(card);if(day!=='周二'&&day!=='周四')return;
  if(card.querySelector('.olympic-warmup-record'))return;
  const row=mainRow(card);if(!row)return;
  const rec=document.createElement('div');rec.className='olympic-warmup-record';
  rec.innerHTML='<div class="olympic-warmup-head"><strong>主项热身</strong><span class="exercise-time-summary olympic-warmup-time-summary">热身用时 —</span></div><div class="olympic-warmup-actions"><button class="olympic-warmup-start" type="button">开始热身</button><button class="olympic-warmup-finish" type="button">热身完成 → 开始正式组</button></div>';
  row.insertAdjacentElement('beforebegin',rec);
  const start=rec.querySelector('.olympic-warmup-start'),finish=rec.querySelector('.olympic-warmup-finish');
  function paint(){const s=loadState(row);start.textContent=s.done?'热身已完成 ✓':s.started?'热身中 ✓':'开始热身';start.classList.toggle('done',!!s.started);start.disabled=!!s.done;finish.style.display=s.started&&!s.done?'block':'none';paintTime(rec,row)}
  start.onclick=()=>{const s=loadState(row);if(s.started)return;s.started=true;s.done=false;saveState(row,s);try{window.TrainingSession?.touchWarmup(row,false)}catch(e){}paint()};
  finish.onclick=()=>{const s=loadState(row);if(!s.started||s.done)return;s.done=true;saveState(row,s);try{window.TrainingSession?.touchWarmup(row,true);window.TrainingSession?.touch(row,false)}catch(e){}paint()};
  paint();
}
function inject(){$$('#content>.card').forEach(add)}
function tick(){$$('.olympic-warmup-record').forEach(rec=>{let row=rec.nextElementSibling;while(row&&!row.classList.contains('exercise'))row=row.nextElementSibling;if(row)paintTime(rec,row)})}
let busy=false;function schedule(){if(busy)return;busy=true;setTimeout(()=>{busy=false;inject()},80)}
window.addEventListener('DOMContentLoaded',()=>{setTimeout(inject,180);setInterval(tick,1000);const root=document.getElementById('content');if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true})});
window.addEventListener('pageshow',()=>setTimeout(inject,220));
})();
