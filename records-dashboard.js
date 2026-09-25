(()=>{
const DAYS=['周一','周二','周三','周四','周五','周六','周日'];
const OFFSETS={'周一':0,'周二':1,'周三':2,'周四':3,'周五':4,'周六':5,'周日':6};
const $=(s,r=document)=>r.querySelector(s);
function num(v){if(v===null||v===undefined||String(v).trim()==='')return null;const n=Number(v);return Number.isFinite(n)?n:null}
function fmt(v,d=1){return v==null?'—':Number(v.toFixed(d)).toString()}
function parseStart(){const s=localStorage.getItem('wl_program_start')||'';const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s);return m?new Date(Date.UTC(+m[1],+m[2]-1,+m[3])):null}
function dateFor(week,day){const d=parseStart();if(!d)return null;const x=new Date(d);x.setUTCDate(x.getUTCDate()+(week-1)*7+(OFFSETS[day]||0));return x}
function labelFor(week,day){const d=dateFor(week,day);return d?`${d.getUTCMonth()+1}/${d.getUTCDate()}`:`W${week} ${day}`}
function metricPoints(suffix){const pts=[];for(let w=1;w<=12;w++)for(const day of DAYS){const v=num(localStorage.getItem(`wl_daily_${w}_${day}_${suffix}`));if(v==null)continue;const d=dateFor(w,day);pts.push({week:w,day,label:labelFor(w,day),time:d?d.getTime():w*10+(OFFSETS[day]||0),value:v})}return pts.sort((a,b)=>a.time-b.time)}
function cardioMilesPoints(){const pts=[];for(let w=1;w<=12;w++)for(const day of DAYS){let rows=[];try{rows=JSON.parse(localStorage.getItem(`wl_daily_${w}_${day}_cardio`)||'[]')}catch(e){}if(!Array.isArray(rows)||!rows.length)continue;let total=0,has=false;for(const item of rows){const v=num(item?.miles);if(v==null)continue;total+=v;has=true}if(!has)continue;const d=dateFor(w,day);pts.push({week:w,day,label:labelFor(w,day),time:d?d.getTime():w*10+(OFFSETS[day]||0),value:total})}return pts.sort((a,b)=>a.time-b.time)}
function trainingDurationPoints(){let hist=[];try{hist=JSON.parse(localStorage.getItem('wl_session_history')||'[]')}catch(e){}if(!Array.isArray(hist))return[];return hist.map((h,i)=>{const sec=num(h?.durationSec);if(sec==null||sec<=0)return null;let label='';if(/^\\d{4}-\\d{2}-\\d{2}$/.test(h?.date||'')){const m=h.date.match(/^(\\d{4})-(\\d{2})-(\\d{2})$/);label=`${Number(m[2])}/${Number(m[3])}`}else label=h?.date||`#${i+1}`;const time=Number(h?.startAt)||Number(h?.endAt)||i;return{label,time,value:sec/60}}).filter(Boolean).sort((a,b)=>a.time-b.time)}
function svgChart(points,unit,overview=false){
  if(!points.length)return '<div class="records-chart-empty">还没有记录</div>';
  const scrollable=!overview&&points.length>20,W=scrollable?Math.max(640,points.length*34):640,H=150,L=44,R=14,T=12,B=28,vals=points.map(p=>p.value),min0=Math.min(...vals),max0=Math.max(...vals),pad=Math.max((max0-min0)*.15,unit==='kg'?.3:unit==='h'?.25:unit==='mi'?.15:20),min=Math.max(0,min0-pad),max=max0+pad,range=max-min||1;
  const x=i=>L+(W-L-R)*(points.length===1?.5:i/(points.length-1)),y=v=>T+(H-T-B)*(1-(v-min)/range);
  let s=`<svg class="records-chart${scrollable?' records-chart-wide':''}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img"${scrollable?` style="width:${W}px"`:''}>`;
  for(let g=0;g<3;g++){const yy=T+(H-T-B)*g/2;s+=`<line class="records-chart-grid" x1="${L}" y1="${yy}" x2="${W-R}" y2="${yy}"></line><text class="records-chart-label records-y-label" x="2" y="${yy+3}">${fmt(max-(max-min)*g/2,unit==='kcal'?0:1)}</text>`}
  let path='';points.forEach((p,i)=>{path+=(i?' L':'M')+`${x(i)} ${y(p.value)}`});s+=`<path class="records-chart-line" d="${path}"></path>`;
  points.forEach((p,i)=>{s+=`<circle class="records-chart-dot" data-label="${p.label}" data-value="${p.value}" cx="${x(i)}" cy="${y(p.value)}" r="3"></circle>`});
  const step=overview?Math.max(1,Math.ceil(points.length/6)):(points.length>20?4:Math.max(1,Math.ceil(points.length/6)));
  points.forEach((p,i)=>{if(i%step===0||i===points.length-1)s+=`<text class="records-chart-label records-x-label" x="${x(i)}" y="${H-7}" text-anchor="middle">${p.label}</text>`});
  s+='</svg>';return s
}
function chartCard(title,pts,unit,metric){
  const avg=pts.length?pts.reduce((sum,p)=>sum+p.value,0)/pts.length:null,hasMany=pts.length>20;
  return `<div class="records-chart-card metric-${metric}"><div class="records-chart-head"><div class="records-chart-title">${title}</div><div class="records-chart-head-right"><div class="records-chart-latest">${avg!==null?`平均 <strong>${fmt(avg,unit==='kcal'?0:1)} ${unit}</strong>`:'暂无数据'}</div>${pts.length?`<button type="button" class="records-span-toggle" data-mode="detail">整体趋势</button>`:''}</div></div><div class="records-chart-detail${hasMany?' is-scrollable':''}"><div class="records-chart-scroll">${svgChart(pts,unit,false)}</div>${hasMany?'<div class="records-scroll-hint">左右滑动查看更多数据点</div>':''}</div><div class="records-chart-overview" hidden>${svgChart(pts,unit,true)}</div></div>`
}
function hideLegacyE1RM(){const best=$('#e1rmBest');const card=best?.closest('.tools-card');if(card)card.style.display='none'}
function render(){const tools=$('#toolsView');if(!tools)return false;hideLegacyE1RM();let box=$('#recordsDashboard',tools);if(!box){box=document.createElement('div');box.id='recordsDashboard';box.className='tools-card records-dashboard';const first=tools.querySelector('.tools-card');if(first)first.insertAdjacentElement('afterend',box);else tools.prepend(box)}const tp=trainingDurationPoints(),wp=metricPoints('weight'),cp=metricPoints('calories'),sp=metricPoints('sleep'),mp=cardioMilesPoints();box.innerHTML=`${chartCard('Training Duration',tp,'min','training')}${chartCard('Body Weight',wp,'kg','weight')}${chartCard('Calories Burned',cp,'kcal','calories')}${chartCard('Daily Miles',mp,'mi','miles')}${chartCard('Sleep',sp,'h','sleep')}<div class="records-note">超过 20 个数据点时可横向滑动逐点查看；“整体趋势”会把全部数据压缩到一屏。Daily Miles 会自动汇总同一天所有有氧记录。</div>`;return true}
let obs=null;function init(){render();if(obs)obs.disconnect();obs=new MutationObserver(()=>render());obs.observe(document.body,{childList:true,subtree:false})}
window.addEventListener('DOMContentLoaded',()=>setTimeout(init,260));window.addEventListener('pageshow',()=>setTimeout(render,300));window.addEventListener('wlDailyMetricsChanged',render);window.addEventListener('wlSessionHistoryChanged',render);document.addEventListener('click',e=>{if(e.target?.id==='tabTools')setTimeout(render,80)});
})();
