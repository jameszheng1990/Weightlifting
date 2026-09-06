const CACHE="wl-plan-v12-progress-script";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icon.svg","./progress.js"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request,{cache:"no-store"}).then(async r=>{
      const ct=r.headers.get("content-type")||"";
      if(!ct.includes("text/html")) return r;
      let h=await r.text();
      if(!h.includes("progress.js")) h=h.replace("</body>",'<script src="./progress.js?v=12"></script></body>');
      const headers=new Headers(r.headers);
      headers.delete("content-length");
      headers.set("cache-control","no-store");
      return new Response(h,{status:r.status,statusText:r.statusText,headers});
    }).catch(()=>caches.match("./index.html")));
    return;
  }
  if(new URL(e.request.url).pathname.endsWith("/progress.js")){
    e.respondWith(fetch(e.request,{cache:"no-store"}).catch(()=>caches.match("./progress.js")));
    return;
  }
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});