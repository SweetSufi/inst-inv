(()=>{
'use strict';
const $=s=>document.querySelector(s);
const gallery=$('#gallery'),stage=$('#stage'),cv=$('#cv'),ctx=cv.getContext('2d');
const rand=(a,b)=>a+Math.random()*(b-a), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mq=matchMedia('(prefers-reduced-motion: reduce)');
let calm=mq.matches;
let W=0,H=0,DPR=1,S=1,time=0;
const IMG={w:759,h:1024,ay:0.18};
const bubbles=[],spheres=[],fx=[];
const ptr={x:-999,y:-999,vx:0,vy:0,inside:false,t:0};
const kb={x:0,y:0,on:false};
let drag=null,lastSpawn=0,nextWonder=10,nextChime=12;

/* ---------- sphere sprites cropped from the supplied reference ---------- */
const SRC=[[415,223,108],[245,305,58],[84,566,42],[147,757,132],[418,755,50],[305,899,62]];
let sprites=[];
const ref=new Image();
ref.onload=()=>{sprites=SRC.map(([x,y,r])=>{const c=document.createElement('canvas');const d=Math.round(r*2*1.5);c.width=c.height=d;const g=c.getContext('2d');g.beginPath();g.arc(d/2,d/2,d/2*0.975,0,7);g.clip();g.drawImage(ref,x-r,y-r,r*2,r*2,0,0,d,d);return c});initSpheres()};
ref.src='assets/img/spheres-reference.png';

/* ---------- layout ---------- */
const zones=[[670,250,75],[180,345,60],[470,400,55],[560,480,50],[300,215,85],[610,150,60]].map(z=>({ix:z[0],iy:z[1],ir:z[2],x:0,y:0,r:0,cool:0,glow:0,btn:null}));
zones.forEach((z,i)=>{const b=document.createElement('button');b.className='chime-hit';b.type='button';b.setAttribute('aria-label','Brush the wind chimes '+(i+1));b.addEventListener('click',()=>chime(z,1));gallery.appendChild(b);z.btn=b});
function resize(){
  const r=gallery.getBoundingClientRect();W=r.width;H=r.height;DPR=Math.min(devicePixelRatio||1,2);
  cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);
  S=Math.max(0.3,Math.min(W,H)/1024*0.65);
  const sc=Math.max(W/IMG.w,H/IMG.h),ox=(W-IMG.w*sc)/2,oy=(H-IMG.h*sc)*IMG.ay;
  zones.forEach(z=>{z.x=ox+z.ix*sc;z.y=oy+z.iy*sc;z.r=z.ir*sc;const vis=z.x>20&&z.x<W-20&&z.y>70&&z.y<H*0.8;z.vis=vis;z.btn.style.display=vis?'':'none';z.btn.style.left=z.x+'px';z.btn.style.top=z.y+'px'});
  if(!kb.x){kb.x=W/2;kb.y=H/2}
}
addEventListener('resize',resize);

/* ---------- objects ---------- */
function mkBubble(x,y,r,o={}){
  const b={t:'b',x,y,r,vx:rand(-8,8)*S,vy:rand(-10,-3)*S,z:rand(0.35,1),ph:[rand(0,6.3),rand(0,6.3),rand(0,6.3)],f:[rand(.08,.2),rand(.06,.16)],rise:rand(5,12),age:o.fade===false?9:0,pop:0,shim:0,wob:0,wph:rand(0,6.3),hue:rand(0,6.3),follow:null,life:o.life||0,target:null,m:r*r};
  Object.assign(b,o);bubbles.push(b);return b}
function spawnBubble(fromEdge){
  const r=(rand(0,1)**2.3)*72*S*1.2+15*S;
  const x=rand(r,W-r),y=fromEdge?H+r+10:rand(H*.1,H*.85);
  return mkBubble(x,y,r)}
function initSpheres(){
  spheres.length=0;const n=W<640?2:3;
  const order=[3,0,5].slice(0,n);
  order.forEach((si,i)=>{const r=SRC[si][2]*S*0.5;const z=rand(0.28,0.5);
    spheres.push({t:'s',si,x:rand(r,W-r),y:rand(H*.15,H*.8),r,vx:rand(-6,6)*S,vy:rand(-4,4)*S,z,ph:[rand(0,6.3),rand(0,6.3)],f:[rand(.05,.11),rand(.04,.09)],m:r*r,held:false,rev:null})});
  // keep spheres off each other at start
  for(let k=0;k<40;k++)collide(0,true)}
function targetBubbles(){return W<640?15:26}
function initBubbles(){bubbles.length=0;const n=targetBubbles();for(let i=0;i<n;i++){const b=spawnBubble(false);b.age=1}}

/* ---------- audio ---------- */
const A={ctx:null,on:false,muted:false,buf:{},voices:{chime:0,bubble:0},lastB:0,lastC:0,master:null,bus:{}};
const sndBtn=$('#snd'),sndLbl=$('#sndl');
async function loadBuf(name,url){try{const r=await fetch(url);const ab=await r.arrayBuffer();A.buf[name]=await new Promise((res,rej)=>A.ctx.decodeAudioData(ab,res,rej))}catch(e){console.warn('audio decode unavailable, using media element',name,e);A.buf[name]=null;A.url=A.url||{};A.url[name]=url}}
async function startAudio(){
  if(A.ctx)return;
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  A.ctx=new AC();const c=A.ctx;
  A.master=c.createGain();A.master.gain.value=0;
  const comp=c.createDynamicsCompressor();comp.threshold.value=-10;comp.knee.value=4;comp.ratio.value=20;comp.attack.value=.003;comp.release.value=.18;
  A.comp=comp;A.master.connect(comp);comp.connect(c.destination);
  A.bus.chime=c.createGain();A.bus.chime.gain.value=.06;A.bus.chime.connect(A.master);
  A.bus.bubble=c.createGain();A.bus.bubble.gain.value=4.5;A.bus.bubble.connect(A.master);
  A.on=true;
  await c.resume();
  A.master.gain.setTargetAtTime(.9,c.currentTime,.4);
  await Promise.all([loadBuf('chime','assets/audio/windchimes.mp3'),loadBuf('bubble','assets/audio/bubbles.mp3')]);
  analyse();setTimeout(()=>play('bubble',.5,3.2,.6),500);
  scheduleAmbient();
}
function playEl(kind,vol,dur,fade){
  const max=kind==='chime'?2:3;if(A.voices[kind]>=max)return false;
  const a=new Audio(A.url[kind]);a.volume=0;A.voices[kind]++;
  const go=()=>{const total=a.duration||30;dur=Math.min(dur,total-.6);a.currentTime=rand(0,total-dur-.2);const t0=performance.now();a.play().catch(()=>{});
    const iv=setInterval(()=>{const t=(performance.now()-t0)/1000;const fi=Math.min(fade,dur*.4),fo=Math.min(fade*1.6,dur*.55);
      const e=Math.min(t/fi,1,Math.max(0,(dur-t)/fo));a.volume=A.muted?0:clamp(vol*.6*e,0,1);
      if(t>=dur){clearInterval(iv);a.pause();A.voices[kind]--}},50)};
  a.readyState>0?go():a.addEventListener('loadedmetadata',go,{once:true});return true}
function analyse(){const b=A.buf.bubble;if(!b)return;const d=b.getChannelData(0),sr=b.sampleRate,w=Math.floor(sr*.3),hop=Math.floor(sr*.1),r=[];
  for(let i=0;i+w<d.length;i+=hop){let s=0;for(let k=0;k<w;k+=4)s+=d[i+k]*d[i+k];r.push([i/sr,Math.sqrt(s/(w/4))])}
  const sorted=r.map(x=>x[1]).sort((a,b)=>a-b),med=sorted[sorted.length>>1];A.loud=r.filter(x=>x[1]>med*1.15).map(x=>x[0]);A.rms=med}
function play(kind,vol,dur,fade){
  if(!A.on||A.muted)return false;
  if(!A.buf[kind]&&A.url&&A.url[kind])return playEl(kind,vol,dur,fade);
  if(!A.buf[kind])return false;
  const max=kind==='chime'?2:5;if(A.voices[kind]>=max)return false;
  const c=A.ctx,buf=A.buf[kind];dur=Math.min(dur,buf.duration-.5);
  let off=rand(0,buf.duration-dur-.1);
  if(kind==='bubble'&&A.loud&&A.loud.length){const c2=A.loud.filter(t=>t<buf.duration-dur-.1);if(c2.length)off=c2[0|Math.random()*c2.length]}
  const src=c.createBufferSource();src.buffer=buf;
  const g=c.createGain(),t=c.currentTime,fi=Math.min(fade,dur*.4),fo=Math.min(fade*1.6,dur*.55);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+fi);g.gain.setValueAtTime(vol,t+dur-fo);g.gain.linearRampToValueAtTime(0,t+dur);
  src.connect(g);g.connect(A.bus[kind]);src.start(t,off,dur+.05);
  A.voices[kind]++;src.onended=()=>{A.voices[kind]--;g.disconnect()};return true}
