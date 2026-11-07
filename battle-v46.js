'use strict';
// Correct the original Gallagher asset ID before adding Misha.
roster.find(c=>c.name==='Gallagher').id='1301';
roster.find(c=>c.id==='8001').name='Trailblazer • Destruction';
for(const [id,name,element,path,spd,role] of extraRoster){if(!roster.some(c=>c.id===id))roster.push({id,name,element,path,spd,role,color:'#c9c3e6'});}
roster.sort((a,b)=>a.name.localeCompare(b.name));
for(const mode of Object.keys(challenges))presets[mode]=challenges[mode].map(c=>[c.title,...c.waves[0]]);
const encounter=()=>challenges[state?.mode||$('mode').value][Number($('preset').value)||0];
const trainingHP=()=>encounter().plight?3:1;
createEnemy=function(name,index){const spec=enemyCatalog[name]||{weak:['Fire','Ice','Imaginary'],shape:'knight'};const pf=state.mode==='pf';const hp=(pf?index===0?65000:12000:state.mode==='aa'?state.wave===1?42000:105000:105000)*trainingHP();const tough=pf?index===0?90:30:120;return {uid:`e${state.serial++}`,name,enemy:true,hp,maxHp:hp,tough,maxTough:tough,spd:state.mode==='aa'?132+index*8:125+index*8,originalSpd:state.mode==='aa'?132+index*8:125+index*8,distance:10000,weak:spec.weak,shape:spec.shape,broken:false,revived:false,enrage:0};};
function loadWave(){state.enemies=encounter().waves[state.wave-1].map(createEnemy);state.selected=0;state.team.filter(c=>c.hp>0).forEach(c=>c.distance=10000);log(`Wave ${state.wave}/${encounter().waves.length} dimulai.`);}
limit=function(){return state.mode==='pf'?450:state.mode==='as'?650:state.mode==='aa'?650:1050;};
const originalInit=init;
init=function(){originalInit();$('setupDialog').close();};
function resolveWave(){if(state.enemies.some(e=>e.hp>0))return false;if(state.wave<encounter().waves.length){state.wave++;loadWave();advance();}else finish(true,'Seluruh wave berhasil diselesaikan.');return true;}
afterAction=function(actor){actor.distance=10000+(actor.pendingDelay||0);actor.pendingDelay=0;actor.lockdown=0;if(actor.buff>0)actor.buff--;tickEffects(actor);state.steps++;if(!state.team.some(c=>c.hp>0))finish(false,'Seluruh tim tumbang.');if(!state.ended){if(!resolveWave())advance();}render();};
afterActionForUltimate=function(){resolveWave();render();};
const originalAdvance=advance;
advance=function(){originalAdvance();if(state.ended)return;const a=state.active;if(!a.enemy&&a.hp>0&&['hemovore','king'].includes(encounter().rule)){a.hp=Math.max(0,a.hp-500);log(`Hemovore: ${a.name} kehilangan 500 HP.`);if(a.hp===0){log(`${a.name} tumbang oleh Hemovore.`);advance();}}};
const originalPerform=perform;
perform=function(type,unit){const actor=unit||state.active;if(state.ended||!actor||actor.enemy||actor.hp<=0||type==='ultimate'&&actor.energy<100||type!=='ultimate'&&actor!==state.active||type==='skill'&&state.sp<1)return;state.actionType=type;if(type==='ultimate'){actor.confinement=Math.max(0,(actor.confinement??2)-1);if(encounter().rule==='confinement'){state.enemies.filter(e=>e.hp>0).forEach(e=>{e.enrage=Math.min(4,e.enrage+1);e.spd=e.originalSpd*(1+.3*e.enrage);});log('Enrage: SPD musuh meningkat hingga giliran berikutnya.');}if(encounter().rule==='punchline')log('Memory Turbulence: +5 Punchline (indikator latihan; Aha tidak disimulasikan).');}const beforeActive=state.active;originalPerform(type,unit);if(!state.ended&&type==='ultimate'&&state.active===beforeActive&&beforeActive.enemy&&beforeActive.distance>0)advance();render();};
const originalHit=hit;
hit=function(actor,target,mult,tough){if(!target||target.hp<=0)return;if(encounter().rule==='confinement')mult*=1-.2*(actor.confinement??2);if(state.mode==='as'&&state.actionType==='ultimate')mult*=1.25;const hpBefore=target.hp,wasBroken=target.broken;originalHit(actor,target,mult,tough);if(hpBefore>0&&target.hp<=0&&encounter().rule==='hemovore'&&!target.revived){target.revived=true;target.hp=Math.round(target.maxHp*.3);state.kills--;state.score-=1000;log(`Corrosion: ${target.name} bangkit sekali dengan 30% HP (model latihan).`);}afterCombatHit(actor,target,wasBroken);if(encounter().rule==='lockdown'){actor.lockdown=(actor.lockdown||0)+1;if(actor.lockdown>=6){actor.pendingDelay=10000;actor.energy=Math.max(0,actor.energy-30);actor.lockdown=0;log(`Lockdown: ${actor.name} tertunda dan kehilangan 30 energi.`);}}};
enemyAction=function(){const actor=state.active;if(state.ended||!actor?.enemy||actor.hp<=0)return;if(actor.broken){actor.broken=false;actor.tough=actor.maxTough;log(`${actor.name} pulih dari Break; satu aksi dilewati.`);}else{const alive=state.team.filter(c=>c.hp>0);const target=alive[state.steps%alive.length];let raw=state.mode==='as'?1450:state.mode==='pf'?650:state.mode==='aa'?1150:950;if(encounter().rule==='king'&&target.shield>0){raw*=3;log('Perforation: +200% damage terhadap target ber-shield.');}if(encounter().plight)raw*=1.5;const {absorbed,damage}=receiveEnemyAttack(target,raw);log(`${actor.name} → ${target.name}: ${fmt(damage)} damage${absorbed?` · ${fmt(absorbed)} diserap shield`:''}.`);}actor.enrage=0;actor.spd=actor.originalSpd;afterAction(actor);};
// Static vector stand-ins. Distinct silhouettes, no moving or animated models.
model=function(e){const shapes={
 horse:'<path d="M40 92 62 65 116 65 132 33 153 21 148 52 137 72 129 104 121 119 127 164 115 164 103 119 69 119 48 162 35 162 48 113 27 113 15 100 19 77 27 90Z"/><path d="M66 70 28 26 35 72 53 94 48 43 92 85 87 45 106 77M130 32 132 8 141 24" fill="#d4c5ef"/><path d="M142 33 150 36" stroke="#fff4c1" stroke-width="4"/>',
 tower:'<path d="M59 165 69 73 60 63 71 52 71 31 109 31 109 52 120 63 111 73 121 165Z"/><path d="M54 31 90 9 126 31 118 40 62 40ZM48 165 132 165 140 174 40 174Z" fill="#6f718a"/><path d="M80 50 100 50 104 72 77 72Z" fill="#e8dbaa"/><path d="M83 92 97 92 99 147 81 147Z" fill="#342c53"/>',
 rabbit:'<path d="M52 72 35 9 50 7 76 61M108 61 130 7 146 10 127 74"/><path d="M47 76 Q90 40 133 76L142 124 117 151 62 151 39 125Z"/><path d="M54 147 42 169 73 169 83 150M105 150 111 169 141 169 128 144"/><path d="M30 79 150 79 140 61 39 61Z" fill="#39495b"/><path d="M64 97 72 97M109 97 117 97" stroke="#ffffcf" stroke-width="8"/><path d="m90 115 9 13-9 13-9-13Z" fill="#e7bf67"/>',
 wolf:'<path d="M57 51 48 9 79 35 103 32 136 8 125 57 113 77 135 97 155 151 137 158 111 123 106 166 77 166 70 124 45 158 26 150 45 97 67 76Z"/><path d="M63 64 90 103 118 64 104 117 78 117Z" fill="#42324b"/><path d="M63 48 81 55 72 62M116 48 99 55 107 62" fill="#ffb69e"/>',
 king:'<path d="M70 57 56 14 79 30 91 7 105 30 126 14 113 57 133 85 148 160 104 143 91 173 76 143 32 160 46 85Z"/><path d="m91 62 28 35-28 45-29-45Z" fill="#302840"/><path d="m91 75 14 22-14 26-14-26Z" fill="#e8a3b6"/><path d="M51 82 11 56 29 115 50 133M129 82 169 56 151 115 130 133" fill="#594563"/>',
 bug:'<path d="M75 61 49 26 14 44 58 86 15 115 20 132 70 113 82 160 100 160 111 113 160 132 166 115 122 85 166 43 132 26 106 61Z"/><path d="M73 72 91 48 110 72 109 118 91 138 73 118Z" fill="#474961"/><path d="m91 75 12 20-12 22-12-22Z" fill="#edd2a6"/>',
 dragon:'<path d="M73 78 35 18 9 65 49 112 64 101 38 70 89 107 142 67 116 100 133 116 175 65 147 17 108 78 99 43 111 18 89 28 70 17 81 43Z"/><path d="M72 94 105 94 123 144 96 171 61 148Z" fill="#625477"/>',
 spirit:'<path d="M84 11 113 44 107 72 139 94 119 115 147 169 105 149 91 175 72 149 33 168 59 116 39 93 72 72 65 44Z"/><path d="m90 67 23 33-23 39-23-39Z" fill="#2d293e"/><path d="m90 87 8 14-8 16-8-16Z" fill="#c9b9f0"/>'};
const shape=shapes[e.shape]||'<path d="M73 25 91 14 109 25 106 57 118 72 144 64 155 117 136 124 120 90 112 121 123 169 104 169 91 128 77 169 57 169 69 121 61 90 45 124 26 117 38 64 64 72 77 57Z"/><path d="M75 77 107 77 102 110 80 110Z" fill="#304052"/><path d="M79 38 85 41M97 41 103 38" stroke="#f4dab0" stroke-width="4"/>';
return `<svg class="enemy-model ${e.shape}" viewBox="0 0 180 180" role="img" aria-label="Illustrated ${e.name}"><ellipse cx="90" cy="172" rx="67" ry="7" fill="#000" opacity=".3"/><g fill="${e.broken?'#686779':'#a7a3be'}" stroke="#e2d7f2" stroke-opacity=".6" stroke-width="1.2">${shape}</g></svg>`;};
const originalRender=render;
render=function(){originalRender();const challenge=encounter();$('stageTitle').textContent=challenge.phase;$('modeDescription').textContent=challenge.title;$('encounterNote').textContent=challenge.note;$('waveLabel').textContent=`${state.mode==='pf'?'SCORE '+fmt(state.score)+' · ':''}Wave ${state.wave} / ${challenge.waves.length}`;$('phaseName').textContent=`VERSION 4.6 · ${state.mode.toUpperCase()} · 07 NOV 2026`;$('battleAlert').textContent=state.ended?'Challenge Complete':state.active.enemy?'Enemy Turn':`${state.active.name} · Your Turn`;$('rosterCount').textContent=`${roster.length} karakter · sampai versi 4.6`;
document.querySelectorAll('.member').forEach((node,i)=>{node.style.setProperty('--member-color',state.team[i].color);});
};
const originalOpenTeam=openTeam;
openTeam=function(){originalOpenTeam();$('rosterSearch').value='';drawRoster();};
function drawRoster(){const query=$('rosterSearch').value.toLowerCase();$('rosterGrid').innerHTML=roster.filter(c=>`${c.name} ${c.element} ${c.path}`.toLowerCase().includes(query)).map(c=>`<button class="roster-pick" data-roster="${c.id}" title="${c.name} · ${c.element} · ${c.path}"><img src="${avatar(c)}" alt=""><span>${c.name}</span><small>${elements[c.element]} ${c.path}</small></button>`).join('');}
$('rosterSearch').oninput=drawRoster;
$('teamBtn').onclick=openTeam;
document.addEventListener('click',e=>{const pick=e.target.closest('[data-roster]');if(!pick)return;const slot=$('editSlot').value;const c=roster.find(c=>c.id===pick.dataset.roster);$('char'+slot).value=c.id;$('editImg'+slot).src=avatar(c);});
document.addEventListener('error',event=>{const img=event.target;if(img.tagName!=='IMG'||img.dataset.fallback||img.dataset.enemyImage||img.dataset.enemyThumb||img.id==='arenaPhoto')return;img.dataset.fallback='1';const name=img.alt||'✦';const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" fill="#39394b"/><text x="80" y="98" text-anchor="middle" font-size="52" fill="#e6d4b1">${name.replace(/[^a-zA-Z0-9 ]/g,'').slice(0,2)||'★'}</text></svg>`;if(img.id!=='activeArt')img.src='data:image/svg+xml,'+encodeURIComponent(svg);},true);
$('challengeBtn').onclick=()=>$('setupDialog').showModal();
$('startBtn').onclick=init;
$('resetBtn').onclick=init;
$('mode').onchange=fillPresets;
$('preset').onchange=null;
$('sources').innerHTML=sourceLinks.map(([label,url])=>`<a href="${url}" target="_blank" rel="noreferrer">${label} ↗</a>`).join('');
fillPresets();init();
