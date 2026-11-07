'use strict';
const portraitCache=new Map();
let visiblePortraitId=null;
function portraitPlaceholder(c){return 'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480"><rect width="320" height="480" fill="#292637"/><text x="160" y="255" font-size="65" text-anchor="middle" fill="#e7d3ac">${c.name.replace(/[^a-zA-Z ]/g,'').slice(0,2)}</text></svg>`);}
function preloadPortrait(c){
 if(portraitCache.has(c.id))return portraitCache.get(c.id);
 if(portraitCache.size>=12){const keep=new Set(teamConfig.map(x=>x.id));for(const key of portraitCache.keys()){if(key!==visiblePortraitId&&!keep.has(key)){portraitCache.delete(key);break;}}}
 const item={status:'loading',src:art(c)};portraitCache.set(c.id,item);
 if(typeof Image==='undefined')return item;
 const full=new Image();const thumb=new Image();item.image=full;item.thumbnail=thumb;thumb.src=avatar(c);
 full.onload=async()=>{try{if(full.decode)await full.decode();}catch{}item.status='ready';if(visiblePortraitId===c.id)showPortraitSource(c,item.src);};
 full.onerror=()=>{item.status='failed';};full.src=item.src;return item;
}
function showPortraitSource(c,src){const img=$('activeArt');if(visiblePortraitId!==c.id||img.dataset.source===src)return;img.dataset.source=src;img.alt=c.name;img.onerror=()=>{if(visiblePortraitId!==c.id)return;const fallback=src===avatar(c)?portraitPlaceholder(c):avatar(c);showPortraitSource(c,fallback);};img.src=src;}
function setActivePortrait(c){const item=preloadPortrait(c);if(visiblePortraitId===c.id)return;visiblePortraitId=c.id;showPortraitSource(c,item.status==='ready'?item.src:avatar(c));}
function preloadTeamPortraits(){teamConfig.forEach(cfg=>{const c=roster.find(x=>x.id===cfg.id);if(c)preloadPortrait(c);});}
