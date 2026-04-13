Tolong revisi desain dan struktur website desktop-first “SkyHub” untuk operasional cargo udara kelas C dengan ketentuan berikut.

KONTEKS
SkyHub adalah sistem operasional cargo udara untuk operator bandara / terminal cargo. Sistem dipakai di desktop ruang kendali, jadi tampilannya harus formal, bersih, cepat dibaca, nyaman dipakai berjam-jam, dan fokus pada efisiensi kerja operator. Dominan corporate blue, minim warna berlebihan, dan tidak terasa seperti dashboard umum yang terlalu dekoratif.

TUJUAN REVISI
1. Dashboard harus memuat informasi inti tanpa membuat pengguna perlu scroll panjang.
2. Informasi penting harus bisa diakses cepat dengan 1 kali tekan dari halaman awal.
3. AWB Tracking tetap menjadi menu terpisah karena kasus tracking cukup kompleks dan tidak cocok digabung penuh ke dashboard.
4. Reports dihapus.
5. Intake tidak lagi menjadi tab sendiri, tetapi digabung ke Ledger sebagai tombol untuk membuka modal / pop up input shipment baru.
6. Logs tetap dipertahankan.
7. Settings disederhanakan agar sesuai kebutuhan operator cargo udara kelas C, tidak terlalu luas untuk semua jenis industri atau semua pihak.
8. Struktur website harus terasa lebih fokus, realistis, dan sesuai kebutuhan hasil wawancara kelas C.

STRUKTUR MENU UTAMA BARU
Gunakan menu utama:
1. Dashboard
2. Cargo
3. AWB Tracking
4. Logistics
5. Logs
6. Settings

Hapus menu:
- Reports

ATURAN PENTING TENTANG DASHBOARD
Dashboard bukan tempat seluruh proses tracking detail. Dashboard hanya menampilkan ringkasan operasional dan akses cepat ke area penting.
Dashboard harus berfungsi sebagai command center singkat yang memberi gambaran kondisi operasional saat ini.
Dashboard tidak boleh terlalu panjang dan tidak boleh membuat pengguna harus scroll jauh ke bawah hanya untuk melihat info inti.

Buat dashboard memiliki sub menu / segmented tabs seperti:
- Overview
- Flight Status
- Exceptions
- Station View

Jangan masukkan AWB Tracking penuh ke sub menu dashboard.
Kalau perlu, cukup sediakan:
- quick shortcut ke AWB Tracking
- ringkasan tracking alert
- recent tracked AWB
- tracking exceptions singkat

DASHBOARD OVERVIEW
Tampilkan informasi inti operasional dalam satu layar desktop:
- KPI cards: shipments today, delayed cargo, pending documents, active flights
- tabel ringkas cargo received today
- panel urgent exceptions
- panel latest updates / live activity
- tombol quick actions

Quick actions yang tampil:
- Open Ledger
- Create Shipment
- Open AWB Tracking
- View Exceptions

DASHBOARD FLIGHT STATUS
Tampilkan status flight aktif hari ini:
- flight number
- route
- scheduled time
- estimated / actual time
- cargo readiness
- status flight

DASHBOARD EXCEPTIONS
Tampilkan exception yang perlu tindakan cepat:
- AWB mismatch
- customs hold
- missing document
- shipment delayed
- cutoff risk
- unassigned owner

DASHBOARD STATION VIEW
Tampilkan kondisi operasional area kerja:
- inbound queue
- outbound queue
- ready to load
- pending verification
- hold cargo
- dock / gate summary bila perlu

CARGO PAGE
Cargo tetap fokus pada administrasi shipment dan pencatatan.

Gunakan sub menu / tab:
- Ledger
- Documents
- Exceptions

Hapus tab:
- Intake

LEDGER
Ledger menjadi tabel utama shipment.
Tampilkan:
- AWB
- shipper
- consignee
- origin
- destination
- commodity
- pieces
- weight
- document status
- shipment status
- assigned owner
- updated time

Tambahkan:
- search
- filter status
- filter route
- filter owner
- quick row action
- open detail shipment
- tombol “+ Create Shipment” di kanan atas

INTAKE DIPINDAHKAN KE LEDGER
Jangan buat Intake sebagai halaman atau tab terpisah.
Pindahkan fungsi input shipment baru ke tombol “+ Create Shipment” pada halaman Ledger.
Saat tombol ditekan:
- buka modal / dialog / pop up besar
- tampilkan form input shipment baru
- form tetap lengkap tetapi ringkas
- setelah submit, shipment langsung masuk ke ledger

Field form:
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
- nyaman di desktop
- fokus pada input cepat dan akurat
- validasi format AWB jelas
- primary button: Create Shipment
- secondary button: Cancel