function bubbleSound(vol,dur){const n=performance.now();if(n-A.lastB<140)return;if(play('bubble',vol,dur||rand(1.2,2.2),.25))A.lastB=n}
function chimeSound(){const n=performance.now();if(n-A.lastC<1500)return;if(play('chime',rand(.3,.5),rand(4,6.5),1.1))A.lastC=n}
function scheduleAmbient(){setTimeout(()=>{if(!document.hidden)play('bubble',.2,rand(3,4.5),1.2);scheduleAmbient()},rand(16000,32000))}
sndBtn.addEventListener('click',async()=>{
  if(!A.ctx){await startAudio();sndLbl.textContent='Sound on';sndBtn.setAttribute('aria-pressed','true');return}
  A.muted=!A.muted;A.master.gain.setTargetAtTime(A.muted?0:.9,A.ctx.currentTime,.25);
  sndLbl.textContent=A.muted?'Sound off':'Sound on';sndBtn.setAttribute('aria-pressed',String(!A.muted))});

/* ---------- motion toggle ---------- */
const motBtn=$('#mot'),motL=$('#motl');
function showMot(){motL.textContent=calm?'Still':'Drifting';motBtn.setAttribute('aria-pressed',String(!calm))}
motBtn.addEventListener('click',()=>{calm=!calm;showMot()});mq.addEventListener&&mq.addEventListener('change',e=>{calm=e.matches;showMot()});showMot();

