'use strict';
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {execFile}=require('node:child_process');
const {promisify}=require('node:util');
const exec=promisify(execFile),root=__dirname;
const fixture=path.join(root,'.language-browser-check.html');
const checks=String.raw`<script>
(async()=>{try{
 const must=(value,message)=>{if(!value)throw new Error(message);};
 const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
 const picker=document.getElementById('lobbyLanguage');
 document.getElementById('fanWelcomeClose')?.click();
 must(picker,'Language picker missing');
 must(picker.parentElement.nextElementSibling.id==='lobbyGuideBtn','Picker must precede guide');
 stellarLanguage.set('id');await tick();
 must(stellarLanguage.descriptionCount>1000,'Description variants missing');
 const descriptionFixture=document.createElement('div');descriptionFixture.hidden=true;
 const strip=value=>value.replace(/<[^>]*>/g,'');
 const normalize=value=>strip(value).replace(/\s+/g,' ').trim();
 for(const [source,id] of stellarDescriptionTranslations){const p=document.createElement('p');p.textContent=strip(source);p.dataset.expected=normalize(id);p.dataset.original=strip(source);descriptionFixture.append(p);}
 const rawTranslations=new Map(stellarDescriptionTranslations);
 for(const cone of completeLightConeData){for(let level=1;level<=cone.params.length;level++){
  const p=document.createElement('p');p.textContent=traceDescription(cone,level);p.dataset.original=p.textContent;p.dataset.expected=normalize(traceDescription({...cone,desc:rawTranslations.get(cone.desc)},level));descriptionFixture.append(p);
 }}
 for(const set of completeRelicSetData){const p=document.createElement('p');p.textContent=set.desc.join(' ');p.dataset.original=p.textContent;p.dataset.expected=normalize(set.desc.map(source=>rawTranslations.get(source)).join(' '));descriptionFixture.append(p);}
 document.body.append(descriptionFixture);await tick();
 for(const p of descriptionFixture.children)must(normalize(p.textContent)===p.dataset.expected,'Description not translated: '+p.dataset.original.slice(0,90));
 stellarLanguage.set('en');await tick();
 for(const p of descriptionFixture.children)must(p.textContent===p.dataset.original,'Original English not restored');
 descriptionFixture.remove();stellarLanguage.set('id');await tick();
 must(document.documentElement.lang==='id','Indonesian document language missing');
 must(document.getElementById('beginBattle').textContent.includes('MULAI BERTARUNG'),'Indonesian start label missing');
 must(document.querySelector('.lobby-intro h1').textContent.includes('coba strategimu.'),'Intro not localized');
 const names=teamConfig.map(c=>c.id).join(',');
 stellarLanguage.set('en');await tick();
 must(document.getElementById('lobbyGuideBtn').textContent==='Guide','English guide label missing');
 must(document.querySelector('.lobby-intro h1').textContent.includes('try your strategy.'),'English intro missing');
 must(localStorage.getItem('stellar-language')==='en','Language not persisted');
 must(document.getElementById('battleLanguage').value==='en','Battle picker not synchronized');
 lobbyMode='custom';renderLobby();await tick();
 must(document.getElementById('freeEnemyKind').options[0].text==='All types','Enemy filters not translated');
 must(!document.getElementById('customCount').textContent.includes('hasil'),'Dynamic count not translated');
 openTeam(0);await tick();
 must(document.getElementById('saveTeam').textContent.includes('Save team'),'Equipment labels not translated');
 must(teamConfig.map(c=>c.id).join(',')===names,'Language switch changed team');
 stellarLanguage.set('id');await tick();
 const eidolonDescription=document.querySelector('.eidolon-detail p');
 must(eidolonDescription&&eidolonDescription.lang==='id','Eidolon description language missing');
 must(!eidolonDescription.textContent.includes('Increases the'),'Eidolon still English');
 openGearPicker('lc');await tick();
 const cone=lightCones.find(x=>x.id===previewLightCone),englishDescription=traceDescription(cone,buildDraft[buildSlot].build.superimposition);
 must(document.querySelector('.lc-passive-description').textContent!==englishDescription,'Light Cone description still English');
 stellarLanguage.set('en');await tick();
 must(document.querySelector('.lc-passive-description').textContent===englishDescription,'LC English not restored');
 document.getElementById('gearPicker').close();stellarLanguage.set('id');await tick();
 must(document.getElementById('saveTeam').textContent.includes('Simpan tim'),'Reverse translation failed');
 stellarLanguage.set('en');await tick();
 must(document.getElementById('saveTeam').textContent.includes('Save team'),'Repeated translation failed');
 document.getElementById('teamDialog').close();
 document.getElementById('lobbyGuideBtn').click();await tick();
 must(document.querySelector('#guideDialog h2').textContent==='Try your first team','Guide not translated');
 document.getElementById('guideDialog').close();
 must(document.documentElement.scrollWidth<=innerWidth+1,'Horizontal overflow at '+innerWidth);
 const rect=picker.getBoundingClientRect();must(rect.width>60&&rect.left>=0&&rect.right<=innerWidth,'Language picker clipped');
 document.getElementById('beginBattle').click();await tick();
 must(!document.getElementById('gameView').hidden,'Battle failed to start');
 must(document.getElementById('guideBtn').textContent.includes('Guide'),'Battle guide not translated');
 must(document.getElementById('basic').textContent.includes('Basic ATK'),'Battle action not translated');
 const actor=state.team.find(unit=>unit.hp>0);actor.energy=100;perform('ultimate',actor);
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.documentElement.classList.contains('low-motion'))must(document.querySelector('.stellar-ultimate'),'Ultimate impact animation missing');
 document.getElementById('homeBtn').click();await tick();
 stellarLanguage.set('id');await tick();
 must(document.getElementById('basic').textContent.includes('Serangan biasa'),'Battle action reverse translation failed');
 const sheet=[...document.styleSheets].find(s=>s.href?.endsWith('language-motion.css'));
 must(sheet&&[...sheet.cssRules].some(r=>r.conditionText?.includes('prefers-reduced-motion')),'Reduced-motion support missing');
 if(navigator.hardwareConcurrency<=2)must(document.documentElement.classList.contains('low-motion'),'Low-end motion fallback missing');
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)must(getComputedStyle(document.querySelector('.lobby-intro')).animationName==='none','Reduced-motion animation still running');
 must(document.querySelectorAll('.stellar-spark').length===12,'Ambient stars missing');
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.documentElement.classList.contains('low-motion')){
  must(getComputedStyle(document.querySelector('.stellar-aurora')).animationName==='stellar-aurora','Ambient animation missing');
  const button=document.getElementById('lobbyGuideBtn');button.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:button.getBoundingClientRect().left+5,clientY:button.getBoundingClientRect().top+5}));
  must(button.querySelector('.stellar-ripple'),'Click effect missing');
 }
 document.body.dataset.languageTests='passed';
 const output=document.createElement('output');output.id='languageResult';output.textContent='PASS '+innerWidth+'px: language placement, persistence, dynamic panels, repeated switching, team integrity, guide, battle, layout, reduced motion';document.body.append(output);
}catch(e){document.body.dataset.languageTests='failed';const out=document.createElement('pre');out.id='languageResult';out.textContent=e.stack;document.body.append(out);}})();
</script>`;
(async()=>{
 const profile=path.join(root,'.preview-equipment','language-profile-'+process.pid);fs.mkdirSync(profile,{recursive:true});
 const lowEnd=process.argv[3]==='low';
 let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 if(lowEnd)html=html.replace('<script src="language.js">','<script>Object.defineProperty(navigator,"hardwareConcurrency",{value:2});</script><script src="language.js">');
 fs.writeFileSync(fixture,html.replace('</body>',checks+'</body>'));
 try{
 const {stdout}=await exec(process.env.HSR_TEST_CHROME||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',[
 '--headless=new','--disable-gpu','--no-first-run','--disable-extensions','--disable-background-networking','--disable-component-update','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost','--allow-file-access-from-files','--hide-scrollbars',...(lowEnd?['--force-prefers-reduced-motion']:[]),'--user-data-dir='+profile,'--window-size='+(process.argv[2]||'1440,960'),'--virtual-time-budget=6000','--timeout=20000','--screenshot='+path.join(root,'.preview-equipment','language.png'),'--dump-dom',pathToFileURL(fixture).href
 ],{timeout:60000,windowsHide:true,maxBuffer:5e6});
 fs.writeFileSync(path.join(root,'.preview-equipment','language-dom.html'),stdout);
 const message=stdout.match(/<(?:output|pre) id="languageResult"[^>]*>([\s\S]*?)<\/(?:output|pre)>/)?.[1];
 if(!stdout.includes('data-language-tests="passed"'))throw new Error(message||'Browser checks did not complete');console.log(message);
 }finally{fs.unlinkSync(fixture);}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
