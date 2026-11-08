/* ==========================================================
   InuuTyzDev — SPA (satu halaman, perpindahan lewat #/rute)
   Rute: #/  #/tentang  #/proyek  #/proyek/ID  #/blog  #/blog/ID  #/kontak
   Pemutar musik, tema, dan menu berada di luar #app sehingga tidak
   ikut dimuat ulang saat pindah halaman.
   ========================================================== */
const $ = id => document.getElementById(id);
const app = $('app');
const root = document.documentElement;

/* ---------------------------------- Tema ---------------------------------- */
function setTheme(theme) {
  const dark = theme === 'dark';
  root.classList.toggle('dark', dark);
  document.body.classList.toggle('dark', dark);
  document.querySelectorAll('.theme-icon').forEach(i => i.className = 'theme-icon ' + (dark ? 'fas fa-sun' : 'fas fa-moon'));
  const pic = $('profilePic');
  if (pic) pic.src = dataProfil.profile.image[dark ? 'dark' : 'light'];
  try { localStorage.setItem('theme', theme); } catch (e) {}
}
function currentTheme() {
  try { return localStorage.getItem('theme') || 'light'; } catch (e) { return 'light'; }
}
document.querySelectorAll('.theme-btn').forEach(b =>
  b.addEventListener('click', () => setTheme(root.classList.contains('dark') ? 'light' : 'dark')));

/* ------------------------------ Menu di HP ------------------------------ */
const nav = document.querySelector('.nav');
const menuBtn = $('menuBtn');
function closeMenu() {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.firstElementChild.className = 'fas fa-bars';
}
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.firstElementChild.className = open ? 'fas fa-times' : 'fas fa-bars';
});
function setActive(key) {
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.dataset.nav === key) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}

/* ================================ VIEW ================================ */
const LINK_ICONS = ['fa-user', 'fa-envelope', 'fa-plug', 'fa-play', 'fa-folder-open', 'fa-store'];
const PAGE_LINK = /^(tentang|kontak|proyek|blog)\.html$/;

function viewHome() {
  const d = dataProfil;
  const links = d.links.map((l, i) => {
    const internal = PAGE_LINK.test(l.url);
    const href = internal ? '#/' + l.url.replace('.html', '') : l.url;
    const ext = internal ? '' : ' target="_blank" rel="noopener"';
    const m = l.title.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    const title = m ? m[1] : l.title;
    if (i < 2) return `<a href="${href}" class="card hover link half${i === 0 ? ' main' : ''}"${ext}>${title}</a>`;
    return `<a href="${href}" class="card hover link"${ext}><span class="ic"><i class="fas ${LINK_ICONS[i] || 'fa-link'}"></i></span><span class="txt">${title}${m ? `<br><span class="badge">${m[2]}</span>` : ''}</span></a>`;
  }).join('');
  return `<section class="home">
    <div class="avatar-wrap"><div class="avatar"><img src="${d.profile.image[currentTheme()]}" alt="Foto profil ${d.profile.name}" id="profilePic"></div></div>
    <span class="chip lemon">👋 Halo, saya</span>
    <h1>${d.profile.name}</h1>
    <div class="role"><span class="chip">Digital Conceptor</span><span class="chip mint">AI-Assisted Developer</span></div>
    <p class="bio">${d.profile.bio}</p>
    <nav class="links" aria-label="Tautan utama">${links}</nav>
    <footer class="small muted" style="font-weight:600">&copy; ${new Date().getFullYear()} INUU OFFICIAL</footer>
  </section>`;
}

