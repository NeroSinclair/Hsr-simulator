'use strict';
// Snapshot reviewed 2026-11-08, version 4.6. Explicit formations, not a
// Cartesian product of interchangeable supports. Adaptations are not rankings.
const presetEvidence={meta:'Acuan meta 4.6',adapted:'Varian adaptasi',classic:'Klasik / starter'};
Object.assign(presetSources,{
 cyreneKqm:['KQM · Cyrene / tim Chrysos Heir · panduan v3.7','https://hsr.keqingmains.com/cyrene/'],
 cyrene:['Prydwen · Cyrene / Ode dan batas sinergi Cipher','https://www.prydwen.gg/star-rail/characters/cyrene'],
 meta46:['HSR Tier List · 4.6 · diperbarui 30 Okt 2026','https://hsrtierlist.net/'],
 teams46:['HSR Build · komposisi versi 4.6','https://www.hsr-build.com/best-teams'],
 current46:['GachaHoy · meta 4.6 · 2 Nov 2026','https://gachahoy.com/honkai-star-rail-tier-list/'],
 community46:['Reddit · diskusi tim 16 Sep 2026','https://www.reddit.com/r/HonkaiStarRail/comments/1whpso7/daily_questions_megathread_september_16_2026/'],
 swOfficial:['HoYoLAB · detail update 4.2 / signature SW LV.999','https://www.hoyolab.com/article/44742273'],
 swWiki:['Fandom · Silver Wolf LV.999 / signature','https://honkai-star-rail.fandom.com/wiki/Silver_Wolf_LV.999']
});
const guideSources={ashveil:'ashveil',mortenax:'blade-mortenax',nova:'himeko-nova',summer:'robin-summeretto',wave:'aventurine-waveflair',evanescia:'evanescia',hysilens:'hysilens',dahlia:'the-dahlia',phainon:'phainon',cerydra:'cerydra',anaxa:'anaxa',theherta:'the-herta',archer:'archer',rin:'rin-tohsaka',saber:'saber',gilgamesh:'gilgamesh',mydei:'mydei',yunli:'yunli',ratio:'dr-ratio',boothill:'boothill',rappa:'rappa',jade:'jade',jingyuan:'jing-yuan',blade:'blade',jingliu:'jingliu',dhil:'dan-heng-imbibitor-lunae',seele:'seele'};
for(const [key,slug] of Object.entries(guideSources))presetSources[key]=['Prydwen · '+slug,'https://www.prydwen.gg/star-rail/characters/'+slug];
for(const p of teamPresets){p.evidence=['elation-mono','rem-mono'].includes(p.id)?'meta':p.tier==='premium'?'classic':'adapted';p.checked='2026-11-08';}
teamPresets.find(p=>p.id==='elation-mono').sources.push('meta46','swOfficial','swWiki');
teamPresets.find(p=>p.id==='rem-mono').sources.push('meta46');

