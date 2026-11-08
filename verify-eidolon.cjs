'use strict';
const assert = require('node:assert/strict');
const {run,get,clickListeners} = require('./verify-menu.cjs');
// The lightweight DOM fixture does not implement insertion; supply it here.
get('buildPanel').insertAdjacentHTML = function(position, html) { this.innerHTML = html + this.innerHTML; };
const select = level => {
 const button = {dataset:{eidolon:String(level)}};
 for (const listener of clickListeners) listener({target:{closest(selector){return selector==='[data-eidolon]' ? button : null;}}});
};
run('openTeam(0)');
assert.ok(get('buildPanel').innerHTML.includes('EIDOLON RESONANCE'));
assert.equal((get('buildPanel').innerHTML.match(/data-eidolon="/g)||[]).length,7);
select(4);
assert.equal(run('buildDraft[0].build.eidolon'),4);
assert.equal((get('buildPanel').innerHTML.match(/class=" unlocked"/g)||[]).length,3);
run('switchBuildSlot(1)'); select(2);
run('switchBuildSlot(0)');
assert.equal(run('buildDraft[0].build.eidolon'),4);
assert.equal(run('buildDraft[1].build.eidolon'),2);
get('resetSlotBuild').onclick();
assert.equal(run('buildDraft[0].build.eidolon'),4,'Reset gear preserves Eidolon');
get('saveTeam').onclick();
assert.equal(run('teamConfig[0].build.eidolon'),4);
assert.ok(get('lobbyTeam').innerHTML.includes('data-eidolon-level="E4"'));
run('openTeam(0)');
assert.equal(run('buildDraft[0].build.eidolon'),4,'Reopening preserves saved level');
select(6);
assert.equal(run('buildDraft[0].build.eidolon'),6);
select(0);
assert.equal(run('buildDraft[0].build.eidolon'),0);
assert.ok(get('buildPanel').innerHTML.includes('Tanpa Eidolon.'));
for(const value of [-1,7,1.5]) {
 run(`buildDraft[0].build.eidolon=${value}`);
 assert.ok(run('validateBuilds(buildDraft)').includes('Eidolon'));
 assert.equal(run('normalizeBuild(buildDraft[0]).eidolon'),0);
}
assert.ok(run('roster.every(c=>defaultBuild(c).eidolon===0)'));
run('buildDraft[0].build.eidolon=6; var nextCharacter=roster.find(c=>!buildDraft.some(cfg=>cfg.id===c.id));changeBuildCharacter(0,nextCharacter.id)');
assert.equal(run('buildDraft[0].build.eidolon'),0,'New character starts E0');
const fs=require('node:fs');
for(const c of JSON.parse(run('JSON.stringify(roster)'))) {
 const ranks=JSON.parse(run(`JSON.stringify(eidolonCatalogue['${c.id}'])`));
 assert.equal(ranks.length,6);
 for(const [i,r] of ranks.entries()) {
  assert.equal(r.rank,i+1);
  assert.ok(r.name&&r.desc);
  const icon='assets/eidolons/'+r.icon.split('/').pop();
  assert.ok(fs.readFileSync(icon).subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),icon);
 }
}
run("openTeamPresets(); selectTeamPreset('rem-mono')");
assert.ok(get('presetTeamBody').innerHTML.includes('id="preset-eidolon"'));
assert.equal((get('presetTeamBody').innerHTML.match(/class="eidolon-detail /g)||[]).length,6);
get('presetTeamBody').onchange({target:{dataset:{presetField:'eidolon'},value:'5'}});
run("teamPresetWizard.slot=1;renderTeamPresetWizard()");
get('presetTeamBody').onchange({target:{dataset:{presetField:'eidolon'},value:'2'}});
run("teamPresetWizard.slot=0;renderTeamPresetWizard()");
assert.equal(get('preset-eidolon').value,'5');
run("handlePresetAction('economy')");
assert.equal(run('teamPresetWizard.choices[0].eidolon'),5);
run("teamPresetWizard.step='review';renderTeamPresetWizard()");
assert.ok(get('presetTeamBody').innerHTML.includes('E5'));
run('applyTeamPreset();openTeam(0)');
assert.equal(run('buildDraft[0].build.eidolon'),5);
assert.equal(run('teamConfig[1].build.eidolon'),2);
assert.throws(()=>run("buildPresetCharacter(teamConfig[0].id,{...presetDefaultChoice(teamConfig[0].id),eidolon:7})"),/Eidolon/);
console.log('Passed: E0–E6 controls, cumulative unlocks, slot isolation, save/reopen, gear reset, validation and all character defaults.');
console.log('Passed: 558 names/descriptions/local PNGs, preset rank selection, slot isolation, review and apply.');
