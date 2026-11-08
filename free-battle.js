'use strict';
const freeEnemyKinds={normal:'Musuh biasa',elite:'Elite',boss:'Boss',special:'Summon / objek'};
const freeEnemyByName=new Map(freeEnemyCatalog.map(m=>[m.name,m]));
let freeEnemyFilter={kind:'all',faction:'all',weak:'all',visible:48};
let freeEnemyDraft={variants:{},hpScale:1};
let freeEnemyBattleConfig={variants:{},hpScale:1};
let freeNodes=[{enemies:customEnemies,config:freeEnemyDraft}],freeNodeIndex=0,freeCommittedNodes=[];
function syncFreeNode(){freeNodes[freeNodeIndex]={enemies:customEnemies,config:freeEnemyDraft};}
function freeEnemyKind(name){
 const entry=freeEnemyByName.get(name);if(entry)return entry.kind;
 const similar=freeEnemyCatalog.find(m=>m.name.toLowerCase().replace(/[^a-z0-9]/g,'')===name.toLowerCase().replace(/[^a-z0-9]/g,''));
 if(similar)return similar.kind;
 return ['king','horse','dragon','wolf'].includes(enemyCatalog[name]?.shape)?'boss':'normal';
}
function freeNodeCounts(enemies=customEnemies){return {total:enemies.length,boss:enemies.filter(name=>freeEnemyKind(name)==='boss').length,elite:enemies.filter(name=>freeEnemyKind(name)==='elite').length};}
function freeNodeError(enemies){
 const counts=freeNodeCounts(enemies);
 if(!counts.total||counts.total>5||enemies.some(name=>!Object.hasOwn(enemyCatalog,name)))return 'Pilih 1–5 musuh dari katalog.';
 if(counts.boss>1)return 'Satu node hanya boleh berisi 1 bos.';
 if(counts.elite>2)return 'Satu node hanya boleh berisi 2 elite.';
 return '';
}
function canAddFreeEnemy(name){const counts=freeNodeCounts(),kind=freeEnemyKind(name);return counts.total<5&&(kind!=='boss'||counts.boss<1)&&(kind!=='elite'||counts.elite<2);}
function setFreeNodeError(message){$('lobbyError').textContent=message;$('freeNodeError').textContent=message;}
function addFreeEnemy(name){
 const error=freeNodeError([...customEnemies,name]);
 if(error){setFreeNodeError(error);return false;}
 customEnemies.push(name);setFreeNodeError('');drawCustomEnemies();return true;
}
function selectFreeNode(index){
 if(!Number.isInteger(index)||index<0||index>=freeNodes.length)return;
 syncFreeNode();freeNodeIndex=index;customEnemies=freeNodes[index].enemies;freeEnemyDraft=freeNodes[index].config;
 $('freeEnemyHpScale').value=String(freeEnemyDraft.hpScale);$('freeBossPhases').value=String(freeEnemyDraft.bossPhases||1);
 setFreeNodeError('');drawCustomEnemies();
}
function drawFreeNodes(){
 syncFreeNode();
 $('freeNodeTabs').innerHTML=freeNodes.map((node,index)=>`<button type="button" data-free-node="${index}" class="free-node-tab ${index===freeNodeIndex?'chosen':''}" aria-pressed="${index===freeNodeIndex}"><b>Node ${index+1}</b><small>${node.enemies.length} / 5</small>${node.enemies.some(name=>freeEnemyKind(name)==='boss')?'<span>♛</span>':''}</button>`).join('');
 $('freeNodeRemove').disabled=freeNodes.length===1;
 $('freeNodeTitle').textContent=`Node ${freeNodeIndex+1}`;
 const counts=freeNodeCounts();
 $('freeNodeBudget').innerHTML=`<span>${counts.total}/5 <b>musuh</b></span><span>${counts.boss}/1 <b>bos</b></span><span>${counts.elite}/2 <b>elite</b></span>`;
}
function freeNodeBattleConfig(){return freeCommittedNodes[state?.wave-1]?.config||freeEnemyBattleConfig;}
for(const m of freeEnemyCatalog){
 const v=m.variants[0];
 if(!Object.hasOwn(enemyCatalog,m.name))enemyCatalog[m.name]={weak:v?.weak.slice()||[],shape:m.kind==='boss'?'king':'knight'};
 if(!enemyImageIds[m.name])enemyImageIds[m.name]=m.icon;
 if(!enemyRenders[m.name])enemyRenders[m.name]=m.icon==='unknown'?'assets/enemies/battleeventicon-monster_unknown.webp':`assets/enemies/mostericon-monster_${m.icon}.webp`;
}
function freeEnemyVariant(m,config=freeEnemyDraft){return m.variants.find(v=>v.id===config.variants[m.name])||m.variants[0];}
function freeEnemyImage(name){const m=freeEnemyByName.get(name);return m?m.icon==='unknown'?'assets/enemies/battleeventicon-monster_unknown.webp':`assets/enemies/mostericon-monster_${m.icon}.webp`:enemyImageCandidates(name)[0];}
function filteredFreeEnemies(){
 const query=$('enemySearch').value.trim().toLowerCase().split(/\s+/).filter(Boolean);
 const imported=freeEnemyCatalog.filter(m=>(freeEnemyFilter.kind==='all'||m.kind===freeEnemyFilter.kind)&&(freeEnemyFilter.faction==='all'||m.faction===freeEnemyFilter.faction)&&(freeEnemyFilter.weak==='all'||m.variants.some(v=>v.weak.includes(freeEnemyFilter.weak)))&&query.every(q=>[m.name,m.faction,m.id,...m.variants.map(v=>v.id)].join(' ').toLowerCase().includes(q)));
 const legacy=Object.keys(enemyCatalog).filter(name=>!freeEnemyByName.has(name)).map(name=>({name,id:name,kind:'legacy',faction:'Preset simulator',variants:[]})).filter(m=>freeEnemyFilter.kind==='all'&&['all','Preset simulator'].includes(freeEnemyFilter.faction)&&(freeEnemyFilter.weak==='all'||enemyCatalog[m.name].weak.includes(freeEnemyFilter.weak))&&query.every(q=>m.name.toLowerCase().includes(q)));
 return [...imported,...legacy];
}
function drawFreeEnemySelection(){
 drawFreeNodes();
 $('freeEnemySelection').innerHTML=customEnemies.length?customEnemies.map((name,index)=>{
  const m=freeEnemyByName.get(name),v=m&&freeEnemyVariant(m);
  return `<article class="free-selected-enemy"><img src="${freeEnemyImage(name)}" alt="" data-free-image="${esc(name)}" loading="lazy"><div><b>${esc(name)}</b><small>${freeEnemyKinds[freeEnemyKind(name)]||'Musuh biasa'}</small>${m?.variants.length?`<details class="free-variant-details"><summary>Detail & varian</summary><label>Varian musuh<select data-free-variant="${index}" aria-label="Varian ${esc(name)}">${m.variants.map(option=>`<option value="${option.id}" ${option.id===v.id?'selected':''}>#${option.id} · SPD ${option.spd} · ${option.weak.join(' / ')||'Tanpa weakness'}</option>`).join('')}</select></label></details>`:''}</div><div class="free-selected-actions"><button data-free-action="duplicate" data-free-slot="${index}" ${canAddFreeEnemy(name)?'':'disabled'} aria-label="Tambah satu ${esc(name)}">+1</button><button data-free-action="remove" data-free-slot="${index}" aria-label="Hapus ${esc(name)}" title="Hapus">&#10005;</button></div></article>`;
 }).join(''):'<p>Pilih musuh dari katalog di bawah.</p>';
}
drawCustomEnemies=function(){
 const list=filteredFreeEnemies(),shown=list.slice(0,freeEnemyFilter.visible);
 $('enemyPicker').innerHTML=shown.map(m=>{
  const weak=m.variants.length?freeEnemyVariant(m).weak:enemyCatalog[m.name].weak;
  return `<button class="enemy-option ${customEnemies.includes(m.name)?'chosen':''}" data-custom-enemy="${esc(m.name)}" ${canAddFreeEnemy(m.name)?'':'disabled'} aria-label="Tambah ${esc(m.name)}"><img src="${freeEnemyImage(m.name)}" alt="" data-free-image="${esc(m.name)}" loading="lazy" decoding="async"><span>${esc(m.name)}</span><small>${freeEnemyKinds[freeEnemyKind(m.name)]||'Musuh biasa'} · ${weak.map(w=>elements[w]).join(' ')||'Tanpa weakness'}</small><b>+${customEnemies.filter(name=>name===m.name).length||''}</b></button>`;
 }).join('')||'<p class="free-enemy-empty" role="status">Tidak ada musuh yang cocok. Ubah filter atau pencarian.</p>';
 $('customCount').textContent=`${customEnemies.length} / 5 slot · ${list.length} hasil`;
 $('customChosen').textContent=customEnemies.length?customEnemies.join(' · '):'Pilih minimal satu musuh untuk memulai.';
 $('freeEnemyMore').hidden=list.length<=shown.length;
 $('freeEnemyMore').textContent=`Tampilkan lagi (${shown.length} / ${list.length})`;
 drawFreeEnemySelection();
};
function changeFreeEnemyFilter(){freeEnemyFilter.kind=$('freeEnemyKind').value;freeEnemyFilter.faction=$('freeEnemyFaction').value;freeEnemyFilter.weak=$('freeEnemyWeakness').value;freeEnemyFilter.visible=48;drawCustomEnemies();}
const freeFactions=[...new Set(freeEnemyCatalog.map(m=>m.faction))].sort();
$('freeEnemyKind').innerHTML='<option value="all">Semua jenis</option>'+Object.entries(freeEnemyKinds).map(([key,label])=>`<option value="${key}">${label}</option>`).join('');
$('freeEnemyFaction').innerHTML='<option value="all">Semua faksi</option>'+[...freeFactions,'Preset simulator'].map(name=>`<option value="${esc(name)}">${esc(name)}</option>`).join('');
$('freeEnemyWeakness').innerHTML='<option value="all">Semua weakness</option>'+Object.keys(elements).map(key=>`<option value="${key}">${key}</option>`).join('');
for(const id of ['freeEnemyKind','freeEnemyFaction','freeEnemyWeakness'])$(id).onchange=changeFreeEnemyFilter;
$('enemySearch').oninput=()=>{freeEnemyFilter.visible=48;drawCustomEnemies();};
$('freeEnemyMore').onclick=()=>{freeEnemyFilter.visible+=48;drawCustomEnemies();};
$('freeEnemyHpScale').onchange=()=>{const value=Number($('freeEnemyHpScale').value);if([0.5,1,2,5].includes(value))freeEnemyDraft.hpScale=value;};
$('freeEnemyClear').onclick=()=>{customEnemies=[];setFreeNodeError('');drawCustomEnemies();};
$('freeNodeAdd').onclick=()=>{syncFreeNode();freeNodes.push({enemies:[],config:{variants:{},hpScale:1,bossPhases:1}});selectFreeNode(freeNodes.length-1);};
$('freeNodeRemove').onclick=()=>{
 if(freeNodes.length===1)return;
 syncFreeNode();freeNodes.splice(freeNodeIndex,1);freeNodeIndex=Math.min(freeNodeIndex,freeNodes.length-1);
 customEnemies=freeNodes[freeNodeIndex].enemies;freeEnemyDraft=freeNodes[freeNodeIndex].config;selectFreeNode(freeNodeIndex);
};
$('freeEnemyResetFilters').onclick=()=>{for(const id of ['freeEnemyKind','freeEnemyFaction','freeEnemyWeakness'])$(id).value='all';$('enemySearch').value='';changeFreeEnemyFilter();};
document.addEventListener('click',event=>{
 const tab=event.target.closest('[data-free-node]');if(tab){selectFreeNode(Number(tab.dataset.freeNode));return;}
 const button=event.target.closest('[data-free-action]');if(!button)return;
 const index=Number(button.dataset.freeSlot);if(!Number.isInteger(index)||index<0||index>=customEnemies.length)return;
 if(button.dataset.freeAction==='remove')customEnemies.splice(index,1);
 if(button.dataset.freeAction==='duplicate'){addFreeEnemy(customEnemies[index]);return;}
 setFreeNodeError('');drawCustomEnemies();
});
document.addEventListener('change',event=>{
 const node=event.target;if(node.dataset?.freeVariant===undefined)return;
 const m=freeEnemyByName.get(customEnemies[Number(node.dataset.freeVariant)]);
 if(!m?.variants.some(v=>v.id===node.value))return;
 freeEnemyDraft.variants[m.name]=node.value;drawCustomEnemies();
});
document.addEventListener('error',event=>{
 const img=event.target;if(img.dataset?.freeImage===undefined)return;
 const m=freeEnemyByName.get(img.dataset.freeImage);
 const sources=m&&m.icon!=='unknown'?[enemyImage(m.name),'assets/enemies/battleeventicon-monster_unknown.webp']:['assets/enemies/battleeventicon-monster_unknown.webp'];
 const attempt=Number(img.dataset.freeAttempt||0);if(attempt<sources.length){img.dataset.freeAttempt=String(attempt+1);img.src=sources[attempt];}else img.hidden=true;
},true);
const createEnemyBeforeFreeCatalog=createEnemy;
createEnemy=function(name,index){
 const e=createEnemyBeforeFreeCatalog(name,index);if(state.mode!=='custom')return e;
 const config=freeNodeBattleConfig(),m=freeEnemyByName.get(name),v=m&&freeEnemyVariant(m,config);
 if(!v){e.hp=e.maxHp=Math.max(1,Math.round(e.maxHp*config.hpScale));return e;}
 e.hp=e.maxHp=Math.max(1,Math.round(v.hp*100*config.hpScale));
 e.spd=e.originalSpd=v.spd;e.tough=e.maxTough=v.tough;e.weak=v.weak.slice();e.catalogId=v.id;
 return e;
};
const beginBattleBeforeFreeCatalog=beginBattle;
beginBattle=function(){
 if(lobbyVersion==='4.6'&&lobbyMode==='custom'){
  syncFreeNode();
  for(let index=0;index<freeNodes.length;index++){const error=freeNodeError(freeNodes[index].enemies);if(error){selectFreeNode(index);setFreeNodeError(`Node ${index+1}: ${error}`);return;}}
  freeCommittedNodes=JSON.parse(JSON.stringify(freeNodes));freeEnemyBattleConfig=freeCommittedNodes[0].config;
 }
 beginBattleBeforeFreeCatalog();
};
$('beginBattle').onclick=beginBattle;
const initBeforeFreeNodes=init;
init=function(){
 if($('mode').value==='custom'&&freeCommittedNodes.length){
  challenges.custom[0].waves=freeCommittedNodes.map(node=>node.enemies.slice());
  presets.custom=[['Custom enemy lineup',...freeCommittedNodes[0].enemies]];
 }
 return initBeforeFreeNodes();
};
const renderBeforeFreeNodes=render;
render=function(){renderBeforeFreeNodes();if(state.mode==='custom'){$('waveLabel').textContent=`NODE ${state.wave} / ${encounter().waves.length}`;}};
const loadWaveBeforeFreeNodes=loadWave;
loadWave=function(){loadWaveBeforeFreeNodes();if(state.mode==='custom'&&document.dispatchEvent)document.dispatchEvent(new CustomEvent('stellar:node',{detail:{node:state.wave}}));};
$('freeEnemyCatalogNote').textContent=`${freeEnemyCatalog.length} nama musuh · ${freeEnemyCatalog.reduce((sum,m)=>sum+m.variants.length,0)} varian data. Termasuk boss, elite, musuh biasa, summon, dan objek khusus.`;
$('freeEnemySources').innerHTML=freeEnemySources.map(([name,url])=>`<a href="${url}" target="_blank" rel="noreferrer">${esc(name)} ↗</a>`).join('');
drawCustomEnemies();
