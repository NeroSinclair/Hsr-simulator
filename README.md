# 🎮 HSR Simulator — Relic & Light Cone Experiment

**A fan-made Honkai: Star Rail build experimentation and battle simulation website.**

HSR Simulator merupakan website buatan **NeroSinclair** yang dikembangkan sebagai sarana eksperimen build karakter dalam game *Honkai: Star Rail*.

Website ini memungkinkan pengguna untuk mencoba berbagai kombinasi **Relic, Planar Ornament, dan Light Cone**, serta melihat perubahan statistik karakter tanpa harus melakukan perubahan langsung di dalam game.

Proyek ini dibuat untuk membantu pemain mengeksplorasi berbagai kemungkinan build secara lebih fleksibel.

---

## ✨ Fitur Utama

### 🛠️ Character Build Experiment

Pengguna dapat memilih karakter dan bereksperimen dengan berbagai konfigurasi build, meliputi:

- Pemilihan karakter dari roster Honkai: Star Rail.
- Penggantian Light Cone sesuai kebutuhan.
- Pengaturan Superimposition Light Cone (S1–S5).
- Pemilihan Relic dan Planar Ornament.
- Pengaturan Main Stat dan Substat Relic.
- Simulasi peningkatan Relic dari +0 sampai +15.
- Perhitungan statistik karakter berdasarkan kombinasi equipment.

Fitur ini ditujukan untuk memberikan gambaran mengenai perubahan build sebelum diterapkan di dalam game.

### ⚔️ Battle Simulator

**🚧 Status: Under Development**

Fitur Battle Simulator masih dalam tahap pengembangan dan penyempurnaan.

Simulator dirancang untuk menyediakan simulasi pertarungan sederhana dengan beberapa mekanik utama, seperti:

- Action Value (AV) dan urutan giliran.
- Perhitungan damage dan pertahanan.
- Basic Attack, Skill, dan Ultimate.
- HP, Toughness, dan Energy.
- Simulasi beberapa mode endgame.
- Pengujian performa build dalam skenario pertarungan.

**Catatan:** Mekanik pertarungan belum sepenuhnya merepresentasikan sistem asli Honkai: Star Rail. Beberapa efek karakter, Light Cone, Relic, dan musuh masih menggunakan pendekatan atau model simulasi sederhana.

Hasil simulasi tidak dimaksudkan sebagai prediksi damage atau performa yang sepenuhnya akurat di dalam game.

---

## 🎯 Tujuan Pengembangan

HSR Simulator dikembangkan untuk:

1. Menyediakan tempat eksperimen Relic dan Light Cone secara fleksibel.
2. Membantu pemain memahami pengaruh equipment terhadap statistik karakter.
3. Mempermudah perbandingan berbagai kombinasi build.
4. Mengembangkan sistem simulasi pertarungan yang lebih mendekati mekanik asli Honkai: Star Rail.

---

## 🌐 Akses Website

**Live Website:**

https://hsr-simulator-battle.nerosinclair123.workers.dev/

Website dapat digunakan langsung melalui browser tanpa mengunduh atau menginstal aplikasi tambahan.

## 💻 Teknologi

Proyek ini dikembangkan menggunakan:

- HTML5
- CSS3
- JavaScript
- Cloudflare Workers untuk hosting dan deployment
- GitHub untuk version control

Website tidak memerlukan database atau backend khusus untuk eksperimen build yang diproses langsung melalui browser.

---

## 📌 Development Status

| Fitur | Status |
|---|---|
| Character Selection | Available |
| Relic & Planar Editor | Available |
| Light Cone Selection | Available |
| Character Stat Calculation | Available |
| Relic Enhancement Experiment | Available |
| Battle Simulator | In Development |
| Advanced Combat Mechanics | In Development |
| Complete Character Skill Simulation | Planned |

Fitur dan mekanik dapat berubah seiring perkembangan proyek.

---

## 👨‍💻 Developer

<<<<<<< HEAD
**Created & Developed by NeroSinclair**

