const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const nodes = new Map();
const document = {getElementById(id) {if (!nodes.has(id)) nodes.set(id, {value: id==='mode'?'moc':id==='freeArena'?'custom':id==='enemySearch'?'':'0', selectedOptions:[{text:'Memory of Chaos'}], dataset:{}, innerHTML:'', showModal(){}, close(){},appendChild(){}}); return nodes.get(id);}, createElement(){return {};}, addEventListener(){}, querySelector(){return null;},querySelectorAll(){return [];}};
const context = vm.createContext({document, console,window:{scrollTo(){}}});
for(const file of ['data.js','media.js','portrait-loader.js','app.js','equipment.js','combat-builds.js','battle-v46.js'])vm.runInContext(fs.readFileSync(file,'utf8'), context);
const run = code => vm.runInContext(code,context);
assert.equal(run('roster.length'),93);
assert.equal(run('new Set(roster.map(c=>c.id)).size'),run('roster.length'));
assert.equal(run("roster.find(c=>c.name==='Gallagher').id"),'1301');
assert.equal(run("roster.find(c=>c.name==='Misha').id"),'1312');
assert.ok(run("roster.some(c=>c.name==='Pearl' && c.path==='Elation')"));
assert.ok(run("!roster.some(c=>c.name.includes('Aha'))"));
assert.equal(run('state.active.name'),'Ruan Mei');
assert.equal(run('state.time'),62.5);
run('state.time=149.99'); assert.equal(run('cycle()'),0);
run('state.time=150'); assert.equal(run('cycle()'),1);
run('state.time=250'); assert.equal(run('cycle()'),2);
run('init(); state.sp=0;'); const before=run('state.steps');
run("perform('skill')"); assert.equal(run('state.steps'),before);
run("perform('basic')"); assert.equal(run('state.sp'),1);
// Ultimate interrupts must not consume time or the player's pending normal turn.
run('init(); state.team[0].energy=100');
const time=run('state.time'); const active=run('state.active.uid');
run("perform('ultimate',state.team[0])");
assert.equal(run('state.time'),time); assert.equal(run('state.active.uid'),active);
// Interrupt that defeats the currently acting enemy must move to a living actor.
run('init(); state.active=state.enemies[0]; state.active.distance=0; state.active.hp=1; state.team[0].energy=100; state.selected=0');
run("perform('ultimate',state.team[0])"); assert.ok(run('state.ended || state.active.hp>0'));
for (const mode of ['moc','pf','as','aa']) {
 document.getElementById('mode').value=mode;
 run('init(); state.team.forEach(c=>{c.hp=100000;c.maxHp=100000});');
 let count=0;
 while (!run('state.ended') && count++<1000) {
  run("if(state.active.enemy)enemyAction();else perform(state.sp>0?'skill':'basic')");
  assert.ok(run('state.sp>=0 && state.sp<=5'));
  assert.ok(run('living().every(u=>Number.isFinite(u.distance)&&u.distance>=0)'));
 }
 assert.ok(run('state.ended'), `${mode} must terminate`);
 assert.ok(run('state.time<=limit()'));
 if(mode==='pf')assert.equal(run('state.time'),450);
 console.log(`${mode}: completed after ${count} actions`);
}
console.log('Passed: AV, cycles, skill points, ultimate interrupts, and all challenge modes.');
// Every encounter must terminate, and AA must advance through its own wave data.
for (const mode of ['moc','pf','as','aa']) {
 document.getElementById('mode').value=mode;
 const size=run(`challenges['${mode}'].length`);
 for(let preset=0;preset<size;preset++){
  document.getElementById('preset').value=String(preset);
  run('init(); state.team.forEach(c=>{c.hp=100000;c.maxHp=100000});');
  let count=0;
  while(!run('state.ended') && count++<1000)run("if(state.active.enemy)enemyAction();else perform(state.sp>0?'skill':'basic')");
  assert.ok(run('state.ended'), `${mode}/${preset} terminates`);
  assert.ok(run('state.time<=limit()'));
 }
}
document.getElementById('mode').value='aa';
document.getElementById('preset').value='3';
run('init(); state.enemies.forEach(e=>e.hp=0); resolveWave();');
assert.equal(run('state.wave'),2);
assert.equal(run('state.enemies[0].name'),'Blood of the Fallen God: Yabuli');
document.getElementById('preset').value='0';
run('init(); state.team[0].buff=0; state.enemies[0].hp=1; hit(state.team[0],state.enemies[0],1,0)');
assert.ok(run('state.enemies[0].revived && state.enemies[0].hp>0'));
run('hit(state.team[0],state.enemies[0],999,0)');
assert.equal(run('state.enemies[0].hp'),0);
console.log('Passed all 15 presets, AA wave progression, roster IDs and Corrosion revive.');
vm.runInContext(fs.readFileSync('endgame-lineups.js','utf8'), context);
vm.runInContext(fs.readFileSync('encounter-preview.js','utf8'), context);
vm.runInContext(fs.readFileSync('lobby.js','utf8'), context);
assert.equal(document.getElementById('lobby').hidden,false);
assert.equal(document.getElementById('gameView').hidden,true);
assert.ok(run('Object.keys(enemyCatalog).every(name=>enemyImageIds[name])'));
assert.ok(run("model(state.enemies[0]).includes('enemy-art')"));
run("lobbyMode='custom'; lobbyPreset=0; customEnemies=['Moonlit Pegasus','Lighthouse','Silvermane Guard']; beginBattle();");
assert.equal(run('state.mode'),'custom');
assert.equal(run('state.enemies.length'),3);
assert.equal(run('encounter().rule'),'none');
assert.equal(document.getElementById('lobby').hidden,true);
assert.equal(document.getElementById('gameView').hidden,false);
const pausedTime=run('state.time');
run("showLobby(); lobbyMode='aa'; lobbyPreset=3; renderLobby();");
assert.equal(run('state.mode'),'custom');
assert.equal(run('state.time'),pausedTime);
run('hideLobby()'); assert.equal(run('state.time'),pausedTime);
run('showLobby(); beginBattle();');
assert.equal(run('state.mode'),'aa');
assert.equal(run('state.enemies[0].name'),'Moonlit Pegasus');
run("showLobby(); lobbyMode='custom';customEnemies=[];beginBattle();");
assert.equal(document.getElementById('lobby').hidden,false);
assert.ok(document.getElementById('lobbyError').textContent.length>0);
run("customEnemies=['Juvenile Sting'];beginBattle();");
for(let count=0;!run('state.ended')&&count<1000;count++)run("if(state.active.enemy)enemyAction();else perform('basic')");
assert.ok(run('state.ended'));
console.log('Passed lobby entry, draft isolation, resume, enemy media coverage, and custom battle.');
vm.runInContext(fs.readFileSync('build-ui.js','utf8'),context);
// Input remains immutable; percentage sources are added before flat custom bonuses.
run("var fc=roster.find(c=>c.id==='1310');var fb=defaultBuild(fc,120);fb.stats.atk=1000;fb.lc='custom';fb.lcBase.atk=100;fb.customLC={atkPct:10,atkFlat:50};fb.relic='102';fb.planar='301';");
assert.ok(Math.abs(run('computeStats(fc,fb).atk')-1656)<1e-8);
assert.equal(run('fb.stats.atk'),1000);
assert.ok(Math.abs(run('computeStats(fc,fb,{atkPct:20}).atk')-1876)<1e-8);
assert.equal(run('computeStats(fc,fb).spd'),127.2);
run("fb.relic='103';fb.pieces=2;fb.relic2='103';fb.lc='none';fb.planar='none';");
assert.equal(run('computeStats(fc,fb).def'),1150);
run("fb.lc='20003';"); // Mismatched Preservation LC gives flat stats, but no Amber passive.
assert.ok(Math.abs(run('computeStats(fc,fb).def')-1529.5)<1e-8);
run("autoTechnique=false; teamConfig=[{id:'1308',spd:134},{id:'1307',spd:143},{id:'1303',spd:160},{id:'1304',spd:134}]; $('mode').value='custom';$('preset').value='0';init();");
assert.ok(run('state.team.every(c=>effectsOf(c).length===0)'));
const initialAtk=run('unitStats(state.team[0]).atk');
run("addEffect(state.team[0],{key:'test-atk',label:'ATK Up',source:'test',turns:2,bonus:{atkPct:25}})");
assert.equal(run('unitStats(state.team[0]).atk'),initialAtk*1.25);
for(let i=0;i<10;i++)run('syncUnit(state.team[0])');
assert.equal(run('unitStats(state.team[0]).atk'),initialAtk*1.25);
run('tickEffects(state.team[0])'); // Application turn cannot prematurely expire the buff.
assert.equal(run("effectsOf(state.team[0]).find(e=>e.key==='test-atk').turns"),2);
run('state.turnId++;tickEffects(state.team[0]);state.turnId++;tickEffects(state.team[0]);');
assert.equal(run('unitStats(state.team[0]).atk'),initialAtk);
run("init();state.allyTarget=1;state.team[2].build.scope='single';state.active=state.team[2];perform('skill');");
assert.ok(run("effectsOf(state.team[1]).some(e=>e.key==='support:p2')"));
assert.ok(run("state.team.filter((c,i)=>i!==1).every(c=>!effectsOf(c).some(e=>e.key==='support:p2'))"));
run("init();state.team[2].build.scope='party';state.active=state.team[2];perform('skill');");
assert.ok(run("state.team.every(c=>effectsOf(c).some(e=>e.key==='support:p2'))"));
run("init();var spdu=state.team[0];var oldDistance=spdu.distance;var oldSpeed=spdu.spd;addEffect(spdu,{key:'spdtest',turns:1,bonus:{spdPct:50}});");
assert.equal(run('spdu.distance'),run('oldDistance'));
assert.equal(run('spdu.spd'),run('oldSpeed')*1.5);
run("state.turnId++;tickEffects(spdu)");assert.equal(run('spdu.spd'),run('oldSpeed'));
run("autoTechnique=true;init();");
assert.ok(run("state.logs.some(l=>l.startsWith('[0.00 AV]')&&l.includes('Technique'))"));
assert.ok(run('state.enemies.some(e=>effectsOf(e).some(x=>x.kind==="debuff"))'));
assert.equal(run('state.sp'),3);
assert.ok(run('state.team.every(c=>c.energy===50)'));
run("autoTechnique=false;init();state.actionType='basic';var target=state.enemies[0];var actor=state.team[0];var damageOne=combatDamage(actor,target,1);actor.build.stats.atk*=2;");
assert.equal(run('combatDamage(actor,target,1)'),run('damageOne')*2);
run("init();var u=state.team[2];u.build.planar='302';u.build.stats.spd=100;syncUnit(u);");
assert.ok(run("!effectsOf(state.team[0]).some(e=>e.key==='fleet:p2')"));
run("addEffect(u,{key:'spd-aura',turns:1,bonus:{spdPct:30}})");
assert.ok(run("effectsOf(state.team[0]).some(e=>e.key==='fleet:p2')"));
run("removeEffect(u,'spd-aura')");
assert.ok(run("!effectsOf(state.team[0]).some(e=>e.key==='fleet:p2')"));
console.log('Passed additive gear math, LC Path lock, no duplicate bonuses, single/party buffs, expiry, dynamic SPD/aura, Technique, and ATK damage scaling.');
// Hydrate generated editor form controls to exercise saving real UI inputs.
function hydrateForm(id){const html=document.getElementById(id).innerHTML;for(const match of html.matchAll(/<input\b([^>]+)>/g)){const attr=match[1],key=/\bid="([^"]+)"/.exec(attr)?.[1];if(!key)continue;const node=document.getElementById(key);node.value=/\bvalue="([^"]*)"/.exec(attr)?.[1]||'';node.checked=/\bchecked\b/.test(attr);}for(const match of html.matchAll(/<select\b([^>]+)>([\s\S]*?)<\/select>/g)){const key=/\bid="([^"]+)"/.exec(match[1])?.[1];if(!key)continue;const opts=[...match[2].matchAll(/<option\b([^>]+)>/g)];const option=opts.find(o=>/\bselected\b/.test(o[1]))||opts[0];document.getElementById(key).value=/\bvalue="([^"]*)"/.exec(option?.[1]||'')?.[1]||'';}}
run('openTeam()');hydrateForm('teamEditor');hydrateForm('buildPanel');
document.getElementById('stat-atk').value='3200';
document.getElementById('buildLC').value='custom';
document.getElementById('customLC-atkPct').value='25';
document.getElementById('customLC-atkFlat').value='100';
document.getElementById('buildTechnique').checked=false;
document.getElementById('saveTeam').onclick();
assert.equal(run('teamConfig[0].build.stats.atk'),3200);
assert.equal(run('unitStats(state.team[0]).atk'),4100);
assert.equal(run('teamConfig[0].build.technique'),false);
run('openTeam()');hydrateForm('teamEditor');hydrateForm('buildPanel');
document.getElementById('stat-atk').value='-1';
document.getElementById('saveTeam').onclick();
assert.ok(document.getElementById('teamError').textContent.includes('ATK'));
assert.equal(run('teamConfig[0].build.stats.atk'),3200);
console.log('Passed editor save, custom gear application, and invalid stat rejection.');
// Network completions can arrive out of order; stale portraits must never replace
// the current actor, and re-rendering the same actor must not reset its src.
(async()=>{
 const images=[];
 context.Image=class {constructor(){images.push(this);}decode(){return Promise.resolve();}};
 let sourceWrites=0,src='';const activeImage=document.getElementById('activeArt');
 Object.defineProperty(activeImage,'src',{configurable:true,get(){return src;},set(value){sourceWrites++;src=value;}});
 run('portraitCache.clear();visiblePortraitId=null;setActivePortrait(roster[0]);setActivePortrait(roster[1]);');
 assert.equal(src,run('avatar(roster[1])'));
 await images[0].onload();assert.equal(src,run('avatar(roster[1])'));
 await images[2].onload();assert.equal(src,run('art(roster[1])'));
 const writesBefore=sourceWrites;
 run('for(let i=0;i<10;i++)setActivePortrait(roster[1]);');
 assert.equal(sourceWrites,writesBefore);
 console.log('Passed out-of-order portrait completion and stable image src across re-renders.');
})().catch(error=>{console.error(error);process.exitCode=1;});