const SKILLS = [
  ['fa-laptop-code', 'Frontend', 'Membangun antarmuka yang responsif, interaktif, dan ramah pengguna.', ['HTML5', 'JS', 'Tailwind'], 'lemon'],
  ['fa-server', 'Backend', 'Merancang sisi server, API, dan manajemen database yang handal.', ['Node.js', 'PHP', 'MySQL'], 'mint'],
  ['fa-brain', 'AI Integration', 'Memanfaatkan kecerdasan buatan untuk merancang kode secara efisien.', ['Prompting', 'Gemini AI'], 'coral'],
  ['fa-object-group', 'UI/UX Design', 'Merancang pengalaman pengguna intuitif dan visual yang estetik.', ['Wireframe', 'Figma'], 'lemon'],
  ['fa-rocket', 'Deployment', 'Meluncurkan aplikasi ke internet secara efisien dan cepat.', ['Vercel', 'Hosting'], 'mint'],
  ['fa-paper-plane', 'Automation', 'Mengotomatisasi form website dengan integrasi bot secara real-time.', ['Telegram API', 'Webhook'], 'coral'],
  ['fa-store', 'E-Commerce UI', 'Membangun antarmuka layanan web responsif untuk katalog digital.', ['Top Up Web', 'Katalog UI'], 'lemon'],
  ['fa-tools', 'Tools & Lainnya', 'Peralatan pendukung untuk alur kerja dan produktivitas maksimal.', ['Git', 'VS Code'], 'mint'],
];

const proyekCard = (p, tall) => `
  <article class="card hover">
    <div class="card-banner" style="background-color:${p.warna};${tall ? 'min-height:220px' : ''}"><span class="tag">${p.layanan}</span><span>${p.nama}</span></div>
    <div class="card-body">
      <div class="meta"><span>${p.tanggal}</span><span>${p.klien}</span></div>
      ${tall ? `<h3>${p.nama}</h3>` : ''}
      <p class="muted clamp-3 grow">${p.deskripsi}</p>
      <a href="#/proyek/${p.id}" class="btn btn-block">Lihat Detail <i class="fas fa-arrow-right"></i></a>
    </div>
  </article>`;

const blogCard = (p, tall) => `
  <article class="card hover">
    <div class="card-banner" style="background-color:${p.warna};${tall ? 'min-height:220px' : ''}"><span class="tag">${p.kategori}</span><span>${p.judulBanner}</span></div>
    <div class="card-body">
      <div class="meta"><span>${p.tanggal}</span><span>${p.durasi}</span></div>
      <h3${tall ? '' : ' style="font-size:1.35rem"'}>${p.judulArtikel}</h3>
      <p class="muted ${tall ? 'clamp-3' : 'clamp-2'} grow">${p.deskripsi}</p>
      <a href="#/blog/${p.id}" class="btn btn-block">Baca Selengkapnya <i class="fas fa-arrow-right"></i></a>
    </div>
  </article>`;


const sliderHead = (title, id) => `<div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1.5rem"><h2>${title}</h2><div class="slider-nav"><button class="icon-btn" data-slide="${id}" data-dir="-1" aria-label="Geser ke kiri"><i class="fas fa-arrow-left"></i></button><button class="icon-btn" data-slide="${id}" data-dir="1" aria-label="Geser ke kanan"><i class="fas fa-arrow-right"></i></button></div></div>`;
const moreSlide = (href, label) => `<a href="${href}" class="card hover slide-more" aria-label="${label}"><span class="slide-more-btn"><i class="fas fa-arrow-right"></i></span><b>${label}</b></a>`;
function wireSliders() {
  document.querySelectorAll('[data-slide]').forEach(b => b.addEventListener('click', () => {
    const el = $(b.dataset.slide);
    el.scrollBy({ left: b.dataset.dir * Math.max(300, el.clientWidth * 0.8), behavior: 'smooth' });
  }));
}

