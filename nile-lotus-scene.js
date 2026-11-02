/*!
 * Nile Crafted Studio - The Lotus Egg (v44), the homepage music button.
 * Original design by Nile Crafted Studio. Opens while the site's Canon in D music plays, closes when it stops.
 * Couple built from a MakeHuman base body (CC0). Requires three.js r128 (MIT) and nile-lotus-data.js.
 */
/* Lotus Egg Music Box — 3D scene + music. Nile Crafted Studio.
   Expects: three.js r128, window.NCS_MARK / NCS_COUPLE (nile-lotus-data.js),
   #lotusEggStage inside #musicBtn (the site's music button). */
(function () {
const MARK = window.NCS_MARK;
const T=THREE,wrap=document.getElementById('lotusEggStage');
const BG=0xf7f0e8;
const renderer=new T.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
renderer.localClippingEnabled=true;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.setClearColor(BG,0);
wrap.appendChild(renderer.domElement);const cv=renderer.domElement;cv.setAttribute('aria-hidden','true');
const scene=new T.Scene();const camera=new T.PerspectiveCamera(30,1,.1,100);camera.position.set(.9,2.3,6.4);

const env=new T.Scene();env.add(new T.Mesh(new T.SphereGeometry(20,32,16),new T.MeshBasicMaterial({color:0xc9b59c,side:T.BackSide})));
function panel(w,h,rgb,p){const m=new T.MeshBasicMaterial({side:T.DoubleSide});m.color.setRGB(...rgb);const o=new T.Mesh(new T.PlaneGeometry(w,h),m);o.position.set(...p);o.lookAt(0,0,0);env.add(o);}
panel(14,7,[3,2.9,2.7],[0,15,4]);panel(6,10,[2.4,2.2,2],[-14,4,7]);panel(6,10,[1.6,1.3,1.2],[14,3,-5]);panel(8,6,[1.8,1.7,1.6],[4,2,14]);panel(30,30,[.35,.28,.22],[0,-12,0]);
scene.environment=new T.PMREMGenerator(renderer).fromScene(env,.03).texture;
const hemi=new T.HemisphereLight(0xfff6ec,0xb89a80,.35);scene.add(hemi);
const key=new T.DirectionalLight(0xfff1e2,1.35);key.position.set(-3,6,4.5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.radius=5;key.shadow.bias=-.0005;
Object.assign(key.shadow.camera,{left:-3,right:3,top:4,bottom:-2,near:1,far:20});scene.add(key);
// WARM CREAM STUDIO BACKDROP + SOFT LIGHT (Bishoy's target): a radial cream glow behind the piece fading to warm sand at the edges,
// a soft warm halo light, softer key shadows and a blurred contact shadow under the base.
(function(){const W=512,H=512,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d',{willReadFrequently:true});
 const r=g.createRadialGradient(W*.5,H*.44,W*.04,W*.5,H*.5,W*.78);
 r.addColorStop(0,'#fffaf2');r.addColorStop(.35,'#f8efe3');r.addColorStop(.7,'#eedfcc');r.addColorStop(1,'#dcc6ac');
 g.fillStyle=r;g.fillRect(0,0,W,H);
 const f=g.createLinearGradient(0,H*.62,0,H);f.addColorStop(0,'rgba(214,190,160,0)');f.addColorStop(1,'rgba(200,172,140,.35)');g.fillStyle=f;g.fillRect(0,0,W,H);
 wrap.style.background='url('+c.toDataURL()+') center/100% 100% no-repeat,#f7f0e8';
 const s=document.createElement('canvas');s.width=s.height=256;const q=s.getContext('2d',{willReadFrequently:true});const sg=q.createRadialGradient(128,128,8,128,128,128);
 sg.addColorStop(0,'rgba(90,60,35,.42)');sg.addColorStop(.45,'rgba(110,80,50,.2)');sg.addColorStop(1,'rgba(120,90,60,0)');q.fillStyle=sg;q.fillRect(0,0,256,256);
 const cs=new T.Mesh(new T.PlaneGeometry(3.1,3.1),new T.MeshBasicMaterial({map:new T.CanvasTexture(s),transparent:true,depthWrite:false}));
 cs.rotation.x=-Math.PI/2;cs.position.y=.002;cs.renderOrder=-1;scene.add(cs);
 const halo=new T.PointLight(0xffe6cf,.35,9,2);halo.position.set(0,2.4,-2.2);scene.add(halo);
 key.shadow.radius=9;key.intensity=1.25;})();
const fill=new T.DirectionalLight(0xffe9df,.45);fill.position.set(3,2.5,5);scene.add(fill);
const rim=new T.PointLight(0xf6d8cc,.7,12);rim.position.set(2.5,3.5,-3);scene.add(rim);

// ---- Materials (brand: ivory lacquer, antique gold #a87a3d family, blush, ink #3b2a1e)
// v24: JEWELLER'S STUDIO reflections for metal and pearl — a dark warm room with bright softboxes, so gold shows real light-to-dark
// contrast (the bright cream room made it read flat champagne). Gold = rich 18k yellow (sRGB #e3b45c -> linear), pearls warm with a rose overtone.
const jEnv=(function(){const e=new T.Scene();e.add(new T.Mesh(new T.SphereGeometry(20,32,16),new T.MeshBasicMaterial({color:0x4a3d30,side:T.BackSide})));
 const pn=(w,h,v,p)=>{const m=new T.MeshBasicMaterial({side:T.DoubleSide});m.color.setRGB(...v);const o=new T.Mesh(new T.PlaneGeometry(w,h),m);o.position.set(...p);o.lookAt(0,0,0);e.add(o);};
 pn(10,4,[6,5.4,4.6],[0,15,3]);pn(3,12,[4,3.6,3.1],[-14,3,6]);pn(2.5,10,[2.6,2.2,1.9],[14,4,-4]);pn(6,2,[3,2.7,2.3],[3,1,14]);pn(30,30,[.42,.35,.27],[0,-12,0]);
 return new T.PMREMGenerator(renderer).fromScene(e,.02).texture;})();
const gold=new T.MeshStandardMaterial({color:new T.Color(0xeac46c).convertSRGBToLinear(),metalness:1,roughness:.2,envMap:jEnv,envMapIntensity:1.2});
const ivory=new T.MeshPhysicalMaterial({color:0xf3ebe0,roughness:.38,clearcoat:.9,clearcoatRoughness:.1});
// dusty-pink TUFTED velvet lining (Bishoy's target): diamond-tufted pillows, deep creases, pearl buttons; colour + bump canvases
// v29 VELVET (measured against Bishoy's photo): deeper dusty-rose plush with finer tufting (10x13), darker creases, softer sheen.
// v33 PLUSH VELVET: deeper dusty-mauve lining with larger, fuller tufts, darker shadowed creases, a fine crushed-pile grain and a soft
// sheen instead of bright salmon pillows (measured against the velvet niche in Bishoy's figurine photo)
const velvet=(function(){const N=256,c=document.createElement('canvas'),b=document.createElement('canvas');c.width=c.height=b.width=b.height=N;
 const g=c.getContext('2d',{willReadFrequently:true}),h=b.getContext('2d',{willReadFrequently:true}),P=[[0,0],[N,0],[0,N],[N,N],[N/2,N/2]];
 g.fillStyle='#6e3a3c';g.fillRect(0,0,N,N);h.fillStyle='#000';h.fillRect(0,0,N,N);
 // pillows: each diamond between four buttons swells softly in the middle
 [[N/2,0],[0,N/2],[N,N/2],[N/2,N]].forEach(([x,y])=>{let r=g.createRadialGradient(x-8,y-10,6,x,y,N*.5);r.addColorStop(0,'#b07c7a');r.addColorStop(.5,'#8f5a5a');r.addColorStop(1,'rgba(110,58,60,0)');
  g.fillStyle=r;g.beginPath();g.moveTo(x,y-N/2);g.lineTo(x+N/2,y);g.lineTo(x,y+N/2);g.lineTo(x-N/2,y);g.closePath();g.fill();
  r=h.createRadialGradient(x,y,0,x,y,N*.5);r.addColorStop(0,'#fff');r.addColorStop(.55,'#aaa');r.addColorStop(1,'#000');h.fillStyle=r;
  h.beginPath();h.moveTo(x,y-N/2);h.lineTo(x+N/2,y);h.lineTo(x,y+N/2);h.lineTo(x-N/2,y);h.closePath();h.fill();});
 // deep creases along the diamond edges, fanning into each button
 [[g,'rgba(58,24,26,.75)',7],[h,'#000',9]].forEach(([q,st,w])=>{q.strokeStyle=st;q.lineWidth=w*1.2;q.lineCap='round';
  [[0,0,N,N],[N,0,0,N],[N/2,-N/2,N*1.5,N/2],[-N/2,N/2,N/2,N*1.5],[N/2,-N/2,-N/2,N/2],[N*1.5,N/2,N/2,N*1.5]].forEach(([a,bb,cc,d])=>{q.beginPath();q.moveTo(a,bb);q.lineTo(cc,d);q.stroke();});});
 // crushed-velvet pile: fine random grain in colour and bump
 const id=g.getImageData(0,0,N,N),bd=h.getImageData(0,0,N,N);let sd=7;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
 for(let i=0;i<N*N;i++){const n=(rnd()-.5)*18;for(let k=0;k<3;k++)id.data[i*4+k]=Math.max(0,Math.min(255,id.data[i*4+k]+n*(k?0.8:1)));bd.data[i*4]=bd.data[i*4+1]=bd.data[i*4+2]=Math.max(0,Math.min(255,bd.data[i*4]+(rnd()-.5)*26));}
 g.putImageData(id,0,0);h.putImageData(bd,0,0);
 P.forEach(([x,y])=>{let r=g.createRadialGradient(x,y,0,x,y,30);r.addColorStop(0,'rgba(60,24,26,.9)');r.addColorStop(1,'rgba(80,36,38,0)');g.fillStyle=r;g.beginPath();g.arc(x,y,30,0,7);g.fill();
  r=g.createRadialGradient(x-3,y-3,1,x,y,9);r.addColorStop(0,'#fffaf2');r.addColorStop(.6,'#ecdcc8');r.addColorStop(1,'#a88f78');g.fillStyle=r;g.beginPath();g.arc(x,y,9,0,7);g.fill();
  h.fillStyle='#bbb';h.beginPath();h.arc(x,y,8,0,7);h.fill();});
 const t=new T.CanvasTexture(c),tb=new T.CanvasTexture(b);t.encoding=T.sRGBEncoding;[t,tb].forEach(x=>{x.wrapS=x.wrapT=T.RepeatWrapping;x.repeat.set(8,10);x.anisotropy=renderer.capabilities.getMaxAnisotropy();});
 const m=new T.MeshPhysicalMaterial({map:t,bumpMap:tb,bumpScale:.045,roughness:1,side:T.BackSide,envMapIntensity:.25});m.sheen=new T.Color(0x9c6466).convertSRGBToLinear();return m;})();
const pearlM=new T.MeshPhysicalMaterial({color:new T.Color(0xd9cabb).convertSRGBToLinear(),roughness:.16,metalness:.12,clearcoat:1,clearcoatRoughness:.03,sheen:new T.Color(0xe7b9b6).convertSRGBToLinear(),envMap:jEnv,envMapIntensity:1.35});
const skin=new T.MeshPhysicalMaterial({color:0xf3e0d2,roughness:.32,clearcoat:.9,clearcoatRoughness:.08});
const gown=new T.MeshPhysicalMaterial({color:0xfbf7f1,roughness:.28,clearcoat:1,clearcoatRoughness:.05,side:T.DoubleSide});
const ink=new T.MeshPhysicalMaterial({color:0x33241a,roughness:.35,clearcoat:1,clearcoatRoughness:.08});
const inkD=new T.MeshPhysicalMaterial({color:0x33241a,roughness:.35,clearcoat:1,side:T.DoubleSide});
const satin=new T.MeshPhysicalMaterial({color:0x1f150f,roughness:.18,clearcoat:1,clearcoatRoughness:.03});
const shirt=new T.MeshPhysicalMaterial({color:0xfbf8f3,roughness:.3,clearcoat:1,side:T.DoubleSide});
const hairB=new T.MeshPhysicalMaterial({color:0x6b4a36,roughness:.4,clearcoat:.8});
const hairG=new T.MeshPhysicalMaterial({color:0x4a3324,roughness:.4,clearcoat:.8});
const blushM=new T.MeshPhysicalMaterial({color:0xe5aea4,roughness:.4,clearcoat:.8});
const leafM=new T.MeshStandardMaterial({color:new T.Color(0x8fa57c).convertSRGBToLinear(),roughness:.5});
const veilM=new T.MeshPhysicalMaterial({color:0xffffff,roughness:.85,transparent:true,opacity:.3,side:T.DoubleSide,depthWrite:false});
const V2=a=>a.map(([x,y])=>new T.Vector2(x,y));

// ---- Helpers
function taper(pts,r0,r1,seg=40,rad=16){const c=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p)));const fr=c.computeFrenetFrames(seg,false);const pos=[],idx=[];
 for(let i=0;i<=seg;i++){const t=i/seg,P=c.getPointAt(t),r=r0+(r1-r0)*t,N=fr.normals[i],B=fr.binormals[i];
  for(let j=0;j<=rad;j++){const v=j/rad*Math.PI*2,cs=Math.cos(v),sn=Math.sin(v);pos.push(P.x+r*(cs*N.x+sn*B.x),P.y+r*(cs*N.y+sn*B.y),P.z+r*(cs*N.z+sn*B.z));}}
 for(let i=0;i<seg;i++)for(let j=0;j<rad;j++){const a=i*(rad+1)+j,b=a+rad+1;idx.push(a,b,a+1,b,b+1,a+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;}
function mk(g,geo,mat,p,rot,sc){const o=new T.Mesh(geo,mat);if(p)o.position.set(...p);if(rot)o.rotation.set(...rot);if(sc)o.scale.set(...sc);o.castShadow=true;g.add(o);return o;}
function limb(g,pts,r0,r1,mat){return mk(g,taper(pts,r0,r1),mat);}
function hand(g,p,mat){mk(g,new T.SphereGeometry(1,16,12),mat||skin,p,null,[.011,.016,.009]);}
function head(g,p,tilt,turn,hairMat,isBride){const h=new T.Group();h.position.set(...p);h.rotation.order='YXZ';h.rotation.y=turn;h.rotation.x=tilt;g.add(h);
 mk(h,new T.SphereGeometry(1,40,30),skin,[0,0,0],null,[.04,.05,.044]);
 mk(h,new T.SphereGeometry(1,28,20),skin,[0,-.024,.012],null,[.03,.03,.03]);
 mk(h,new T.ConeGeometry(.007,.022,14),skin,[0,-.004,.046],[1.35,0,0]);
 if(isBride){mk(h,new T.SphereGeometry(.042,36,24,0,Math.PI*2,0,Math.PI*.52),hairMat,[0,.006,-.006],[-.45,0,0],[1,1.08,1.06]);
  mk(h,new T.TorusGeometry(.022,.013,14,32),hairMat,[0,.012,-.05],[.3,0,0]);mk(h,new T.SphereGeometry(.02,20,16),hairMat,[0,.012,-.052]);
  mk(h,new T.TorusGeometry(.043,.004,8,40,Math.PI),gold,[0,.02,0],[-.55,0,0]);
  [-.024,0,.024].forEach((x,i)=>mk(h,new T.SphereGeometry(i===1?.008:.006,12,10),pearlM,[x,.046+(i===1?.008:0),.012]));}
 else{mk(h,new T.SphereGeometry(.043,36,24,0,Math.PI*2,0,Math.PI*.42),hairMat,[0,.012,-.004],[-.3,.2,0],[1,1.05,1.05]);
  mk(h,new T.SphereGeometry(1,20,14),hairMat,[0,.02,-.03],null,[.04,.035,.03]);}
 return h;}

// ---- Base (domed, gold rims, scroll feet)
const baseP=[[0,.12],[1.02,.12]];for(let i=0;i<=24;i++){const t=i/24;baseP.push([.24+.78*Math.cos(t*Math.PI/2),.12+.52*Math.sin(t*Math.PI/2)]);}
const base=new T.Mesh(new T.LatheGeometry(V2(baseP),96),ivory);base.castShadow=base.receiveShadow=true;scene.add(base);
const r1=new T.Mesh(new T.TorusGeometry(1.025,.025,16,120),gold);r1.rotation.x=Math.PI/2;r1.position.y=.13;scene.add(r1);
const r2=new T.Mesh(new T.TorusGeometry(.27,.02,12,64),gold);r2.rotation.x=Math.PI/2;r2.position.y=.635;scene.add(r2);
// (v20: the old blob feet and loose dot row were replaced by acanthus scroll feet and a beaded rim, see BASE ORNAMENT below)

// ---- Logo cartouche on the base
const ptex=new T.CanvasTexture(document.createElement('canvas'));const markImg=new Image();
// v37 SCULPTED CARTOUCHE (Bishoy: the logo should be sculpted in the base, not printed in colour): everything inside the gold frame is now
// white porcelain in relief. One height canvas drives real displacement (dense plaque geometry) and the fine bump: the N monogram and its
// peonies are carved from the logo artwork's tonal values, the wordmark and tagline are raised letters with bevelled edges, the rules and the
// divider are raised mouldings. The colour map is plain glaze with only a baked soft cavity shade, so the logo reads by light and shadow.
const pmet=document.createElement('canvas'),pbump=document.createElement('canvas');
function drawPlaque(){const c=ptex.image;const W=2048,Hh=1280;[c,pbump].forEach(k=>{k.width=W;k.height=Hh;});pmet.width=pmet.height=4;
 const g=c.getContext('2d',{willReadFrequently:true}),b=pbump.getContext('2d',{willReadFrequently:true});[g,b].forEach(q=>{q.setTransform(2,0,0,2,0,0);q.clearRect(0,0,1024,640);});
 const oval=(q,rx,ry)=>{q.beginPath();q.ellipse(512,320,rx,ry,0,0,Math.PI*2);};
 // height map: 0 = panel field (mid grey 70), raised work brighter
 b.fillStyle='rgb(70,70,70)';b.fillRect(0,0,1024,640);
 // a softly recessed field inside the inner rule, so the panel reads as a carved cartouche
 b.save();oval(b,440,253);b.clip();const fg=b.createRadialGradient(512,320,60,512,320,450);fg.addColorStop(0,'rgb(52,52,52)');fg.addColorStop(1,'rgb(66,66,66)');b.fillStyle=fg;b.fillRect(0,0,1024,640);b.restore();
 const raise=(fn,v,blur)=>{b.save();try{b.filter='blur('+blur+'px)';}catch(e){}b.fillStyle=b.strokeStyle='rgb('+v+','+v+','+v+')';fn(b);b.restore();b.filter='none';};
 raise(q=>{q.lineWidth=7;oval(q,452,264);q.stroke();},150,1.6);
 raise(q=>{q.lineWidth=2.5;oval(q,440,253);q.stroke();},120,.8);
 // monogram medallion: a domed boss carved with the N and the peonies (relief from the artwork's tones)
 const mx=512,my=188,mr=112;
 raise(q=>{const dg=q.createRadialGradient(mx,my-20,10,mx,my,mr);dg.addColorStop(0,'rgb(120,120,120)');dg.addColorStop(1,'rgb(92,92,92)');q.fillStyle=dg;q.beginPath();q.arc(mx,my,mr,0,7);q.fill();},0,0);
 if(markImg.complete&&markImg.naturalWidth){const t=document.createElement('canvas'),S=360;t.width=t.height=S;const tg=t.getContext('2d',{willReadFrequently:true});
  const iw=S*1.03,ih=iw*markImg.naturalHeight/markImg.naturalWidth;tg.fillStyle='#fff';tg.fillRect(0,0,S,S);tg.drawImage(markImg,(S-iw)/2,(S-ih)/2+6,iw,ih);
  const d=tg.getImageData(0,0,S,S),p=d.data;for(let k=0;k<p.length;k+=4){const L=.3*p[k]+.59*p[k+1]+.11*p[k+2],sat=Math.max(p[k],p[k+1],p[k+2])-Math.min(p[k],p[k+1],p[k+2]);
   const v=Math.max(0,Math.min(1,(255-L)/150))*.75+Math.min(1,sat/120)*.35;const h=Math.round(100+Math.min(1,v)*70);p[k]=p[k+1]=p[k+2]=h;p[k+3]=255;}
  tg.putImageData(d,0,0);b.save();b.beginPath();b.arc(mx,my,mr-3,0,7);b.clip();try{b.filter='blur(1.1px)';}catch(e){}b.globalCompositeOperation='lighten';b.drawImage(t,mx-mr,my-mr,mr*2,mr*2);b.restore();b.filter='none';b.globalCompositeOperation='source-over';}
 raise(q=>{q.lineWidth=12;q.beginPath();q.arc(mx,my,mr+5,0,7);q.stroke();},190,1.4);
 // a bold serif N carved proud of the medallion, over the softer peony relief
 [g,b].forEach(q=>{q.textAlign='center';q.font='600 178px Cinzel, "Cormorant Garamond", Georgia, serif';try{q.letterSpacing='0px';}catch(e){}});
 raise(q=>{q.lineWidth=7;q.strokeText('N',mx+2,my+62);q.fillText('N',mx+2,my+62);},175,2.6);raise(q=>{q.fillText('N',mx+2,my+62);},250,.7);
 // raised letters with a bevel: a wider soft base and a crisp top face
 const letters=(txt,x,y,font,maxW,spacing,top)=>{[g,b].forEach(q=>{q.textAlign='center';q.font=font;try{q.letterSpacing=spacing;}catch(e){}});
  {const fw=b.measureText(txt).width;if(fw>maxW){const f2=font.replace(/(\d+)px/,(a,n)=>Math.floor(n*maxW/fw)+'px');[g,b].forEach(q=>q.font=f2);}}
  raise(q=>{q.lineWidth=5;q.strokeText(txt,x,y);q.fillText(txt,x,y);},Math.round(top*.62),2.2);
  raise(q=>{q.fillText(txt,x,y);},top,.6);};
 letters('NILE CRAFTED STUDIO',514,406,'700 74px Cinzel, "Cormorant Garamond", Georgia, serif',770,'8px',240);
 raise(q=>{q.lineWidth=3;q.beginPath();q.moveTo(330,438);q.lineTo(476,438);q.moveTo(548,438);q.lineTo(694,438);q.stroke();q.beginPath();q.moveTo(512,425);q.lineTo(525,438);q.lineTo(512,451);q.lineTo(499,438);q.fill();[486,538].forEach(x=>{q.beginPath();q.arc(x,438,3.6,0,7);q.fill();});},170,1);
 letters('CUSTOM • CREATIVE • ALWAYS YOURS',514,496,'600 37px Jost, Arial, sans-serif',650,'8px',200);
 // colour: plain warm white glaze; cavity shade baked from the height (darker where the relief drops into a groove)
 g.fillStyle='#faf5f0';oval(g,480,290);g.fill();
 const H=b.getImageData(0,0,1024*2,640*2);const bl=document.createElement('canvas');bl.width=W;bl.height=Hh;const bq=bl.getContext('2d',{willReadFrequently:true});try{bq.filter='blur(6px)';}catch(e){}bq.drawImage(pbump,0,0);
 const Bd=bq.getImageData(0,0,W,Hh).data,Cd=g.getImageData(0,0,W,Hh),cd=Cd.data,hd=H.data;pmet.width=W;pmet.height=Hh;const mq=pmet.getContext('2d',{willReadFrequently:true}),Md=mq.createImageData(W,Hh),md=Md.data;
 // Wedgwood-style: a soft champagne biscuit ground, the relief in bright white glaze, deep soft shade where it meets the ground
 for(let k=0;k<cd.length;k+=4){if(cd[k+3]<10)continue;const h=hd[k];const up=Math.max(0,Math.min(1,(h-75)/90));
  const occ=Math.max(0,(Bd[k]-h)/255);const lit=Math.max(0,(h-Bd[k])/255);const f=1-occ*3.2+lit*.25;
  let r=222+(253-222)*up,gg=202+(250-202)*up,bb=168+(244-168)*up;
  const gilt=Math.max(0,Math.min(1,(h-150)/18));   // v38: the top faces of the raised lettering, the N and the mouldings are gilded
  if(gilt>0){const y=((k>>2)/W|0)/Hh,sh=.5+.5*Math.sin(y*40);r+=(168+38*sh-r)*gilt;gg+=(112+34*sh-gg)*gilt;bb+=(38+22*sh-bb)*gilt;}
  md[k]=md[k+1]=md[k+2]=Math.round(255*gilt);md[k+3]=255;
  cd[k]=Math.min(255,r*f);cd[k+1]=Math.min(255,gg*f*.99);cd[k+2]=Math.min(255,bb*f*.97);}
 g.putImageData(Cd,0,0);mq.putImageData(Md,0,0);
 ptex.needsUpdate=true;if(window._pbumpT){_pbumpT.needsUpdate=true;_pmetT.needsUpdate=true;}}
markImg.onload=()=>{drawPlaque();window.__lotusKick&&window.__lotusKick();};if(MARK)markImg.src=MARK;drawPlaque();ptex.encoding=T.sRGBEncoding;ptex.anisotropy=renderer.capabilities.getMaxAnisotropy();
document.fonts&&Promise.all([document.fonts.load('700 74px Cinzel'),document.fonts.load('600 178px Cinzel')]).catch(()=>{}).then(()=>document.fonts.ready).then(()=>{drawPlaque();window.__lotusKick&&window.__lotusKick();});
const plP=[];for(let i=0;i<=14;i++){const t=.04+i/14*.6;plP.push([.24+.78*Math.cos(t*Math.PI/2)+.006,.12+.52*Math.sin(t*Math.PI/2)]);}
window._pbumpT=new T.CanvasTexture(pbump);_pbumpT.anisotropy=renderer.capabilities.getMaxAnisotropy();window._pmetT=new T.CanvasTexture(pmet);
{const pp=[];for(let i=0;i<=44;i++){const t=.04+i/44*.6;pp.push([.24+.78*Math.cos(t*Math.PI/2)+.004,.12+.52*Math.sin(t*Math.PI/2)]);}
 scene.add(new T.Mesh(new T.LatheGeometry(V2(pp),150,-.72,1.44),new T.MeshPhysicalMaterial({color:0xffffff,map:ptex,metalnessMap:_pmetT,metalness:1,envMap:jEnv,envMapIntensity:.85,bumpMap:_pbumpT,bumpScale:.009,displacementMap:_pbumpT,displacementScale:.016,displacementBias:-.003,roughness:.42,clearcoat:.35,clearcoatRoughness:.3,alphaTest:.5})));}

// ---- Lotus stem
const stem=new T.Mesh(new T.LatheGeometry(V2([[.2,.63],[.1,.7],[.075,.8],[.1,.87],[.2,.93],[.25,.96]]),48),gold);stem.castShadow=true;scene.add(stem);
// (v19: the small petal blobs were replaced by the gold acanthus-leaf cup, see CUP below)

// ---- Egg with peony-vine filigree and pearl seam
const FIG_SCALE=1.3,CL=.4,EY=.95,A=.97,B=.61,prof=[];for(let i=0;i<=72;i++){const t=i/72*Math.PI;prof.push([Math.max(B*Math.sin(t)*(1+.17*Math.cos(t))*(1-.05*Math.sin(t)*Math.sin(t)*Math.cos(t)),i===0||i===72?0:.001),A*(1-Math.cos(t))]);}
const col=document.createElement('canvas'),met=document.createElement('canvas');col.width=met.width=1024;col.height=met.height=1024;
(function(){const g=col.getContext('2d',{willReadFrequently:true}),m=met.getContext('2d',{willReadFrequently:true});g.fillStyle='#f3ebe0';g.fillRect(0,0,1024,1024);m.fillStyle='#000';m.fillRect(0,0,1024,1024);
 function both(fn){g.fillStyle=g.strokeStyle='#c99a55';m.fillStyle=m.strokeStyle='#fff';fn(g);fn(m);}
 [[.28,0],[.72,2]].forEach(([u,ph])=>{const cx=u*1024;
  // (flat painted vine removed in v17: the gold scrollwork is now raised relief geometry, see addScroll below)
  // (painted roses removed in v18: raised sculpted roses with sage leaves now sit on the shell, see addRoses below)
 });
 both(c=>{for(let i=0;i<14;i++){c.beginPath();c.arc(36+i*73,1000,6,0,Math.PI*2);c.fill();c.beginPath();c.arc(36+i*73,24,6,0,Math.PI*2);c.fill();}});})();
const cTex=new T.CanvasTexture(col);cTex.encoding=T.sRGBEncoding;cTex.anisotropy=renderer.capabilities.getMaxAnisotropy();
const eggM=new T.MeshPhysicalMaterial({map:cTex,metalnessMap:new T.CanvasTexture(met),metalness:1,roughness:.32,clearcoat:.85,clearcoatRoughness:.1,envMapIntensity:1.25});
// surface point on the egg shell: arc distance d from the split (along the girth), local height y, lift above the shell
function shellAt(d,y,lift,s,zs){let i=1;while(i<71&&prof[i+1][1]<y)i++;const[r0,y0]=prof[i],[r1,y1]=prof[i+1],f=Math.min(Math.max((y-y0)/(y1-y0||1),0),1),r=r0+(r1-r0)*f,a=d/Math.max(r,.05),R=r+lift;
 return{p:new T.Vector3(s*R*Math.sin(a),y,zs*R*Math.cos(a)),a:a};}
function scrollPts(){// left half of the lyre/heart in surface units (X = arc offset, Y = height offset), ending in an inward volute
 const P=[[0,-.36],[-.07,-.29],[-.16,-.17],[-.215,-.03],[-.215,.1],[-.18,.21],[-.12,.28],[-.06,.29]].map(([x,y])=>new T.Vector2(x,y));
 const c=new T.SplineCurve(P),pts=c.getPoints(40);const e=pts[pts.length-1],cx=-.06,cy=.215;// volute centre below the end
 const a0=Math.atan2(e.y-cy,e.x-cx);for(let k=1;k<=34;k++){const t=k/34,ang=a0+t*Math.PI*2.1,rr=.075*(1-.78*t);pts.push(new T.Vector2(cx+rr*Math.cos(ang),cy+rr*Math.sin(ang)));}
 return pts;}
function footPts(){// small outward curl at the heart's point
 const pts=[],cx=-.075,cy=-.395;for(let k=0;k<=30;k++){const t=k/30,ang=Math.PI*.15-t*Math.PI*1.9,rr=.075*(1-.7*t);pts.push(new T.Vector2(cx+rr*Math.cos(ang),cy+rr*Math.sin(ang)));}return pts;}
const SC_L=scrollPts(),SC_F=footPts(),leafG=new T.SphereGeometry(1,14,8),beadG=new T.SphereGeometry(.013,12,9);
function addScroll(h,s,zs){const dc=.5,yc=.86,lift=.009;
 [1,-1].forEach(m=>{[SC_L,SC_F].forEach((L,li)=>{const v=L.map(q=>shellAt(dc+m*q.x,yc+q.y,lift,s,zs).p);
   const tb=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(v),li?60:140,li?.0085:.011,6,false),gold);tb.castShadow=true;h.add(tb);
   const b=new T.Mesh(beadG,gold);b.position.copy(v[v.length-1]);h.add(b);});
  // acanthus leaves sprouting from the outer curve, tapering outward and upward
  [[.12,-.22],[.2,-.06],[.2,.12],[.14,.25]].forEach(([qx,qy],k)=>{const o=shellAt(dc-m*qx,yc+qy,lift+.002,s,zs),a=o.a;
   const N=new T.Vector3(s*Math.sin(a),0,zs*Math.cos(a)),EA=new T.Vector3(s*Math.cos(a),0,-zs*Math.sin(a)).multiplyScalar(-m),
    T2=EA.clone().multiplyScalar(.8).add(new T.Vector3(0,.25+k*.25,0)).normalize(),Y2=new T.Vector3().crossVectors(N,T2);
   const lf=new T.Mesh(leafG,gold);lf.matrix.makeBasis(T2,Y2,N);lf.matrix.setPosition(o.p.clone().addScaledVector(T2,.03));lf.matrix.scale(new T.Vector3(.05,.017,.007));lf.matrixAutoUpdate=false;lf.castShadow=true;h.add(lf);});});
 // centre crest: a gold bead and tiny palmette at the top of the heart, a bead at its point
 [[0,.3,.016],[0,-.36,.014]].forEach(([qx,qy,r])=>{const b=new T.Mesh(new T.SphereGeometry(r,12,9),gold);b.position.copy(shellAt(dc+qx,yc+qy,lift+.004,s,zs).p);h.add(b);});}
