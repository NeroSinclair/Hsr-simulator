'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {run,get,clickListeners}=require('./verify-menu.cjs');
assert.equal(run('freeEnemyCatalog.length'),484);
assert.equal(run('freeEnemyCatalog.reduce((n,m)=>n+m.variants.length,0)'),2754);
assert.equal(run('new Set(freeEnemyCatalog.map(m=>m.name)).size'),484);
assert.ok(run("freeEnemyCatalog.every(m=>m.variants.every(v=>v.hp>0&&v.spd>0&&v.tough>=0&&v.weak.every(w=>Object.hasOwn(elements,w))))"));
for(const m of JSON.parse(run('JSON.stringify(freeEnemyCatalog)'))){
 const icon=m.icon==='unknown'?'battleeventicon-monster_unknown':`mostericon-monster_${m.icon}`;
 assert.ok(fs.existsSync(`assets/enemies/${icon}.webp`),m.name+' missing local image');
}
run("lobbyMode='custom';renderLobby()");
assert.equal((get('enemyPicker').innerHTML.match(/data-custom-enemy=/g)||[]).length,48,'Initial list must be bounded');
get('freeEnemyMore').onclick();assert.equal((get('enemyPicker').innerHTML.match(/data-custom-enemy=/g)||[]).length,96);
get('freeEnemyKind').value='boss';get('freeEnemyKind').onchange();
assert.ok(run("filteredFreeEnemies().every(m=>m.kind==='boss')"));
get('freeEnemyWeakness').value='Fire';get('freeEnemyWeakness').onchange();
assert.ok(run("filteredFreeEnemies().every(m=>m.variants.some(v=>v.weak.includes('Fire')))"));
get('freeEnemyResetFilters').onclick();
get('enemySearch').value='cocolia';get('enemySearch').oninput();assert.ok(get('enemyPicker').innerHTML.includes('Cocolia'));
get('enemySearch').value='NO SUCH ENEMY';get('enemySearch').oninput();assert.ok(get('enemyPicker').innerHTML.includes('Tidak ada musuh'));
run("customEnemies=['Borisin Warhead: Hoolay'];var selectedMonster=freeEnemyByName.get(customEnemies[0]);freeEnemyDraft.variants[customEnemies[0]]=selectedMonster.variants[1].id;freeEnemyDraft.hpScale=2;beginBattle()");
const committed=run('JSON.stringify(state.enemies[0])');
assert.equal(run('state.enemies[0].catalogId'),run('selectedMonster.variants[1].id'));
assert.equal(run('state.enemies[0].hp'),run('Math.round(selectedMonster.variants[1].hp*200)'));
assert.equal(run('state.enemies[0].spd'),run('selectedMonster.variants[1].spd'));
run("showLobby();freeEnemyDraft.variants[customEnemies[0]]=selectedMonster.variants[0].id;freeEnemyDraft.hpScale=0.5;drawCustomEnemies()");
assert.equal(run('JSON.stringify(state.enemies[0])'),committed,'Menu changed live enemy');
get('resetBtn').onclick();assert.equal(run('state.enemies[0].catalogId'),run('selectedMonster.variants[1].id'),'Reset must use committed variant');
function action(kind,index){for(const listener of clickListeners)listener({target:{closest(selector){return selector==='[data-free-action]'?{dataset:{freeAction:kind,freeSlot:String(index)}}:null;}}});}
action('duplicate',0);assert.equal(run('customEnemies.length'),1,'Boss duplication must respect one-boss limit');
run("customEnemies=['Silvermane Soldier'];drawCustomEnemies()");
action('duplicate',0);assert.equal(run('customEnemies.length'),2);action('remove',0);assert.equal(run('customEnemies.length'),1);
for(let i=0;i<7;i++)action('duplicate',0);assert.equal(run('customEnemies.length'),5);
run('beginBattle()');assert.equal(run('state.enemies.length'),5);assert.equal(run('new Set(state.enemies.map(e=>e.uid)).size'),5);
run("customEnemies=['Doomsday Beast'];freeEnemyDraft={variants:{},hpScale:1};beginBattle();state.team[0].element='Fire';hit(state.team[0],state.enemies[0],0.01,30)");
assert.equal(run('state.enemies[0].maxTough'),0);assert.equal(run('state.enemies[0].broken'),false,'No-toughness object must not break');
assert.ok(!get('enemies').innerHTML.includes('NaN'),'No-toughness bar produced NaN');
run("customEnemies=['Unit-01'];beginBattle()");assert.ok(run('state.enemies[0].hp>0'),'Index-only enemy cannot start');
run("customEnemies=['not in catalogue'];beginBattle()");assert.ok(get('lobbyError').textContent.includes('katalog'));
// Every imported variant can be instantiated without mutating its source data.
assert.ok(run("freeEnemyCatalog.every(m=>m.variants.every(v=>{freeEnemyBattleConfig.variants[m.name]=v.id;const e=createEnemy(m.name,0);return e.catalogId===v.id&&[e.hp,e.spd,e.maxTough].every(Number.isFinite)&&e.weak!==v.weak;}))"));
console.log('Passed: 484 names / 2754 variants, local images, filters, pagination, duplicate enemies, slot cap, variant commit/reset isolation, missing-data fallback and unbreakable enemies.');
