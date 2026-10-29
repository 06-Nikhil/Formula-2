
const $=id=>document.getElementById(id),tg=window.Telegram&&Telegram.WebApp,BOT='https://t.me/YOUR_BOT/YOUR_APP'; // <-- set your bot's Mini App link
let save={xp:0,races:0,best:0,wins:0};try{Object.assign(save,JSON.parse(localStorage.getItem('apex')||'{}'))}catch(e){}
const store=()=>{try{localStorage.setItem('apex',JSON.stringify(save))}catch(e){}};
if(tg){try{tg.ready();tg.expand();tg.disableVerticalSwipes&&tg.disableVerticalSwipes();tg.lockOrientation&&tg.lockOrientation();tg.setHeaderColor&&tg.setHeaderColor('#07070d');tg.setBackgroundColor&&tg.setBackgroundColor('#07070d')}catch(e){}}
let hl=0;const hap=t=>{const n=performance.now();if(n-hl<160)return;hl=n;try{tg.HapticFeedback.impactOccurred(t||'light')}catch(e){}};
const NAME=((tg&&tg.initDataUnsafe&&tg.initDataUnsafe.user&&tg.initDataUnsafe.user.first_name)||'YOU').replace(/[^A-Za-z0-9]/g,'').slice(0,8)||'YOU';
const rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),fmt=t=>Math.floor(t/60)+':'+(t%60).toFixed(1).padStart(4,'0'),fmt3=t=>Math.floor(t/60)+':'+(t%60).toFixed(3).padStart(6,'0');
const SEG=200,RW=900,D=.84,CAMH=1000,PD=900,DRAW=110,MAXV=11000,HOR=.34;
const COMP=[{n:'S',c:'#ff2a3d',sp:1.03,g:1.1,wr:1.6},{n:'M',c:'#ffd21f',sp:1,g:1,wr:1},{n:'H',c:'#f2f2f2',sp:.975,g:.92,wr:.6}];
const BC=['#ff1e3c','#19e3ff','#ffd21f','#b24bff','#37ff8b'];
let segs=[],N=1,L=1,LAPS=3,seed=1,P,cars=[],state='menu',lights=0,goT=6,pitT=0,shake=0,sel=1,pitSel=-1,bx=0,parts=[],lastPos=8,ch=null,lapStart=0,bestL=0,raceT=0,keys={},msgT=0,res=null,hudT=0,W=1,H=1,dpr=1,demo=0;
let mpSocket=null,mpCode='',mpHost=false,mpActive=false,mpSeed=0,mpRoster=[],mpLastSend=0,mpStartPending=false;
const sp0=(tg&&tg.initDataUnsafe&&tg.initDataUnsafe.start_param)||location.hash.slice(1),q0=sp0.split('-');
if(q0.length>=4&&+q0[0]&&+q0[1])ch={seed:+q0[0],ms:+q0[1]/1000,laps:+q0[2]||3,n:q0[3]};
const mod=z=>((z%L)+L)%L,cv=$('c'),ctx=cv.getContext('2d');
function rs(){const a=$('app');W=a.clientWidth;H=a.clientHeight;dpr=Math.min(devicePixelRatio||1,2);cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
addEventListener('resize',rs);
function build(sd){const r=rng(sd);segs=[];
 const add=(len,c,d)=>{for(let k=0;k<len;k++)segs.push({c:c*Math.sin(Math.PI*(k+.5)/len),d:d&&k>8&&k<len-8?1:0,i:segs.length})};
 add(100,0,1);
 for(let j=0;j<34;j++){if(r()<.3)add(45+r()*55|0,0,1);else{const len=26+r()*44|0;add(len,(r()<.5?-1:1)*(.9+r()*2.3)*(len<36?1.35:1))}}
 add(70,0,0);N=segs.length;L=N*SEG}
function init(){build(seed);const r=rng(seed+99),lv=Math.floor(Math.sqrt(save.xp/100));
 const nm=['NOV','KES','BLT','VEG','ORI','ZEP','ROG'],cl=['#ff7a00','#19e3ff','#37ff8b','#ffd21f','#b24bff','#f2f2f2','#ff4fa3'];cars=[];let ai=0;
 for(let s=0;s<8;s++){const b={z:-(s+1)*260,x:s%2?.4:-.4,v:0,w:0,cp:1};
  if(s==5){P=Object.assign(b,{n:NAME,c:'#ff1e3c',e:.5,sv:0,lap:1,cp:sel,dr:false});cars.push(P)}
  else{cars.push(Object.assign(b,{n:nm[ai],c:cl[ai],sk:.8+r()*.1+Math.min(.04,lv*.004),tx:b.x,t:0,fin:0}));ai++}}
 raceT=0;lapStart=0;bestL=0;lastPos=6;bx=0;parts=[];goT=5*.85+.6+Math.random()*.9}
function msg(t,ms){const m=$('msg');m.textContent=t;m.classList.remove('s');void m.offsetWidth;m.classList.add('s');clearTimeout(msgT);msgT=setTimeout(()=>m.classList.remove('s'),ms||1000)}
function spark(x,y,c,n){for(let i=0;i<n;i++)parts.push({x,y,vx:(Math.random()-.5)*260,vy:-Math.random()*220,l:.5,c})}
function chips(el,opts,get,set){el.innerHTML='';opts.forEach(o=>{const b=document.createElement('button');b.className='chip'+(get()==o.v?' on':'');b.textContent=o.t;b.style.setProperty('--c',o.c||'#fff');b.onclick=()=>{set(o.v);chips(el,opts,get,set)};el.appendChild(b)})}
function menu(){state='menu';mpActive=false;const lv=Math.floor(Math.sqrt(save.xp/100))+1;
 $('st').textContent=`LEVEL ${lv} · BEST LAP ${save.best?fmt3(save.best):'--'} · WINS ${save.wins}`;
 $('menu').hidden=false;$('res').hidden=true;$('mp').hidden=true;$('hud').hidden=$('ctl').hidden=$('lights').hidden=true;$('miniWrap').hidden=true;
 $('chb').hidden=$('free').hidden=!ch;$('ll').hidden=$('cl').hidden=!!ch;
 if(ch)$('chb').innerHTML=`⚔ <b>${ch.n}</b> challenges you!<br>Beat <b>${fmt3(ch.ms)}</b> over ${ch.laps} laps on their track`;
 chips($('ct'),COMP.map((c,i)=>({t:c.n,v:i,c:c.c})),()=>sel,v=>sel=v);
 chips($('cl'),[2,3,5].map(v=>({t:v+' LAPS',v})),()=>LAPS,v=>LAPS=v);
 seed=Math.random()*1e6|0;init();P.x=0;P.z=0}
let ac,osc,gn;function sfx(){if(ac)return;try{const AudioCtor=window.AudioContext||window.webkitAudioContext;if(!AudioCtor)return;ac=new AudioCtor();osc=ac.createOscillator();osc.type='sawtooth';const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=800;gn=ac.createGain();gn.gain.value=0;osc.connect(f);f.connect(gn);gn.connect(ac.destination);osc.start()}catch(e){ac=null}}
function start(){sfx();if(ch){seed=ch.seed;LAPS=ch.laps}else if(mpActive&&mpSeed){seed=mpSeed}else seed=Math.random()*1e6|0;init();state='grid';lights=0;pitSel=-1;
 $('menu').hidden=$('res').hidden=true;$('hud').hidden=$('ctl').hidden=$('lights').hidden=false;$('miniWrap').hidden=false;$('mpStatus').textContent=mpActive?'ONLINE GRID':'SOLO SESSION';pitUI();tyreUI();msg('LIGHTS OUT SOON',1200)}
function pitUI(){$('pit').textContent=pitSel<0?'PIT OFF':'PIT → '+COMP[pitSel].n;$('pit').style.borderColor=pitSel<0?'':COMP[pitSel].c}
function tyreUI(){const c=COMP[P.cp];$('tyre').innerHTML=`<span style="color:${c.c};font-size:15px">●</span>${c.n}<span class="bar"><u id="wr"></u></span>`}
$('pit').onclick=()=>{pitSel=pitSel>=2?-1:pitSel+1;pitUI();hap('medium')};
$('go').onclick=start;$('free').onclick=()=>{ch=null;history.replaceState&&history.replaceState(null,'',location.pathname);menu()};
$('again').onclick=start;$('home').onclick=menu;$('shr').onclick=share;
async function share(){
 const code=[seed,Math.round(res.t*1000),LAPS,NAME].join('-');
 const txt=`🏎️ I finished P${res.pos} in ${fmt3(res.t)} on APEX RUSH! Think you can beat me? Challenge code: ${code}`;
 const isPlaceholder=!BOT||BOT.includes('YOUR_BOT')||BOT.includes('YOUR_APP');
 const isWeb=/^https?:$/.test(location.protocol);
 let gameLink='';
 if(!isPlaceholder) gameLink=BOT+'?startapp='+encodeURIComponent(code);
 else if(isWeb) gameLink=location.href.split('#')[0]+'#'+code;
 const message=gameLink?`${txt}\nPlay here: ${gameLink}`:txt;
 if(tg&&tg.openTelegramLink&&gameLink){
   const u='https://t.me/share/url?url='+encodeURIComponent(gameLink)+'&text='+encodeURIComponent(txt);
   tg.openTelegramLink(u);return;
 }
 try{
   if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(message);msg(gameLink?'CHALLENGE LINK COPIED':'CHALLENGE CODE COPIED',1800);}
   else throw new Error('Clipboard unavailable');
 }catch(e){
   window.prompt('Copy this challenge and send it to your friend.\n\nYour friend must open the same game file and add # followed by the code to the file URL.',message+'\n\nCode only: '+code);
 }
}
function finish(){state='fin';const pos=cars.filter(c=>c.z>P.z).length+1;res={pos,t:raceT,best:bestL};if(mpActive&&mpSocket)mpSocket.emit('race_state',{code:mpCode,name:mpName(),progress:Math.min(1,P.z/(LAPS*L)),time:raceT,position:pos,finished:true,lap:P.lap,seed:seed});
 const xp=Math.max(0,9-pos)*25+(pos==1?100:0);save.xp+=xp;save.races++;if(pos==1)save.wins++;store();res.xp=xp;
 msg(pos==1?'VICTORY!':'FINISH P'+pos,1800);hap('heavy');setTimeout(showRes,1800)}
