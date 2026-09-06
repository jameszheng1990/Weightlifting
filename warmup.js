(function(){
  function r25(x){return Math.round(x/2.5)*2.5}
  function kg(x){return (Math.round(x*10)%10===0?Math.round(x):x.toFixed(1))+" kg"}
  function parseWorkWeight(rx,fallback){
    const m=(rx||"").match(/(\d+(?:\.\d+)?)(?:\s*[–-]\s*(\d+(?:\.\d+)?))?\s*kg/i);
    if(m) return Number(m[1]);
    return fallback;
  }
  function box(lines,compact){
    const d=document.createElement("div");
    d.className="warmup-box";
    d.innerHTML=`<div class="warmup-title">热身${compact?"（已热身，缩短）":""} <span>不计入进度</span></div><div class="warmup-steps">${lines.map(x=>`<span>${x}</span>`).join("<b>→</b>")}</div>`;
    return d;
  }
  function full(weight){
    return ["空杆 × 10",`${kg(r25(weight*.50))} × 5`,`${kg(r25(weight*.65))} × 4`,`${kg(r25(weight*.80))} × 2`,`${kg(r25(weight*.90))} × 1`,"正式组"];
  }
  function short(weight){
    return [`${kg(r25(weight*.60))} × 3`,`${kg(r25(weight*.80))} × 2`,`${kg(r25(weight*.90))} × 1`,"正式组"];
  }
  let obs=null,root=null;
  function inject(){
    root=document.getElementById("content");
    if(!root) return;
    if(obs) obs.disconnect();
    root.querySelectorAll(".warmup-box,.warmup-record").forEach(e=>e.remove());
    const cards=[...root.querySelectorAll(":scope > .card")];
    cards.forEach(card=>{
      const h=card.querySelector("h3");
      if(!h) return;
      const day=(h.textContent||"").trim();
      if(day.startsWith("周一")){
        const ex=[...card.querySelectorAll(".exercise")];
        const bs=ex.find(e=>/Back Squat/i.test(e.querySelector(".exname")?.textContent||"")&&!/Paused/i.test(e.querySelector(".exname")?.textContent||""));
        const fs=ex.find(e=>/Front Squat/i.test(e.querySelector(".exname")?.textContent||""));
        if(bs){const rx=bs.querySelector(".prescription")?.textContent||"";bs.before(box(full(parseWorkWeight(rx,trainingMaxes.bs*.75)),false));}
        if(fs){const rx=fs.querySelector(".prescription")?.textContent||"";fs.before(box(short(parseWorkWeight(rx,trainingMaxes.fs*.75)),true));}
      }
      if(day.startsWith("周五")){
        const ex=[...card.querySelectorAll(".exercise")];
        const fs=ex.find(e=>/Front Squat/i.test(e.querySelector(".exname")?.textContent||""));
        const pbs=ex.find(e=>/Paused Back Squat/i.test(e.querySelector(".exname")?.textContent||""));
        if(fs){const rx=fs.querySelector(".prescription")?.textContent||"";fs.before(box(full(parseWorkWeight(rx,trainingMaxes.fs*.80)),false));}
        if(pbs){const rx=pbs.querySelector(".prescription")?.textContent||"";pbs.before(box(short(parseWorkWeight(rx,trainingMaxes.bs*.70)),true));}
      }
    });
    if(obs&&root)obs.observe(root,{childList:true,subtree:true});
  }
  const style=document.createElement("style");
  style.textContent=`.warmup-box{margin:8px 0 10px;padding:10px 12px;border:1px dashed #cbd5e1;border-radius:12px;background:#f8fafc}.warmup-title{font-size:12px;font-weight:700;color:#475569;margin-bottom:6px}.warmup-title span{font-weight:500;color:#94a3b8;margin-left:5px}.warmup-steps{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:13px;color:#334155}.warmup-steps span{white-space:nowrap}.warmup-steps b{font-weight:400;color:#94a3b8}@media(max-width:520px){.warmup-steps{line-height:1.7}}`;
  document.head.appendChild(style);
  obs=new MutationObserver(muts=>{
    const relevant=muts.some(m=>[...m.addedNodes,...m.removedNodes].some(n=>n.nodeType===1&&!n.matches?.('.warmup-box,.warmup-record,.set-tracker,.feature-actions,.load-btn,.set-timer-proxy')&&!n.closest?.('.warmup-box,.warmup-record,.set-tracker')));
    if(!relevant)return;
    clearTimeout(window.__warmupTimer);window.__warmupTimer=setTimeout(inject,40);
  });
  window.addEventListener("DOMContentLoaded",()=>{root=document.getElementById("content");if(root)obs.observe(root,{childList:true,subtree:true});setTimeout(inject,80)});
  window.addEventListener("pageshow",()=>setTimeout(inject,80));
})();
