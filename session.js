(()=>{
const $=s=>document.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ACTIVE='wl_active_session',HISTORY='wl_session_history';
let tickId=null,injectBusy=false;
function pad(n){return String(n).padStart(2,'0')}
function ymd(d=new Date()){return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`}
function duration(sec){sec=Math.max(0,Math.round(sec||0));const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;return `${h?pad(h)+':':''}${pad(m)}:${pad(s)}`}
function loadActive(){try{return JSON.parse(localStorage.getItem(ACTIVE)||'null')}catch(e){return null}}
function saveActive(s){if(s)localStorage.setItem(ACTIVE,JSON.stringify(s));else localStorage.removeItem(ACTIVE)}
function loadHistory(){try{const h=JSON.parse(localStorage.getItem(HISTORY)||'[]');return Array.isArray(h)?h:[]}catch(e){return[]}}
function saveHistory(h){localStorage.setItem(HISTORY,JSON.stringify(h.slice(-200)))}
function elapsedMs(s,now=Date.now()){if(!s)return 0;const end=s.pausedAt||now;return Math.max(0,end-s.startAt-(s.pausedMs||0))}
function rowMeta(row){const h=row?.closest('.card')?.querySelector('h3')?.textContent?.trim()||'';const day=(h.match(/周[一二三四五六日]/)||[])[0]||h||'训练';let week=Number(localStorage.getItem('wl_current_week')||1);try{week=Number(currentWeek)||week}catch(e){}const name=row?.querySelector('.exname')?.textContent?.trim()||'训练';const rx=row?.querySelector('.prescription')?.textContent?.trim()||'';return{day,week,name,rx}}
function itemKey(meta){return `${meta.week}|${meta.day}|${meta.name}|${meta.rx}`}
function newSession(row){const now=Date.now(),meta=rowMeta(row);return{id:String(now),date:ymd(),week:meta.week,day:meta.day,startAt:now,lastActive:now,pausedMs:0,pausedAt:null,items:{},currentItemKey:null,itemStartedAt:null}}
function flushCurrentItem(s,now=Date.now()){if(!s||!s.currentItemKey||!s.itemStartedAt)return;const it=s.items?.[s.currentItemKey];if(it)it.accumMs=(it.accumMs||0)+Math.max(0,now-s.itemStartedAt);s.itemStartedAt=null}
function archive(s,endAt){if(!s)return;const stop=endAt||Date.now();flushCurrentItem(s,stop);const dur=Math.round(elapsedMs(s,stop)/1000);if(dur<1)return;const items=Object.values(s.items||{}).map(it=>({name:it.name,rx:it.rx,durationSec:Math.round((it.accumMs||0)/1000),complete:!!it.complete}));const h=loadHistory();h.push({id:s.id,date:s.date,week:s.week,day:s.day,startAt:s.startAt,endAt:stop,durationSec:dur,items});saveHistory(h)}
function touch(row,complete=false){let s=loadActive(),now=Date.now(),meta=rowMeta(row);if(s&&(s.date!==ymd()||s.week!==meta.week||s.day!==meta.day)){archive(s,s.lastActive||now);s=null}if(!s)s=newSession(row);if(s.pausedAt){s.pausedMs=(s.pausedMs||0)+(now-s.pausedAt);s.pausedAt=null}if(!s.items)s.items={};const key=itemKey(meta);if(s.currentItemKey&&s.currentItemKey!==key)flushCurrentItem(s,now);if(!s.items[key])s.items[key]={key,name:meta.name,rx:meta.rx,accumMs:0,complete:false};s.currentItemKey=key;if(!s.itemStartedAt)s.itemStartedAt=now;s.lastActive=now;if(complete){flushCurrentItem(s,now);s.items[key].complete=true;s.currentItemKey=null;s.itemStartedAt=null}saveActive(s);ensureStopwatch();renderAll()}
function pauseResume(){const s=loadActive();if(!s)return;const now=Date.now();if(s.pausedAt){s.pausedMs=(s.pausedMs||0)+(now-s.pausedAt);s.pausedAt=null;if(s.currentItemKey)s.itemStartedAt=now}else{flushCurrentItem(s,now);s.pausedAt=now}s.lastActive=now;saveActive(s);renderAll()}
function finish(){const s=loadActive();if(!s)return;if(!confirm('结束本次训练并保存总用时？'))return;const now=Date.now();if(s.pausedAt){s.pausedMs=(s.pausedMs||0)+(now-s.pausedAt);s.pausedAt=null}else flushCurrentItem(s,now);archive(s,now);saveActive(null);renderAll()}
function ensureStopwatch(){if($('#workoutStopwatch'))return;const d=document.createElement('div');d.id='workoutStopwatch';d.className='workout-stopwatch session-hidden';d.innerHTML='<div><div class="session-small">本次训练</div><div class="session-time" id="sessionTime">00:00</div></div><div class="session-float-actions"><button id="sessionPause" type="button">暂停</button><button id="sessionFinish" type="button">结束训练</button></div>';document.body.appendChild(d);$('#sessionPause').onclick=pauseResume;$('#sessionFinish').onclick=finish}
function renderStopwatch(){ensureStopwatch();const s=loadActive(),box=$('#workoutStopwatch');if(!s){box.classList.add('session-hidden');return}box.classList.remove('session-hidden');$('#sessionTime').textContent=duration(elapsedMs(s)/1000);$('#sessionPause').textContent=s.pausedAt?'继续':'暂停'}
function cardMeta(card){const h=card.querySelector('h3')?.textContent||'';const day=(h.match(/周[一二三四五六日]/)||[])[0]||'';let week=Number(localStorage.getItem('wl_current_week')||1);try{week=Number(currentWeek)||week}catch(e){}return{day,week}}
function dayTotal(meta){const hist=loadHistory().filter(x=>Number(x.week)===meta.week&&x.day===meta.day);return hist.reduce((a,x)=>a+(Number(x.durationSec)||0),0)}
function historyItemTime(meta,name,rx){let sec=0;for(const h of loadHistory())if(Number(h.week)===meta.week&&h.day===meta.day)for(const it of h.items||[])if(it.name===name&&it.rx===rx)sec+=Number(it.durationSec)||0;return sec}
function liveItemTime(s,key){const it=s?.items?.[key];if(!it)return 0;let ms=it.accumMs||0;if(s.currentItemKey===key&&s.itemStartedAt&&!s.pausedAt)ms+=Math.max(0,Date.now()-s.itemStartedAt);return Math.round(ms/1000)}
function injectExerciseTimes(){const active=loadActive();$$('#content>.card').forEach(card=>{const meta=cardMeta(card);$$('.exercise',card).forEach(row=>{const name=row.querySelector('.exname')?.textContent?.trim()||'',rx=row.querySelector('.prescription')?.textContent?.trim()||'';if(!name)return;let b=row.querySelector('.exercise-time-summary');if(!b){b=document.createElement('div');b.className='exercise-time-summary';const exname=row.querySelector('.exname');exname?.insertAdjacentElement('afterend',b)}const key=itemKey({week:meta.week,day:meta.day,name,rx});const saved=historyItemTime(meta,name,rx),live=active&&Number(active.week)===meta.week&&active.day===meta.day?liveItemTime(active,key):0,total=saved+live;b.textContent=`用时 ${total?duration(total):'—'}`;b.classList.toggle('active',!!live)})})}
function injectDaySummaries(){const active=loadActive();$$('#content>.card').forEach(card=>{const meta=cardMeta(card);if(!meta.day)return;let box=card.querySelector('.day-session-summary');if(!box){box=document.createElement('div');box.className='day-session-summary';const h=card.querySelector('h3');h?.insertAdjacentElement('afterend',box)}const saved=dayTotal(meta),isActive=active&&Number(active.week)===meta.week&&active.day===meta.day;const live=isActive?Math.round(elapsedMs(active)/1000):0,total=saved+live;box.innerHTML=`<div><span>当天总用时</span><b>${total?duration(total):'—'}</b>${saved&&!isActive?'<small>已保存</small>':isActive?'<small>进行中</small>':''}</div>${isActive?'<button type="button" class="day-session-end">结束训练</button>':''}`;box.querySelector('.day-session-end')?.addEventListener('click',finish)})}
function normalizeTabs(){
  const bar=$('#loaderTabBar');if(!bar)return;
  const todays=$$('[id="tabToday"]');
  let sentinel=todays[0];
  if(!sentinel){sentinel=document.createElement('button');sentinel.id='tabToday';bar.appendChild(sentinel)}
  sentinel.textContent='';sentinel.style.display='none';sentinel.setAttribute('aria-hidden','true');sentinel.tabIndex=-1;
  todays.slice(1).forEach(x=>x.remove());
  const tools=$$('[id="tabTools"]');
  const keep=tools[0];tools.slice(1).forEach(x=>x.remove());
  if(keep){keep.textContent='工具';keep.style.display='';bar.appendChild(keep)}
  const plan=$('#tabPlan'),loader=$('#tabLoader');if(plan)bar.insertBefore(plan,bar.firstChild);if(loader)plan?.insertAdjacentElement('afterend',loader);
  $('#reviewView')?.remove();
}
function hideOldCountdown(){const r=$('#restTimer');if(r)r.classList.add('session-force-hide');const heavy=$('#timerHeavy');const card=heavy?.closest('.tools-card');if(card)card.style.display='none';const intro=$('#toolsView .tools-card .small');if(intro&&/计时器|Quick Load|训练复盘/.test(intro.textContent))intro.textContent='组数记录、e1RM、训练用时和备份。'}
function renderAll(){normalizeTabs();renderStopwatch();injectDaySummaries();injectExerciseTimes()}
function init(){ensureStopwatch();normalizeTabs();hideOldCountdown();renderAll();clearInterval(tickId);tickId=setInterval(renderAll,1000);const root=$('#content');if(root)new MutationObserver(()=>{if(injectBusy)return;injectBusy=true;setTimeout(()=>{injectBusy=false;normalizeTabs();injectDaySummaries();injectExerciseTimes()},60)}).observe(root,{childList:true,subtree:true})}
window.TrainingSession={touch,finish,pauseResume};
window.addEventListener('DOMContentLoaded',()=>setTimeout(init,140));window.addEventListener('pageshow',()=>setTimeout(init,180));
})();
