(()=>{
'use strict';
const $=(s,r)=>(r||document).querySelector(s);
const IW=1821,IH=864;
const store={get(k,d){try{const v=localStorage.getItem('iur19b.'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('iur19b.'+k,JSON.stringify(v))}catch(e){}}};
const rm=matchMedia('(prefers-reduced-motion: reduce)');
let motion=store.get('motion',null);if(motion===null)motion=!rm.matches;
const hoverCapable=matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- characters (hotspot areas are image-relative; no dialogue) ---------- */
const CH={
 guard:{name:'The Nubian Guard',label:'The Guard',box:[60,205,230,515],toggle:false},
 madeleine:{name:'Madeleine',label:'Madeleine',box:[440,285,215,230],toggle:true},
 companion:{name:'Madeleine’s companion',label:'The Companion',box:[640,315,205,205],toggle:true},
 cop:{name:'The Policeman',label:'The Policeman',box:[990,350,320,365],toggle:false},
 pasar:{name:'Pasar',label:'Pasar',box:[1325,140,435,415],toggle:true}
};
const ORDER=['guard','madeleine','companion','cop','pasar'];

/* ---------- audio ---------- */
const FILES={guitar:'assets/audio/Baroque_Guitar.mp3',market:'assets/audio/ade_ade2024-school-crowd-indonesian-244632.mp3',whistle:'assets/audio/liecio-inhambu-whistle-bird-190067.mp3',coffee:'assets/audio/freesound_community-coffee-shop-chatter-61978.mp3',om:'assets/audio/om-chant.mp3'};
const LV={guitar:.5,guitarDuck:.3,coffee:.85,market:.4,whistle:.55,om:.8};
const AU={ctx:null,master:null,g:{},buf:{},src:{},stopT:{},amb:null,muted:false,vol:store.get('vol',70)/100,entered:false,whistling:false,loading:{}};
const snd=$('#snd'),vol=$('#vol'),retry=$('#retry');vol.value=Math.round(AU.vol*100);
function now(){return AU.ctx.currentTime}
function fade(k,v,t){const p=AU.g[k].gain;p.cancelScheduledValues(now());p.setValueAtTime(p.value,now());p.setTargetAtTime(v,now(),t/3)}
function applyMaster(instant){if(!AU.master)return;const p=AU.master.gain,v=AU.muted?0:AU.vol;p.cancelScheduledValues(now());if(instant||AU.muted)p.setValueAtTime(v,now());else p.setTargetAtTime(v,now(),.15)}
function ui(){snd.setAttribute('aria-pressed',String(AU.muted));snd.setAttribute('aria-label',AU.muted?'Sound off. Select to unmute.':'Sound on. Select to mute.');$('#xmark').style.display=AU.muted?'':'none';$('#wave').style.display=AU.muted?'none':''}
async function loadBuf(k){if(AU.buf[k])return AU.buf[k];if(AU.loading[k])return AU.loading[k];AU.loading[k]=fetch(FILES[k]).then(r=>{if(!r.ok)throw new Error(k+' '+r.status);return r.arrayBuffer()}).then(b=>AU.ctx.decodeAudioData(b)).then(b=>(AU.buf[k]=b));try{return await AU.loading[k]}finally{AU.loading[k]=null}}
function startLoop(k){clearTimeout(AU.stopT[k]);if(AU.src[k])return;const s=AU.ctx.createBufferSource();s.buffer=AU.buf[k];s.loop=true;s.connect(AU.g[k]);s.start();AU.src[k]=s}
function endLoop(k,ms){clearTimeout(AU.stopT[k]);AU.stopT[k]=setTimeout(()=>{const s=AU.src[k];if(s&&AU.amb!==k||k==='guitar'&&false){try{s.stop()}catch(e){}AU.src[k]=null}},ms+120)}
function duck(on,k){if(AU.g.guitar&&AU.src.guitar)fade('guitar',on?(k==='coffee'?.02:k==='om'?.06:LV.guitarDuck):LV.guitar,.8)}
async function initAudio(){
 try{
  const AC=window.AudioContext||window.webkitAudioContext;AU.ctx=new AC();AU.master=AU.ctx.createGain();AU.master.gain.value=AU.muted?0:AU.vol;const lim=AU.ctx.createDynamicsCompressor();lim.threshold.value=-8;lim.knee.value=6;lim.ratio.value=12;lim.attack.value=.003;lim.release.value=.2;AU.master.connect(lim);lim.connect(AU.ctx.destination);
  for(const k in FILES){AU.g[k]=AU.ctx.createGain();AU.g[k].gain.value=0;AU.g[k].connect(AU.master)}
  await AU.ctx.resume();
  await loadBuf('guitar');startLoop('guitar');fade('guitar',LV.guitar,2);
  retry.hidden=AU.ctx.state==='running';
  ['coffee','market','whistle','om'].forEach(k=>loadBuf(k).catch(()=>{}));
 }catch(e){retry.hidden=false;AU.err=String(e)}
}
retry.addEventListener('click',async()=>{try{if(!AU.ctx)await initAudio();else{await AU.ctx.resume();if(!AU.src.guitar){await loadBuf('guitar');startLoop('guitar');fade('guitar',LV.guitar,1.5)}}retry.hidden=AU.ctx&&AU.ctx.state==='running'&&!!AU.src.guitar}catch(e){retry.hidden=false}});
async function ambient(k){if(AU.entered)setLive(k==='market');if(!AU.ctx||!AU.entered||AU.amb===k)return;const prev=AU.amb;AU.amb=k;if(prev){fade(prev,0,.6);endLoop(prev,700)}
 try{await loadBuf(k)}catch(e){return}
 if(AU.amb!==k)return;startLoop(k);fade(k,LV[k],.9);duck(true,k)}
function stopAmbient(k){if(k==='market')setLive(false);if(!AU.ctx||AU.amb!==k)return;AU.amb=null;fade(k,0,.8);endLoop(k,900);duck(false)}
async function whistle(){if(!AU.ctx||!AU.entered||AU.whistling)return;try{await loadBuf('whistle')}catch(e){return}AU.whistling=true;const s=AU.ctx.createBufferSource();s.buffer=AU.buf.whistle;s.connect(AU.g.whistle);AU.g.whistle.gain.cancelScheduledValues(now());AU.g.whistle.gain.setValueAtTime(0,now());AU.g.whistle.gain.linearRampToValueAtTime(LV.whistle,now()+.04);s.onended=()=>{AU.whistling=false};s.start()}
snd.addEventListener('click',()=>{AU.muted=!AU.muted;store.set('muted',AU.muted);applyMaster(true);ui()});
vol.addEventListener('input',()=>{AU.vol=vol.value/100;store.set('vol',vol.value);if(AU.muted&&AU.vol>0){AU.muted=false;store.set('muted',false);ui()}applyMaster()});
ui();

/* ---------- panorama viewer ---------- */
const stage=$('#stage'),pano=$('#pano');
let vw=1,vh=1,fit=1,z=1,cx=IW/2,cy=IH/2,dragged=false;
function measure(){vw=stage.clientWidth;vh=stage.clientHeight;fit=Math.min(vw/IW,vh/IH);render(false)}
function clampC(){const s=fit*z;const hw=vw/2/s,hh=vh/2/s;cx=IW*s<=vw?IW/2:Math.max(hw,Math.min(IW-hw,cx));cy=IH*s<=vh?IH/2:Math.max(hh,Math.min(IH-hh,cy))}
function render(anim){clampC();const s=fit*z;pano.classList.toggle('anim',!!anim&&motion);pano.style.transform=`translate(${vw/2-cx*s}px,${vh/2-cy*s}px) scale(${s})`;pano.style.setProperty('--z',s);$('#spots').style.setProperty('--z',s);document.querySelectorAll('.spot').forEach(b=>b.style.setProperty('--z',s))}
function setZ(nz,anim,ax,ay){const old=fit*z;nz=Math.max(1,Math.min(4,nz));if(ax!=null){const px=cx+(ax-vw/2)/old,py=cy+(ay-vh/2)/old;z=nz;const ns=fit*z;cx=px-(ax-vw/2)/ns;cy=py-(ay-vh/2)/ns}else z=nz;render(anim)}
function whole(){z=1;cx=IW/2;cy=IH/2;render(true)}
function focusOn(box){const s=fit*z;const bx=box[0]+box[2]/2,by=box[1]+box[3]/2;const hw=vw/2/s,hh=vh/2/s;let nx=cx,ny=cy;if(bx<cx-hw*.8||bx>cx+hw*.8)nx=bx;if(by<cy-hh*.8||by>cy+hh*.8)ny=by;if(nx!==cx||ny!==cy){cx=nx;cy=ny;render(true)}}
$('#zin').onclick=()=>setZ(z*1.5,true);$('#zout').onclick=()=>setZ(z/1.5,true);$('#whole').onclick=whole;
addEventListener('resize',measure);
const ptrs=new Map();let pinch0=0,z0=1,sx=0,sy=0,cx0=0,cy0=0,moved=0;
stage.addEventListener('pointerdown',e=>{if(e.button>0)return;ptrs.set(e.pointerId,[e.clientX,e.clientY]);if(ptrs.size===1){sx=e.clientX;sy=e.clientY;cx0=cx;cy0=cy;moved=0;dragged=false}if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch0=Math.hypot(a[0]-b[0],a[1]-b[1]);z0=z}});
stage.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,[e.clientX,e.clientY]);const s=fit*z;
 if(ptrs.size===2){const [a,b]=[...ptrs.values()];const d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch0){const r=stage.getBoundingClientRect();dragged=true;setZ(z0*d/pinch0,false,(a[0]+b[0])/2-r.left,(a[1]+b[1])/2-r.top)}return}
 const dx=e.clientX-sx,dy=e.clientY-sy;moved=Math.max(moved,Math.hypot(dx,dy));if(moved>6){if(!dragged){stage.classList.add('drag');stage.setPointerCapture&&stage.setPointerCapture(e.pointerId);$('#stagehint').style.opacity=0}dragged=true;cx=cx0-dx/s;cy=cy0-dy/s;render(false)}});
