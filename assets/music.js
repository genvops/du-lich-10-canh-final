// Music Sync: thử mp3 trong public/music/ trước, nếu file trống/lỗi thì fallback sang Web Audio tự tạo.
// Vì file mp3 mặc định là file trống (0 byte) nên trình duyệt sẽ báo lỗi và nhạc synth sẽ phát ngay - không bị im lặng.
// Muốn đổi nhạc chỉ cần thay file mp3 cùng tên trong thư mục music (xem public/music/README.txt).
export const MUSIC_FILES=['hoian.mp3','halong.mp3','thailand.mp3','japan.mp3','china.mp3','paris.mp3','santorini.mp3','iceland.mp3','maldives.mp3','dubai.mp3'];
export const MUSIC_NAMES=['Nhạc Việt Nam - Hội An (Đàn Tranh + chuông chùa)','Nhạc Việt Nam - Hạ Long (Sáo trúc + sóng biển)','Nhạc Thái Lan - Wat Arun (Khim + chuông chùa vàng)','Nhạc Nhật Bản - Kyoto (Koto + Sakura)','Nhạc Trung Hoa - Tử Cấm Thành (Cổ tranh + trống Thiếu Lâm)','Nhạc Pháp - Paris (Accordion lãng mạn)','Nhạc Hy Lạp - Santorini (Bouzouki biển xanh)','Nhạc Iceland - Cực quang (Ambient huyền ảo)','Nhạc Maldives - Biển chill (Sóng vỗ)','Nhạc Dubai - City EDM nhẹ'];
// Thang âm + nhịp khác nhau cho 10 nước, để bấm qua 10 cổng nghe rõ 10 màu khác nhau.
const PROFILES=[
 {bpm:72,scale:[523.25,587.33,659.25,783.99,880,1046.5],wave:'triangle',ambient:'bell'},
 {bpm:60,scale:[440,493.88,587.33,659.25,783.99],wave:'sine',ambient:'wave'},
 {bpm:96,scale:[523.25,554.37,659.25,739.99,880,1108.7],wave:'triangle',ambient:'bell'},
 {bpm:66,scale:[440,523.25,587.33,659.25,880],wave:'triangle',ambient:'none'},
 {bpm:84,scale:[392,440,523.25,587.33,659.25,783.99],wave:'sawtooth',ambient:'drum'},
 {bpm:90,scale:[261.63,329.63,392,440,523.25],wave:'sawtooth',ambient:'none',waltz:true},
 {bpm:132,scale:[293.66,329.63,392,440,523.25,587.33],wave:'square',ambient:'none'},
 {bpm:48,scale:[220,261.63,329.63,440,523.25],wave:'sine',ambient:'none',pad:true},
 {bpm:78,scale:[329.63,392,440,523.25,587.33],wave:'triangle',ambient:'wave'},
 {bpm:120,scale:[261.63,311.13,392,466.16,523.25],wave:'sawtooth',ambient:'drum',edm:true},
];
function idb(){return new Promise((res,rej)=>{const r=indexedDB.open('dulich-music',1);r.onupgradeneeded=()=>r.result.createObjectStore('overrides');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
async function idbGet(key){try{const db=await idb();return await new Promise((res,rej)=>{const t=db.transaction('overrides','readonly').objectStore('overrides').get(key);t.onsuccess=()=>res(t.result);t.onerror=()=>rej(t.error);});}catch(e){return null}}
async function idbPut(key,blob){const db=await idb();await new Promise((res,rej)=>{const t=db.transaction('overrides','readwrite').objectStore('overrides').put(blob,key);t.onsuccess=()=>res();t.onerror=()=>rej(t.error);});}
async function idbDel(key){const db=await idb();await new Promise((res,rej)=>{const t=db.transaction('overrides','readwrite').objectStore('overrides').delete(key);t.onsuccess=()=>res();t.onerror=()=>rej(t.error);});}
export function createMusic(){
 let ctx=null,master=null,current=-1,enabled=true,volume=.7,timer=null,step=0,mp3Audio=null,mp3Mode=false,beatCb=null,boostUntil=0,noiseBuf=null;
 function ensureCtx(){if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=volume;master.connect(ctx.destination);}if(ctx.state==='suspended')ctx.resume();return ctx}
 function tone(freq,dur=.5,type='triangle',vol=.08,when=0){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;const t0=ctx.currentTime+when;g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.02);g.gain.exponentialRampToValueAtTime(.001,t0+dur);o.connect(g);g.connect(master);o.start(t0);o.stop(t0+dur+.05);}
 function bell(freq=784){[freq,freq*1.5,freq*2].forEach((f,i)=>tone(f,2,'sine',.06/(i+1)));}
 function drum(){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(120,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(45,ctx.currentTime+.25);g.gain.setValueAtTime(.22,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.3);o.connect(g);g.connect(master);o.start();o.stop(ctx.currentTime+.3);}
 function waveNoise(){if(!noiseBuf){noiseBuf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}const s=ctx.createBufferSource();s.buffer=noiseBuf;s.loop=true;const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=420;const g=ctx.createGain();g.gain.value=.025;s.connect(f);f.connect(g);g.connect(master);s.start();return {stop:()=>{try{s.stop()}catch(e){}}}}
 function stopSynth(){if(timer){clearInterval(timer);timer=null;} if(window.__waveStop){window.__waveStop();window.__waveStop=null;}}
 function startSynth(idx){ensureCtx();stopSynth();const p=PROFILES[idx];const beatMs=60000/p.bpm;step=0;let waveStop=null;if(p.ambient==='wave')waveStop=waveNoise();window.__waveStop=waveStop?()=>waveStop.stop():null;
  timer=setInterval(()=>{if(!enabled)return;const n=p.scale[step%p.scale.length];const vol=p.pad?.05:.09;
   if(p.waltz){tone(n,1.1,'sawtooth',.06);tone(n/2,1.1,'triangle',.05);}
   else if(p.edm){if(step%4===0)drum();tone(n,.35,'sawtooth',.07);if(step%2===0)tone(n*2,.2,'square',.03);}
   else if(p.pad){tone(n,3,'sine',.05);if(step%4===0)tone(n*1.5,3,'sine',.03);}
   else {tone(n,.7,p.wave,vol);if(step%2===1)tone(p.scale[(step+2)%p.scale.length],.5,p.wave,.04);}
   if(p.ambient==='bell'&&step%8===0)bell(n); if(p.ambient==='drum'&&step%4===0)drum();
   if(beatCb)beatCb(1); step++;},beatMs);}
 function fadeAudio(audio,to,ms=2000){return new Promise(res=>{if(!audio){res();return}const from=audio.volume,steps=20,dv=(to-from)/steps;let i=0;const iv=setInterval(()=>{i++;audio.volume=Math.max(0,Math.min(1,from+dv*i));if(i>=steps){clearInterval(iv);res();}},ms/steps);});}
 async function tryMp3(idx){const file=MUSIC_FILES[idx];let url=null;try{const blob=await idbGet(file);if(blob)url=URL.createObjectURL(blob);}catch(e){} if(!url)url='public/music/'+file;
  return new Promise(res=>{const a=new Audio();a.loop=true;a.preload='auto';let done=false;const ok=()=>{if(done)return;done=true;res(a)};const fail=()=>{if(done)return;done=true;res(null)};a.addEventListener('canplaythrough',ok,{once:true});a.addEventListener('error',fail,{once:true});a.src=url;setTimeout(()=>{if(!done){if(a.readyState>=3&&a.duration>0.5)ok();else fail();}},1800);});}
 async function playMap(idx){current=idx;if(!enabled)return;ensureCtx();
  // Crossfade 2 giây: giảm dần nguồn cũ, rồi mới bật nguồn mới
  const oldMp3=mp3Audio; if(oldMp3){fadeAudio(oldMp3,0,2000).then(()=>{try{oldMp3.pause()}catch(e){}});}
  const oldMaster=master?master.gain.value:volume; if(master)master.gain.setTargetAtTime(0,ctx.currentTime,.4);
  const mp3=await tryMp3(idx);
  if(!enabled)return;
  if(mp3){stopSynth();mp3Mode=true;mp3Audio=mp3;mp3.volume=0;try{await mp3.play();}catch(e){mp3Mode=false;startSynth(idx);updateLabel();return} fadeAudio(mp3,volume,2000);}
  else {mp3Mode=false;mp3Audio=null;startSynth(idx);if(master)master.gain.setTargetAtTime(volume,ctx.currentTime,.4);}
  updateLabel();}
 function updateLabel(){const el=document.getElementById('musicName');if(el)el.textContent=mp3Mode?('🎵 Đang phát MP3: '+MUSIC_FILES[current]):('🎵 Đang phát: '+MUSIC_NAMES[current]);const up=document.getElementById('musicUploadLabel');if(up)up.textContent='⬆️ Upload nhạc cho cổng này';}
 function setEnabled(v){enabled=v;if(!v){stopSynth();if(mp3Audio)mp3Audio.pause();}else if(current>=0)playMap(current);updateLabel();const b=document.getElementById('musicToggle');if(b)b.textContent=enabled?'🔊 Tắt nhạc':'🔇 Bật nhạc';}
 return {playMap,setVolume:v=>{volume=v;if(master)master.gain.value=v;if(mp3Audio)mp3Audio.volume=v;},toggle:()=>setEnabled(!enabled),isEnabled:()=>enabled,currentName:()=>MUSIC_NAMES[current]||'',currentFile:()=>MUSIC_FILES[current]||'',isMp3:()=>mp3Mode,onBeat:cb=>beatCb=cb,
  boost:()=>{boostUntil=Date.now()+4000;if(master)master.gain.setTargetAtTime(Math.min(1,volume*1.6),ctx?ctx.currentTime:0,.2);setTimeout(()=>{if(master)master.gain.setTargetAtTime(volume,ctx.currentTime,.5);},4000);if(beatCb)beatCb(1);},
  fireworkSound:()=>{ensureCtx();for(let i=0;i<3;i++)setTimeout(()=>tone(1200+Math.random()*800,.3,'square',.05),i*150);},
  uploadForCurrent:async file=>{if(current<0||!file)return;await idbPut(MUSIC_FILES[current],file);await playMap(current);},
  clearUploadForCurrent:async ()=>{if(current<0)return;await idbDel(MUSIC_FILES[current]);await playMap(current);},
  updateLabel};
}
