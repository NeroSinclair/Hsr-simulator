# HSR Static Combat Simulator - 4.6

## Current menu / relic editor update

The current menu follows `menu.png`: mode selection across the top, four character cards in the middle, gear controls on the right, and Start Battle below. The battle HUD is unchanged in this update.

Base stats are now fixed character data at level 80 / ascension 6 for all 93 roster entries. Freeform baseline inputs and custom gear-stat inputs from the previous editor have been replaced. The older build-editor section below documents the previous format and is superseded by this section.

- Light Cones show real portrait images and are grouped by character Path, with red off-Path choices at the bottom. Remembrance and Elation options are included. LC base stats are fixed; S1-S5 remains selectable.
- The bundled source catalogue contains 170 Light Cones (72 five-star, 73 four-star, 25 three-star), 34 cavern sets and 28 planar sets, including all signature LCs present in that source. Names, Paths, rarities, exact Lv.80 stats, S1-S5 descriptions and permanent property bonuses are stored locally in `complete-gear-data.js`. This is a source snapshot, not a guarantee of coverage beyond the published dataset.
- Character portraits on the left only select the party slot. All character/equipment choices open from the right-side controls or the upper loadout panels. The lower six-piece editor only edits main stats and substats; set selectors and recommendation buttons were removed there.
- Toggle `2pc + 2pc` in the upper relic panel, then use its separate Set A and Set B buttons. A uses Head/Hands; B uses Body/Feet. Selecting B leaves A intact. Messenger + Sacerdos gives 12% SPD; four pieces of one 6% SPD set still only give its 2pc bonus once.
- The six real HSR slots are Head, Hands, Body, Feet, Planar Sphere and Link Rope: four relics and two planars, not five relics. Every piece has its own image, set, valid main stat and four substat rows.
- The five-star enhancement editor supports +0 through +15 and 3 or 4 initial substats. Main stats scale with level. Select low/middle/high initial rolls and milestone rolls; numeric substat inputs have been removed. Starting with 3 stats spends +3 on unlocking the fourth, then permits four enhancements. Starting with 4 permits five enhancements. Substats cannot repeat or match the main stat. Optional gacha buttons simulate random legal outcomes.
- Relics and planars have no Path lock in HSR; the menu recommends sets by Path while retaining all available choices.
- Total HP/ATK/DEF = (character base + LC base) * combined percentage bonuses + flat relic stats. SPD uses character base SPD. The preview separates base, traces, gear contributions and totals.
- Character talent, additional ability descriptions and permanent trace bonuses load automatically from StarRailRes and cache in localStorage. Assumptions: E0, level 80, all stat traces unlocked, Basic 6 and other abilities 10. Network failure is visible and retryable; no trace bonus is silently invented.
- Local innate conversions include Aventurine Leverage, Firefly Core Overload and Black Swan Candleflame. Other conditional talent mechanics are displayed as information, pending the later battle-mechanics pass.
- Trace bonuses are frozen at battle entry so background data loading cannot change a running fight.
- Upgrade totals are derived from a five-milestone history, not editable cached totals. Histories are deep-cloned on save and battle entry. Legacy freeform substats convert to legal initial roll choices when first edited, with a visible notice.
- Compact LC cards use a separate inspector for base stats and passive descriptions. All stored LCs appear by default, with Path/rarity filters and search by name, known signature owner or ID. Long descriptions scroll while the Equip button stays visible. Catalogue refresh merges new verified source entries and caches them, retaining the bundled snapshot offline. Images use a CDN/original/icon fallback. Fonts and secondary-label contrast are increased throughout the menu and editor.

Run `node verify-menu.cjs` for the current menu, six-slot model, locked bases, set thresholds, Path compatibility and inactive off-Path passives, trace parsing, innate conversions and snapshot isolation. `node verify.cjs` continues to cover the earlier battle engine and portrait regression tests. Both use DOM stubs, not browser screenshots.

Run `node verify-equipment.cjs` for A/B controls, saved mixed sets, legal roll tiers, upgrade budgets, main-stat scaling, gacha caps, cloned histories and actual search/filter callbacks. Run `node verify-browser.cjs lc` or `node verify-browser.cjs upgrade` for real Chrome DOM interactions and screenshots. Browser checks exercise 49 mapped character signatures and verify that Equip stays inside the visible inventory. Set `HSR_TEST_CHROME` or `HSR_TEST_VIEWPORT` to override the executable or window size. Generated profiles and screenshots are ignored under `.preview-equipment/`.