const up=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)pinch0=0;if(!ptrs.size){stage.classList.remove('drag');setTimeout(()=>dragged=false,60)}};
stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);
stage.addEventListener('wheel',e=>{if(e.ctrlKey){e.preventDefault();const r=stage.getBoundingClientRect();setZ(z*Math.exp(-e.deltaY*.01),false,e.clientX-r.left,e.clientY-r.top)}},{passive:false});
stage.addEventListener('keydown',e=>{if(e.target!==stage)return;const s=fit*z,st=90/s;let h=true;
 if(e.key==='ArrowLeft'){cx-=st;render(false)}else if(e.key==='ArrowRight'){cx+=st;render(false)}else if(e.key==='ArrowUp'){cy-=st;render(false)}else if(e.key==='ArrowDown'){cy+=st;render(false)}
 else if(e.key==='+'||e.key==='='){setZ(z*1.25,true)}else if(e.key==='-'||e.key==='_'){setZ(z/1.25,true)}else if(e.key==='0'||e.key==='Home'){whole()}else h=false;
 if(h)e.preventDefault()});

/* ---------- hotspots ---------- */
const spots={};
ORDER.forEach(id=>{const c=CH[id],b=document.createElement('button');b.type='button';b.className='spot';b.dataset.label=c.label;b.setAttribute('aria-label',c.toggle?`${c.name}. Select to start or stop its sound.`:(id==='cop'?`${c.name}. Select to hear his whistle.`:`${c.name}.`));if(c.toggle)b.setAttribute('aria-pressed','false');
 b.style.cssText=`left:${c.box[0]/IW*100}%;top:${c.box[1]/IH*100}%;width:${c.box[2]/IW*100}%;height:${c.box[3]/IH*100}%`;
 b.addEventListener('click',()=>{if(dragged)return;select(id)});
 b.addEventListener('focus',()=>{focusOn(c.box);if(id==='pasar')marketOn()});b.addEventListener('blur',()=>{if(id==='pasar')marketOff()});
 if(id==='pasar'&&hoverCapable){b.addEventListener('mouseenter',marketOn);b.addEventListener('mouseleave',()=>{if(document.activeElement!==b)marketOff()})}
 $('#spots').appendChild(b);spots[id]=b});

