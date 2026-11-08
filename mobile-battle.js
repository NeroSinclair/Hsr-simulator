'use strict';
let battlePresentationEpoch=0,battleOwnsFullscreen=false,battleOwnsOrientation=false,battlePortraitDismissed=false;
function isMobileBattle(){return typeof window.matchMedia==='function'&&(window.matchMedia('(pointer: coarse)').matches||window.matchMedia('(max-width: 960px)').matches);}
function updateBattleOrientationHint(){
 const portrait=typeof window.matchMedia==='function'&&window.matchMedia('(orientation: portrait)').matches;
 $('battleOrientationHint').hidden=$('gameView').hidden||!isMobileBattle()||!portrait||battlePortraitDismissed;
}
async function enterBattleLandscape(){
 if(!isMobileBattle()||$('gameView').hidden)return;
 const epoch=++battlePresentationEpoch;
 const root=document.documentElement,orientation=globalThis.screen?.orientation;
 try{
  if(!document.fullscreenElement&&typeof root?.requestFullscreen==='function'){
   await root.requestFullscreen({navigationUI:'hide'});
   battleOwnsFullscreen=true;
  }
  if(epoch!==battlePresentationEpoch||$('gameView').hidden){await leaveOwnedBattleFullscreen();return;}
  if(typeof orientation?.lock==='function'){
   await orientation.lock('landscape');battleOwnsOrientation=true;
   if(epoch!==battlePresentationEpoch||$('gameView').hidden)await exitBattlePresentation();
  }
 }catch{/* Unsupported/denied orientation must never prevent playing. */}
 updateBattleOrientationHint();
}
async function leaveOwnedBattleFullscreen(){
 if(battleOwnsFullscreen&&document.fullscreenElement===document.documentElement&&typeof document.exitFullscreen==='function'){
  battleOwnsFullscreen=false;try{await document.exitFullscreen();}catch{}
 }
}
async function exitBattlePresentation(){
 battlePresentationEpoch++;
 if(battleOwnsOrientation){battleOwnsOrientation=false;try{globalThis.screen?.orientation?.unlock?.();}catch{}}
 await leaveOwnedBattleFullscreen();
}
const hideLobbyBeforeMobileBattle=hideLobby;
hideLobby=function(){hideLobbyBeforeMobileBattle();battlePortraitDismissed=false;updateBattleOrientationHint();void enterBattleLandscape();};
const showLobbyBeforeMobileBattle=showLobby;
showLobby=function(){void exitBattlePresentation();showLobbyBeforeMobileBattle();$('gameView').classList.toggle('battle-log-open',false);$('gameView').classList.toggle('battle-details-open',false);for(const id of ['battleLogBtn','battleDetailsBtn'])$(id).setAttribute?.('aria-expanded','false');updateBattleOrientationHint();};
$('homeBtn').onclick=showLobby;$('challengeBtn').onclick=showLobby;$('resumeBattle').onclick=hideLobby;
$('battleLandscapeBtn').onclick=()=>{battlePortraitDismissed=false;void enterBattleLandscape();};
$('battleOrientationRetry').onclick=()=>{void enterBattleLandscape();};
$('battleOrientationDismiss').onclick=()=>{battlePortraitDismissed=true;updateBattleOrientationHint();};
for(const [id,cls] of [['battleLogBtn','battle-log-open'],['battleDetailsBtn','battle-details-open']]){
 $(id).onclick=()=>{const open=$('gameView').classList.toggle(cls);$(id).setAttribute('aria-expanded',String(open));};
}
window.addEventListener?.('resize',updateBattleOrientationHint);
document.addEventListener('fullscreenchange',()=>{
 if(!document.fullscreenElement&&battleOwnsOrientation){battleOwnsOrientation=false;try{globalThis.screen?.orientation?.unlock?.();}catch{}}
 if(!document.fullscreenElement)battleOwnsFullscreen=false;
 updateBattleOrientationHint();
});
updateBattleOrientationHint();
