'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {execFile}=require('node:child_process');
const {promisify}=require('node:util');
const exec=promisify(execFile);
const chrome=process.env.HSR_TEST_CHROME||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const root=__dirname,profile=path.join(root,'.preview-equipment');
const fixture=path.join(root,'.equipment-browser-check.html');
const state=process.argv[2]||'lc';
if(!['lc','upgrade','sets'].includes(state))throw new Error('Choose lc, upgrade or sets');
const checks=String.raw`
<script>
try {
 const must=(condition,message)=>{if(!condition)throw new Error(message);};
 const change=(id,value)=>{const input=document.getElementById(id);must(input,'Missing '+id);input.value=String(value);input.dispatchEvent(new Event('change',{bubbles:true}));};
 openTeam(0);
 document.querySelector('[data-relic-layout="split"]').click();
 document.querySelector('[data-open-gear="relic"][data-gear-target="pair-a"]').click();
 must(pickerTarget==='pair-a','A target lost');
 document.querySelector('[data-gallery-choice="114"]').click();
 document.querySelector('[data-open-gear="relic"][data-gear-target="pair-b"]').click();
 must(pickerTarget==='pair-b','B target lost');
 document.querySelector('[data-gallery-choice="121"]').click();
 must(buildDraft[0].build.items.slice(0,2).every(p=>p.set==='114'),'A overwritten');
 must(buildDraft[0].build.items.slice(2,4).every(p=>p.set==='121'),'B not installed');
 must(fullSetBonus(draftCharacter(),buildDraft[0].build).spdPct===12,'2pc bonuses wrong');
 change('enhance-initial-head',4);change('enhance-level-head',15);change('enhance-tier-head-0',2);
 for(let i=0;i<5;i++){change('enhance-target-head-'+i,0);change('enhance-roll-tier-head-'+i,2);}
 must(Math.abs(buildDraft[0].build.items[0].subs[0].value-19.44)<1e-6,'4-stat max roll incorrect');
 change('enhance-initial-head',3);
 must(Math.abs(buildDraft[0].build.items[0].subs[0].value-16.2)<1e-6,'+3 must unlock rather than boost');
 document.getElementById('saveTeam').click();must(!document.getElementById('teamDialog').open,'Save rejected');
 openTeam(0);must(buildDraft[0].build.items[0].enhancement.level===15,'Upgrade history lost');
 must(fullSetBonus(draftCharacter(),buildDraft[0].build).spdPct===12,'Set bonuses lost on save');
 openGearPicker('lc');
 must(document.querySelectorAll('[data-lc-preview]').length===catalogueLightCones().length,'LC cards missing');
 const cone=lightCones.find(l=>l.name==='Along the Passing Shore');
 document.querySelector('[data-lc-preview="'+cone.id+'"]').click();
 must(document.querySelector('.lc-inspector h3').textContent===cone.name,'LC details incorrect');
 const search=document.getElementById('gearPickerSearch');search.value='Acheron';search.dispatchEvent(new Event('input',{bubbles:true}));
 must(document.querySelectorAll('[data-lc-preview]').length===1,'Owner search failed');
 document.querySelector('[data-confirm-lc]').click();must(buildDraft[0].build.lc===cone.id,'Equip failed');
 must(buildDraft[0].build.items[0].enhancement.level===15,'LC picker lost upgrades');
 const savedDraft=JSON.parse(JSON.stringify(buildDraft[0]));let testedSignatures=0;
 for(const character of roster){
  const signature=signatureLC(character);if(!signature)continue;
  changeBuildCharacter(0,character.id);openGearPicker('lc');
  const card=document.querySelector('[data-lc-preview="'+signature.id+'"]');must(card,'Signature card absent: '+character.name);
  card.click();must(document.querySelector('.lc-inspector h3').textContent===signature.name,'Wrong signature preview: '+character.name);
  const equipRect=document.querySelector('[data-confirm-lc]').getBoundingClientRect(),bodyRect=document.getElementById('gearPickerBody').getBoundingClientRect();
  must(equipRect.bottom<=bodyRect.bottom+1&&equipRect.top>=bodyRect.top-1,'Signature Equip button clipped: '+character.name+' '+JSON.stringify({width:innerWidth,height:innerHeight,body:bodyRect.toJSON(),button:equipRect.toJSON(),inspector:document.querySelector('.lc-inspector').getBoundingClientRect().toJSON(),max:getComputedStyle(document.querySelector('.lc-inspector')).maxHeight}));
  document.querySelector('[data-confirm-lc]').click();
  must(buildDraft[0].build.lc===signature.id,'Signature not equipped: '+character.name);
  must(signature.path===character.path,'Signature Path mismatch: '+character.name);
  must(validateRelicBuild(character,buildDraft[0].build)==='','Signature build rejected: '+character.name);
  must(Object.values(computeStats(character,buildDraft[0].build)).every(Number.isFinite),'Invalid signature stats: '+character.name);
  testedSignatures++;
 }
 must(testedSignatures>=35,'Insufficient signature coverage: '+testedSignatures);
 buildDraft[0]=savedDraft;drawBuildPanel();
 if('TEST_STATE'==='lc')openGearPicker('lc');
 if('TEST_STATE'==='upgrade')document.querySelector('.affix-workspace').scrollIntoView();
 must(parseFloat(getComputedStyle(document.querySelector('.enhancement-pieces select')).fontSize)>=12,'Relic font too small');
 if('TEST_STATE'==='lc')must(parseFloat(getComputedStyle(document.querySelector('.lc-inventory-card>b')).fontSize)>=(innerWidth<=720?12:13),'LC font too small');
 document.body.dataset.equipmentTests='passed';
 const marker=document.createElement('output');marker.id='browserEquipmentResult';marker.textContent='PASS: real DOM A/B selection, 12% SPD, legal 3/4 substat rolls, save/reopen, 170 LC cards, owner search, inspection/equip, '+testedSignatures+' character signatures, readable computed fonts and upgrade persistence.';marker.hidden=true;document.body.append(marker);
} catch(error){document.body.dataset.equipmentTests='failed';const marker=document.createElement('pre');marker.id='browserEquipmentResult';marker.textContent=error.stack;document.body.append(marker);}
</script>`;
async function main(){
 fs.mkdirSync(profile,{recursive:true});
 let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 html=html.replace('</body>',checks.replaceAll('TEST_STATE',state)+'</body>');
 fs.writeFileSync(fixture,html);
 const screenshot=path.join(profile,state+'.png');
 const args=['--headless=new','--disable-gpu','--disable-software-rasterizer','--no-sandbox','--no-first-run','--disable-extensions','--disable-crash-reporter','--disable-breakpad','--allow-file-access-from-files','--user-data-dir='+profile,'--window-size='+(process.env.HSR_TEST_VIEWPORT||'1440,1100'),'--virtual-time-budget=3000','--timeout=20000','--screenshot='+screenshot,'--dump-dom',pathToFileURL(fixture).href];
 try {
  const {stdout,stderr}=await exec(chrome,args,{timeout:60000,windowsHide:true,maxBuffer:3e6});
  fs.writeFileSync(path.join(profile,state+'-dom.html'),stdout);fs.writeFileSync(path.join(profile,state+'-browser.log'),stderr);
  const result=stdout.match(/<output id="browserEquipmentResult"[^>]*>([\s\S]*?)<\/output>/)?.[1]||stdout.match(/<pre id="browserEquipmentResult">([\s\S]*?)<\/pre>/)?.[1];
  if(!stdout.includes('data-equipment-tests="passed"'))throw new Error(result||'Browser checks did not finish; see '+profile);
  console.log(result);console.log('Screenshot: '+screenshot);
 } finally {fs.unlinkSync(fixture);}
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
