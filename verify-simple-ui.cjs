'use strict';
const assert=require('node:assert/strict');
const {run,get}=require('./verify-menu.cjs');
run('openTeam(0)');
assert.ok(get('buildPanel').innerHTML.includes('quick-relic-tabs'));
assert.equal((get('buildPanel').innerHTML.match(/class="quick-sub-row"/g)||[]).length,4);
assert.ok(get('buildPanel').innerHTML.includes('<details class="relic-advanced" >'));
assert.ok(get('buildPreview').innerHTML.includes('simple-stat-summary'));
assert.ok(run("eidolonPanel(draftCharacter(),buildDraft[0].build).includes('eidolon-more')"));
run(`var quickPiece=buildDraft[0].build.items[0];var quickEnhance=ensureRelicEnhancement(quickPiece);quickEnhance.level=15;quickEnhance.initialCount=4;syncRelicSubstats(quickPiece);`);
for(let index=0;index<4;index++){
 assert.equal(run(`setQuickRelicRolls(quickPiece,${index},5)`),true);
 assert.equal(run(`quickRelicRollCounts(quickPiece)[${index}]`),5);
 assert.equal(run('quickRelicRollCounts(quickPiece).reduce((a,b)=>a+b,0)'),5);
 assert.equal(run('calculatedRelicSubs(quickPiece).reduce((n,s)=>n+s.rollCount,0)'),9);
 assert.equal(run('validateRelicBuild(draftCharacter(),buildDraft[0].build)'),'');
}
const before=run('JSON.stringify(quickPiece)');
for(const expression of ['setQuickRelicRolls(quickPiece,0,6)','setQuickRelicRolls(quickPiece,0,-1)','setQuickRelicRolls(quickPiece,0,1.5)','setQuickRelicRolls(quickPiece,9,1)'])assert.equal(run(expression),false);
assert.equal(run('JSON.stringify(quickPiece)'),before,'Invalid counts mutated equipment');
run('quickEnhance.initialCount=3;quickEnhance.rolls[0].target=3;syncRelicSubstats(quickPiece)');
assert.equal(run('setQuickRelicRolls(quickPiece,0,4)'),true);
assert.equal(run('quickEnhance.rolls[0].target'),3,'Quick editing changed fourth-stat unlock');
assert.equal(run('calculatedRelicSubs(quickPiece).reduce((n,s)=>n+s.rollCount,0)'),8);
assert.equal(run('validateRelicBuild(draftCharacter(),buildDraft[0].build)'),'');
run('quickEnhance.level=0;syncRelicSubstats(quickPiece)');
assert.equal(run('setQuickRelicRolls(quickPiece,0,1)'),false);
assert.equal(run('quickRelicRollCounts(quickPiece).reduce((a,b)=>a+b,0)'),0);
for(const mode of ['moc','pf','as','aa']){
 run(`lobbyMode='${mode}';lobbyPreset=0;renderLobby()`);
 const html=get('lineupPreview').innerHTML;
 assert.equal((html.match(/class="simple-encounter-wave"/g)||[]).length,run('challenges[lobbyMode][0].waves.length'));
 assert.ok(html.indexOf('simple-encounter-wave')<html.indexOf('simple-encounter-reference'));
 assert.ok(html.includes('training-lineup')&&html.includes('lineup-source'),'Full reference was removed');
}
console.log('PASS: four quick stat controls, legal upgrade allocation and bounds, 3-stat unlock, retained detailed editor, collapsed sections and playable enemies first in all challenge modes.');
