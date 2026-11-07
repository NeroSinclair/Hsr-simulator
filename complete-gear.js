'use strict';
propertyMap.BaseSpeed='spdBaseFlat';
for(const data of completeLightConeData){const existing=lightCones.find(x=>x.id===data.id);if(existing)Object.assign(existing,data);else lightCones.push({...data,description:'Bonus stat permanen aktif; efek situasional mengikuti dukungan engine latihan.'});}
function setPropertyBonus(properties){const out={};for(const property of properties||[]){const key=propertyMap[property.type];if(key)out[key]=(out[key]||0)+property.value*(key.endsWith('Flat')?1:100);else if(elementProperty[property.type]){out.element=elementProperty[property.type];out.dmg=(out.dmg||0)+property.value*100;}}return out;}
for(const data of completeRelicSetData){const planar=data.id.startsWith('3'),list=planar?planarSets:relicSets;const existing=list.find(s=>s.id===data.id);const entry={...data,description:data.desc.join(' ')};if(planar)entry.bonus={...(existing?.bonus||{}),...setPropertyBonus(data.properties[0])};else{entry.bonus2={...(existing?.bonus2||{}),...setPropertyBonus(data.properties[0])};entry.bonus4={...(existing?.bonus4||{}),...setPropertyBonus(data.properties[1])};}if(existing)Object.assign(existing,entry);else list.push(entry);}
// Preserve existing battle triggers, replacing duplicate numeric base bonuses.
const passiveBeforeCompleteCatalogue=passiveLC;
passiveLC=function(c,b){const lc=lcFor(b);if(lc.path!=='Any'&&lc.path!==c.path)return {};return {...passiveBeforeCompleteCatalogue(c,b),...propertiesToBonus(lc.properties?.[b.superimposition-1],c.element)};};
// Useful permanent modifiers not represented by the game's generic stat table.
Object.assign(relicSets.find(s=>s.id==='107').bonus4,{skill:12});
Object.assign(relicSets.find(s=>s.id==='122').bonus4,{skill:20,ultimate:20});
Object.assign(relicSets.find(s=>s.id==='128').bonus2,{shield:10});
Object.assign(relicSets.find(s=>s.id==='128').bonus4,{shield:12});
pathSetRecommendations.Destruction.push('116','120','122','123','126','127','132','131');
pathSetRecommendations['The Hunt'].push('116','120','122','126','131');
pathSetRecommendations.Erudition.push('116','120','122','131');
pathSetRecommendations.Nihility.push('116','117','118','119','132','315','318');
pathSetRecommendations.Harmony.push('121','125','130','133','311','320','327');
pathSetRecommendations.Abundance.push('121','125','128','311','320','327');
pathSetRecommendations.Preservation.push('121','128','311','320');
pathSetRecommendations.Remembrance.push('123','124','125','127','314','319','321');
pathSetRecommendations.Elation.push('129','130','133','134','323','324','326');
const cardBeforeCatalogueDetails=showPickerCard;
showPickerCard=function(item,c,recommended=false){let card=cardBeforeCatalogueDetails(item,c,recommended);const lc=pickerKind==='lc';const desc=lc?traceDescription(item,buildDraft[buildSlot].build.superimposition):item.description;return card.replace('</button>',`${desc?`<span class="gallery-effect" title="${esc(desc)}">${esc(desc)}</span>`:''}</button>`);};
renderLobby();