/* ---------- interactions ---------- */
function say(t){$('#live').textContent=t}
function ripple(x,y){fx.push({k:'ring',x,y,r0:6*S,r1:70*S+30,t:0,d:1.6,a:.5,w:2})}
function chime(z,force){
  if(z.cool>0&&!force)return;z.cool=2.5;z.glow=1;chimeSound();
  for(let i=0;i<6;i++)fx.push({k:'spark',x:z.x+rand(-z.r,z.r)*.7,y:z.y+rand(-z.r,z.r)*.9,t:-rand(0,.7),d:1.4,s:rand(2,4.5)*Math.max(.8,S)});
}
function popBubble(b,divide){
  if(b.pop)return;
  for(let i=0;i<(divide?4:10);i++){const a=rand(0,6.3),sp=rand(30,110)*Math.max(.7,S);fx.push({k:'drop',x:b.x+Math.cos(a)*b.r*.9,y:b.y+Math.sin(a)*b.r*.9,vx:Math.cos(a)*sp+b.vx*.3,vy:Math.sin(a)*sp+b.vy*.3,t:0,d:rand(.7,1.3),s:rand(1.4,3.2)*Math.max(.8,S),h:rand(0,6.3)})}
  if(divide&&b.r>22*S&&bubbles.length<20){
    const n=Math.random()<.5?2:3;b.pop=.001;b.divide=true;
    for(let i=0;i<n;i++){const a=rand(0,6.3)+i*6.28/n,r=b.r*rand(.38,.52);const c=mkBubble(b.x+Math.cos(a)*b.r*.4,b.y+Math.sin(a)*b.r*.4,r,{z:b.z,vx:b.vx+Math.cos(a)*40*S,vy:b.vy+Math.sin(a)*40*S,age:.6});c.shim=1}
    bubbleSound(.6,rand(1.2,1.8));say('A bubble divided into smaller bubbles.')
  }else{b.pop=.001;fx.push({k:'ring',x:b.x,y:b.y,r0:b.r,r1:b.r*1.5,t:0,d:.7,a:.35,w:1.5});bubbleSound(.6,rand(.9,1.5));say('A bubble popped softly.')}
}
function touchBubble(o){
  const r=Math.random(),big=o.r>22*S&&bubbles.length<34;o.shim=1;o.wob=1;
  if(r<.3)popBubble(o,false);
  else if(r<.55&&big)popBubble(o,true);
  else{const dx=o.x-(ptr.x>-900?ptr.x:o.x),dy=o.y-(ptr.y>-900?ptr.y:o.y)+.01,d=Math.hypot(dx,dy)||1;o.vx+=dx/d*(r<.8?170:70)*S+rand(-20,20)*S;o.vy+=dy/d*(r<.8?170:70)*S;bubbleSound(.3,rand(1,1.6));say('A bubble drifted away.')}
}
function dr(o){return o.r*(0.78+0.22*o.z)}
function hit(x,y){
  let best=null;
  for(const o of bubbles){if(o.pop)continue;const d=Math.hypot(o.x-x,o.y-y);if(d<dr(o)+6&&(!best||o.z>best.z))best=o}
  if(best)return best;
  for(const o of spheres){if(Math.hypot(o.x-x,o.y-y)<dr(o)&&(!best||o.z>best.z))best=o}
  return best}