DOCUMENTS TAB
Fokus pada dokumen shipment:
- AWB
- document type
- status complete / incomplete
- verified by
- last verified time
- warning jika ada dokumen kurang

EXCEPTIONS TAB
Fokus pada masalah di level shipment:
- AWB
- exception type
- severity
- owner
- detected time
- current action / follow up

AWB TRACKING PAGE
AWB Tracking wajib tetap menjadi menu utama terpisah karena alur dan kasusnya lebih kompleks dari sekadar ringkasan dashboard.

Halaman AWB Tracking harus menjadi workspace detail untuk pelacakan shipment.
Fungsi utamanya:
- search AWB, manifest, atau flight
- lihat timeline status shipment
- lihat current location / handling stage
- lihat milestone operasional
- lihat dokumen terkait
- lihat exception terkait AWB
- lihat riwayat update status
- lihat siapa owner yang menangani
- lihat SLA / dwell / cutoff risk bila relevan

Struktur halaman AWB Tracking:
1. Search bar besar di atas
2. Summary card hasil tracking
3. Timeline status shipment
4. Shipment details panel
5. Related exceptions panel
6. Related documents panel
7. Activity log singkat untuk AWB tersebut

Data yang bisa ditampilkan:
- AWB number
- origin
- destination
- commodity
- weight
- pieces
- shipper
- consignee
- current status
- last updated
- assigned owner
- flight / manifest reference
- milestone timeline
- remarks / operational notes

Aturan UX untuk AWB Tracking:
- dirancang untuk kasus tracking yang lebih rumit
- informasi detail boleh lebih dalam daripada dashboard
- boleh memiliki tab internal seperti Summary, Timeline, Documents, Exceptions, Activity
- tetap rapi dan mudah dipindai
- fokus pada investigasi status shipment

LOGISTICS PAGE
Tetap sebagai halaman operasional pendukung untuk alur movement dan kesiapan logistik.
Bisa memuat:
- load planning
- staging status
- dock readiness
- outbound coordination
- transfer handling
- capacity / queue summary

LOGS PAGE
Pertahankan sebagai halaman terpisah.
Logs penting untuk audit dan pelacakan aktivitas user.
Tampilkan:
- timestamp
- user / role
- action
- target object
- old value
- new value
- short note
- filter by date
- filter by user
- filter by action
- filter by AWB

Jangan ubah logs menjadi tampilan dekoratif. Tetap formal, rapi, dan audit-oriented.

SETTINGS PAGE
Sederhanakan settings agar sesuai operator cargo udara kelas C, tidak terlalu luas, tidak terlalu enterprise, dan tidak terlalu generic.

Gunakan sub menu:
1. Station Setup
   - station code
   - station name
   - timezone
   - operational hours
   - default handling area

2. Workflow Rules
   - AWB validation rules
   - default shipment statuses
   - owner assignment defaults
   - special handling options
   - document checklist defaults

3. Alerts & Thresholds
   - delay threshold
   - missing document alert
   - stale update warning
   - unassigned shipment alert
   - cargo at risk highlight

4. User Access
   - operator
   - supervisor
   - admin sederhana
   - hak akses dasar yang realistis

5. Interface Preferences
   - compact table mode
   - refresh interval
   - default landing page
   - simple notification settings

Jangan masukkan settings yang terlalu luas seperti:
- billing
- multi-company management
- marketplace integration
- enterprise API settings yang kompleks
- pengaturan lintas industri yang tidak relevan

ATURAN VISUAL
- formal
- profesional
- corporate blue
- clean typography
- minim dekorasi
- nyaman untuk penggunaan lama di monitor desktop
- tabel mudah dibaca cepat
- card seperlunya saja
- warna alert dipakai secukupnya untuk issue penting
- fokus pada utilitas, bukan hiasan

ATURAN LAYOUT
- desktop-first
- dashboard harus terasa padat tapi tetap rapi
- hindari halaman awal yang terlalu panjang
- gunakan grid yang efisien
- gunakan tab / sub menu untuk membagi informasi
- gunakan modal untuk aksi input
- AWB Tracking tetap sebagai halaman kerja detail tersendiri

HASIL YANG DIINGINKAN
Buat revisi navigasi, page structure, dan layout sehingga:
- dashboard menjadi pusat pantau cepat
- AWB Tracking tetap menu terpisah karena kebutuhan kasus yang lebih kompleks
- reports dihapus
- intake digabung ke ledger sebagai modal create shipment
- logs tetap ada
- settings lebih fokus dan realistis untuk operator cargo udara kelas C
- website terasa lebih kuat secara operasional dan lebih masuk akal untuk studi kasus ini