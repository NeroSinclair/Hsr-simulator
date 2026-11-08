'use strict';
// Transcription of dataset/End game content.docx (images 1, 7–14).
// The screenshot's enemy list is a TYPE list, including summons, not a unit count.
// Numeric counts below require separate evidence; see dataset/ENDGAME-SOURCES.md.
const endgameCountSources={
 pf:['Fandom · format PF & 20 musuh wave 1','https://honkai-star-rail.fandom.com/wiki/Pure_Fiction'],
 hoolay:['Fandom · Hoolay / jumlah per panggilan','https://honkai-star-rail.fandom.com/wiki/Borisin_Warhead%3A_Hoolay'],
 kafka:['Fandom · Kafka / 2 elite per fase','https://honkai-star-rail.fandom.com/wiki/Soulhook_Sovereign'],
 arbiter:['Fandom · Arbiter / komposisi pecahan & summon','https://honkai-star-rail.fandom.com/wiki/Arbiter_of_the_Lost_Abyss'],
 wolf:['Fandom · Wolflord / maksimal 2 pendamping','https://honkai-star-rail.fandom.com/wiki/Fulminating_Wolflord'],
 judge:['Fandom · Judge / 2 Pheasant per panggilan','https://honkai-star-rail.fandom.com/wiki/Ichor_Memosprite%3A_Judge_of_Oblivion']
};
// Only mark nodes with confirmed level-3 Voracity/Corrosion evidence.
function nodeHasVoracity3(mode,index){return mode==='moc'&&index===2||mode==='pf'&&index===1||mode==='as'&&index===0||mode==='aa'&&index===0;}
function documentEncounterPreview(mode,index){
 const E=(name,role,count=null,quantityLabel='')=>({...lineupEnemy(name,role,count),quantityLabel});
 const W=(label,enemies,note='',count=null,quantityLabel='')=>({...lineupWave(label,enemies,note,count),quantityLabel});
 const summon=name=>E(name,'Summon',null,'Berulang');
 const normal=name=>E(name,'Biasa / reinforcement',null,'Berulang');
 const boss=name=>E(name,'Boss',1);
 const elite=name=>E(name,'Elite',1);
 const finish=(data,sources)=>({...data,document:true,sources:sources.map(key=>endgameCountSources[key])});
 if(mode==='moc'){
  const openings=[
   [elite('Rocking Rebel'),elite('Decaying Shadow')],
   [E('Moonlit Pegasus','Elite'),E('Noontide Gryphon','Elite'),summon('Meteoric Eagle')],
   [E('Ichor Memosprite: Winged Serpent','Elite'),E('Aurumaton Spectral Envoy','Elite')]
  ];
  const ends=[
   [boss('Borisin Warhead: Hoolay'),summon('Sableclaw Wolftrooper'),summon('Eclipse Wolftrooper')],
   [boss('Blood of the Fallen God: Yabuli'),summon("Frenzied Beast's Seed Germ")],
   [boss('Ichor Memosprite: Judge of Oblivion'),E('Ichor Memosprite: Pheasant','Summon',2,'× 2 / panggilan')]
  ];
  const notes=[
   'Hoolay: fase boss 1 memanggil 1 Wolftrooper acak per aksi Summon the Pack; fase boss 2 memanggil 2 sekaligus. Jenisnya Sableclaw atau Eclipse, bukan selalu satu masing-masing. Moon Rage mengubah perilaku, bukan jenis musuh baru. Total panggilan bergantung durasi battle.',
   'Meteoric Eagle dan Seed Germ tercantum sebagai musuh panggilan pada dokumen. Jumlah per panggilan Seed Germ dan jumlah awal tiap elite belum terverifikasi.',
   'Voracity 3 sesuai dokumen. Judge normal memanggil 2 Pheasant per Execution in Place. Angka ini bukan total sepanjang battle dan tidak memakai angka varian Complete.'
  ];
  return finish({summary:'2 wave · termasuk pendamping & summon',note:'Node adalah sisi pertarungan; di dalamnya ada wave, lalu fase HP boss. Ikon pada daftar game juga mencakup summon yang tidak selalu hadir sejak awal.',waves:[W('Wave 1 · Elite & pendamping',openings[index],index===0?'2 musuh awal dikonfirmasi oleh catatan dokumen.':'Daftar jenis dari screenshot; jumlah unit tiap jenis belum seluruhnya terkonfirmasi.',index===0?2:null,index===0?'2 unit awal':''),W('Wave 2 · Boss & summon',ends[index],notes[index])]},index===0?['hoolay']:index===2?['judge']:[]);
 }
 if(mode==='pf'){
  const pools=[
   [['Furiae Warrior','Meteoric Eagle','Furbo Journalist'],['Furiae Praetor','Automaton Hound','Abundance Sprite: Golden Hound'],['Flame Reaver of the Deepest Dark',"Black Tide's Corroded Axe",'Shadow of "Hatred"']],
   [['Sableclaw Wolftrooper','Abundance Sprite: Wooden Lupus','Furbo Journalist'],["Dreamjolt Troupe's Sweet Gorilla",'Eclipse Wolftrooper','Mirage Fizzle Kid'],['Alloy Mechatron: King Pom-Pom','Alloy Pommy','Abundance Sprite: Wooden Lupus']],
   [['Silvermane Cannoneer','Silvermane Gunner','Furbo Journalist'],['The Ascended','Eclipse Wolftrooper','Wraith Warden'],['Argenti','The Honored','The Shield']]
  ];
  const waves=pools[index].map((names,i)=>W(`Wave ${i+1} · ${['Musuh biasa','Elite','Boss'][i]}`,names.map((name,j)=>i>0&&j===0?(i===1?elite(name):boss(name)):name==='Furbo Journalist'?E(name,'Langka',null,'Acak'):normal(name)),i===0?'20 musuh total untuk menyelesaikan Fictional Ensemble. Pembagian jumlah tiap jenis dan peluang Furbo Journalist belum terverifikasi.':'Musuh biasa terus diganti. Wave selesai saat elite/boss kalah, sehingga jumlah reinforcement tidak tetap.',i===0?20:null,i===0?'20 musuh total':'1 '+(i===1?'elite':'boss')+' + reinforcement'));
  return finish({summary:'3 wave · 20 musuh → elite → boss',note:'Daftar jenis mengikuti screenshot PF 4 di dokumen. Wave 1 tepat 20 musuh; wave 2–3 memiliki 1 target utama serta reinforcement berulang.'+(index===1?' Node 2 memiliki Voracity 3; cakupannya tidak boleh dianggap berlaku pada semua unit.':''),waves},['pf']);
 }
 if(mode==='as'){
  const names=['Soulhook Sovereign','Arbiter of the Lost Abyss','Fulminating Wolflord'];
  const phases=[1,2].map(phase=>{
   if(index===0){
    const adds=phase===1?['Blaze Out of Space','Ice Out of Space']:["Dreamjolt Troupe's Beyond Overcooked",'Memory Zone Meme "Shell of Faded Rage"'];
    return W(`Fase boss ${phase} · Kafka`,[boss(names[index]),...adds.map(n=>E(n,'Elite panggilan',1))],'1 boss + 2 elite: masing-masing jenis satu. Pasangan elite berubah saat masuk fase boss 2. Voracity 3 sesuai dokumen.',3,'1 boss + 2 elite');
   }
   if(index===1)return W(`Fase boss ${phase} · Arbiter`,[E(names[index],'Boss / bentuk gabungan',1),E('Ichor Memosprite: Winged Serpent','Pecahan boss',1),E('Ichor Memosprite: Canine','Pecahan boss',2),E('Ichor Memosprite: Pheasant','Pecahan boss',2),E('Ichor Memosprite: Pheasant','Summon Execution in Place',4,'× 4 / panggilan')],'Saat pecah, boss digantikan oleh 5 memosprite (1 Winged Serpent + 2 Canine + 2 Pheasant); bukan 6 musuh bersamaan. Setelah bergabung, Execution in Place dapat memanggil 4 Pheasant. Di fase 2, pecahan berbagi HP.',null,'5 pecahan / boss + summon');
   return W(`Fase boss ${phase} · Wolflord`,[boss(names[index]),summon('Sableclaw Wolftrooper'),summon('Eclipse Wolftrooper')],'Wolftrooper muncul berulang; maksimal 2 total di arena, gabungan kedua jenis. Bukan masing-masing 2 dan bukan batas total satu battle.',null,'1 boss + maksimal 2 pendamping');
  });
  return finish({summary:'2 fase boss · komposisi summon terinci',note:'Screenshot AS 4 menampilkan 1 wave yang mencakup kedua fase HP boss dan semua jenis panggilannya. Kartu berikut memisahkan fase HP, bukan menambahkan wave baru.',waves:phases},[index===0?'kafka':index===1?'arbiter':'wolf']);
 }
 return null;
}