function showRes(){$('res').hidden=false;$('hud').hidden=$('ctl').hidden=true;$('miniWrap').hidden=true;$('rp').textContent='P'+res.pos;
 let cm='';if(ch&&seed==ch.seed){const d=res.t-ch.ms;cm=d<0?`<br>🏆 You beat ${ch.n} by ${(-d).toFixed(3)}s!`:`<br>😤 ${ch.n} wins by ${d.toFixed(3)}s`}
 $('rt').innerHTML=`TIME ${fmt3(res.t)} · BEST LAP ${res.best?fmt3(res.best):'--'}<br>+${res.xp} XP${cm}`;
 $('rs').innerHTML=[...cars].sort((a,b)=>b.z-a.z).map((c,i)=>`<div class="${c===P?'me':''}"><span>P${i+1} ${c.n}</span><span style="color:${c.c}">■</span></div>`).join('');
 $('shr').hidden=false;if(ch&&res.pos>0)$('again').textContent='RETRY CHALLENGE'}
function player(dt){const sg=segs[Math.floor(mod(P.z)/SEG)%N],cp=COMP[P.cp],pct=P.v/MAXV,racing=state=='race';
 const dir=racing?(keys.r?1:0)-(keys.l?1:0):0,grip=cp.g*(1-.4*P.w),dxs=dt*2.5*(.35+.65*pct);
 P.sv+=(dir-P.sv)*Math.min(1,dt*10);P.x+=dir*dxs*grip*.95;P.x-=dxs*pct*sg.c*.42/grip;
 if(Math.abs(P.x)>1.75){P.x=Math.sign(P.x)*1.75;P.v*=1-3*dt;shake=.25;hap('rigid');spark(W/2,H*.68,'#ffb347',2)}
 const off=Math.abs(P.x)>1.08,boost=racing&&keys.b&&(sg.d||P.e>.02);P.boost=boost;P.inDRS=racing&&!!sg.d;
 let top=MAXV*cp.sp*(1-.12*P.w);if(boost)top*=sg.d?1.1:1.07;if(P.dr)top*=1.04;if(off)top*=.42;
 if(racing){if(keys.k)P.v=Math.max(0,P.v-17000*dt);else if(P.v<top)P.v=Math.min(top,P.v+4600*dt*(1.2-P.v/top));else P.v=Math.max(top,P.v-7000*dt)}
 else if(state=='fin')P.v=Math.max(MAXV*.25,P.v-2500*dt);
 else if(state=='pit'){P.v=Math.max(0,P.v-24000*dt);if(P.v==0){pitT-=dt;if(pitT<=0){P.cp=pitSel;P.w=0;pitSel=-1;state='race';pitUI();tyreUI();msg('GO GO GO!',900)}}}
 P.e=clamp(P.e+dt*(boost&&!sg.d?-.3:.045+(keys.k&&racing?.35:0)+(P.dr?.08:0)),0,1);
 P.w=Math.min(1,P.w+dt*cp.wr*(.0045*(.35+pct)+Math.abs(sg.c)*pct*pct*.0016+(keys.k&&P.v>3000?.004:0)+(off?.01:0)));
 if(off&&P.v>2500&&Math.random()<.5)spark(W/2+(Math.random()-.5)*60,H*.7,'#6b8f5a',1);
 if(keys.k&&racing&&P.v>4000&&Math.random()<.5)spark(W/2+(Math.random()<.5?-1:1)*30,H*.7,'#ffb347',1);
 P.z+=P.v*dt;bx+=sg.c*pct*dt*220;
 const ln=Math.floor(Math.max(0,P.z)/L)+1;
 if(ln>P.lap){const lt=raceT-lapStart;lapStart=raceT;if(!bestL||lt<bestL){bestL=lt;if(P.lap>0){msg('FASTEST LAP '+fmt3(lt),1500)}}if(!save.best||lt<save.best){save.best=lt;store()}
  P.lap=ln;if(ln>LAPS)finish();else{if(pitSel>=0){state='pit';pitT=2.4;msg('PIT STOP · '+COMP[pitSel].n,2400)}else msg('LAP '+ln,900)}}}
