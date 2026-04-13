Tolong revisi desain dan struktur halaman website desktop-first bernama “SkyHub” untuk kasus operasional cargo udara kelas C berdasarkan hasil asistensi berikut.

KONTEKS PRODUK
SkyHub adalah website operasional cargo udara untuk operator bandara / terminal cargo. Fokus utamanya adalah kecepatan baca informasi, ketepatan data shipment, status operasional harian, dan kenyamanan penggunaan jangka lama di monitor desktop ruang kendali. Sistem harus formal, rapi, minim warna mencolok, dominan corporate blue, dan tidak terasa seperti dashboard umum yang terlalu ramai.

TUJUAN REVISI
1. Halaman awal harus memuat semua informasi penting tanpa perlu scroll vertikal.
2. Semua informasi penting harus bisa diakses dengan 1 kali tekan dari dashboard.
3. Dashboard dijadikan pusat kontrol utama, bukan hanya ringkasan singkat.
4. Menu yang tidak terlalu penting sebagai halaman terpisah harus dipindahkan menjadi sub menu, tab, panel, atau pop up.
5. Settings disederhanakan dan dipersempit sesuai kebutuhan operator cargo udara kelas C, bukan sistem umum untuk semua pihak.
6. Menu Logs tetap dipertahankan.
7. Menu Reports dihapus.
8. Menu Intake pada halaman Cargo tidak lagi menjadi tab terpisah, tetapi digabung ke Ledger dan dibuka dalam bentuk modal / dialog / pop up “Create New Shipment”.
9. Semua layout harus tetap desktop-first, namun masih aman saat dibuka di mobile.
10. Jangan membuat pengguna harus scroll untuk melihat info inti dashboard.

ARAH REVISI INFORMASI ARSITEKTUR
Gunakan struktur menu utama seperti ini:
1. Dashboard
2. Cargo
3. Logistics
4. Logs
5. Settings

Hapus menu:
- Reports

Jangan jadikan Tracking sebagai halaman berat yang berdiri sendiri jika fungsi utamanya bisa diserap ke dashboard dan detail cargo. Tracking cepat boleh tetap tersedia sebagai quick access di dashboard atau di dalam detail shipment.

DASHBOARD BARU
Dashboard harus menjadi command center utama yang langsung menampilkan banyak informasi penting sekaligus dalam satu layar desktop tanpa scroll. Jangan buat dashboard panjang ke bawah. Gunakan layout grid, card, dan sub menu / tab horizontal agar semua bisa diakses 1 kali klik.

Buat dashboard memiliki sub menu / segmented tab di area atas konten, misalnya:
- Overview
- Flight Status
- Exceptions
- Station View
- Quick Tracking

Fungsi tiap sub menu:
1. Overview
   Menampilkan kondisi harian paling penting dalam satu layar:
   - KPI cards ringkas: total shipment hari ini, delayed cargo, pending documents, active flights
   - tabel cargo masuk hari ini versi ringkas
   - panel urgent exceptions
   - panel latest updates / last updated
   - panel quick actions

2. Flight Status
   Menampilkan daftar flight aktif hari ini dalam bentuk tabel atau board singkat:
   - flight number
   - route
   - estimated time
   - actual status
   - cargo readiness
   - on-time / delayed / departed / arrived

3. Exceptions
   Menampilkan daftar masalah operasional yang perlu perhatian cepat:
   - AWB mismatch
   - document incomplete
   - shipment delayed
   - late handoff
   - missing timestamp
   - unassigned owner

4. Station View
   Menampilkan kondisi operasional stasiun / gudang secara cepat:
   - inbound queue
   - outbound queue
   - ready to load
   - pending verification
   - hold cargo
   - gate / dock / handoff summary bila perlu

5. Quick Tracking
   Menyediakan input AWB cepat langsung dari dashboard:
   - input nomor AWB
   - tombol cek
   - hasil status singkat muncul di panel yang sama atau side panel
   - jangan pindah halaman bila tidak perlu
   - tampilkan timestamp per status

ATURAN PENTING UNTUK DASHBOARD
- Semua informasi penting harus muat dalam 1 layar desktop.
- Hindari scroll vertikal pada halaman dashboard.
- Jika kontennya banyak, pecah menjadi sub menu / tab di dalam dashboard, bukan ditumpuk ke bawah.
- Setiap sub menu harus menampilkan konten yang utuh dan langsung bisa dipahami.
- Gunakan hierarki visual yang sangat jelas.
- Prioritaskan informasi yang paling dibutuhkan operator shift.
- Tampilkan “Last Updated” secara jelas.
- Sediakan quick action seperti:
  - Search AWB
  - Create Shipment
  - View Exceptions
  - Open Ledger

CARGO PAGE BARU
Halaman Cargo tetap ada, tetapi fokusnya untuk data shipment dan ledger.

Gunakan tab / sub menu seperti ini:
- Ledger
- Documents
- Exceptions

Hapus tab:
- Intake

REVISI KHUSUS UNTUK INTAKE
Fungsi Intake tetap ada, tetapi tidak lagi menjadi tab terpisah.
Pindahkan fungsinya ke halaman Ledger sebagai tombol:
- “+ Create Shipment”

