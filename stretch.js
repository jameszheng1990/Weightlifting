(()=>{
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function firstExerciseAfter(rec){
  let n=rec.nextElementSibling;
  while(n&&!n.classList.contains('exercise'))n=n.nextElementSibling;
  return n&&n.classList.contains('exercise')?n:null;
}
function addStretchButton(card){
  if(card.querySelector('.stretch-start-row'))return;
  const rec=card.querySelector('.warmup-record');
  const list=rec?.querySelector('.warmup-set-buttons');
  if(!rec||!list)return;
  const row=firstExerciseAfter(rec);
  if(!row)return;
  const line=document.createElement('div');
  line.className='warmup-set-row stretch-start-row';
  const btn=document.createElement('button');
  btn.type='button';
  btn.className='warmup-set-btn stretch-start-btn';
  btn.textContent='开始拉伸';
  btn.onclick=()=>{
    try{window.TrainingSession?.touch(row,false)}catch(e){}
    btn.classList.add('done');
    btn.textContent='拉伸中 ✓';
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