function viewTentang() {
  const skills = SKILLS.map(([ic, t, d, chips, col]) => `
    <article class="card hover"><div class="card-body">
      <span class="chip ${col}" style="width:3.6rem;height:3.6rem;justify-content:center;border-radius:16px;font-size:1.5rem;padding:0"><i class="fas ${ic}"></i></span>
      <h3>${t}</h3><p class="muted grow">${d}</p>
      <div style="display:flex;flex-wrap:wrap;gap:.5rem">${chips.map(c => `<span class="chip">${c}</span>`).join('')}</div>
    </div></article>`).join('');
  const stat = (n, l, bg) => `<div class="card" style="background:var(--${bg});color:#14123b"><div class="card-body" style="text-align:center;gap:.2rem"><b style="font:800 clamp(3.2rem,7vw,4.5rem)/1 var(--font-head)">${n}</b><span style="font-weight:700;font-size:1.2rem">${l}</span></div></div>`;
  return `
  <section class="section">
    <div class="wrap" style="display:grid;gap:3rem;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));align-items:center">
      <div style="justify-self:center;position:relative;width:min(100%,430px)">
        <div style="position:absolute;inset:0;transform:translate(14px,14px) rotate(3deg);background:var(--coral);border:2px solid var(--line);border-radius:44px"></div>
        <div style="position:relative;aspect-ratio:1;border:2px solid var(--line);border-radius:44px;overflow:hidden;background:var(--card)"><img src="https://files.catbox.moe/xzll04.png" alt="Foto profil" style="width:100%;height:100%;object-fit:cover"></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:1.5rem">
        <span class="chip lemon" style="align-self:flex-start">Era Baru Development</span>
        <h1 style="font-size:var(--fs-h2)">Cerdas Berinovasi dengan <span class="mark">Developer Modal Ai</span></h1>
        <p class="lead">Selama 1 tahun terakhir, saya telah membuktikan bahwa kreativitas tidak memiliki batas. Sebagai sosok di balik <strong style="color:var(--ink)">Developer Modal Ai</strong>, saya menggabungkan visi manusia dengan kekuatan kecerdasan buatan untuk membangun solusi digital yang cepat, tepat, dan fungsional.</p>
        <p class="muted" style="max-width:62ch">Saya percaya bahwa masa depan pengembangan web terletak pada kolaborasi. Dengan dukungan teknologi AI terbaru, saya mampu mengeksekusi berbagai proyek—dari profil perusahaan hingga aplikasi web—dengan efisiensi tinggi, memastikan setiap baris kode bekerja optimal untuk kebutuhan Anda.</p>
        <div><a href="#/kontak" class="btn btn-primary"><i class="fas fa-bolt"></i>Hubungi Saya</a></div>
      </div>
    </div>
  </section>
  <section style="padding-bottom:clamp(3rem,6vw,5rem)"><div class="wrap grid g3">${stat('25+', 'Proyek', 'lemon')}${stat('1+', 'Tahun', 'mint')}${stat('20+', 'Klien', 'coral')}</div></section>
  <section class="section" style="background:var(--card);border-block:2px solid var(--line)">
    <div class="wrap">
      <div style="max-width:640px;margin-bottom:3rem"><h2>Keahlian &amp; Teknologi</h2><p class="lead" style="margin-top:1rem">Alat dan keahlian yang saya pakai untuk membangun website dari ide sampai online.</p></div>
      <div class="grid g4">${skills}</div>
    </div>
  </section>
  <section class="section"><div class="wrap">
    ${sliderHead('Karya Terpilih', 'slider-proyek')}
    <div class="slider" id="slider-proyek">${databaseProyek.slice(0, 3).map(p => proyekCard(p, false)).join('')}${moreSlide('#/proyek', 'Lihat Semua Proyek')}</div>
  </div></section>
  <section class="section" style="padding-top:0"><div class="wrap">
    ${sliderHead('Tulisan Terbaru', 'slider-blog')}
    <div class="slider" id="slider-blog">${databaseBlog.slice(0, 3).map(p => blogCard(p, false)).join('')}${moreSlide('#/blog', 'Lihat Semua Artikel')}</div>
  </div></section>`;
}

function viewList(cfg) {
  return `
  <section class="section" style="padding-bottom:2rem"><div class="wrap"><h1>${cfg.title}</h1><p class="lead" style="margin-top:1rem">${cfg.lead}</p></div></section>
  <section style="padding-bottom:clamp(3.5rem,8vw,6rem)"><div class="wrap">
    <div class="toolbar">
      <div class="search"><i class="fas fa-search"></i><label class="sr-only" for="q">${cfg.searchLabel}</label><input type="text" id="q" placeholder="${cfg.placeholder}" class="input"></div>
      <div class="filters">${cfg.cats.map((c, i) => `<button class="filter-btn${i ? '' : ' active'}" data-cat="${c[0]}">${c[1]}</button>`).join('')}</div>
    </div>
    <div id="list" class="grid g2"></div>
    <p id="empty" class="center muted" style="display:none;padding:4rem 0;font-weight:600">${cfg.empty}</p>
  </div></section>`;
}
function wireList(data, match, card) {
  let cat = 'Semua';
  const q = $('q'), list = $('list'), empty = $('empty');
  const draw = () => {
    const v = q.value.toLowerCase();
    const rows = data.filter(p => (cat === 'Semua' || p.kategori === cat) && match(p, v));
    empty.style.display = rows.length ? 'none' : 'block';
    list.innerHTML = rows.map(p => card(p, true)).join('');
  };
  q.addEventListener('input', draw);
  document.querySelectorAll('.filter-btn').forEach(b => b.addEventListener('click', () => {
    cat = b.dataset.cat;
    document.querySelectorAll('.filter-btn').forEach(x => x.classList.toggle('active', x === b));
    draw();
  }));
  draw();
}