function update(dt){
 if(state=='menu'){demo+=dt;P.z+=4800*dt;const sg=segs[Math.floor(mod(P.z)/SEG)%N];bx+=sg.c*.6*dt*220;P.v=MAXV*.6;return}
 if(state=='grid'){lights+=dt;const n=Math.min(5,Math.floor(lights/.85));[...$('lights').children].forEach((e,i)=>e.classList.toggle('on',i<n));
  if(lights>goT){state='race';[...$('lights').children].forEach(e=>e.classList.remove('on'));msg('GO!',900);hap('heavy');setTimeout(()=>{if(state!='grid')$('lights').hidden=true},700)}return}
 raceT+=dt;P.dr=false;player(dt);
 for(const a of cars){if(a===P)continue;const sg=segs[Math.floor(mod(a.z)/SEG)%N],gap=a.z-P.z;
  let tv=MAXV*a.sk*(1-Math.min(.42,Math.abs(sg.c)*.1));tv*=gap<-5000?1.05:gap>9000?.93:1;a.v+=(tv-a.v)*Math.min(1,dt*1.4);
  a.t-=dt;if(a.t<=0){a.t=1.5+Math.random()*3;a.tx=clamp((Math.random()-.5)*1.5,-.85,.85)}
  const pz=P.z-a.z;if(pz>0&&pz<1500&&Math.abs(P.x-a.x)<.45)a.tx=clamp(P.x>a.x?a.x-.5:a.x+.5,-.85,.85);
  a.x+=(a.tx-a.x)*Math.min(1,dt*1.2);a.z+=a.v*dt;if(!a.fin&&a.z>=LAPS*L)a.fin=raceT;
  if(state=='race'){if(Math.abs(gap)<170&&Math.abs(a.x-P.x)<.36){if(gap>0)P.v=Math.min(P.v,a.v*.9);else a.v=Math.min(a.v,P.v*.96);P.x+=(P.x>=a.x?1:-1)*dt*1.6;shake=.35;P.w=Math.min(1,P.w+.0015);hap('heavy');spark(W/2,H*.66,'#ffd21f',3)}
   if(gap>0&&gap<1900&&Math.abs(a.x-P.x)<.5)P.dr=true}}
 if(state=='race'||state=='pit'){const pos=cars.filter(c=>c.z>P.z).length+1;if(pos<lastPos){msg('P'+pos+' ▲',700);hap('medium')}else if(pos>lastPos)msg('P'+pos+' ▼',700);lastPos=pos}
 shake=Math.max(0,shake-dt*1.5)}
