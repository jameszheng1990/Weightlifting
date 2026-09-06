const CACHE="wl-plan-v14-tools-trend";
const ASSETS=["./","./index.html","./app.css","./plan.js","./app.js","./warmup.js","./loader-integrated.css","./loader-integrated.js","./features.css","./features.js","./trend.js","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request,{cache:"no-store"}).catch(()=>caches.match("./index.html")));
    return;
  }
  e.respondWith(fetch(e.request,{cache:"no-store"}).catch(()=>caches.match(e.request)));
});