function viewDetail(m) {
  const p = databaseProyek.find(x => x.id === m[1]);
  if (!p) return notFound('Proyek tidak ditemukan.', '#/proyek', 'Kembali ke Semua Proyek');
  const dot = c => `<i style="width:.9rem;height:.9rem;border-radius:50%;background:${c};border:2px solid var(--line)"></i>`;
  const info = (l, v) => `<div><div class="small muted" style="font-weight:700">${l}</div><div style="font-weight:700;font-size:1.2rem">${v}</div></div>`;
  return `
  <section class="section"><div class="wrap">
    <div style="display:flex;flex-direction:column;gap:1.2rem;max-width:820px;margin-bottom:3rem"><span class="chip lemon" style="align-self:flex-start">${p.layanan}</span><h1 style="font-size:var(--fs-h1)">${p.nama}</h1></div>
    <div class="card" style="box-shadow:var(--shadow-lg);border-radius:28px;margin-bottom:3rem">
      <div style="display:flex;gap:.5rem;padding:.9rem 1.2rem;background:var(--card);border-bottom:2px solid var(--line)">${dot('#ff6b6b')}${dot('#ffd84d')}${dot('#3ddbb0')}</div>
      <div class="card-banner" style="background-color:${p.warna};min-height:clamp(220px,36vw,380px);border-bottom:0;font-size:clamp(2rem,5vw,3.5rem)">${p.nama}</div>
    </div>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));align-items:start">
      <section style="display:flex;flex-direction:column;gap:1.2rem">
        <h2 style="font-size:var(--fs-h3)">Tentang proyek</h2><p class="lead">${p.deskripsi}</p>
        <div><a href="${p.linkPreview}" target="_blank" rel="noopener" class="btn btn-primary"><i class="fas fa-external-link-alt"></i>Buka Aplikasi Web</a></div>
      </section>
      <div style="display:flex;flex-direction:column;gap:2rem">
        <div class="card"><div class="card-body" style="gap:1.2rem">${info('Klien', p.klien)}${info('Tanggal', p.tanggal)}${info('Layanan', p.layanan)}</div></div>
        <section><h2 style="font-size:var(--fs-h3);margin-bottom:1rem">Fitur utama</h2><div style="display:flex;flex-wrap:wrap;gap:.7rem">${p.fitur.map((f, i) => `<span class="chip ${['lemon', 'mint', 'coral'][i % 3]}" style="font-size:1rem;padding:.7rem 1.1rem">${f}</span>`).join('')}</div></section>
      </div>
    </div>
    <div class="center" style="margin-top:4rem"><a href="#/proyek" class="btn btn-primary"><i class="fas fa-arrow-left"></i>Kembali ke Semua Proyek</a></div>
  </div></section>`;
}

