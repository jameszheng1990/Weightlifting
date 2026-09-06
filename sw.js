const CACHE="wl-plan-v2";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("activate",e=>e.waitUntil((async()=>{for(const k of await caches.keys()){if(k!==CACHE) await caches.delete(k)} await self.clients.claim()})()));
self.addEventListener("fetch",e=>{e.respondWith(fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))))});
