Kamu bertindak sebagai SENIOR UX AUDITOR + SYSTEM ANALYST + FRONTEND REVIEWER untuk proyek website desktop-first yang wajib responsive mobile.

Tugasmu adalah melakukan AUDIT MENYELURUH terhadap desain/Figma/prototype/sistem bernama “Ekspedisi Petir” untuk kasus Cargo Udara.

FOKUS UTAMA:
1. Memeriksa apakah seluruh requirement wajib dan fleksibel sudah terpenuhi.
2. Memeriksa apakah desain sudah realistis untuk diimplementasikan saat coding.
3. Memeriksa apakah setiap halaman, komponen, menu, tombol, tabel, form, filter, status, dan setting memiliki fungsi yang jelas.
4. Memeriksa apakah sistem mampu menangani kondisi nyata di lapangan operasional cargo udara.
5. Memeriksa apakah website berfokus pada desktop, tetapi tetap responsive saat dibuka di mobile.
6. Memberikan koreksi yang tegas jika ada bagian yang ambigu, berlebihan, tidak realistis, atau tidak sesuai studi kasus.

KONTEKS KASUS:
- Nama kasus: Ekspedisi Petir (Cargo Udara)
- Pengguna utama: operator operasional bandara
- Perangkat utama: desktop / monitor ruang kendali
- Fokus mata kuliah: website desktop-first
- Harus tetap responsive untuk mobile
- Nuansa visual: formal, profesional, corporate blue, minim warna, rapi, stabil, tidak melelahkan mata
- Font: sans-serif clean seperti Inter
- Navigasi utama: sidebar permanen, idealnya bisa collapse
- Sistem harus cepat, jelas, dan mendukung ritme kerja cargo udara yang real-time
- Operator sering berpindah antara manifest, status penerbangan, dan tracking log
- Masalah umum: nomor AWB salah input
- Error page wajib human-friendly, tidak teknis

REQUIREMENT WAJIB YANG HARUS DICEK:
A. Halaman Tracking Airway Bill (AWB)
- Ada form input nomor AWB
- Ada hasil tracking status
- Alur status minimal contoh: Received → Sortation → Loaded to Aircraft → Departed → Arrived
- Setiap status wajib memiliki timestamp
- Harus mudah dibaca cepat oleh operator

B. Dashboard Operator
- Ada tabel daftar kargo yang masuk hari itu
- Ada status penerbangan (on-time, delayed, departed)
- Sidebar sebagai navigasi utama
- Layout stabil dan cocok untuk penggunaan desktop lama

C. Visual & Branding
- Dominan corporate blue
- Formal, minim warna mencolok
- Font bersih, profesional, mudah dibaca
- Tidak terlalu dekoratif
- Tidak melelahkan mata untuk kerja > 6 jam

D. Error Page AWB Not Found
- Pesan harus human-friendly
- Tidak menampilkan error teknis seperti 404 mentah, SQL error, stack trace, dll
- Harus membantu operator memahami langkah selanjutnya

E. Database Minimal
- Tabel shipments
- Tabel tracking_logs
- Tabel users
- Relasi shipment → tracking_logs = 1-to-many

REQUIREMENT FLEKSIBEL YANG BOLEH ADA DAN HARUS DINILAI:
- Animasi atau interaksi dashboard
- Grafik statistik penerbangan harian
- Fitur export data
- Sidebar collapse/expand
- Role user (admin/operator/supervisor)
- Tema blue terang/gelap
- Integrasi peta dummy pergerakan cargo/bagasi/udara

ATURAN AUDIT:
Lakukan audit secara KRITIS, DETAIL, dan TERSTRUKTUR.
Jangan hanya bilang “sudah bagus”.
Kamu harus mencari celah, kekurangan, resiko, bagian yang membingungkan, dan bagian yang belum realistis.

WAJIB PERIKSA ASPEK BERIKUT:

1. Kesesuaian dengan studi kasus
Periksa apakah desain benar-benar cocok untuk operator cargo udara, bukan sekadar dashboard umum.
Tanyakan:
- Apakah tampilannya cukup formal?
- Apakah informasi penting langsung terlihat?
- Apakah ritme kerja cepat operator didukung?
- Apakah sidebar permanen benar-benar membantu?
- Apakah perpindahan halaman cepat dan efisien?

