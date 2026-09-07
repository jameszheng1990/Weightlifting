(()=>{
const $=s=>document.querySelector(s);
const RPES=[10,9.5,9,8.5,8,7.5,7,6.5,6];
const CHART={
1:[100,97.8,95.5,93.9,92.2,90.7,89.2,87.8,86.3],
2:[95.5,93.9,92.2,90.7,89.2,87.8,86.3,85,83.7],
3:[92.2,90.7,89.2,87.8,86.3,85,83.7,82.4,81.1],
4:[89.2,87.8,86.3,85,83.7,82.4,81.1,79.9,78.6],
5:[86.3,85,83.7,82.4,81.1,79.9,78.6,77.4,76.2],
6:[83.7,82.4,81.1,79.9,78.6,77.4,76.2,75.1,73.9],
7:[81.1,79.9,78.6,77.4,76.2,75.1,73.9,72.8,71.7],
8:[78.6,77.4,76.2,75.1,73.9,72.8,71.7,70.6,69.5],
9:[76.2,75.1,73.9,72.8,71.7,70.6,69.5,68.5,67.4],
10:[73.9,72.8,71.7,70.6,69.5,68.5,67.4,66.4,65.3]
};
function pct(reps,rpe){const row=CHART[Number(reps)],i=RPES.indexOf(Number(rpe));return row&&i>=0?row[i]:null}
function round25(x){return Math.round(x/2.5)*2.5}
function hideRpe(){const v=$('#rpeView');if(v)v.classList.add('loader-hidden');$('#tabRpe')?.classList.remove('active')}
function showRpe(){
  $('#planView')?.classList.add('loader-hidden');
  $('#loaderView')?.classList.add('loader-hidden');
  $('#toolsView')?.classList.add('loader-hidden');
  $('.footerbar')?.classList.add('loader-hidden');
  ['#tabPlan','#tabLoader','#tabTools'].forEach(s=>$(s)?.classList.remove('active'));
  $('#rpeView')?.classList.remove('loader-hidden');
  $('#tabRpe')?.classList.add('active');
}
function calcEstimate(){const w=Number($('#rpeWeight')?.value),reps=Number($('#rpeReps')?.value),rpe=Number($('#rpeLevel')?.value),p=pct(reps,rpe),out=$('#rpeE1rm');if(!out)return;if(!(w>0)||!p){out.textContent='—';return}out.textContent=`${(w/(p/100)).toFixed(1)} kg`}
function calcTarget(){const max=Number($('#rpeMax')?.value),reps=Number($('#rpeTargetReps')?.value),rpe=Number($('#rpeTargetLevel')?.value),p=pct(reps,rpe),out=$('#rpeTarget');if(!out)return;if(!(max>0)||!p){out.textContent='—';return}const raw=max*p/100;out.innerHTML=`${raw.toFixed(1)} kg <span class="rpe-round">≈ ${round25(raw)} kg</span>`}
function opts(min,max,step,selected){let s='';for(let v=min;v<=max+1e-9;v+=step){const x=Number(v.toFixed(1));s+=`<option value="${x}" ${x===selected?'selected':''}>${x}</option>`}return s}
function ensure(){
  const bar=$('#loaderTabBar');if(!bar)return;
  let tab=$('#tabRpe');if(!tab){tab=document.createElement('button');tab.id='tabRpe';tab.textContent='RPE Calculator';bar.appendChild(tab)}
  const tools=$('#tabTools');if(tools)tools.textContent='训练记录';
  if(tools)tools.insertAdjacentElement('afterend',tab);
  if(!$('#rpeView')){
    const v=document.createElement('div');v.id='rpeView';v.className='wrap loader-hidden';v.innerHTML=`
      <div class="rpe-card"><div class="weektitle"><div><h2 style="font-size:18px;margin:0">RPE Calculator</h2><div class="small">按常用 RPE 百分比表估算 e1RM / 训练重量。</div></div><span class="badge">RPE</span></div></div>
      <div class="rpe-card"><h3>从一组表现估算 e1RM</h3><div class="rpe-grid"><label>重量 (kg)<input id="rpeWeight" type="number" inputmode="decimal" step="0.5" value="100"></label><label>次数<select id="rpeReps">${opts(1,10,1,3)}</select></label><label>RPE<select id="rpeLevel">${opts(6,10,.5,8)}</select></label></div><div class="rpe-result"><span>Estimated 1RM</span><b id="rpeE1rm">—</b></div></div>
      <div class="rpe-card"><h3>从 1RM 计算目标组重量</h3><div class="rpe-grid"><label>1RM (kg)<input id="rpeMax" type="number" inputmode="decimal" step="0.5" value="112"></label><label>目标次数<select id="rpeTargetReps">${opts(1,10,1,3)}</select></label><label>目标 RPE<select id="rpeTargetLevel">${opts(6,10,.5,8)}</select></label></div><div class="rpe-result"><span>目标重量</span><b id="rpeTarget">—</b></div><div class="small" style="margin-top:8px">右侧近似值按 2.5 kg 四舍五入。</div></div>`;
    document.body.insertBefore(v,$('.footerbar'));
    ['#rpeWeight','#rpeReps','#rpeLevel'].forEach(s=>$(s)?.addEventListener('input',calcEstimate));
    ['#rpeMax','#rpeTargetReps','#rpeTargetLevel'].forEach(s=>$(s)?.addEventListener('input',calcTarget));
    calcEstimate();calcTarget();
  }
  tab.onclick=showRpe;
  ['#tabPlan','#tabLoader','#tabTools'].forEach(s=>{const b=$(s);if(!b||b.dataset.rpeWrapped)return;const old=b.onclick;b.onclick=e=>{hideRpe();return old?.call(b,e)};b.dataset.rpeWrapped='1'});
}
window.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,260));
window.addEventListener('pageshow',()=>setTimeout(ensure,300));
})();
