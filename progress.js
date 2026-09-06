(()=>{
  const DAY_ORDER=['\u5468\u4e00','\u5468\u4e8c','\u5468\u56db','\u5468\u4e94'];
  function load(k){return localStorage.getItem(k)||''}
  function expectedIds(w){
    const p=(typeof plan!=='undefined'&&plan[w-1])?plan[w-1]:null;
    if(!p||!p.days)return[];
    const ids=[];
    Object.entries(p.days).forEach(([day,d])=>{
      if(d.main) d.main.forEach((_,i)=>ids.push(`wl_${w}_${day}_main_${i}_done`));
      if(d.choiceMain){ids.push(`wl_${w}_${day}_choiceMain_0_done`);ids.push(`wl_${w}_${day}_choicePull_0_done`)}
      if(d.assist) d.assist.forEach((_,i)=>ids.push(`wl_${w}_${day}_assist_${i}_done`));
    });
    return ids;
  }
  function weekComplete(w){const ids=expectedIds(w);return ids.length>0&&ids.every(k=>load(k)==='1')}
  function completedCount(){let n=0;for(let w=1;w<=12;w++)if(weekComplete(w))n++;return n}
  function ensureCard(){
    if(document.getElementById('cycleProgressCard'))return;
    const tabs=document.getElementById('weekTabs');
    if(!tabs||!tabs.parentNode)return;
    const card=document.createElement('div');card.id='cycleProgressCard';card.className='card';
    card.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><div><strong style="font-size:17px">12\u5468\u5468\u671f\u8fdb\u5ea6</strong><div class="small">\u6574\u5468\u6240\u6709\u9879\u76ee\u90fd\u5b8c\u6210\u540e\uff0c\u8be5\u5468\u624d\u8ba1\u5165\u8fdb\u5ea6\u3002</div></div><span class="badge" id="cycleProgressText">0 / 12 \u5468</span></div><div class="progress"><div id="cycleProgressBar"></div></div>';
    tabs.parentNode.insertBefore(card,tabs);
  }
  function ensureStyle(){
    if(document.getElementById('cycleProgressStyle'))return;
    const s=document.createElement('style');s.id='cycleProgressStyle';
    s.textContent='button.week-complete{background:#dcfce7!important;color:#166534!important;border:1px solid #86efac!important}button.week-complete.active{background:#166534!important;color:#fff!important}.cycle-complete{border-color:#86efac!important;background:#f0fdf4!important}';
    document.head.appendChild(s);
  }
  function update(){
    ensureStyle();ensureCard();
    const n=completedCount();
    const t=document.getElementById('cycleProgressText');if(t)t.textContent=`${n} / 12 \u5468`;
    const b=document.getElementById('cycleProgressBar');if(b)b.style.width=`${n/12*100}%`;
    const c=document.getElementById('cycleProgressCard');if(c)c.classList.toggle('cycle-complete',n===12);
    const tabs=document.querySelectorAll('#weekTabs button');
    tabs.forEach((btn,i)=>btn.classList.toggle('week-complete',weekComplete(i+1)));
    const badge=document.getElementById('weekBadge');
    if(badge&&typeof currentWeek!=='undefined'&&weekComplete(currentWeek))badge.textContent='\u2705 \u5b8c\u6210';
  }
  function hook(){
    if(typeof render==='function'&&!render.__cycleWrapped){
      const old=render;
      window.render=function(){const r=old.apply(this,arguments);setTimeout(update,0);return r};
      window.render.__cycleWrapped=true;
    }
    document.addEventListener('change',()=>setTimeout(update,0));
    document.addEventListener('click',()=>setTimeout(update,60));
    setInterval(update,1200);
    update();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();