GitHub: https://github.com/NeroSinclair/Hsr-simulator

Proyek ini merupakan proyek independen yang dibuat untuk eksperimen, pembelajaran, dan pengembangan sistem simulasi berbasis web.

---

## ⚠️ Disclaimer

HSR Simulator adalah proyek buatan penggemar (*fan-made*) dan tidak berafiliasi, disponsori, maupun didukung secara resmi oleh HoYoverse.

*Honkai: Star Rail*, nama karakter, ilustrasi, dan aset terkait merupakan milik pemegang hak cipta masing-masing.

Data dan mekanik yang tersedia dapat mengandung keterbatasan atau perbedaan dari game aslinya.

---

**Made with passion by NeroSinclair. ⭐**
=======
Equipment gallery: four overview panels open searchable image grids. Recommended items carry a thumbs-up badge; Light Cones are sorted by rarity (5?3). Off-Path LCs remain equippable and persist, but only HP/ATK/DEF base stats apply. Relic sets may be applied to all four pieces or individually; planar sets to both pieces or individually. Recommendations are broad Path suggestions, not character-specific optimal builds. The expanded LC catalogue supports permanent numeric passive properties; situational triggers are not all implemented.


## Preset tim dan signature LC (8 November 2026)

Menu preset berisi 125 formasi unik dan 81 profil gear. Acuan meta versi 4.6 diurutkan pertama; varian adaptasi dan tim klasik diberi label tersendiri. Filter Acuan, gaya bermain, investasi, serta pencarian karakter dapat digabung. Label F2P berarti tanpa karakter limited 5-star, bukan jaminan seluruh karakter atau LC diperoleh gratis.

Data awal berada di team-presets-data.js, pembaruan versi di team-presets-meta.js, dan wizard di team-presets.js. Sumber ditautkan per formasi dan per profil karakter. Variasi adaptasi merupakan pilihan penyusun berdasarkan sinergi, bukan tier resmi atau hasil benchmark simulator. Preset tetap E0; catatan Waveflair menjelaskan ketika acuan performa memakai E1. Snapshot 4.7 tetap coming soon.

Signature LC dibedakan memakai ID untuk bentuk karakter baru dan nama katalog untuk roster lama. Silver Wolf LV.999 merekomendasikan Welcome to the Cosmic City; Silver Wolf Nihility tetap Incessant Rain. Signature menjadi pilihan pertama di inventori dan opsi LC utama pada wizard, sementara opsi ekonomis tetap tersedia secara terpisah.

Verifikasi: node verify-team-presets.cjs memeriksa keunikan formasi, sumber, signature/owner/rekomendasi, semua pilihan gear, stat finite, legalitas relic +15, filter, batal, review dan apply. node verify-team-presets-browser.cjs serta argumen mobile memeriksa alur browser desktop dan viewport 500 px; bukan pengujian perangkat fisik Android/iOS. Tes battle umum: node verify.cjs; inventori/editor: node verify-equipment.cjs.


### Tambahan tim Cyrene dan katalog Free Battle

23 formasi tambahan mencakup Anaxa/Cyrene/Cerydra, Aglaea/Cyrene, Mydei/Cyrene, Hysilens/Cyrene, serta varian follow-up Cipher/Cyrene dengan Ashveil, Feixiao, Ratio, dan Tribbie. Rujukan sinergi: KQM Cyrene (panduan v3.7) dan Prydwen Cyrene, diperiksa 8 November 2026. Variasi koleksi tetap berlabel adaptasi; khusus Cipher/Cyrene di luar Chrysos Heir tidak diklaim sebagai core terbaik.

Free Battle menyertakan snapshot 484 nama musuh: 482 nama dari data monster dan 2 entri indeks gambar tanpa data stat. Tersedia 2.754 varian bernama yang memiliki data numerik; varian difficulty atau bentuk yang memakai nama sama dikelompokkan. Filter jenis, faksi, weakness, pencarian nama/ID, dan pagination 48 kartu menjaga daftar bisa dipakai di layar HP. Weakness filter memeriksa semua varian musuh. Pilihan +1 memungkinkan duplikat hingga lima slot. Ikon disimpan lokal; dua entri tanpa ikon khusus memakai icon umum.

