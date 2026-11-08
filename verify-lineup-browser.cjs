'use strict';
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {promisify}=require('node:util');
const exec=promisify(require('node:child_process').execFile);
const root=__dirname,profile=path.join(root,'.preview-equipment');
const fixture=path.join(root,'.lineup-browser-check.html');
const checks=`<script>(async()=>{
try {
 const must=(ok,message)=>{if(!ok)throw new Error(message);};
 const portraits=new Set();
 for(const mode of ['moc','pf','as','aa']){
  lobbyMode=mode;lobbyPreset=0;renderLobby();
  must(document.querySelectorAll('#lineupPreview .preview-wave').length===(mode==='pf'?3:2),mode+' wave count');
  for(let i=0;i<challenges[mode].length;i++){
   lobbyPreset=i;renderLobby();
   document.querySelectorAll('#lineupPreview [data-preview-enemy]').forEach(img=>portraits.add(img.getAttribute('src')));
  }
 }
 lobbyMode='pf';lobbyPreset=1;renderLobby();
 document.getElementById('menuEncounterDetails').open=true;
 const preview=document.getElementById('lineupPreview');
 for(const width of [390,1280]){
  const frame=document.createElement('div');frame.style.cssText='width:'+width+'px;position:fixed;top:0;left:0;background:#141a28';
  frame.className='lineup-preview';frame.innerHTML=preview.innerHTML;document.body.append(frame);
  must(frame.scrollWidth<=frame.clientWidth+1,'Preview overflow at '+width);
  must(frame.querySelector('.preview-wave').getBoundingClientRect().height>80,'Wave collapsed');
  frame.remove();
 }
 must(!document.getElementById('lobby').hidden,'Lobby hidden');
 must(preview.getBoundingClientRect().height>100,'Actual preview collapsed');
 await Promise.all([...portraits].map(src=>new Promise((resolve,reject)=>{
  const img=new Image();img.onload=()=>img.naturalWidth>0?resolve():reject(new Error('Empty image '+src));img.onerror=()=>reject(new Error('Cannot load '+src));img.src=src;
 })));
 requestAnimationFrame(()=>preview.scrollIntoView({block:'start'}));
 document.body.dataset.lineupTests='passed';
}catch(error){document.body.dataset.lineupTests='failed';const out=document.createElement('pre');out.id='lineupFailure';out.textContent=error.stack;document.body.append(out);}
})();</script>`;
(async()=>{
 fs.mkdirSync(profile,{recursive:true});
 fs.writeFileSync(fixture,fs.readFileSync(path.join(root,'index.html'),'utf8').replace('</body>',checks+'</body>'));
 try{
  const {stdout}=await exec(process.env.HSR_TEST_CHROME||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',[
   '--headless=new','--disable-gpu','--disable-software-rasterizer','--no-first-run','--disable-extensions','--allow-file-access-from-files','--run-all-compositor-stages-before-draw','--timeout=20000',
   '--user-data-dir='+path.join(profile,'lineup-profile'),'--window-size=1280,1000','--virtual-time-budget=3000',
   '--dump-dom',pathToFileURL(fixture).href
  ],{timeout:60000,windowsHide:true,maxBuffer:3e6});
  if(!stdout.includes('data-lineup-tests="passed"'))throw new Error(stdout.match(/<pre id="lineupFailure">([\s\S]*?)<\/pre>/)?.[1]||'Browser validation did not finish');
  console.log('Passed: real browser DOM for all four modes, every bundled enemy image decoded, PF three waves, preview widths 390/1280 without overflow.');
 }finally{fs.unlinkSync(fixture);}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
