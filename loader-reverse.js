(()=>{
const LB_TO_KG=0.45359237;
const defs={kg:[25,20,15,10,5,2.5,1.25,0.5],lb:[45,35,25,10,5,2.5,1.25]};
const $=s=>document.querySelector(s);
let counts={};
try{counts=JSON.parse(localStorage.getItem('bl_reverse_counts')||'{}')||{}}catch(e){counts={}}
let reverseBarType=localStorage.getItem('bl_reverse_bar_type')||'45lb';
let reverseUseCollars=localStorage.getItem('bl_reverse_use_collars')==='1';
let reverseCollarWeight=Number(localStorage.getItem('bl_reverse_collar_weight')||0);
let reverseCollarUnit=localStorage.getItem('bl_reverse_collar_unit')||'lb';
function key(unit,w){return `${unit}:${w}`}
function save(){
  localStorage.setItem('bl_reverse_counts',JSON.stringify(counts));
  localStorage.setItem('bl_reverse_bar_type',reverseBarType);
  localStorage.setItem('bl_reverse_use_collars',reverseUseCollars?'1':'0');
  localStorage.setItem('bl_reverse_collar_weight',String(reverseCollarWeight));
  localStorage.setItem('bl_reverse_collar_unit',reverseCollarUnit);
}
function barKg(){return reverseBarType==='45lb'?45*LB_TO_KG:20}
function collarEachKg(){const w=Math.max(0,Number(reverseCollarWeight)||0);return w*(reverseCollarUnit==='lb'?LB_TO_KG:1)}
function fmt(x){return Number(Number(x).toFixed(2))}
function total(){let side=0;for(const unit of ['kg','lb'])for(const w of defs[unit])side+=(Number(counts[key(unit,w)])||0)*(unit==='kg'?w:w*LB_TO_KG);const base=barKg()+(reverseUseCollars?2*collarEachKg():0);return{base,side,total:base+2*side}}
function paintTotal(){const out=$('#reverseTotal'),detail=$('#reverseBreakdown');if(!out)return;const r=total();out.textContent=`${fmt(r.total)} kg`;if(detail)detail.textContent=`基础 ${fmt(r.base)} kg + 两侧挂片 ${fmt(r.side*2)} kg`}
function render(unit){const root=$(unit==='kg'?'#reverseKg':'#reverseLb');if(!root)return;root.innerHTML='';for(const w of defs[unit]){const k=key(unit,w),n=Math.max(0,Number(counts[k])||0),row=document.createElement('div');row.className='reverse-plate';row.innerHTML=`<div><b>${w} ${unit.toUpperCase()}</b><div class="small">每侧</div></div><div class="reverse-step"><button type="button">−</button><strong>${n}</strong><button type="button">+</button></div>`;const bs=row.querySelectorAll('button');bs[0].onclick=()=>{counts[k]=Math.max(0,n-1);save();render(unit);paintTotal()};bs[1].onclick=()=>{counts[k]=Math.min(12,n+1);save();render(unit);paintTotal()};root.appendChild(row)}}
function show(which){const target=which==='target';$('#loaderTargetSubView')?.classList.toggle('loader-hidden',!target);$('#loaderReverseSubView')?.classList.toggle('loader-hidden',target);$('#loaderSubTarget')?.classList.toggle('active',target);$('#loaderSubReverse')?.classList.toggle('active',!target);if(!target)paintTotal()}
function syncReverseSetup(){
  const bar=$('#reverseBarType'),cb=$('#reverseUseCollars'),w=$('#reverseCollarWeight'),u=$('#reverseCollarUnit'),fields=$('#reverseCollarFields');
  if(bar)bar.value=reverseBarType;
  if(cb)cb.checked=reverseUseCollars;
  if(w)w.value=reverseCollarWeight;
  if(u)u.value=reverseCollarUnit;
  if(fields)fields.style.display=reverseUseCollars?'grid':'none';
  paintTotal();
}
function init(){const view=$('#loaderView');if(!view||$('#loaderSubTabs'))return false;const css=document.createElement('link');css.rel='stylesheet';css.href='loader-reverse.css?v=1';document.head.appendChild(css);const current=[...view.children];const nav=document.createElement('div');nav.id='loaderSubTabs';nav.className='loader-card loader-subtabs';nav.innerHTML='<button id="loaderSubTarget" class="active" type="button">目标重量 → 配片</button><button id="loaderSubReverse" type="button">挂片 → 总重量</button>';const target=document.createElement('div');target.id='loaderTargetSubView';current.forEach(x=>target.appendChild(x));const reverse=document.createElement('div');reverse.id='loaderReverseSubView';reverse.className='loader-hidden';reverse.innerHTML=`<div class="loader-card"><div class="weektitle"><div><h2 style="font-size:18px;margin:0">现在杠上有多重？</h2><div class="small">数量按每侧输入；自动乘两侧，再加杠铃和卡扣。</div></div><button id="reverseClear" type="button">清空挂片</button></div>
<div class="loader-grid" style="margin-top:12px">
  <div><label>Barbell</label><select id="reverseBarType"><option value="45lb">45 lb bar</option><option value="20kg">20 kg bar</option></select></div>
  <div><label>Collars</label><label style="display:flex;align-items:center;gap:8px;min-height:42px"><input id="reverseUseCollars" type="checkbox" style="width:20px;height:20px"> 使用两个卡扣</label></div>
</div>
<div class="loader-grid" id="reverseCollarFields" style="margin-top:10px">
  <div><label>单个卡扣重量</label><input id="reverseCollarWeight" type="number" inputmode="decimal" min="0" step="0.1"></div>
  <div><label>单位</label><select id="reverseCollarUnit"><option value="lb">lb</option><option value="kg">kg</option></select></div>
</div>
<div class="reverse-result"><span>当前总重量</span><b id="reverseTotal">—</b><div class="small" id="reverseBreakdown"></div></div></div><div class="loader-card"><h3 style="margin-top:0">每侧 KG Plates</h3><div class="reverse-plate-grid" id="reverseKg"></div></div><div class="loader-card"><h3 style="margin-top:0">每侧 LB Plates</h3><div class="reverse-plate-grid" id="reverseLb"></div></div>`;view.append(nav,target,reverse);$('#loaderSubTarget').onclick=()=>show('target');$('#loaderSubReverse').onclick=()=>show('reverse');$('#reverseClear').onclick=()=>{counts={};save();render('kg');render('lb');paintTotal()};
$('#reverseBarType').onchange=e=>{reverseBarType=e.target.value;save();paintTotal()};
$('#reverseUseCollars').onchange=e=>{reverseUseCollars=e.target.checked;save();syncReverseSetup()};
$('#reverseCollarWeight').oninput=e=>{const v=Number(e.target.value);reverseCollarWeight=Number.isFinite(v)&&v>=0?v:0;save();paintTotal()};
$('#reverseCollarUnit').onchange=e=>{reverseCollarUnit=e.target.value;save();paintTotal()};
render('kg');render('lb');syncReverseSetup();return true}
function boot(){if(init())return;let n=0;const id=setInterval(()=>{n++;if(init()||n>30)clearInterval(id)},100)}
window.addEventListener('DOMContentLoaded',boot);window.addEventListener('pageshow',()=>setTimeout(init,120));
})();