function press(x,y,id){
  const o=hit(x,y);
  if(o){drag={o,id,ox:o.x-x,oy:o.y-y,sx:x,sy:y,moved:false,t0:performance.now(),hist:[{x:o.x,y:o.y,t:performance.now()}]};o.held=true;o.rev=null;o.follow=null;o.target=null;o.vx=o.vy=0;stage.style.cursor='grabbing'}
  else{ripple(x,y);if(Math.random()<.35)bubbleSound(.25,1.2)}
}
function release(){
  if(!drag)return;const o=drag.o,h=drag.hist,l=h[h.length-1],f=h.find(p=>l.t-p.t<120)||h[0];
  const dt=Math.max(.016,(l.t-f.t)/1000);o.vx=clamp((l.x-f.x)/dt,-700,700)*.6;o.vy=clamp((l.y-f.y)/dt,-700,700)*.6;
  const tap=!drag.moved&&(drag.id==='kb'||performance.now()-drag.t0<400);
  o.held=false;drag=null;stage.style.cursor='default';
  if(tap&&o.t==='b'){o.vx=o.vy=0;touchBubble(o)}}
function local(e){const r=stage.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]}
stage.addEventListener('pointerdown',e=>{kb.on=false;const[x,y]=local(e);ptr.x=x;ptr.y=y;ptr.inside=true;ptr.vx=ptr.vy=0;stage.setPointerCapture(e.pointerId);press(x,y,e.pointerId)});
stage.addEventListener('pointermove',e=>{const[x,y]=local(e),n=performance.now(),dt=Math.max(.008,(n-ptr.t)/1000);
  ptr.vx=ptr.vx*.6+(x-ptr.x)/dt*.4;ptr.vy=ptr.vy*.6+(y-ptr.y)/dt*.4;ptr.x=x;ptr.y=y;ptr.t=n;ptr.inside=true;
  if(drag&&drag.id===e.pointerId){drag.tx=x+drag.ox;drag.ty=y+drag.oy;if(Math.hypot(x-drag.sx,y-drag.sy)>8)drag.moved=true}
  else if(!drag&&e.pointerType==='mouse'){const o=hit(x,y);stage.style.cursor=o?(o.t==='s'?'grab':'pointer'):'default'}});
const end=e=>{if(drag&&drag.id===e.pointerId)release()};
stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
stage.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){ptr.inside=false;ptr.x=-999}});
stage.addEventListener('keydown',e=>{
  const step=(e.shiftKey?70:28);let m=true;
  if(e.key==='ArrowLeft')kb.x-=step;else if(e.key==='ArrowRight')kb.x+=step;else if(e.key==='ArrowUp')kb.y-=step;else if(e.key==='ArrowDown')kb.y+=step;
  else if(e.key==='Enter'||e.key===' '){if(drag&&drag.id==='kb')release();else press(kb.x,kb.y,'kb')}
  else if(e.key==='Escape'){release()}else m=false;
  if(m){e.preventDefault();kb.on=true;kb.x=clamp(kb.x,0,W);kb.y=clamp(kb.y,0,H);ptr.x=kb.x;ptr.y=kb.y;ptr.inside=true;ptr.vx=ptr.vy=0;
    if(drag&&drag.id==='kb'){drag.tx=kb.x+drag.ox;drag.ty=kb.y+drag.oy;drag.moved=true}}});
stage.addEventListener('blur',()=>{kb.on=false;release()});