2. Kesesuaian dengan requirement pakem
Periksa satu per satu semua requirement wajib.
Untuk tiap requirement, beri status:
- SUDAH SESUAI
- BELUM ADA
- PERLU DIREVISI
Lalu jelaskan alasannya.

3. Audit setiap halaman
Minimal cek:
- Home / landing jika ada
- Dashboard Operator
- Tracking AWB
- Error Page AWB Not Found
- Halaman manifest jika ada
- Halaman status penerbangan jika ada
- Halaman login jika ada
- Halaman role/admin/supervisor jika ada

Untuk tiap halaman, jelaskan:
- Tujuan halaman
- Siapa pengguna utamanya
- Informasi utama yang harus terlihat pertama kali
- Apakah hierarki visualnya jelas
- Apakah layout desktop-nya efisien
- Apakah versi mobile tetap masuk akal
- Apakah ada elemen yang tidak perlu

4. Audit setiap komponen dan setting
Untuk setiap elemen yang ada, jelaskan fungsi nyatanya.
Periksa:
- Sidebar
- Tombol collapse sidebar
- Search bar
- Input AWB
- Tombol lacak
- Tabel kargo
- Filter status
- Badge status penerbangan
- Timestamp tracking
- Empty state
- Error state
- Loading state
- Pagination / sorting / export jika ada
- Card ringkasan
- Grafik
- Modal
- Toast/notifikasi
- Form login
- Role selector
- User menu/profile
- Theme toggle jika ada

Untuk setiap komponen, tampilkan format:
- Nama komponen
- Fungsi utama
- Kapan digunakan
- Data apa yang ditampilkan / diproses
- Apa aksi user
- Apa respon sistem
- Apakah komponen ini wajib, opsional, atau justru tidak perlu
- Apakah realistis untuk di-code
- Resiko UX atau implementasinya

5. Audit flow operasional nyata
Uji apakah sistem mampu menyelesaikan kondisi lapangan berikut:
- Operator memasukkan AWB yang benar
- Operator memasukkan AWB yang salah format
- Operator memasukkan AWB yang tidak ditemukan
- Data shipment belum punya tracking log lengkap
- Shipment baru masuk gudang dan status harus langsung muncul
- Ada update status mendadak beberapa menit sebelum keberangkatan
- Flight delayed
- Flight departed
- Flight arrived
- Barang tertinggal karena update terlambat
- Operator harus cepat pindah dari manifest ke tracking lalu ke status penerbangan
- Banyak data masuk dalam hari yang sama
- Operator bekerja lama di layar dan butuh tampilan nyaman
- Layar desktop sempit sehingga sidebar perlu collapse
- Mobile inspect dilakukan untuk cek responsive
- User dengan role berbeda hanya boleh melihat fitur tertentu
- Data kosong hari itu
- Sistem sedang loading data real-time
- Data gagal diambil
- Timestamp tidak sinkron
- Ada input duplikat atau salah ketik
- Ada data shipment yang statusnya meloncat tidak logis

Untuk tiap kondisi lapangan, nilai:
- Apakah desain saat ini sudah mengantisipasi?
- Komponen apa yang menangani kondisi itu?
- Apa yang harus ditambahkan?
- Apa potensi masalahnya bila tidak diperbaiki?

6. Audit real-time readiness
Karena cargo udara sangat cepat, cek:
- Apakah desain memberi indikasi data terbaru?
- Apakah timestamp cukup jelas?
- Apakah operator bisa tahu update terakhir kapan?
- Apakah status yang kritis terlihat menonjol?
- Apakah perubahan data mendadak bisa terlihat tanpa membingungkan user?

7. Audit visual dan kenyamanan kerja
Periksa:
- Apakah corporate blue digunakan konsisten?
- Apakah kontras cukup?
- Apakah font mudah dibaca?
- Apakah terlalu banyak warna/ornamen?
- Apakah tabel nyaman dipindai?
- Apakah komponen terlalu rapat atau terlalu kosong?
- Apakah cocok untuk penggunaan lama di monitor desktop?