function hud(){const pos=cars.filter(c=>c.z>P.z).length+1,pc=P.v/MAXV;
 $('pos').innerHTML=`P${pos}<small>/8</small>`;$('lap').textContent=`LAP ${Math.min(P.lap,LAPS)}/${LAPS}`;$('tm').textContent=fmt(raceT);
 $('spd').textContent=Math.round(pc*320);$('gr').textContent=P.v<50?'N':Math.min(8,Math.floor(pc*8)+1);
 const w=document.querySelector('#wr');if(w){w.style.width=(1-P.w)*100+'%';w.style.background=P.w>.75?'#ff2a3d':P.w>.45?'#ffd21f':'#37ff8b'}
 $('ersb').firstChild.style.width=P.e*100+'%';const bt=$('bt');bt.classList.toggle('drs',!!P.inDRS);bt.textContent=P.inDRS?'DRS':'ERS'}
function car(x,y,w,c,lean,boost,tc){const h=w*.5;ctx.save();ctx.translate(x,y);
 ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.ellipse(0,0,w*.55,h*.16,0,0,7);ctx.fill();ctx.transform(1,0,lean*.1,1,0,0);
 const R=(a,b,cw,ch,col)=>{ctx.fillStyle=col;ctx.fillRect(a*w,b*h,cw*w,ch*h)};
 R(-.5,-.66,.2,.66,'#15151a');R(.3,-.66,.2,.66,'#15151a');R(-.5,-.42,.2,.07,tc||'#fff');R(.3,-.42,.2,.07,tc||'#fff');
 if(boost){const g=ctx.createRadialGradient(0,-.35*h,0,0,-.35*h,w*.5);g.addColorStop(0,'rgba(120,230,255,.9)');g.addColorStop(1,'rgba(120,230,255,0)');ctx.fillStyle=g;ctx.fillRect(-w*.5,-h,w,h)}
 ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(-.2*w,0);ctx.lineTo(.2*w,0);ctx.lineTo(.17*w,-.5*h);ctx.lineTo(.09*w,-1*h);ctx.lineTo(-.09*w,-1*h);ctx.lineTo(-.17*w,-.5*h);ctx.fill();
 R(-.3,-.62,.12,.45,c);R(.18,-.62,.12,.45,c);R(-.05,-.3,.1,.2,'rgba(0,0,0,.35)');
 ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,-.92*h,.065*w,0,7);ctx.fill();ctx.strokeStyle='#111';ctx.lineWidth=Math.max(1,w*.02);ctx.beginPath();ctx.arc(0,-.88*h,.1*w,Math.PI,0);ctx.stroke();
 R(-.42,-1.2,.84,.17,'#0c0c10');R(-.42,-1.2,.84,.05,c);R(-.45,-1.28,.05,.34,c);R(.4,-1.28,.05,.34,c);R(-.04,-.62,.08,.1,'#ff2a2a');ctx.restore()}
