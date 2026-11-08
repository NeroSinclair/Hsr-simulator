'use strict';
const enemyText=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Image paths resolved from the enemy database; renders remain remote assets.
const enemyImageIds={
 'Borisin Warhead: Hoolay':'2034010','Blood of the Fallen God: Yabuli':'5034010',
 'Ichor Memosprite: Judge of Oblivion':'4064010','Flame Reaver of the Deepest Dark':'4034010',
 'Alloy Mechatron: King Pom-Pom':'5014020','Argenti':'3024010',
 'Soulhook Sovereign':'2004010','Arbiter of the Lost Abyss':'4064010','Fulminating Wolflord':'2034010',
 'Moonlit Pegasus':'4023020','Lighthouse':'8033020','Joy Ascendant':'5023010',
 'Daybreak Squadron: Azurewing':'5013040','Daybreak Squadron: Blazeweaver':'5013050',
 'Daybreak Squadron: Cinderborne':'5013070','Pollux, Netherwing Husk, Ferry of Souls':'4014030',
 'Cyclonic Swarm Mother':'4053020','Abundance Sprite: Malefic Ape':'2023020',
 'Harbinger of Death: Swarm Nightmare':'3024030','Furbo Journalist':'5012110',
 'Juvenile Sting':'8022010','Silvermane Guard':'1002040',
 'Rocking Rebel':'5013010','Decaying Shadow':'8003040',
 'Noontide Gryphon':'4023010','Ichor Memosprite: Winged Serpent':'4063010',
 'Aurumaton Spectral Envoy':'2013020','Furiae Praetor':'4013010',
 "Dreamjolt Troupe's Sweet Gorilla":'3003020','The Ascended':'2023030',
 'Alloy Pommy':'5012120',
 'Furiae Warrior':'4012010','Meteoric Eagle':'4022010','Automaton Hound':'1012010',
 'Abundance Sprite: Golden Hound':'2022040',"Black Tide's Corroded Axe":'4032030',
 'Shadow of "Hatred"':'4032020','Sableclaw Wolftrooper':'2032010','Eclipse Wolftrooper':'2032020',
 'Abundance Sprite: Wooden Lupus':'2022050','Mirage Fizzle Kid':'4052020',
 'Silvermane Cannoneer':'1002030','Silvermane Gunner':'1002050','Wraith Warden':'2002030',
 'The Honored':'3021020','The Shield':'3021040',
 'Blaze Out of Space':'8003020','Ice Out of Space':'8003010',
 "Dreamjolt Troupe's Beyond Overcooked":'3003010','Memory Zone Meme "Shell of Faded Rage"':'3013010',
 'Ichor Memosprite: Pheasant':'4062010','Ichor Memosprite: Canine':'4062020',
 "Frenzied Beast's Seed Germ":'5032010'
};
const enemyImage=name=>`https://www.gacha.gg/img/honkai-star-rail/dm/monster/mostericon-monster_${enemyImageIds[name]}.webp`;
const enemyRenders={
 'Borisin Warhead: Hoolay':'https://static.wikia.nocookie.net/houkai-star-rail/images/d/dd/NPC_Hoolay.png/revision/latest',
 'Fulminating Wolflord':'https://static.wikia.nocookie.net/houkai-star-rail/images/d/dd/NPC_Hoolay.png/revision/latest',
 'Flame Reaver of the Deepest Dark':'https://static.wikia.nocookie.net/houkai-star-rail/images/f/f5/Enemy_Flame_Reaver_of_the_Deepest_Dark.png/revision/latest',
 'Moonlit Pegasus':'https://img.game8.co/4124462/887c3b2a56bbbf616397e3a21f8a4281.png/show',
 'Pollux, Netherwing Husk, Ferry of Souls':'https://img.game8.co/4141976/f6c55450b0c6d1da13591748fece2935.png/show',
 'Alloy Mechatron: King Pom-Pom':'https://img.game8.co/4441026/2cc5d6a0bdee1758492c4e1559c0b1a2.png/show'
};
const enemyImageCandidates=name=>[enemyRenders[name],enemyImage(name),`https://www.gacha.gg/_next/image?url=${encodeURIComponent('/img/honkai-star-rail/dm/monster/mostericon-monster_'+enemyImageIds[name]+'.webp')}&w=384&q=75`].filter(Boolean);
const mapImages={
 moc:{name:'Forgotten Hall',url:'https://upload-static.hoyoverse.com/hoyolab-wiki/2023/07/22/167256510/898b6b793a4e283ba8e5a760c2e51c0c_5560543506086921741.png',source:'https://wiki.hoyolab.com/pc/hsr/entry/1282?lang=en-us',note:'Gambar domain Forgotten Hall; referensi visual, bukan foto arena battle rotasi 4.6.'},
 pf:{name:'Penacony · Dreamscape',url:'https://images.rpgsite.net/image/da49c9a1/137117/original/Honkai-Star-Rail_2-2_20240428_19.png',source:'https://www.rpgsite.net/news/15780-honkai-star-rail-version-22-adds-robin-boothill-pecacony-story-climax-on-may-8',note:'Foto lokasi Dreamscape sebagai referensi; belum terverifikasi sama dengan arena PF 4.6.'},
 as:{name:'Amphoreus · Ruins of Time',url:'https://images.rpgsite.net/image/da49c9a1/160305/original/honkai-star-rail_20251024_version-3-7-13.png',source:'https://www.rpgsite.net/news/18794-honkai-star-rail-version-3-7-update-release-date-amphoreous-finale-new-character-cyrene',note:'Foto lokasi Ruins of Time sebagai referensi; belum terverifikasi sama dengan arena AS 4.6.'},
 aa:{name:'Anomaly Arbitration · Chessboard',url:'https://www.gamer.org/wp-content/uploads/2025/09/Honkai_-Star-Rail-3.6-%E2%80%93-Anomaly-Arbitration-Mode-Guide-3.jpg',source:'https://www.gamer.org/honkai-star-rail-3-6-anomaly-arbitration-mode-guide/',note:'Gambar domain Arbitration; referensi visual, bukan foto arena battle King 4.6.'},
 custom:{name:'Amphoreus · Ceremonial Hall',url:'https://images.rpgsite.net/image/da49c9a1/157710/original/honkai-star-rail_20250912_version3-6-03.png',source:'https://www.rpgsite.net/news/18409-honkai-star-rail-version-3-6-update-release-date-new-features-gameplay-trailer',note:'Foto lokasi HSR untuk free battle; pilih arena lain melalui pilihan map.'}
};