// RAISED sculpted pink roses with sage-green leaves (Bishoy's target): a full cabbage rose in the heart of each lyre, smaller roses at its crest and point
const eRoseM=new T.MeshPhysicalMaterial({color:new T.Color(0xd98c82).convertSRGBToLinear(),roughness:.55,clearcoat:.3,clearcoatRoughness:.3,side:T.DoubleSide,envMapIntensity:.6});
const eRoseL=new T.MeshPhysicalMaterial({color:new T.Color(0xe9aaa0).convertSRGBToLinear(),roughness:.55,clearcoat:.3,clearcoatRoughness:.3,side:T.DoubleSide,envMapIntensity:.6});
const eRoseD=new T.MeshPhysicalMaterial({color:new T.Color(0xb8665d).convertSRGBToLinear(),roughness:.55,clearcoat:.3,side:T.DoubleSide,envMapIntensity:.5});
const eLeafM=new T.MeshPhysicalMaterial({color:new T.Color(0x93a982).convertSRGBToLinear(),roughness:.38,clearcoat:.6,clearcoatRoughness:.15,envMapIntensity:.6});
const petalG=new T.SphereGeometry(1,11,6,0,Math.PI*2,0,Math.PI*.5),budG=new T.SphereGeometry(1,12,8),rLeafG=new T.SphereGeometry(1,12,6);
function makeRose(sz,spin,nLeaves){const R=new T.Group();
 {const b=new T.Mesh(budG,eRoseD);b.position.z=.18;b.scale.set(.3,.3,.34);R.add(b);}
 [[5,.2,.3,.15,eRoseD,.56],[7,.42,.4,.45,eRoseM,.42],[9,.66,.48,.75,eRoseM,.25],[11,.88,.52,1.0,eRoseL,.08]].forEach(([n,rad,ps,open,m,z],ring)=>{
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2+ring*.55+spin,p=new T.Mesh(petalG,m);p.scale.set(ps,ps*.62,ps*.85);
   p.position.set(Math.cos(a)*rad*.62,Math.sin(a)*rad*.62,z);p.rotation.z=a-Math.PI/2;p.rotateX(-open);R.add(p);}});
 for(let k=0;k<nLeaves;k++){const a=spin+1.1+k*(Math.PI*2/nLeaves)+.3*Math.sin(k*2.3),l=new T.Mesh(rLeafG,eLeafM);l.scale.set(.62,.26,.07);
  l.position.set(Math.cos(a)*1.15,Math.sin(a)*1.15,-.05);l.rotation.z=a;l.rotation.y=.25;R.add(l);
  const v=new T.Mesh(rLeafG,eLeafM);v.scale.set(.5,.025,.09);v.position.copy(l.position);v.rotation.z=a;R.add(v);}
 R.scale.setScalar(sz);R.traverse(o=>{if(o.isMesh)o.castShadow=true;});return R;}
