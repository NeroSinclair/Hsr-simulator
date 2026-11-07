// Roster snapshot through 4.6. IDs and combat types: StarRailRes game-data index.
// SPD/builds and combat roles are simulator presets, not full official kits.
const extraRoster = [
 ['1002','Dan Heng','Wind','The Hunt',110,'dps'],['1004','Welt','Imaginary','Nihility',102,'blast'],['1008','Arlan','Lightning','Destruction',102,'blast'],['1013','Herta','Ice','Erudition',100,'aoe'],['1103','Serval','Lightning','Erudition',104,'aoe'],['1104','Gepard','Ice','Preservation',92,'shield'],['1106','Pela','Ice','Nihility',105,'support'],['1108','Sampo','Wind','Nihility',102,'blast'],['1109','Hook','Fire','Destruction',94,'blast'],['1111','Luka','Physical','Nihility',103,'dps'],['1112','Topaz & Numby','Fire','The Hunt',110,'dps'],['1201','Qingque','Quantum','Erudition',98,'aoe'],['1206','Sushang','Physical','The Hunt',107,'dps'],['1207','Yukong','Imaginary','Harmony',107,'support'],['1209','Yanqing','Ice','The Hunt',109,'dps'],['1210','Guinaifen','Fire','Nihility',106,'blast'],['1211','Bailu','Lightning','Abundance',98,'heal'],['1214','Xueyi','Quantum','Destruction',103,'blast'],['1215','Hanya','Physical','Harmony',110,'support'],['1218','Jiaoqiu','Fire','Nihility',98,'support'],['1220','Feixiao','Wind','The Hunt',112,'dps'],['1222','Lingsha','Fire','Abundance',98,'heal'],['1223','Moze','Lightning','The Hunt',111,'dps'],['1224','March 7th • The Hunt','Imaginary','The Hunt',102,'dps'],['1225','Fugue','Fire','Nihility',102,'support'],['1302','Argenti','Physical','Erudition',103,'aoe'],['1312','Misha','Ice','Destruction',96,'blast'],['1314','Jade','Quantum','Erudition',103,'aoe'],
 ['1401','The Herta','Ice','Erudition',99,'aoe'],['1402','Aglaea','Lightning','Remembrance',102,'blast'],['1403','Tribbie','Quantum','Harmony',96,'support'],['1404','Mydei','Imaginary','Destruction',95,'blast'],['1405','Anaxa','Wind','Erudition',97,'aoe'],['1406','Cipher','Quantum','Nihility',106,'dps'],['1407','Castorice','Quantum','Remembrance',95,'aoe'],['1408','Phainon','Physical','Destruction',94,'blast'],['1409','Hyacine','Wind','Remembrance',110,'heal'],['1410','Hysilens','Physical','Nihility',102,'aoe'],['1412','Cerydra','Wind','Harmony',99,'support'],['1413','Evernight','Ice','Remembrance',101,'aoe'],['1414','Dan Heng • Permansor Terrae','Physical','Preservation',97,'shield'],['1415','Cyrene','Ice','Remembrance',101,'support'],['1014','Saber','Wind','Destruction',101,'blast'],['1015','Archer','Quantum','The Hunt',105,'dps'],
 ['1321','The Dahlia','Fire','Nihility',102,'support'],['1501','Sparxie','Fire','Elation',107,'aoe'],['1502','Yao Guang','Physical','Elation',101,'support'],['1503','Pearl','Ice','Elation',100,'heal'],['1504','Ashveil','Lightning','The Hunt',106,'dps'],['1505','Evanescia','Physical','Elation',104,'blast'],['1506','Silver Wolf LV.999','Imaginary','Elation',107,'aoe'],['1507','Mortenax Blade','Fire','Nihility',100,'blast'],['1508','Rin Tohsaka','Quantum','Erudition',103,'aoe'],['1509','Gilgamesh','Lightning','Destruction',100,'blast'],['1510','Himeko • Nova','Fire','Erudition',100,'aoe'],['1512','Robin • Summeretto','Wind','Remembrance',105,'advance'],['1513','Aventurine • Waveflair','Quantum','Elation',106,'aoe'],
 ['8003','Trailblazer • Preservation','Fire','Preservation',95,'shield'],['8005','Trailblazer • Harmony','Imaginary','Harmony',105,'support'],['8007','Trailblazer • Remembrance','Ice','Remembrance',103,'support'],['8009','Trailblazer • Elation','Lightning','Elation',103,'support']
];
const enemyCatalog = {
 'Borisin Warhead: Hoolay':{weak:['Fire','Physical','Wind'],shape:'wolf'},
 'Blood of the Fallen God: Yabuli':{weak:['Quantum','Ice','Imaginary'],shape:'king'},
 'Ichor Memosprite: Judge of Oblivion':{weak:['Physical','Ice','Imaginary'],shape:'spirit'},
 'Flame Reaver of the Deepest Dark':{weak:['Ice','Imaginary'],shape:'reaver'},
 'Alloy Mechatron: King Pom-Pom':{weak:['Fire','Imaginary'],shape:'rabbit'},
 'Argenti':{weak:['Physical','Ice'],shape:'knight'},
 'Soulhook Sovereign':{weak:['Physical','Ice','Imaginary'],shape:'spirit'},
 'Arbiter of the Lost Abyss':{weak:['Fire','Quantum','Imaginary'],shape:'king'},
 'Fulminating Wolflord':{weak:['Fire','Wind','Physical'],shape:'wolf'},
 'Moonlit Pegasus':{weak:['Quantum','Imaginary'],shape:'horse'},
 'Lighthouse':{weak:['Quantum','Imaginary'],shape:'tower'},
 'Joy Ascendant':{weak:['Fire','Imaginary'],shape:'spirit'},
 'Daybreak Squadron: Azurewing':{weak:['Fire','Imaginary'],shape:'knight'},
 'Daybreak Squadron: Blazeweaver':{weak:['Quantum'],shape:'knight'},
 'Daybreak Squadron: Cinderborne':{weak:['Quantum'],shape:'reaver'},
 'Pollux, Netherwing Husk, Ferry of Souls':{weak:['Quantum'],shape:'dragon'},
 'Cyclonic Swarm Mother':{weak:['Fire','Wind'],shape:'bug'},
 'Abundance Sprite: Malefic Ape':{weak:['Fire','Ice','Wind'],shape:'wolf'},
 'Harbinger of Death: Swarm Nightmare':{weak:['Fire','Wind'],shape:'bug'},
 'Furbo Journalist':{weak:['Fire','Imaginary','Ice'],shape:'rabbit'},
 'Juvenile Sting':{weak:['Physical','Fire','Ice'],shape:'bug'},
 'Silvermane Guard':{weak:['Physical','Quantum'],shape:'knight'}
};
// Each preset is an independently playable node, not a multi-team full-account clear.
const challenges = {
 moc:[
 {title:'12 · Node 1 — Hoolay',phase:'Survival of the Fittest',waves:[['Borisin Warhead: Hoolay']],note:'Boss node 1 · Fire / Physical / Wind. Encounter latihan satu wave.',rule:'punchline'},
 {title:'12 · Node 2 — Yabuli',phase:'Survival of the Fittest',waves:[['Blood of the Fallen God: Yabuli']],note:'Boss node 2 · Quantum / Ice / Imaginary. Encounter latihan satu wave.',rule:'punchline'},
 {title:'Starward · Judge of Oblivion',phase:'Survival of the Fittest',waves:[['Ichor Memosprite: Judge of Oblivion']],note:'Starward node 3 · Physical / Ice / Imaginary.',rule:'punchline'}
 ],
 pf:[
 {title:'IV · Node 1 — Flame Reaver',phase:'Imagined Words',waves:[['Flame Reaver of the Deepest Dark','Furbo Journalist','Juvenile Sting']],note:'Boss + reinforcement latihan · Ice / Imaginary.',rule:'grit'},
 {title:'IV · Node 2 — King Pom-Pom',phase:'Imagined Words',waves:[['Alloy Mechatron: King Pom-Pom','Furbo Journalist','Juvenile Sting']],note:'Boss + reinforcement latihan · Fire / Imaginary.',rule:'grit'},
 {title:'Starward · Argenti',phase:'Imagined Words',waves:[['Argenti','Furbo Journalist','Silvermane Guard']],note:'Starward node 3 · Physical / Ice.',rule:'grit'}
 ],
 as:[
 {title:'IV · Soulhook Sovereign',phase:'Dominance of Oblivion',waves:[['Soulhook Sovereign']],note:'Boss encounter latihan · Ultimate damage +25%.',rule:'ultimate'},
 {title:'IV · Arbiter of the Lost Abyss',phase:'Dominance of Oblivion',waves:[['Arbiter of the Lost Abyss']],note:'Boss encounter latihan · Ultimate damage +25%.',rule:'ultimate'},
 {title:'Starward · Fulminating Wolflord',phase:'Dominance of Oblivion',waves:[['Fulminating Wolflord']],note:'Starward boss encounter latihan · Ultimate damage +25%.',rule:'ultimate'}
 ],
 aa:[
 {title:'♞ Knight 1 — King Pom-Pom',phase:'Return to Roots',waves:[['Joy Ascendant','Daybreak Squadron: Azurewing'],['Alloy Mechatron: King Pom-Pom']],rule:'hemovore',note:'Hemovore: −500 HP pada awal giliran. Corrosion latihan: satu revive 30% HP.'},
 {title:'♞ Knight 2 — Pollux',phase:'Return to Roots',waves:[['Daybreak Squadron: Blazeweaver','Daybreak Squadron: Cinderborne'],['Pollux, Netherwing Husk, Ferry of Souls']],rule:'confinement',note:'Confinement: awal −40% damage, berkurang per Ultimate. Enrage: SPD musuh +30% per Ultimate, maksimal 4 stack.'},
 {title:'♞ Knight 3 — Swarm Nightmare',phase:'Return to Roots',waves:[['Cyclonic Swarm Mother','Abundance Sprite: Malefic Ape'],['Harbinger of Death: Swarm Nightmare']],rule:'lockdown',note:'Lockdown latihan: 6 serangan di antara giliran menyebabkan delay dan kehilangan 30 energi.'},
 {title:'♚ King in Check — Yabuli',phase:'Return to Roots',waves:[['Moonlit Pegasus','Lighthouse'],['Blood of the Fallen God: Yabuli']],rule:'king',note:'Hemovore: −500 HP. Perforation: serangan musuh ke target ber-shield mendapat +200% damage.'},
 {title:'♚ King in Check: Plight',phase:'Return to Roots',waves:[['Moonlit Pegasus','Lighthouse'],['Blood of the Fallen God: Yabuli']],rule:'king',plight:true,note:'Versi latihan Plight: HP musuh ×3 dan damage ×1,5; bukan angka difficulty resmi.'},
 {title:'♘ Kuda — Moonlit Pegasus + Lighthouse',phase:'Return to Roots · King wave 1',waves:[['Moonlit Pegasus','Lighthouse']],rule:'king',note:'Latihan khusus wave kuda pada King in Check; bukan stage Knight tambahan.'}
 ]
};
const sourceLinks = [
 ['HoYoverse · Update 4.6','https://hsr.hoyoverse.com/en-us/news/166468'],
 ['StarRailRes · Character data','https://github.com/Mar-7th/StarRailRes/blob/master/index_new/en/characters.json'],
 ['AA 4.6 · Lineup & stage effects','https://hsrtierlist.net/anomaly-arbitration/4-6'],
 ['MoC 4.6 · Current boss nodes','https://dujseks5cqq0r.cloudfront.net/esports/best-teams-honkai-star-rail-hsr-4-6-memory-chaos-survival-fittest'],
 ['PF 4.6 · Current boss nodes','https://allthings.how/honkai-star-rail-4-6-pure-fiction-best-teams-for-imagined-words/'],
 ['AS 4.6 · Enemy reference','https://hostedgg.com/blog/honkai-star-rail-apocalyptic-shadow-team-tier-list']
];
