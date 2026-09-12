(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function fmt(v,unit){const n=Number(v);if(!Number.isFinite(n))return String(v||'');return unit==='kcal'?Math.round(n).toString():Number(n.toFixed(1)).toString()}
function parseCardUnit(card){const title=$('.records-chart-title',card)?.textContent?.trim()||'';if(/Calories/i.test(title))return'kcal';if(/Miles/i.test(title))return'mi';if(/Sleep/i.test(title))return'h';return'kg'}
function attachCard(card){
  const svg=$('svg.records-chart',card);if(!svg||svg.dataset.interactive==='1')return;
  svg.dataset.interactive='1';card.classList.add('records-chart-interactive');
  let tip=$('.records-point-tooltip',card);if(!tip){tip=document.createElement('div');tip.className='records-point-tooltip';tip.hidden=true;card.appendChild(tip)}
  const unit=parseCardUnit(card),labels=$$('.records-chart-label',svg).filter(x=>/^\d+\/\d+$/.test((x.textContent||'').trim()));
  const dots=$$('.records-chart-dot',svg);if(!dots.length)return;
  dots.forEach((dot,i)=>{
    const cx=dot.getAttribute('cx'),cy=dot.getAttribute('cy');
    const hit=document.createElementNS('http://www.w3.org/2000/svg','circle');
    hit.setAttribute('cx',cx);hit.setAttribute('cy',cy);hit.setAttribute('r','14');hit.setAttribute('class','records-chart-hit');
    hit.dataset.index=String(i);svg.appendChild(hit);
  });
  function valueFor(i){const dot=dots[i],cy=Number(dot?.getAttribute('cy'));if(!dot||!Number.isFinite(cy))return null;const grid=$$('.records-chart-grid',svg),yLabels=$$('.records-chart-label',svg).filter(x=>!/^\d+\/\d+$/.test((x.textContent||'').trim()));if(grid.length<2||yLabels.length<2)return null;const pairs=grid.map((g,j)=>({y:Number(g.getAttribute('y1')),v:Number(yLabels[j]?.textContent)})).filter(p=>Number.isFinite(p.y)&&Number.isFinite(p.v)).sort((a,b)=>a.y-b.y);if(pairs.length<2)return null;const top=pairs[0],bottom=pairs[pairs.length-1];if(bottom.y===top.y)return null;return top.v+(cy-top.y)*(bottom.v-top.v)/(bottom.y-top.y)}
  function show(i,clientX,clientY){const val=valueFor(i);const date=labels[i]?.textContent?.trim()||`点 ${i+1}`;if(val==null)return;tip.innerHTML=`<b>${date}</b><span>${fmt(val,unit)} ${unit}</span>`;tip.hidden=false;const r=card.getBoundingClientRect();let x=clientX-r.left,y=clientY-r.top-12;tip.style.left=Math.max(54,Math.min(r.width-54,x))+'px';tip.style.top=Math.max(42,y)+'px';dots.forEach((d,j)=>d.classList.toggle('selected',j===i))}
  function hide(){tip.hidden=true;dots.forEach(d=>d.classList.remove('selected'))}
  $$('.records-chart-hit',svg).forEach(hit=>{
    hit.addEventListener('pointerdown',e=>{e.preventDefault();show(Number(hit.dataset.index),e.clientX,e.clientY)});
    hit.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')show(Number(hit.dataset.index),e.clientX,e.clientY)});
    hit.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')hide()});
  });
  card.addEventListener('pointerdown',e=>{if(!e.target.closest?.('.records-chart-hit'))hide()});
}
function attach(){ $$('.records-chart-card').forEach(attachCard) }
let obs=null;function init(){attach();if(obs)obs.disconnect();obs=new MutationObserver(()=>setTimeout(attach,30));const tools=$('#toolsView');if(tools)obs.observe(tools,{childList:true,subtree:true})}
window.addEventListener('DOMContentLoaded',()=>setTimeout(init,320));window.addEventListener('pageshow',()=>setTimeout(attach,350));window.addEventListener('wlDailyMetricsChanged',()=>setTimeout(attach,60));document.addEventListener('click',e=>{if(e.target?.id==='tabTools')setTimeout(attach,120)});
})();