function viewArtikel(m) {
  const p = databaseBlog.find(x => x.id === m[1]);
  if (!p) return notFound('Artikel tidak ditemukan.', '#/blog', 'Kembali ke Blog');
  return `
  <section class="section"><div class="wrap-narrow">
    <div style="display:flex;flex-direction:column;gap:1.5rem;margin-bottom:2.5rem">
      <span class="chip lemon" style="align-self:flex-start">${p.kategori}</span>
      <h1 style="font-size:var(--fs-h2)">${p.judulArtikel}</h1>
      <div class="meta"><span>Oleh InuuTyzDev</span><span>${p.tanggal}</span><span>${p.durasi}</span></div>
    </div>
    <div class="card-banner" style="background-color:${p.warna};border:2px solid var(--line);border-radius:28px;box-shadow:var(--shadow-lg);min-height:clamp(200px,34vw,340px);font-size:clamp(1.8rem,4vw,3rem);margin-bottom:3rem">${p.judulBanner}</div>
    <article>
      <p style="font-size:1.35rem;line-height:1.7;font-weight:600;border-left:6px solid var(--indigo);padding-left:1.2rem;margin-bottom:2.5rem">${p.deskripsi}</p>
      <div class="artikel-body">${p.isi}</div>
    </article>
    <div style="margin-top:3.5rem;padding-top:2rem;border-top:2px solid var(--line);display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between">
      <b style="font-size:1.15rem">Bagikan artikel</b>
      <div style="display:flex;gap:.7rem">
        <a href="#" class="icon-btn" aria-label="Twitter"><i class="fab fa-twitter"></i></a><a href="#" class="icon-btn" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
        <a href="#" class="icon-btn" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a><a href="#" class="icon-btn" aria-label="Salin tautan"><i class="fas fa-link"></i></a>
      </div>
    </div>
    <div class="center" style="margin-top:4rem"><a href="#/blog" class="btn btn-primary"><i class="fas fa-arrow-left"></i>Kembali ke Blog</a></div>
  </div></section>`;
}

function viewKontak() {
  const items = [['fas fa-envelope', 'Email', 'choirulazzamibnu@gmail.com', 'lemon'], ['fas fa-phone', 'Telepon', '083160556330', 'mint'],
    ['fab fa-telegram-plane', 'Telegram', '@InuuUtama', 'coral'], ['fas fa-map-marker-alt', 'Lokasi', 'Jawa Barat, Indonesia', 'lemon']];
  const rows = items.map(([ic, l, v, c]) => `<div style="display:flex;gap:1rem;align-items:center"><span class="chip ${c}" style="width:3.4rem;height:3.4rem;border-radius:50%;justify-content:center;font-size:1.25rem;padding:0;flex-shrink:0"><i class="${ic}"></i></span><div style="min-width:0"><div class="small" style="font-weight:700;color:#b9b5e6">${l}</div><div style="font-weight:700;font-size:1.15rem;overflow-wrap:anywhere">${v}</div></div></div>`).join('');
  return `
  <section class="section"><div class="wrap">
    <div style="max-width:640px;margin-bottom:3rem"><h1>Hubungi Saya</h1><p class="lead" style="margin-top:1rem">Siap memulai proyek baru? Ceritakan idenya, saya balas lewat Telegram atau email.</p></div>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));align-items:start">
      <div class="card" style="background:var(--ink);color:var(--paper);border-color:var(--ink)"><div class="card-body" style="gap:1.6rem;padding:clamp(1.6rem,4vw,2.6rem)">${rows}</div></div>
      <div class="card"><div class="card-body" style="padding:clamp(1.6rem,4vw,2.6rem)">
        <form id="formKontak" style="display:flex;flex-direction:column;gap:1.4rem" novalidate>
          <div class="field"><label for="nama">Nama lengkap</label><input id="nama" type="text" placeholder="InuuTyzDev" class="input" autocomplete="name"></div>
          <div class="field"><label for="email">Alamat email</label><input id="email" type="email" placeholder="inuu@example.com" class="input" autocomplete="email"></div>
          <div class="field"><label for="pesan">Pesan</label><textarea id="pesan" rows="6" placeholder="Ceritakan tentang proyek Anda..." class="input"></textarea></div>
          <button type="submit" class="btn btn-primary btn-block" style="padding:1.15rem">Kirim Pesan</button>
        </form>
      </div></div>
    </div>
  </div></section>`;
}
function wireKontak() {
  const form = $('formKontak');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (typeof TELEGRAM_CONFIG === 'undefined') { alert('Konfigurasi Telegram (api/api.js) tidak ditemukan.'); return; }
    const nama = $('nama').value, email = $('email').value, pesan = $('pesan').value;
    if (!nama || !email || !pesan) { alert('Mohon isi semua kolom!'); return; }
    const text = `<b>📩 Pesan Baru dari Portofolio</b>\n\n<b>👤 Nama:</b> ${nama}\n<b>📧 Email:</b> ${email}\n<b>💬 Pesan:</b>\n${pesan}`;
    const btn = this.querySelector('button'), label = btn.innerText;
    btn.innerText = 'Mengirim...'; btn.disabled = true;
    fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CONFIG.CHAT_ID, text, parse_mode: 'HTML' })
    })
      .then(r => { if (r.ok) { alert('Mantap! Pesan sudah terkirim ke Telegram.'); this.reset(); } else alert('Gagal mengirim. Pastikan konfigurasi di api/api.js sudah benar.'); })
      .catch(err => { console.error('Error:', err); alert('Terjadi kesalahan koneksi.'); })
      .finally(() => { btn.innerText = label; btn.disabled = false; });
  });
}

