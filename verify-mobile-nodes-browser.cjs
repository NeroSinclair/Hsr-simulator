'use strict';
const fs=require('node:fs'),path=require('node:path');
const {spawn}=require('node:child_process');
const {pathToFileURL}=require('node:url');
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
 const root=__dirname,profile=path.join(root,'.preview-equipment','mobile-nodes-'+process.pid);
 const richPhone=process.argv[2]==='rich';
 fs.mkdirSync(profile,{recursive:true});
 const browser=spawn(process.env.HSR_TEST_CHROME||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',[
  '--headless=new','--disable-gpu','--no-first-run','--disable-extensions','--disable-background-networking','--disable-component-update','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost','--allow-file-access-from-files','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'
 ],{windowsHide:true,stdio:['ignore','ignore','pipe']});
 let socket;
 try{
  const endpoint=await new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>reject(new Error('Chrome startup timed out')),15000);
   let stderr='';browser.stderr.on('data',chunk=>{stderr+=chunk;const match=stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(match){clearTimeout(timer);resolve(match[1]);}});
   browser.on('error',reject);
  });
  socket=new WebSocket(endpoint);await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
  let serial=0;const pending=new Map();
  socket.onmessage=event=>{const message=JSON.parse(event.data);const task=pending.get(message.id);if(task){pending.delete(message.id);clearTimeout(task.timer);message.error?task.reject(new Error(message.error.message)):task.resolve(message.result);}};
  const call=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
   const id=++serial,timer=setTimeout(()=>{pending.delete(id);reject(new Error('CDP timeout: '+method));},20000);
   pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
  const {targetId}=await call('Target.createTarget',{url:'about:blank'});
  const {sessionId}=await call('Target.attachToTarget',{targetId,flatten:true});
  const page=(method,params)=>call(method,params,sessionId);
  const evaluate=async expression=>{
   const result=await page('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
   if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);
   return result.result.value;
  };
  await page('Page.enable');
  await page('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await page('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
  await page('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await page('Page.addScriptToEvaluateOnNewDocument',{source:'Object.defineProperty(navigator,"hardwareConcurrency",{value:'+(richPhone?8:2)+'});Object.defineProperty(navigator,"deviceMemory",{value:'+(richPhone?4:2)+'});'});
  await page('Page.navigate',{url:pathToFileURL(path.join(root,'index.html')).href});
  const ready=async()=>{for(let i=0;i<100;i++){if(await evaluate('!!window.stellarLanguage&&!!document.getElementById("fanWelcome")?.open'))return;await pause(100);}throw new Error('Welcome UI did not initialize');};
  await ready();
  await evaluate(`(async()=>{
   const dialog=document.getElementById('fanWelcome'),image=dialog.querySelector('img');
   if(!dialog.open)throw new Error('Welcome did not open');
   await image.decode();
   if(!image.naturalWidth)throw new Error('Chibi artwork missing');
   if(dialog.getBoundingClientRect().width>innerWidth)throw new Error('Welcome overflows phone');
  })()`);
  await pause(550);
  const welcomeShot=await page('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  fs.writeFileSync(path.join(root,'.preview-equipment','welcome-mobile.png'),Buffer.from(welcomeShot.data,'base64'));
  await evaluate(`(async()=>{
   const select=document.getElementById('welcomeLanguage');select.value='en';select.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(resolve=>setTimeout(resolve,30));
   if(!document.getElementById('fanWelcomeTitle').textContent.includes('playground'))throw new Error('Welcome not translated');
   document.getElementById('fanWelcomeClose').click();if(document.getElementById('fanWelcome').open)throw new Error('Welcome close failed');
  })()`);
  await page('Page.reload');await ready();
  await evaluate(`(()=>{
   if(document.getElementById('welcomeLanguage').value!=='en')throw new Error('Welcome lost saved language');
   stellarLanguage.set('id');document.getElementById('fanWelcomeStart').click();
   if(document.getElementById('fanWelcome').open)throw new Error('Welcome CTA failed');
  })()`);
  await evaluate(`(async()=>{
   const must=(value,message)=>{if(!value)throw new Error(message);},tick=()=>new Promise(resolve=>setTimeout(resolve,30));
   openTeam(0);await tick();
   must(document.querySelectorAll('.quick-relic-card').length===1,'Quick editor must show one slot');
   must(!document.querySelector('.relic-advanced').open,'Detailed editor should start closed');
   must(!document.querySelector('.eidolon-more').open,'Eidolon descriptions should start closed');
   must(!document.querySelector('.simple-stat-summary').open,'Stat table should start closed');
   openGearPicker('relic');chooseGalleryGear('114');await tick();
   const level=document.querySelector('[data-quick-field="level"]');level.value='15';level.dispatchEvent(new Event('change',{bubbles:true}));await tick();
   const piece=buildDraft[buildSlot].build.items.find(p=>p.slot===quickRelicSlot),budget=quickRelicRollCounts(piece).reduce((a,b)=>a+b,0);
   const count=document.querySelector('[data-quick-field="rolls"]');count.value=String(budget);count.dispatchEvent(new Event('change',{bubbles:true}));await tick();
   must(quickRelicRollCounts(piece)[0]===budget,'Quick count did not update');
   must(validateRelicBuild(draftCharacter(),buildDraft[buildSlot].build)==='','Quick edit produced invalid equipment');
   const selected=document.querySelector('[data-quick-field="key"]'),next=[...selected.options].find(option=>option.value!==selected.value);selected.value=next.value;selected.dispatchEvent(new Event('change',{bubbles:true}));await tick();
   const savedKey=piece.enhancement.base[0].key;
   document.getElementById('saveTeam').click();must(!document.getElementById('teamDialog').open,'Quick edit could not save');
   openTeam(0);await tick();must(buildDraft[0].build.items.find(p=>p.slot===quickRelicSlot).enhancement.base[0].key===savedKey,'Quick edits lost on reopen');
   document.querySelector('.quick-relic-intro').scrollIntoView({block:'start'});await tick();
   must(document.getElementById('teamDialog').scrollWidth<=document.getElementById('teamDialog').clientWidth+1,'Quick editor overflows phone');
  })()`);
  await pause(550);
  const relicShot=await page('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  fs.writeFileSync(path.join(root,'.preview-equipment','quick-relic-mobile.png'),Buffer.from(relicShot.data,'base64'));
  await evaluate(`(()=>{
   document.getElementById('teamDialog').close();
   for(const mode of ['moc','pf','as','aa']){
    lobbyMode=mode;lobbyPreset=0;renderLobby();
    if(document.querySelectorAll('.simple-encounter-wave').length!==challenges[mode][0].waves.length)throw new Error('Wrong playable lineup: '+mode);
    if(document.querySelector('.simple-encounter-reference').open)throw new Error('References not collapsed');
   }
  })()`);
  const result=await evaluate(`(async()=>{
   const must=(value,message)=>{if(!value)throw new Error(message);};
   const tick=()=>new Promise(resolve=>setTimeout(resolve,50));
   must(innerWidth===390,'Not an actual 390px viewport');
   must(matchMedia('(pointer: coarse)').matches,'Touch emulation missing');
   must(document.documentElement.classList.contains('low-motion')===${!richPhone},'Motion tier detection incorrect');
   const mode=document.querySelector('[data-lobby-mode="custom"]');mode.click();await tick();
   const chosen=document.querySelector('.mode-card.chosen');
   chosen.dispatchEvent(new PointerEvent('pointerdown',{pointerType:'touch',bubbles:true,clientX:20,clientY:20}));
   must(chosen.querySelector('.stellar-ripple'),'Low-end phone lost touch animation');
   must(chosen.getAnimations().length>0,'Phone tap feedback missing');
   if(!document.documentElement.classList.contains('low-motion')){
    must(getComputedStyle(chosen,'::after').animationName==='stellar-mobile-sweep','Mobile card sheen missing');
    must(getComputedStyle(document.querySelector('.stellar-aurora')).animationName==='stellar-aurora','Mobile ambient motion missing');
   }
   document.getElementById('freeEnemyClear').click();
   const normal=freeEnemyCatalog.find(m=>m.kind==='normal'&&m.variants.length),boss=freeEnemyCatalog.find(m=>m.kind==='boss'&&m.variants.length),elite=freeEnemyCatalog.find(m=>m.kind==='elite'&&m.variants.length);
   addFreeEnemy(normal.name);document.getElementById('freeNodeAdd').click();
   must(freeNodes.length===2&&freeNodeIndex===1,'Add node failed');
   addFreeEnemy(boss.name);must(!addFreeEnemy(boss.name),'Second boss accepted');
   addFreeEnemy(elite.name);addFreeEnemy(elite.name);must(!addFreeEnemy(elite.name),'Third elite accepted');
   addFreeEnemy(normal.name);addFreeEnemy(normal.name);must(!addFreeEnemy(normal.name),'Sixth enemy accepted');
   selectFreeNode(0);must(customEnemies.length===1,'Node contents mixed');selectFreeNode(1);
   stellarLanguage.set('en');await tick();must(document.getElementById('freeNodeAdd').textContent.includes('Add node'),'New UI not translated');
   stellarLanguage.set('id');await tick();
   document.getElementById('freeNodeTabs').scrollIntoView({block:'start'});await tick();
   must(document.documentElement.scrollWidth<=innerWidth+1,'Free Battle overflows phone viewport');
   must(document.getElementById('freeEnemyKind').getBoundingClientRect().width>=100,'Enemy filter too narrow');
   must(document.querySelector('.free-selected-enemy').getBoundingClientRect().height<130,'Selected enemy rows are too tall');
   return 'PASS: 390px touch viewport, ${richPhone?'full mobile motion':'low-end tap effects'}, compact node controls, enemy limits, language switching and no overflow';
  })()`);
  const screenshot=await page('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  fs.writeFileSync(path.join(root,'.preview-equipment',richPhone?'free-nodes-mobile-rich.png':'free-nodes-mobile.png'),Buffer.from(screenshot.data,'base64'));
  await evaluate(`(async()=>{
   const must=(value,message)=>{if(!value)throw new Error(message);};
   autoTechnique=false;document.getElementById('beginBattle').click();await new Promise(resolve=>setTimeout(resolve,100));
   must(state.mode==='custom'&&state.wave===1&&encounter().waves.length===2,'Multi-node battle did not start');
   state.enemies.forEach(enemy=>enemy.hp=0);resolveWave();render();
   must(state.wave===2&&!state.ended,'Did not continue to boss node');
   must(document.getElementById('waveLabel').textContent.includes('2 / 2'),'Node progress missing');
   const actor=state.team.find(unit=>unit.hp>0);actor.energy=100;perform('ultimate',actor);
   must(document.getElementById('activeArt').getAnimations().length>0,'Low-end phone lost attack motion');
  })()`);
  await pause(750);
  await page('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await evaluate(`(()=>{const button=document.getElementById('basic');const count=document.querySelectorAll('.stellar-ripple').length;button.dispatchEvent(new PointerEvent('pointerdown',{pointerType:'touch',bubbles:true}));if(document.querySelectorAll('.stellar-ripple').length!==count)throw new Error('Reduced motion ignored');})()`);
  console.log(result+'; welcome artwork, close/reload/language, quick Relic save/reopen, simplified challenge modes, sequential battle, attack animation and reduced-motion behavior verified');
  await call('Browser.close');
 }finally{socket?.close();browser.kill();}
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
