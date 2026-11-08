'use strict';
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const exec=require('node:util').promisify(require('node:child_process').execFile);
const root=__dirname,fixture=path.join(root,'.preset-browser-check.html');
const mobile=process.argv[2]==='mobile',profile=path.join(root,'.preview-equipment','presets-'+(mobile?'mobile':'desktop'));
const checks=`<script>
try{
 const must=(ok,msg)=>{if(!ok)throw new Error(msg);};
 const change=(id,value,type='change')=>{const node=document.getElementById(id);must(node,'Missing '+id);node.value=value;node.dispatchEvent(new Event(type,{bubbles:true}));};
 const click=selector=>{const node=document.querySelector(selector);must(node,'Missing '+selector);node.click();};
 const partyBefore=JSON.stringify(teamConfig);
 click('#teamPresetBtn');must(document.getElementById('presetTeamDialog').open,'Dialog not open');
 must(document.querySelectorAll('[data-team-preset]').length===teamPresets.length,'Preset cards missing');
 change('presetTeamEvidence','meta');must([...document.querySelectorAll('[data-team-preset]')].every(n=>teamPresets.find(p=>p.id===n.dataset.teamPreset).evidence==='meta'),'Meta filter leak');
 change('presetTeamEvidence','all');
 click('[data-team-preset="elation-mono"]');
 must(document.querySelector('#preset-lc').value==='23057','SW999 signature not selected');
 must(document.querySelector('#preset-lc option').textContent.includes('SIGNATURE'),'Signature label missing');
 click('[data-preset-action="choose"]');
 change('presetTeamTier','f2p');must(document.querySelectorAll('[data-team-preset]').length>3,'F2P filter empty');
 must([...document.querySelectorAll('.preset-tier')].every(n=>n.classList.contains('f2p')),'F2P filter leak');
 change('presetTeamSearch','DOES NOT EXIST','input');must(document.querySelector('.preset-empty'),'Search not applied');
 change('presetTeamSearch','','input');change('presetTeamTier','all');
 click('[data-team-preset="rem-mono"]');must(JSON.stringify(teamConfig)===partyBefore,'Selection mutated party');
 click('[data-preset-slot="1"]');
 change('preset-relic','127+113');change('preset-lc','24005');change('preset-superimposition','3');
 click('[data-preset-slot="0"]');click('[data-preset-slot="1"]');
 must(document.getElementById('preset-relic').value==='127+113','Gear reset on character tab');
 must(document.getElementById('preset-lc').value==='24005','LC reset on character tab');
 must(document.getElementById('preset-superimposition').value==='3','SI reset on tab');
 click('[data-preset-action="next"]');click('[data-preset-action="next"]');click('[data-preset-action="next"]');
 must(document.querySelectorAll('.preset-review-grid article').length===4,'Review missing');
 must(JSON.stringify(teamConfig)===partyBefore,'Review mutated party');
 click('[data-preset-action="apply"]');must(!document.getElementById('presetTeamDialog').open,'Apply did not close');
 must(teamConfig.map(c=>c.id).join(',')==='1407,1413,1415,1409','Party not applied');
 must(teamConfig[1].build.lc==='24005'&&teamConfig[1].build.superimposition===3,'LC not committed');
 must(teamConfig[1].build.items.slice(0,4).map(p=>p.set).join(',')==='127,127,113,113','Mixed sets not committed');
 must(document.getElementById('lobbyTeam').querySelectorAll('[data-menu-slot]').length===4,'Party menu not refreshed');
 must(document.getElementById('gearShortcutName').textContent==='Castorice','Equipment shortcut stale');
 const applied=JSON.stringify(teamConfig);click('#teamPresetBtn');click('[data-team-preset="dot-free"]');click('#presetTeamClose');
 must(JSON.stringify(teamConfig)===applied,'Cancel mutated party');
 lobbyMode='moc';lobbyPreset=2;renderLobby();
 must(document.querySelector('[data-lobby-preset="2"]').classList.contains('voracity-node'),'Voracity node not red');
 must(!document.querySelector('[data-lobby-preset="0"]').classList.contains('voracity-node'),'Clean node marked red');
 beginBattle();const liveParty=JSON.stringify(state.team.map(c=>c.id));showLobby();
 click('#teamPresetBtn');click('[data-team-preset="dot-free"]');
 for(let i=0;i<4;i++)click('[data-preset-action="next"]');click('[data-preset-action="apply"]');
 must(JSON.stringify(state.team.map(c=>c.id))===liveParty,'Preset rewrote running battle');
 click('#teamPresetBtn');
 const dialog=document.getElementById('presetTeamDialog');
 must(dialog.scrollWidth<=dialog.clientWidth+1,'Preset list overflows '+innerWidth);
 click('[data-team-preset="elation-mono"]');
 must(dialog.scrollWidth<=dialog.clientWidth+1,'Gear editor overflows '+innerWidth);
 must(parseFloat(getComputedStyle(document.getElementById('preset-lc')).fontSize)>=(innerWidth<=760?16:14),'Gear text too small');
 const button=document.querySelector('[data-preset-action="next"]'),rect=button.getBoundingClientRect(),frame=dialog.getBoundingClientRect();
 must(rect.top>=frame.top&&rect.bottom<=frame.bottom+1,'Next button clipped');
 dialog.close();showLobby();lobbyMode='custom';renderLobby();document.getElementById('menuEncounterDetails').open=true;
 must(document.querySelectorAll('[data-custom-enemy]').length===48,'Free catalogue must paginate');
 click('#freeEnemyMore');must(document.querySelectorAll('[data-custom-enemy]').length===96,'More enemies missing');
 change('freeEnemyKind','boss');must(filteredFreeEnemies().every(m=>m.kind==='boss'),'Enemy type filter leak');
 click('#freeEnemyResetFilters');change('enemySearch','Borisin Warhead: Hoolay','input');
 click('#freeEnemyClear');click('[data-custom-enemy="Borisin Warhead: Hoolay"]');
 const monster=freeEnemyByName.get('Borisin Warhead: Hoolay'),variant=monster.variants[1];
 const variantSelect=document.querySelector('[data-free-variant]');variantSelect.value=variant.id;variantSelect.dispatchEvent(new Event('change',{bubbles:true}));
 click('[data-free-action="duplicate"]');must(customEnemies.length===2,'Duplicate enemy missing');
 change('freeEnemyHpScale','2');
 must(document.querySelector('.lobby-stage').scrollWidth<=document.querySelector('.lobby-stage').clientWidth+1,'Free Battle overflows');
 click('#beginBattle');must(state.enemies.length===2&&state.enemies.every(e=>e.catalogId===variant.id),'Variant not applied');
 must(state.enemies[0].hp===Math.round(variant.hp*200),'HP scale not applied');
 showLobby();click('[data-free-action="remove"]');must(state.enemies.length===2,'Menu modified live enemies');
 click('#freeEnemyResetFilters');change('enemySearch','All or Nothing','input');
 const quoted=document.querySelector('[data-custom-enemy]');must(quoted&&quoted.dataset.customEnemy.includes('"'),'Quoted name damaged');
 quoted.click();must(customEnemies.includes(quoted.dataset.customEnemy),'Quoted enemy could not be selected');
 document.body.dataset.presetTests='passed';
 const result=document.createElement('output');result.id='presetBrowserResult';result.textContent='PASS at '+innerWidth+'px: team presets, Free Battle filters/pagination, duplicate enemies, variants, HP scale, battle isolation, quoted names and layout';document.body.append(result);
}catch(error){document.body.dataset.presetTests='failed';const result=document.createElement('pre');result.id='presetBrowserResult';result.textContent=error.stack;document.body.append(result);}
</script>`;
(async()=>{
 fs.mkdirSync(profile,{recursive:true});
 fs.writeFileSync(fixture,fs.readFileSync(path.join(root,'index.html'),'utf8').replace('</body>',checks+'</body>'));
 try{
  const {stdout}=await exec(process.env.HSR_TEST_CHROME||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',[
   '--headless=new','--disable-gpu','--disable-software-rasterizer','--no-first-run','--disable-extensions','--allow-file-access-from-files',
   '--user-data-dir='+profile,'--window-size='+(mobile?'500,960':'1440,1100'),'--virtual-time-budget=3000','--timeout=20000','--dump-dom',pathToFileURL(fixture).href
  ],{timeout:60000,windowsHide:true,maxBuffer:3e6});
  fs.writeFileSync(path.join(profile,'dom.html'),stdout);
  const message=stdout.match(/<(?:output|pre) id="presetBrowserResult"[^>]*>([\s\S]*?)<\/(?:output|pre)>/)?.[1];
  if(!stdout.includes('data-preset-tests="passed"'))throw new Error(message||'Browser did not finish');
  console.log(message);
 }finally{fs.unlinkSync(fixture);}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
