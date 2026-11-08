'use strict';
// Eidolon is part of each character's build, independent of its equipment.
const eidolonLevel = b => Number.isInteger(b?.eidolon) && b.eidolon >= 0 && b.eidolon <= 6 ? b.eidolon : 0;
const defaultBeforeEidolon = defaultBuild;
defaultBuild = function(c) { return {...defaultBeforeEidolon(c), eidolon: 0}; };
const normalizeBeforeEidolon = normalizeBuild;
normalizeBuild = function(cfg) {
 const b = normalizeBeforeEidolon(cfg);
 b.eidolon = eidolonLevel(b);
 return b;
};
const validateBeforeEidolon = validateBuilds;
validateBuilds = function(configs) {
 if (configs.some(cfg => cfg.build.eidolon !== undefined && cfg.build.eidolon !== eidolonLevel(cfg.build))) return 'Eidolon harus E0 sampai E6.';
 return validateBeforeEidolon(configs);
};
function eidolonIcon(record) {
 return 'assets/eidolons/' + record.icon.split('/').pop();
}
function eidolonDetails(c, b) {
 const level=eidolonLevel(b),ranks=eidolonCatalogue[c.id]||[];
 return `<div class="eidolon-details">${ranks.map(r=>`<article class="eidolon-detail ${r.rank<=level?'is-unlocked':''}"><div class="eidolon-detail-heading"><img src="${eidolonIcon(r)}" alt="Ikon Eidolon ${r.rank} ${esc(c.name)}" width="64" height="64" loading="lazy"><div><small>E${r.rank} · ${r.rank<=level?'TERBUKA':'TERKUNCI'}</small><h4>${esc(r.name)}</h4></div></div><p lang="en">${esc(r.desc.replace(/<[^>]*>/g,''))}</p></article>`).join('')}</div>`;
}
function eidolonSource() {
 return '<a class="eidolon-source" href="https://github.com/Mar-7th/StarRailRes/blob/master/index_new/en/character_ranks.json" target="_blank" rel="noreferrer">Data & ikon: StarRailRes ↗</a>';
}
function presetEidolonPanel(c,b) {
 return `<section class="eidolon-panel preset-eidolon-panel"><div class="eidolon-heading"><div><span class="eyebrow">EIDOLON RESONANCE</span><h3>${esc(c.name)}</h3></div><label class="preset-eidolon-select">Level Eidolon<select id="preset-eidolon" data-preset-field="eidolon" aria-label="Eidolon ${esc(c.name)}">${Array.from({length:7},(_,n)=>`<option value="${n}" ${eidolonLevel(b)===n?'selected':''}>E${n}${n===0?' · Dasar':` · Buka E1${n>1?'–E'+n:''}`}</option>`).join('')}</select></label></div><p class="eidolon-note">Level lebih tinggi juga membuka semua Eidolon sebelumnya. Keterangan asli berbahasa Inggris. Efek kit Eidolon belum diterapkan pada battle.</p>${eidolonDetails(c,b)}${eidolonSource()}</section>`;
}
function eidolonPanel(c,b) {
 const level=eidolonLevel(b),ranks=eidolonCatalogue[c.id]||[];
 return `<section class="eidolon-panel" aria-label="Eidolon ${esc(c.name)}"><div class="eidolon-heading"><div><span class="eyebrow">EIDOLON RESONANCE</span><h3>${esc(c.name)} <span>E${level}</span></h3></div><span class="eidolon-count">${level} / 6 terbuka</span></div><div class="eidolon-options" role="group" aria-label="Pilih level Eidolon">${Array.from({length:7},(_,n)=>`<button type="button" data-eidolon="${n}" class="${n===level?'selected':''} ${n>0&&n<=level?'unlocked':''}" aria-pressed="${n===level}" aria-label="${n===0?'E0, tanpa Eidolon':`E${n}, buka Eidolon 1 sampai ${n}`}">${n===0?'<span aria-hidden="true">○</span>':`<img src="${eidolonIcon(ranks[n-1])}" alt="" width="48" height="48">`}<b>E${n}</b><small>${n===0?'Dasar':n<=level?'Terbuka':'Terkunci'}</small></button>`).join('')}</div><p class="eidolon-summary" role="status">${level?`E1${level>1?'–E'+level:''} terbuka. Pilih E0 untuk mengunci semua Eidolon.`:'Tanpa Eidolon. Pilih E1–E6 untuk membuka secara bertahap.'}</p><p class="eidolon-note">Level disimpan bersama build. Efek kit dan peningkatan level skill Eidolon belum diterapkan pada perhitungan battle. Keterangan asli berbahasa Inggris.</p>${eidolonDetails(c,b)}${eidolonSource()}</section>`;
}
const drawBeforeEidolon = drawBuildPanel;
drawBuildPanel = function() {
 drawBeforeEidolon();
 const b = buildDraft[buildSlot].build, level = eidolonLevel(b), panel = $('buildPanel');
 // Always visible after selecting a character, including the gear tabs.
 panel.insertAdjacentHTML('afterbegin', eidolonPanel(draftCharacter(), b));
 // Other editors bind these after rendering; preserve their direct handlers.
 if ($('resetSlotBuild')) $('resetSlotBuild').onclick = () => {
  buildDraft[buildSlot].build = {...defaultBuild(draftCharacter()), eidolon: level};
  drawBuildSlots(); drawBuildPanel();
 };
 if ($('retryTraces')) $('retryTraces').onclick = loadAutomaticTraces;
};
document.addEventListener('click', e => {
 const button = e.target.closest('[data-eidolon]');
 if (!button) return;
 const level = Number(button.dataset.eidolon);
 if (!Number.isInteger(level) || level < 0 || level > 6) return;
 readBuildPanel();
 buildDraft[buildSlot].build.eidolon = level;
 drawBuildPanel();
 const selected = $('buildPanel').querySelector?.(`[data-eidolon="${level}"]`);
 selected?.focus();
});
const partyBeforeEidolon = lobbyTeam;
lobbyTeam = function() {
 let slot = 0;
 return partyBeforeEidolon().replace(/<article class="menu-party-card/g, match => `<article data-eidolon-level="E${eidolonLevel(teamConfig[slot++].build)}" class="menu-party-card`);
};
const shortcutBeforeEidolon = renderMenuGearShortcut;
renderMenuGearShortcut = function() {
 shortcutBeforeEidolon();
 $('gearShortcutPath').textContent += ' · E' + eidolonLevel(teamConfig[menuSlot].build);
};
teamConfig = teamConfig.map(cfg => ({...cfg, build: normalizeBuild(cfg)}));
renderLobby();