8. Audit responsive
Karena fokus website desktop-first:
- Nilai kualitas layout desktop sebagai prioritas utama
- Lalu cek apakah saat diinspect mobile tampilannya masih aman
- Pastikan bukan mobile app murni, tetapi website yang responsive
- Nilai ulang sidebar, tabel, card, filter, dan tracking timeline saat mobile
- Jelaskan elemen mana yang harus berubah saat mobile dan mana yang tetap

9. Audit implementasi coding
Periksa apakah desain terlalu rumit untuk dikerjakan saat coding.
Tandai bagian yang:
- Bagus secara visual tapi sulit direalisasikan
- Tidak punya fungsi nyata
- Terlalu kompleks untuk tugas kuliah
- Berpotensi bikin bug besar
- Bisa disederhanakan tanpa mengurangi kualitas

10. Audit database dan logika data
Periksa kecocokan fitur dengan struktur:
- shipments
- tracking_logs
- users

Pastikan logika ini masuk akal:
- Satu shipment punya banyak tracking_logs
- User bisa punya role tertentu
- Timestamp tersimpan jelas
- Status mengikuti urutan logis
- Dashboard mengambil data shipment harian
- Tracking page membaca histori log per AWB

Sebutkan juga jika ada fitur UI yang belum didukung oleh struktur database minimal.

OUTPUT YANG WAJIB KAMU BERIKAN:
Susun jawaban dengan format berikut:

A. RINGKASAN PENILAIAN UMUM
- Apakah desain/sistem ini sudah layak?
- Apakah sudah sesuai studi kasus?
- Apakah siap untuk coding?
- Skor keseluruhan dari 1–10

B. CEKLIST REQUIREMENT WAJIB
Buat tabel:
- Requirement
- Status (Sudah / Belum / Revisi)
- Bukti/Alasan
- Saran Perbaikan

C. CEKLIST REQUIREMENT FLEKSIBEL
Buat tabel:
- Fitur fleksibel
- Perlu ditambahkan atau tidak
- Alasan
- Prioritas

D. AUDIT PER HALAMAN
Untuk setiap halaman:
- Tujuan
- Kelebihan
- Kekurangan
- Masalah UX
- Masalah implementasi
- Revisi yang disarankan

E. AUDIT PER KOMPONEN / SETTING
Untuk setiap komponen/setting:
- Nama
- Fungsi jelasnya
- Kondisi penggunaan
- Apakah wajib
- Apakah realistis di-code
- Saran revisi

F. UJI KONDISI LAPANGAN
Buat daftar skenario nyata dan jelaskan:
- Sudah teratasi atau belum
- Bagian UI yang menangani
- Kekurangan
- Solusi konkret

G. TEMUAN KRITIS
Tuliskan minimal 10 temuan paling penting, urut dari yang paling mendesak.

H. REVISI PRIORITAS TERTINGGI
Buat urutan:
1. Harus diperbaiki sekarang
2. Sebaiknya diperbaiki
3. Boleh ditambahkan nanti

I. REKOMENDASI FINAL
Berikan keputusan akhir:
- LAYAK
- LAYAK DENGAN REVISI
- BELUM LAYAK

GAYA JAWABAN:
- Gunakan bahasa Indonesia yang tegas, spesifik, profesional, dan mudah dipahami mahasiswa
- Jangan terlalu umum
- Jangan memuji tanpa alasan
- Fokus pada fungsi nyata
- Semua kritik harus disertai alasan
- Semua saran harus bisa langsung diterapkan
- Prioritaskan solusi yang realistis untuk Figma dan coding tugas kuliah

PENTING:
Kalau ada desain/fitur yang terlihat keren tapi tidak membantu operator cargo udara, tandai sebagai “tidak relevan”.
Kalau ada fitur yang bagus tapi terlalu sulit untuk dikoding dalam konteks tugas kuliah, tandai sebagai “kurang realistis”.
Kalau ada komponen tanpa fungsi yang jelas, tandai sebagai “ambigu”.
Kalau ada flow yang tidak menyelesaikan masalah lapangan, tandai sebagai “belum siap operasional”.

Tujuan akhirnya bukan sekadar membuat desain bagus, tapi membuat sistem website cargo udara yang:
- tepat guna,
- realistis,
- sesuai requirement,
- nyaman dipakai operator,
- siap dipresentasikan,
- dan memungkinkan untuk dikoding.