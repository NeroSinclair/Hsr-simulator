'use strict';
(() => {
 if(!document.body?.animate)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const low=()=>document.documentElement.classList.contains('low-motion');
 const enabled=()=>!reduced.matches&&!document.hidden;
 const rich=()=>enabled()&&!low();
 const mobile=()=>matchMedia('(max-width: 960px), (pointer: coarse)').matches;
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const lobby=document.getElementById('lobby');
 const ambience=document.createElement('div');ambience.className='stellar-ambience';ambience.setAttribute('aria-hidden','true');
 const aurora=document.createElement('div');aurora.className='stellar-aurora';ambience.append(aurora);
 for(let i=0;i<12;i++){
  const star=document.createElement('i');star.className='stellar-spark';
  star.style.cssText=`--x:${(i*37+11)%100}%;--y:${(i*23+9)%94}%;--delay:${-i*1.17}s;--duration:${6+i%4*2}s;--size:${i%3===0?4:2}px`;
  ambience.append(star);
 }
 lobby?.prepend(ambience);
 document.documentElement.classList.add('stellar-motion-ready');
 let ambienceVisible=true;
 const sync=()=>{
  document.documentElement.classList.toggle('stellar-motion-paused',!rich()||!ambienceVisible);
  if(!enabled())resetTilt();
 };
 if(typeof IntersectionObserver!=='undefined'){
  const ambientObserver=new IntersectionObserver(entries=>{ambienceVisible=entries[0].isIntersecting;sync();});
  ambientObserver.observe(ambience);
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   entry.target.classList.add('stellar-revealed');revealObserver.unobserve(entry.target);
  }),{threshold:.08});
  document.querySelectorAll('.party-selection,.gear-shortcut,.menu-encounter,.menu-start-area').forEach(node=>{
   node.classList.add('stellar-reveal');revealObserver.observe(node);
  });
 }
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
 let tilted=null,frame=0,point=null;
 function resetTilt(){
  if(frame)cancelAnimationFrame(frame);frame=0;
  if(tilted){tilted.style.removeProperty('--tilt-x');tilted.style.removeProperty('--tilt-y');tilted.classList.remove('stellar-tilted');tilted=null;}
 }
 document.addEventListener('pointermove',event=>{
  if(!rich()||!fine.matches)return;
  const card=event.target.closest('.mode-card,.menu-party-card,.lc-inventory-card,.gallery-item');
  if(!card){resetTilt();return;}
  if(tilted!==card){resetTilt();tilted=card;card.classList.add('stellar-tilted');}
  point={x:event.clientX,y:event.clientY};
  if(frame)return;
  frame=requestAnimationFrame(()=>{
   frame=0;if(!tilted)return;
   const rect=tilted.getBoundingClientRect();
   tilted.style.setProperty('--tilt-x',((point.y-rect.top)/rect.height-.5)*-9+'deg');
   tilted.style.setProperty('--tilt-y',((point.x-rect.left)/rect.width-.5)*11+'deg');
  });
 },{passive:true});
 document.addEventListener('pointerout',event=>{if(tilted&&!tilted.contains(event.relatedTarget))resetTilt();},{passive:true});
 document.addEventListener('pointerdown',event=>{
  const button=event.target.closest('button');
  if(!button||button.disabled||!enabled())return;
  const rect=button.getBoundingClientRect(),ripple=document.createElement('span'),wave=document.createElement('i');
  ripple.className='stellar-ripple';ripple.setAttribute('aria-hidden','true');
  wave.style.left=event.clientX-rect.left+'px';wave.style.top=event.clientY-rect.top+'px';
  ripple.append(wave);button.append(ripple);setTimeout(()=>ripple.remove(),700);
  if(mobile())button.animate([{scale:'1'},{scale:'.94',offset:.3},{scale:'1.035',offset:.7},{scale:'1'}],{duration:low()?260:420,easing:'ease-out'});
 },{passive:true});
 document.addEventListener('click',event=>{
  if(!enabled()||!mobile())return;
  const card=event.target.closest('[data-lobby-mode],[data-menu-slot],[data-free-node],#freeNodeAdd');
  if(!card)return;
  requestAnimationFrame(()=>{
   const selected=card.hasAttribute('data-lobby-mode')?document.querySelector('.mode-card.chosen'):card.hasAttribute('data-menu-slot')?document.querySelector('.menu-party-card.chosen'):document.querySelector('.free-node-tab.chosen');
   selected?.animate([{scale:'.94',opacity:.6},{scale:'1.035',opacity:1,offset:.6},{scale:'1'}],{duration:low()?280:500,easing:'cubic-bezier(.16,1,.3,1)'});
  });
 });
 document.addEventListener('stellar:node',()=>{
  if(!enabled())return;
  document.getElementById('enemies')?.animate([{opacity:0,translate:'28px 0'},{opacity:1,translate:'0 0'}],{duration:low()?250:600,easing:'ease-out'});
  document.getElementById('waveLabel')?.animate([{scale:'1.2',opacity:.3},{scale:'1',opacity:1}],{duration:500});
 });
 // Wrap the committed action: invalid clicks produce no battle effect.
 if(typeof perform==='function'){
  const original=perform;
  perform=function(type,unit){
   const previous=state,stamp=state?`${state.steps}/${state.damage}/${state.logs.length}`:'';
   const result=original.apply(this,arguments);
   if(!enabled()||state!==previous||stamp===`${state.steps}/${state.damage}/${state.logs.length}`)return result;
   document.getElementById('activeArt')?.animate([
    {translate:'0 0',scale:'1'},{translate:type==='ultimate'?(mobile()?'36px -16px':'28px -12px'):'22px -6px',scale:type==='ultimate'?'1.1':'1.05',offset:.35},{translate:'0 0',scale:'1'}
   ],{duration:low()?280:type==='ultimate'?700:460,easing:'cubic-bezier(.2,.75,.25,1)'});
   const target=document.querySelectorAll('.enemy-card')[state.selected];
   target?.animate([{translate:'0 0'},{translate:'7px -3px'},{translate:'-5px 0'},{translate:'0 0'}],{duration:340});
   if(type!=='basic'&&rich()){
    const arena=document.querySelector('.battle'),flash=document.createElement('div');
    flash.className='stellar-impact '+(type==='ultimate'?'stellar-ultimate':'stellar-skill');flash.setAttribute('aria-hidden','true');arena?.append(flash);
    setTimeout(()=>flash.remove(),850);
   }
   return result;
  };
 }
 sync();
})();
