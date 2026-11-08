'use strict';
let quickRelicSlot='head',relicAdvancedOpen=false,statSummaryOpen=false;
function quickRelicRollCounts(piece){
 const e=ensureRelicEnhancement(piece),counts=[0,0,0,0],start=e.initialCount===3?1:0;
 for(let i=start;i<Math.floor(e.level/3);i++)counts[e.rolls[i].target]++;
 return counts;
}
function setQuickRelicRolls(piece,index,value){
 if(!Number.isInteger(index)||index<0||index>3)return false;
 const e=ensureRelicEnhancement(piece),counts=quickRelicRollCounts(piece),budget=counts.reduce((a,b)=>a+b,0);
 if(!Number.isInteger(value)||value<0||value>budget)return false;
 let delta=value-counts[index];counts[index]=value;
 if(delta>0){for(let i=3;i>=0&&delta>0;i--){if(i===index)continue;const take=Math.min(delta,counts[i]);counts[i]-=take;delta-=take;}}
 else if(delta<0)counts[index===0?1:0]-=delta;
 const targets=counts.flatMap((count,i)=>Array(count).fill(i));
 const start=e.initialCount===3?1:0;targets.forEach((target,i)=>e.rolls[i+start].target=target);
 syncRelicSubstats(piece);return true;
}
const detailedRelicPieces=renderRelicPieces;
renderRelicPieces=function(c,b){
 const detail=detailedRelicPieces(c,b),slot=relicSlots.find(s=>s.id===quickRelicSlot)||relicSlots[0],piece=b.items.find(p=>p.slot===slot.id),e=ensureRelicEnhancement(piece),totals=calculatedRelicSubs(piece),counts=quickRelicRollCounts(piece),budget=counts.reduce((a,b)=>a+b,0);
 const set=(slot.group==='relic'?relicSets:planarSets).find(s=>s.id===piece.set);
 return `<div class="quick-relic-intro"><div><h3>Atur Relic, satu per satu.</h3><p>Pilih slot, tentukan statistik, lalu lihat hasilnya langsung.</p></div><button data-quick-max-all>Semua ke +15</button></div><nav class="quick-relic-tabs" aria-label="Pilih slot Relic">${relicSlots.map(s=>`<button data-quick-slot="${s.id}" class="${slot.id===s.id?'chosen':''}" aria-pressed="${slot.id===s.id}">${s.name}<small>+${ensureRelicEnhancement(b.items.find(p=>p.slot===s.id)).level}</small></button>`).join('')}</nav><section class="quick-relic-card"><div class="quick-relic-heading"><div><span class="eyebrow">${slot.name}</span><h4>${esc(set?.name||'Belum dipasang')}</h4></div><span class="quick-level">+${e.level}</span></div>${piece.set==='none'?'<p class="quick-relic-notice">Pilih set di bagian atas agar statistik ini aktif.</p>':''}<div class="quick-main-fields"><label>Statistik utama<select data-quick-field="main" ${slot.main.length===1?'disabled':''}>${slot.main.map(key=>`<option value="${key}" ${key===piece.main?'selected':''}>${statCaption(key)}</option>`).join('')}</select><small>${relicStatText(piece.main,relicMainValue(piece.main,e.level))}</small></label><label>Level Relic<select data-quick-field="level">${Array.from({length:16},(_,level)=>`<option value="${level}" ${e.level===level?'selected':''}>+${level}</option>`).join('')}</select><small>Maksimal +15</small></label></div><div class="quick-sub-heading"><h4>Statistik tambahan</h4><small>Hasil akhir</small></div><div class="quick-sub-list">${e.base.map((sub,i)=>`<div class="quick-sub-row"><label><span>Statistik ${i+1}</span><select data-quick-field="key" data-quick-index="${i}">${substatKeys.filter(key=>key!==piece.main&&(key===sub.key||!e.base.some(s=>s.key===key))).map(key=>`<option value="${key}" ${key===sub.key?'selected':''}>${statCaption(key)}</option>`).join('')}</select></label><label class="quick-roll-count"><span>Peningkatan</span><input type="number" inputmode="numeric" min="0" max="${budget}" step="1" value="${counts[i]}" data-quick-field="rolls" data-quick-index="${i}" ${budget?'':'disabled'}></label><output>${totals[i].key==='none'?'—':relicStatText(sub.key,totals[i].value)}</output></div>`).join('')}</div><p class="quick-relic-help">Bagi peningkatan ke statistik yang kamu inginkan. Jatah statistik lain menyesuaikan otomatis; hasil akhir tetap dihitung dari roll yang valid.</p><div class="quick-relic-actions"><button data-quick-even>Bagi rata</button><button data-quick-random>Acak ke +15</button></div></section><details class="relic-advanced" ${relicAdvancedOpen?'open':''}><summary>Pengaturan rinci & riwayat roll</summary>${detail}</details>`;
};
function redrawQuickRelic(){const scroll=$('teamDialog').scrollTop;drawBuildPanel();$('teamDialog').scrollTop=scroll;}
const buildChangeBeforeQuick=$('buildPanel').onchange;
$('buildPanel').onchange=event=>{
 const field=event.target.dataset?.quickField;if(!field){buildChangeBeforeQuick?.(event);return;}
 const piece=buildDraft[buildSlot].build.items.find(p=>p.slot===quickRelicSlot),e=ensureRelicEnhancement(piece),index=Number(event.target.dataset.quickIndex),value=event.target.value;
 if(field==='level'&&Number.isInteger(+value)&&+value>=0&&+value<=15)e.level=+value;
 if(field==='main'&&relicSlots.find(s=>s.id===piece.slot).main.includes(value)){piece.main=value;repairRelicKeys(piece);}
 if(field==='key'&&e.base[index]&&substatKeys.includes(value)&&value!==piece.main&&!e.base.some((sub,i)=>i!==index&&sub.key===value))e.base[index].key=value;
 if(field==='rolls')setQuickRelicRolls(piece,index,+value);
 syncRelicSubstats(piece);redrawQuickRelic();
};
document.addEventListener('click',event=>{
 const tab=event.target.closest('[data-quick-slot]');if(tab){quickRelicSlot=tab.dataset.quickSlot;redrawQuickRelic();return;}
 const action=event.target.closest('[data-quick-even],[data-quick-random],[data-quick-max-all]');if(!action)return;
 const b=buildDraft[buildSlot].build,piece=b.items.find(p=>p.slot===quickRelicSlot);
 if(action.hasAttribute('data-quick-max-all'))b.items.forEach(p=>{while(upgradeRelicPiece(p)){};});
 if(action.hasAttribute('data-quick-random')){ensureRelicEnhancement(piece).level=0;while(upgradeRelicPiece(piece)){};}
 if(action.hasAttribute('data-quick-even')){const e=ensureRelicEnhancement(piece),start=e.initialCount===3?1:0;for(let i=start;i<Math.floor(e.level/3);i++)e.rolls[i].target=(i-start)%4;syncRelicSubstats(piece);}
 redrawQuickRelic();
});
document.addEventListener('toggle',event=>{
 if(event.target.classList?.contains('relic-advanced'))relicAdvancedOpen=event.target.open;
 if(event.target.classList?.contains('simple-stat-summary'))statSummaryOpen=event.target.open;
},true);
const updateBeforeSimpleSummary=updateBuildPreview;
updateBuildPreview=function(){updateBeforeSimpleSummary();const box=$('buildPreview');box.innerHTML=`<details class="simple-stat-summary" ${statSummaryOpen?'open':''}><summary>Lihat total statistik karakter</summary>${box.innerHTML}</details>`;};
const encounterBeforeSimple=renderEncounterPreview;
renderEncounterPreview=function(mode,index){
 const reference=encounterBeforeSimple(mode,index),challenge=challenges[mode][index];
 const waves=challenge.waves.map((names,i)=>`<section class="simple-encounter-wave"><h4>Gelombang ${i+1}</h4><div>${names.map(name=>`<span class="simple-enemy-chip"><img src="${enemyImage(name)}" alt="" loading="lazy"><b>${esc(enemyText(name))}</b></span>`).join('')}</div></section>`).join('');
 return `<div class="simple-encounter-intro"><h3>Lawan yang akan kamu hadapi</h3><p>Ini susunan musuh latihan yang dimainkan. Rincian rotasi referensi bisa dibuka di bawah.</p></div>${waves}<details class="simple-encounter-reference"><summary>Lihat referensi & aturan lengkap</summary>${reference}</details>`;
};
const renderLobbyBeforeSimple=renderLobby;
renderLobby=function(){renderLobbyBeforeSimple();if(lobbyMode==='custom'||lobbyVersion==='4.7')return;document.querySelectorAll('#lobbyPresets .node-option small').forEach((small,index)=>{const c=challenges[lobbyMode][index];small.textContent=`${c.waves.length} gelombang · ${c.waves.reduce((n,w)=>n+w.length,0)} musuh`;});};
renderLobby();