function draw(){const HY=H*HOR,K=CAMH*H*.375;ctx.save();if(shake>0)ctx.translate((Math.random()-.5)*shake*14,(Math.random()-.5)*shake*14);
 let g=ctx.createLinearGradient(0,0,0,HY);[[0,'#0b0620'],[.5,'#4a1565'],[.85,'#ff4d6d'],[1,'#ffb454']].forEach(s=>g.addColorStop(s[0],s[1]));ctx.fillStyle=g;ctx.fillRect(-20,-20,W+40,HY+22);
 ctx.fillStyle='#fff3c4';ctx.beginPath();ctx.arc(((W*.65-bx*.12)%W+W)%W,HY-14,38,0,7);ctx.fill();
 for(let l=0;l<2;l++){ctx.fillStyle=l?'#1a0d33':'#2b1250';ctx.beginPath();ctx.moveTo(0,HY+1);for(let x=0;x<=W+12;x+=12){const u=x+bx*(.3+l*.4);ctx.lineTo(x,HY-(l?10:26)-Math.abs(Math.sin(u*.013+l*2))*(l?16:34)-Math.abs(Math.sin(u*.05))*(l?6:12))}ctx.lineTo(W,HY+1);ctx.fill()}
 ctx.fillStyle='#0a2a22';ctx.fillRect(-20,HY,W+40,H-HY+20);
 const cam=P.z-PD,cz=mod(cam),bi=Math.floor(cz/SEG),pct=(cz%SEG)/SEG,camX=P.x*RW,E=[];
 let x=0,dx=-pct*segs[bi%N].c;for(let n=0;n<=DRAW;n++){E[n]={x};x+=dx;dx+=segs[(bi+n)%N].c}
 const roadX=d=>{const u=(d+pct*SEG)/SEG,n=Math.floor(u);return E[n].x+(E[n+1].x-E[n].x)*(u-n)};
 const bk=[];for(const a of cars){if(a===P)continue;const d=mod(a.z-cam);if(d>40&&d<(DRAW-2)*SEG){const n=Math.floor((d+pct*SEG)/SEG);(bk[n]=bk[n]||[]).push([a,d])}}
 const quad=(c,xa,ya,wa,xb,yb,wb)=>{ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(xa-wa,ya);ctx.lineTo(xa+wa,ya);ctx.lineTo(xb+wb,yb);ctx.lineTo(xb-wb,yb);ctx.fill()};
 for(let n=DRAW-1;n>=0;n--){const sg=segs[(bi+n)%N];let d1=n*SEG-pct*SEG;const d2=d1+SEG;if(d2<40)continue;if(d1<40)d1=40;
  const s1=D/d1,s2=D/d2,y1=HY+s1*K,y2=HY+s2*K,e1=d1==n*SEG-pct*SEG?E[n].x:E[n].x+(E[n+1].x-E[n].x)*((d1-(n*SEG-pct*SEG))/SEG),
  x1=W/2+s1*(e1-camX)*W/2,x2=W/2+s2*(E[n+1].x-camX)*W/2,w1=s1*RW*W/2,w2=s2*RW*W/2;
  ctx.fillStyle=(sg.i>>2)&1?'#0a2a22':'#0d3329';ctx.fillRect(-20,y2,W+40,y1-y2+1);
  quad((sg.i>>1)&1?'#e10600':'#f4f4f4',x1,y1,w1*1.13,x2,y2,w2*1.13);
  quad((sg.i>>3)&1?'#2b2b35':'#30303b',x1,y1,w1,x2,y2,w2);quad('rgba(0,0,0,.2)',x1,y1,w1*.3,x2,y2,w2*.3);
  if(sg.i<2)for(let k=0;k<10;k++)if((k+sg.i)&1){const o=-1+(k+.5)*.2;quad('#fff',x1+o*w1,y1,.1*w1,x2+o*w2,y2,.1*w2)}
  if(n>1){const hp=s1*H*.375;
   if(sg.i%10==0){const sd=(sg.i/10&1)?-1:1,bxs=W/2+s1*(E[n].x+sd*RW*1.6-camX)*W/2,bw=s1*RW*.5*W/2,bh=bw*.5;ctx.fillStyle='#222';ctx.fillRect(bxs-bw*.04,y1-bh*1.9,bw*.08,bh*1.9);ctx.fillStyle=BC[(sg.i/10)%5];ctx.fillRect(bxs-bw,y1-bh*2.3,bw*2,bh);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(bxs-bw,y1-bh*2.3,bw*2,bh*.18)}
   if(sg.i%20==5)for(const sd of[-1,1]){const lx=W/2+s1*(E[n].x+sd*RW*1.3-camX)*W/2;ctx.fillStyle='#333';ctx.fillRect(lx-hp*8,y1-hp*700,hp*16,hp*700);ctx.fillStyle='#fff6c8';ctx.beginPath();ctx.arc(lx,y1-hp*710,Math.max(2,hp*55),0,7);ctx.fill()}
   if(sg.i==3)for(const sd of[-1,1]){const lx=W/2+s1*(E[n].x+sd*RW*1.2-camX)*W/2;ctx.fillStyle='#ddd';ctx.fillRect(lx-hp*20,y1-hp*650,hp*40,hp*650);if(sd==1){const l0=W/2+s1*(E[n].x-RW*1.2-camX)*W/2;ctx.fillStyle='#e10600';ctx.fillRect(l0,y1-hp*650,lx-l0,hp*110);ctx.fillStyle='#fff';ctx.fillRect(l0,y1-hp*610,lx-l0,hp*30)}}}
  if(bk[n])for(const[a,d]of bk[n]){const s=D/d;car(W/2+s*(roadX(d)+a.x*RW-camX)*W/2,HY+s*K,s*RW*.4*W/2,a.c,0,false,'#fff')}}
 g=ctx.createLinearGradient(0,HY-8,0,HY+H*.1);g.addColorStop(0,'rgba(255,120,90,.45)');g.addColorStop(1,'rgba(255,120,90,0)');ctx.fillStyle=g;ctx.fillRect(0,HY-8,W,H*.1+8);
 if(P.boost||P.v>MAXV*1.02){ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<18;i++){const a=Math.random()*6.283,r1=W*(.3+Math.random()*.2),r2=r1+W*(.15+Math.random()*.2);ctx.moveTo(W/2+Math.cos(a)*r1,H*.5+Math.sin(a)*r1*1.1);ctx.lineTo(W/2+Math.cos(a)*r2,H*.5+Math.sin(a)*r2*1.1)}ctx.stroke()}
 const ps=D/PD;car(W/2+P.sv*8,HY+ps*K,ps*RW*.4*W/2,P.c,P.sv,P.boost,COMP[P.cp].c);
 for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.l-=.016;if(p.l<=0){parts.splice(i,1);continue}p.x+=p.vx*.016;p.y+=p.vy*.016;p.vy+=500*.016;ctx.globalAlpha=p.l*2;ctx.fillStyle=p.c;ctx.fillRect(p.x,p.y,3,3)}ctx.globalAlpha=1;ctx.restore()}
