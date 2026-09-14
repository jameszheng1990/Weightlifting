(()=>{
const LB_TO_KG=0.45359237;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
let busy=false;
function parseChip(el){
  const m=(el.textContent||'').trim().match(/(\d+(?:\.\d+)?)\s*(KG|LB)\s*[×x]\s*(\d+)/i);
  if(!m)return null;
  const value=Number(m[1]),unit=m[2].toLowerCase(),count=Math.max(1,Number(m[3])||1);
  return{el,value,unit,count,kg:value*(unit==='lb'?LB_TO_KG:1)};
}
function colorClass(unit,value){
  if(unit==='kg'){
    if(value>=25)return'plate-kg-25';
    if(value>=20)return'plate-kg-20';
    if(value>=15)return'plate-kg-15';
    if(value>=10)return'plate-kg-10';
    if(value>=5)return'plate-kg-5';
    return'plate-kg-small';
  }
  if(value>=45)return'plate-lb-45';
  if(value>=35)return'plate-lb-35';
  if(value>=25)return'plate-lb-25';
  if(value>=10)return'plate-lb-10';
  return'plate-lb-small';
}
function plateHeight(kg){
  if(kg>=24)return 132;
  if(kg>=20)return 126;
  if(kg>=15)return 116;
  if(kg>=10)return 104;
  if(kg>=5)return 88;
  if(kg>=2)return 70;
  return 58;
}
function ensurePreview(plates){
  const sheet=$('#loaderModal .loader-sheet');if(!sheet)return null;
  let wrap=$('#loaderPlatePreview',sheet);
  if(!wrap){
    wrap=document.createElement('div');
    wrap.id='loaderPlatePreview';
    wrap.className='loader-preview-wrap';
    wrap.innerHTML='<div class="loader-preview-title"><b>挂片示意</b><span class="small">每侧 · 由重到轻</span></div><div class="loader-bar-preview"><div class="loader-bar-shaft"></div><div class="loader-bar-collar">BAR</div><div class="loader-preview-plates"></div><div class="loader-bar-sleeve"></div></div>';
    const note=$('#loaderNote',sheet);
    if(note)note.insertAdjacentElement('beforebegin',wrap);else sheet.appendChild(wrap);
  }
  const root=$('.loader-preview-plates',wrap);root.innerHTML='';
  const expanded=[];
  for(const p of plates)for(let i=0;i<p.count;i++)expanded.push(p);
  if(!expanded.length){root.innerHTML='<span class="loader-preview-empty">无挂片</span>';return wrap}
  for(const p of expanded){
    const plate=document.createElement('div');
    plate.className=`loader-plate-shape ${colorClass(p.unit,p.value)}`;
    plate.style.height=plateHeight(p.kg)+'px';
    plate.title=`${p.value} ${p.unit.toUpperCase()}`;
    plate.innerHTML=`<span>${p.value}</span><small>${p.unit.toUpperCase()}</small>`;
    root.appendChild(plate);
  }
  return wrap;
}
function apply(){
  if(busy)return;
  const root=$('#loaderPlates');if(!root)return;
  const parsed=$$('.loader-chip',root).map(parseChip).filter(Boolean);
  if(!parsed.length){ensurePreview([]);return}
  const sorted=parsed.slice().sort((a,b)=>b.kg-a.kg||b.value-a.value||a.unit.localeCompare(b.unit));
  busy=true;
  for(const p of sorted)root.appendChild(p.el);
  ensurePreview(sorted);
  busy=false;
}
function init(){
  const modal=$('#loaderModal');if(!modal)return;
  apply();
  const plates=$('#loaderPlates');if(plates)new MutationObserver(()=>setTimeout(apply,0)).observe(plates,{childList:true});
  new MutationObserver(()=>setTimeout(apply,0)).observe(modal,{attributes:true,attributeFilter:['class']});
}
window.addEventListener('DOMContentLoaded',()=>setTimeout(init,120));
window.addEventListener('pageshow',()=>setTimeout(apply,180));
})();
