'use strict';
let teamPresetWizard=null;
function presetCharacter(id){return roster.find(c=>c.id===id);}
function presetRelicName(value){return value.split('+').map(id=>relicSets.find(r=>r.id===id)?.name||id).join(' + ');}
function presetRelicLabel(value){return value.includes('+')?'2pc + 2pc · '+presetRelicName(value):'4pc · '+presetRelicName(value);}
function presetDefaultChoice(id,economy=true){
 const p=teamPresetProfiles[id];if(!p)throw new Error('Rekomendasi belum tersedia untuk '+id);
 const lc=economy?p.lcs.find(key=>key.startsWith('240'))||p.lcs.find(key=>(lightCones.find(l=>l.id===key)?.rarity||5)<5)||p.lcs[0]:p.lcs[0];
 return {lc,relic:p.relics[0],planar:p.planars[0],style:p.styles[0],superimposition:1,eidolon:0};
}
function buildPresetCharacter(id,choice){
 const c=presetCharacter(id),p=teamPresetProfiles[id],style=presetBuildStyles[choice?.style];
 if(!c||!p||!style||!p.lcs.includes(choice.lc)||!p.relics.includes(choice.relic)||!p.planars.includes(choice.planar)||!p.styles.includes(choice.style)||![1,2,3,4,5].includes(Number(choice.superimposition)))throw new Error('Pilihan build tidak valid.');
 const lc=lightCones.find(l=>l.id===choice.lc);if(!lc||lc.path!==c.path)throw new Error('Path Light Cone tidak sesuai '+c.name+'.');
 const rank=choice.eidolon===undefined?0:Number(choice.eidolon);if(!Number.isInteger(rank)||rank<0||rank>6)throw new Error('Eidolon harus E0 sampai E6.');
 const b=defaultBuild(c);b.eidolon=rank;b.lc=choice.lc;b.superimposition=Number(choice.superimposition);
 const sets=choice.relic.split('+');
 b.items.forEach(piece=>{
  const slot=relicSlots.find(s=>s.id===piece.slot);
  piece.set=slot.group==='planar'?choice.planar:sets.length===1?sets[0]:['head','hands'].includes(piece.slot)?sets[0]:sets[1];
  const at=['body','feet','sphere','rope'].indexOf(piece.slot);
  if(at>=0)piece.main=style.main[at]==='element'?'element:'+c.element:style.main[at];
  if(!slot.main.includes(piece.main))throw new Error('Main stat tidak sesuai '+slot.name+'.');
  // A deterministic, legal example history, not perfect or random farmed gear.
  const keys=[...style.subs,...substatKeys].filter((key,i,a)=>key!==piece.main&&a.indexOf(key)===i);
  if(choice.style==='hpCrit')keys.splice(0,keys.length,...keys.filter(k=>k!=='spdFlat'));
  const e=defaultRelicEnhancement(piece);e.level=15;e.initialCount=4;e.base=keys.slice(0,4).map(key=>({key,tier:1}));e.rolls=upgradeMilestones.map((_,i)=>({target:i%4,tier:1}));piece.enhancement=e;syncRelicSubstats(piece);
 });
 deriveSetAliases(b);
 const error=validateRelicBuild(c,b);if(error)throw new Error(c.name+': '+error);
 return {id:c.id,spd:lockedBase(c).spd,build:b};
}
function makePresetParty(preset,choices){
 if(!preset||preset.characters.length!==4||new Set(preset.characters).size!==4||!choices||choices.length!==4)throw new Error('Preset harus berisi empat karakter berbeda.');
 return preset.characters.map((id,i)=>buildPresetCharacter(id,choices[i]));
}
function openTeamPresets(){
 teamPresetWizard={step:'choose',selected:null,choices:[],slot:0,category:'all',tier:'all',evidence:'all',query:''};
 $('presetTeamError').textContent='';renderTeamPresetWizard();$('presetTeamDialog').showModal();
}
function selectTeamPreset(id){
 const preset=teamPresets.find(p=>p.id===id);if(!preset)throw new Error('Preset tidak ditemukan.');
 teamPresetWizard.selected=id;teamPresetWizard.choices=preset.characters.map(cid=>presetDefaultChoice(cid,preset.tier!=='premium'));teamPresetWizard.slot=0;teamPresetWizard.step='gear';renderTeamPresetWizard();
}
function filteredTeamPresets(){
 const w=teamPresetWizard,q=w.query.trim().toLowerCase();
 return teamPresets.filter(p=>(!w.evidence||w.evidence==='all'||p.evidence===w.evidence)&&(w.category==='all'||p.category===w.category)&&(w.tier==='all'||p.tier===w.tier)&&(!q||[p.name,presetCategories[p.category],...p.characters.map(id=>presetCharacter(id).name)].join(' ').toLowerCase().includes(q)));
}
function presetPortraits(preset){return preset.characters.map(id=>{const c=presetCharacter(id);return `<span><img src="${avatar(c)}" alt="" loading="lazy"><small>${esc(c.name)}</small></span>`;}).join('');}
function renderPresetList(){
 const list=filteredTeamPresets();$('presetTeamCount').textContent=list.length+' preset';
 $('presetTeamList').innerHTML=list.length?list.map(p=>`<button class="team-preset-card" data-team-preset="${p.id}"><span class="preset-card-top"><b>${esc(p.name)}</b><small class="preset-tier ${p.tier}">${presetTiers[p.tier]}</small></span><span class="preset-party-portraits">${presetPortraits(p)}</span><span class="preset-card-note">${presetEvidence[p.evidence]} ? ${p.checked}<br>${esc(p.note)}</span><span class="preset-card-link">Pilih tim & atur gear →</span></button>`).join(''):'<p class="preset-empty" role="status">Tidak ada preset yang cocok. Coba kategori lain atau hapus pencarian.</p>';
}
function presetSourceLinks(preset){return preset.sources.map(key=>{const [title,url]=presetSources[key];return `<a href="${url}" target="_blank" rel="noreferrer">${esc(title)} ↗</a>`;}).join('');}
function presetGearControl(id,field,title,values,current,label,imageType){
 const img=imageType==='lc'?`<img src="https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/image/light_cone_portrait/${current}.png" alt="" loading="lazy">`:gearIcon('relic',current.split('+')[0]);
 return `<label class="preset-gear-choice">${img}<span>${title}<select id="preset-${field}" data-preset-field="${field}" aria-label="${title} ${esc(presetCharacter(id).name)}">${values.map(value=>`<option value="${value}" ${value===current?'selected':''}>${esc(label(value))}</option>`).join('')}</select></span></label>`;
}
function renderTeamPresetWizard(){
 const w=teamPresetWizard;if(!w)return;
 $('presetTeamError').textContent='';
 $('presetTeamSteps').innerHTML=['Pilih tim','Gear & Eidolon','Tinjau & terapkan'].map((label,i)=>`<span class="${i===['choose','gear','review'].indexOf(w.step)?'current':''}">${i+1}. ${label}</span>`).join('');
 if(w.step==='choose'){
  $('presetTeamBody').innerHTML=`<p class="preset-help">Diperbarui 8 November 2026 ? versi 4.6. Acuan meta tampil pertama, diikuti adaptasi dan tim klasik. Gunakan filter acuan untuk melihat hanya tim meta. Pilih tim, lalu sesuaikan gear dan Eidolon tiap karakter. F2P di sini berarti tanpa karakter limited 5★; sebagian 4★ tetap berasal dari warp. Mono berarti empat karakter dengan Path yang sama.</p><div class="preset-filters"><label>Acuan<select id="presetTeamEvidence"><option value="all">Semua acuan</option>${Object.entries(presetEvidence).map(([key,name])=>`<option value="${key}" ${w.evidence===key?'selected':''}>${name}</option>`).join('')}</select></label><input id="presetTeamSearch" type="search" placeholder="Cari preset atau karakter…" aria-label="Cari preset tim"><label>Gaya bermain<select id="presetTeamCategory"><option value="all">Semua gaya</option>${Object.entries(presetCategories).map(([key,name])=>`<option value="${key}" ${w.category===key?'selected':''}>${name}</option>`).join('')}</select></label><label>Investasi<select id="presetTeamTier"><option value="all">Semua investasi</option>${Object.entries(presetTiers).map(([key,name])=>`<option value="${key}" ${w.tier===key?'selected':''}>${name}</option>`).join('')}</select></label></div><div id="presetTeamCount" role="status"></div><div id="presetTeamList" class="team-preset-grid"></div>`;
  $('presetTeamEvidence').onchange=()=>{w.evidence=$('presetTeamEvidence').value;renderPresetList();};
  $('presetTeamSearch').value=w.query;
  $('presetTeamSearch').oninput=()=>{w.query=$('presetTeamSearch').value;renderPresetList();};
  $('presetTeamCategory').onchange=()=>{w.category=$('presetTeamCategory').value;renderPresetList();};
  $('presetTeamTier').onchange=()=>{w.tier=$('presetTeamTier').value;renderPresetList();};
  $('presetTeamFooter').innerHTML='<button data-preset-action="cancel">Batal</button>';renderPresetList();return;
 }
 const preset=teamPresets.find(p=>p.id===w.selected);
 const header=`<div class="preset-selected"><div><span class="preset-tier ${preset.tier}">${presetTiers[preset.tier]}</span><h3>${esc(preset.name)}</h3><p>${esc(preset.note)}</p></div><button data-preset-action="choose">Ganti preset</button></div><details class="preset-sources"><summary>Acuan tim & batas rekomendasi</summary><p>Rangkuman panduan fans dan showcase komunitas. Varian hemat adalah adaptasi; bukan rekomendasi resmi HoYoverse. Kit lengkap, DoT, follow-up, memosprite, dan Elation belum seluruhnya dieksekusi engine latihan.</p>${presetSourceLinks(preset)}</details>`;
 if(w.step==='gear'){
  const id=preset.characters[w.slot],c=presetCharacter(id),p=teamPresetProfiles[id],choice=w.choices[w.slot];
  $('presetTeamBody').innerHTML=header+`<nav class="preset-slot-tabs" aria-label="Karakter preset">${preset.characters.map((cid,i)=>`<button data-preset-slot="${i}" aria-pressed="${w.slot===i}" class="${w.slot===i?'chosen':''}"><img src="${avatar(presetCharacter(cid))}" alt=""><span>${i+1}. ${esc(presetCharacter(cid).name)}</span></button>`).join('')}</nav><section class="preset-build-editor"><div class="preset-character-heading"><img src="${avatar(c)}" alt=""><div><h3>${esc(c.name)}</h3><p>${c.path} · ${c.element} · Lv.80 / E${choice.eidolon||0}</p><a href="${p.source}" target="_blank" rel="noreferrer">Acuan build: Prydwen ↗</a></div></div>${presetEidolonPanel(c,choice)}<div class="preset-budget-tools"><button data-preset-action="economy">Pilihan LC ekonomis</button><button data-preset-action="recommended">Pilihan LC utama / signature</button></div><div class="preset-gear-controls">${presetGearControl(id,'lc','Light Cone',p.lcs,choice.lc,value=>{const l=lightCones.find(l=>l.id===value);return (signatureLC(c)?.id===value?'SIGNATURE ? ':'')+l.name+' · '+l.rarity+'★'+(value.startsWith('240')?' · Herta Shop':'');},'lc')}${presetGearControl(id,'relic','Relic',p.relics,choice.relic,presetRelicLabel,'relic')}${presetGearControl(id,'planar','Planar',p.planars,choice.planar,value=>'2pc · '+planarSets.find(p=>p.id===value).name,'relic')}</div><div class="preset-build-settings"><label>Profil main stat<select data-preset-field="style" id="preset-style">${p.styles.map(key=>`<option value="${key}" ${choice.style===key?'selected':''}>${presetBuildStyles[key].label}</option>`).join('')}</select></label><label>Superimposition<select data-preset-field="superimposition" id="preset-superimposition">${[1,2,3,4,5].map(n=>`<option value="${n}" ${choice.superimposition===n?'selected':''}>S${n}</option>`).join('')}</select></label></div><p class="preset-main-stats">${presetBuildStyles[choice.style].main.map((key,i)=>['Body','Feet','Sphere','Rope'][i]+': '+statCaption(key==='element'?'element:'+c.element:key)).join(' · ')}</p>${p.note?`<p class="preset-help">${esc(p.note)}</p>`:''}<p class="preset-help">Memasang 4 relic + 2 planar pada +15, dengan roll substat contoh yang legal. Ambang SPD/EHR dan stat akhir masih bisa disesuaikan di editor.</p></section>`;
  $('presetTeamFooter').innerHTML=`<button data-preset-action="${w.slot?'previous':'choose'}">← ${w.slot?'Karakter sebelumnya':'Daftar tim'}</button><span>${w.slot+1} / 4</span><button class="gold" data-preset-action="next">${w.slot===3?'Tinjau party':'Karakter berikutnya'} →</button>`;
 }else{
  const party=makePresetParty(preset,w.choices);
  $('presetTeamBody').innerHTML=header+`<p class="preset-help">Keempat karakter dan gear di bawah akan mengganti party menu saat diterapkan. Battle yang sedang berjalan memakai snapshot sebelumnya.</p><div class="preset-review-grid">${party.map((cfg,i)=>{const c=presetCharacter(cfg.id),b=cfg.build,ch=w.choices[i];return `<article><div class="preset-character-heading"><img src="${avatar(c)}" alt=""><div><h3>${esc(c.name)}</h3><small>Slot ${i+1} · ${c.path} · E${b.eidolon||0}</small></div></div><p>${gearIcon('lc',b.lc)} <b>${esc(lcFor(b).name)}</b> · S${b.superimposition}</p><p>${gearIcon('relic',ch.relic.split('+')[0])} ${esc(presetRelicLabel(ch.relic))}</p><p>${gearIcon('relic',b.planar)} 2pc · ${esc(planarSets.find(p=>p.id===b.planar).name)}</p><small>${presetBuildStyles[ch.style].label} · 6 piece +15</small><button data-preset-slot="${i}">Ubah build ${esc(c.name)}</button></article>`;}).join('')}</div>`;
  $('presetTeamFooter').innerHTML='<button data-preset-action="edit">← Kembali ke gear</button><button class="gold" data-preset-action="apply">Terapkan ke party →</button>';
 }
 $('presetTeamDialog').scrollTop=0;
}
function applyTeamPreset(){
 const w=teamPresetWizard;if(!w||w.step!=='review')return false;
 const preset=teamPresets.find(p=>p.id===w.selected);
 // Build and validate all four before replacing anything in the menu.
 const party=makePresetParty(preset,w.choices);
 teamConfig=party;menuSlot=0;teamPresetWizard=null;
 $('presetTeamDialog').close();preloadTeamPortraits();renderLobby();
 $('teamPresetStatus').textContent='Preset terakhir: '+preset.name+' · karakter, gear, dan Eidolon sudah diterapkan.';
 return true;
}
function handlePresetAction(action){
 const w=teamPresetWizard;if(!w)return;
 if(action==='cancel'){teamPresetWizard=null;$('presetTeamDialog').close();return;}
 if(action==='choose'){w.step='choose';renderTeamPresetWizard();return;}
 if(action==='apply'){applyTeamPreset();return;}
 if(action==='previous')w.slot=Math.max(0,w.slot-1);
 if(action==='next'){if(w.slot<3)w.slot++;else w.step='review';}
 if(action==='edit'){w.step='gear';w.slot=3;}
 if(action==='economy'||action==='recommended'){
  const p=teamPresets.find(p=>p.id===w.selected),old=w.choices[w.slot];
  w.choices[w.slot]={...old,lc:presetDefaultChoice(p.characters[w.slot],action==='economy').lc};
 }
 renderTeamPresetWizard();
}
$('teamPresetBtn').onclick=openTeamPresets;
$('presetTeamClose').onclick=()=>handlePresetAction('cancel');
$('presetTeamDialog').oncancel=()=>{teamPresetWizard=null;};
$('presetTeamBody').onchange=event=>{
 const field=event.target.dataset?.presetField;if(!field||!teamPresetWizard)return;
 try{const w=teamPresetWizard,scroll=$('presetTeamDialog').scrollTop,focus=event.target.id;w.choices[w.slot][field]=['superimposition','eidolon'].includes(field)?Number(event.target.value):event.target.value;renderTeamPresetWizard();$('presetTeamDialog').scrollTop=scroll;if(focus)$(focus)?.focus?.({preventScroll:true});}catch(error){$('presetTeamError').textContent=error.message;}
};
document.addEventListener('click',event=>{
 const select=event.target.closest('[data-team-preset]'),slot=event.target.closest('[data-preset-slot]'),action=event.target.closest('[data-preset-action]');
 if(!select&&!slot&&!action)return;
 try{
  if(select)selectTeamPreset(select.dataset.teamPreset);
  if(slot&&teamPresetWizard){const i=Number(slot.dataset.presetSlot);if(Number.isInteger(i)&&i>=0&&i<4){teamPresetWizard.slot=i;teamPresetWizard.step='gear';renderTeamPresetWizard();}}
  if(action)handlePresetAction(action.dataset.presetAction);
 }catch(error){$('presetTeamError').textContent=error.message;}
});
