'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {run,get,clickListeners,html}=require('./verify-menu.cjs');
function click(selector,dataset,attributes={}){for(const listener of clickListeners)listener({target:{closest(s){return s===selector?{dataset,getAttribute(name){return attributes[name];}}:null;}}});}
function change(slot,field,value,index){get('buildPanel').onchange({target:{id:`test-${field}`,dataset:{enhanceSlot:slot,enhanceField:field,enhanceIndex:String(index??0)},value:String(value)}});}
const close=(a,b,message)=>assert.ok(Math.abs(a-b)<1e-6,message||`${a} != ${b}`);
// Real delegated controls: selecting B must leave A intact and persist through save/reopen.
run('openTeam(1)');
click('[data-relic-layout]',{relicLayout:'split'});
assert.ok(get('buildPanel').innerHTML.includes('data-gear-target="pair-a"'));
assert.ok(get('buildPanel').innerHTML.includes('data-gear-target="pair-b"'));
click('[data-open-gear]',{openGear:'relic',gearTarget:'pair-a'});
assert.equal(run('pickerTarget'),'pair-a');
assert.ok(get('relicPickerSummary').innerHTML.includes('SET A'));
click('[data-gallery-choice]',{galleryChoice:'114'});
click('[data-open-gear]',{openGear:'relic',gearTarget:'pair-b'});
assert.equal(run('pickerTarget'),'pair-b');
click('[data-gallery-choice]',{galleryChoice:'121'});
assert.equal(run("buildDraft[1].build.items.slice(0,2).every(p=>p.set==='114')"),true);
assert.equal(run("buildDraft[1].build.items.slice(2,4).every(p=>p.set==='121')"),true);
assert.equal(run('fullSetBonus(draftCharacter(),buildDraft[1].build).spdPct'),12);
assert.equal(run('relicPairTitle(buildDraft[1].build.items.slice(0,4))'),'2pc + 2pc aktif');
get('saveTeam').onclick();run('openTeam(1)');
assert.equal(run("buildDraft[1].build.relicLayout"),'split');
assert.equal(run('fullSetBonus(draftCharacter(),buildDraft[1].build).spdPct'),12);
// Both planar pieces also use exactly the same legal upgrade model.
run("openGearPicker('planar');chooseGalleryGear('301')");
change('sphere','level',15);change('sphere','initialCount',4);
assert.equal(run('buildDraft[1].build.items[4].enhancement.level'),15);
assert.equal(run('calculatedRelicSubs(buildDraft[1].build.items[4]).reduce((n,s)=>n+s.rollCount,0)'),9);
// Substats are selected from roll tiers; no arbitrary number fields remain.
assert.ok(!get('buildPanel').innerHTML.includes('type="number"'));
assert.equal((get('buildPanel').innerHTML.match(/class="upgrade-roll /g)||[]).length,30);
change('head','level',15);change('head','initialCount',4);change('head','tier',2,0);
for(let i=0;i<5;i++){change('head','target',0,i);change('head','rollTier',2,i);}
close(run('buildDraft[1].build.items[0].subs[0].value'),19.44);
assert.equal(run('calculatedRelicSubs(buildDraft[1].build.items[0])[0].rollCount'),6);
assert.equal(run('validateRelicBuild(draftCharacter(),buildDraft[1].build)'),'');
// Three initial stats spend +3 on the unlock, allowing only FOUR later boosts.
change('head','initialCount',3);
assert.equal(run('buildDraft[1].build.items[0].enhancement.rolls[0].target'),3);
close(run('buildDraft[1].build.items[0].subs[0].value'),16.2);
assert.equal(run('calculatedRelicSubs(buildDraft[1].build.items[0]).reduce((n,s)=>n+s.rollCount,0)'),8);
change('head','level',2);
assert.equal(run('buildDraft[1].build.items[0].subs.filter(s=>s.key!=="none").length'),3);
close(run('pieceBonus(draftCharacter(),buildDraft[1].build.items[0]).hpFlat'),112.896+39.5136*2);
change('head','level',3);
assert.equal(run('buildDraft[1].build.items[0].subs.filter(s=>s.key!=="none").length'),4);
assert.equal(run('calculatedRelicSubs(buildDraft[1].build.items[0])[3].rollCount'),1);
// Main-stat changes repair conflicts without creating a fifth substat.
change('body','main','critRate');
assert.ok(run("buildDraft[1].build.items[2].enhancement.base.every(s=>s.key!=='critRate')"));
assert.equal(run('new Set(buildDraft[1].build.items[2].enhancement.base.map(s=>s.key)).size'),4);
// Gacha buttons stop at +15, consume one milestone, and never overflow the roll budget.
click('[data-reset-piece]',{}, {'data-reset-piece':'head'});
assert.equal(run('buildDraft[1].build.items[0].enhancement.level'),0);
click('[data-upgrade-piece]',{}, {'data-upgrade-piece':'head'});
assert.equal(run('buildDraft[1].build.items[0].enhancement.level'),3);
click('[data-max-piece]',{}, {'data-max-piece':'head'});
assert.equal(run('buildDraft[1].build.items[0].enhancement.level'),15);
assert.equal(run('calculatedRelicSubs(buildDraft[1].build.items[0]).reduce((n,s)=>n+s.rollCount,0)'),8);
assert.equal(run('upgradeRelicPiece(buildDraft[1].build.items[0])'),false);
// Tampered cached totals cannot add stats, and saving rejects an invalid history.
run('var upgradePiece=buildDraft[1].build.items[0];var beforeTamper=pieceBonus(draftCharacter(),upgradePiece);upgradePiece.subs[0].value=9999;');
assert.equal(run('JSON.stringify(pieceBonus(draftCharacter(),upgradePiece))===JSON.stringify(beforeTamper)'),true);
assert.ok(run('validateRelicEnhancement(upgradePiece)').includes('riwayat'));
run('syncRelicSubstats(upgradePiece);var isolatedBuild=normalizeBuild(buildDraft[1]);isolatedBuild.items[0].enhancement.rolls[1].tier=99;');
assert.notEqual(run('buildDraft[1].build.items[0].enhancement.rolls[1].tier'),99);
assert.ok(run('validateRelicEnhancement(isolatedBuild.items[0])').length>0);
// LC inventory renders every stored entry exactly once, grouped by rarity/Path.
run("openGearPicker('lc')");
assert.equal((get('gearPickerBody').innerHTML.match(/data-lc-preview=/g)||[]).length,run('catalogueLightCones().length'));
assert.ok(get('gearPickerCount').textContent.includes('170'));
assert.ok(get('gearPickerBody').innerHTML.includes('lc-inspector'));
assert.ok(!get('gearPickerBody').innerHTML.includes('gallery-effect'));
get('gearPickerSearch').value='Acheron';get('gearPickerSearch').oninput();
assert.ok(get('gearPickerBody').innerHTML.includes('Along the Passing Shore'));
assert.equal((get('gearPickerBody').innerHTML.match(/data-lc-preview=/g)||[]).length,1);
get('gearPickerSearch').value='';get('gearPickerRarity').value='3';get('gearPickerRarity').onchange();
assert.equal((get('gearPickerBody').innerHTML.match(/data-lc-preview=/g)||[]).length,25);
get('gearPickerPathFilter').value='same';get('gearPickerPathFilter').onchange();
assert.ok(run('Object.values(filteredLCGroups(draftCharacter())).flat().every(l=>l.rarity===3&&l.path===draftCharacter().path)'));
get('gearPickerPathFilter').value='all';get('gearPickerRarity').value='0';run('drawGearPicker()');
run('var originalLC=buildDraft[buildSlot].build.lc');click('[data-lc-preview]',{lcPreview:'23005'});
assert.equal(run('buildDraft[buildSlot].build.lc===originalLC'),true,'preview must not equip');
click('[data-confirm-lc]',{confirmLc:'23005'});assert.equal(run('buildDraft[buildSlot].build.lc'),'23005');
// New verified source entries merge without losing any existing LC or allowing duplicate IDs.
run("var onlineMeta={'29998':{id:'29998',name:'Fixture new LC',path:'Warrior',rarity:5}};var onlineProm={'29998':{values:Array.from({length:7},()=>({hp:{base:400,step:5},atk:{base:200,step:2},def:{base:100,step:1}}))}};var onlineRanks={'29998':{skill:'Fixture',desc:'Fixture',params:[[],[],[],[],[]],properties:[[],[],[],[],[]]}};var parsedOnline=parseOnlineLCCatalogue(onlineMeta,onlineProm,onlineRanks);");
assert.equal(run('parsedOnline.length'),1);close(run('parsedOnline[0].base.hp'),795);
assert.equal(run('mergeOnlineLCCatalogue(parsedOnline)'),1);assert.equal(run('mergeOnlineLCCatalogue(parsedOnline)'),0);
assert.equal(run('catalogueLightCones().length'),171);
run("lightCones.splice(lightCones.findIndex(l=>l.id==='29998'),1)");
// Validate artifact references and structural CSS balance as browser execution is separate.
for(const match of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g))assert.ok(fs.existsSync(match[1]),match[1]);
for(const file of ['equipment-upgrade.css','gear-picker.css','menu-refinement.css','readable-type.css','inventory-layout.css']){const css=fs.readFileSync(file,'utf8');assert.equal((css.match(/{/g)||[]).length,(css.match(/}/g)||[]).length,file);}
console.log('Passed: delegated 2pc A/B selection and save, 3/4 initial substats, legal roll tiers, five upgrade milestones, +15 cap, level-based main stats, gacha actions, isolated histories, complete LC visibility, owner/Path/rarity search, LC preview/equip and online catalogue merge.');