/* ---------- physics ---------- */
function collide(dt,instant){
  for(let i=0;i<spheres.length;i++)for(let j=i+1;j<spheres.length;j++){
    const a=spheres[i],b=spheres[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.01,min=a.r+b.r;
    if(d<min){const nx=dx/d,ny=dy/d,ov=min-d,k=instant?1:Math.min(1,dt*6);
      const wa=a.held?0:b.m/(a.m+b.m),wb=b.held?0:a.m/(a.m+b.m);
      a.x-=nx*ov*wa*k;a.y-=ny*ov*wa*k;b.x+=nx*ov*wb*k;b.y+=ny*ov*wb*k;
      if(instant)continue;
      const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
      if(rv<0){const imp=-(1+.55)*rv/(1/a.m+1/b.m);if(!a.held){a.vx-=imp*nx/a.m;a.vy-=imp*ny/a.m}if(!b.held){b.vx+=imp*nx/b.m;b.vy+=imp*ny/b.m}}}}}
function collideBubbles(dt){
  const n=bubbles.length,k=Math.min(1,dt*7);
  for(let i=0;i<n;i++){const a=bubbles[i];if(a.pop)continue;for(let j=i+1;j<n;j++){const b=bubbles[j];if(b.pop||(a.held&&b.held)||Math.abs(a.z-b.z)>.55)continue;
    const dx=b.x-a.x,dy=b.y-a.y,m=dr(a)+dr(b);if(Math.abs(dx)>m||Math.abs(dy)>m)continue;const d=Math.hypot(dx,dy)||.01;
    if(d<m){const nx=dx/d,ny=dy/d,ov=m-d,ia=a.held?0:1/a.m,ib=b.held?0:1/b.m,sum=ia+ib;if(!sum)continue;
      a.x-=nx*ov*(ia/sum)*k;a.y-=ny*ov*(ia/sum)*k;b.x+=nx*ov*(ib/sum)*k;b.y+=ny*ov*(ib/sum)*k;
      const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
      if(rv<0){const imp=-(1.75)*rv/sum;a.vx-=imp*nx*ia;a.vy-=imp*ny*ia;b.vx+=imp*nx*ib;b.vy+=imp*ny*ib;const w=Math.min(1,-rv/(160*S));a.wob=Math.max(a.wob,w);b.wob=Math.max(b.wob,w);if(w>.5){a.shim=Math.max(a.shim,.6);b.shim=Math.max(b.shim,.6);bubbleSound(.28+.2*w,rand(.7,1.1))}}}}}}
function wall(o,dt,soft){
  const r=dr(o),m=r+10;
  if(o.x<m)o.vx+=(m-o.x)*soft*dt;if(o.x>W-m)o.vx-=(o.x-(W-m))*soft*dt;
  if(o.t==='s'){if(o.y<m)o.vy+=(m-o.y)*soft*dt;if(o.y>H-m)o.vy-=(o.y-(H-m))*soft*dt}}
function pushFrom(o,dt){
  if(!ptr.inside||drag)return;const dx=o.x-ptr.x,dy=o.y-ptr.y,d=Math.hypot(dx,dy)||1,R=dr(o)+(o.t==='b'?80:46)*S+10;
  if(d<R){const sp=Math.min(Math.hypot(ptr.vx,ptr.vy),1400),f=(1-d/R);
    const str=(o.t==='b'?(40+sp*.55):(10+sp*.2))*f*dt*60/60*(o.t==='b'?3.2:1.4);
    o.vx+=dx/d*str+ptr.vx*.0008*f*(o.t==='b'?1:.5)*60*dt;o.vy+=dy/d*str+ptr.vy*.0008*f*(o.t==='b'?1:.5)*60*dt;
    if(o.t==='b'){o.wob=Math.max(o.wob,Math.min(.8,f*sp/700));if(sp>120&&o.shim<.5){o.shim=1;bubbleSound(.22,rand(.9,1.4))}}}}
function step(dt){
  time+=dt;
  const still=calm;
  // dragged
  if(drag){const o=drag.o;if(drag.tx!==undefined){const px=o.x,py=o.y,nx=o.x+(drag.tx-o.x)*Math.min(1,dt*16),ny=o.y+(drag.ty-o.y)*Math.min(1,dt*16);o.x=nx;o.y=ny;o.vx=(nx-px)/dt;o.vy=(ny-py)/dt}
    drag.hist.push({x:o.x,y:o.y,t:performance.now()});if(drag.hist.length>12)drag.hist.shift();o.x=clamp(o.x,o.r,W-o.r);o.y=clamp(o.y,o.r,H-o.r)}
  for(const o of spheres){
    if(o.held)continue;
    const k=still?1.4:.35;
    const tx=still?0:Math.sin(time*o.f[0]*6.28+o.ph[0])*14*S,ty=still?0:Math.cos(time*o.f[1]*6.28+o.ph[1])*11*S;
    o.vx+=(tx-o.vx)*k*dt*(Math.hypot(o.vx,o.vy)>40*S?.45:1);o.vy+=(ty-o.vy)*k*dt*(Math.hypot(o.vx,o.vy)>40*S?.45:1);
    if(o.rev){o.rev.t+=dt;const p=Math.sin(Math.PI*clamp(o.rev.t/o.rev.d,0,1));o.vx+=o.rev.x*p*55*S*dt;o.vy+=o.rev.y*p*55*S*dt;if(o.rev.t>o.rev.d)o.rev=null}
    pushFrom(o,dt);wall(o,dt,2.2);
    const sp=Math.hypot(o.vx,o.vy),mx=520;if(sp>mx){o.vx*=mx/sp;o.vy*=mx/sp}
    o.x+=o.vx*dt;o.y+=o.vy*dt;o.x=clamp(o.x,o.r*.5,W-o.r*.5);o.y=clamp(o.y,o.r*.5,H-o.r*.5)}
  collide(dt);
  for(let i=bubbles.length-1;i>=0;i--){
    const o=bubbles[i];
    if(o.pop){o.pop+=dt/.5;if(o.pop>=1){bubbles.splice(i,1)}continue}
    o.age=Math.min(1,o.age+dt/2.5);o.shim=Math.max(0,o.shim-dt*.7);o.wob=Math.max(0,o.wob-dt*.45);
    if(o.held)continue;
    if(o.life){o.life-=dt;if(o.life<3)o.fadeOut=clamp(o.life/3,0,1);if(o.life<=0){bubbles.splice(i,1);continue}}
    const k=still?1.6:.55;
    let tx=still?0:Math.sin(time*o.f[0]*6.28+o.ph[0])*16*S,ty=still?0:-o.rise*S+Math.cos(time*o.f[1]*6.28+o.ph[1])*9*S;
    o.vx+=(tx-o.vx)*k*dt;o.vy+=(ty-o.vy)*k*dt;
    if(o.follow){if(o.follow.pop||time>o.followEnd)o.follow=null;else{const dx=o.follow.x-o.x,dy=o.follow.y+o.follow.r*1.4-o.y,d=Math.hypot(dx,dy)||1;if(d>o.r*1.6){o.vx+=dx/d*26*S*dt*4;o.vy+=dy/d*26*S*dt*4}}}
    if(o.target&&time<o.target.end){o.vx+=(o.target.x-o.x)*1.8*dt;o.vy+=(o.target.y-o.y)*1.8*dt;o.vx*=1-1.2*dt;o.vy*=1-1.2*dt}
    pushFrom(o,dt);wall(o,dt,1.6);
    const sp=Math.hypot(o.vx,o.vy),mx=380;if(sp>mx){o.vx*=mx/sp;o.vy*=mx/sp}
    o.x+=o.vx*dt;o.y+=o.vy*dt;
    if(o.y<-o.r*2.2&&!o.life){o.y=H+o.r+10;o.x=rand(o.r,W-o.r);o.age=0;o.vy=-5*S}
    if(o.y>H+o.r*3)o.y=H+o.r+5;
    if(o.x<-o.r*3||o.x>W+o.r*3)o.x=clamp(o.x,o.r,W-o.r);
    // bubble-sphere soft contact
    for(const s of spheres){const dx=o.x-s.x,dy=o.y-s.y,d=Math.hypot(dx,dy)||1,m=dr(o)+dr(s);if(d<m&&Math.abs(o.z-s.z)<.4){o.vx+=dx/d*(m-d)*3*dt;o.vy+=dy/d*(m-d)*3*dt}}
  }
  collideBubbles(dt);
  // regenerate
  if(bubbles.filter(b=>!b.pop&&!b.life).length<targetBubbles()&&time-lastSpawn>1.4){lastSpawn=time;const b=spawnBubble(Math.random()<.6);b.age=0;if(Math.random()<.5)bubbleSound(.18,1.1)}
  // chimes
  for(const z of zones){z.cool=Math.max(0,z.cool-dt);z.glow=Math.max(0,z.glow-dt/2.4);if(!z.vis||z.cool>0)continue;
    const pd=Math.hypot(ptr.x-z.x,ptr.y-z.y);if(ptr.inside&&pd<z.r&&Math.hypot(ptr.vx,ptr.vy)>260){chime(z);continue}
    for(const o of spheres.concat(bubbles)){if(o.pop)continue;if(Math.hypot(o.x-z.x,o.y-z.y)<z.r+dr(o)*.4&&Math.hypot(o.vx,o.vy)>14*S){chime(z);break}}}
  // effects
  for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.t+=dt;if(f.k==='drop'){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=1-2.2*dt;f.vy*=1-2.2*dt}if(f.t>=f.d)fx.splice(i,1)}
  // rare wonders
  if(!still&&time>nextWonder&&!drag){nextWonder=time+rand(16,30);wonder()}
  if(!still&&time>nextChime){nextChime=time+rand(28,55);const vz=zones.filter(z=>z.vis);if(vz.length)chime(vz[0|Math.random()*vz.length])}
}
function wonder(){
  const live=bubbles.filter(b=>!b.pop&&!b.life),r=Math.random();
  if(r<.3&&live.length>5){const c=live[0|Math.random()*live.length];const near=live.filter(b=>b!==c&&!b.held).sort((a,b)=>Math.hypot(a.x-c.x,a.y-c.y)-Math.hypot(b.x-c.x,b.y-c.y)).slice(0,5);
    near.forEach((b,i)=>{const a=i/near.length*6.28+rand(0,.5),d=c.r+b.r+6*S;b.target={x:c.x+Math.cos(a)*d,y:c.y+Math.sin(a)*d,end:time+4.5};b.shim=1});c.shim=1;say('A small group of bubbles is gathering.')}
  else if(r<.5&&live.length>3){const a=live[0|Math.random()*live.length];let b;do{b=live[0|Math.random()*live.length]}while(b===a);a.follow=b;a.followEnd=time+11;a.shim=1;say('One bubble is following another.')}
  else if(r<.7){const s=spheres[0|Math.random()*spheres.length];if(s&&!s.held){let sp=Math.hypot(s.vx,s.vy);const dx=sp>3?-s.vx/sp:rand(-1,1),dy=sp>3?-s.vy/sp:rand(-1,1),d=Math.hypot(dx,dy)||1;s.rev={x:dx/d,y:dy/d,t:0,d:6};say('A sphere is slowly reversing direction.')}}
  else if(bubbles.length<15){
    const n=5,cx=rand(W*.3,W*.7),cy=rand(H*.3,H*.55),R=Math.min(W,H)*.16;
    for(let i=0;i<n;i++){const a=Math.PI*(1.15+.7*i/(n-1));const b=mkBubble(cx+(i-2)*R*.45,H+30*S,rand(7,10)*S*1.2,{life:26,age:0,z:.9});b.target={x:cx+Math.cos(a)*R,y:cy+Math.sin(a)*R*.6,end:time+8}}
    say('A few small bubbles are forming an arc.');bubbleSound(.3,2)}
}

