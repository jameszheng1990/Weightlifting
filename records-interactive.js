(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function fmt(v,unit){const n=Number(v);if(!Number.isFinite(n))return String(v||'');return unit==='kcal'?Math.round(n).toString():Number(n.toFixed(1)).toString()}
function parseCardUnit(card){const title=$('.records-chart-title',card)?.textContent?.trim()||'';if(/Calories/i.test(title))return'kcal';if(/Miles/i.test(title))return'mi';if(/Sleep/i.test(title))return'h';return'kg'}
function attachSvg(card,svg){
  if(!svg||svg.dataset.interactive==='1')return;
  svg.dataset.interactive='1';card.classList.add('records-chart-interactive');
  let tip=$('.records-point-tooltip',card);if(!tip){tip=document.createElement('div');tip.className='records-point-tooltip';tip.hidden=true;card.appendChild(tip)}
  const unit=parseCardUnit(card),dots=$$('.records-chart-dot',svg);if(!dots.length)return;
  dots.forEach((dot,i)=>{const hit=document.createElementNS('http://www.w3.org/2000/svg','circle');hit.setAttribute('cx',dot.getAttribute('cx'));hit.setAttribute('cy',dot.getAttribute('cy'));hit.setAttribute('r','14');hit.setAttribute('class','records-chart-hit');hit.dataset.index=String(i);svg.appendChild(hit)});
  function show(i,clientX,clientY){const dot=dots[i];if(!dot)return;const val=Number(dot.dataset.value),date=dot.dataset.label||`点 ${i+1}`;if(!Number.isFinite(val))return;tip.innerHTML=`<b>${date}</b><span>${fmt(val,unit)} ${unit}</span>`;tip.hidden=false;const r=card.getBoundingClientRect();const x=clientX-r.left,y=clientY-r.top-12;tip.style.left=Math.max(54,Math.min(r.width-54,x))+'px';tip.style.top=Math.max(42,y)+'px';$$('.records-chart-dot',card).forEach(d=>d.classList.toggle('selected',d===dot))}
  function hide(){tip.hidden=true;$$('.records-chart-dot',card).forEach(d=>d.classList.remove('selected'))}
  $$('.records-chart-hit',svg).forEach(hit=>{hit.addEventListener('pointerdown',e=>{e.preventDefault();show(Number(hit.dataset.index),e.clientX,e.clientY)});hit.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')show(Number(hit.dataset.index),e.clientX,e.clientY)});hit.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')hide()})});
  card.addEventListener('pointerdown',e=>{if(!e.target.closest?.('.records-chart-hit')&&!e.target.closest?.('.records-span-toggle'))hide()});
}
function attachCard(card){
  if(card.dataset.interactiveCard==='1')return;
  card.dataset.interactiveCard='1';
  $$('svg.records-chart',card).forEach(svg=>attachSvg(card,svg));
  const btn=$('.records-span-toggle',card),detail=$('.records-chart-detail',card),overview=$('.records-chart-overview',card);
  if(btn&&detail&&overview){btn.addEventListener('click',()=>{const full=btn.dataset.mode!=='full';btn.dataset.mode=full?'full':'detail';btn.textContent=full?'逐点查看':'整体趋势';detail.hidden=full;overview.hidden=!full;const tip=$('.records-point-tooltip',card);if(tip)tip.hidden=true})}
}
function attach(){ $$('.records-chart-card').forEach(attachCard) }
let obs=null;function init(){attach();if(obs)obs.disconnect();obs=new MutationObserver(()=>setTimeout(attach,30));const tools=$('#toolsView');if(tools)obs.observe(tools,{childList:true,subtree:true})}
window.addEventListener('DOMContentLoaded',()=>setTimeout(init,320));window.addEventListener('pageshow',()=>setTimeout(attach,350));window.addEventListener('wlDailyMetricsChanged',()=>setTimeout(attach,60));document.addEventListener('click',e=>{if(e.target?.id==='tabTools')setTimeout(attach,120)});
})();
