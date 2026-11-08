/* Presentation-only localization: combat values, names and stored builds stay intact. */
'use strict';
(() => {
 if (typeof MutationObserver === 'undefined' || !document.createTreeWalker) return;
 const phrases = [
  ['COMBAT PREPARATION','SIAPKAN TIMMU','PREPARE YOUR TEAM'],
  ['Prepare your','Susun tim,','Build your team,'],
  ['next journey.','coba strategimu.','try your strategy.'],
  ['Endgame atau pertarungan pilihanmu','Pilih tantangan, atau tentukan sendiri musuh yang ingin kamu lawan.','Choose a challenge, or pick the enemies you want to fight.'],
  ['Empat karakter. Satu tim.','Pilih empat karakter yang akan bertarung bersama.','Choose four characters to fight together.'],
  ['03 / CHARACTER EQUIPMENT','03 / ATUR PERLENGKAPAN','03 / SET UP EQUIPMENT'],
  ['Stage & enemy lineup','Pilih arena dan susunan musuh','Choose a stage and enemy lineup'],
  ['Klik untuk memilih node atau musuh','Buka untuk memilih tantangan dan melihat musuhnya','Open to choose a challenge and see its enemies'],
  ['Pilih slot karakter di sebelah kiri untuk mengatur build-nya.','Pilih karakter di sebelah kiri, lalu atur perlengkapan dan statistiknya di sini.','Select a character on the left, then adjust their equipment and stats here.'],
  ['Premium, hemat, dan F2P · pilih tim, lanjut atur Light Cone, relic & planar.','Bingung mulai dari mana? Pilih contoh tim, lalu sesuaikan perlengkapannya.','Not sure where to start? Pick a sample team, then adjust its equipment.'],
  ['Auto Technique saat masuk battle','Gunakan Technique otomatis sebelum bertarung','Use Technique automatically before battle'],
  ['Preset latihan per role / 0 AV / tanpa SP atau EP.','Efek awal sesuai peran karakter. Tidak menghabiskan giliran, poin skill, atau energi.','Starting effects based on character roles. Uses no turns, skill points, or energy.'],
  ['STATIC / NO ANIMATION / AV & CYCLE','COBA TIM · PELAJARI GILIRAN · ATUR STRATEGI','TRY TEAMS · LEARN TURNS · PLAN YOUR STRATEGY'],
  ['STATIC INTERFACE','SIMULASI PERTEMPURAN','BATTLE SIMULATOR'],
  ['NO ANIMATION','COBA STRATEGIMU','TRY YOUR STRATEGY'],
  ['TURN-BASED','BERBASIS GILIRAN','TURN-BASED'],
  ['Ⅱ STATIC','Ⅱ SIMULATOR','Ⅱ SIMULATOR'],
  ['START BATTLE','MULAI BERTARUNG','START BATTLE'],
  ['COMING SOON','SEGERA HADIR','COMING SOON'],
  ['Coming soon','Segera hadir','Coming soon'],
  ['CHARACTER SELECTION','PILIH KARAKTER','CHARACTER SELECTION'],
  ['Character Selection','Pilih karakter','Character selection'],
  ['TEAM SETUP','SUSUN TIM','TEAM SETUP'],
  ['PARTY PRESETS','CONTOH TIM','SAMPLE TEAMS'],
  ['EQUIPMENT INVENTORY','PILIH PERLENGKAPAN','EQUIPMENT INVENTORY'],
  ['ARENA PREVIEW · REFERENCE IMAGE','PRATINJAU ARENA · GAMBAR REFERENSI','ARENA PREVIEW · REFERENCE IMAGE'],
  ['01 / ENCOUNTER','01 / LAWAN','01 / ENCOUNTER'],
  ['YOUR OWN ENCOUNTER','TENTUKAN LAWANMU','CHOOSE YOUR OPPONENTS'],
  ['Challenge Selection','Pilih tantangan','Challenge selection'],
  ['CHALLENGE SELECT','PILIH TANTANGAN','CHALLENGE SELECT'],
  ['STAGE / NODE','ARENA / TANTANGAN','STAGE / NODE'],
  ['VERSION','VERSI','VERSION'],
  ['COMBAT SIMULATOR','SIMULASI PERTEMPURAN','BATTLE SIMULATOR'],
  ['COMBAT LOG','CATATAN PERTEMPURAN','BATTLE LOG'],
  ['ACTION ORDER','URUTAN GILIRAN','TURN ORDER'],
  ['ACTION VALUE','WAKTU GILIRAN (AV)','ACTION VALUE (AV)'],
  ['ON THE FIELD','SEDANG BERTINDAK','ON THE FIELD'],
  ['TOTAL DAMAGE','TOTAL KERUSAKAN','TOTAL DAMAGE'],
  ['ENEMIES DEFEATED','MUSUH DIKALAHKAN','ENEMIES DEFEATED'],
  ['SKILL POINTS','POIN SKILL','SKILL POINTS'],
  ['STAT PREVIEW · OUTSIDE BATTLE','STATISTIK SEBELUM BERTARUNG','STATS BEFORE BATTLE'],
  ['ENEMY TARGET','TARGET MUSUH','ENEMY TARGET'],
  ['ALLY TARGET / BUFF RECIPIENT','REKAN PENERIMA EFEK','ALLY TARGET / BUFF RECIPIENT'],
  ['Atur tempo dan taklukkan boss sebelum cycle habis.','Kalahkan bos sebelum batas waktu habis. Perhatikan urutan giliran timmu.','Defeat the boss before time runs out. Keep an eye on your team’s turn order.'],
  ['Hadapi reinforcement dan kumpulkan skor latihan.','Lawan musuh yang terus berdatangan dan kumpulkan skor setinggi mungkin.','Fight incoming waves of enemies and aim for a high score.'],
  ['Hancurkan toughness, lalu tuntaskan boss.','Habiskan ketahanan musuh, lalu serang bos saat pertahanannya terbuka.','Deplete enemy toughness, then strike the boss while it is vulnerable.'],
  ['Knight, King in Check, Plight, dan latihan kuda.','Coba tantangan Knight, King in Check, Plight, atau latihan melawan kuda.','Try Knight, King in Check, Plight, or a practice fight against the horse.'],
  ['Pilih sendiri hingga lima musuh dan arena.','Susun beberapa node, lalu pilih musuh untuk tiap pertarungan.','Build a sequence of nodes and choose enemies for each fight.'],
  ['Pilih empat karakter yang berbeda.','Pilih empat karakter yang berbeda.','Choose four different characters.'],
  ['Pilih empat karakter berbeda.','Pilih empat karakter berbeda.','Choose four different characters.'],
  ['Pilih minimal satu musuh untuk memulai.','Pilih setidaknya satu musuh untuk mulai bertarung.','Choose at least one enemy to start a battle.'],
  ['Pilih minimal satu musuh.','Pilih setidaknya satu musuh.','Choose at least one enemy.'],
  ['Musuh dan lineup versi 4.7 belum tersedia. Pilih versi 4.6 untuk bermain.','Musuh versi 4.7 belum tersedia. Pilih versi 4.6 untuk mulai bermain.','Version 4.7 enemies are not available yet. Select version 4.6 to play.'],
  ['Arena dan encounter akan ditambahkan nanti.','Arena dan tantangannya akan ditambahkan nanti.','Arenas and encounters will be added later.'],
  ['Gambar tidak tersedia','Gambar tidak tersedia','Image unavailable'],
  ['Arena cadangan · gambar tidak dapat dimuat','Arena cadangan · gambar tidak dapat dimuat','Fallback arena · image could not load'],
  ['Fan project / Tidak berafiliasi dengan HoYoverse.','Dibuat oleh penggemar. Tidak berafiliasi dengan HoYoverse.','A fan project. Not affiliated with HoYoverse.'],
  ['Dibuat untuk bereksperimen. Tidak berafiliasi dengan HoYoverse.','Tempat mencoba strategi. Tidak berafiliasi dengan HoYoverse.','A place to try strategies. Not affiliated with HoYoverse.'],
  ['Klik musuh untuk memilih target','Klik musuh yang ingin kamu serang','Click an enemy to choose your target'],
  ['Menyiapkan pertempuran','Menyiapkan pertempuran','Preparing battle'],
  ['Tidak ada buff/debuff sementara yang aktif.','Belum ada efek penguatan atau pelemahan sementara.','No temporary buffs or debuffs are active.'],
  ['Pilih tim untuk perjalananmu.','Mulai dari contoh tim yang cocok untukmu.','Start with a sample team that suits you.'],
  ['Atur main stat & substat','Atur statistik perlengkapan','Adjust equipment stats'],
  ['Simpan tim & build','Simpan tim dan perlengkapan','Save team and equipment'],
  ['Lanjutkan battle','Lanjutkan pertempuran','Resume battle'],
  ['Mulai ulang battle','Ulangi pertempuran','Restart battle'],
  ['Lanjut giliran musuh','Jalankan giliran musuh','Play enemy turn'],
  ['Kembali ke menu utama','Kembali ke menu utama','Back to main menu'],
  ['Versi simulator','Versi simulator','Simulator version'],
  ['Panduan','Panduan','Guide'], ['Versi','Versi','Version'], ['Tim','Tim','Team'],
  ['Challenge','Tantangan','Challenge'], ['Preset tim','Contoh tim','Sample teams'],
  ['01 / PILIH MODE','01 / PILIH MODE','01 / CHOOSE A MODE'],
  ['02 / PILIH KARAKTER','02 / PILIH KARAKTER','02 / CHOOSE CHARACTERS'],
  ['Free Battle','Pertarungan bebas','Free Battle'],
  ['Custom enemy lineup','Susunan musuh pilihanmu','Custom enemy lineup'],
  ['Coba lagi','Coba lagi','Try again'], ['Pilih karakter','Pilih karakter','Choose character'],
  ['Slot karakter','Slot karakter','Character slot'], ['Cari karakter','Cari karakter','Search characters'],
  ['Cari nama, elemen, atau Path…','Cari nama, elemen, atau Path…','Search name, element, or Path…'],
  ['Cari nama gear atau Path...','Cari nama perlengkapan atau Path…','Search equipment name or Path…'],
  ['Pilih gear','Pilih perlengkapan','Choose equipment'], ['Cari gear','Cari perlengkapan','Search equipment'],
  ['Lepas gear','Lepas perlengkapan','Unequip'], ['Tutup pemilih gear','Tutup pilihan perlengkapan','Close equipment picker'],
  ['Pasang pada','Pasang pada','Equip on'], ['Slot gear tujuan','Slot perlengkapan tujuan','Equipment target slot'],
  ['Semua Path','Semua Path','All Paths'], ['Path karakter','Path karakter','Character’s Path'], ['Path lain','Path lain','Other Paths'],
  ['Semua bintang','Semua tingkat kelangkaan','All rarities'], ['Perbarui katalog','Perbarui katalog','Refresh catalogue'],
  ['Rarity','Kelangkaan','Rarity'], ['5-star','5 bintang','5-star'], ['4-star','4 bintang','4-star'], ['3-star','3 bintang','3-star'],
  ['Jenis musuh','Jenis musuh','Enemy type'], ['Faksi','Faksi','Faction'], ['Weakness','Kelemahan','Weakness'],
  ['Reset filter','Hapus filter','Reset filters'], ['Kosongkan lineup','Hapus semua musuh','Clear lineup'],
  ['Fase boss','Fase bos','Boss phases'], ['Jumlah fase boss','Jumlah fase bos','Number of boss phases'],
  ['HP latihan','Pengali HP musuh','Enemy HP multiplier'], ['Lineup pilihan','Musuh pilihan','Selected enemies'],
  ['Cari musuh…','Cari musuh…','Search enemies…'], ['Cari musuh free battle','Cari musuh untuk pertarungan bebas','Search free battle enemies'],
  ['Tampilkan lagi','Tampilkan lagi','Show more'], ['Sumber katalog musuh','Sumber data musuh','Enemy catalogue sources'],
  ['Pilih arena','Pilih arena','Choose arena'], ['Sumber gambar','Sumber gambar','Image source'],
  ['Isi slot','Isi slot','Fill slot'], ['Slot tujuan','Slot tujuan','Target slot'],
  ['Tutup preset tim','Tutup contoh tim','Close sample teams'], ['Langkah preset','Langkah memilih tim','Team selection steps'],
  ['Atur Light Cone,','Atur Light Cone,','Set up Light Cones,'],
  ['Relic & Planar','Relic dan Planar','Relics & Planar Ornaments'],
  ['Putar HP ke landscape','Putar HP ke posisi mendatar','Turn your phone sideways'],
  ['Jika layar belum berputar otomatis, putar HP agar arena dan tombol lebih leluasa.','Putar HP ke posisi mendatar agar arena dan tombol lebih mudah dilihat.','Turn your phone sideways to give the arena and controls more room.'],
  ['Coba fullscreen','Coba layar penuh','Try fullscreen'], ['Tetap portrait','Tetap tegak','Stay in portrait'],
  ['Fullscreen dan landscape','Layar penuh dan mendatar','Fullscreen and landscape'],
  ['Basic ATK','Serangan biasa','Basic ATK'], ['Skill Point','poin skill','Skill Point'],
  ['Energy','Energi','Energy'], ['CYCLE','SIKLUS','CYCLE'], ['WAVE','GELOMBANG','WAVE'],
  ['AV KE CYCLE BERIKUT','AV KE SIKLUS BERIKUT','AV TO NEXT CYCLE'],
  ['Set pieces','Jumlah bagian set','Set pieces'], ['Second 2pc','Set kedua (2 bagian)','Second 2-piece set'],
  ['Reset build','Atur ulang perlengkapan','Reset build'], ['RELIC SET','SET RELIC','RELIC SET'],
  ['STAT PREVIEW','PRATINJAU STATISTIK','STAT PREVIEW'], ['OUTSIDE BATTLE','SEBELUM BERTARUNG','OUTSIDE BATTLE'],
  ['Light Cone passive','Efek pasif Light Cone','Light Cone passive'],
  ['SPD threshold active','Ambang SPD tercapai','SPD threshold active'], ['CRIT threshold active','Ambang CRIT tercapai','CRIT threshold active'],
  ['Max HP','HP maksimum','Max HP'], ['Healing','Pemulihan HP','Healing'],
  ['Premium','Premium','Premium'], ['Hemat','Hemat','Budget'], ['Kembali','Kembali','Back'],
  ['Lanjut','Lanjut','Continue'], ['Pakai tim ini','Gunakan tim ini','Use this team'], ['Pilih tim','Pilih tim','Choose team'],
  ['Rekomendasi','Rekomendasi','Recommendations'], ['Tidak ada','Tidak ada','None'],
 ];
 // Full paragraphs take precedence over short labels. Both translations are explicit
 // so repeated switches never translate already translated text.
 const extra = [
  ['Semua jenis','All types'],['Semua faksi','All factions'],['Semua weakness','All weaknesses'],['Musuh biasa','Normal enemy'],['Boss','Boss'],['Summon / objek','Summon / object'],['Preset simulator','Simulator preset'],['Varian musuh','Enemy variant'],['Tanpa weakness','No weaknesses'],['Icon umum','Generic icon'],['Pilih musuh dari katalog di bawah.','Choose enemies from the catalogue below.'],['Tidak ada musuh yang cocok. Ubah filter atau pencarian.','No matching enemies. Change your filters or search.'],['Pilih 1–5 musuh dari katalog.','Choose 1–5 enemies from the catalogue.'],['Data stat belum tersedia ? memakai profil latihan tanpa weakness.','Stat data unavailable; using a practice profile without weaknesses.'],
  ['Pilih hingga 5 slot; tombol +1 menambahkan musuh yang sama. Varian mengubah weakness, SPD, HP dan toughness. HP latihan memakai skala simulator; pengaturan fase memulihkan HP dan toughness boss sebanyak 1?3 bar. Musuh biasa dan elite tetap satu fase; kit unik dan summon otomatis belum disimulasikan sepenuhnya.','Choose up to 5 enemies; +1 adds another copy. Variants change weaknesses, SPD, HP, and toughness. The HP multiplier scales enemy health. Boss phases restore HP and toughness for 1–3 bars. Normal and elite enemies have one phase. Unique abilities and automatic summons are not fully simulated.'],
  ['Pilih karakter dan gear. Base stat Lv.80 serta trace mengikuti karakter; stat manual hanya di main/substat 4 relic dan 2 planar. Mengganti karakter mereset gear slot itu.','Choose characters and equipment. Level 80 base stats and Traces follow the character; edit main stats and substats on four Relics and two Planar Ornaments. Changing a character resets that slot’s equipment.'],
  ['Base stat dikunci sesuai karakter. Seluruh stat trace diasumsikan unlocked. Bonus stat permanen masuk total otomatis; talent bersyarat ditampilkan di bawah dan tidak diubah manual.','Base stats follow the character and cannot be edited. All stat Traces are assumed unlocked. Permanent bonuses are included automatically; conditional Talents are shown below.'],
  ['Efek situasional, follow-up, summon, dan mekanik talent penuh belum dieksekusi oleh engine latihan. Fokus tahap ini adalah menu dan perhitungan gear/stat permanen.','Conditional effects, follow-up attacks, summons, and full Talent mechanics are not yet simulated. Equipment and permanent stat calculations are supported.'],
  ['Base stat Lv.80 sudah tersedia lokal untuk semua karakter. Data trace/talent dimuat dari StarRailRes dan disimpan di perangkat. Bonus trace belum dihitung sampai data selesai dimuat.','Level 80 base stats are available locally for every character. Trace and Talent data load from StarRailRes and are cached on this device. Trace bonuses are not included until loading completes.'],
  ['Talent situasional karakter dapat dilihat pada tab Talent & Traces.','View conditional character Talents in the Talents & Traces tab.'],
  ['Total = (base karakter + base LC) × bonus persen gabungan + flat relic. Gear Δ mencakup interaksi base LC dengan trace. Main/substat dihitung per piece; set bonus hanya sekali pada ambang 2pc/4pc. Efek talent situasional tidak dianggap stat permanen.','Total = (character base + Light Cone base) × combined percentage bonuses + flat Relic stats. Equipment Δ includes interactions between Light Cone base stats and Traces. Stats are calculated per piece; set bonuses apply once at 2/4 pieces. Conditional Talents are not permanent stats.'],
  ['Level lebih tinggi juga membuka semua Eidolon sebelumnya. Keterangan asli berbahasa Inggris. Efek kit Eidolon belum diterapkan pada battle.','Higher levels also unlock all earlier Eidolons. Original descriptions are in English. Eidolon kit effects are not yet applied in battle.'],
  ['Level disimpan bersama build. Efek kit dan peningkatan level skill Eidolon belum diterapkan pada perhitungan battle. Keterangan asli berbahasa Inggris.','The level is saved with your build. Eidolon kit effects and skill level increases are not yet included in battle calculations. Original descriptions are in English.'],
  ['Tanpa Eidolon. Pilih E1–E6 untuk membuka secara bertahap.','No Eidolons. Choose E1–E6 to unlock them in order.'],['terbuka. Pilih E0 untuk mengunci semua Eidolon.','unlocked. Choose E0 to lock all Eidolons.'],
  ['Data & ikon','Data & icons'],['Pilih level Eidolon','Choose Eidolon level'],['tanpa Eidolon','no Eidolons'],['buka Eidolon 1 sampai','unlock Eidolons 1 through'],['TERBUKA','UNLOCKED'],['TERKUNCI','LOCKED'],['Terbuka','Unlocked'],['Terkunci','Locked'],['Dasar','Base'],['Buka E1','Unlock E1'],['terbuka','unlocked'],
  ['Gear & Eidolon','Equipment & Eidolons'],['Tinjau & terapkan','Review & apply'],['Pilih tim & atur gear','Choose team & equipment'],['Tidak ada preset yang cocok. Coba kategori lain atau hapus pencarian.','No matching teams. Try another category or clear your search.'],['Acuan build','Build reference'],['Pilihan LC ekonomis','Budget Light Cones'],['Pilihan LC utama / signature','Recommended / signature Light Cones'],['Profil main stat','Main stat profile'],['Karakter sebelumnya','Previous character'],['Karakter berikutnya','Next character'],['Daftar tim','Team list'],['Tinjau party','Review team'],['Kembali ke gear','Back to equipment'],['Terapkan ke party','Apply to team'],['Ubah build','Edit equipment'],['Preset terakhir','Last sample team'],['karakter, gear, dan Eidolon sudah diterapkan.','characters, equipment, and Eidolons applied.'],
  ['Memasang 4 relic + 2 planar pada +15, dengan roll substat contoh yang legal. Ambang SPD/EHR dan stat akhir masih bisa disesuaikan di editor.','Equips four Relics and two Planar Ornaments at +15 with valid sample substat rolls. Adjust SPD/EHR thresholds and final stats in the editor.'],
  ['Keempat karakter dan gear di bawah akan mengganti party menu saat diterapkan. Battle yang sedang berjalan memakai snapshot sebelumnya.','Applying this replaces the four characters and equipment in the menu. An ongoing battle keeps its previous setup.'],
  ['Diperbarui 8 November 2026 ? versi 4.6. Acuan meta tampil pertama, diikuti adaptasi dan tim klasik. Gunakan filter acuan untuk melihat hanya tim meta. Pilih tim, lalu sesuaikan gear dan Eidolon tiap karakter. F2P di sini berarti tanpa karakter limited 5★; sebagian 4★ tetap berasal dari warp. Mono berarti empat karakter dengan Path yang sama.','Updated 8 November 2026 · version 4.6. Meta references appear first, followed by adapted and classic teams. Use the reference filter to show only meta teams. Pick a team, then customize each character’s equipment and Eidolons. F2P means no limited 5-star characters; some 4-stars still come from Warps. Mono means four characters sharing a Path.'],
  ['Semua acuan','All references'],['Semua gaya','All playstyles'],['Semua investasi','All budgets'],['Gaya bermain','Playstyle'],['Investasi','Budget'],['Acuan','Reference'],['Cari preset atau karakter…','Search sample teams or characters…'],['Cari preset tim','Search sample teams'],['Batal','Cancel'],['Karakter preset','Sample team character'],
  ['Data talent belum tersedia','Talent data unavailable'],['Muat ulang data trace','Reload Trace data'],['Trace data belum dimuat','Trace data not loaded'],['Karakter','Character'],['Pilih slot','Choose slot'],['Hapus','Remove'],['Tambah satu','Add one'],['Varian','Variant'],['nama musuh','enemy names'],['varian data. Termasuk boss, elite, musuh biasa, summon, dan objek khusus.','data variants. Includes bosses, elites, normal enemies, summons, and special objects.'],['hasil','results'],['fase','phases'],['musuh','enemies'],['referensi','reference'],['Jumlah','Number'],['Nilai','Value'],
 ];
 extra.push(
  ['Light Cone Inventory','Light Cone inventory'],['Pilih kartu Light Cone untuk melihat detail.','Select a Light Cone card to see its details.'],['Path berbeda: hanya base HP, ATK dan DEF yang aktif. Pasif OFF.','Different Path: only base HP, ATK, and DEF apply. Passive disabled.'],['Path sesuai · bonus pasif stat aktif.','Matching Path · passive stat bonuses enabled.'],['Efek situasional mengikuti dukungan engine latihan.','Conditional effects depend on simulator support.'],['Sudah dipakai','Equipped'],['Pasang Light Cone','Equip Light Cone'],['DIPAKAI','EQUIPPED'],['Pasif OFF','Passive disabled'],['pasif OFF','passive disabled'],['ditampilkan','shown'],['tersimpan','stored'],['Memeriksa katalog terbaru…','Checking for catalogue updates…'],['Snapshot lokal · pembaruan online belum tersedia','Local snapshot · online updates unavailable'],['Katalog tersinkron dari sumber','Catalogue synced from source'],['Katalog lokal siap','Local catalogue ready'],['Tidak ada hasil. Coba semua Path atau hapus filter.','No results. Try all Paths or clear your filters.'],
  ['Belum dipasang','Not equipped'],['Belum ada bonus 2pc aktif.','No 2-piece set bonuses active.'],['2pc + 2pc aktif','2-piece + 2-piece active'],['2pc aktif · 2 piece campuran','2-piece active · 2 mixed pieces'],['Campuran · 2pc belum aktif','Mixed pieces · no 2-piece bonus'],['4pc aktif','4-piece active'],['Memasang pada','Equipping on'],['SEMUA 4 SLOT','ALL 4 SLOTS'],['PILIH 4pc','CHOOSE 4-PIECE SET'],['Set A dan B memakai slot berbeda. Memilih Set B tidak mengubah Set A. Set yang sama di kedua pasangan mengaktifkan 4pc.','Sets A and B use different slots. Choosing Set B leaves Set A in place. The same set in both pairs activates its 4-piece bonus.'],['Semua 4 slot (4pc)','All 4 slots (4-piece)'],['Kedua slot planar (2pc)','Both Planar slots (2-piece)'],['Set lainnya','Other sets'],['Relic dan planar tidak memiliki pembatasan Path. Semua set dapat dipakai.','Relics and Planar Ornaments have no Path restrictions. All sets can be equipped.'],['Tidak ada gear yang cocok dengan pencarian.','No equipment matches your search.'],
  ['Relic 5★: pilih 3 atau 4 substat awal. Setiap +3 level membuka substat keempat atau meningkatkan satu stat. Pilih hasil roll, atau gunakan tombol acak. Semua nilai dihitung otomatis.','5-star Relics: choose 3 or 4 starting substats. Every 3 levels unlocks the fourth substat or improves an existing one. Choose the upgrade results or use the random buttons. All values are calculated automatically.'],['Pilih set dari panel atas agar stat piece ini aktif.','Choose a set above to activate this piece’s stats.'],['Stat dari editor lama disesuaikan ke roll awal yang legal.','Stats from the old editor were adjusted to valid starting rolls.'],['Substat awal','Starting substats'],['3 stat · +3 buka stat baru','3 stats · +3 unlocks a new stat'],['4 stat · 5 kali peningkatan','4 stats · 5 upgrades'],['Dari roll +3','From +3 upgrade'],['Buka +3','Unlock at +3'],['Riwayat upgrade','Upgrade history'],['Target upgrade','Upgrade target'],['Tier upgrade','Upgrade tier'],['Tier awal','Starting tier'],['+3 acak','Random +3'],['Acak ke +15','Random to +15'],['Reset +0','Reset to +0'],['Mulai 3 stat: 1 buka stat + 4 peningkatan.','3 starting stats: 1 unlock + 4 upgrades.'],['Mulai 4 stat: 5 peningkatan.','4 starting stats: 5 upgrades.'],['Total saat ini','Current total'],['Rendah','Low'],['Sedang','Medium'],['Tinggi','High'],['ROLL AWAL','STARTING ROLL'],['Buka','Unlock'],
  ['Level relic harus +0 sampai +15 dengan 3 atau 4 substat awal.','Relic level must be +0 to +15 with 3 or 4 starting substats.'],['Relic harus memiliki 4 slot substat dan tepat 5 milestone upgrade.','Relics must have 4 substat slots and exactly 5 upgrade milestones.'],['Substat tidak boleh duplikat atau sama dengan main stat.','Substats must be unique and different from the main stat.'],['Pilih tier roll yang tersedia.','Choose an available roll tier.'],['Roll +3 harus membuka substat keempat untuk relic dengan 3 substat awal.','The +3 roll must unlock the fourth substat for Relics with 3 starting substats.'],['Total substat harus sesuai riwayat roll upgrade.','Substat totals must match the upgrade history.'],['Eidolon harus E0 sampai E6.','Eidolon level must be E0 through E6.'],['Pilihan build tidak valid.','Invalid build selection.'],['Preset harus berisi empat karakter berbeda.','A sample team must contain four different characters.'],
  ['aktif sepanjang battle','active throughout battle'],['giliran penerima','recipient turns'],['Giliran tertunda; damage diterima meningkat.','Turn delayed; damage taken increased.'],['Awal giliran: kehilangan 500 HP.','Start of turn: lose 500 HP.'],['Berkurang setelah Ultimate.','Reduced after Ultimate.'],['Klik musuh untuk inspeksi','Click an enemy to inspect it'],['Klik kartu tim untuk memilih penerima buff satu target','Click a teammate’s card to choose the recipient of a single-target buff'],['Efek aktif','Effect active'],['shield tersisa.','shield remaining.'],['DMG diterima','DMG taken'],['DEF dikurangi','DEF reduction'],['giliran','turns'],['Menang','Victory'],['Kalah','Defeat'],['Pertempuran selesai','Battle finished'],['Energi belum cukup','Not enough energy'],['Poin Skill tidak cukup','Not enough Skill Points']
 );
 extra.forEach(([source,en])=>phrases.push([source,source,en]));
 const labels = [
  ['EIDOLON RESONANCE','TINGKAT EIDOLON'],['TRACE DATA READY','DATA TRACE SIAP'],['LOADING TRACES','MEMUAT TRACE'],['TRACE DATA OFFLINE','DATA TRACE BELUM TERSEDIA'],['ADDITIONAL ABILITY · UNLOCKED','KEMAMPUAN TAMBAHAN · TERBUKA'],['PATH COMPATIBLE','PATH COCOK'],['AUTOMATIC STAT TOTAL','TOTAL STATISTIK OTOMATIS'],['Traces unlocked','Trace terbuka'],['Base Lv.80','Dasar Lv.80'],['Trace Δ','Tambahan Trace'],['Gear Δ','Tambahan perlengkapan'],['Talent & Traces','Talent dan Trace'],['Talents & Traces','Talent dan Trace'],['Unequipped','Belum dipasang'],['Reset gear','Atur ulang perlengkapan'],['Main stat','Statistik utama'],['Substat','Statistik tambahan'],['SUBSTATS','STATISTIK TAMBAHAN'],['Body','Badan'],['Feet','Kaki'],['Sphere','Bola'],['Rope','Tali'],['Head','Kepala'],['Hands','Tangan'],['Toughness','Ketahanan'],['ENDGAME','TANTANGAN'],['FREE','BEBAS'],['ENCOUNTER','PERTEMPURAN'],['VICTORY','MENANG'],['DEFEAT','KALAH'],['Energy Regen','Pemulihan energi'],['Effect Hit','Peluang efek'],['Effect RES','Ketahanan efek'],['CRIT Rate','Peluang CRIT'],['CRIT DMG','Kerusakan CRIT'],['Break Effect','Efek Break'],['Basic DMG','Kerusakan serangan biasa'],['Skill DMG','Kerusakan Skill'],['Ultimate DMG','Kerusakan Ultimate'],['Skill','Skill'],['Ultimate','Ultimate'],['Log','Catatan'],['Detail','Rincian'],['Physical','Fisik'],['Fire','Api'],['Ice','Es'],['Lightning','Petir'],['Wind','Angin'],['Quantum','Kuantum'],['Imaginary','Imajiner'],['None','Tidak dipasang']
 ];
 labels.push(['Light Cone Inventory','Koleksi Light Cone'],['Light Cone Ability','Kemampuan Light Cone'],['CAVERN RELIC','RELIC'],['Cavern Relic','Relic'],['CHARACTER','KARAKTER'],['Main stat & substat','Statistik utama dan tambahan'],['SUBSTAT','STATISTIK TAMBAHAN'],['ROLL AWAL','NILAI AWAL'],['SIGNATURE','KHUSUS KARAKTER'],['Talent & Traces otomatis','Talent dan Trace otomatis'],['Basic 6','Serangan biasa 6']);
 labels.forEach(([en,id])=>phrases.push([en,id,en]));
 phrases.push(['ROLL AWAL','NILAI AWAL','STARTING ROLL']);
 phrases.push(
  ['Level lebih tinggi juga membuka semua Eidolon sebelumnya. Keterangan asli berbahasa Inggris. Efek kit Eidolon belum diterapkan pada battle.','Memilih tingkat lebih tinggi juga membuka semua Eidolon sebelumnya. Deskripsi mengikuti bahasa pilihanmu. Efek Eidolon belum dihitung dalam pertempuran.','Higher levels also unlock earlier Eidolons. Descriptions follow your selected language. Eidolon effects are not yet included in battle calculations.'],
  ['Level disimpan bersama build. Efek kit dan peningkatan level skill Eidolon belum diterapkan pada perhitungan battle. Keterangan asli berbahasa Inggris.','Tingkat Eidolon disimpan bersama perlengkapan karakter. Deskripsi mengikuti bahasa pilihanmu. Efek Eidolon dan peningkatan level kemampuannya belum dihitung dalam pertempuran.','Eidolon levels are saved with the character’s build. Descriptions follow your selected language. Eidolon effects and ability level increases are not yet included in battle calculations.']
 );
 [
  ['Challenge Complete','Tantangan selesai','Challenge complete'],['Enemy Turn','Giliran musuh','Enemy turn'],['Your Turn','Giliranmu','Your turn'],['Healing received','Menerima pemulihan','Healing received'],['Regeneration','Pemulihan berkala','Regeneration'],['Vulnerability','Kerentanan','Vulnerability'],['DEF Down','DEF berkurang','DEF Down'],['ATK Up','ATK meningkat','ATK Up'],['DMG Up','Kerusakan meningkat','DMG Up'],['SCORE','SKOR','SCORE'],['Wave','Gelombang','Wave'],['Skill Points','poin skill','Skill Points'],['TOTAL AV','TOTAL WAKTU (AV)','TOTAL AV'],
  ['memasuki fase','memasuki fase','enters phase'],['HP dan toughness pulih.','HP dan ketahanan pulih.','HP and toughness restored.'],['dimulai.','dimulai.','started.'],['kehilangan 500 HP.','kehilangan 500 HP.','loses 500 HP.'],['tumbang oleh Hemovore.','dikalahkan oleh Hemovore.','was defeated by Hemovore.'],['Enrage: SPD musuh meningkat hingga giliran berikutnya.','Enrage: SPD musuh meningkat hingga giliran berikutnya.','Enrage: enemy SPD increases until the next turn.'],['bangkit sekali dengan 30% HP (model latihan).','bangkit sekali dengan 30% HP (model latihan).','revives once with 30% HP (practice model).'],['tertunda dan kehilangan 30 energi.','gilirannya tertunda dan kehilangan 30 energi.','is delayed and loses 30 energy.'],['pulih dari Break; satu aksi dilewati.','pulih dari Break; satu aksi dilewati.','recovers from Break; skips one action.'],['Perforation: +200% damage terhadap target ber-shield.','Perforation: +200% kerusakan terhadap target berperisai.','Perforation: +200% damage against shielded targets.'],['diserap shield','diserap perisai','absorbed by shield'],['memulihkan','memulihkan','restores'],['untuk','untuk','for'],['rekan.','rekan.','allies.'],['seluruh party','seluruh tim','the whole team'],['selama 3 giliran penerima.','selama 3 giliran penerima.','for 3 recipient turns.'],['menahan debuff (model peluang deterministik).','menahan efek pelemahan (model peluang deterministik).','resists the debuff (deterministic chance model).'],['Damage yang diterima meningkat.','Kerusakan yang diterima meningkat.','Damage taken is increased.'],['aktif pada 0 AV (model latihan).','aktif pada 0 AV (model latihan).','active at 0 AV (practice model).'],['karakter · sampai versi 4.6','karakter · sampai versi 4.6','characters · through version 4.6'],['aktif','aktif','active'],['damage','kerusakan','damage'],['shield','perisai','shield']
 ].forEach(row=>phrases.push(row));
 const guide = [
  ['Mulai dari sini','Getting started','Pilih mode, pilih empat karakter, lalu klik Mulai Bertarung. Belum tahu tim yang cocok? Buka Contoh tim. Di Pertarungan bebas, tambahkan node dan isi musuhnya satu per satu. Tiap node memuat hingga 5 musuh, dengan batas 1 bos dan 2 elite. Tim yang sama melanjutkan ke node berikutnya.','Choose a mode and four characters, then click Start Battle. Need a starting point? Open Sample teams. In Free Battle, add nodes and fill each one with enemies. Each node holds up to 5 enemies, including at most 1 boss and 2 elites. The same team continues to the next node.'],
  ['Saat bertarung','During battle','Klik musuh untuk memilih target. Tekan Q untuk serangan biasa, E untuk Skill, atau R untuk Ultimate karakter aktif. Serangan biasa menambah poin skill; Skill menggunakannya. Klik kartu rekan untuk memilih penerima efek bantuan. Tombol Jalankan giliran musuh menjalankan satu aksi musuh.','Click an enemy to target it. Press Q for Basic ATK, E for Skill, or R for the active character’s Ultimate. Basic attacks restore skill points; Skills spend them. Click a teammate’s card to target support effects. Play enemy turn runs one enemy action.'],
  ['Kenapa urutan giliran berubah?','How does turn order work?','SPD adalah kecepatan: makin tinggi nilainya, makin cepat karakter mendapat giliran. AV menunjukkan waktu sampai giliran berikutnya. Siklus pertama berlangsung 150 AV, selanjutnya 100 AV. Kembali ke menu tidak menghapus pertempuran; pilih Lanjutkan pertempuran untuk meneruskannya.','SPD is speed: higher values mean earlier turns. AV measures time until a turn. The first cycle lasts 150 AV, later cycles last 100 AV. Returning to the menu keeps your battle; choose Resume battle to continue.'],
  ['Mengatur perlengkapan','Setting up equipment','Pilih karakter, lalu pasang Light Cone, empat Relic, dan dua Planar. Statistik dasar memakai data karakter level 80. Kamu bisa mengatur statistik utama, statistik tambahan, dan peningkatan Relic dari +0 sampai +15. Bonus set dihitung otomatis. Light Cone dengan Path berbeda hanya memberi statistik dasar; efek pasifnya tidak aktif.','Select a character, then equip a Light Cone, four Relics, and two Planar Ornaments. Base stats use level 80 character data. Adjust main stats, substats, and Relic upgrades from +0 to +15. Set bonuses apply automatically. A Light Cone from a different Path grants base stats only; its passive is disabled.'],
  ['Apa yang disimulasikan?','What does the simulator cover?','Ini tempat mencoba susunan tim dan memahami giliran, bukan hasil pasti dari game. Kerusakan, skor, HP musuh, dan efek Technique memakai model latihan. Technique otomatis memberi efek sesuai peran tanpa memakai poin skill, energi, atau AV. Efek kit Eidolon, serangan lanjutan, kerusakan berkala, panggilan, dan mekanik bos belum semuanya diterapkan.','Use this to explore teams and learn turn order, rather than predict exact in-game results. Damage, scores, enemy HP, and Technique effects use practice models. Automatic Techniques apply role-based effects without spending skill points, energy, or AV. Eidolon kit effects, follow-up attacks, damage over time, summons, and boss mechanics are not fully implemented.'],
  ['Tentang tantangan dan data','About challenges and data','Data versi 4.6 memakai susunan musuh 7 November 2026. MoC, PF, dan AS memakai pilihan pertempuran bos. Batas latihan: MoC 1050 AV, PF 450 AV, AS dan AA 650 AV. PF mengganti musuh yang dikalahkan. Sebagian aturan AA disederhanakan. Gambar dan data Trace perlu internet saat pertama dimuat; jika gagal, beberapa bonus Trace belum masuk hitungan.','Version 4.6 uses enemy lineups from 7 November 2026. MoC, PF, and AS use selected boss encounters. Practice limits: MoC 1050 AV, PF 450 AV, AS and AA 650 AV. PF replaces defeated enemies. Some AA rules are simplified. Images and Trace data need internet on first load; if loading fails, some Trace bonuses are not included.']
 ];
 const guideBody=document.querySelector('#guideDialog .guide');
 if(guideBody){
  const sources=document.getElementById('sources');
  guideBody.replaceChildren();
  guide.forEach(([idTitle,enTitle,idBody,enBody])=>{
   phrases.push([idTitle,idTitle,enTitle],[idBody,idBody,enBody]);
   const p=document.createElement('p'),b=document.createElement('b');
   b.textContent=idTitle;p.append(b,document.createElement('br'),document.createTextNode(idBody));guideBody.append(p);
  });
  const label=document.createElement('p');label.textContent='Sumber data';guideBody.append(label);
  phrases.push(['Sumber data','Sumber data','Data sources']);
  if(sources)guideBody.append(sources);
  document.querySelector('#guideDialog h2').textContent='Cara mencoba tim pertamamu';
  phrases.push(['Cara mencoba tim pertamamu','Cara mencoba tim pertamamu','Try your first team']);
 }
 let language='id';
 try { language=localStorage.getItem('stellar-language')==='en'?'en':'id'; } catch (_) {}
 const descriptionMap=new Map();
 const normalizeDescription=value=>value.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
 const addDescription=(source,id)=>descriptionMap.set(normalizeDescription(source),id.replace(/<[^>]*>/g,''));
 const descriptionPairs=globalThis.stellarDescriptionTranslations||[];
 const rawDescriptions=new Map(descriptionPairs);
 descriptionPairs.forEach(([source,id])=>addDescription(source,id));
 if(typeof completeLightConeData!=='undefined')completeLightConeData.forEach(cone=>{
  const id=rawDescriptions.get(cone.desc);if(!id)return;
  for(let level=1;level<=cone.params.length;level++)addDescription(traceDescription(cone,level),traceDescription({...cone,desc:id},level));
 });
 const relicDescriptions=[];
 if(typeof completeRelicSetData!=='undefined')completeRelicSetData.forEach(set=>{
  const translated=set.desc.map(source=>rawDescriptions.get(source)||source);
  addDescription(set.desc.join(' '),translated.join(' '));
  set.desc.forEach((source,index)=>relicDescriptions.push([source,translated[index]]));
 });
 const textSources=new WeakMap(),attributeSources=new WeakMap();
 const properNames=new Set();
 [typeof roster==='undefined'?[]:roster,typeof lightCones==='undefined'?[]:lightCones,typeof relicSets==='undefined'?[]:relicSets,typeof planarSets==='undefined'?[]:planarSets].flat().forEach(item=>properNames.add(item.name));
 if(typeof enemyCatalog!=='undefined')Object.keys(enemyCatalog).forEach(name=>properNames.add(name));
 [
  ['PERTARUNGAN BERURUTAN','SEQUENTIAL BATTLES'],['Susun node pertarungan','Set up battle nodes'],['Isi musuh di tiap node. Tim yang sama lanjut ke node berikutnya.','Choose enemies for each node. The same team continues to the next node.'],['Tambah node','Add node'],['Hapus node','Remove node'],['Pilih node','Choose node'],['Maksimal 5 musuh per node: 1 bos dan 2 elite. Sisanya bebas.','Up to 5 enemies per node: at most 1 boss and 2 elites. Fill the other slots as you like.'],['Musuh di node ini','Enemies in this node'],['Tambah musuh ke node ini','Add enemies to this node'],['Kosongkan node','Clear node'],['Filter & pengaturan tambahan','More filters & settings'],['Fase dan pengali HP hanya berlaku untuk node ini. Fase memulihkan HP dan ketahanan bos; musuh lain tidak muncul ulang.','Phases and HP multipliers apply to this node only. Phases restore boss HP and toughness; other enemies do not respawn.'],['Detail & varian','Details & variants'],['Satu node hanya boleh berisi 1 bos.','A node can contain at most 1 boss.'],['Satu node hanya boleh berisi 2 elite.','A node can contain at most 2 elites.'],['Kelemahan','Weakness'],['Hapus filter','Reset filters'],['Pengali HP musuh','Enemy HP multiplier'],['Fase bos','Boss phases'],['Jumlah fase bos','Number of boss phases'],['bos','boss'],['Tambah','Add']
 ].forEach(([id,en])=>phrases.push([id,id,en]));
 phrases.push(['Boss','Bos','Boss']);
 [
  ['Atur Relic, satu per satu.','Set up your Relics, one at a time.'],['Pilih slot, tentukan statistik, lalu lihat hasilnya langsung.','Choose a slot, set its stats, and see the result immediately.'],['Semua ke +15','All to +15'],['Pilih slot Relic','Choose Relic slot'],['Pilih set di bagian atas agar statistik ini aktif.','Choose a set above to activate these stats.'],['Statistik utama','Main stat'],['Level Relic','Relic level'],['Maksimal +15','Maximum +15'],['Statistik tambahan','Substats'],['Hasil akhir','Final value'],['Peningkatan','Upgrades'],['Statistik','Stat'],['Bagi peningkatan ke statistik yang kamu inginkan. Jatah statistik lain menyesuaikan otomatis; hasil akhir tetap dihitung dari roll yang valid.','Assign upgrades to the stats you want. Other stats adjust automatically; final values still use valid upgrade rolls.'],['Bagi rata','Distribute evenly'],['Pengaturan rinci & riwayat roll','Detailed settings & upgrade history'],['Lihat total statistik karakter','View total character stats'],['Lihat efek Eidolon','View Eidolon effects'],['Lawan yang akan kamu hadapi','The enemies you will face'],['Ini susunan musuh latihan yang dimainkan. Rincian rotasi referensi bisa dibuka di bawah.','These are the practice enemies you will fight. Open the reference details below for the full rotation.'],['Gelombang','Wave'],['gelombang','waves'],['Lihat referensi & aturan lengkap','View references & full rules'],
  ['FANMADE · MADE WITH LOVE','FANMADE · MADE WITH LOVE'],['DARI PENGGEMAR, UNTUK PENGGEMAR','BY FANS, FOR FANS'],['Psst… ini tempat main kita!','Psst… welcome to our playground!'],['Web ini buatan penggemar, buat ngetes tim, utak-atik perlengkapan, dan seru-seruan bareng karakter Honkai: Star Rail.','This fan-made site is a place to test teams, play around with equipment, and have fun with Honkai: Star Rail characters.'],['Angka dan mekaniknya memakai model latihan. Hasilnya bisa berbeda dari game asli.','Numbers and mechanics use practice models. Results may differ from the actual game.'],['Tidak resmi dan tidak berafiliasi dengan HoYoverse.','Unofficial and not affiliated with HoYoverse.'],['Oke, waktunya eksperimen!','Okay, time to experiment!'],['Lihat panduan dulu','Show me the guide first'],['Tutup sambutan','Close welcome'],['Evernight dan Evanescia versi chibi menyambutmu','Chibi Evernight and Evanescia welcome you'],['Planar Sphere','Planar Sphere'],['Link Rope','Link Rope']
 ].forEach(([id,en])=>phrases.push([id,id,en]));
 phrases.push(['Planar Sphere','Bola Planar','Planar Sphere'],['Link Rope','Tali Penghubung','Link Rope']);
 const ordered=phrases.slice().sort((a,b)=>b[0].length-a[0].length);
 const exact=new Map(phrases.map(row=>[row[0],row]));
 // A single replacement pass prevents one dictionary entry changing another.
 const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const pattern=new RegExp(ordered.map(row=>escape(row[0])).join('|'),'g');
 function translate(source){
  const clean=source.trim();
  const description=descriptionMap.get(normalizeDescription(source));
  if(description)return language==='id'?source.replace(clean,description):source;
  if(language==='id'&&source.includes('2pc:')){
   let output=source;
   for(const [en,id] of relicDescriptions)output=output.split(en).join(id);
   if(output!==source)return output;
  }
  if(!clean||properNames.has(clean))return source;
  const row=exact.get(clean),index=language==='id'?1:2;
  if(row)return source.replace(clean,row[index]);
  return source.replace(pattern,(match,offset)=>{
   // Short labels must be complete words (e.g. Tim must not change Time).
   if(match.length<12&&(/[\p{L}]/u.test(source[offset-1]||'')||/[\p{L}]/u.test(source[offset+match.length]||'')))return match;
   return exact.get(match)[index];
  });
 }
 function translateText(node){
  if(node.parentElement?.closest('script,style,.language-picker,[translate="no"]'))return;
  const previous=textSources.get(node);
  const source=previous&&node.nodeValue===previous.output?previous.source:node.nodeValue;
  const output=translate(source);textSources.set(node,{source,output});
  if(node.nodeValue!==output)node.nodeValue=output;
 }
 function translateElement(element){
  if(element.closest('script,style,.language-picker,[translate="no"]'))return;
  if(element.matches('.eidolon-detail p,.lc-passive-description,.gallery-effect'))element.lang=language;
  let sources=attributeSources.get(element);if(!sources){sources={};attributeSources.set(element,sources);}
  for(const name of ['title','aria-label','placeholder','alt']){
   if(!element.hasAttribute(name))continue;
   const value=element.getAttribute(name),previous=sources[name];
   const source=previous&&value===previous.output?previous.source:value,output=translate(source);
   sources[name]={source,output};if(value!==output)element.setAttribute(name,output);
  }
 }
 function walk(root){
  if(root.nodeType===3){translateText(root);return;}
  if(root.nodeType!==1)return;
  translateElement(root);
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
  let node;while((node=walker.nextNode())){if(node.nodeType===3)translateText(node);else translateElement(node);}
 }
 function makePicker(before,id){
  if(!before)return;
  const label=document.createElement('label');label.className='language-picker';label.translate=false;
  const caption=document.createElement('span');caption.className='language-caption';caption.textContent='文 / A';
  const select=document.createElement('select');select.id=id;
  for(const [value,title] of [['id','Indonesia'],['en','English']]){const option=document.createElement('option');option.value=value;option.textContent=title;select.append(option);}
  select.addEventListener('change',()=>setLanguage(select.value));label.append(caption,select);before.before(label);
 }
 makePicker(document.getElementById('lobbyGuideBtn'),'lobbyLanguage');
 makePicker(document.getElementById('guideBtn'),'battleLanguage');
 const config={subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','placeholder','alt']};
 const observer=new MutationObserver(records=>{
  observer.disconnect();
  const roots=new Set();
  for(const record of records){if(record.type==='childList')record.addedNodes.forEach(node=>roots.add(node));else roots.add(record.target);}
  for(const root of roots)if(root.isConnected)walk(root);
  observer.observe(document.body,config);
 });
 function setLanguage(value){
  language=value==='en'?'en':'id';observer.disconnect();document.documentElement.lang=language;
  document.querySelectorAll('.language-picker select,#welcomeLanguage').forEach(select=>{select.value=language;select.setAttribute('aria-label',language==='id'?'Bahasa tampilan':'Display language');});
  walk(document.body);
  try{localStorage.setItem('stellar-language',language);}catch(_){}
  observer.observe(document.body,config);
 }
 if((navigator.deviceMemory&&navigator.deviceMemory<=2)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2)||navigator.connection?.saveData)document.documentElement.classList.add('low-motion');
 setLanguage(language);
 window.stellarLanguage={set:setLanguage,get:()=>language,descriptionCount:descriptionMap.size};
})();
