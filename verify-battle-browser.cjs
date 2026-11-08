'use strict';
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const exec=require('node:util').promisify(require('node:child_process').execFile);
const size=process.argv[2]||'844,477',root=__dirname,fixture=path.join(root,'.battle-browser-check.html');
const profile=path.join(root,'.preview-equipment','battle-'+size.replace(',','-'));
const checks=`<script>
(async()=>{try{
 const must=(ok,msg)=>{if(!ok)throw new Error(msg);};
 const click=id=>document.getElementById(id).click();
 const change=(id,value)=>{const n=document.getElementById(id);n.value=value;n.dispatchEvent(new Event('change',{bubbles:true}));};
 const inView=n=>{const r=n.getBoundingClientRect();if(!(r.left>=-1&&r.right<=innerWidth+1&&r.top>=-1&&r.bottom<=innerHeight+1))throw new Error(n.id+' bounds '+JSON.stringify(r.toJSON())+' viewport '+innerWidth+'x'+innerHeight);return true;};
 // Test the orientation flow deterministically; headless Chrome has no real sensor.
 let fullscreenCalls=0,lockCalls=0,unlockCalls=0,exitCalls=0,fullscreen=null;
 Object.defineProperty(document,'fullscreenElement',{configurable:true,get:()=>fullscreen});
 Object.defineProperty(document.documentElement,'requestFullscreen',{configurable:true,value:async()=>{fullscreenCalls++;fullscreen=document.documentElement;}});
 Object.defineProperty(document,'exitFullscreen',{configurable:true,value:async()=>{exitCalls++;fullscreen=null;}});
 Object.defineProperty(screen,'orientation',{configurable:true,value:{lock:async value=>{must(value==='landscape','Wrong orientation');lockCalls++;},unlock:()=>{unlockCalls++;}}});
 lobbyMode='custom';renderLobby();customEnemies=['Borisin Warhead: Hoolay','Cocolia','Silvermane Soldier','Juvenile Sting','Argenti'];
 change('freeBossPhases','3');click('beginBattle');await new Promise(r=>setTimeout(r,0));
 must(!document.getElementById('gameView').hidden,'Battle not started');
 if(innerWidth<=960){must(fullscreenCalls===1&&lockCalls===1,'Start did not request fullscreen/landscape');
  for(const id of ['basic','skill','ultimate','enemyTurn','squad','enemies'])must(inView(document.getElementById(id)),id+' clipped at '+innerWidth+'x'+innerHeight);
  for(const id of ['basic','skill','ultimate','enemyTurn'])must(document.getElementById(id).getBoundingClientRect().height>=44,id+' touch target too small');
  must([...document.querySelectorAll('.mini-ult')].every(n=>n.getBoundingClientRect().height>=44),'Party ultimate touch targets too small');
  must([...document.querySelectorAll('.enemy-visual')].every(n=>n.getBoundingClientRect().height>=12),'Enemy art has no space');
  must(document.documentElement.scrollWidth<=innerWidth+1,'Horizontal overflow');
  must(document.querySelectorAll('.boss-phase-badge').length>=2,'Phase badges missing');
  must(getComputedStyle(document.getElementById('log')).display==='none','Log occupies arena');click('battleLogBtn');must(getComputedStyle(document.getElementById('log')).display!=='none','Log toggle failed');click('battleLogBtn');
  click('battleDetailsBtn');must(getComputedStyle(document.getElementById('statusPanel')).display!=='none','Detail toggle failed');click('battleDetailsBtn');
 }
 click('homeBtn');await new Promise(r=>setTimeout(r,0));
 if(innerWidth<=960)must(unlockCalls===1&&exitCalls===1,'Back did not release orientation/fullscreen');
 // Unsupported APIs must leave the battle playable and offer portrait guidance.
 Object.defineProperty(document.documentElement,'requestFullscreen',{configurable:true,value:undefined});
 Object.defineProperty(screen,'orientation',{configurable:true,value:{}});
 click('beginBattle');await new Promise(r=>setTimeout(r,0));must(!document.getElementById('gameView').hidden,'Unsupported API blocked battle');
 if(innerHeight>innerWidth&&innerWidth<=960){must(!document.getElementById('battleOrientationHint').hidden,'Portrait fallback missing');click('battleOrientationDismiss');must(document.getElementById('battleOrientationHint').hidden,'Portrait dismiss failed');}
 click('homeBtn');
 Object.defineProperty(document.documentElement,'requestFullscreen',{configurable:true,value:async()=>{throw new Error('denied');}});
 click('beginBattle');await new Promise(r=>setTimeout(r,0));must(!document.getElementById('gameView').hidden,'Denied fullscreen blocked battle');
 if(innerWidth<=960){
  click('homeBtn');let resolveFullscreen;
  Object.defineProperty(document.documentElement,'requestFullscreen',{configurable:true,value:()=>new Promise(resolve=>{resolveFullscreen=()=>{fullscreen=document.documentElement;resolve();};})});
  click('beginBattle');click('homeBtn');resolveFullscreen();await new Promise(r=>setTimeout(r,0));
  must(document.getElementById('gameView').hidden&&!fullscreen,'Late fullscreen survived return to menu');
 }
 document.body.dataset.battleTests='passed';
 const output=document.createElement('output');output.id='battleBrowserResult';output.textContent='PASS '+innerWidth+'x'+innerHeight+': battle layout, phase badges, touch controls, log/details, fullscreen/landscape lifecycle, unsupported/denied fallback';document.body.append(output);
}catch(e){document.body.dataset.battleTests='failed';const out=document.createElement('pre');out.id='battleBrowserResult';out.textContent=e.stack;document.body.append(out);}})();
</script>`;
(async()=>{
 fs.mkdirSync(profile,{recursive:true});fs.writeFileSync(fixture,fs.readFileSync(path.join(root,'index.html'),'utf8').replace('</body>',checks+'</body>'));
 try{
 const {stdout}=await exec(process.env.HSR_TEST_CHROME||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',[
 '--headless=new','--disable-gpu','--disable-software-rasterizer','--no-first-run','--disable-extensions','--allow-file-access-from-files','--hide-scrollbars','--user-data-dir='+profile,'--window-size='+size,'--virtual-time-budget=3000','--timeout=20000','--screenshot='+path.join(profile,'battle.png'),'--dump-dom',pathToFileURL(fixture).href
 ],{timeout:60000,windowsHide:true,maxBuffer:3e6});
 fs.writeFileSync(path.join(profile,'dom.html'),stdout);
 const message=stdout.match(/<(?:output|pre) id="battleBrowserResult"[^>]*>([\s\S]*?)<\/(?:output|pre)>/)?.[1];
 if(!stdout.includes('data-battle-tests="passed"'))throw new Error(message||'Browser did not finish');console.log(message);
 }finally{fs.unlinkSync(fixture);}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
