'use strict';
const lineupEscape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Reference information for the menu. These lists do not rewrite training encounters.
// null quantities mean the source lists a type, but does not specify its multiplicity.
const lineupSources={
 moc:['MoC 12 · rincian wave','https://www.icy-veins.com/honkai-star-rail/memory-of-chaos-stage-12'],
 pf:['PF 4.6 · elite, boss & reinforcement','https://timesaver.gg/blog/hsr-pure-fiction'],
 as:['AS 4.6 · boss & summon','https://www.icy-veins.com/honkai-star-rail/apocalyptic-shadow'],
 aa:['AA 4.6 · rincian wave','https://hsrtierlist.net/anomaly-arbitration/4-6']
};
const lineupEnemy=(name,role,count=null)=>({name,role,count});
const lineupWave=(label,enemies,note='',count=null)=>({label,enemies,note,count});
function encounterPreview(mode,index){
 const documented=documentEncounterPreview(mode,index);
 if(documented)return documented;
 const challenge=challenges[mode][index];
 return {summary:`${challenge.waves.length} wave · ${challenge.waves.flat().length} jenis terdaftar`,note:mode==='aa'?'Jenis musuh per wave sesuai referensi. Jumlah tiap jenis dan summon belum dirinci; angka jenis bukan jumlah unit.':'Jumlah unit sesuai pilihan Free Battle.',waves:challenge.waves.map((w,i)=>lineupWave(`Wave ${i+1}`,w.map(n=>lineupEnemy(n,mode==='custom'?'Pilihan':i===0&&challenge.waves.length>1?'Elite':'Boss',mode==='custom'?1:null))))};
}
function previewEnemyRow(enemy){
 const id=enemyImageIds[enemy.name],group=!id;
 const src=group?'assets/enemies/battleeventicon-monster_unknown.webp':`assets/enemies/mostericon-monster_${id}.webp`;
 const portrait=`<span class="preview-enemy-art"><img src="${src}" alt="${group?'Ikon kelompok musuh':lineupEscape(enemy.name)}" width="112" height="112" loading="lazy" decoding="async" data-preview-enemy="${id||'group'}" data-fallback="1">${group?'<small>Kelompok</small>':''}</span>`;
 const quantity=enemy.quantityLabel||(enemy.count===null?'× ?':'× '+enemy.count);
 return `<div class="preview-enemy">${portrait}<span class="preview-enemy-name"><b>${lineupEscape(enemy.name)}</b><small>${lineupEscape(enemy.role)}</small></span><strong class="preview-quantity">${lineupEscape(quantity)}</strong></div>`;
}
document.addEventListener('error',event=>{
 const img=event.target;
 if(!img.dataset?.previewEnemy)return;
 // Other image handlers skip data-fallback, so a failed icon never becomes initials.
 if(img.dataset.previewEnemy!=='group'&&!img.dataset.previewRetried){img.dataset.previewRetried='1';img.src=`https://www.gacha.gg/img/honkai-star-rail/dm/monster/mostericon-monster_${img.dataset.previewEnemy}.webp`;return;}
 if(img.dataset.previewEnemy!=='group'){img.dataset.previewEnemy='group';img.src='assets/enemies/battleeventicon-monster_unknown.webp';return;}
 img.hidden=true;
},true);
function renderEncounterPreview(mode,index){
 const preview=encounterPreview(mode,index),source=lineupSources[mode],challenge=challenges[mode][index];
 const total=challenge.waves.reduce((n,w)=>n+w.length,0);
 const sources=[...(preview.sources||[]),...(source?[source]:[])];
 const evidence=preview.document?'<a class="lineup-source" href="dataset/End%20game%20content.docx" download>Acuan lineup: End game content.docx</a>':'';
 const referenceLinks=sources.map(([label,url])=>`<a class="lineup-source" href="${url}" target="_blank" rel="noreferrer">${lineupEscape(label)} ↗</a>`).join('');
 const cards=preview.waves.map(w=>{
  const quantity=w.quantityLabel||(w.count!==null?w.count+' musuh':w.enemies.length+' jenis terdaftar');
  return `<section class="preview-wave"><div class="preview-wave-heading"><h4>${lineupEscape(w.label)}</h4><span>${lineupEscape(quantity)}</span></div>${w.enemies.map(previewEnemyRow).join('')}${w.note?`<p>${lineupEscape(w.note)}</p>`:''}</section>`;
 }).join('');
 const training=challenge.waves.map((w,i)=>`<section><h4>Wave ${i+1} · ${w.length} unit awal</h4>${Object.entries(w.reduce((counts,n)=>(counts[n]=(counts[n]||0)+1,counts),{})).map(([name,count])=>previewEnemyRow(lineupEnemy(name,'Latihan',count))).join('')}</section>`).join('');
 return `<div class="lineup-overview"><h3>${lineupEscape(preview.summary)}</h3><p>${lineupEscape(preview.note)}</p><small>× ? = jumlah belum terverifikasi. Berulang = muncul lagi selama battle, bukan jumlah tetap.</small></div>${cards}<div class="lineup-sources">${evidence}${referenceLinks}</div><details class="training-lineup"><summary>Encounter latihan yang dimainkan · ${challenge.waves.length} wave / ${total} unit awal</summary><p>Battle saat ini memakai preset latihan yang dipersingkat. Preview referensi di atas belum seluruhnya disimulasikan.${mode==='pf'?' PF latihan mengganti semua musuh yang kalah, termasuk boss, sampai batas AV.':''}</p>${training}</details>`;
}
