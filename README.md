# Du Lịch Vòng Quanh Thế Giới Online - Bản FINAL 10 CỔNG 6D

Web game 3D, trời đêm cực quang: mở ra là **trung tâm 10 cổng dịch chuyển 3D** hình tròn phát sáng, viền neon xanh tím, lơ lửng trên không, sàn vòng tròn năng lượng + grid hologram, 3 chibi ở giữa cầm la bàn / bản đồ phát sáng, 300 du khách chibi đi lại để lại vệt sáng lấp lánh, đèn lồng Hội An bay khắp nơi, hoa rơi liên tục. Bấm 1 cổng: cổng phóng to, xoáy ánh sáng hút người chơi vào kèm tiếng “vút”.

HUD: **DESTINATION SYNC: 10/10 | 6D VIRTUAL TOURISM ACTIVE**

Footer: **Du lịch online - Không cần visa - Share cho bạn bè cùng đi**

## Các trang

- `/` (index.html) - Thế giới 3D chính, nút chuyển 10 cổng ở dưới, Hộ chiếu Vàng, Share, nút 🙏 Cầu an.
- `/live.html` - Trang live: nhập @username TikTok, xem comment, bấm quà tặng thử, lệnh comment chuyển cổng.
- `/control.html` - Trang control cho host: chuyển cổng nhanh, bật pháo hoa / đèn trời / mưa tiền, giả lập quà, xem comment.

## 10 cổng

1. HỘI AN VN - đèn lồng, cổng TO NHẤT
2. HẠ LONG VN - thuyền buồm
3. WAT ARUN THÁI LAN - chùa vàng lấp lánh bên sông, tượng Phật vàng, khói hương, chuông chùa
4. KYOTO NHẬT BẢN - hoa anh đào
5. TỬ CẤM THÀNH TRUNG QUỐC / CHÙA THIẾU LÂM - chùa Trung Quốc vàng rực, khói hương, chuông chùa
6. PARIS PHÁP - Eiffel
7. SANTORINI HY LẠP - biển xanh, nhà trắng mái xanh
8. ICELAND - cực quang
9. MALDIVES - biển trong, dừa đổ
10. DUBAI - Burj Khalifa

## Chùa online: Cầu an

Khi vào cổng chùa Thái Lan (Wat Arun) hoặc Trung Quốc (Tử Cấm Thành):
- Tự phát tiếng chuông chùa.
- Tự hiện nút **🙏 Cầu an** trên trang chính.
- Bấm Cầu an: nhân vật chắp tay lạy, chuông vang lại, pháo hoa nổ và chữ to hiện lên: **🙏 CẦU AN - BÌNH AN • MAY MẮN • TÀI LỘC**.

## Lệnh TikTok (mô phỏng và server thật)

- Comment `1-10` hoặc `hoi an, ha long, thai, kyoto, tu cam, paris, santorini, iceland, maldives, dubai` → bay qua cổng tương ứng
- Comment `tim` → tất cả thả tim
- Hoa hồng → pháo hoa tim | Bóng bay → thả đèn trời | Du thuyền → mưa tiền / hoa anh đào
- Quà tặng: nhạc cổng đó to lên + tiếng pháo hoa theo nhịp, popup cảm ơn.

## Music Sync - Nhạc tự động theo nước

Bay tới cổng nào, nhạc nền tự đổi sang nhạc đặc trưng nước đó, crossfade 2 giây cho mượt. Thanh nhạc góc phải hiện: “🎵 Đang phát: …” + nút bật/tắt + chỉnh volume + nút upload.

10 loại nhạc (Web Audio tự tạo, khác thang âm / nhịp / nhạc cụ, không dùng nhạc bản quyền):
1. Hội An: Đàn Tranh + chuông chùa, 72 BPM
2. Hạ Long: Sáo trúc + sóng biển, 60 BPM
3. Wat Arun: Khim Thái + chuông chùa vàng, 96 BPM
4. Kyoto: Koto + Sakura, 66 BPM
5. Tử Cấm Thành: Cổ tranh Trung Hoa + trống Thiếu Lâm, 84 BPM
6. Paris: Accordion lãng mạn, waltz, 90 BPM
7. Santorini: Bouzouki Hy Lạp, 132 BPM
8. Iceland: Ambient cực quang, 48 BPM
9. Maldives: Biển chill + sóng vỗ, 78 BPM
10. Dubai: City EDM nhẹ, 120 BPM

Hiệu ứng theo nhạc: đèn lồng nhấp nháy theo beat, vòng năng lượng trung tâm phồng lên theo beat, đèn trung tâm sáng mạnh theo beat.

Lưu ý trình duyệt: nhạc chỉ phát sau 1 lần chạm/click đầu tiên của bạn (quy định autoplay của trình duyệt), không phải lỗi web.

## Nhạc MP3 riêng - public/music/

Muốn đổi nhạc chỉ cần thay file mp3 cùng tên trong thư mục music

Thư mục: `public/music/` - xem chi tiết trong `public/music/README.txt`.
- hoian.mp3, halong.mp3, thailand.mp3, japan.mp3, china.mp3, paris.mp3, santorini.mp3, iceland.mp3, maldives.mp3, dubai.mp3
- Code ưu tiên: thử play file mp3 tương ứng với cổng trước. Nếu file trống (0 byte, như bản giao hiện tại) hoặc lỗi, web tự fallback sang nhạc Web Audio theo nước ở trên, không bị im lặng.
- Thay nhạc vĩnh viễn: thay file mp3 cùng tên trong `public/music/`, push lại GitHub Pages.
- Thay nhạc tạm trên 1 trình duyệt: bấm “⬆️ Upload nhạc cho cổng này” trên thanh nhạc, file sẽ lưu trong IndexedDB của trình duyệt đó. Bấm “↩️ Dùng nhạc mặc định” để quay lại.
- Nhạc thay vào nên là nhạc bạn có quyền sử dụng (tự làm / miễn phí bản quyền / Youtube Audio Library) để tránh vi phạm khi livestream.

## Nói thẳng về TikTok Live thật

**GitHub Pages chỉ chạy file tĩnh, không chạy được `tiktok-live-connector` / WebSocket server.**
Vì vậy bản deploy trên GitHub Pages chạy ở **chế độ mô phỏng** comment/quà tặng để demo và chơi thử ngay, đã ghi rõ trong trang /live.

Muốn live thật, chạy server mẫu trong `server/`:

```bash
cd server
npm install tiktok-live-connector ws
node tiktok-server.js
```

Server chạy ở `ws://localhost:8080`, nhận `{"type":"connect","username":"@ten"}` rồi forward comment/gift thật về web.

Tương tự, số “🔴 LIVE - 647 người” trên trang chính là **số mô phỏng trong game cho vui**, đã ghi chú ở footer, không phải số viewer TikTok thật.

## Chạy local

```bash
cd du-lich-10-canh-final
python3 -m http.server 8000
# mở http://localhost:8000
```

## Deploy GitHub Pages (dự kiến)

Repo dự kiến: `genvops/du-lich-10-canh-final`, branch `main`, thư mục gốc `/`.
Bật Settings → Pages → Deploy from branch → main / root, chờ vài phút là có link `https://genvops.github.io/du-lich-10-canh-final/`.
Lưu ý: lần tạo repo tự động bằng Muse GitHub App trước đó bị GitHub trả 403 “Resource not accessible by integration” (cài đặt ứng dụng chưa hoàn tất), nên nếu link trên chưa mở được, hãy tạo repo trống tên này thủ công trên github.com rồi báo lại để đẩy code lên.
