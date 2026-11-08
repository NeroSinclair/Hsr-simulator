# Lobby images

## Enemy preview images

`enemies/mostericon-monster_<id>.webp` and
`enemies/battleeventicon-monster_unknown.webp` are game enemy icons from the
[Gacha.gg enemy catalogue](https://www.gacha.gg/honkai-star-rail/enemies), downloaded
8 November 2026. The catalogue associates each displayed enemy name with its
image ID; the mapping is in `media.js`. All named preview images are
bundled locally, plus the game's generic Fictional Ensemble/group icon. The
generic icon is labeled "Kelompok" for rows without a confirmed individual
identity; it does not assert a particular reinforcement species.

These images are used by MoC, PF, AS, AA and the training-lineup preview. A failed
named local image retries its original source before falling back to the group
icon. Existing battle render sources are unchanged.

- `planarcadia.jpeg`: Planarcadia at night, HoYoverse image via [Esports.gg](https://esports.gg/news/honkai-star-rail/honkai-star-rail-4-0/).
- `stellar-jade.png`: Stellar Jade item icon from [StarRailRes](https://github.com/Mar-7th/StarRailRes/blob/master/icon/item/900001.png).

Honkai: Star Rail artwork belongs to its respective owners. Used in this unofficial fan simulator.


### Preset tim versi 4.6 ? diperiksa 8 November 2026

- [HSR Tier List](https://hsrtierlist.net/) ? board tim 4.6, diperbarui 30 Oktober; komposisi dan syarat investasi seperti Waveflair E1.
- [HSR Build](https://www.hsr-build.com/best-teams) ? formasi Elation dan The Herta versi 4.6.
- [GachaHoy](https://gachahoy.com/honkai-star-rail-tier-list/) ? pembaruan 2 November, core Elation, Nova, dan Archer/Rin.
- [Prydwen](https://www.prydwen.gg/star-rail/characters/) ? panduan karakter individual ditautkan di presetSources dan profil; termasuk Ashveil, Blade Mortenax, Himeko Nova, Robin Summeretto, dan Aventurine Waveflair untuk gear baru.
- [Reddit: diskusi 16 September 2026](https://www.reddit.com/r/HonkaiStarRail/comments/1whpso7/daily_questions_megathread_september_16_2026/) ? contoh komunitas Nova/Welt/Mem/DHPT.
- [HoYoLAB: detail update 4.2](https://www.hoyolab.com/article/44742273) dan [Fandom: Silver Wolf LV.999](https://honkai-star-rail.fandom.com/wiki/Silver_Wolf_LV.999) ? identitas karakter/LC signature; tidak dipakai sebagai ranking tim resmi.

Setiap formasi memuat tautan sumber. Adaptasi support/sustain dan starter diberi label tersendiri; tim klasik tidak disebut meta teratas. Gear berupa contoh legal untuk editor; belum seluruh efek kit atau gear dieksekusi engine latihan. Data komunitas tidak mewakili rekomendasi resmi HoYoverse.


### Cyrene / Chrysos Heir dan katalog Free Battle

- [KQM: Cyrene](https://hsr.keqingmains.com/cyrene/) ? panduan v3.7, acuan formasi Anaxa/Cerydra, Aglaea/RMC, Mydei/Cerydra, Hysilens/Kafka, dan sustain alternatif. Versi sumber ditampilkan pada tautan preset.
- [Prydwen: Cyrene](https://www.prydwen.gg/star-rail/characters/cyrene) ? sinergi Ode dan keterbatasan pairing Cipher; varian koleksi di luar core tersebut ditandai adaptasi.
- [FortOfFans/HSRMaps: monster.json](https://github.com/FortOfFans/HSRMaps/blob/master/en/monster.json) ? snapshot diimpor 8 November 2026; identitas/ID, rank, baseHealth, SPD, baseStance, dan weakness. Entri tanpa nama dikeluarkan; varian bernama tetap disertakan.
- [Gacha.gg: enemy index](https://www.gacha.gg/honkai-star-rail/enemies) ? pemetaan icon dan faksi. Icon lokal di assets/enemies mengikuti ID aset dari indeks ini. Dua identitas hanya ada di indeks: PoleMos600 Autonomous Defense System dan Unit-01; tidak dibuatkan stat/weakness palsu.
- [HoYoWiki: enemies](https://wiki.hoyolab.com/pc/hsr/aggregate/enemy?lang=en-us) ? tautan referensi resmi untuk penelusuran musuh; bukan sumber formula HP latihan.

Importer tidak menyalin deskripsi naratif atau teks skill. 484 nama merupakan cakupan snapshot sumber yang tersedia, bukan klaim bahwa semua mekanik 484 musuh sudah disimulasikan. HP latihan memakai normalisasi engine yang dijelaskan di README.
