'use strict';
const assert=require('node:assert/strict');
const {run,get}=require('./verify-menu.cjs');
for(const count of [1,2,3]){
 get('freeBossPhases').value=String(count);get('freeBossPhases').onchange();
 run("lobbyMode='custom';customEnemies=['Borisin Warhead: Hoolay','Silvermane Soldier'];beginBattle();var boss=state.enemies[0];var add=state.enemies[1];add.hp=0;var actor=state.team[0];var bossUid=boss.uid;var distance=boss.distance;");
 assert.equal(run('boss.bossPhases'),count);assert.equal(run('boss.bossPhase'),1);
 const startingKills=run('state.kills');
 for(let phase=1;phase<=count;phase++){
  run('state.actionType="basic";hit(actor,boss,1000000,0);afterActionForUltimate()');
  assert.equal(run('boss.uid'),run('bossUid'));assert.equal(run('add.hp'),0,'Adds respawned');
  if(phase<count){
   assert.equal(run('state.ended'),false,'Ended before last phase');
   assert.equal(run('boss.hp'),run('boss.maxHp'));assert.equal(run('boss.bossPhase'),phase+1);
   assert.equal(run('state.kills'),startingKills,'Intermediate phase counted as kill');
   assert.equal(run('boss.distance'),run('distance'),'Phase reset AV position');
   assert.equal(run('boss.broken'),false);
  }else{assert.equal(run('state.ended'),true);assert.equal(run('state.win'),true);assert.equal(run('state.kills'),startingKills+1);}
 }
}
get('freeBossPhases').value='3';get('freeBossPhases').onchange();
run("customEnemies=['Borisin Warhead: Hoolay','Silvermane Soldier'];beginBattle()");
assert.equal(run('state.enemies[0].bossPhases'),3);assert.equal(run('state.enemies[1].bossPhases'),undefined);
get('freeBossPhases').value='1';get('freeBossPhases').onchange();
assert.equal(run('state.enemies[0].bossPhases'),3,'Draft changed running battle');
get('resetBtn').onclick();assert.equal(run('state.enemies[0].bossPhases'),3,'Reset discarded committed phases');
run('beginBattle()');assert.equal(run('state.enemies[0].bossPhases'),1);
get('freeBossPhases').value='4';get('freeBossPhases').onchange();assert.equal(run('freeEnemyDraft.bossPhases'),1);
run("lobbyMode='as';lobbyPreset=0;beginBattle()");assert.ok(run('state.enemies.every(e=>!e.bossPhases)'),'Endgame changed');
console.log('Passed: 1/2/3 boss phases, kill/win timing, no add respawn, AV continuity, draft/reset isolation, bounds and unchanged endgame.');