/* ---------- Pasar: living painting (aligned overlay cut from the approved panorama) ---------- */
const fx=document.createElement('div');fx.id='pasarfx';fx.className='rest';fx.setAttribute('aria-hidden','true');
{ // [x,y,w,h,anim,origin,duration,delay]
 const L=[
  [1639,297,30,32,'pnod','50% 95%',4.6,-1],[1683,291,30,42,'pnod','50% 95%',5.4,-2.5],[1679,357,26,28,'pnod','50% 95%',3.9,-.6],[1712,357,26,28,'pnod','50% 95%',5.8,-3],
  [1636,380,32,32,'pnod','50% 95%',4.2,-2],[1589,329,28,32,'pnod','50% 95%',5,-1.2],[1564,292,28,30,'pnod','50% 95%',6,-4],[1544,275,28,28,'pnod','50% 95%',4.4,-3.3],
  [1494,349,30,30,'pnod','50% 95%',3.8,-.3],[1524,346,28,28,'pnod','50% 95%',5.2,-2.2],[1481,305,30,28,'pnod','50% 95%',4.7,-3.8],[1392,327,24,26,'pnod','50% 95%',5.5,-1.8],
  [1355,345,22,24,'pnod','50% 95%',6.2,-4.5],[1331,337,22,24,'pnod','50% 95%',4.9,-.9],[1351,424,26,28,'pnod','50% 95%',5.1,-2.7],[1491,404,26,28,'pnod','50% 95%',4.5,-3.5],[1495,269,24,26,'pnod','50% 95%',5.7,-1.4],
  [1457,322,26,68,'psway','50% 100%',6.6,-2.1],[1417,340,34,56,'psway','50% 100%',5.3,-3.1],[1598,419,26,36,'pbob','50% 50%',3.4,-.8],[1538,462,34,34,'pbob','50% 100%',4.8,-2.6],
  [1417,257,50,70,'pshift','50% 100%',7.2,-3],[1613,268,36,48,'pshift','50% 100%',8,-5],[1370,457,28,36,'pbob','50% 100%',4.1,-1.9],
  [1695,486,52,50,'ppeck','55% 90%',8.5,-2],[1670,438,32,52,'pdangle','60% 4%',3.6,-.5],[1725,414,22,30,'ppeck','50% 100%',9.5,-6]];
 for(const [x,y,w,h,an,o,d,dl] of L){const e=document.createElement('i');e.style.cssText=`left:${x}px;top:${y}px;width:${w}px;height:${h}px;background-position:${-x}px ${-y}px;transform-origin:${o};animation-name:${an};animation-duration:${d}s;animation-delay:${dl}s`;fx.appendChild(e)}
}
$('#pano').insertBefore(fx,$('#spots'));
let liveT=0,rampT=0,amp=0;
function ramp(to,ms){clearInterval(rampT);const from=amp,t0=Date.now();rampT=setInterval(()=>{const p=Math.min(1,(Date.now()-t0)/ms),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;amp=from+(to-from)*e;fx.style.setProperty('--amp',amp.toFixed(3));if(p>=1){clearInterval(rampT);if(to===0)fx.classList.add('rest')}},40)}
function setLive(on){clearTimeout(liveT);if(on){fx.classList.remove('rest');fx.classList.add('live');ramp(motion?1:0,2400)}else{fx.classList.remove('live');ramp(0,1600)}}
let pasarSel=false;
/* ---------- selection (sound + animation only) ---------- */
let sel=null,art=null;
const panel=$('#artinfo');
const isWomen=id=>id==='madeleine'||id==='companion';
function showArt(id){art=id;panel.hidden=false;panel.querySelectorAll('[data-art]').forEach(p=>{p.hidden=p.dataset.art!==id})}
function hideArt(){art=null;panel.hidden=true;panel.querySelectorAll('[data-art]').forEach(p=>{p.hidden=true})}
function mark(){for(const k in spots){const on=(isWomen(k)&&sel==='women')||(k==='pasar'&&pasarSel);if(CH[k].toggle)spots[k].setAttribute('aria-pressed',String(on));spots[k].classList.toggle('cur',art===k||on)}}
let guardSel=false;
function leave(){if(guardSel){guardSel=false;stopAmbient('om')}if(sel==='women'){sel=null;stopAmbient('coffee')}if(pasarSel){pasarSel=false;if(!marketTouch)stopAmbient('market')}}
function select(id){
 const same=art===id||(isWomen(id)&&sel==='women');
 leave();
 if(same){hideArt();mark();return}
 if(isWomen(id)){sel='women';ambient('coffee')}
 else if(id==='pasar'){pasarSel=true;marketOn()}
 else if(id==='guard'){guardSel=true;ambient('om')}
 else if(id==='cop')whistle();
 showArt(id);mark()}