function addRoses(h,s,zs){const dc=.5,yc=.86;
 [[0,.01,.088,4],[0,.43,.05,2],[0,-.5,.05,2]].forEach(([qx,qy,sz,nl],k)=>{const o=shellAt(dc+qx,yc+qy,.012,s,zs),a=o.a;
  const N=new T.Vector3(s*Math.sin(a),0,zs*Math.cos(a)).normalize(),R=makeRose(sz,k*1.7+(s>0?0:.8),nl);
  R.position.copy(o.p);R.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),N);h.add(R);});}
// ---- CUP (v19, Bishoy's target): a gold lotus/acanthus leaf cup cradling the egg, a slim beaded collar on the stem, and a second leaf flare on the base top
const goldS=gold.clone();goldS.side=T.DoubleSide;const cupLeaves=[];
function eggR(y){if(y<=0)return 0;let i=0;while(i<71&&prof[i+1][1]<y)i++;const[r0,y0]=prof[i],[r1,y1]=prof[i+1];return r0+(r1-r0)*Math.min(Math.max((y-y0)/(y1-y0||1),0),1);}
// one leaf: spine(v) gives [radial, height]; width w(v); cupped across, scalloped acanthus edge, pointed tip; built with +z radial, +x tangential
function leafGeo(spine,W,depth,lobes){const NV=26,NU=10,pos=[],idx=[];
 for(let i=0;i<=NV;i++){const v=i/NV,[r,y]=spine(v),[r2,y2]=spine(Math.min(v+.02,1)),[r1,y1]=spine(Math.max(v-.02,0));let tz=r2-r1,ty=y2-y1;const L=Math.hypot(tz,ty)||1;tz/=L;ty/=L;const nz=ty,ny=-tz;// outward normal in the radial plane
  const w=W*Math.pow(Math.sin(Math.PI*Math.min(v*1.02,1)),.42)*(1-.3*v)*(.8+.2*Math.abs(Math.cos(v*Math.PI*lobes)));
  for(let j=0;j<=NU;j++){const u=j/NU*2-1,c=(1-u*u)*depth*(1-.6*v);pos.push(u*w,y+ny*c-Math.abs(u)*w*.18*ty,r+nz*c);}}
 for(let i=0;i<NV;i++)for(let j=0;j<NU;j++){const a=i*(NU+1)+j,b=a+NU+1;idx.push(a,b,a+1,a+1,b,b+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;}
(function(){
 // cup: 8 large leaves hugging the lower egg, 8 smaller ones between them set slightly lower; tips curl outward
 [[8,0,.3,.15,.05,3,1],[8,Math.PI/8,.21,.13,.04,2,.82]].forEach(([n,off,H,W,dep,lobes,k])=>{
  const y0=EY-.035,r0=.17,spine=v=>{const ly=-.035+v*H,er=Math.max(eggR(ly),.17);return[Math.max(r0+(er-r0)*Math.min(v*1.8,1),er)+.02+.045*v*v*v-r0,ly+.035+.012*v*v*v];};
  const g=leafGeo(spine,W,dep,lobes);
  for(let i=0;i<n;i++){const a=off+i/n*Math.PI*2,G=new T.Group();G.rotation.y=a;scene.add(G);const P=new T.Group();P.position.set(0,y0,r0);G.add(P);
   const m=new T.Mesh(g,goldS);m.castShadow=true;P.add(m);
   const rib=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([...Array(9)].map((_,q)=>{const[r,y]=spine(q/8*.92);return new T.Vector3(0,y+.004,r+.006);})),24,.006*k,6,false),gold);P.add(rib);
   P.userData.k=k;cupLeaves.push(P);}});
 // slim collar: two fine gold rings and a bead row at the stem's waist, a ring under the cup
 [[.8,.083,.014],[.755,.088,.01],[.905,.205,.013]].forEach(([y,r,t])=>{const o=new T.Mesh(new T.TorusGeometry(r,t,10,64),gold);o.rotation.x=Math.PI/2;o.position.y=y;scene.add(o);});
 for(let i=0;i<16;i++){const a=i/16*Math.PI*2,b=new T.Mesh(new T.SphereGeometry(.011,10,8),gold);b.position.set(Math.sin(a)*.099,.778,Math.cos(a)*.099);scene.add(b);}
 // second leaf flare on the base top: 12 short leaves splaying out over the dome from the stem foot
 const fl=v=>{const rr=.2+v*.27,th=Math.acos(Math.min((rr-.24)/.78,1));return[rr-.2,.12+.52*Math.sin(th)+.012+.03*v*v*v-.66];};
 const fg=leafGeo(fl,.085,.03,2);
 for(let i=0;i<12;i++){const a=i/12*Math.PI*2+Math.PI/12,G=new T.Group();G.rotation.y=a;scene.add(G);const P=new T.Group();P.position.set(0,.66,.2);G.add(P);const m=new T.Mesh(fg,goldS);m.castShadow=true;P.add(m);}
})();
// ---- BASE ORNAMENT (v20, Bishoy's target): raised gold frame round the oval logo cartouche, beaded gold rim, four gold acanthus scroll feet
(function(){
 const dome=(u,v,lift)=>{const th=(.04+v*.6)*Math.PI/2,ph=-.72+u*1.44,r=.24+.78*Math.cos(th)+lift;
  const N=new T.Vector3(Math.cos(th)/.78*Math.sin(ph),Math.sin(th)/.52,Math.cos(th)/.78*Math.cos(ph)).normalize(),
   U=new T.Vector3(-.78*Math.sin(th)*Math.sin(ph),.52*Math.cos(th),-.78*Math.sin(th)*Math.cos(ph)).normalize(),S=new T.Vector3(Math.cos(ph),0,-Math.sin(ph));
  return{p:new T.Vector3(r*Math.sin(ph),.12+.52*Math.sin(th),r*Math.cos(ph)),N,U,S};};
 const ring=(ru,rv,lift,n)=>[...Array(n)].map((_,k)=>{const a=k/n*Math.PI*2;return dome(.5+ru*Math.cos(a),.5+rv*Math.sin(a),lift).p;});
 // cartouche frame: a round gold moulding, a fine inner line, and a row of tiny gold beads between them
 const fr=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(ring(.49,.485,.004,120),true),240,.018,10,true),gold);fr.castShadow=true;scene.add(fr);
 scene.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(ring(.452,.432,.004,120),true),240,.0065,8,true),gold));
 const bG=new T.SphereGeometry(.0085,7,5);ring(.471,.458,.009,56).forEach(p=>{const b=new T.Mesh(bG,gold);b.position.copy(p);scene.add(b);});
 // v21: raised gold ring round the N monogram (canvas centre 512,188, radius ~117px -> lathe UV), with a fine bead row outside it
 {const cu=.5,cv=1-188/640,ru=119/1024,rv=119/640;const rr=(f,l,n)=>[...Array(n)].map((_,k)=>{const a=k/n*Math.PI*2;return dome(cu+ru*f*Math.cos(a),cv+rv*f*Math.sin(a),l).p;});
  const mr=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(rr(1,.004,96),true),192,.0125,10,true),gold);mr.castShadow=true;scene.add(mr);
  const bb=new T.SphereGeometry(.0058,8,6);rr(1.13,.006,40).forEach(p=>{const b=new T.Mesh(bb,gold);b.position.copy(p);scene.add(b);});}
 // acanthus crest above the oval (a fan of five gold leaves on a bead), small leaves and beads at its ends, a leaf pair below
 const leafOn=(o,dir,len,wid,off)=>{const D=dir.clone().normalize(),Y=new T.Vector3().crossVectors(o.N,D);const l=new T.Mesh(leafG,gold);
  l.matrix.makeBasis(D,Y,o.N);l.matrix.setPosition(o.p.clone().addScaledVector(D,off));l.matrix.scale(new T.Vector3(len,wid,.009));l.matrixAutoUpdate=false;l.castShadow=true;scene.add(l);};
 {const o=dome(.5,.985,.006);for(let k=-2;k<=2;k++){const ang=k*.42;leafOn(o,o.U.clone().multiplyScalar(Math.cos(ang)).addScaledVector(o.S,Math.sin(ang)),.065-.008*Math.abs(k),.02,.05);}
  const b=new T.Mesh(new T.SphereGeometry(.02,14,10),gold);b.position.copy(o.p);scene.add(b);}
 {const o=dome(.5,.03,.006);[-1,1].forEach(m=>leafOn(o,o.S.clone().multiplyScalar(m).addScaledVector(o.U,.35),.055,.017,.045));
  const b=new T.Mesh(new T.SphereGeometry(.017,14,10),gold);b.position.copy(o.p);scene.add(b);}
 [.015,.985].forEach(u=>{const o=dome(u,.5,.006),m=u<.5?-1:1;leafOn(o,o.U,.045,.015,.03);leafOn(o,o.U.clone().negate(),.045,.015,.03);
  const b=new T.Mesh(new T.SphereGeometry(.014,12,9),gold);b.position.copy(o.p).addScaledVector(o.S,m*.004);scene.add(b);});
 // beaded gold rim: a row of round beads around the outer lip of the base
 const rb=new T.SphereGeometry(.016,9,6);for(let i=0;i<96;i++){const a=i/96*Math.PI*2,b=new T.Mesh(rb,gold);b.position.set(Math.sin(a)*1.05,.13,Math.cos(a)*1.05);scene.add(b);}
 // four acanthus scroll feet: a pair of gold C-scrolls tucked under the rim that roll outward and down into volutes resting on the table, an acanthus leaf over them
 const scroll=[new T.Vector3(0,.122,-.08),new T.Vector3(0,.13,-.01)];const cz=.12,cy=.086,th0=Math.PI*.72;
 for(let k=0;k<=40;k++){const t=k/40,a=th0-t*Math.PI*2.05,R=.066*(1-.72*t);scroll.push(new T.Vector3(0,cy+R*Math.sin(a),cz+R*Math.cos(a)));}
 const fSp=v=>[.1+.095*Math.sin(v*Math.PI*.6),.168-.12*v];const fLeaf=leafGeo(fSp,.085,.03,3);
 for(let i=0;i<4;i++){const a=Math.PI/4+i*Math.PI/2,f=new T.Group();f.position.set(Math.sin(a)*.86,0,Math.cos(a)*.86);f.rotation.y=a;f.scale.setScalar(1.45);scene.add(f);
  [-1,1].forEach(m=>{const tb=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(scroll.map(p=>p.clone().setX(m*.062))),90,.021,10,false),gold);tb.castShadow=true;f.add(tb);
   const e=new T.Mesh(new T.SphereGeometry(.021,12,9),gold);e.position.set(m*.062,cy,cz);f.add(e);
   const c=new T.Mesh(new T.SphereGeometry(.012,10,8),gold);c.position.set(m*.087,cy,cz);f.add(c);});
  const lf=new T.Mesh(fLeaf,goldS);lf.castShadow=true;f.add(lf);
  const rib=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([...Array(9)].map((_,q)=>{const[r,y]=fSp(q/8*.92);return new T.Vector3(0,y,r+.024*(1-.6*q/8));})),24,.005,6,false),gold);f.add(rib);
  const pad=new T.Mesh(new T.CylinderGeometry(.075,.085,.03,24),gold);pad.position.set(0,.135,-.03);f.add(pad);}
})();
// v28 DOOR HINGE (Bishoy's design): the halves swing open like doors about a tilted hinge running from the egg's bottom tip up the
// back (axis through the bottom tip toward the back at mid-height), so the egg stays seated in its cup, the back of each half stays
// behind the couple as a pink velvet niche, and the front pearl seams part to either side.
// (v28 tilted doors and v37 vertical-pin doors were replaced in v41 by the traditional hinged lid below.)
// v42 TWO HALVES SWING BACK (Bishoy: "the whole two halves opening up" -> left and right swing back): the egg is split front-to-back into two
// full-height halves hung on ONE vertical gold pin just behind the back seam, where the egg is widest. Every point of a half turns about that pin
// at a fixed distance, so the mirror halves never meet and nothing ever touches the pin's own line: the pin is carried by a slim gold column that
// runs straight down that line to the base. The acanthus cup leaves first peel back like an opening lotus to release the halves, then the halves
// swing back; on closing the halves return first and the leaves fold up round them again.
const DOOR=1.5,PIVOT=new T.Vector3(0,0,-B-.014),_yA=new T.Vector3(0,1,0),_pv=new T.Vector3(),PEEL=1.35;
const halves=[];
[[0,1],[Math.PI,-1]].forEach(([ps,s])=>{const h=new T.Group();h.position.y=EY;scene.add(h);halves.push([h,s]);
 const geo=new T.LatheGeometry(V2(prof),64,ps,Math.PI);const o=new T.Mesh(geo,eggM);o.castShadow=true;h.add(o);h.add(new T.Mesh(new T.LatheGeometry(V2(prof.map(([r,y])=>[Math.max(r-.024,.001),y])),64,ps,Math.PI),velvet));// v28: lining inset so exterior ornaments never show through the now-visible back
 [1,-1].forEach(zs=>{const pts=prof.map(([r,y])=>new T.Vector3(s*.012,y,zs*r));const tb=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),120,.024,10,false),gold);tb.castShadow=true;h.add(tb);
  if(zs>0){// raised gold seam BAND down the front split (Bishoy's target: double pearl-beaded bands, one per half): a domed strip on the shell, a fine beaded outer edge and a pearl row set along its crown
   const i0=5,i1=67,W=6,pos=[],idx=[],d0=.016,d1=.088;
   for(let i=i0;i<=i1;i++){const[r,y]=prof[i];for(let j=0;j<=W;j++){const u=j/W,d=d0+(d1-d0)*u,a=Math.min(d/Math.max(r,.05),1.2),R=r+.004+.011*Math.sin(Math.PI*u);pos.push(s*R*Math.sin(a),y,R*Math.cos(a));}}
   for(let i=0;i<i1-i0;i++)for(let j=0;j<W;j++){const a=i*(W+1)+j,b=a+W+1;s>0?idx.push(a,b,a+1,a+1,b,b+1):idx.push(a,a+1,b,a+1,b+1,b);}
   const bg=new T.BufferGeometry();bg.setAttribute('position',new T.Float32BufferAttribute(pos,3));bg.setIndex(idx);bg.computeVertexNormals();const band=new T.Mesh(bg,gold);band.castShadow=true;h.add(band);
   const edge=[];for(let i=i0;i<=i1;i++){const[r,y]=prof[i],a=Math.min(d1/Math.max(r,.05),1.2);edge.push(new T.Vector3(s*(r+.005)*Math.sin(a),y,(r+.005)*Math.cos(a)));}
   h.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(edge),120,.0075,8,false),gold));
   const eb=new T.SphereGeometry(.0085,7,5),ec=new T.CatmullRomCurve3(edge),en=Math.round(ec.getLength()/.022);for(let k=0;k<=en;k++){const m=new T.Mesh(eb,gold);m.position.copy(ec.getPointAt(k/en));h.add(m);}
   const crown=[];for(let i=i0+1;i<=i1-1;i++){const[r,y]=prof[i],dm=(d0+d1)/2,a=Math.min(dm/Math.max(r,.05),1.2);crown.push(new T.Vector3(s*(r+.017)*Math.sin(a),y,(r+.017)*Math.cos(a)));}
   const cc=new T.CatmullRomCurve3(crown),cn=Math.round(cc.getLength()/.036),pg=new T.SphereGeometry(.0175,10,7);for(let k=0;k<=cn;k++){const p=new T.Mesh(pg,pearlM);p.position.copy(cc.getPointAt(k/cn));p.castShadow=true;h.add(p);}}});
 // RAISED gold acanthus scrollwork (Bishoy's target): a mirrored lyre/heart of C-scrolls ending in volutes, framing the middle rose on each half, front and back, with acanthus leaves and beads
 [1,-1].forEach(zs=>{addScroll(h,s,zs);addRoses(h,s,zs);});
 // inner gold arched rim + pearl edge (Bishoy's target): a rounded gold lip just inside each half's opening, arching over the top, beaded with small pearls
 {const arch=[];for(let i=7;i<=70;i++){const[r,y]=prof[i];arch.push(new T.Vector3(s*.03,y,r-.018));}for(let i=70;i>=7;i--){const[r,y]=prof[i];arch.push(new T.Vector3(s*.03,y,-(r-.018)));}
  const ac=new T.CatmullRomCurve3(arch);h.add(new T.Mesh(new T.TubeGeometry(ac,200,.017,10,false),gold));
  const inner=[];for(let i=8;i<=68;i++){const[r,y]=prof[i];inner.push(new T.Vector3(s*.058,y,r-.02));}for(let i=68;i>=8;i--){const[r,y]=prof[i];inner.push(new T.Vector3(s*.058,y,-(r-.02)));}
  const ic=new T.CatmullRomCurve3(inner),L=ic.getLength(),n=Math.round(L/.03),pg=new T.SphereGeometry(.0125,8,6);
  for(let k=0;k<=n;k++){const p=new T.Mesh(pg,pearlM);p.position.copy(ic.getPointAt(k/n));h.add(p);}}
 // v43 GOLD HEART IN THE VELVET (Bishoy): each half carries half a heart traced in gold and pearls on its velvet lining; when the halves stand open
 // side by side the two halves join into one heart, its point at the hinge (where the open halves meet) and its lobes framing the dancers.
 {const hp=[],KX=.055,KY=.0285,YP=.86;for(let k=0;k<=160;k++){const t=Math.PI*k/160;let S=KX*16*Math.pow(Math.sin(t),3);
   const Y=YP+KY*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t)+17),R=eggR(Y)-.036;S=Math.max(S,B-R+.04);let z=S-B;
   if(Math.abs(z)>R-.035)z=Math.sign(z)*(R-.035);hp.push(new T.Vector3(s*Math.sqrt(Math.max(R*R-z*z,0)),Y,z));}
  const hc=new T.CatmullRomCurve3(hp);const ht=new T.Mesh(new T.TubeGeometry(hc,220,.015,8,false),gold);h.add(ht);
  const n=Math.round(hc.getLength()/.032),pg=new T.SphereGeometry(.0135,8,6);for(let k=1;k<n;k++){const q=new T.Mesh(pg,pearlM);const P=hc.getPointAt(k/n);
   const N=new T.Vector3(-P.x,0,-P.z).normalize();q.position.copy(P).addScaledVector(N,.016);h.add(q);}
  [hp[0],hp[hp.length-1]].forEach(P=>{const g=new T.Mesh(new T.SphereGeometry(.019,12,8),gold);g.position.copy(P);h.add(g);});}
 if(s>0){const fin=new T.Mesh(new T.SphereGeometry(.05,16,12),gold);fin.position.set(.012,2*A+.02,0);h.add(fin);}});