[['bl','l'],['br','r'],['bt','b'],['bb','k']].forEach(([id,k])=>{const e=$(id),on=v=>ev=>{ev.preventDefault();keys[k]=v;e.classList.toggle('dn',!!v)};e.addEventListener('pointerdown',on(1));['pointerup','pointercancel','pointerleave'].forEach(t=>e.addEventListener(t,on(0)))});
const kmap=(e,v)=>{const k=e.key;if(k=='ArrowLeft'||k=='a')keys.l=v;if(k=='ArrowRight'||k=='d')keys.r=v;if(k==' '||k=='ArrowUp'||k=='w')keys.b=v;if(k=='ArrowDown'||k=='s')keys.k=v};
addEventListener('keydown',e=>kmap(e,1));addEventListener('keyup',e=>kmap(e,0));

// Circuit mini-map and room-based live multiplayer.
function mpName(){return (($('mpName').value||NAME||'RACER').replace(/[^A-Za-z0-9 _-]/g,'').trim().slice(0,14)||'RACER')}
function mpConnect(){
  if(mpSocket)return mpSocket;
  // Load networking only when multiplayer is opened, so a slow/offline CDN cannot stall solo play.
  if(typeof io!=='function'){
    let script=document.querySelector('script[data-apex-socketio]');
    if(!script){script=document.createElement('script');script.src='https://cdn.socket.io/4.7.5/socket.io.min.js';script.dataset.apexSocketio='1';script.onload=()=>mpConnect();script.onerror=()=>{$('mpError').textContent='Multiplayer library failed to load. Solo racing still works; check internet and retry.'};document.head.appendChild(script)}
    else if(script.dataset.loaded==='1'){return mpConnect()}
    else if(!script.dataset.waiting){script.dataset.waiting='1';script.addEventListener('load',()=>{script.dataset.loaded='1';mpConnect()},{once:true});script.addEventListener('error',()=>{$('mpError').textContent='Multiplayer library failed to load. Solo racing still works; check internet and retry.'},{once:true})}
    return null;
  }
  mpSocket=io({transports:['websocket','polling']});
  mpSocket.on('connect',()=>{$('mpError').textContent='Connected to race control.'});
  mpSocket.on('connect_error',()=>{$('mpError').textContent='Could not reach multiplayer server. Run/deploy server.py first.'});
  mpSocket.on('room_created',d=>{mpCode=d.code;mpHost=true;mpActive=true;mpRoster=d.players||[];mpSeed=d.seed;mpShowLobby()});
  mpSocket.on('room_joined',d=>{mpCode=d.code;mpHost=false;mpActive=true;mpRoster=d.players||[];mpSeed=d.seed;mpShowLobby()});
  mpSocket.on('room_update',d=>{if(d.code===mpCode){mpRoster=d.players||[];mpRenderPlayers()}});
  mpSocket.on('room_error',d=>{$('mpError').textContent=d.message||'Room error'});
  mpSocket.on('race_start',d=>{if(d.code!==mpCode)return;mpSeed=d.seed;LAPS=d.laps||3;mpActive=true;$('mp').hidden=true;if(state==='menu'||state==='fin'){start();}});
  mpSocket.on('race_snapshot',d=>{if(d.code===mpCode){mpRoster=d.players||[];mpRenderPlayers();}});
  mpSocket.on('race_finished',d=>{if(d.code===mpCode){mpRoster=d.players||[];mpRenderPlayers();}});
  return mpSocket;
}
function mpShowLobby(){
  $('mpRoomCode').textContent=mpCode;$('mpJoinBox').hidden=true;$('mpLobby').hidden=false;$('mpError').textContent='Share the code with friends using this same game URL.';$('mpStart').disabled=!mpHost;$('mpStart').style.opacity=mpHost?'1':'.45';mpRenderPlayers();
}
function mpRenderPlayers(){
  const box=$('mpPlayers');if(!box)return;
  box.innerHTML=(mpRoster||[]).map((p,i)=>`<div><span>${i+1}. ${String(p.name||'Racer').replace(/[<>&"]/g,'')}</span><b>${p.id===mpSocket?.id?'YOU':(p.finished?'FINISHED':'READY')}</b></div>`).join('');
}
function mpOpen(){
  $('mp').hidden=false;$('mpLobby').hidden=true;$('mpJoinBox').hidden=true;$('mpError').textContent='';mpConnect();
}
$('mpOpen').onclick=mpOpen;
$('mpClose').onclick=()=>{$('mp').hidden=true};
$('mpCreate').onclick=()=>{const s=mpConnect();if(!s)return;s.emit('create_room',{name:mpName()})};
$('mpJoinToggle').onclick=()=>{$('mpJoinBox').hidden=!$('mpJoinBox').hidden;$('mpLobby').hidden=true};
$('mpJoin').onclick=()=>{const code=$('mpCode').value.trim().toUpperCase();if(code.length<4){$('mpError').textContent='Enter the full room code.';return}const s=mpConnect();s&&s.emit('join_room',{code,name:mpName()})};
$('mpStart').onclick=()=>{if(!mpHost||!mpSocket)return;mpSeed=(Math.random()*2147483646|0)+1;LAPS=3;mpSocket.emit('start_race',{code:mpCode,seed:mpSeed,laps:LAPS});mpActive=true;$('mp').hidden=true;start()};
$('mpCopy').onclick=()=>{const txt=`Join my Apex Rush GP grid! Code: ${mpCode}`;if(navigator.clipboard?.writeText)navigator.clipboard.writeText(txt).then(()=>{$('mpError').textContent='Invite copied — send your friends the game URL and room code.'}).catch(()=>{$('mpError').textContent=txt});else $('mpError').textContent=txt};
function mpSendState(t){
 if(!mpActive||!mpSocket||!mpSocket.connected||state!=='race')return;
 if(t-mpLastSend<180)return;mpLastSend=t;
 mpSocket.emit('race_state',{code:mpCode,name:mpName(),progress:Math.max(0,Math.min(1,P.z/(LAPS*L))),time:raceT,position:cars.filter(c=>c.z>P.z).length+1,finished:false,lap:P.lap,seed:seed});
}
const miniCanvas=$('mini'),miniCtx=miniCanvas.getContext('2d'),miniPts=[];
{const w=miniCanvas.width,h=miniCanvas.height;for(let i=0;i<=180;i++){const t=i/180*Math.PI*2;miniPts.push([w*.5+(Math.sin(t)+.23*Math.sin(3*t)+.10*Math.cos(5*t))*w*.30,h*.51+(-Math.cos(t)*.72+.18*Math.sin(4*t))*h*.40])}}
let miniLastDraw=0;
function drawMiniMap(t){
 const wrap=$('miniWrap');if(!wrap||wrap.hidden||t-miniLastDraw<100)return;miniLastDraw=t;
 const mc=miniCtx,w=miniCanvas.width,h=miniCanvas.height,pts=miniPts;
 mc.clearRect(0,0,w,h);mc.fillStyle='rgba(4,8,13,.82)';mc.fillRect(0,0,w,h);
 mc.lineCap='round';mc.lineJoin='round';mc.beginPath();pts.forEach((p,i)=>i?mc.lineTo(p[0],p[1]):mc.moveTo(p[0],p[1]));mc.strokeStyle='#66727e';mc.lineWidth=17;mc.stroke();mc.strokeStyle='#202b36';mc.lineWidth=12;mc.stroke();
 mc.setLineDash([3,4]);mc.strokeStyle='rgba(255,255,255,.3)';mc.lineWidth=1;mc.stroke();mc.setLineDash([]);
 const progress=(P&&L?((P.z%L)/L):0),idx=Math.min(pts.length-1,Math.floor(progress*(pts.length-1))),p=pts[idx];
 mc.fillStyle='#ff1e3c';mc.beginPath();mc.arc(p[0],p[1],6,0,Math.PI*2);mc.fill();mc.strokeStyle='#fff';mc.lineWidth=1.5;mc.stroke();
 // Opponent dots are mapped by their lap progress; local AI cars plus network opponents.
 const others=cars.filter(c=>c!==P);
 others.forEach((c,i)=>{const pr=((c.z%(L||1))/(L||1)+1)%1,pi=Math.floor(pr*(pts.length-1)),q=pts[pi];mc.fillStyle=c.c||'#19e3ff';mc.beginPath();mc.arc(q[0],q[1],3.2,0,Math.PI*2);mc.fill()});
 if(mpActive){(mpRoster||[]).filter(x=>x.id!==mpSocket?.id).forEach((c,i)=>{const pr=Math.max(0,Math.min(.999,c.progress||0)),q=pts[Math.floor(pr*(pts.length-1))];mc.fillStyle=i%2?'#19e3ff':'#ffd21f';mc.beginPath();mc.arc(q[0],q[1],3,0,Math.PI*2);mc.fill()})}
}

