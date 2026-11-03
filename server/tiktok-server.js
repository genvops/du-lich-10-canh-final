// Server mẫu (CHẠY RIÊNG, KHÔNG chạy trên GitHub Pages) để kết nối TikTok Live thật.
// GitHub Pages chỉ phục vụ file tĩnh, không chạy Node/WebSocket, nên live thật cần 1 server Node.
// Cách chạy (miễn phí, máy bạn hoặc VPS free tier):
//   cd server && npm install tiktok-live-connector ws && node tiktok-server.js
//   Mở http://localhost:8080, nhập @username, server sẽ forward comment/gift qua WebSocket cho web.
//   Khi đó trong live.html, thay chế độ mô phỏng bằng ws://localhost:8080 (xem README).
const { WebcastPushConnection } = require('tiktok-live-connector');
const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 8080 });
let tiktok = null;
function broadcast(obj){ const s = JSON.stringify(obj); wss.clients.forEach(c => { try{ c.send(s); }catch(e){} }); }
function mapFromText(t){
  t = (t||'').toLowerCase().trim();
  if (['1','2','3','4','5','6','7','8','9','10'].includes(t)) return Number(t)-1;
  if (t.includes('hoi an') || t.includes('hội an')) return 0;
  if (t.includes('ha long') || t.includes('hạ long')) return 1;
  if (t.includes('wat arun') || t.includes('thai')) return 2;
  if (t.includes('kyoto') || t.includes('nhat') || t.includes('nhật')) return 3;
  if (t.includes('tu cam') || t.includes('thieu lam') || t.includes('trung quoc')) return 4;
  if (t.includes('paris') || t.includes('eiffel')) return 5;
  if (t.includes('santorini')) return 6;
  if (t.includes('iceland') || t.includes('cuc quang')) return 7;
  if (t.includes('maldives')) return 8;
  if (t.includes('dubai')) return 9;
  return null;
}
wss.on('connection', ws => {
  ws.on('message', async raw => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.type === 'connect' && msg.username) {
        if (tiktok) { try{ await tiktok.disconnect(); }catch(e){} }
        tiktok = new WebcastPushConnection(msg.username.replace(/^@/,''));
        tiktok.connect().then(()=> broadcast({type:'status', text:'Đã kết nối @'+msg.username}))
          .catch(e => broadcast({type:'status', text:'Kết nối thất bại: '+(e.message||e)}));
        tiktok.on('chat', d => broadcast({type:'chat', user:d.uniqueId, text:d.comment, map:mapFromText(d.comment), heart:(d.comment||'').toLowerCase().includes('tim')}));
        tiktok.on('gift', d => broadcast({type:'gift', user:d.uniqueId, gift:d.giftName, count:d.repeatCount||1}));
      }
    } catch(e){ console.log('bad message', e.message); }
  });
});
console.log('TikTok bridge chạy ở ws://localhost:8080 - gửi {"type":"connect","username":"@ten"} để bắt đầu.');