// Every new document shows the welcome. Dismissing it never changes saved teams.
if(document.body?.append&&typeof document.createElement==='function'){
 const dialog=document.createElement('dialog');dialog.id='fanWelcome';dialog.className='fan-welcome';dialog.setAttribute('aria-labelledby','fanWelcomeTitle');dialog.setAttribute('aria-describedby','fanWelcomeMessage');
 dialog.innerHTML=`<div class="fan-welcome-top"><span class="fan-welcome-badge">FANMADE · MADE WITH LOVE</span><button id="fanWelcomeClose" class="close" aria-label="Tutup sambutan" autofocus>&#10005;</button></div><div class="fan-welcome-art"><span class="welcome-doodle doodle-one">✦</span><img src="assets/welcome-chibis.png" alt="Evernight dan Evanescia versi chibi menyambutmu" width="1536" height="1024" fetchpriority="high"><span class="welcome-doodle doodle-two">♡</span></div><div class="fan-welcome-copy"><span class="eyebrow">DARI PENGGEMAR, UNTUK PENGGEMAR</span><h2 id="fanWelcomeTitle">Psst… ini tempat main kita!</h2><p id="fanWelcomeMessage">Web ini buatan penggemar, buat ngetes tim, utak-atik perlengkapan, dan seru-seruan bareng karakter Honkai: Star Rail.</p><p class="fan-welcome-note">Angka dan mekaniknya memakai model latihan. Hasilnya bisa berbeda dari game asli.</p><div class="fan-welcome-disclaimer">Tidak resmi dan tidak berafiliasi dengan HoYoverse.</div><button id="fanWelcomeStart" class="gold">Oke, waktunya eksperimen! <span>↗</span></button><button id="fanWelcomeGuide">Lihat panduan dulu</button><label class="welcome-language">Bahasa / Language<select id="welcomeLanguage"><option value="id">Indonesia</option><option value="en">English</option></select></label></div>`;
 document.body.append(dialog);
 const close=()=>dialog.close();
 $('fanWelcomeClose').onclick=close;$('fanWelcomeStart').onclick=close;
 $('fanWelcomeGuide').onclick=()=>{close();$('guideDialog').showModal();};
 $('welcomeLanguage').value=window.stellarLanguage?.get()||'id';
 $('welcomeLanguage').onchange=event=>window.stellarLanguage?.set(event.target.value);
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)close();});
 dialog.showModal();
}
