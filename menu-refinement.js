'use strict';
function pickerMatchesSlot(slot){return pickerTarget==='all'||pickerTarget===slot||(pickerTarget==='pair-a'&&['head','hands'].includes(slot))||(pickerTarget==='pair-b'&&['body','feet'].includes(slot));}
const drawEquipmentOverview=drawBuildPanel;
drawBuildPanel=function(){
 drawEquipmentOverview();
 const c=draftCharacter();
 const panel=$('buildPanel');
 const html=panel.innerHTML;
 const start=html.indexOf('<div class="loadout-overview">');
 const end=html.indexOf('<section class="affix-workspace">');
 const b=buildDraft[buildSlot].build;
 panel.innerHTML=html.slice(0,start)+`<div class="loadout-overview refined-overview"><section class="overview-character portrait-only"><img src="${art(c)}" alt="${esc(c.name)}"></section><section class="equipment-controls"><div class="character-choice-controls"><label>Slot karakter <select id="overviewSlot">${buildDraft.map((cfg,i)=>`<option value="${i}" ${i===buildSlot?'selected':''}>${i+1} · ${esc(roster.find(c=>c.id===cfg.id).name)}</option>`).join('')}</select></label><button data-open-gear="character">Pilih karakter <b>↗</b></button><small>${esc(c.name)} · ${c.path} · ${c.element} · Lv.80 / E${b.eidolon||0}</small></div><div class="equipment-three">${['lc','relic','planar'].map(type=>overviewGearCard(type,b,c)).join('')}</div></section></div>`+html.slice(end);
 updateBuildPreview();
 if($('retryTraces'))$('retryTraces').onclick=loadAutomaticTraces;
};
lobbyTeam=function(){return teamConfig.map((cfg,i)=>{const c=roster.find(c=>c.id===cfg.id);return `<article class="menu-party-card portrait-only ${i===menuSlot?'chosen':''}"><button class="party-art-button" data-menu-slot="${i}" aria-label="Slot ${i+1}: ${esc(c.name)}"><img src="${art(c)}" alt="${esc(c.name)}"></button></article>`;}).join('');};
renderMenuGearShortcut=function(){const cfg=teamConfig[menuSlot],c=roster.find(c=>c.id===cfg.id),b=normalizeBuild(cfg);$('gearShortcutName').textContent=c.name;$('gearShortcutPath').textContent=c.path+' / '+c.element;$('gearShortcutIcons').innerHTML=`<label class="lobby-slot-choice">Slot karakter<select id="lobbyMenuSlot">${teamConfig.map((cfg,i)=>`<option value="${i}" ${i===menuSlot?'selected':''}>${i+1} · ${esc(roster.find(c=>c.id===cfg.id).name)}</option>`).join('')}</select></label><button data-lobby-gear="character"><img src="${avatar(c)}" alt=""><span>Pilih karakter</span></button>${[['lc',b.lc],['relic',b.relic],['planar',b.planar]].map(([type,id])=>`<button data-lobby-gear="${type}">${gearIcon(type,id)}<span>${type==='lc'?'Light Cone':type==='relic'?'Relic / 2pc + 2pc':'Planar'}</span></button>`).join('')}`;$('lobbyMenuSlot').onchange=()=>{menuSlot=Number($('lobbyMenuSlot').value);renderLobby();};$('lobbyTeamBtn').innerHTML='Atur main stat & substat ↗';};
document.addEventListener('click',e=>{const button=e.target.closest('[data-lobby-gear]');if(button){openTeam(menuSlot,'relic');openGearPicker(button.dataset.lobbyGear);}});
renderLobby();
