'use strict';
let lobbyMode='moc',lobbyPreset=0,hasEnteredBattle=false;
let lobbyVersion='4.6';
let customEnemies=['Silvermane Guard','Juvenile Sting'];
const modeInfo={moc:{icon:'◈',name:'Memory of Chaos',label:'Survival of the Fittest',description:'Atur tempo dan taklukkan boss sebelum cycle habis.'},pf:{icon:'✒',name:'Pure Fiction',label:'Imagined Words',description:'Hadapi reinforcement dan kumpulkan skor latihan.'},as:{icon:'✺',name:'Apocalyptic Shadow',label:'Dominance of Oblivion',description:'Hancurkan toughness, lalu tuntaskan boss.'},aa:{icon:'♚',name:'Anomaly Arbitration',label:'Return to Roots',description:'Knight, King in Check, Plight, dan latihan kuda.'},custom:{icon:'⚔',name:'Free Battle',label:'YOUR OWN ENCOUNTER',description:'Pilih sendiri hingga lima musuh dan arena.'}};
challenges.custom=[{title:'Custom enemy lineup',phase:'Free Battle',waves:[customEnemies.slice()],rule:'none',note:'Pertarungan biasa dengan musuh pilihanmu. Tidak memakai modifier endgame.'}];
presets.custom=[['Custom enemy lineup',...customEnemies]];
const customOption=document.createElement('option');customOption.value='custom';customOption.textContent='Free Battle';$('mode').appendChild(customOption);
// Bind encounter data to the committed battle, not draft selections in the menu.
const liveInit=init;
// The existing encounter accessor reads the preset control. Menu drafts stay separate
// until beginBattle commits them; returning to the lobby does not advance the battle.
const svgModel=model;
model=function(e){return `<span class="enemy-visual">${svgModel(e)}<img class="enemy-art" src="${enemyImageCandidates(e.name)[0]}" alt="${enemyText(e.name)}" data-enemy-image="1" referrerpolicy="no-referrer"><span class="image-fallback-label" hidden>Gambar tidak tersedia</span></span>`;};
function applyEnemyImages(){document.querySelectorAll('.enemy-art').forEach(img=>{let attempt=0;img.onerror=()=>{const candidates=enemyImageCandidates(img.alt);attempt++;if(attempt<candidates.length){img.src=candidates[attempt];return;}img.hidden=true;const fallback=img.parentElement.querySelector('svg');if(fallback)fallback.style.opacity='1';img.parentElement.querySelector('.image-fallback-label').hidden=false;};img.onload=()=>{img.parentElement.querySelector('svg').style.opacity='0';};});}
function setArena(key){const map=mapImages[key]||mapImages.custom;const bg=$('arenaPhoto');bg.hidden=false;bg.src=map.url;bg.alt=map.name;bg.onload=()=>{$('arenaImageStatus').textContent=map.name+' · referensi';};bg.onerror=()=>{bg.hidden=true;$('arenaImageStatus').textContent='Arena cadangan · gambar tidak dapat dimuat';};$('arenaImageStatus').textContent=map.name+' · referensi';$('arenaImageStatus').title=map.note;}
const renderBeforeLobby=render;
render=function(){renderBeforeLobby();applyEnemyImages();
 // Replace chess-symbol thumbnails with identifiable enemy portraits in the queue.
const order=living().sort((a,b)=>a.distance/a.spd-b.distance/b.spd).slice(0,7);
document.querySelectorAll('.turn').forEach((node,i)=>{const unit=order[i];if(unit?.enemy){const icon=node.querySelector('.turn-symbol');if(icon)icon.innerHTML=`<img src="${enemyImage(unit.name)}" alt="${enemyText(unit.name)}" data-enemy-thumb="1" referrerpolicy="no-referrer">`;}});
};
function lobbyTeam(){return teamConfig.map(cfg=>{const c=roster.find(x=>x.id===cfg.id);return `<div class="lobby-member"><img src="${avatar(c)}" alt="${c.name}"><span>${c.name}</span><small>${cfg.spd} SPD · ${c.path}</small></div>`;}).join('');}
function renderLobby(){
 const comingSoon=lobbyVersion==='4.7';
 $('modeCards').innerHTML=Object.entries(modeInfo).map(([key,m])=>`<button class="mode-card ${key===lobbyMode?'chosen':''}" data-lobby-mode="${key}" aria-pressed="${key===lobbyMode}" style="--card-map:url('${mapImages[key].url}')"><span class="mode-illustration">${m.icon}</span><span class="mode-number">${key==='custom'?'FREE':'ENDGAME'}</span><h3>${m.name}</h3><small>${m.label}</small><p>${m.description}</p><span class="mode-arrow">↗</span></button>`).join('');
 if(comingSoon)$('modeCards').innerHTML=$('modeCards').innerHTML.replace(/<small>.*?<\/small>/g,'<small>Coming soon · 4.7</small>');
 $('lobbyTeam').innerHTML=lobbyTeam();$('resumeBattle').hidden=!hasEnteredBattle;
 $('beginBattle').disabled=comingSoon;
 $('beginBattle').innerHTML=comingSoon?'COMING SOON · 4.7':'START BATTLE <span>&#8594;</span>';
 $('lobbyVersion').value=lobbyVersion;
 const custom=lobbyMode==='custom';$('customSetup').hidden=!custom;$('stageSetup').hidden=custom;
 $('lobbyStageTitle').textContent=modeInfo[lobbyMode].name;$('lobbyStageSub').textContent=modeInfo[lobbyMode].label;
 if(!custom){$('lobbyPresets').innerHTML=challenges[lobbyMode].map((c,i)=>`<button class="node-option ${nodeHasVoracity3(lobbyMode,i)?'voracity-node':''} ${i===lobbyPreset?'chosen':''}" data-lobby-preset="${i}" aria-pressed="${i===lobbyPreset}"><span>${String(i+1).padStart(2,'0')}</span><b>${c.title}</b>${nodeHasVoracity3(lobbyMode,i)?'<span class="voracity-badge">VORACITY 3</span>':''}<small>${encounterPreview(lobbyMode,i).summary}${c.plight?' · Plight':''}</small></button>`).join('');const c=challenges[lobbyMode][lobbyPreset];$('lineupPreview').innerHTML=renderEncounterPreview(lobbyMode,lobbyPreset);$('lobbyRule').textContent=c.note;}
 drawCustomEnemies();const map=mapImages[custom?$('freeArena').value:lobbyMode]||mapImages.custom;$('mapPreview').src=map.url;$('mapName').textContent=map.name;$('mapNote').textContent=map.note;$('mapSource').href=map.source;
 $('mapPreview').hidden=comingSoon;$('mapSource').hidden=comingSoon;
 if(comingSoon){
  $('customSetup').hidden=true;$('stageSetup').hidden=false;
  $('lobbyStageSub').textContent='VERSION 4.7';
  $('lobbyPresets').innerHTML='<div class="version-coming-soon" role="status"><strong>Coming soon</strong><p>Musuh dan lineup versi 4.7 belum tersedia. Pilih versi 4.6 untuk bermain.</p></div>';
  $('lineupPreview').innerHTML='';$('lobbyRule').textContent='';
  $('mapName').textContent='Version 4.7 · Coming soon';$('mapNote').textContent='Arena dan encounter akan ditambahkan nanti.';
 }
}
function drawCustomEnemies(){const query=$('enemySearch').value.toLowerCase();$('enemyPicker').innerHTML=Object.keys(enemyCatalog).filter(name=>name.toLowerCase().includes(query)).map(name=>`<button class="enemy-option ${customEnemies.includes(name)?'chosen':''}" data-custom-enemy="${name}" aria-pressed="${customEnemies.includes(name)}"><img src="${enemyImage(name)}" alt="${name}" referrerpolicy="no-referrer"><span>${name}</span><small>${enemyCatalog[name].weak.map(w=>elements[w]).join(' ')}</small><b>${customEnemies.includes(name)?'✓':'+'}</b></button>`).join('');$('customCount').textContent=`${customEnemies.length} / 5 musuh`;$('customChosen').textContent=customEnemies.length?customEnemies.join(' · '):'Pilih minimal satu musuh untuk memulai.';}
function showLobby(){document.querySelectorAll('dialog[open]').forEach(d=>d.close());$('lobby').hidden=false;$('gameView').hidden=true;renderLobby();window.scrollTo(0,0);}
function hideLobby(){$('lobby').hidden=true;$('gameView').hidden=false;window.scrollTo(0,0);}
function beginBattle(){if(lobbyVersion==='4.7'){$('lobbyError').textContent='Versi 4.7 coming soon. Pilih versi 4.6 untuk bermain.';return;}if(lobbyMode==='custom'&&!customEnemies.length){$('lobbyError').textContent='Pilih minimal satu musuh.';return;}$('lobbyError').textContent='';if(lobbyMode==='custom'){lobbyPreset=0;challenges.custom[0].waves=[customEnemies.slice()];presets.custom=[['Custom enemy lineup',...customEnemies]];}$('mode').value=lobbyMode;fillPresets();$('preset').value=String(lobbyPreset);hasEnteredBattle=true;hideLobby();init();setArena(lobbyMode==='custom'?$('freeArena').value:lobbyMode);}
init=function(){liveInit();renderLobby();};
document.addEventListener('click',event=>{const mode=event.target.closest('[data-lobby-mode]');if(mode){lobbyMode=mode.dataset.lobbyMode;lobbyPreset=0;$('lobbyError').textContent='';renderLobby();}const preset=event.target.closest('[data-lobby-preset]');if(preset){lobbyPreset=+preset.dataset.lobbyPreset;renderLobby();}const enemy=event.target.closest('[data-custom-enemy]');if(enemy){const name=enemy.dataset.customEnemy;if(customEnemies.includes(name))customEnemies=customEnemies.filter(x=>x!==name);else if(customEnemies.length<5)customEnemies.push(name);else{$('lobbyError').textContent='Maksimal lima musuh dalam satu battle.';return;}$('lobbyError').textContent='';drawCustomEnemies();}});
document.addEventListener('keydown',e=>{if(!$('lobby').hidden&&!document.querySelector('dialog[open]')&&['q','e','r',' '].includes(e.key.toLowerCase())&&!/INPUT|SELECT|BUTTON/.test(e.target.tagName))e.stopImmediatePropagation();},true);
// Handle failed remote images without silently substituting another enemy.
document.addEventListener('error',event=>{const img=event.target;if(img.tagName==='IMG'&&(img.dataset.enemyImage||img.dataset.enemyThumb))event.stopImmediatePropagation();},true);
$('beginBattle').onclick=beginBattle;$('homeBtn').onclick=showLobby;$('challengeBtn').onclick=showLobby;$('resumeBattle').onclick=hideLobby;
$('lobbyTeamBtn').onclick=openTeam;$('lobbyGuideBtn').onclick=()=>$('guideDialog').showModal();
$('enemySearch').oninput=drawCustomEnemies;$('freeArena').onchange=renderLobby;
 $('lobbyVersion').onchange=()=>{lobbyVersion=$('lobbyVersion').value==='4.7'?'4.7':'4.6';$('lobbyError').textContent='';renderLobby();$('menuEncounterDetails').open=true;};
$('resetBtn').onclick=()=>{init();setArena(state.mode==='custom'?$('freeArena').value:state.mode);};
// Saving a team while in the menu refreshes its preview without entering battle.
const saveTeamBeforeLobby=$('saveTeam').onclick;$('saveTeam').onclick=()=>{saveTeamBeforeLobby();renderLobby();};
$('sources').innerHTML+=`<a href="https://www.gacha.gg/honkai-star-rail/enemies" target="_blank" rel="noreferrer">Enemy image index ↗</a>`;
setArena('moc');render();showLobby();