/* ---------- drawing ---------- */
function drawBubble(o){
  const r=dr(o),pf=o.pop?o.pop:0;
  let a=(.85+.15*o.z)*o.age*(o.fadeOut??1);let rr=r*(1+pf*.1);a*=1-pf;if(a<=.01)return;
  const px=(ptr.x>-900?(ptr.x-W/2):0)*(o.z-.6)*.018;
  ctx.save();ctx.globalAlpha=a;
  const wv=(o.wob*.11*Math.sin(time*9+o.wph)+.012*Math.sin(time*.9+o.wph*2))*(calm?.5:1);
  ctx.translate(o.x+px,o.y);ctx.scale(1+wv,1-wv);const x=0,y=0;
  const g=ctx.createRadialGradient(x-rr*.2,y-rr*.25,rr*.1,x,y,rr);
  g.addColorStop(0,'rgba(255,255,255,0.14)');g.addColorStop(.7,'rgba(255,250,240,0.2)');g.addColorStop(1,'rgba(255,244,228,0.55)');
  ctx.shadowColor='rgba(110,90,60,.32)';ctx.shadowBlur=rr*.25;ctx.shadowOffsetY=rr*.06;
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,rr,0,7);ctx.fill();ctx.shadowColor='transparent';
  const sh=.75+.25*o.shim;
  if(ctx.createConicGradient){
    const c=ctx.createConicGradient(o.hue+time*.08*(calm?0:1),x,y);
    c.addColorStop(0,`rgba(255,185,225,${sh})`);c.addColorStop(.25,`rgba(170,225,240,${sh})`);c.addColorStop(.5,`rgba(255,228,165,${sh})`);c.addColorStop(.75,`rgba(205,190,250,${sh})`);c.addColorStop(1,`rgba(255,185,225,${sh})`);
    ctx.strokeStyle=c}else ctx.strokeStyle=`rgba(230,205,235,${sh})`;
  ctx.lineWidth=Math.max(2.5,rr*.11);ctx.beginPath();ctx.arc(x,y,rr*.94,0,7);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,0.95)';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(x,y,rr,0,7);ctx.stroke();
  ctx.lineCap='round';ctx.strokeStyle='rgba(255,255,255,1)';ctx.lineWidth=Math.max(2,rr*.08);
  ctx.beginPath();ctx.arc(x,y,rr*.8,Math.PI*1.08,Math.PI*1.34);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,0.28)';ctx.lineWidth=Math.max(1,rr*.04);ctx.beginPath();ctx.arc(x,y,rr*.82,Math.PI*.12,Math.PI*.3);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.75)';ctx.beginPath();ctx.arc(x-rr*.42,y-rr*.5,Math.max(1.2,rr*.07),0,7);ctx.fill();
  ctx.restore()}