function notFound(msg, href, label) {
  return `<section class="section"><div class="wrap-narrow center"><h1 style="font-size:var(--fs-h2)">${msg || 'Halaman tidak ditemukan.'}</h1><p class="lead" style="margin:1rem auto 2rem">Periksa tautannya, atau kembali ke halaman utama.</p><a href="${href || '#/'}" class="btn btn-primary"><i class="fas fa-arrow-left"></i>${label || 'Ke Beranda'}</a></div></section>`;
}

/* ================================ ROUTER ================================ */
const ROUTES = [
  { re: /^\/$/, nav: 'home', home: true, title: 'InuuTyzDev - Portfolio', render: viewHome },
  { re: /^\/tentang$/, nav: 'tentang', title: 'Tentang Saya | InuuTyzDev', render: viewTentang, after: wireSliders },
  { re: /^\/proyek$/, nav: 'proyek', title: 'Semua Proyek | InuuTyzDev',
    render: () => viewList({ title: 'Semua Proyek', lead: 'Kumpulan proyek terbaru: website, tools, dan utilitas yang saya bangun.', searchLabel: 'Cari proyek', placeholder: 'Cari proyek...', empty: 'Proyek tidak ditemukan. Coba kata kunci lain.', cats: [['Semua', 'Semua'], ['Website', 'Website'], ['Tools', 'Tools & Utility']] }),
    after: () => wireList(databaseProyek, (p, v) => p.nama.toLowerCase().includes(v) || p.layanan.toLowerCase().includes(v), proyekCard) },
  { re: /^\/proyek\/([^/]+)$/, nav: 'proyek', title: m => { const p = databaseProyek.find(x => x.id === m[1]); return (p ? p.nama : 'Detail Proyek') + ' | InuuTyzDev'; }, render: viewDetail },
  { re: /^\/blog$/, nav: 'blog', title: 'Semua Artikel | InuuTyzDev',
    render: () => viewList({ title: 'Semua Artikel', lead: 'Tulisan seputar teknologi, tips, tutorial, dan desain web.', searchLabel: 'Cari artikel', placeholder: 'Cari judul artikel...', empty: 'Artikel tidak ditemukan. Coba kata kunci lain.', cats: ['Semua', 'Teknologi', 'Tips', 'Tutorial', 'Desain'].map(c => [c, c]) }),
    after: () => wireList(databaseBlog, (p, v) => p.judulArtikel.toLowerCase().includes(v), blogCard) },
  { re: /^\/blog\/([^/]+)$/, nav: 'blog', title: m => { const p = databaseBlog.find(x => x.id === m[1]); return (p ? p.judulArtikel : 'Baca Artikel') + ' | InuuTyzDev'; }, render: viewArtikel },
  { re: /^\/kontak$/, nav: 'kontak', title: 'Hubungi Saya | InuuTyzDev', render: viewKontak, after: wireKontak },
];