Weakness, SPD dan toughness mengikuti varian terpilih; toughness dibagi 3 untuk satuan engine latihan. HP latihan = baseHealth data ? 100 ? pengali UI (0.5/1/2/5), bukan rumus level musuh resmi. Dua entri tanpa stat memakai profil latihan tanpa weakness, dengan keterangan di lineup. Skill boss unik, summon otomatis, resistansi individual, level scaling resmi, dan transisi fase masih mengikuti batas engine latihan. Data menu dan battle dipisahkan; mengubah varian/HP di menu tidak menulis ulang musuh aktif, dan Reset memakai konfigurasi yang sudah diterapkan.

free-enemies-data.js dihasilkan oleh tools/build-enemy-catalog.py dari cache HSRMaps en/monster.json dan HTML indeks Gacha.gg. tools/download-enemy-images.py menyimpan ikon yang diperlukan. Verifikasi tambahan: node verify-free-battle.cjs memeriksa seluruh varian, kelengkapan gambar lokal, filter, pagination, duplikat, batas slot, commit/reset, dan target tanpa toughness. Tes browser preset juga mencakup Free Battle pada desktop dan viewport 500 px.


### Fase boss dan UI battle mobile

Free Battle memiliki pengaturan Fase boss: 1, 2, atau 3. Berlaku pada semua entri bertipe Boss di lineup; elite dan musuh biasa tetap satu fase. Setiap fase memakai HP, weakness, SPD dan toughness dari varian yang sama. Saat HP habis sebelum fase terakhir, boss yang sama memulihkan HP/toughness dan menghapus efek aktifnya; UID, posisi AV, tim, SP, wave dan musuh pendamping dipertahankan. Tidak ada damage overflow ke fase berikutnya. Kill dan bonus skor kill diberikan hanya pada fase terakhir. Pengaturan fase memakai snapshot saat Start dan tetap dipertahankan saat Reset. Ini fase latihan, bukan implementasi perubahan kit resmi per fase.

Pada mobile, Start dan Lanjutkan battle mencoba fullscreen lalu screen.orientation.lock('landscape') dalam alur klik pengguna. Kembali ke menu membatalkan request tertunda, melepas lock yang dibuat aplikasi, dan keluar dari fullscreen yang dibuat aplikasi. Browser yang tidak mendukung atau menolak API tetap bisa memainkan battle. Pada portrait tersedia petunjuk putar HP, tombol coba fullscreen, dan opsi tetap portrait. iPhone Safari tidak dapat dijamin berputar otomatis; gunakan rotasi perangkat jika API tidak tersedia.

Layout mobile memakai tinggi viewport dinamis dan safe area layar. Arena, empat kartu tim, aksi dan tombol giliran musuh menempati baris terpisah. Tombol aksi dan Ultimate tim minimal 44 px. Log dan detail stat memakai panel buka/tutup; pada landscape pendek badge efek musuh tersedia lewat Detail agar gambar dan bar HP tetap terlihat. Tampilan desktop lebar tetap memakai layout semula.

Verifikasi: node verify-boss-phases.cjs untuk fase, kill/win timing, kontinuitas AV, pendamping, dan snapshot. node verify-battle-browser.cjs untuk geometri UI serta API fullscreen/orientasi yang dimock; parameter ukuran window dapat dipakai untuk landscape kecil dan portrait. Browser diuji pada viewport landscape 828x382, 651x375, 651x320 serta portrait 500x844. Ini pengujian Chrome headless, bukan pengujian orientasi pada perangkat Android/iOS fisik.

Acuan API: https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock dan https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen .
>>>>>>> 15b7314 (Update ui mobile, menu, preset, and fix some bug - HSR Simulator 1.5)
