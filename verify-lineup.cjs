'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {run,get}=require('./verify-menu.cjs');
const before=run('JSON.stringify(challenges)');
for(const mode of ['moc','pf','as','aa']){
 const count=run(`challenges.${mode}.length`);
 for(let index=0;index<count;index++){
  run(`lobbyMode='${mode}';lobbyPreset=${index};renderLobby()`);
  const html=get('lineupPreview').innerHTML;
  assert.ok(html.includes('training-lineup'),`${mode}/${index}: missing playable lineup`);
  assert.ok(html.includes('lineup-source'),`${mode}/${index}: missing reference source`);
  assert.ok(!html.includes('monster_undefined'),`${mode}/${index}: invalid portrait URL`);
  const images=[...html.matchAll(/src="(assets\/enemies\/[^\"]+)"/g)];
  assert.ok(images.length>0,`${mode}/${index}: no enemy images`);
  for(const [,file] of images){
   const bytes=fs.readFileSync(file);
   assert.equal(bytes.toString('ascii',0,4),'RIFF',file+' must be a real image');
   assert.equal(bytes.toString('ascii',8,12),'WEBP',file+' must be WebP');
  }
  assert.ok(!html.includes('preview-enemy-placeholder'),`${mode}/${index}: empty enemy placeholder`);
  assert.equal((html.match(/class="preview-wave"/g)||[]).length,mode==='pf'?3:mode==='aa'&&index===5?1:2);
 }
}
run("lobbyMode='moc';lobbyPreset=0;renderLobby()");
assert.ok(get('lineupPreview').innerHTML.includes('Decaying Shadow'));
assert.ok(get('lineupPreview').innerHTML.includes('Rocking Rebel'));
run("lobbyMode='pf';lobbyPreset=1;renderLobby()");
assert.ok(get('lineupPreview').innerHTML.includes('Sweet Gorilla'));
assert.ok(get('lineupPreview').innerHTML.includes('20 musuh total'));
assert.ok(get('lineupPreview').innerHTML.includes('Alloy Pommy'));
run("lobbyMode='as';lobbyPreset=1;renderLobby()");
assert.ok(get('lineupPreview').innerHTML.includes('× 4 / panggilan'));
assert.ok(get('lineupPreview').innerHTML.includes('bukan 6 musuh bersamaan'));
assert.deepEqual(JSON.parse(run("JSON.stringify(encounterPreview('as',1).waves[0].enemies.filter(e=>e.role==='Pecahan boss').map(e=>e.count))")),[1,2,2]);
run("lobbyMode='as';lobbyPreset=0;renderLobby()");
assert.ok(get('lineupPreview').innerHTML.includes('Blaze Out of Space'));
assert.ok(get('lineupPreview').innerHTML.includes('Beyond Overcooked'));
assert.ok(!get('lineupPreview').innerHTML.includes('Elite panggilan Kafka'));
for(let i=0;i<3;i++){
 const preview=JSON.parse(run(`JSON.stringify(encounterPreview('pf',${i}))`));
 assert.equal(preview.waves[0].count,20);
 assert.equal(preview.waves[0].enemies.length,3);
 assert.equal(preview.waves[1].enemies[0].count,1);
 assert.equal(preview.waves[2].enemies[0].count,1);
 for(const wave of preview.waves)for(const enemy of wave.enemies)assert.ok(run(`Boolean(enemyImageIds[${JSON.stringify(enemy.name)}])`),enemy.name+' missing specific image');
}
assert.equal(run("encounterPreview('moc',0).waves[0].count"),2);
assert.ok(run("encounterPreview('moc',0).waves[1].note.includes('2 sekaligus')"));
assert.ok(run("encounterPreview('as',2).waves[0].note.includes('maksimal 2 total')"));
assert.equal(run('JSON.stringify(challenges)'),before,'Reference preview must not rewrite battle data');
run("lobbyMode='as';lobbyPreset=1;renderLobby()");
get('lobbyVersion').value='4.7';get('lobbyVersion').onchange();
assert.equal(get('lineupPreview').innerHTML,'');
get('lobbyVersion').value='4.6';get('lobbyVersion').onchange();
assert.ok(get('lineupPreview').innerHTML.includes('Fase boss 2'));
console.log('Passed: all 15 endgame previews, MoC opening elites, PF three waves, AS split/summons, quantities, missing-data labels, 4.7 isolation and unchanged playable encounters.');