let swapTimer = null, firstRender = true;
function route() {
  const path = location.hash.replace(/^#/, '') || '/';
  let r = null, m = null;
  for (const c of ROUTES) { m = path.match(c.re); if (m) { r = c; break; } }
  const show = () => {
    document.body.classList.toggle('is-home', !!(r && r.home));
    app.innerHTML = r ? r.render(m) : notFound();
    document.title = r ? (typeof r.title === 'function' ? r.title(m) : r.title) : 'Halaman tidak ditemukan | InuuTyzDev';
    setActive(r ? r.nav : '');
    closeMenu();
    window.scrollTo(0, 0);
    if (r && r.after) r.after(m);
    app.classList.remove('leaving');
    app.classList.add('entering');
    setTimeout(() => app.classList.remove('entering'), 500);
  };
  clearTimeout(swapTimer);
  if (firstRender) { firstRender = false; show(); }
  else { app.classList.add('leaving'); swapTimer = setTimeout(show, 140); }
}
window.addEventListener('hashchange', route);

/* ============================ PEMUTAR MUSIK ============================ */
const music = dataProfil.music;
const audio = $('audioPlayer'), player = $('inuutyzMusicPlayer'), miniBtn = $('minimizedMusicPlayerIcon');
const playIcon = $('playPauseIcon'), lyricsBox = $('lyrics'), bgLyrics = $('inuutyzLyricsBackground');
let isPlaying = false, playerVisible = true, lyricIndex = -1, duration = music.duration || 60;

const lyricArr = (() => { let a = music.timeSync || []; if (a.length && Array.isArray(a[0])) a = a[0]; return a; })();
const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

function updateLyrics(t) {
  let cur = null, idx = -1;
  for (let i = 0; i < lyricArr.length; i++) { if (lyricArr[i].time <= t) { cur = lyricArr[i]; idx = i; } else break; }
  if (cur && idx !== lyricIndex) {
    lyricIndex = idx;
    lyricsBox.innerHTML = '';
    const line = document.createElement('div');
    line.className = 'lyrics-line active';
    line.textContent = cur.text;
    lyricsBox.appendChild(line);
  }
}
function updateBgLyrics(t) {
  bgLyrics.innerHTML = '';
  let start = -1;
  for (let i = 0; i < lyricArr.length; i++) { if (lyricArr[i].time > t) { start = i; break; } }
  if (start === -1) { if (!lyricArr.length) return; start = lyricArr.length - 1; }
  for (let i = 0; i < 3 && start + i < lyricArr.length; i++) {
    const l = document.createElement('div');
    l.className = 'background-lyric-line';
    l.textContent = lyricArr[start + i].text;
    l.style.animationDelay = (i * 2) + 's';
    bgLyrics.appendChild(l);
  }
}
function togglePlay() {
  isPlaying = !isPlaying;
  playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
  if (!audio.src) return;
  if (isPlaying) audio.play().catch(() => { isPlaying = false; playIcon.className = 'fas fa-play'; });
  else audio.pause();
}
function setPlayerVisible(v) {
  playerVisible = v;
  player.classList.toggle('hidden', !v);
  miniBtn.classList.toggle('visible', !v);
  document.body.classList.toggle('mp-open', v);
  if (v && isPlaying && audio.paused) audio.play().catch(() => {});
}

$('songTitle').textContent = music.title;
$('artist').textContent = music.artist;
$('albumArt').src = music.albumArt;
if (music.audioFile) {
  audio.src = music.audioFile;
  audio.addEventListener('loadedmetadata', () => { duration = audio.duration; $('totalTime').textContent = fmt(duration); });
  audio.addEventListener('timeupdate', () => {
    $('currentTime').textContent = fmt(audio.currentTime);
    $('progressBar').style.width = (audio.currentTime / duration) * 100 + '%';
    updateLyrics(audio.currentTime);
    updateBgLyrics(audio.currentTime);
  });
  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    if (isPlaying) audio.play().catch(() => {}); else playIcon.className = 'fas fa-play';
  });
}
if (lyricArr.length) { updateLyrics(0); updateBgLyrics(0); } else lyricsBox.textContent = music.lyrics || 'No lyrics available';

$('playPauseBtn').addEventListener('click', e => { e.stopPropagation(); togglePlay(); });
document.querySelector('.progress-container').addEventListener('click', function (e) {
  if (!audio.src) return;
  const r = this.getBoundingClientRect();
  audio.currentTime = ((e.clientX - r.left) / r.width) * duration;
});
$('inuutyzMusicCloseBtn').addEventListener('click', () => setPlayerVisible(false));
miniBtn.addEventListener('click', () => setPlayerVisible(true));
// Browser baru mengizinkan suara setelah interaksi pertama: lagu mulai di klik pertama, lalu terus menyala di semua halaman
document.addEventListener('click', function first() {
  if (!isPlaying && playerVisible) togglePlay();
  document.removeEventListener('click', first);
}, { once: true });

/* ================================= MULAI ================================= */
$('y').textContent = new Date().getFullYear();
setTheme(currentTheme());
route();