// ---- The couple: one sculpted porcelain figurine (signed-distance sculpt, see sculpt.py), decoded from NCS_COUPLE
const couple=new T.Group();couple.position.y=EY+CL;scene.add(couple);
mk(couple,new T.CylinderGeometry(.3,.32,.035,64),gold,[0,-.018,0]);
mk(couple,new T.TorusGeometry(.31,.008,8,64),pearlM,[0,0,0],[Math.PI/2,0,0]);
// v27 FIGURE SCALE: the couple is 24% larger (FIG_SCALE 1.05->1.3) and raised (CL .2->.4) so they fill the open egg as in Bishoy's design;
// a slim fluted gold spindle with beaded collars carries their stage down to the egg floor, and the halves open a little wider (.62->.75 rad).
(function(){const H=CL+.035;// v42: the spindle runs down through the egg floor to the cup collar, so it stands on something when the halves are open
mk(couple,new T.CylinderGeometry(.045,.07,H,20),gold,[0,-.018-H/2,0]);
 mk(couple,new T.CylinderGeometry(.075,.12,.045,24),gold,[0,-.018-H+.02,0]);
 [-.05,-.018-H*.55].forEach(y=>mk(couple,new T.TorusGeometry(.058,.011,6,20),gold,[0,y,0],[Math.PI/2,0,0]));
})();
const figure=new T.Group();figure.scale.setScalar(FIG_SCALE);couple.add(figure);
// v30: gown and gloves glazed warm ivory (measured against Bishoy's photo) instead of stark white
// v34 ANATOMY: the couple is now built from a CC0 anatomical base body (MakeHuman), posed in a waltz hold and dressed offline; palette adds painted eyes, lips, brows
const PAL=[0xe8b89c,0xebdcc6,0x35251b,0x9a6b47,0x8c6646,0xc99a55,0xfbf8f3,0x1d140e,0xc98a80,0xe0ccb2,0x6b4630,0xf3ece2,0xcf8a80,0x8a6650,0xecb0a0,0x5a4030,0x20140c,0xd49c90,0x8fa57c];
const NOMIX=new Set([5,6,10,11,16]);// gold and the eyes keep crisp edges
const BRIDE_HEAD={c:[-0.0823, 0.7584, -0.0282],fwd:[0.8678, 0.4969, 0.0],up:[-0.4969, 0.8678, 0.0],rt:[-0.0, -0.0, 1.0],sc:.85};
// v32 BEAUTIFUL FIGURES: satin bisque glaze (soft sheen instead of a plastic shine) and warm peach porcelain skin, measured against Bishoy's figurine
const figGlaze=new T.MeshPhysicalMaterial({vertexColors:true,roughness:.5,clearcoat:.3,clearcoatRoughness:.35,envMapIntensity:.45});
// hand-painted porcelain faces: soft blush, tinted lips, closed lash lines and brows, blended into the vertex glaze
function paintFaces(pos,col,mat,nv){
 const HEADS=[{c:[-.047,.8,0],yaw:0,tilt:.36,sc:.93,lip:0xc97f76,lipW:.9,lash:.95,brow:0x6b4a36},
              {c:[.058,.838,0],yaw:Math.PI,tilt:-.3,sc:1,lip:0xcf9285,lipW:.55,lash:.8,brow:0x4a3324}];
 const lin=h=>new T.Color(h).convertSRGBToLinear(),BL=lin(0xeaa598),INK=lin(0x3b2a1e);
 const ell=(q,c,r)=>{const x=(q[0]-c[0])/r[0],y=(q[1]-c[1])/r[1],z=(q[2]-c[2])/r[2];const d=x*x+y*y+z*z;return d<1?(1-d)*(1-d):0;};
 const band=(d,w)=>{const t=d/w;return t<1?(1-t*t)*(1-t*t):0;};
 HEADS.forEach(H=>{const cy=Math.cos(H.yaw),sy=Math.sin(H.yaw),ct=Math.cos(H.tilt),st=Math.sin(H.tilt);
  const M=[[cy*ct,-cy*st,sy],[st,ct,0],[-sy*ct,sy*st,cy]];const LP=lin(H.lip),BR=lin(H.brow);
  const mix=(i,c,w)=>{if(w<=0)return;w=Math.min(w,1);col[i*3]+=(c.r-col[i*3])*w;col[i*3+1]+=(c.g-col[i*3+1])*w;col[i*3+2]+=(c.b-col[i*3+2])*w;};
  for(let i=0;i<nv;i++){if(mat[i]!==0)continue;const d=[pos[i*3]-H.c[0],pos[i*3+1]-H.c[1],pos[i*3+2]-H.c[2]];
   if(d[0]*d[0]+d[1]*d[1]+d[2]*d[2]>.0032)continue;
   const q=[0,1,2].map(j=>(d[0]*M[0][j]+d[1]*M[1][j]+d[2]*M[2][j])/H.sc);if(q[0]<.018||q[0]>.065)continue;
   [-1,1].forEach(zs=>{mix(i,BL,.85*ell(q,[.027,-.017,zs*.024],[.016,.012,.013]));
    const bz=q[2]-zs*.016;if(Math.abs(bz)<.012&&q[0]>.026)mix(i,BR,.7*band(Math.abs(q[1]-(.0195-34*bz*bz)),.0026));});
   mix(i,LP,H.lipW*ell(q,[.04,-.026,0],[.009,.005,.011]));}});
}
// open, smiling painted porcelain eyes (Bishoy's target): glossy brown iris, white catch-light, arched upper lash
// line with a flick, smile crease beneath; laid onto the face surface in each head's local frame
const HEADS_E=[{c:[-.047,.8,0],yaw:0,tilt:.36,sc:.93},{c:[.058,.838,0],yaw:Math.PI,tilt:-.3,sc:1}];
const irisM=new T.MeshPhysicalMaterial({color:0x2e1c12,roughness:.3,clearcoat:.7,clearcoatRoughness:.08,envMapIntensity:.35});
const glintM=new T.MeshBasicMaterial({color:0xfffaf2});
const lashM=new T.MeshPhysicalMaterial({color:0x1e130c,roughness:.4,clearcoat:.5,envMapIntensity:.3});
const creaseM=new T.MeshPhysicalMaterial({color:0xb5776b,roughness:.6,clearcoat:.2,envMapIntensity:.3});
function addEyes(pos,mat,nv){
 HEADS_E.forEach(H=>{const cy=Math.cos(H.yaw),sy=Math.sin(H.yaw),ct=Math.cos(H.tilt),st=Math.sin(H.tilt);
  const M=[[cy*ct,-cy*st,sy],[st,ct,0],[-sy*ct,sy*st,cy]],Q=[];
  for(let i=0;i<nv;i++){if(mat[i]!==0)continue;const d=[pos[i*3]-H.c[0],pos[i*3+1]-H.c[1],pos[i*3+2]-H.c[2]];
   if(d[0]*d[0]+d[1]*d[1]+d[2]*d[2]>.0032)continue;const q=[0,1,2].map(j=>(d[0]*M[0][j]+d[1]*M[1][j]+d[2]*M[2][j])/H.sc);if(q[0]>.015&&q[0]<.065)Q.push(q);}
  // face surface depth at (y,z): weighted average of the front-most nearby vertices
  const surf=(y,z)=>{let best=-1,w=0,s=0;for(const q of Q){const r=Math.hypot(q[1]-y,q[2]-z);if(r<.0055){const k=1-r/.0055;s+=q[0]*k;w+=k;if(q[0]>best)best=q[0];}}return w?Math.max(s/w,best-.0012):.04;};
  const g=new T.Group();const m4=new T.Matrix4().makeBasis(new T.Vector3(M[0][0],M[1][0],M[2][0]),new T.Vector3(M[0][1],M[1][1],M[2][1]),new T.Vector3(M[0][2],M[1][2],M[2][2]));
  g.quaternion.setFromRotationMatrix(m4);g.position.set(...H.c);g.scale.setScalar(H.sc);figure.add(g);
  const place=(o,y,z,lift)=>{const x=surf(y,z)+lift;o.position.set(x,y,z);const n=new T.Vector3(x,y*.5,z*.6).normalize();o.quaternion.setFromUnitVectors(new T.Vector3(1,0,0),n);g.add(o);};
  [-1,1].forEach(zs=>{const ez=zs*.0155,ey=.0035;
   const iris=new T.Mesh(new T.SphereGeometry(1,20,14),irisM);iris.scale.set(.0014,.0074,.0058);place(iris,ey,ez,.0005);
   const gl=new T.Mesh(new T.SphereGeometry(1,10,8),glintM);gl.scale.set(.0007,.0019,.0016);place(gl,ey+.0026,ez-zs*.0014,.0017);
   const lp=[];for(let k=0;k<=12;k++){const t=k/12,dz=(t-.5)*.0136;lp.push(new T.Vector3(0,ey+.0056-34*dz*dz+(zs*dz>0?.0016*Math.pow(t>.5?2*t-1:1-2*t,3):0),ez+dz));}
   lp.forEach(p=>p.x=surf(p.y,p.z)+.0009);
   const lash=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(lp),24,.0011,6,false),lashM);g.add(lash);
   const cp=[];for(let k=0;k<=8;k++){const dz=(k/8-.5)*.0100;const y=ey-.0072+20*dz*dz;cp.push(new T.Vector3(surf(y,ez+dz)+.0002,y,ez+dz));}
   g.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(cp),16,.0005,5,false),creaseM));});
 });
}
async function loadCouple(){
 const bin=Uint8Array.from(atob(window.NCS_COUPLE),c=>c.charCodeAt(0));
 const buf=await new Response(new Blob([bin]).stream().pipeThrough(new DecompressionStream('deflate'))).arrayBuffer();
 const dv=new DataView(buf),nv=dv.getUint32(0,true),nf=dv.getUint32(4,true),lo=[],hi=[];
 for(let i=0;i<3;i++){lo.push(dv.getFloat32(8+i*4,true));hi.push(dv.getFloat32(20+i*4,true));}
 let o=32;const q=new Uint16Array(buf.slice(o,o+nv*6));o+=nv*6;const mat=new Uint8Array(buf.slice(o,o+nv));o+=nv;
 const I=nv<65536?new Uint16Array(buf.slice(o,o+nf*6)):new Uint32Array(buf.slice(o,o+nf*12));
 const pos=new Float32Array(nv*3),col=new Float32Array(nv*3),cc=new T.Color();
 for(let i=0;i<nv*3;i++){const k=i%3;pos[i]=lo[k]+q[i]/65535*(hi[k]-lo[k]);}
 for(let i=0;i<nv;i++){cc.setHex(PAL[mat[i]]).convertSRGBToLinear();col[i*3]=cc.r;col[i*3+1]=cc.g;col[i*3+2]=cc.b;}
 // soften the stair-stepped seams between glaze colours (hairline, sash, shirt front): two neighbour-averaging passes
 for(let pass=0;pass<2;pass++){const acc=new Float32Array(nv*3),cnt=new Uint16Array(nv);
  for(let f=0;f<nf;f++){const t=[I[f*3],I[f*3+1],I[f*3+2]];for(let a=0;a<3;a++){const u=t[a];if(NOMIX.has(mat[u]))continue;for(let b=1;b<3;b++){const w=t[(a+b)%3];if(NOMIX.has(mat[w]))continue;acc[u*3]+=col[w*3];acc[u*3+1]+=col[w*3+1];acc[u*3+2]+=col[w*3+2];cnt[u]++;}}}
  for(let i=0;i<nv;i++)if(cnt[i])for(let k=0;k<3;k++)col[i*3+k]=.45*col[i*3+k]+.55*acc[i*3+k]/cnt[i];}
 // v34: faces and eyes are painted into the anatomical mesh itself (paintFaces/addEyes were for the old sculpt)
 const body=[],metal=[];
 for(let f=0;f<nf;f++){const a=I[f*3],b=I[f*3+1],c=I[f*3+2];((mat[a]===5&&mat[b]===5)||(mat[b]===5&&mat[c]===5)||(mat[a]===5&&mat[c]===5)?metal:body).push(a,b,c);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));g.setAttribute('color',new T.BufferAttribute(col,3));
 g.setIndex(body.concat(metal));g.addGroup(0,body.length,0);g.addGroup(body.length,metal.length,1);g.computeVertexNormals();
 const mesh=new T.Mesh(g,[figGlaze,gold]);mesh.castShadow=true;mesh.receiveShadow=true;figure.add(mesh);
}
// bride's gold crown, pink cabbage rose and sage leaves at the chignon (Bishoy's target), in her head's local frame
(function(){const H=new T.Group();H.position.set(...BRIDE_HEAD.c);H.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(new T.Vector3(...BRIDE_HEAD.fwd),new T.Vector3(...BRIDE_HEAD.up),new T.Vector3(...BRIDE_HEAD.rt)));H.scale.setScalar(BRIDE_HEAD.sc);figure.add(H);
 const roseM=new T.MeshPhysicalMaterial({color:new T.Color(0xdc958b).convertSRGBToLinear(),roughness:.42,clearcoat:.6,clearcoatRoughness:.15,side:T.DoubleSide,envMapIntensity:.6});
 const roseD=new T.MeshPhysicalMaterial({color:new T.Color(0xbf7268).convertSRGBToLinear(),roughness:.45,clearcoat:.5,side:T.DoubleSide,envMapIntensity:.5});
 // crown: slim band with seven tapering points, pearl tips, a taller centre point; sits on the hair, leaning back
 const C=new T.Group();C.position.set(0,.06,0);C.rotation.z=-.15;C.scale.setScalar(.85);H.add(C);
 const band=new T.Mesh(new T.CylinderGeometry(.0205,.0225,.006,40,1,true),gold);band.material=gold;C.add(band);
 C.add(new T.Mesh(new T.TorusGeometry(.0225,.0012,6,40),gold).rotateX(Math.PI/2).translateZ(.003));
 for(let i=0;i<7;i++){const a=(i-3)/3*1.25,tall=i===3?.017:(i%2?.012:.009);
  const pt=new T.Mesh(new T.ConeGeometry(.0034,tall,8),gold);pt.position.set(Math.cos(a)*.0215,.003+tall/2,Math.sin(a)*.0215);pt.rotation.z=-Math.cos(a)*.15;pt.rotation.x=Math.sin(a)*.15;C.add(pt);
  const pr=new T.Mesh(new T.SphereGeometry(i===3?.0032:.0022,10,8),pearlM);pr.position.set(Math.cos(a)*.0215*1.03,.004+tall,Math.sin(a)*.0215*1.03);C.add(pr);}
 // rose on the side of the chignon: bud + two rings of cupped petals, with two sage leaves
 const R=new T.Group();R.position.set(-.045,.03,.03);R.lookAt(new T.Vector3(-.2,.2,1));R.scale.setScalar(1.3);H.add(R);
 R.add(new T.Mesh(new T.SphereGeometry(.0045,12,10),roseD).translateZ(.002));
 [[5,.0055,.0055,.5,roseD],[7,.009,.0075,.95,roseM],[9,.0125,.009,1.3,roseM]].forEach(([n,rad,sz,open,m],ring)=>{
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2+ring*.6,p=new T.Mesh(new T.SphereGeometry(sz,12,8,0,Math.PI*2,0,Math.PI*.5),m);
   p.scale.set(1,.55,.9);p.position.set(Math.cos(a)*rad*.6,Math.sin(a)*rad*.6,-ring*.0012);p.rotation.z=a-Math.PI/2;p.rotateX(-open);R.add(p);}});
 [[-.4,1],[.9,-1]].forEach(([a,s])=>{const l=new T.Mesh(new T.SphereGeometry(1,14,8),leafM);l.scale.set(.013,.005,.0025);
  l.position.set(Math.cos(a)*.016*s,Math.sin(a)*.016,-.003);l.rotation.z=a+(s<0?Math.PI:0);R.add(l);});
 H.traverse(o=>{if(o.isMesh)o.castShadow=true;});
})();
// bride's dusty-rose satin sash bow at the back waist with two long ribbon tails down the skirt (Bishoy's target)
(false)&&(function(){const satin=new T.MeshPhysicalMaterial({color:new T.Color(0xc98a80).convertSRGBToLinear(),roughness:.34,clearcoat:.7,clearcoatRoughness:.14,side:T.DoubleSide,envMapIntensity:.45});
 const bx=-.075,Y0=.512,surf=(y,z)=>{const t=Math.max(0,Math.min(1,(.53-y)/.53));let r=.046+.15*Math.pow(t,1.2);
  const th=Math.PI-Math.asin(Math.min(.95,Math.abs(z)/r));r*=(1+.6*Math.pow(-Math.cos(th),3)*Math.pow(t,4))*(1+.055*Math.sin(9*th+6*y)*Math.pow(t,1.3));
  return bx-Math.sqrt(Math.max(r*r-z*z,0))-.003;};
 const sheet=(U,V,f)=>{const pos=[],idx=[];for(let i=0;i<=U;i++)for(let j=0;j<=V;j++)pos.push(...f(i/U,j/V*2-1));
  for(let i=0;i<U;i++)for(let j=0;j<V;j++){const a=i*(V+1)+j,b=a+V+1;idx.push(a,b,a+1,b,b+1,a+1);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();const m=new T.Mesh(g,satin);m.castShadow=true;figure.add(m);};
 const xb=surf(Y0,0)-.002;
 [-1,1].forEach(zs=>{
  // loop: a flattened ribbon ring going out from the knot and folding back, pinched at the knot, widest at the far end, tilted up
  sheet(40,6,(u,v)=>{const a=u*Math.PI*2,L=.044,z=zs*L*(1-Math.cos(a))/2,x=xb-.014*Math.sin(a)-.006*(1-Math.cos(a)),w=.0045+.011*Math.pow(Math.sin(a/2),1.5);
   return[x+.0015*v*v,Y0+.3*Math.abs(z)+v*w,z];});
  // tail: falls from the knot down the back of the skirt, flaring slightly, with a gentle sway and a V-cut end
  sheet(36,4,(u,v)=>{const y=Y0-.006-u*.3,zc=zs*(.006+.022*u)+.004*Math.sin(u*7+zs),w=.0075+.004*u,z=zc+v*w;
   return[surf(y,zc)-.0015-.002*v*v,y+(u===1?.008*(1-Math.abs(v)):0),z];});});
 // knot
 const k=new T.Mesh(new T.SphereGeometry(1,16,12),satin);k.scale.set(.007,.0105,.009);k.position.set(xb-.002,Y0,0);k.castShadow=true;figure.add(k);
})();
// translucent tulle veil falling from her chignon
const veil=(function(){const U=16,VN=32,pos=[],idx=[];for(let i=0;i<=VN;i++){const v=i/VN;for(let j=0;j<=U;j++){const u=j/U*2-1,w=.012+.11*Math.pow(v,1.1);
  pos.push(-.1-.06*v-.04*v*v+.006*Math.sin(v*14+u*3),.81-v*.46,u*w+.004*Math.sin(u*9+v*6));}}
 for(let i=0;i<VN;i++)for(let j=0;j<U;j++){const a=i*(U+1)+j,b=a+U+1;idx.push(a,b,a+1,b,b+1,a+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);
 {const Ho=new T.Matrix4().compose(new T.Vector3(-.047,.8,0),new T.Quaternion().setFromAxisAngle(new T.Vector3(0,0,1),.36),new T.Vector3(.93,.93,.93));
  const Hn=new T.Matrix4().makeBasis(new T.Vector3(...BRIDE_HEAD.fwd),new T.Vector3(...BRIDE_HEAD.up),new T.Vector3(...BRIDE_HEAD.rt)).scale(new T.Vector3(BRIDE_HEAD.sc,BRIDE_HEAD.sc,BRIDE_HEAD.sc)).setPosition(...BRIDE_HEAD.c);
  g.applyMatrix4(Hn.multiply(Ho.invert()));}g.computeVertexNormals();
 // net tulle: a fine diamond mesh as an alpha texture (Bishoy's reference)
 const nc=document.createElement('canvas');nc.width=nc.height=128;const x=nc.getContext('2d',{willReadFrequently:true});x.strokeStyle='#fff';x.lineWidth=2.2;
 for(let k=-128;k<=256;k+=16){x.beginPath();x.moveTo(k,0);x.lineTo(k+128,128);x.stroke();x.beginPath();x.moveTo(k,128);x.lineTo(k+128,0);x.stroke();}
 const nt=new T.CanvasTexture(nc);nt.wrapS=nt.wrapT=T.RepeatWrapping;nt.repeat.set(6,20);
 const uv=[];for(let i=0;i<=VN;i++)for(let j=0;j<=U;j++)uv.push(j/U,i/VN);g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
 const m=new T.Mesh(g,new T.MeshPhysicalMaterial({color:new T.Color(0xe9d3c6).convertSRGBToLinear(),alphaMap:nt,roughness:.8,transparent:true,opacity:.9,alphaTest:.02,side:T.DoubleSide,depthWrite:false}));figure.add(m);return m;})();
if(window.NCS_COUPLE)loadCouple().then(()=>window.__lotusKick&&window.__lotusKick(),e=>console.warn('couple',e));

const ground=new T.Mesh(new T.PlaneGeometry(30,30),new T.ShadowMaterial({opacity:.12}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const controls={target:new T.Vector3(),update(){camera.lookAt(this.target);},addEventListener(){}};
controls.target.set(0,1.36,0);controls.update();
function size(){const w=wrap.clientWidth,h=wrap.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();
 const v=camera.position.clone().sub(controls.target).setLength(Math.max(6.7,5.2/camera.aspect));camera.position.copy(controls.target).add(v);controls.update();}
new ResizeObserver(()=>{size();window.__lotusKick&&window.__lotusKick();}).observe(wrap);size();

// ---- Music state comes from the site's music button (nile-musicbox.js toggles its "on" class)
const mb=document.getElementById('musicBtn');let playing=mb.classList.contains('on');

// ---- Animation: egg opens like a flower, couple turns, everything glides to rest
const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
// v28 DANCE: instead of a full turntable spin (which would sweep her train through the hinged back), the couple sway in a slow,
// gentle turn of +-0.6 rad (8 s) around a pose facing the viewer, so their faces stay in view; still when the music stops.
/* v34: turned so both faces read in profile */const YAW0=.2,SWAY=.7;let ph=0;couple.rotation.y=YAW0;
const clock=new T.Clock();let open=0,spd=0,amp=0;const OPEN_T=reduce?1.6:3.6,SWAY_T=2.4;/* v44: seconds for a full open / for the dance to fade in or out */const full=Math.PI*2/(reduce?16:8);
// PERFORMANCE (v26): couple mesh quadric-decimated 187k->94k tris (decimate.py); small bead/pearl/petal spheres and fine scroll tubes use fewer segments.
// v42 hinge: gold pin with five knuckles alternating between the halves, end caps, and a slim gold column down the pin's line to the base dome
(function(){const PZ=PIVOT.z,y0=EY+A-.2;
 for(let k=0;k<5;k++){const kn=new T.Mesh(new T.CylinderGeometry(.017,.017,.07,16),gold);kn.position.set(0,A-.2+.04+k*.08,PZ);halves[k%2][0].add(kn);}
 const top=EY+A+.23,bot=.56;const col=new T.Mesh(new T.CylinderGeometry(.0085,.0085,top-bot,12),gold);col.position.set(0,(top+bot)/2,PZ);col.castShadow=true;scene.add(col);
 [[top,.02],[y0-.01,.016],[y0+.42,.016]].forEach(([y,r])=>{const c=new T.Mesh(new T.SphereGeometry(r,12,8),gold);c.position.set(0,y,PZ);scene.add(c);});
 const ft=new T.Mesh(new T.CylinderGeometry(.018,.04,.05,16),gold);ft.position.set(0,bot+.01,PZ);scene.add(ft);
 [.75,1.3].forEach(y=>{const t=new T.Mesh(new T.TorusGeometry(.014,.005,6,16),gold);t.rotation.x=Math.PI/2;t.position.set(0,y,PZ);scene.add(t);});
})();
// PERFORMANCE (v23): batch identical static meshes (beads, pearls, petals, leaves) into InstancedMesh per moving part.
// Moving parts keep their own transforms: the scene, each egg half, each cup leaf, the couple; the veil is left alone.
(function(){scene.updateMatrixWorld(true);const roots=[scene,couple,...halves.map(x=>x[0]),...cupLeaves],R=new Set(roots);
 const gk=g=>g.parameters?g.type+JSON.stringify(g.parameters):'u'+g.id,inv=new T.Matrix4(),rel=new T.Matrix4();
 roots.forEach(root=>{inv.copy(root.matrixWorld).invert();const groups=new Map();
  (function walk(o){o.children.forEach(c=>{if(R.has(c))return;
   if(c.isMesh&&!c.isInstancedMesh&&c!==veil&&!c.children.length&&!Array.isArray(c.material)&&c.visible){rel.multiplyMatrices(inv,c.matrixWorld);
    if(rel.determinant()>0){const k=gk(c.geometry)+'|'+c.material.id+'|'+c.castShadow+c.receiveShadow+c.renderOrder;(groups.get(k)||groups.set(k,[]).get(k)).push([c,rel.clone()]);}}
   walk(c);});})(root);
  groups.forEach(list=>{if(list.length<2)return;const m0=list[0][0],im=new T.InstancedMesh(m0.geometry,m0.material,list.length);
   list.forEach(([c,M],i)=>{im.setMatrixAt(i,M);c.parent.remove(c);});im.castShadow=m0.castShadow;im.receiveShadow=m0.receiveShadow;im.renderOrder=m0.renderOrder;
   im.frustumCulled=false;root.add(im);});});})();
// v31 BALLROOM MOOD (inspired by the warm, glowing ballroom scenes of classic hand-animated films; original design, no characters copied):
// while the music plays the studio dims around the piece, a warm golden spotlight falls on the couple, a few slow specks of light drift
// in the niche, the view eases in toward the dancers and the couple lean gently with the waltz. Everything settles and stops with the music.
const mood=(function(){
 cv.style.position='relative';cv.style.zIndex=1;
 const dim=document.createElement('div');dim.setAttribute('aria-hidden','true');
 dim.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:0;opacity:0;background:radial-gradient(ellipse 46% 52% at 50% 42%,rgba(255,214,150,.38) 0%,rgba(236,190,128,.16) 45%,rgba(96,58,26,.4) 100%)';
 wrap.insertBefore(dim,cv);
 const spot=new T.SpotLight(0xffd59a,0,9,.34,.75,1.4);spot.position.set(.5,4.6,2.6);spot.target.position.set(0,EY+CL+.6,0);scene.add(spot,spot.target);
 const NP=56,pos=new Float32Array(NP*3),sp=[];
 for(let i=0;i<NP;i++){const a=Math.random()*6.283,r=.3+Math.random()*.22;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=EY+CL+.15+Math.random()*1.2;pos[i*3+2]=-Math.abs(Math.sin(a))*r*.75-.03;/* stars drift around and behind the couple, never across their faces */sp.push(.06+Math.random()*.1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));
 const c=document.createElement('canvas');c.width=c.height=64;const q=c.getContext('2d',{willReadFrequently:true});const rg=q.createRadialGradient(32,32,0,32,32,32);
 rg.addColorStop(0,'rgba(255,252,240,1)');rg.addColorStop(.12,'rgba(255,232,180,.8)');rg.addColorStop(.32,'rgba(240,200,120,0)');q.fillStyle=rg;q.fillRect(0,0,64,64);
 // v32 STARS (Bishoy: "stars not bubbles"): a four-point twinkling star with long fine rays and short diagonal glints
 q.globalCompositeOperation='lighter';const ray=(ang,len,w,a)=>{q.save();q.translate(32,32);q.rotate(ang);const lg=q.createLinearGradient(0,0,0,-len);lg.addColorStop(0,'rgba(255,250,235,'+a+')');lg.addColorStop(1,'rgba(255,220,150,0)');q.fillStyle=lg;
  q.beginPath();q.moveTo(-w,0);q.quadraticCurveTo(-w*.25,-len*.35,0,-len);q.quadraticCurveTo(w*.25,-len*.35,w,0);q.closePath();q.fill();q.restore();};
 for(let k=0;k<4;k++)ray(k*Math.PI/2,31,4.2,1);for(let k=0;k<4;k++)ray(Math.PI/4+k*Math.PI/2,12,2.4,.8);
 const pm=new T.PointsMaterial({map:new T.CanvasTexture(c),color:0xffc65a,toneMapped:false,size:.3,transparent:true,opacity:0,depthWrite:false,blending:T.NormalBlending});
 const pts=new T.Points(g,pm);pts.visible=false;scene.add(pts);
 const g2=new T.BufferGeometry();g2.setAttribute('position',g.attributes.position);g2.setDrawRange(NP/2,NP/2);g.setDrawRange(0,NP/2);
 const pm2=pm.clone();pm2.size=pm.size*.8;const pts2=new T.Points(g2,pm2);pts2.visible=false;scene.add(pts2);let tw=0;
 const base={key:key.intensity,fill:fill.intensity,hemi:hemi.intensity,rim:rim.intensity};
 return function(e,mv,dt){// e: 0 closed .. 1 open; mv: 0..1 dance speed (0 when the music has stopped)
  dim.style.opacity=e.toFixed(3);spot.intensity=1.6*e;
  key.intensity=base.key*(1-.3*e);fill.intensity=base.fill*(1-.35*e);hemi.intensity=base.hemi*(1-.3*e);rim.intensity=base.rim*(1+.4*e);
  tw+=mv*dt*2.2;pts.visible=pts2.visible=e>.02;pm.opacity=.9*e*e*(.6+.4*Math.sin(tw));pm2.opacity=.9*e*e*(.6-.4*Math.sin(tw*1.3));
  if(mv>0){for(let i=0;i<NP;i++){let y=pos[i*3+1]+sp[i]*mv*dt;if(y>EY+CL+1.4)y=EY+CL;pos[i*3+1]=y;}g.attributes.position.needsUpdate=true;}
  if(CAM_EASE){const D0=Math.max(6.7,5.2/camera.aspect);
   const v=camera.position.clone().sub(controls.target);if(!dragged){const az=A0*(1-e),hz=Math.hypot(v.x,v.z);v.x=Math.sin(az)*hz;v.z=Math.cos(az)*hz;}controls.target.y=1.36+.56*e;v.setLength(D0*(1-.13*e));camera.position.copy(controls.target).add(v);}
 };})();
let CAM_EASE=!reduce,dragged=false;const A0=Math.atan2(.9,6.4);controls.addEventListener('start',()=>{dragged=true;});// the view eases round to face the open egg head-on, unless the visitor has turned it themselves
let raf=0,frames=3;function kick(){frames=Math.max(frames,3);if(!raf&&!document.hidden){clock.getDelta();raf=requestAnimationFrame(loop);}}
window.__lotusKick=kick;
new MutationObserver(()=>{playing=mb.classList.contains('on');kick();}).observe(mb,{attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)kick();});
function loop(){raf=0;const dt=Math.min(clock.getDelta(),.05);
 // v44 SMOOTH MOTION: open/close is a constant-rate progress eased with smoothstep (starts and stops with zero speed, reverses cleanly mid-way);
 // the dance amplitude fades in after the halves are open and fades out back to the rest pose before they close.
 const ss=x=>x*x*(3-2*x),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 open=clamp(open+clamp((playing||amp>0?1:0)-open,-dt/OPEN_T,dt/OPEN_T),0,1);const e=ss(open);
 const le=ss(clamp(open/.42,0,1)),he=ss(clamp((open-.28)/.72,0,1));// leaves lead, halves follow
 cupLeaves.forEach(P=>{P.rotation.x=le*PEEL*(P.userData.k>.9?1:.92);});
 halves.forEach(([h,s])=>{h.quaternion.setFromAxisAngle(_yA,s*he*(window._OA||DOOR));_pv.copy(PIVOT).applyQuaternion(h.quaternion);h.position.set(PIVOT.x-_pv.x,EY,PIVOT.z-_pv.z);});
 amp=clamp(amp+((playing&&open>.92)?dt:-dt)/SWAY_T,0,1);const as=ss(amp);spd=full*Math.min(1,as*2.5);ph+=spd*dt;const SW=SWAY*as;couple.rotation.y=YAW0+SW*Math.sin(ph);couple.rotation.z=.04*as*Math.sin(ph*2);mood(e,spd/full,dt);
 veil.rotation.y=Math.sin(clock.elapsedTime*.9)*.03*(spd/full);
 controls.update();renderer.render(scene,camera);
 if(playing||open>0||amp>0)frames=3;else frames--;
 if(frames>0&&!document.hidden)raf=requestAnimationFrame(loop);}
kick();
mb.classList.add('egg-ready');
})();