Saat tombol ditekan:
- buka modal / dialog / pop up besar
- tampilkan form input shipment baru
- form tetap lengkap tetapi ringkas dan rapi
- setelah submit, data langsung masuk ke ledger

Form yang tetap dipakai:
- AWB Number
- Commodity
- Shipper
- Origin
- Destination
- Pieces
- Weight
- Volume
- Special Handling
- Consignee
- Forwarder
- Assigned Owner

Aturan desain modal:
- lebar cukup besar agar nyaman di desktop
- fokus pada input cepat dan akurat
- validasi format AWB harus jelas
- tombol utama: Create Shipment
- tombol sekunder: Cancel
- bisa ditutup tanpa merusak context ledger

LEDGER PAGE
Ledger harus menjadi tabel utama untuk melihat semua shipment.
Tampilkan:
- AWB
- shipper / consignee
- route
- weight
- pieces
- document status
- shipment status
- assigned owner
- updated time

Tambahkan:
- search
- filter status
- filter route / origin / destination
- quick action per row
- open detail shipment
- tombol create shipment di kanan atas

DOCUMENTS TAB
Fokus pada kelengkapan dokumen shipment.
Tampilkan:
- AWB
- jenis dokumen
- status lengkap / belum lengkap
- verifikasi terakhir
- warning jika ada dokumen kurang

EXCEPTIONS TAB
Fokus pada masalah di level shipment.
Tampilkan:
- AWB
- jenis exception
- severity
- owner
- waktu muncul
- tindakan lanjut

LOGS PAGE
Pertahankan Logs sebagai halaman terpisah.
Logs harus tetap kuat karena penting untuk audit operasional.
Tampilkan:
- timestamp
- user / role
- aksi
- objek yang diubah
- status lama
- status baru
- catatan singkat
- filter berdasarkan tanggal, user, aksi, AWB

Jangan ubah Logs menjadi card umum. Tetap pertahankan nuansa audit trail yang jelas dan formal.

SETTINGS PAGE BARU
Sederhanakan settings agar lebih sempit pasarnya dan sesuai kasus wawancara kelas C. Jangan buat settings terlalu luas seperti sistem enterprise multi-industri. Fokus hanya pada kebutuhan operator cargo udara.

Gunakan sub menu settings seperti ini:
1. Station Setup
   - station code
   - station name
   - timezone
   - operational hours
   - default handling area

2. Workflow Rules
   - urutan status shipment
   - validasi AWB
   - default assignment owner
   - special handling options
   - document checklist default

3. Alerts & Thresholds
   - delay threshold
   - missing document alert
   - unassigned shipment alert
   - last update warning
   - cargo at risk highlight

4. User Access
   - daftar user internal
   - role operator / supervisor / admin sederhana
   - hak akses dasar, tidak perlu terlalu rumit

5. Interface Preferences
   - compact mode tabel
   - refresh interval
   - default landing tab dashboard
   - notifikasi dasar

Jangan masukkan pengaturan yang terlalu jauh seperti:
- billing
- API marketplace kompleks
- multi-company management
- integrasi enterprise besar yang tidak relevan untuk tugas kelas
- setting terlalu teknis untuk semua industri

VISUAL DAN UX RULES
- gaya formal, profesional, corporate blue
- minim warna, minim dekorasi
- font clean dan mudah dibaca
- table harus nyaman dipindai cepat
- card tidak terlalu besar dan tidak terlalu dekoratif
- fokus pada utilitas
- cocok dipakai operator lebih dari 6 jam
- spacing rapi dan stabil
- gunakan aksen biru hanya untuk state aktif, tombol utama, dan penekanan penting
- exception penting boleh pakai warna alert seperlunya, tapi tetap restrained

LAYOUT RULES
- desktop-first
- dashboard wajib muat dalam 1 layar laptop / monitor tanpa scroll
- gunakan grid layout yang efisien
- sub menu dashboard harus menjadi solusi utama untuk menghindari scroll
- jangan menumpuk semua konten dalam satu halaman panjang
- gunakan dialog / pop up untuk aksi create, quick detail, dan quick tracking

RESPONSIVE RULES
- desktop tetap prioritas utama
- saat mobile, dashboard boleh berubah menjadi card stack atau tab geser
- namun struktur informasi harus tetap konsisten
- jangan terasa seperti mobile app murni
- tabel boleh disederhanakan saat mobile
- sidebar boleh collapse menjadi icon / drawer saat layar kecil

HAL YANG HARUS DIHINDARI
- dashboard panjang yang mengharuskan scroll
- halaman report terpisah
- intake sebagai tab sendiri
- settings yang terlalu luas dan terlalu generic
- terlalu banyak menu utama
- visual terlalu ramai
- duplikasi informasi antara dashboard dan halaman lain
- card dekoratif tanpa fungsi nyata

HASIL YANG DIINGINKAN
Buat revisi struktur halaman, navigasi, dan layout sehingga:
- dashboard benar-benar menjadi pusat kerja utama tanpa scroll
- semua info penting bisa diakses 1 klik
- reports dihapus
- intake dipindah jadi modal di ledger
- logs tetap ada
- settings lebih sempit, realistis, dan sesuai operator cargo udara kelas C
- website terasa lebih fokus, lebih realistis, lebih siap di-code, dan lebih cocok untuk studi kasus operasional cargo udara