let last=performance.now(),frameErrors=0,frameErrorShown=false;
function reportFrameError(err){
  frameErrors++;
  console.error('Apex Rush GP frame error:',err);
  // Keep one rendering/update error from killing the animation loop permanently.
  if(!frameErrorShown){frameErrorShown=true;const m=$('msg');if(m){m.textContent='RECOVERING…';m.classList.remove('s');m.classList.add('s');setTimeout(()=>m.classList.remove('s'),1100)}}
}
function loop(t){
  const dt=Math.min(.033,Math.max(0,(t-last)/1000));last=t;
  try{update(dt)}catch(err){reportFrameError(err)}
  try{draw()}catch(err){reportFrameError(err)}
  try{if(state!=='menu'&&(hudT+=dt)>.1){hudT=0;hud()} }catch(err){reportFrameError(err)}
  try{drawMiniMap(t)}catch(err){reportFrameError(err)}
  try{mpSendState(t)}catch(err){reportFrameError(err)}
  try{if(ac&&gn&&osc){const run=state==='race'||state==='fin'||state==='pit',pc=P.v/MAXV,g=Math.min(7,Math.floor(pc*8)),rp=pc*8-g;gn.gain.setTargetAtTime(run?.045:0,ac.currentTime,.08);osc.frequency.setTargetAtTime(70+g*14+rp*150,ac.currentTime,.05)}}catch(err){reportFrameError(err)}
  requestAnimationFrame(loop)
}
rs();menu();requestAnimationFrame(loop);