Primary data: [character promotions](https://github.com/Mar-7th/StarRailRes/blob/master/index_new/en/character_promotions.json), [character skill trees](https://github.com/Mar-7th/StarRailRes/blob/master/index_new/en/character_skill_trees.json), [character skills](https://github.com/Mar-7th/StarRailRes/blob/master/index_new/en/character_skills.json), [relic pieces](https://github.com/Mar-7th/StarRailRes/blob/master/index_new/en/relics.json).

Gear sources: [LC catalogue](https://github.com/Mar-7th/StarRailRes/blob/master/index_new/en/light_cones.json), [LC promotions](https://github.com/Mar-7th/StarRailRes/blob/master/index_new/en/light_cone_promotions.json), [LC passive ranks](https://github.com/Mar-7th/StarRailRes/blob/master/index_new/en/light_cone_ranks.json), [relic sets](https://github.com/Mar-7th/StarRailRes/blob/master/index_new/en/relic_sets.json). Catalogue coverage and effect simulation are separate: generic permanent stats and existing battle triggers work; other conditional, follow-up, memosprite and Elation mechanics remain outside the current training engine. Full passive text is visible on cards; it does not imply every described trigger executes.

Enhancement sources: [sub-affix roll groups](https://github.com/Mar-7th/StarRailRes/blob/master/index_new/en/relic_sub_affixes.json), [main-affix base/growth](https://github.com/Mar-7th/StarRailRes/blob/master/index_new/en/relic_main_affixes.json). Display totals truncate like the game; calculations retain fractional values, including hidden SPD decimals. Gacha buttons simulate legal outcomes; official drop and affix probabilities are not modeled.

Buka index.html langsung di browser. Tidak memerlukan instalasi atau build.

## Menu utama

Halaman pertama adalah menu pemilihan challenge. Pilih Memory of Chaos, Pure Fiction, Apocalyptic Shadow, Anomaly Arbitration, atau Free Battle. Pilih node, lihat lineup dan preview arena, atur tim, lalu tekan Mulai battle. Tombol kembali di battle membuka menu; Lanjutkan battle mempertahankan waktu AV dan giliran.

Free Battle menyediakan 22 jenis musuh yang juga digunakan pada preset. Pilih 1-5 musuh berbeda dan pilih latar arena. Mode ini tidak memakai modifier endgame. Empat anggota tim dapat dipilih dari 93 karakter/varian Path sampai versi 4.6, dengan pencarian dan pengaturan SPD.

## Kontrol

Klik musuh untuk memilih target. Q = Basic ATK, E = Skill, R = Ultimate aktif, Space = lanjut giliran musuh. Ikon Ultimate pada kartu tim bisa menginterupsi giliran saat energi penuh. Semua perubahan instan, tanpa animasi; tombol mengecil saat ditekan.

## Snapshot endgame

Lineup mengacu ke 7 November 2026, bukan update otomatis:

- MoC: Survival of the Fittest - Hoolay, Yabuli, Judge of Oblivion.
- PF: Imagined Words - Flame Reaver, King Pom-Pom, Argenti.
- AS: Dominance of Oblivion - Soulhook Sovereign, Arbiter of the Lost Abyss, Fulminating Wolflord.
- AA: Return to Roots - Knight 1-3, King in Check, Plight, dan latihan Moonlit Pegasus + Lighthouse.

Setiap node dimainkan terpisah dengan satu tim. Knight dan King menggunakan dua wave; latihan kuda adalah wave pertama King. MoC/PF/AS memakai encounter boss pilihan, bukan seluruh urutan wave resmi.

## Gambar

media.js memetakan gambar/icon musuh ke identitas dari database Gacha.gg, serta beberapa render dari wiki/Game8. Arena, preview musuh, dan antrean giliran memakai gambar agar musuh mudah dikenali. Render mencoba beberapa sumber sebelum menampilkan ilustrasi cadangan berlabel. Tidak ada model 3D atau animasi.

Gambar latar berasal dari lokasi/domain HSR dan dibedakan per mode. Ini referensi visual, bukan jaminan foto arena battle pada rotasi 4.6. Nama lokasi, batas kecocokan, dan tautan sumber tampil pada preview map. MoC/AA memakai gambar domain/menu; PF/AS memakai gambar lokasi. Gambar dan font memerlukan internet. Jika latar gagal dimuat, arena SVG lokal tetap tersedia. Pemilihan Free Battle membolehkan memilih salah satu referensi map tersebut.

## Model latihan

AV = 10000 / SPD. Cycle awal 150 AV, selanjutnya 100 AV. Cycle berlanjut antar-wave sementara jarak tim direset. Limit: MoC/Free Battle 1050 AV, PF 450 AV, AS/AA 650 AV. HP, damage, toughness, energi, kit, buff, skor, dan Plight disederhanakan. PF mengganti semua musuh termasuk boss saat dikalahkan. Tidak mencakup seluruh kit resmi, relic, light cone, eidolon, summon, follow-up, atau mekanik boss.

Hemovore, Perforation, Confinement dan Enrage diterapkan. Corrosion menjadi satu revive 30% HP; Lockdown menjadi delay dan pengurangan energi. Punchline MoC hanya dicatat di log, Aha tidak dieksekusi. Sumber roster dan lineup tersedia di Panduan dan data.js.

## Verifikasi

Jalankan node verify.cjs untuk memeriksa AV/cycle, SP, Ultimate interrupt, 15 preset endgame, pergantian wave King, Corrosion, menu awal, isolasi draft pilihan, kembali/melanjutkan, cakupan gambar musuh, serta Free Battle. Tes memakai DOM stub, bukan browser, dan tidak memverifikasi ketersediaan server gambar pihak ketiga.


## Build editor, Technique, dan status

Tombol Atur tim sekarang membuka empat slot karakter, grid roster, serta editor stat dan gear. Mengganti karakter mereset build slot tersebut. Simpan tim & build menerapkan perubahan; Cancel/close membuang draft. Input HP, ATK, DEF, SPD, CRIT Rate/DMG, Break Effect, EHR, Effect RES, ERR dan healing/DMG bonus adalah baseline sebelum gear.

HP/ATK/DEF = (baseline + base LC) * (1 + jumlah bonus persen gear/buff) + flat custom. SPD = baseline * (1 + bonus persen) + flat custom. Persen lain dijumlahkan sebagai percentage points; CRIT Rate dibatasi 100%. Base LC menggunakan preset level 80 dibulatkan. Main stat/substat enam slot relic tidak dimodelkan otomatis: masukkan ke baseline atau bonus custom, jangan dihitung dua kali. Pilih None jika memasukkan stat final yang sudah termasuk gear.

Light Cone memiliki Path lock untuk passive, tetapi tetap menambah base stat saat Path berbeda. Tersedia S1-S5 untuk subset LC yang didukung, serta Custom LC. Relic mendukung 4pc atau 2+2 (2pc sama tidak digandakan), dan planar mengevaluasi ambang stat. Set custom/LC custom menerima bonus numerik sendiri. Ini bukan seluruh database gear versi 4.6. Daftar efek didukung terlihat di editor dan sumbernya tersedia pada Panduan.

Stats berpengaruh pada damage berbasis ATK dengan rata-rata CRIT, heal berbasis HP, shield berbasis DEF, mitigasi damage DEF, energi/ERR, Break Effect, dan SPD/AV. EHR menggunakan akumulasi peluang deterministik untuk debuff Nihility. Effect RES saat ini hanya digunakan untuk ambang Broken Keel; enemy belum memberi debuff resistible. Ini model latihan, bukan seluruh formula/kit resmi.

Opsi Auto Technique aktif pada 0 AV sebelum giliran pertama, tanpa konsumsi SP/EP. Bisa dimatikan global atau per karakter. Efeknya preset per role: DPS memberi buff DMG diri, support memberi buff ATK, healer memberi regenerasi, shielder memberi shield, Nihility memberi Vulnerability pada musuh. Ini bukan Technique resmi setiap karakter.

Buff Skill/Ultimate bisa diarahkan ke satu ally atau party lewat konfigurasi build. Klik kartu ally sebelum memakai ability single-target. Indikator menunjukkan source, bonus, sisa giliran penerima, shield, dan stack; panel status menampilkan stat battle dan detail efek. Giliran penerapan tidak langsung mengurangi durasi. Ultimate interupsi bukan giliran normal dan tidak mengurangi durasi. Buff sama dari source sama direfresh, bukan ditumpuk ulang.

Bug portrait diperbaiki dengan preload/decode, cache gambar terpilih, src yang stabil saat render ulang, dan guard terhadap callback gambar karakter lama. Saat full portrait belum siap, avatar karakter yang benar tampil lebih dulu. Tes mencakup respons gambar yang selesai tidak berurutan, bukan pengukuran kecepatan jaringan aktual.

Equipment gallery: four overview panels open searchable image grids. Recommended items carry a thumbs-up badge; Light Cones are sorted by rarity (5?3). Off-Path LCs remain equippable and persist, but only HP/ATK/DEF base stats apply. Relic sets may be applied to all four pieces or individually; planar sets to both pieces or individually. Recommendations are broad Path suggestions, not character-specific optimal builds. The expanded LC catalogue supports permanent numeric passive properties; situational triggers are not all implemented.
