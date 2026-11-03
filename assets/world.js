import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export const MAPS=[
 {id:'hoian',name:'HỘI AN, Việt Nam',short:'Hội An',emoji:'🏮',desc:'Đèn lồng bay, sông Hoài - cổng to nhất',bg:0x1e1b4b,ground:0x312e81,big:true},
 {id:'halong',name:'HẠ LONG, Việt Nam',short:'Hạ Long',emoji:'⛵',desc:'Thuyền buồm lướt giữa núi đá',bg:0xbae6fd,ground:0x38bdf8},
 {id:'watarun',name:'WAT ARUN, Thái Lan',short:'Wat Arun',emoji:'🛕',desc:'Chùa vàng Thái Lan lấp lánh bên sông, tượng Phật vàng',bg:0x7c2d12,ground:0xf59e0b,temple:true},
 {id:'kyoto',name:'KYOTO, Nhật Bản',short:'Kyoto',emoji:'🏯',desc:'Hoa anh đào rơi, chùa Nhật',bg:0x1e1b4b,ground:0x312e81},
 {id:'china',name:'TỬ CẤM THÀNH, Trung Quốc',short:'Tử Cấm Thành',emoji:'🏯',desc:'Chùa Trung Quốc / Thiếu Lâm, vàng rực, khói hương, chuông chùa',bg:0x7f1d1d,ground:0xdc2626,temple:true},
 {id:'paris',name:'PARIS, Pháp',short:'Paris',emoji:'🗼',desc:'Tháp Eiffel về đêm, sao lấp lánh',bg:0x0f172a,ground:0x1e293b},
 {id:'santorini',name:'SANTORINI, Hy Lạp',short:'Santorini',emoji:'💙',desc:'Biển xanh, nhà trắng mái xanh',bg:0x38bdf8,ground:0xffffff},
 {id:'iceland',name:'ICELAND',short:'Iceland',emoji:'❄️',desc:'Cực quang xanh lá nhảy múa, tuyết rơi',bg:0x0f172a,ground:0xe0f2fe},
 {id:'maldives',name:'MALDIVES',short:'Maldives',emoji:'🌴',desc:'Biển trong, dừa đổ nghiêng',bg:0x67e8f9,ground:0xfef3c7},
 {id:'dubai',name:'DUBAI',short:'Dubai',emoji:'🏙️',desc:'Burj Khalifa chọc trời, sa mạc vàng',bg:0x0f172a,ground:0xf59e0b},
];
const rand=(a,b)=>a+Math.random()*(b-a);
function box(w,h,d,c,x=0,y=0,z=0,rx=0,ry=0,rz=0){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:c}));m.position.set(x,y,z);m.rotation.set(rx,ry,rz);return m}
function cone(r,h,c,x=0,y=0,z=0,seg=6){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg),new THREE.MeshLambertMaterial({color:c}));m.position.set(x,y,z);return m}
function sph(r,c,x=0,y=0,z=0,sx=1,sy=1,sz=1,mat=null){const m=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),mat||new THREE.MeshLambertMaterial({color:c}));m.position.set(x,y,z);m.scale.set(sx,sy,sz);return m}
function cyl(rt,rb,h,c,x=0,y=0,z=0,rz=0){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,8),new THREE.MeshLambertMaterial({color:c}));m.position.set(x,y,z);m.rotation.z=rz;return m}
function basic(c,op=1){return new THREE.MeshBasicMaterial({color:c,transparent:op<1,opacity:op})}
function textSprite(text){const c=document.createElement('canvas');c.width=360;c.height=72;const g=c.getContext('2d');g.fillStyle='rgba(0,0,0,.65)';g.beginPath();g.roundRect(10,8,340,52,26);g.fill();g.fillStyle='#fff';g.font='bold 28px Arial';g.textAlign='center';g.fillText(text,180,45);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true}));s.scale.set(5.6,1.1,1);return s}
function auroraTexture(c1,c2){const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');const gr=g.createLinearGradient(0,0,0,128);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.5,c1);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,512,128);g.fillStyle=c2;g.globalAlpha=.5;for(let i=0;i<40;i++)g.fillRect(i*13,20+Math.sin(i)*20,4,70);return new THREE.CanvasTexture(c)}
export function createWorld(canvas){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x0b1026);scene.fog=new THREE.Fog(0x0b1026,55,130);
 const camera=new THREE.PerspectiveCamera(58,1,.1,300);camera.position.set(0,18,30);
 const controls=new OrbitControls(camera,canvas);controls.target.set(0,2,0);controls.maxPolarAngle=1.45;controls.minDistance=8;controls.maxDistance=65;controls.enableDamping=true;
 scene.add(new THREE.AmbientLight(0xffffff,.9));const sun=new THREE.DirectionalLight(0xffffff,1);sun.position.set(20,30,10);scene.add(sun);
 const cyanLight=new THREE.PointLight(0x22d3ee,2,45);cyanLight.position.set(0,4,0);scene.add(cyanLight);
 let worldGroup=null,touristGroup=null,anim={},effects=[],portals=[],mode='hub',current=0,userAvatar=null,userName='Bạn',transitioning=null,beat=0;
 const tourists=[];let bodyMesh,headMesh;
 function flagTexture(){const c=document.createElement('canvas');c.width=120;c.height=80;const g=c.getContext('2d');g.fillStyle='#da251d';g.fillRect(0,0,120,80);g.fillStyle='#ff0';g.beginPath();const cx=60,cy=40;for(let i=0;i<5;i++){const a=-Math.PI/2+i*2*Math.PI/5,b=a+Math.PI/5;g.lineTo(cx+Math.cos(a)*22,cy+Math.sin(a)*22);g.lineTo(cx+Math.cos(b)*9,cy+Math.sin(b)*9)}g.closePath();g.fill();return new THREE.CanvasTexture(c)}
 function nameSprite(text){const c=document.createElement('canvas');c.width=256;c.height=64;const g=c.getContext('2d');g.fillStyle='rgba(0,0,0,.65)';g.beginPath();g.roundRect(28,8,200,44,22);g.fill();g.fillStyle='#fff';g.font='bold 26px Arial';g.textAlign='center';g.fillText(text,128,40);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true}));s.scale.set(3.4,0.85,1);return s}
 function makeAvatar(name,isUser,hair=0x92400e){const g=new THREE.Group();const col=isUser?0xf59e0b:0x3b82f6;g.add(box(.7,1,.45,col,0,.85,0));g.add(sph(.38,0xffdbac,0,1.65,0));g.add(sph(.4,hair,0,1.9,0,1,.55,1));g.add(box(.28,.55,.2,0x111827,-.2,.45,0));g.add(box(.28,.55,.2,0x111827,.2,.45,0));
  if(isUser){const pole=cyl(.03,.03,1.1,0x92400e,0,2.4,0);g.add(pole);const flag=new THREE.Mesh(new THREE.PlaneGeometry(1.1,.7),new THREE.MeshBasicMaterial({map:flagTexture(),side:THREE.DoubleSide}));flag.position.set(.6,2.65,0);g.add(flag);const sp=nameSprite(name);sp.position.set(0,3.4,0);g.add(sp);}return g}
 function buildTourists(){touristGroup=new THREE.Group();scene.add(touristGroup);const cols=[0xef4444,0xf59e0b,0x22c55e,0x3b82f6,0xec4899,0x8b5cf6,0x14b8a6,0xf97316];
  bodyMesh=new THREE.InstancedMesh(new THREE.CapsuleGeometry(.32,.55,3,8),new THREE.MeshLambertMaterial({color:0xffffff}),300);headMesh=new THREE.InstancedMesh(new THREE.SphereGeometry(.28,10,8),new THREE.MeshLambertMaterial({color:0xffdbac}),300);
  const col=new THREE.Color();for(let i=0;i<300;i++){tourists.push({x:rand(-26,26),z:rand(-22,22),tx:rand(-26,26),tz:rand(-22,22),sp:rand(.8,1.9),ph:rand(0,6)});bodyMesh.setColorAt(i,col.setHex(cols[i%cols.length]));}
  touristGroup.add(bodyMesh,headMesh);userAvatar=makeAvatar(userName,true);userAvatar.position.set(0,0,5);touristGroup.add(userAvatar);}
 function clearWorld(){if(worldGroup){scene.remove(worldGroup);worldGroup.traverse(o=>{if(o.geometry)o.geometry.dispose()});}if(touristGroup){scene.remove(touristGroup);tourists.length=0;}anim={};portals=[];effects.forEach(e=>scene.remove(e.group));effects=[];}
 function fallingPoints(n,color,size,area=30){const pos=new Float32Array(n*3);for(let i=0;i<n;i++){pos[i*3]=rand(-area,area);pos[i*3+1]=rand(0,18);pos[i*3+2]=rand(-area,area);}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));return new THREE.Points(geo,new THREE.PointsMaterial({color,size,transparent:true,opacity:.9}));}
 function miniLandmark(idx,parent){const g=new THREE.Group();
  if(idx===0){[0xeab308,0xef4444,0x22c55e].forEach((c,i)=>{g.add(box(1.1,.9,1,c,-1.2+i*1.2,.45,0));g.add(sph(.35,0,-1.2+i*1.2,1.4,0,1,1,1,basic(0xf59e0b)));});}
  if(idx===1){g.add(cone(1,1.8,0x4d7c0f,-1,.9,0));const sail=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.4),basic(0xffffff,.95));sail.position.set(1,1,0);g.add(sail);}
  if(idx===2){g.add(cone(.7,2.2,0xfacc15,0,1.1,0,4));g.add(cone(.45,1,0xf59e0b,0,2.4,0,4));g.add(box(.9,.8,.6,0xfacc15,1.2,.4,.6));g.add(sph(.35,0xfacc15,1.2,1.1,.6));}
  if(idx===3){g.add(box(1.4,.5,1.4,0xdc2626,0,.3,0));g.add(box(1.1,.5,1.1,0xdc2626,0,.9,0));g.add(cone(.8,.7,0x111827,0,1.5,0));g.add(sph(.5,0xf9a8d4,1.4,1,0));}
  if(idx===4){g.add(box(2,1,1.4,0xdc2626,0,.5,0));g.add(box(2.4,.4,1.8,0xfacc15,0,1.2,0));g.add(box(.3,1,.3,0x92400e,-.8,1.8,0));g.add(box(.3,1,.3,0x92400e,.8,1.8,0));}
  if(idx===5){g.add(box(.4,1.6,.4,0xf59e0b,-.7,.8,0,0,0,.3));g.add(box(.4,1.6,.4,0xf59e0b,.7,.8,0,0,0,-.3));g.add(box(1.8,.3,1.8,0xf59e0b,0,1.7,0));g.add(cyl(.08,.15,.7,0xf59e0b,0,2.4,0));}
  if(idx===6){g.add(box(2,1.2,1.5,0xffffff,0,.6,0));g.add(sph(.7,0x2563eb,0,1.5,0,1,.6,1));}
  if(idx===7){g.add(cone(1.5,2,0xe0f2fe,0,1,0));const a=new THREE.Mesh(new THREE.PlaneGeometry(3,.7),new THREE.MeshBasicMaterial({map:auroraTexture('rgba(34,197,94,.9)','rgba(34,197,94,.4)'),transparent:true,side:THREE.DoubleSide}));a.position.set(0,2.2,0);g.add(a);}
  if(idx===8){g.add(cyl(.25,.4,2,0x92400e,0,1,0,.35));for(let k=0;k<4;k++){const leaf=cone(.5,1.6,0x16a34a,0,2.1,0);leaf.rotation.z=.8+k*.3;g.add(leaf);}}
  if(idx===9){g.add(box(.8,3.2,.8,0x94a3b8,0,1.6,0));g.add(box(.55,1,.55,0xe2e8f0,0,3.6,0));g.add(box(.3,.8,.3,0xfacc15,0,4.4,0));}
  parent.add(g);return g;}
 function templeBell(parent,x,y,z,scale=1){const g=new THREE.Group();g.add(cyl(.2,.2,1.2,0x92400e,x,y+2.2,z));g.add(sph(.9,0xfacc15,x,y+1,z,1,.9,1));g.add(cyl(.6,.9,.8,0xf59e0b,x,y+.3,z));g.scale.setScalar(scale);parent.add(g);return g}
 function smoke(parent,x,y,z){const p=fallingPoints(50,0xd6d3d1,.4,2);p.position.set(x,y,z);parent.add(p);return p}
 function buildHub(){clearWorld();mode='hub';scene.background=new THREE.Color(0x0b1026);scene.fog=new THREE.Fog(0x0b1026,55,130);worldGroup=new THREE.Group();scene.add(worldGroup);anim={lanterns:[],orbit:[],sparkles:[]};
  const stars=fallingPoints(900,0xffffff,.35,55);stars.position.y=8;worldGroup.add(stars);anim.stars=stars;
  for(let i=0;i<3;i++){const a=new THREE.Mesh(new THREE.PlaneGeometry(90,14),new THREE.MeshBasicMaterial({map:auroraTexture(i===1?'rgba(168,85,247,.85)':'rgba(34,197,94,.85)','rgba(34,197,94,.3)'),transparent:true,opacity:.55,side:THREE.DoubleSide,depthWrite:false}));a.position.set(0,20+i*3,-28+i*4);a.rotation.x=.15;worldGroup.add(a);anim['aurora'+i]=a;}
  const floor=new THREE.Mesh(new THREE.CircleGeometry(11,40),new THREE.MeshLambertMaterial({color:0x0f172a}));floor.rotation.x=-Math.PI/2;floor.position.y=.02;worldGroup.add(floor);
  const ring1=new THREE.Mesh(new THREE.RingGeometry(9.6,10.4,48),basic(0x22d3ee,.9));ring1.rotation.x=-Math.PI/2;ring1.position.y=.08;worldGroup.add(ring1);anim.ring1=ring1;
  const ring2=new THREE.Mesh(new THREE.RingGeometry(6.8,7.2,48),basic(0xa855f7,.9));ring2.rotation.x=-Math.PI/2;ring2.position.y=.08;worldGroup.add(ring2);anim.ring2=ring2;
  const grid=new THREE.GridHelper(22,22,0x22d3ee,0x1e40af);grid.position.y=.06;grid.material.transparent=true;grid.material.opacity=.4;worldGroup.add(grid);
  const ground=new THREE.Mesh(new THREE.CircleGeometry(52,32),new THREE.MeshLambertMaterial({color:0x111827}));ground.rotation.x=-Math.PI/2;ground.position.y=-.02;worldGroup.add(ground);
  for(let i=0;i<55;i++){const l=sph(rand(.35,.7),0,rand(-30,30),rand(3,13),rand(-26,22),1,1,1,basic([0xf59e0b,0xef4444,0xfacc15][i%3]));worldGroup.add(l);anim.lanterns.push(l);}
  const petals=fallingPoints(500,0xf9a8d4,.35);worldGroup.add(petals);anim.petals=petals;
  const trail=fallingPoints(220,0x67e8f9,.3);worldGroup.add(trail);anim.trail=trail;
  const heroes=[{x:-1.8,hair:0x92400e},{x:0,hair:0xfacc15},{x:1.8,hair:0x111827}];
  heroes.forEach((h,i)=>{const av=makeAvatar('hero',false,h.hair);av.position.set(h.x,0,1.2);av.scale.setScalar(.95);worldGroup.add(av);
   const compass=new THREE.Mesh(new THREE.TorusGeometry(.35,.07,8,24),new THREE.MeshLambertMaterial({color:0xfacc15}));compass.position.set(h.x,.95,2.1);worldGroup.add(compass);
   if(i===1){const map=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.1),basic(0x22d3ee,.85));map.position.set(0,1.1,2.3);map.rotation.x=-.3;worldGroup.add(map);}
   const sp=fallingPoints(40,0xfde047,.28,2);sp.position.set(h.x,1,1.2);worldGroup.add(sp);anim.sparkles.push(sp);});
  const spots=[{x:-20,y:6,z:-12},{x:-8,y:6,z:-20},{x:5,y:6,z:-21},{x:17,y:6,z:-15},{x:25,y:5.5,z:-5},{x:-25,y:5.5,z:2},{x:24,y:5.5,z:8},{x:-20,y:5.5,z:12},{x:-6,y:5.5,z:20},{x:10,y:5.5,z:20}];
  MAPS.forEach((m,i)=>{const p=new THREE.Group();const s=spots[i];p.position.set(s.x,s.y,s.z);p.lookAt(0,5,8);if(m.big)p.scale.setScalar(1.35);
   const outer=new THREE.Mesh(new THREE.TorusGeometry(4.6,.28,12,48),basic(m.temple?0xfacc15:0x22d3ee));p.add(outer);
   const inner=new THREE.Mesh(new THREE.TorusGeometry(4.1,.14,10,48),basic(0xa855f7));p.add(inner);
   const disc=new THREE.Mesh(new THREE.CircleGeometry(4.2,40),basic(m.temple?0xf59e0b:0x0ea5e9,.32));p.add(disc);
   const lm=miniLandmark(i,p);lm.position.z=1;lm.scale.setScalar(.9);
   const label=textSprite(m.short);label.position.set(0,6,0);p.add(label);
   const orb=fallingPoints(50,0x67e8f9,.28,5);p.add(orb);anim.orbit.push(orb);
   if(m.temple){const sp=fallingPoints(40,0xfacc15,.3,4);p.add(sp);anim.sparkles.push(sp);}
   worldGroup.add(p);portals.push(p);});
  buildTourists();}
 function buildDestination(idx){clearWorld();mode='dest';current=idx;const M=MAPS[idx];scene.background=new THREE.Color(M.bg);scene.fog=new THREE.Fog(M.bg,45,110);worldGroup=new THREE.Group();scene.add(worldGroup);anim={lanterns:[],clouds:[]};
  const ground=new THREE.Mesh(new THREE.CircleGeometry(46,32),new THREE.MeshLambertMaterial({color:M.ground}));ground.rotation.x=-Math.PI/2;worldGroup.add(ground);
  if(idx===0){[[-14,0xeab308],[-8,0xef4444],[8,0x22c55e],[14,0xec4899]].forEach(([x,c])=>{worldGroup.add(box(5,4,5,c,x,2,-12));worldGroup.add(box(5.6,.6,5.6,0x92400e,x,4.3,-12));});const river=new THREE.Mesh(new THREE.PlaneGeometry(90,10),new THREE.MeshLambertMaterial({color:0x0ea5e9}));river.rotation.x=-Math.PI/2;river.position.set(0,.05,-2);worldGroup.add(river);}
  if(idx===1){const water=new THREE.Mesh(new THREE.PlaneGeometry(120,120),new THREE.MeshLambertMaterial({color:0x0284c7}));water.rotation.x=-Math.PI/2;water.position.y=.06;worldGroup.add(water);for(let i=0;i<10;i++)worldGroup.add(cone(rand(2,4),rand(6,12),0x4d7c0f,rand(-28,28),4,rand(-24,8)));for(let b=0;b<3;b++){const boat=new THREE.Group();boat.add(box(5,1,2,0x92400e,0,.6,0));const sail=new THREE.Mesh(new THREE.PlaneGeometry(3,3),basic(0xffffff,.95));sail.position.set(0,2.2,0);boat.add(sail);boat.position.set(-12+b*12,.1,-6+b*3);worldGroup.add(boat);}}
  if(idx===2){const river=new THREE.Mesh(new THREE.PlaneGeometry(120,18),new THREE.MeshLambertMaterial({color:0x0284c7}));river.rotation.x=-Math.PI/2;river.position.set(0,.05,-14);worldGroup.add(river);
   worldGroup.add(cone(3,11,0xfacc15,0,5.5,-16,4));worldGroup.add(cone(2,7,0xf59e0b,0,12, -16,4));worldGroup.add(box(6,2,4,0xf59e0b,0,1,-16));worldGroup.add(box(4,3,3,0xfacc15,-7,1.5,-14));worldGroup.add(sph(1.2,0xfacc15,-7,4,-14));
   worldGroup.add(box(3,2.5,2,0xfacc15,7,1.25,-12));worldGroup.add(sph(1,0xfacc15,7,3.2,-12));worldGroup.add(sph(.6,0xfacc15,7,4.4,-12));
   templeBell(worldGroup,-12,0,-10,1.2);anim.smoke=smoke(worldGroup,0,2,-14);const gold=fallingPoints(120,0xfacc15,.35,12);gold.position.set(0,4,-14);worldGroup.add(gold);anim.gold=gold;}
  if(idx===3){for(let i=0;i<10;i++){const x=rand(-24,24),z=rand(-12,14);worldGroup.add(cyl(.25,.35,2.5,0x92400e,x,1.25,z));worldGroup.add(sph(1.7,0xf9a8d4,x,3.4,z));}worldGroup.add(box(4,1,4,0xdc2626,0,.5,-14));worldGroup.add(box(3.2,1,3.2,0xdc2626,0,1.5,-14));worldGroup.add(cone(2,.9,0x111827,0,2.5,-14));const petals=fallingPoints(500,0xf9a8d4,.35);worldGroup.add(petals);anim.petals=petals;}
  if(idx===4){worldGroup.add(box(12,4,6,0xdc2626,0,2,-16));worldGroup.add(box(14,1,8,0xfacc15,0,4.5,-16));worldGroup.add(box(8,3,5,0xdc2626,0,6,-16));worldGroup.add(cone(4,2,0xfacc15,0,8.5,-16));for(let i=0;i<6;i++)worldGroup.add(cyl(.4,.4,4,0x92400e,-10+i*4,2,-12));
   templeBell(worldGroup,12,0,-10,1.2);anim.smoke=smoke(worldGroup,0,3,-14);const gold=fallingPoints(120,0xfacc15,.35,12);gold.position.set(0,4,-14);worldGroup.add(gold);anim.gold=gold;for(let i=0;i<20;i++){const l=sph(.5,0,rand(-20,20),rand(3,8),rand(-16,8),1,1,1,basic(0xef4444));worldGroup.add(l);anim.lanterns.push(l);}}
  if(idx===5){worldGroup.add(box(1.4,4,1.4,0xf59e0b,-3,2,-12,0,0,.35));worldGroup.add(box(1.4,4,1.4,0xf59e0b,3,2,-12,0,0,-.35));worldGroup.add(box(9,1,9,0xf59e0b,0,4.5,-12));worldGroup.add(box(4,7,4,0xf59e0b,0,8.5,-12));worldGroup.add(cyl(.2,.4,3,0xf59e0b,0,14,-12));const stars=fallingPoints(500,0xffffff,.3,40);worldGroup.add(stars);anim.stars=stars;}
  if(idx===6){const sea=new THREE.Mesh(new THREE.PlaneGeometry(120,40),new THREE.MeshLambertMaterial({color:0x0284c7}));sea.rotation.x=-Math.PI/2;sea.position.set(0,.05,-18);worldGroup.add(sea);[[-12],[-4],[4]].forEach(([x])=>{worldGroup.add(box(5,3,4,0xffffff,x,1.5,-10));worldGroup.add(sph(1.4,0x2563eb,x,3.4,-10,1,.6,1));});}
  if(idx===7){for(let i=0;i<6;i++)worldGroup.add(cone(rand(3,5),rand(6,10),0xe0f2fe,rand(-28,28),4,-18));const aur=new THREE.Mesh(new THREE.PlaneGeometry(80,12),new THREE.MeshBasicMaterial({map:auroraTexture('rgba(34,197,94,.9)','rgba(34,197,94,.3)'),transparent:true,opacity:.7,side:THREE.DoubleSide}));aur.position.set(0,16,-24);worldGroup.add(aur);anim.aurora0=aur;const snow=fallingPoints(600,0xffffff,.3);worldGroup.add(snow);anim.snow=snow;}
  if(idx===8){const sea=new THREE.Mesh(new THREE.RingGeometry(20,60),new THREE.MeshLambertMaterial({color:0x22d3ee,transparent:true,opacity:.85}));sea.rotation.x=-Math.PI/2;sea.position.y=.04;worldGroup.add(sea);for(let i=0;i<8;i++){const palm=new THREE.Group();palm.add(cyl(.25,.4,6,0x92400e,0,3,0,.35));palm.position.set(rand(-28,28),0,rand(-18,18));worldGroup.add(palm);}worldGroup.add(box(6,1.5,5,0xffffff,-10,.8,10));}
  if(idx===9){worldGroup.add(box(2,16,2,0x94a3b8,0,8,-16));worldGroup.add(box(1.4,10,1.4,0xe2e8f0,0,15,-16));worldGroup.add(box(.8,6,0.8,0xfacc15,0,20,-16));for(let i=0;i<8;i++)worldGroup.add(box(3,rand(4,9),3,0x64748b,rand(-24,24),4,-20));const stars=fallingPoints(400,0xffffff,.3,40);worldGroup.add(stars);anim.stars=stars;}
  const back=new THREE.Group();back.position.set(0,4.5,-22);back.add(new THREE.Mesh(new THREE.TorusGeometry(3,.22,10,40),basic(0x22d3ee)));const lbl=textSprite('🌀 VỀ TRUNG TÂM');lbl.position.set(0,4.2,0);back.add(lbl);worldGroup.add(back);portals=[back];
  for(let i=0;i<40;i++){const l=sph(rand(.35,.6),0,rand(-24,24),rand(3,11),rand(-20,16),1,1,1,basic(0xf59e0b));worldGroup.add(l);anim.lanterns.push(l);}
  buildTourists();}
 function playSwoosh(){try{const ctx=new (window.AudioContext||window.webkitAudioContext)();const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(180,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(1400,ctx.currentTime+.9);g.gain.setValueAtTime(.12,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+1);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+1);}catch(e){}}
 function playBell(){try{const ctx=new (window.AudioContext||window.webkitAudioContext)();[523,659,784,1046].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.14/(i+1),ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+2.5);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+2.5);});}catch(e){}}
 function prayPose(){if(!userAvatar)return;userAvatar.rotation.x=-.15;userAvatar.children.forEach(c=>{});setTimeout(()=>{if(userAvatar)userAvatar.rotation.x=0;},1800);}
 function spawnEffect(kind){const g=new THREE.Group();const vel=[];let life=2.5;
  if(kind==='heart'||kind==='firework'){for(let i=0;i<50;i++){const m=sph(kind==='heart'?.28:.18,kind==='heart'?0xef4444:0xfacc15,0,1,0);m.position.set(rand(-6,6),rand(1,3),rand(-2,6));g.add(m);vel.push(new THREE.Vector3(rand(-3,3),rand(3,9),rand(-2,2)));}
  }else if(kind==='lantern'){for(let i=0;i<16;i++){const m=sph(.55,0,rand(-14,14),rand(1,3),rand(-10,10),1,1,1,basic([0xef4444,0xf59e0b][i%2]));g.add(m);vel.push(new THREE.Vector3(0,rand(1,2),0));}life=6;
  }else if(kind==='rain'){for(let i=0;i<160;i++){const m=box(.35,.6,.05,0xfacc15,rand(-22,22),rand(8,20),rand(-16,16));g.add(m);vel.push(new THREE.Vector3(0,rand(-5,-2),0));}life=4;}
  scene.add(g);effects.push({group:g,vel,life,kind});}
 function swirl(){const g=new THREE.Group();for(let i=0;i<90;i++){const a=i/90*Math.PI*2;const m=sph(.22,0,Math.cos(a)*5,rand(0,8),Math.sin(a)*5,1,1,1,basic(i%2?0x22d3ee:0xa855f7));g.add(m);}scene.add(g);effects.push({group:g,vel:[],life:1.2,kind:'swirl'});return g}
 const dummy=new THREE.Object3D();const clock=new THREE.Clock();
 function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();beat*=.96;
  anim.lanterns?.forEach((l,i)=>{l.position.y+=.012;if(l.position.y>13)l.position.y=3;const s=1+beat*.35;l.scale.setScalar(s);});
  anim.clouds?.forEach(c=>{c.position.x+=.03;if(c.position.x>34)c.position.x=-34;});
  anim.orbit?.forEach((o,i)=>{o.rotation.z=t*.4+i;});anim.sparkles?.forEach((s,i)=>{s.rotation.y=t*(1+i*.2);});
  if(anim.ring1){anim.ring1.rotation.z=t*.25;anim.ring1.scale.setScalar(1+beat*.06);}if(anim.ring2)anim.ring2.rotation.z=-t*.35;
  cyanLight.intensity=2+beat*4;
  if(anim.aurora0)anim.aurora0.position.x=Math.sin(t*.4)*8;if(anim.aurora1)anim.aurora1.position.x=Math.sin(t*.3+1)*10;if(anim.aurora2)anim.aurora2.position.x=Math.sin(t*.25+2)*10;
  if(anim.stars)anim.stars.material.opacity=.6+Math.sin(t*2)*.3;
  ['petals','snow','sand','gold'].forEach(k=>{const p=anim[k];if(p){const pos=p.geometry.attributes.position;for(let i=0;i<pos.count;i++){let y=pos.getY(i)-.04;if(y<0)y=16;pos.setY(i,y);}pos.needsUpdate=true;}});
  if(anim.smoke){const pos=anim.smoke.geometry.attributes.position;for(let i=0;i<pos.count;i++){let y=pos.getY(i)+.03;if(y>18)y=2;pos.setY(i,y);}pos.needsUpdate=true;}
  if(anim.trail){const pos=anim.trail.geometry.attributes.position;for(let i=0;i<pos.count;i++){const u=tourists[i%tourists.length];if(u)pos.setXYZ(i,u.x+Math.sin(t+i)*.5,.3,u.z);}pos.needsUpdate=true;}
  tourists.forEach((u,i)=>{const dx=u.tx-u.x,dz=u.tz-u.z,d=Math.hypot(dx,dz);if(d<.5){u.tx=rand(-26,26);u.tz=rand(-22,22);}else{u.x+=dx/d*u.sp*.016;u.z+=dz/d*u.sp*.016;}
   const bob=Math.abs(Math.sin(t*5+u.ph))*.1;dummy.position.set(u.x,bob,u.z);dummy.rotation.set(0,Math.atan2(dx,dz),0);dummy.updateMatrix();bodyMesh.setMatrixAt(i,dummy.matrix);dummy.position.set(u.x,1.55+bob,u.z);dummy.updateMatrix();headMesh.setMatrixAt(i,dummy.matrix);});
  if(bodyMesh)bodyMesh.instanceMatrix.needsUpdate=true;if(headMesh)headMesh.instanceMatrix.needsUpdate=true;
  if(userAvatar){userAvatar.position.y=Math.abs(Math.sin(t*2))*.12;userAvatar.rotation.y=Math.sin(t*.5)*.2;}
  if(transitioning){const p=transitioning.portal;p.scale.setScalar((MAPS[transitioning.idx]?.big?1.35:1)+Math.min(1,(t-transitioning.start))*1.6);p.rotation.z+=(t-transitioning.start)*.2;}
  effects=effects.filter(e=>{e.life-=.016;if(e.kind==='swirl')e.group.rotation.y+=.25;e.group.children.forEach((m,i)=>{if(e.vel[i]){m.position.addScaledVector(e.vel[i],.016);if(e.kind==='firework')e.vel[i].y-=.12;}});if(e.life<=0){scene.remove(e.group);return false;}return true;});
  controls.update();renderer.render(scene,camera);}
 function resize(){const w=canvas.parentElement.clientWidth,h=canvas.parentElement.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
 addEventListener('resize',resize);resize();buildHub();animate();
 function enterPortal(idx){current=idx;playSwoosh();const portal=portals[idx]||portals[0];transitioning={portal,idx,start:clock.getElapsedTime()};const sw=swirl();if(portal)sw.position.copy(portal.position);
  setTimeout(()=>{transitioning=null;buildDestination(idx);if(MAPS[idx].temple)playBell();},1150);}
 return {setMap:enterPortal,backToHub:()=>{playSwoosh();buildHub();},getMap:()=>current,getMode:()=>mode,screenshot:()=>renderer.domElement.toDataURL('image/png'),effect:spawnEffect,bell:playBell,pray:prayPose,pulseBeat:()=>{beat=1;},
  setUserName:n=>{userName=n;if(userAvatar){const old=userAvatar.children.find(c=>c.type==='Sprite');if(old)userAvatar.remove(old);const sp=nameSprite(n);sp.position.set(0,3.4,0);userAvatar.add(sp);}},
  jump:()=>{if(userAvatar)userAvatar.position.y=1.2;}};}