function drawSphere(o){
  const spr=sprites[o.si];if(!spr)return;const r=dr(o),px=(ptr.x>-900?(ptr.x-W/2):0)*(o.z-.6)*.018;
  ctx.save();
  ctx.globalAlpha=.8;
  ctx.shadowColor='rgba(110,92,62,.28)';ctx.shadowBlur=r*.35;ctx.shadowOffsetY=r*.12;ctx.shadowOffsetX=-r*.04;
  ctx.drawImage(spr,o.x+px-r,o.y-r,r*2,r*2);
  if(o.held){ctx.shadowColor='transparent';ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(o.x+px,o.y,r+4,0,7);ctx.stroke()}
  ctx.restore()}
function drawFx(){
  for(const f of fx){
    if(f.k==='ring'){const p=f.t/f.d,e=1-(1-p)**3,r=f.r0+(f.r1-f.r0)*e;ctx.strokeStyle=`rgba(255,252,242,${f.a*(1-p)})`;ctx.lineWidth=f.w*(1-p*.5)+.5;ctx.beginPath();ctx.arc(f.x,f.y,r,0,7);ctx.stroke();
      ctx.strokeStyle=`rgba(190,170,130,${f.a*.35*(1-p)})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(f.x,f.y,r*.86,0,7);ctx.stroke()}
    else if(f.k==='drop'){const p=f.t/f.d,a=(1-p)*(.55+.45*Math.sin(f.t*22+f.h));ctx.fillStyle=`rgba(255,250,238,${a*.85})`;ctx.beginPath();ctx.arc(f.x,f.y,f.s*(1-p*.5),0,7);ctx.fill();ctx.strokeStyle=`hsla(${(f.h*57+p*120)%360},70%,82%,${a*.5})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(f.x,f.y,f.s*(1.4-p*.5),0,7);ctx.stroke()}
    else if(f.k==='spark'&&f.t>0){const p=f.t/f.d,a=Math.sin(Math.PI*p);ctx.fillStyle=`rgba(255,246,220,${a*.9})`;ctx.beginPath();ctx.arc(f.x,f.y,f.s*(.6+.4*a),0,7);ctx.fill()}}
  for(const z of zones){if(z.glow>0&&z.vis){const g=ctx.createRadialGradient(z.x,z.y,0,z.x,z.y,z.r*1.5);g.addColorStop(0,`rgba(255,244,214,${.35*z.glow})`);g.addColorStop(1,'rgba(255,244,214,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(z.x,z.y,z.r*1.5,0,7);ctx.fill()}}
}
function draw(){
  ctx.clearRect(0,0,W,H);
  const all=spheres.concat(bubbles).sort((a,b)=>a.z-b.z);
  for(const o of all)o.t==='s'?drawSphere(o):drawBubble(o);
  drawFx();
  if(kb.on){ctx.strokeStyle='rgba(70,56,36,.7)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(kb.x,kb.y,16,0,7);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(kb.x,kb.y,19,0,7);ctx.stroke()}
}

/* ---------- loop ---------- */
let last=performance.now();
function frame(n){const dt=Math.min(.05,(n-last)/1000);last=n;if(!document.hidden){step(dt);draw()}requestAnimationFrame(frame)}
resize();initBubbles();
if(sprites.length)initSpheres();
requestAnimationFrame(frame);

window.__lab={play,bubbleSound,bubbles,spheres,zones,ptr,A,fx,press,release,popBubble,wonder,get drag(){return drag},step:(n)=>{for(let i=0;i<n;i++)step(1/60)},get time(){return time}};
})();
