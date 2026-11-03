Muốn đổi nhạc chỉ cần thay file mp3 cùng tên trong thư mục music

Hướng dẫn chi tiết:
- Thư mục này là public/music/ trong project du-lich-10-canh-final.
- Khi vào cổng nào, web sẽ play file mp3 tương ứng:
  1. Hội An -> hoian.mp3
  2. Hạ Long -> halong.mp3
  3. Wat Arun Thái Lan -> thailand.mp3
  4. Kyoto Nhật Bản -> japan.mp3
  5. Tử Cấm Thành Trung Quốc -> china.mp3
  6. Paris -> paris.mp3
  7. Santorini -> santorini.mp3
  8. Iceland -> iceland.mp3
  9. Maldives -> maldives.mp3
  10. Dubai -> dubai.mp3
- Muốn đổi nhạc: chỉ cần thay file mp3 cùng tên trong thư mục music, giữ nguyên tên file, rồi push lại lên GitHub Pages là xong. Không cần sửa code.
- Lưu ý: 10 file mp3 hiện tại là file trống (0 byte) để giữ chỗ. File trống không phát được tiếng, nên web sẽ tự động dùng nhạc Web Audio tự tạo theo từng nước thay thế, không bị im lặng.
- Ngoài cách thay file trong repo, bạn cũng có thể bấm nút "Upload nhạc cho cổng này" ngay trên web để thay nhạc tạm thời trên trình duyệt của bạn (lưu trong IndexedDB của trình duyệt đó, không ghi lên repo).
- Nhạc thay vào nên là nhạc bạn có quyền sử dụng (nhạc tự làm, nhạc miễn phí bản quyền, Youtube Audio Library) để tránh vi phạm bản quyền khi livestream.
