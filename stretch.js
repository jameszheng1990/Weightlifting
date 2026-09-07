(()=>{
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clean=s=>String(s||'').trim().replace(/\s+/g,' ');
function currentWeekNum(){try{return Number(currentWeek)||Number(localStorage.getItem('wl_current_week')||1)}catch(e){return Number(localStorage.getItem('wl_current_week')||1)}}
function firstExerciseAfter(rec){
  let n=rec.nextElementSibling;
  while(n&&!n.classList.contains('exercise'))n=n.nextElementSibling;
  return n&&n.classList.contains('exercise')?n:null;
}
function stretchKey(row){
  const week=currentWeekNum();
  const day=clean(row.closest('.card')?.querySelector('h3')?.textContent||'').replace(/\s*\d{4}年.*$/,'');
  const name=clean(row.querySelector('.exname')?.textContent||'');
  const rx=clean(row.querySelector('.prescription')?.textContent||'');
  return `wl_stretch_started_${week}_${encodeURIComponent(day)}_${encodeURIComponent(name)}_${encodeURIComponent(rx)}`;
}
function paint(btn,started){
  btn.classList.toggle('done',started);
  btn.textContent=started?'已开始拉伸 ✓':'开始拉伸';
}
function addStretchButton(card){
  if(card.querySelector('.stretch-start-row'))return;
  const rec=card.querySelector('.warmup-record');
  const list=rec?.querySelector('.warmup-set-buttons');
  if(!rec||!list)return;
  const row=firstExerciseAfter(rec);
  if(!row)return;
  const key=stretchKey(row);
  let started=localStorage.getItem(key)==='1';
  const line=document.createElement('div');
  line.className='warmup-set-row stretch-start-row';
  const btn=document.createElement('button');
  btn.type='button';
  btn.className='warmup-set-btn stretch-start-btn';
  paint(btn,started);
  btn.onclick=()=>{
    if(started)return;
    started=true;
    localStorage.setItem(key,'1');
    try{window.TrainingSession?.touchWarmup(row,false)}catch(e){}
    paint(btn,true);
  };
  line.appendChild(btn);
  list.insertBefore(line,list.firstChild);
}
function inject(){
  $$('#content > .card').forEach(addStretchButton);
}
let pending=false;
function schedule(){
  if(pending)return;
  pending=true;
  setTimeout(()=>{pending=false;inject()},90);
}
window.addEventListener('DOMContentLoaded',()=>{setTimeout(inject,100);const root=document.getElementById('content');if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true})});
window.addEventListener('pageshow',()=>setTimeout(inject,180));
})();