// Each tuple carries its own formation and reason to choose that variation.
const expandedPresetRows=[
 ['anaxa-cyrene-cerydra','Anaxa · Cyrene + Cerydra','aoe','premium','1405 1415 1412 1414','adapted','cyreneKqm','Core Chrysos: Anaxa, Cyrene, Cerydra, DHPT. Atur Ode sebelum burst Skill.'],
 ['anaxa-cyrene-hyacine','Anaxa · Cyrene + Hyacine','aoe','premium','1405 1415 1412 1409','adapted','cyrene','Alternatif sustain Hyacine untuk Recollection; berbeda buff dari DHPT.'],
 ['anaxa-cyrene-mem','Anaxa · Cyrene + Mem','aoe','budget','1405 1415 8007 1301','adapted','cyrene','Tanpa Cerydra; Mem membantu support, Gallagher sustain. Adaptasi koleksi.'],
 ['anaxa-cyrene-cipher','Anaxa · Cipher + Cyrene','aoe','premium','1405 1406 1415 1414','adapted','cyrene','Cipher menggantikan Cerydra sebagai debuffer. Tidak disamakan dengan core terbaik Anaxa.'],
 ['aglaea-cyrene-mem','Aglaea · Cyrene + Mem + DHPT','remembrance','premium','1402 1415 8007 1414','adapted','cyreneKqm','Cyrene mendukung uptime Aglaea; DHPT sustain, RMC partner Remembrance.'],
 ['aglaea-cyrene-hyacine','Aglaea · Cyrene + Mem + Hyacine','remembrance','premium','1402 1415 8007 1409','adapted','cyreneKqm','Empat Remembrance; Hyacine membantu Recollection. Tidak membutuhkan Sunday.'],
 ['aglaea-cyrene-sunday','Aglaea · Cyrene + Sunday','remembrance','premium','1402 1415 1313 1414','adapted','cyrene','Sunday memberi advance summon; sesuaikan SP sebelum Ultimate pertama Cyrene.'],
 ['aglaea-cyrene-evernight','Aglaea · Cyrene + Evernight','remembrance','premium','1402 1415 1413 1409','adapted','cyrene','Mono Remembrance dengan Evernight sebagai support memosprite.'],
 ['aglaea-cyrene-cipher','Aglaea · Cipher + Cyrene','remembrance','premium','1402 1406 1415 1414','adapted','cyrene','Varian debuff Cipher; sustain DHPT untuk carry ATK.'],
 ['mydei-cyrene-cerydra','Mydei · Cyrene + Cerydra','hypercarry','premium','1404 1415 1412 1409','adapted','cyreneKqm','Ode dan duplikasi Cerydra mendukung burst Mydei; Hyacine menjaga siklus HP.'],
 ['mydei-cyrene-tribbie','Mydei · Cyrene + Tribbie','hypercarry','premium','1404 1415 1403 1409','adapted','cyrene','Varian buff tim Tribbie tanpa Cerydra; tetap memakai sustain HP.'],
 ['mydei-cyrene-mem','Mydei · Cyrene + Mem','hypercarry','budget','1404 1415 8007 1301','adapted','cyrene','Adaptasi support RMC dan sustain 4★; bukan ceiling varian Hyacine.'],
 ['mydei-cyrene-cipher','Mydei · Cipher + Cyrene','hypercarry','premium','1404 1406 1415 1409','adapted','cyrene','Cipher sebagai debuffer alternatif; Hyacine menjaga HP Mydei.'],
 ['fua-cipher-cyrene-ashveil','Ashveil · Cipher + Cyrene','fua','premium','1504 1406 1415 1409','adapted','cyrene','Follow-up dengan Cipher dan Cyrene sesuai permintaan; varian eksperimen, startup Cyrene lebih lambat.'],
 ['fua-cipher-cyrene-feixiao','Feixiao · Cipher + Cyrene','fua','premium','1220 1406 1415 1304','adapted','cyrene','Alternatif koleksi untuk follow-up. Cyrene kurang optimal dibanding core khusus Feixiao; bukan rekomendasi tier teratas.'],
 ['fua-cipher-cyrene-ratio','Ratio · Cipher + Cyrene','fua','premium','1305 1406 1415 1304','adapted','cyrene','Cipher memasok debuff; periksa jumlah debuff untuk follow-up Ratio. Startup Cyrene lebih lambat.'],
 ['fua-cipher-cyrene-tribbie','Tribbie · Cipher + Cyrene','fua','premium','1403 1406 1415 1409','adapted','cyrene','Follow-up Amphoreus dengan empat Chrysos Heir. Jaga uptime Ultimate Tribbie.'],
 ['hysilens-cyrene','Hysilens · Kafka + Cyrene','dot','premium','1410 1005 1415 1414','adapted','cyreneKqm','Cyrene mendukung Hysilens; DHPT sustain untuk varian DoT ini.'],
 ['hysilens-cyrene-hyacine','Hysilens · Cyrene + Hyacine','dot','premium','1410 1005 1415 1409','adapted','cyrene','Mengganti DHPT dengan Hyacine untuk healing dan Recollection.'],
 ['cyrene-evernight-mem','Cyrene · Evernight + Mem','remembrance','premium','1415 1413 8007 1409','adapted','cyreneKqm','Mono Remembrance yang menonjolkan Cyrene dan RMC, tanpa Castorice.'],
 ['castorice-cyrene-mem','Castorice · Cyrene + Mem','remembrance','premium','1407 1415 8007 1409','adapted','cyrene','RMC menggantikan Evernight; empat Remembrance dengan sustain Hyacine.'],
 ['phainon-cyrene-hyacine','Phainon · Cyrene + Hyacine','hypercarry','premium','1408 1415 1412 1409','adapted','cyreneKqm','Varian healing dan Recollection sebagai alternatif DHPT.'],
 ['phainon-cyrene-cipher','Phainon · Cipher + Cyrene','hypercarry','premium','1408 1406 1415 1414','adapted','cyrene','Cipher mengisi debuffer jika tidak memiliki Cerydra; bukan pengganti setara.'],
 ['evanescia-core','Evanescia · mono Elation','elation','premium','1505 1502 8009 1503','meta','meta46','EMC mengisi slot Elation keempat; jaga timing Ultimate dan Energy.'],
 ['wave-ashblade','Waveflair · Ashveil + Mortenax','fua','premium','1513 1504 1507 1409','meta','meta46','Serangan beruntun mengisi Fervor. Acuan performa tinggi memakai Waveflair E1; preset tetap E0.'],
 ['nova-tribbie','Himeko Nova · Sparkle + Tribbie','aoe','premium','1510 1306 1403 1414','meta','meta46','DHPT mengisi slot Astral Express dan sustain; Sparkle memasok SP/advance.'],
 ['archer-rin','Archer · Rin + Sparkle','hypercarry','premium','1015 1508 1306 1217','meta','current46','Core kolaborasi dengan SP Sparkle dan energi Huohuo.'],
 ['nova-sunday','Himeko Nova · Sunday + Sparkle','aoe','premium','1510 1313 1306 1414','meta','current46','Varian double advance; tuning urutan giliran dan SP perlu disesuaikan.'],
 ['pearl-wave','Silver Wolf · Waveflair + Pearl','elation','premium','1506 1513 1502 1503','meta','teams46','Varian dua penyerang Elation dengan Pearl sebagai sustain.'],
 ['wave-robin','Waveflair · Yao + Robin','elation','premium','1513 1502 1309 1217','meta','teams46','Varian campuran Elation dengan action advance Robin dan energi Huohuo.'],
 ['firefly-dahlia','Firefly · Fugue + The Dahlia','break','premium','1310 1225 1321 1222','meta','meta46','Core Break baru dengan Dahlia; Lingsha memberi sustain dan damage tambahan.'],
 ['hysilens-dhpt','DoT · Hysilens + DHPT','dot','premium','1410 1005 1307 1414','meta','meta46','Tiga penyerang DoT dengan sustain DHPT; berbeda dari core lama Ruan Mei.'],
 ['phainon-cyrene','Phainon · Cyrene + Cerydra','hypercarry','premium','1408 1415 1412 1414','meta','meta46','Cerydra mendukung Skill; DHPT memberi sustain. Investasi Cyrene memengaruhi rotasi.'],
 ['ashblade-summer','Ashveil · Mortenax + Summeretto','fua','premium','1504 1507 1512 1409','adapted','ashveil','Summeretto memberi advance/dukungan; Hyacine membantu tim HP drain bertahan.'],
 ['ashblade-robin','Ashveil · Mortenax + Robin','fua','premium','1504 1507 1309 1409','adapted','mortenax','Alternatif jika memiliki Robin Harmony; prioritaskan frekuensi serangan.'],
 ['ashblade-huohuo','Waveflair · Ashblade + Huohuo','fua','premium','1513 1504 1507 1217','adapted','wave','Penggantian sustain untuk bantuan energi; tidak sama dengan ceiling varian Hyacine.'],
 ['nova-welt','Himeko Nova · Welt + Mem','aoe','budget','1510 1004 8007 1414','adapted','community46','Contoh komunitas: Welt memberi debuff, Mem support, DHPT slot Express dan sustain.'],
 ['nova-mortenax','Himeko Nova · Mortenax + Sunday','aoe','premium','1510 1507 1313 1414','adapted','nova','Mortenax memberi debuff; Sunday mendukung giliran carry, DHPT menjaga party.'],
 ['nova-starter','Himeko Nova · Asta + Mem','aoe','budget','1510 1009 8007 1301','adapted','nova','Adaptasi satu limited dengan Astral Express dari Trailblazer; ceiling lebih rendah.'],
 ['sw-emc','Silver Wolf · EMC + Pearl','elation','premium','1506 8009 1502 1503','adapted','elation','Mengganti Sparxie dengan EMC; tetap empat Elation.'],
 ['sw-starter','Silver Wolf · EMC + Asta','elation','budget','1506 8009 1009 1301','adapted','elation','Satu limited, buff Asta dan sustain Gallagher. Bukan mono Elation.'],
 ['sw-yao-huohuo','Silver Wolf · Yao + Huohuo','elation','premium','1506 1502 8009 1217','adapted','elation','Sustain non-Elation; kehilangan sinergi Pearl, mendapat energi Huohuo.'],
 ['sparxie-wave','Sparxie · Waveflair + Pearl','elation','premium','1501 1513 1502 1503','adapted','wave','Dua carry Elation; pantau penggunaan SP Sparxie.'],
 ['sparxie-emc-budget','Sparxie · EMC + Pearl','elation','budget','1501 8009 1009 1503','adapted','elationFans','Tidak memakai Yao Guang; Asta mengisi support, hanya tiga Elation.'],
 ['evanescia-starter','Evanescia · EMC starter','elation','budget','1505 8009 1009 1301','adapted','evanescia','Adaptasi satu limited; EMC partner inti dan Gallagher sustain.'],
 ['evanescia-huohuo','Evanescia · Yao + Huohuo','elation','premium','1505 1502 8009 1217','adapted','evanescia','Alternatif sustain energi tanpa Pearl; tidak memenuhi empat Elation.'],
 ['wave-emc','Waveflair · EMC + Pearl','elation','premium','1513 8009 1502 1503','adapted','wave','Core mono Elation dengan Trailblazer menggantikan carry limited kedua.'],
 ['wave-starter','Waveflair · EMC starter','elation','budget','1513 8009 1009 1301','adapted','wave','Satu limited; fokus frekuensi serangan dan pengisian Fervor.'],
 ['castorice-summer','Castorice · Evernight + Summeretto','remembrance','premium','1407 1413 1512 1409','adapted','summer','Alternatif support Cyrene; advance dan HP tim perlu disesuaikan.'],
 ['castorice-tribbie','Castorice · Tribbie + Mem','remembrance','premium','1407 1403 8007 1409','adapted','remembrance','Mem dan Tribbie mendukung damage; Hyacine menjaga siklus HP.'],
 ['castorice-ever-mem','Castorice · Evernight + Mem','remembrance','premium','1407 1413 8007 1409','adapted','remembrance','Empat Remembrance, dengan RMC menggantikan Cyrene.'],
 ['castorice-luocha','Castorice · Mem + Luocha','remembrance','budget','1407 8007 1106 1203','adapted','remembrance','Varian sustain bagi pemilik Luocha; Pela memberi debuff.'],
 ['aglaea-summer','Aglaea · Sunday + Summeretto','remembrance','premium','1402 1313 1512 1217','adapted','summer','Advance dari dua support; atur timing agar efeknya tidak terbuang.'],
 ['aglaea-starter','Aglaea · Mem + Tingyun','remembrance','budget','1402 8007 1202 1301','adapted','aglaea','Satu limited dengan dukungan energi Tingyun; bukan pengganti setara Sunday.'],
 ['hysilens-huohuo','DoT · Hysilens + Huohuo','dot','premium','1410 1005 1307 1217','adapted','hysilens','Tiga DoT, dengan energi dan healing Huohuo.'],
 ['hysilens-rm','DoT · Hysilens + Ruan Mei','dot','premium','1410 1005 1303 1217','adapted','hysilens','Kafka sebagai detonator, Ruan Mei untuk buff tim; tanpa Black Swan.'],
 ['hysilens-sampo','Hysilens · Sampo + Asta','dot','budget','1410 1108 1009 1301','adapted','hysilens','Adaptasi satu limited untuk koleksi tanpa Kafka; damage dan rotasi berbeda.'],
 ['dot-summer','DoT · Kafka + Summeretto','dot','premium','1005 1307 1512 1217','adapted','summer','Support generasi baru sebagai alternatif Ruan Mei; atur advance Kafka.'],
 ['dot-gui','Kafka · Guinaifen + Asta','dot','budget','1005 1210 1009 1301','adapted','kafka','Varian Fire untuk lawan yang cocok dengan Burn.'],
 ['dot-luka','Kafka · Luka + Pela','dot','budget','1005 1111 1106 1301','adapted','kafka','Varian Physical satu target dengan Bleed dan DEF reduction.'],
 ['dot-bs-free','Black Swan · Sampo + Asta','dot','budget','1307 1108 1009 1110','adapted','dot','Satu limited; Sampo memberi Wind Shear, tanpa detonasi Kafka.'],
 ['boothill-dahlia','Boothill · Fugue + Dahlia','break','premium','1315 1225 1321 1222','adapted','boothill','Break Physical untuk target boss; sesuaikan Weakness dan giliran.'],
 ['boothill-bronya','Boothill · Bronya + Ruan Mei','break','premium','1315 1101 1303 1301','classic','boothill','Bronya memberi giliran tambahan; periksa kebutuhan SP dan Weakness.'],
 ['boothill-budget','Boothill · HMC + Pela','break','budget','1315 8005 1106 1301','adapted','boothill','Satu limited dengan HMC dan DEF reduction; bukan core optimal.'],
 ['rappa-dahlia','Rappa · Fugue + Dahlia','break','premium','1317 1225 1321 1222','adapted','rappa','Varian Break AoE untuk wave banyak target.'],
 ['rappa-rm','Rappa · Fugue + Ruan Mei','break','premium','1317 1225 1303 1222','classic','rappa','Core Break sebelum Dahlia; masih bergantung komposisi wave.'],
 ['rappa-budget','Rappa · HMC + Asta','break','budget','1317 8005 1009 1301','adapted','rappa','Satu limited dengan Super Break dari HMC.'],
 ['firefly-rm-hmc','Firefly · Ruan Mei + HMC','break','budget','1310 1303 8005 1301','classic','break','Core lama yang lebih murah jika Ruan Mei sudah dimiliki.'],
 ['firefly-dahlia-hmc','Firefly · Dahlia + HMC','break','budget','1310 1321 8005 1301','adapted','dahlia','Mengganti Fugue/Lingsha dengan HMC/Gallagher; ambang stat perlu tuning.'],
 ['xueyi-fugue','Xueyi · Fugue + HMC','break','budget','1214 1225 8005 1301','adapted','xueyi','Carry 4★ dengan support Fugue; perhatikan target Quantum.'],
 ['feixiao-summer','Feixiao · Ashveil + Summeretto','fua','premium','1220 1504 1512 1304','adapted','ashveil','Dua Hunt dengan serangan susulan dan advance Summeretto.'],
 ['feixiao-moze','Feixiao · Moze + Robin','fua','budget','1220 1223 1309 1304','adapted','fua','Moze menggantikan Topaz; sustain Aventurine membantu jumlah serangan.'],
 ['feixiao-march-robin','Feixiao · March + Robin','fua','budget','1220 1224 1309 1301','adapted','fua','March Hunt mengisi partner serangan dengan sustain 4★.'],
 ['ratio-topaz','Ratio · Topaz + Robin','fua','premium','1305 1112 1309 1304','classic','ratio','Periksa jumlah debuff; Topaz E0S0 dapat memerlukan LC/debuff tambahan.'],
 ['ratio-moze','Ratio · Moze + Pela','fua','budget','1305 1223 1106 1301','adapted','ratio','Moze/Pela memberi debuff bagi follow-up Ratio.'],
 ['yunli-robin','Yunli · Robin + Tingyun','fua','premium','1221 1309 1202 1217','classic','yunli','Counter dan energi; timing parry Yunli menentukan hasil.'],
 ['yunli-budget','Yunli · Tingyun + Pela','fua','budget','1221 1202 1106 1110','adapted','yunli','Lynx memberi sustain dan peningkatan peluang diserang.'],
 ['clara-budget','Clara · Tingyun + Pela','fua','budget','1107 1202 1106 1110','classic','yunli','Counter standard 5★; Lynx mendukung aggro. Bukan klaim tier meta 4.6.'],
 ['herta-anaxa','The Herta · Anaxa + Tribbie','aoe','premium','1401 1405 1403 1222','adapted','theherta','Dua Erudition, Tribbie support, Lingsha sustain dengan AoE.'],
 ['herta-mini','The Herta · Herta + Tribbie','aoe','premium','1401 1013 1403 1222','meta','teams46','Herta 4★ mengisi slot Erudition kedua.'],
 ['herta-budget','The Herta · Herta + Asta','aoe','budget','1401 1013 1009 1301','adapted','theherta','Satu limited dengan Erudition gratis dan sustain 4★.'],
 ['anaxa-cerydra','Anaxa · Cerydra + Sunday','aoe','premium','1405 1412 1313 1409','adapted','anaxa','Hypercarry Skill dengan dua support; sesuaikan urutan advance.'],
 ['anaxa-budget','Anaxa · Herta + Asta','aoe','budget','1405 1013 1009 1301','adapted','anaxa','Duo Erudition untuk AoE; buff konten dan Weakness memengaruhi hasil.'],
 ['jade-herta','Jade · Herta + Robin','aoe','premium','1314 1013 1309 1304','classic','jade','Debt Collector pada partner AoE; fokus wave PF.'],
 ['jade-himeko','Jade · Himeko + Asta','aoe','budget','1314 1003 1009 1301','adapted','jade','Pilihan jika punya Himeko standard; serangan AoE membantu stack.'],
 ['acheron-mortenax','Acheron · Mortenax + Jiaoqiu','acheron','premium','1308 1507 1218 1304','adapted','mortenax','Dua Nihility untuk Acheron E0; Mortenax memberi debuff dan damage tambahan.'],
 ['acheron-cipher','Acheron · Cipher + Jiaoqiu','acheron','premium','1308 1406 1218 1304','adapted','acheron','Varian Nihility; periksa frekuensi debuff dan kebutuhan stack.'],
 ['acheron-pela-jiao','Acheron · Jiaoqiu + Pela','acheron','budget','1308 1218 1106 1301','adapted','acheron','Dua Nihility tanpa signature limited partner lain.'],
 ['phainon-sunday','Phainon · Cerydra + Sunday','hypercarry','premium','1408 1412 1313 1414','adapted','phainon','Core Skill dengan sustain DHPT; beri support ke Phainon sebelum transformasi.'],
 ['phainon-budget','Phainon · Tingyun + Bronya','hypercarry','budget','1408 1202 1101 1301','adapted','phainon','Tanpa Cerydra; jauh lebih rendah dari core premium, butuh pengaturan SP.'],
 ['mydei-hyacine','Mydei · Tribbie + Sunday','hypercarry','premium','1404 1403 1313 1409','adapted','mydei','HP carry dengan healing Hyacine dan dukungan advance.'],
 ['mydei-budget','Mydei · Pela + Mem','hypercarry','budget','1404 1106 8007 1301','adapted','mydei','Satu limited; sustain/stat HP perlu disesuaikan dengan konsumsi HP.'],
 ['archer-budget','Archer · Hanya + Tingyun','hypercarry','budget','1015 1215 1202 1301','adapted','archer','Tanpa Rin/Sparkle; Hanya membantu SP tetapi performa berbeda jauh.'],
 ['saber-gil','Saber · Gilgamesh + Summeretto','hypercarry','premium','1014 1509 1512 1414','adapted','saber','Duo kolaborasi dengan advance Summeretto dan sustain DHPT.'],
 ['saber-sunday','Saber · Sunday + Tingyun','hypercarry','budget','1014 1313 1202 1301','adapted','saber','Energi dan advance untuk Saber tanpa core kolaborasi lengkap.'],
 ['jingyuan-sunday','Jing Yuan · Sunday + Robin','hypercarry','premium','1204 1313 1309 1217','classic','jingyuan','Sunday mendukung summon; core karakter lama, bukan tier teratas 4.6.'],
 ['dhil-sparkle','Dan Heng IL · Sparkle + Tingyun','hypercarry','budget','1213 1306 1202 1217','classic','dhil','Sparkle membantu kebutuhan SP; IL memakai signature miliknya sendiri.'],
 ['jingliu-bronya','Jingliu · Bronya + Ruan Mei','hypercarry','premium','1212 1101 1303 1203','classic','jingliu','Core Ice klasik dengan healing Luocha.'],
 ['blade-sunday','Blade · Sunday + Tribbie','hypercarry','premium','1205 1313 1403 1409','classic','blade','HP carry klasik dengan support modern; tidak disamakan Mortenax Blade.'],
 ['seele-quantum','Seele · Sparkle + Silver Wolf','quantum','premium','1102 1306 1006 1208','classic','seele','Mono Quantum klasik dengan Fu Xuan; empat elemen sama, bukan empat Path sama.']
];
for(const [id,name,category,tier,ids,evidence,source,note] of expandedPresetRows){
 const p=teamPreset(id,name,category,tier,ids.split(' '),[source],note);
 p.evidence=evidence;p.checked='2026-11-08';
 if(category==='elation'&&p.characters.every(id=>['1501','1502','1503','1505','1506','1513','8009'].includes(id)))p.mono='Elation';
 teamPresets.push(p);
}
teamPresets.sort((a,b)=>['meta','adapted','classic'].indexOf(a.evidence)-['meta','adapted','classic'].indexOf(b.evidence));

