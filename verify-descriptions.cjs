'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context=vm.createContext({});
for(const file of ['complete-gear-data.js','eidolon-data.js','description-translations.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
const read=source=>vm.runInContext(source,context);
const pairs=read('stellarDescriptionTranslations'),translations=new Map(pairs);
const descriptions=read('[...completeLightConeData.map(x=>x.desc),...completeRelicSetData.flatMap(x=>x.desc),...Object.values(eidolonCatalogue).flat().map(x=>x.desc)]');
const numbers=text=>(text.match(/\d+(?:[.,]\d+)*%?/g)||[]).sort();
const parameters=text=>text.match(/#\d+\[(?:i|f\d*)\]%?/g)||[];
for(const source of descriptions){
 const id=translations.get(source);
 assert.ok(id,'Missing translation: '+source.slice(0,100));
 assert.notEqual(id,source,'Untranslated description');
 assert.deepEqual(numbers(id),numbers(source),'Numeric values changed: '+source);
 assert.deepEqual(parameters(id),parameters(source),'Parameter markers changed: '+source);
 for(const name of source.match(/"[^"\n]+"/g)||[])assert.ok(id.includes(name),'Ability name changed: '+name);
 assert.ok(!/__HSR\d+__/.test(id),'Unresolved placeholder');
}
console.log(`PASS: ${descriptions.length} descriptions covered by ${pairs.length} offline translations; all numbers, parameter markers and quoted ability names preserved.`);
