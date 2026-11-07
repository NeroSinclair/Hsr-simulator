'use strict';
// Supported effects are explicit; conditional effects live in the battle engine.
// LC flat stats are fixed level 80. Percent fields in this simulator use percentage points.
const lightCones=[
 {id:'none',name:'Tanpa Light Cone',path:'Any',base:{},description:'Tidak ada tambahan stat.'},
 {id:'20000',name:'Arrows',path:'The Hunt',base:{hp:846,atk:317,def:264},description:'Awal battle: CRIT Rate +12–24%, 3 giliran.'},
 {id:'20001',name:'Cornucopia',path:'Abundance',base:{hp:952,atk:264,def:264},description:'Outgoing Healing Skill/Ultimate +12–24%.'},
 {id:'20002',name:'Collapsing Sky',path:'Destruction',base:{hp:846,atk:370,def:198},description:'Basic/Skill DMG +20–40%.'},
 {id:'20003',name:'Amber',path:'Preservation',base:{hp:846,atk:264,def:330},description:'DEF +16–32%; di bawah 50% HP, tambahan DEF +16–32%.'},
 {id:'20004',name:'Void',path:'Nihility',base:{hp:846,atk:317,def:264},description:'Awal battle: EHR +20–40%, 3 giliran.'},
 {id:'20005',name:'Chorus',path:'Harmony',base:{hp:846,atk:317,def:264},description:'Seluruh party: ATK +8–12%. Tidak stack dengan Chorus lain.'},
 {id:'20006',name:'Data Bank',path:'Erudition',base:{hp:846,atk:370,def:198},description:'Ultimate DMG +28–56%.'},
 {id:'20012',name:'Meshing Cogs',path:'Harmony',base:{hp:846,atk:317,def:264},description:'Menyerang/terkena serangan: +4–8 energi, maksimal 1 pemicu/giliran wearer.'},
 {id:'24000',name:'On the Fall of an Aeon',path:'Destruction',base:{hp:1058,atk:529,def:396},description:'Saat menyerang: ATK +8–16%, max 4 stack. Break: DMG +12–24%, 2 giliran.'},
 {id:'24001',name:'Cruising in the Stellar Sea',path:'The Hunt',base:{hp:952,atk:529,def:463},description:'CRIT Rate +8–16%; tambahan sama terhadap target HP ≤50%. Kill: ATK +20–40%, 2 giliran.'},
 {id:'21027',name:'The Seriousness of Breakfast',path:'Erudition',base:{hp:846,atk:476,def:396},description:'DMG +12–24%. Kill: ATK +4–8%, max 3 stack.'},
 {id:'21000',name:'Post-Op Conversation',path:'Abundance',base:{hp:1058,atk:423,def:330},description:'ERR +8–16%. Outgoing Healing Ultimate +12–24%.'},
 {id:'21001',name:'Good Night and Sleep Well',path:'Nihility',base:{hp:952,atk:476,def:330},description:'DMG +12–24% per debuff target, max 3.'},
 {id:'custom',name:'Custom Light Cone',path:'Any',base:{},description:'Isi flat stat LC dan bonus pasif sendiri.'}
];
const relicSets=[
 {id:'none',name:'Tanpa relic set',bonus2:{},bonus4:{},description:'Tidak ada set bonus.'},
 {id:'102',name:'Musketeer of Wild Wheat',bonus2:{atkPct:12},bonus4:{spdPct:6,basic:10},description:'2pc ATK +12%. 4pc SPD +6%, Basic DMG +10%.'},
 {id:'103',name:'Knight of Purity Palace',bonus2:{defPct:15},bonus4:{shield:20},description:'2pc DEF +15%. 4pc shield yang dibuat +20%.'},
 {id:'101',name:'Passerby of Wandering Cloud',bonus2:{heal:10},bonus4:{},description:'2pc healing +10%. 4pc awal battle +1 SP.'},
 {id:'111',name:'Thief of Shooting Meteor',bonus2:{break:16},bonus4:{break:16},description:'2pc Break Effect +16%. 4pc +16% lagi dan +3 energi saat Break.'},
 {id:'113',name:'Longevous Disciple',bonus2:{hpPct:12},bonus4:{},description:'2pc HP +12%. 4pc saat terkena serangan: CRIT Rate +8%, 2 giliran, max 2 stack.'},
 {id:'114',name:'Messenger Traversing Hackerspace',bonus2:{spdPct:6},bonus4:{},description:'2pc SPD +6%. 4pc Ultimate ke ally: party SPD +12%, 1 giliran; tidak stack.'},
 {id:'104',name:'Hunter of Glacial Forest',bonus2:{element:'Ice',dmg:10},bonus4:{},description:'2pc Ice DMG +10%. 4pc Ultimate: CRIT DMG +25%, 2 giliran.'},
 {id:'109',name:'Band of Sizzling Thunder',bonus2:{element:'Lightning',dmg:10},bonus4:{},description:'2pc Lightning DMG +10%. 4pc Skill: ATK +20%, 1 giliran.'},
 {id:'110',name:'Eagle of Twilight Line',bonus2:{element:'Wind',dmg:10},bonus4:{},description:'2pc Wind DMG +10%. 4pc Ultimate: Action Advance 25%.'},
 {id:'custom',name:'Custom relic set',bonus2:{},bonus4:{},description:'Isi bonus set sendiri; diterapkan sekali untuk satu konfigurasi.'}
];
const planarSets=[
 {id:'none',name:'Tanpa planar set',bonus:{},description:'Tidak ada set bonus.'},
 {id:'301',name:'Space Sealing Station',bonus:{atkPct:12},description:'ATK +12%; SPD ≥120 memberi ATK +12% lagi.'},
 {id:'302',name:'Fleet of the Ageless',bonus:{hpPct:12},description:'HP +12%; SPD ≥120 memberi party ATK +8%.'},
 {id:'305',name:'Celestial Differentiator',bonus:{critDmg:16},description:'CRIT DMG +16%; CRIT DMG ≥120%: CRIT Rate +60% sampai serangan pertama.'},
 {id:'306',name:'Belobog of the Architects',bonus:{defPct:15},description:'DEF +15%; EHR ≥50% memberi DEF +15% lagi.'},
 {id:'309',name:'Rutilant Arena',bonus:{critRate:8},description:'CRIT Rate +8%; CRIT Rate ≥70%: Basic/Skill DMG +20%.'},
 {id:'310',name:'Broken Keel',bonus:{effectRes:10},description:'Effect RES +10%; RES ≥30% memberi party CRIT DMG +10%.'},
 {id:'custom',name:'Custom planar set',bonus:{},description:'Isi bonus planar sendiri.'}
];
const statFields=[['hp','HP',1,100000],['atk','ATK',1,20000],['def','DEF',1,20000],['spd','SPD',60,500],['critRate','CRIT Rate %',0,100],['critDmg','CRIT DMG %',0,1000],['break','Break Effect %',0,1000],['ehr','Effect Hit %',0,500],['effectRes','Effect RES %',0,100],['err','Energy Regen %',0,200],['dmg','DMG Bonus %',0,500],['heal','Healing Bonus %',0,300]];
const bonusFields=[['hpPct','HP %'],['atkPct','ATK %'],['defPct','DEF %'],['spdPct','SPD %'],['hpFlat','HP flat'],['atkFlat','ATK flat'],['defFlat','DEF flat'],['spdFlat','SPD flat'],['critRate','CRIT Rate %'],['critDmg','CRIT DMG %'],['break','Break %'],['ehr','EHR %'],['effectRes','RES %'],['err','ERR %'],['dmg','DMG %'],['heal','Healing %']];
function defaultBuild(c,spd=c.spd){return {stats:{hp:['heal','shield'].includes(c.role)?6200:4200,atk:2400,def:1000,spd,critRate:5,critDmg:50,break:0,ehr:0,effectRes:0,err:0,dmg:0,heal:0},lc:'none',superimposition:1,relic:'none',relic2:'none',pieces:4,planar:'none',customLC:{},customRelic:{},customPlanar:{},lcBase:{hp:0,atk:0,def:0},technique:true,scope:c.role==='advance'||c.id==='1202'?'single':'party'};}
function normalizeBuild(cfg){const c=roster.find(x=>x.id===cfg.id);const defaults=defaultBuild(c,cfg.spd);return {...defaults,...cfg.build,stats:{...defaults.stats,...cfg.build?.stats},customLC:{...cfg.build?.customLC},customRelic:{...cfg.build?.customRelic},customPlanar:{...cfg.build?.customPlanar},lcBase:{...defaults.lcBase,...cfg.build?.lcBase}};}
const sumBonus=(...parts)=>{const out={};for(const part of parts)for(const [key,v]of Object.entries(part||{}))if(typeof v==='number')out[key]=(out[key]||0)+v;return out;};
function lcFor(build){return lightCones.find(l=>l.id===build.lc)||lightCones[0];}
function passiveLC(c,b){const l=lcFor(b),s=b.superimposition-1;if(l.path!=='Any'&&l.path!==c.path)return {};switch(l.id){case'custom':return b.customLC;case'20003':return {defPct:16+s*4};case'24001':return {critRate:8+s*2};case'21027':return {dmg:12+s*3};case'21000':return {err:8+s*2};default:return {};}}
function relicBonus(c,b){const first=relicSets.find(r=>r.id===b.relic)||relicSets[0];if(first.id==='custom')return b.customRelic;const valid=part=>!part.element||part.element===c.element?part:{};let out=sumBonus(valid(first.bonus2));if(b.pieces===4)out=sumBonus(out,valid(first.bonus4));else{const second=relicSets.find(r=>r.id===b.relic2);if(second&&second.id!==first.id)out=sumBonus(out,valid(second.bonus2));}return out;}
function rawStats(c,b,bonuses={}){const l=lcFor(b),flat=b.lc==='custom'?b.lcBase:l.base;const total=sumBonus(passiveLC(c,b),relicBonus(c,b),planarSets.find(p=>p.id===b.planar)?.bonus,b.planar==='custom'?b.customPlanar:{},bonuses);const out={...b.stats};for(const stat of ['hp','atk','def','spd'])out[stat]=(b.stats[stat]+(flat[stat]||0))*(1+(total[stat+'Pct']||0)/100)+(total[stat+'Flat']||0);for(const stat of ['critRate','critDmg','break','ehr','effectRes','err','dmg','heal'])out[stat]=b.stats[stat]+(total[stat]||0);for(const stat of ['basic','skill','ultimate','shield'])out[stat]=total[stat]||0;return out;}
function computeStats(c,b,bonuses={}){let s=rawStats(c,b,bonuses);const conditional={};if(b.planar==='301'&&s.spd>=120)conditional.atkPct=12;if(b.planar==='306'&&s.ehr>=50)conditional.defPct=15;if(b.planar==='309'&&s.critRate>=70){conditional.basic=20;conditional.skill=20;}s=rawStats(c,b,sumBonus(bonuses,conditional));s.critRate=Math.max(0,Math.min(100,s.critRate));s.effectRes=Math.max(0,Math.min(100,s.effectRes));return s;}