// Explicit starter gear for the added characters. Alternatives share a Path;
// they are not claims that every cone has equal performance or is freely owned.
const addedProfiles={
 '1504':['ashveil','23056','24001','115','315','critAtk'],
 '1505':['evanescia','23058','24006','129','325','elationAtk'],
 '1507':['blade-mortenax','23059','21015','132','308','hpEnergy'],
 '1508':['rin-tohsaka','23061','21027','122','328','critAtk'],
 '1509':['gilgamesh','23062','24000','122','309','critAtk'],
 '1510':['himeko-nova','23060','21027','131','327','critAtk'],
 '1512':['robin-summeretto','23063','24005','127','323','hpSupport'],
 '1513':['aventurine-waveflair','23064','24006','129','325','elationEnergy'],
 '1321':['the-dahlia','23050','21015','119','307','breakSupport'],
 '1414':['dan-heng-permansor-terrae','23051','21016','103','310','shield'],
 '1410':['hysilens','23047','21008','126','322','dotEhr'],
 '1412':['cerydra','23048','20012','121','317','atkSupport'],
 '1408':['phainon','23044','24000','127','321','critAtk'],
 '1405':['anaxa','23041','21027','122','309','crit'],
 '1406':['cipher','23043','21015','117','315','crit'],
 '1404':['mydei','23039','24000','113','319','hpFast'],
 '1403':['tribbie','23038','20012','124','321','hpCrit'],
 '1401':['the-herta','23037','21027','122','314','critAtk'],
 '1317':['rappa','23033','21027','119','307','break'],
 '1315':['boothill','23027','20000','119','307','break'],
 '1314':['jade','23028','21027','115','315','critAtk'],
 '1305':['dr-ratio','23020','24001','117','315','critAtk'],
 '1306':['sparkle','23021','20012','121','310','critSupport'],
 '1204':['jing-yuan','23010','21027','115','318','critAtk'],
 '1205':['blade','23009','24000','113','309','hpFast'],
 '1212':['jingliu','23014','24000','122','309','critAtk'],
 '1213':['dan-heng-imbibitor-lunae','23015','24000','102','309','critAtk'],
 '1203':['luocha','23008','20015','101+114','310','healer'],
 '1208':['fu-xuan','23011','21016','113+106','310','support'],
 '1101':['bronya','23003','20012','121','310','critSupport'],
 '1107':['clara','23002','24000','105','306','critAtk'],
 '1102':['seele','23001','24001','108','309','critAtk'],
 '1221':['yunli','23030','24000','120','306','critAtk'],
 '1014':['saber','23045','24000','122','309','critAtk'],
 '1015':['archer','23046','24001','108','309','critAtk'],
 '1004':['welt','23004','21015','112','314','debuff']
};
Object.assign(presetBuildStyles,{
 hpSupport:{label:'Support HP / ERR',main:['hpPct','spdFlat','hpPct','err'],subs:['spdFlat','hpPct','critRate','critDmg']},
 hpEnergy:{label:'HP / CRIT / ERR',main:['critRate','spdFlat','hpPct','err'],subs:['critRate','critDmg','spdFlat','hpPct']},
 elationEnergy:{label:'Elation / CRIT / ERR',main:['critRate','spdFlat','atkPct','err'],subs:['spdFlat','critRate','critDmg','atkPct']}
});
for(const [id,[slug,lc,fallback,relic,planar,style]] of Object.entries(addedProfiles)){
 teamPresetProfiles[id]=presetProfile(slug,[lc,fallback],[relic],[planar],[style],'Contoh gear awal. Sesuaikan SPD, EHR, CRIT, dan rotasi dengan tim; opsi ekonomis tidak setara signature.');
}
teamPresetProfiles['1504'].relics.push('117','110');teamPresetProfiles['1504'].planars.push('326','306');
teamPresetProfiles['1507'].relics.push('110','113');teamPresetProfiles['1507'].planars.push('319');teamPresetProfiles['1507'].styles.push('hpFast','debuff');
teamPresetProfiles['1510'].relics.push('122','126');teamPresetProfiles['1510'].planars.push('309');
teamPresetProfiles['1512'].planars.push('317','308','302');teamPresetProfiles['1512'].styles.push('remSupport');
teamPresetProfiles['1513'].relics.push('130','108');teamPresetProfiles['1513'].lcs.push('21064','21066');
// Keep signature first in every wizard profile, using the same owner resolver
// as the inventory. Paid cones never become an implicitly labelled F2P option.
for(const [id,p] of Object.entries(teamPresetProfiles)){
 const sig=signatureLC(roster.find(c=>c.id===id));
 if(sig)p.lcs=[sig.id,...p.lcs.filter(lc=>lc!==sig.id)];
}