$('#artclose').addEventListener('click',()=>{leave();hideArt();mark()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&art){leave();hideArt();mark()}});
/* ---------- market ambience ---------- */
let marketTouch=false;
const mbtn=$('#market');if(!hoverCapable)mbtn.hidden=false;
function syncMarketBtn(){mbtn.setAttribute('aria-pressed',String(marketTouch))}
function marketOn(){if(!AU.entered)return;if(sel==='women')sel=null;ambient('market');mark()}
function marketOff(){if(marketTouch||pasarSel)return;stopAmbient('market')}
mbtn.onclick=()=>{marketTouch=!marketTouch;syncMarketBtn();if(marketTouch)marketOn();else stopAmbient('market')};

/* ---------- motion toggle ---------- */
const mb=$('#motion');
function applyMotion(){document.body.classList.toggle('still',!motion);mb.setAttribute('aria-pressed',String(motion));mb.textContent=motion?'Motion: on':'Motion: off'}
mb.onclick=()=>{motion=!motion;store.set('motion',motion);applyMotion()};
rm.addEventListener&&rm.addEventListener('change',e=>{if(e.matches){motion=false;applyMotion()}});
applyMotion();
// dust motes in lit areas (image-relative)
{const zones=[[430,150,230,330],[1360,80,380,200],[820,430,110,90],[10,120,120,300]];const host=$('#motes');host.style.cssText='position:absolute;inset:0;pointer-events:none';
 for(let i=0;i<16;i++){const zn=zones[i%zones.length];const m=document.createElement('span');m.className='mote';const sz=3+Math.random()*4;m.style.cssText=`left:${(zn[0]+Math.random()*zn[2])/IW*100}%;top:${(zn[1]+Math.random()*zn[3])/IH*100}%;width:${sz}px;height:${sz}px;--dx:${(Math.random()*40-20).toFixed(0)}px;--dy:${(-20-Math.random()*40).toFixed(0)}px;animation-duration:${(9+Math.random()*9).toFixed(1)}s;animation-delay:${(-Math.random()*14).toFixed(1)}s`;host.appendChild(m)}}

