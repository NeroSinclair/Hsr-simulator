'use strict';
// A phase is a new HP/toughness bar on the same boss, not a new wave.
freeEnemyDraft.bossPhases=1;
freeEnemyBattleConfig.bossPhases=1;
$('freeBossPhases').onchange=()=>{
 const count=Number($('freeBossPhases').value);
 if([1,2,3].includes(count))freeEnemyDraft.bossPhases=count;
};
const createEnemyBeforeBossPhases=createEnemy;
createEnemy=function(name,index){
 const e=createEnemyBeforeBossPhases(name,index);
 if(state.mode==='custom'&&freeEnemyByName.get(name)?.kind==='boss'){
  const count=Number(freeNodeBattleConfig().bossPhases);
  e.bossPhases=[1,2,3].includes(count)?count:1;e.bossPhase=1;
 }
 return e;
};
function advanceBossPhase(target){
 if(state.mode!=='custom'||target.hp>0||!target.bossPhases||target.bossPhase>=target.bossPhases)return false;
 target.bossPhase++;
 target.hp=target.maxHp;target.tough=target.maxTough;target.broken=false;
 target.effects=[];target.enrage=0;target.spd=target.originalSpd;
 // Keep the existing AV position and UID; allies, summons and dead adds stay as-is.
 log(`${enemyText(target.name)} memasuki fase ${target.bossPhase}/${target.bossPhases}. HP dan toughness pulih.`);
 return true;
}
