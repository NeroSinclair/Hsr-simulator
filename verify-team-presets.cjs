'use strict';
const assert=require('node:assert/strict');
const {run,get,clickListeners}=require('./verify-menu.cjs');
const snapshot=()=>run('JSON.stringify(teamConfig)');
const before=snapshot();
const presetCount=run('teamPresets.length');assert.ok(presetCount>=100);
const charCount=run('Object.keys(teamPresetProfiles).length');
assert.equal(run('new Set(teamPresets.map(p=>p.id)).size'),presetCount,'Duplicate preset IDs');
assert.equal(run('new Set(teamPresets.map(p=>[...p.characters].sort().join(","))).size'),presetCount,'Duplicate formations');
assert.ok(run('teamPresets.every(p=>p.sources.length&&p.sources.every(key=>presetSources[key])&&presetEvidence[p.evidence])'),'Missing source or evidence');
for(const id of ['1405','1402','1404'])assert.ok(run(`teamPresets.some(p=>p.characters.includes('${id}')&&p.characters.includes('1415'))`),id+' missing Cyrene team');
assert.ok(run("teamPresets.filter(p=>p.category==='fua'&&p.characters.includes('1406')&&p.characters.includes('1415')).length>=4"),'Cipher/Cyrene follow-up variations missing');
const expectedSignatures={'1506':'23057','1501':'23053','1502':'23054','1503':'23055','1504':'23056','1505':'23058','1507':'23059','1508':'23061','1509':'23062','1510':'23060','1512':'23063','1513':'23064','1213':'23015','1408':'23044','1321':'23050','1414':'23051'};
for(const [id,lc] of Object.entries(expectedSignatures)){
 assert.equal(run(`signatureLC(presetCharacter('${id}'))?.id`),lc,id+' signature');
 assert.equal(run(`lightConeGroups(presetCharacter('${id}')).recommended[0]?.id`),lc,id+' first recommendation');
 assert.equal(run(`presetDefaultChoice('${id}',false).lc`),lc,id+' primary wizard choice');
 assert.ok(run(`lightConeOwners(lightCones.find(l=>l.id==='${lc}')).includes(presetCharacter('${id}').name)`),id+' owner search');
}
assert.ok(run("teamPresets.slice(0,teamPresets.filter(p=>p.evidence==='meta').length).every(p=>p.evidence==='meta')"),'Current meta must appear first');
for(let i=0;i<presetCount;i++){
 const p=JSON.parse(run(`JSON.stringify(teamPresets[${i}])`));
 assert.equal(new Set(p.characters).size,4,p.id+' duplicate characters');
 if(p.mono)assert.ok(run(`teamPresets[${i}].characters.every(id=>presetCharacter(id).path===teamPresets[${i}].mono)`),p.id+' not mono');
 if(p.tier==='f2p')assert.ok(p.characters.every(id=>['8001','8003','8005','8007','8009','1013','1009','1105','1110','1106','1108','1210','1111','1214','1206','1223','1224','1103','1202','1215','1201','1301'].includes(id)),p.id+' limited character labeled F2P');
 for(const economy of [true,false]){
  run(`var testedPreset=teamPresets[${i}];var testedChoices=testedPreset.characters.map(id=>presetDefaultChoice(id,${economy}));var testedParty=makePresetParty(testedPreset,testedChoices);`);
  assert.ok(run('testedParty.every(cfg=>validateRelicBuild(presetCharacter(cfg.id),cfg.build)===\'\')'),p.id+' invalid build');
  assert.ok(run('testedParty.every(cfg=>Object.values(computeStats(presetCharacter(cfg.id),cfg.build)).every(Number.isFinite))'),p.id+' invalid stats');
  assert.ok(run('testedParty.every(cfg=>cfg.build.items.every(p=>p.enhancement.level===15))'));
 }
}
// Every gear alternative must exist, match the Path and be independently usable.
for(const id of JSON.parse(run('JSON.stringify(Object.keys(teamPresetProfiles))'))){
 const profile=JSON.parse(run(`JSON.stringify(teamPresetProfiles['${id}'])`));
 for(const field of ['lc','relic','planar','style']){
  const values=profile[{lc:'lcs',relic:'relics',planar:'planars',style:'styles'}[field]];
  for(const value of values)assert.equal(run(`validateRelicBuild(presetCharacter('${id}'),buildPresetCharacter('${id}',{...presetDefaultChoice('${id}'),${field}:${JSON.stringify(value)}}).build)`),'',id+' '+field+' '+value);
 }
}
assert.equal(snapshot(),before,'Generating builds mutated the party');
get('teamPresetBtn').onclick();assert.equal(get('presetTeamDialog').open,true);
run("selectTeamPreset('elation-mono')");assert.equal(snapshot(),before);
run("handlePresetAction('cancel')");assert.equal(snapshot(),before);
get('teamPresetBtn').onclick();
get('presetTeamEvidence').value='meta';get('presetTeamEvidence').onchange();
assert.ok(run("filteredTeamPresets().length>10&&filteredTeamPresets().every(p=>p.evidence==='meta')"));
get('presetTeamEvidence').value='all';get('presetTeamEvidence').onchange();
get('presetTeamTier').value='f2p';get('presetTeamTier').onchange();
assert.ok(run("filteredTeamPresets().every(p=>p.tier==='f2p')"));
get('presetTeamSearch').value='DOES NOT EXIST';get('presetTeamSearch').oninput();assert.ok(get('presetTeamList').innerHTML.includes('Tidak ada preset'));
run("selectTeamPreset('rem-mono');teamPresetWizard.choices[1].relic='127+113';handlePresetAction('next');handlePresetAction('next');handlePresetAction('next');handlePresetAction('next')");
assert.equal(run('teamPresetWizard.step'),'review');
assert.equal(snapshot(),before);
run('applyTeamPreset()');assert.equal(get('presetTeamDialog').open,false);
assert.deepEqual(JSON.parse(run('JSON.stringify(teamConfig.map(c=>c.id))')),['1407','1413','1415','1409']);
assert.equal(run('teamConfig[1].build.pieces'),2);
assert.deepEqual(JSON.parse(run('JSON.stringify(teamConfig[1].build.items.slice(0,4).map(p=>p.set))')),['127','127','113','113']);
assert.ok(get('gearShortcutName').textContent.includes('Castorice'));
const applied=snapshot();
get('teamPresetBtn').onclick();run("selectTeamPreset('dot-free');teamPresetWizard.step='review';teamPresetWizard.choices[3].lc='23024'");
assert.throws(()=>run('applyTeamPreset()'),/Pilihan build tidak valid|Path/);
assert.equal(snapshot(),applied,'Failed apply partially changed the party');
run("handlePresetAction('cancel')");
get('teamPresetBtn').onclick();run("selectTeamPreset('dot-free');teamPresetWizard.step='review';applyTeamPreset()");
assert.ok(run('teamConfig.every(cfg=>lcFor(cfg.build).path===presetCharacter(cfg.id).path)'));
// New configs and nested histories must be independent on every application.
run("var cloneA=makePresetParty(teamPresets[8],teamPresets[8].characters.map(id=>presetDefaultChoice(id)));var cloneB=makePresetParty(teamPresets[8],teamPresets[8].characters.map(id=>presetDefaultChoice(id)));cloneA[0].build.items[0].enhancement.rolls[0].tier=2");
assert.equal(run('cloneB[0].build.items[0].enhancement.rolls[0].tier'),1);
for(const [mode,index] of [['moc',2],['pf',1],['as',0],['aa',0]]){
 run(`lobbyMode='${mode}';lobbyPreset=${index};renderLobby()`);
 assert.ok(get('lobbyPresets').innerHTML.includes('voracity-node chosen'),mode+' missing selected red node');
 assert.ok(get('lobbyPresets').innerHTML.includes('VORACITY 3'));
}
assert.equal(run("nodeHasVoracity3('moc',0)"),false);
assert.equal(run("nodeHasVoracity3('pf',0)"),false);
assert.equal(run("nodeHasVoracity3('aa',3)"),false);
console.log(`Passed: ${presetCount} presets, ${charCount} character profiles and every gear alternative, Path compatibility, legal +15 histories, filters, cancellation, review, atomic apply, mixed sets, clone isolation and confirmed Voracity badges.`);