/* ---------- entrance sky: twinkling stars + moon ---------- */
{const f=$('#eframe');let s=7;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};
 const m=document.createElement('i');m.className='moon';m.style.cssText='left:70.5%;top:12%';f.appendChild(m);
 for(let i=0;i<46;i++){const x=29.5+r()*41,y=11+r()*58;if(Math.hypot(x-70.5,(y-12)*1.9)<5)continue;
  const e=document.createElement('i');e.className='star';const z=.28+r()*.5;
  e.style.cssText=`left:${x.toFixed(2)}%;top:${y.toFixed(2)}%;width:${z}cqw;height:${z}cqw;animation-delay:-${(r()*7).toFixed(2)}s;animation-duration:${(3.2+r()*4.2).toFixed(2)}s;--lo:${(.12+r()*.2).toFixed(2)};--hi:${(.55+r()*.4).toFixed(2)}`;f.appendChild(e)}}
/* ---------- entrance flames (glow + flicker only) ---------- */
{const f=$('#eframe');const P=[[170,203],[139,248],[100,266],[211,262],[245,298],[1585,203],[1620,250],[1541,268],[1571,258],[1656,276],[1506,299]];
 P.forEach((p,i)=>{const l=p[0]/1748*100+'%',t=p[1]/899*100+'%',d=(-(i*.73)%3.4).toFixed(2);
  const g=document.createElement('i');g.className='gl';g.style.cssText=`left:${l};top:${t};animation-delay:${d}s`;f.appendChild(g);
  const fl=document.createElement('i');fl.className='fl';fl.style.cssText=`left:${l};top:${p[1]/899*100-1.1}%;animation-delay:${d}s;animation-duration:${(2.5+(i%4)*.35).toFixed(2)}s`;f.appendChild(fl)})}
/* ---------- entrance ---------- */
const entr=$('#entrance'),museum=$('#museum');
$('#enter').addEventListener('click',()=>{AU.entered=true;museum.hidden=false;measure();setTimeout(()=>{museum.classList.add('on');entr.classList.add('gone')},40);setTimeout(()=>{entr.style.display='none';stage.focus({preventScroll:true});},1500);
 initAudio();setTimeout(()=>{$('#stagehint').style.opacity=0},7000)});
document.body.style.overflowX='hidden';
window.__museum={AU,select,whole,setZ,get state(){return {z,cx,cy,fit,vw,vh,amb:AU.amb,sel,pasarSel,live:fx.className}}};
})();
