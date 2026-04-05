// main.js
// ==================== GLOBAL VARIABLES ====================
let currentGame = null, currentType = 'regular', selectedItem = null, isOtherProduct = false, isPanel = false;
/*
let audioPlayer = null;
let currentSongIndex = 0;
let songsData = [];
*/
// ==================== LOAD PAGE SYSTEM ====================
function loadPage(page) {
  fetch(`pages/${page}.html`)
    .then(res => {
      if (!res.ok) throw new Error(`Halaman ${page} tidak ditemukan`);
      return res.text();
    })
    .then(html => {
      document.getElementById('pageContent').innerHTML = html;
      // Set class pada page container untuk styling spesifik
      document.getElementById('pageContent').className = `page-container fade ${page}-page`;
      
      // Inisialisasi khusus per halaman
      if (page === 'beranda') initBeranda();
      else if (page === 'pengumuman') initPengumuman();
      else if (page === 'music') initMusic();
      else if (page === 'kalkulator') initKalkulator();
      else if (page === 'bantuan') initBantuan();
      else if (page === 'checkout') initCheckout();
      
      // Update active class di sidebar dan bottom nav
      document.querySelectorAll('#sidebar .menu p').forEach(p => p.classList.remove('active'));
      document.querySelectorAll(`#sidebar .menu p[data-page="${page}"]`).forEach(p => p.classList.add('active'));
      document.querySelectorAll('.bottom-nav div').forEach(div => div.classList.remove('active'));
      document.querySelectorAll(`.bottom-nav div[data-page="${page}"]`).forEach(div => div.classList.add('active'));
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(err => {
      document.getElementById('pageContent').innerHTML = `<div class="error-container"><p>❌ ${err.message}</p></div>`;
    });
}

// ==================== BERANDA ====================
function initBeranda() {
  // Slider otomatis
  let slides = document.querySelectorAll('.beranda-page .slide');
  let slideIndex = 0;
  if (slides.length) {
    setInterval(() => {
      slides.forEach(s => s.classList.remove('active'));
      slideIndex = (slideIndex + 1) % slides.length;
      slides[slideIndex].classList.add('active');
    }, 4000);
  }
  
  // Search event
  const searchInput = document.getElementById('searchGame');
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      let keyword = e.target.value.toLowerCase();
      document.querySelectorAll('.beranda-page .game-card').forEach(card => {
        let name = card.innerText.toLowerCase();
        card.style.display = name.includes(keyword) ? '' : 'none';
      });
    });
  }
  
  // Load games dari database
  loadGameGrids();
}

function loadGameGrids() {
  // Game Grid
  const gameGrid = document.getElementById('gameGrid');
  if (gameGrid && typeof database !== 'undefined') {
    gameGrid.innerHTML = '';
    Object.keys(database).forEach(key => {
      const game = database[key];
      const premium = game.premium === true;
      gameGrid.innerHTML += `<div class="game-card ${premium ? 'premium' : ''}" onclick="openTopup('${key}')">
        <div class="game-img">${premium ? '<div class="badge-premium">🔥</div>' : ''}<img src="${game.image}"></div>
        <div class="game-name">${game.name}</div>
        <div class="game-service">${game.regular.length} Layanan</div>
      </div>`;
    });
  }
  
  // Other Grid
  const otherGrid = document.getElementById('otherGrid');
  if (otherGrid && typeof databaseOther !== 'undefined') {
    otherGrid.innerHTML = '';
    Object.keys(databaseOther).forEach(key => {
      const item = databaseOther[key];
      otherGrid.innerHTML += `<div class="game-card" onclick="openOther('${key}')">
        <div class="game-img"><img src="${item.image}"></div>
        <div class="game-name">${item.name}</div>
        <div class="game-service">${item.items.length} Produk</div>
      </div>`;
    });
  }
  
  // Panel Grid
  const panelGrid = document.getElementById('panelGrid');
  if (panelGrid && typeof databasePanel !== 'undefined') {
    panelGrid.innerHTML = '';
    Object.keys(databasePanel).forEach(key => {
      const panel = databasePanel[key];
      panelGrid.innerHTML += `<div class="game-card" onclick="openPanel('${key}')">
        <div class="game-img"><img src="${panel.image}"></div>
        <div class="game-name">${panel.name}</div>
        <div class="game-service">${panel.items.length} Paket</div>
      </div>`;
    });
  }
}

// Fungsi untuk kategori (global)
window.openCategory = function(type) {
  document.getElementById('menuGrid').style.display = 'none';
  document.getElementById('gameGrid').style.display = 'none';
  document.getElementById('panelGrid').style.display = 'none';
  document.getElementById('otherGrid').style.display = 'none';
  document.getElementById('titleGame').style.display = 'none';
  document.getElementById('titleHosting').style.display = 'none';
  document.getElementById('titleOther').style.display = 'none';
  document.getElementById('titleLayanan').style.display = 'none';
  document.getElementById('backBtn').style.display = 'block';
  document.getElementById('searchArea').style.display = 'flex';
  
  let grid, title;
  if (type === 'game') { grid = document.getElementById('gameGrid'); title = document.getElementById('titleGame'); }
  else if (type === 'hosting') { grid = document.getElementById('panelGrid'); title = document.getElementById('titleHosting'); }
  else { grid = document.getElementById('otherGrid'); title = document.getElementById('titleOther'); }
  if (grid && title) {
    grid.style.display = 'grid';
    title.style.display = 'flex';
    grid.classList.add('fade');
  }
};

window.goBack = function() {
  document.getElementById('menuGrid').style.display = 'grid';
  document.getElementById('gameGrid').style.display = 'none';
  document.getElementById('panelGrid').style.display = 'none';
  document.getElementById('otherGrid').style.display = 'none';
  document.getElementById('titleGame').style.display = 'none';
  document.getElementById('titleHosting').style.display = 'none';
  document.getElementById('titleOther').style.display = 'none';
  document.getElementById('titleLayanan').style.display = 'flex';
  document.getElementById('backBtn').style.display = 'none';
  document.getElementById('searchArea').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ==================== TOPUP MODAL FUNCTIONS ====================
window.openTopup = function(game) {
  const data = database[game];
  isOtherProduct = false; isPanel = false; currentGame = game; currentType = 'regular'; selectedItem = null;
  document.getElementById('gameName').innerText = data.name;
  document.getElementById('gameIcon').src = data.image;
  const membershipTab = document.getElementById('membershipTab');
  membershipTab.style.display = (data.membership && data.membership.length) ? 'block' : 'none';
  document.getElementById('confirmBtn').disabled = true;
  document.getElementById('confirmBtn').classList.remove('active');
  renderItems();
  const modal = document.getElementById('topupModal');
  modal.style.display = 'flex';
  modal.offsetHeight;
  modal.classList.add('show');
};

window.openPanel = function(key) {
  const data = databasePanel[key];
  isPanel = true; isOtherProduct = false; currentGame = key; selectedItem = null;
  document.getElementById('gameName').innerText = data.name;
  document.getElementById('gameIcon').src = data.image;
  document.getElementById('membershipTab').style.display = 'none';
  currentType = 'regular';
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.tab').classList.add('active');
  const container = document.getElementById('topupItems');
  container.innerHTML = '';
  data.items.forEach(item => {
    const div = document.createElement('div');
    div.className = `item ${item.status || 'online'}`;
    div.innerHTML = `<span class="status ${item.status || 'online'}"></span>${item.name}<div class="price">${item.price}</div>${item.status === 'offline' ? '<div style="color:red;font-size:12px;">Stok Habis</div>' : ''}`;
    div.onclick = () => {
      if (item.status === 'offline') return;
      document.querySelectorAll('.item').forEach(i => i.classList.remove('selected'));
      div.classList.add('selected');
      selectedItem = item;
      const btn = document.getElementById('confirmBtn');
      btn.disabled = false;
      btn.classList.add('active');
    };
    container.appendChild(div);
  });
  const modal = document.getElementById('topupModal');
  modal.style.display = 'flex';
  modal.offsetHeight;
  modal.classList.add('show');
};

window.openOther = function(key) {
  const data = databaseOther[key];
  isOtherProduct = true; isPanel = false; currentGame = key; selectedItem = null;
  document.getElementById('gameName').innerText = data.name;
  document.getElementById('gameIcon').src = data.image;
  document.getElementById('membershipTab').style.display = 'none';
  currentType = 'regular';
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.tab').classList.add('active');
  const container = document.getElementById('topupItems');
  container.innerHTML = '';
  data.items.forEach(item => {
    const div = document.createElement('div');
    div.className = `item ${item.status || 'online'}`;
    div.innerHTML = `<span class="status ${item.status || 'online'}"></span>${item.name}<div class="price">${item.price}</div>${item.status === 'offline' ? '<div style="color:red;font-size:12px;">Stok Habis</div>' : ''}`;
    div.onclick = () => {
      if (item.status === 'offline') return;
      document.querySelectorAll('.item').forEach(i => i.classList.remove('selected'));
      div.classList.add('selected');
      selectedItem = item;
      const btn = document.getElementById('confirmBtn');
      btn.disabled = false;
      btn.classList.add('active');
    };
    container.appendChild(div);
  });
  const modal = document.getElementById('topupModal');
  modal.style.display = 'flex';
  modal.offsetHeight;
  modal.classList.add('show');
};

function renderItems() {
  const container = document.getElementById('topupItems');
  container.innerHTML = '';
  const data = database[currentGame];
  const items = data[currentType];
  if (!items || items.length === 0) {
    container.innerHTML = '<div class="empty-item">Membership belum tersedia</div>';
    return;
  }
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = `item ${item.status || 'online'}`;
    div.innerHTML = `<span class="status ${item.status || 'online'}"></span>${item.name}<div class="price">${item.price}</div>${item.status === 'offline' ? '<div style="color:red;font-size:12px;">Stok Habis</div>' : ''}`;
    div.onclick = () => {
      if (item.status === 'offline') return;
      document.querySelectorAll('.item').forEach(i => i.classList.remove('selected'));
      div.classList.add('selected');
      selectedItem = item;
      const btn = document.getElementById('confirmBtn');
      btn.disabled = false;
      btn.classList.add('active');
    };
    container.appendChild(div);
  });
}

window.switchTab = function(type, btn) {
  const data = database[currentGame];
  if (type === 'membership' && (!data.membership || data.membership.length === 0)) return;
  currentType = type;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderItems();
};

window.goCheckout = function() {
  if (!selectedItem) return;
  let gameName, image, typeValue;
  if (isPanel) {
    const data = databasePanel[currentGame];
    gameName = data.name;
    image = data.image;
    typeValue = 'panel';
  } else if (isOtherProduct) {
    const data = databaseOther[currentGame];
    gameName = data.name;
    image = data.image;
    typeValue = 'other';
  } else {
    const data = database[currentGame];
    gameName = data.name;
    image = data.image;
    typeValue = currentType;
  }
  const priceValue = selectedItem.price.replace(/[^\d]/g, '');
  const params = new URLSearchParams({
    game: gameName,
    item: selectedItem.name,
    price: priceValue,
    image: image,
    type: typeValue,
    key: currentGame
  });
  window.location.href = `checkout.html?${params.toString()}`;
};

window.closeTopup = function() {
  const modal = document.getElementById('topupModal');
  modal.classList.remove('show');
  modal.addEventListener('transitionend', function onEnd() {
    if (!modal.classList.contains('show')) modal.style.display = 'none';
    modal.removeEventListener('transitionend', onEnd);
  }, { once: true });
};

// ==================== PENGUMUMAN ====================
function initPengumuman() {
  const container = document.getElementById('pengumumanContainer');
  if (!container) return;
  container.innerHTML = '';
  if (typeof infoData === 'undefined') return;
  [...infoData].reverse().forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    let badgeHtml = '';
    if (item.type === 'INFO') badgeHtml = '<span class="badge-info"><i class="fas fa-info"></i></span>';
    else if (item.type === 'PROMO') badgeHtml = '<span class="badge-promo"><i class="fas fa-tag"></i></span>';
    else if (item.type === 'EVENT') badgeHtml = '<span class="badge-event"><i class="fas fa-calendar"></i></span>';
    card.innerHTML = `
      <div class="card-header">
        <img src="${item.image}">
        <div class="info">
          <div class="title">${item.title}</div>
          <div class="meta">${badgeHtml} ${item.type} • ${item.date}</div>
        </div>
      </div>
      ${item.banner ? `<img class="banner" src="${item.banner}">` : ''}
      <div class="desc-box"><div class="desc">${item.desc}</div>${item.tags ? `<div class="tags">${item.tags}</div>` : ''}</div>
    `;
    container.appendChild(card);
  });
}

// ==================== GLOBAL AUDIO PLAYER (CLEAN) ====================
let globalAudio = new Audio();
let globalSongsData = [];
let globalCurrentIndex = 0;
let isGlobalPlaying = false;
let cassetteWrapper = null;
let progressInterval = null;
let lastActiveLyricIndex = -1; // Simpan indeks lirik terakhir yang aktif (dideklarasikan di luar fungsi, misal di awal global)

globalAudio.addEventListener('ended', () => {
    nextGlobalSong();
});

function loadGlobalSong(index) {
  if (!globalSongsData[index]) return;
  const song = globalSongsData[index];
  globalAudio.src = song.src;
  globalAudio.load();
  if (isGlobalPlaying) globalAudio.play();
}

function toggleGlobalPlay() {
  if (globalAudio.paused) {
    globalAudio.play();
    isGlobalPlaying = true;
  } else {
    globalAudio.pause();
    isGlobalPlaying = false;
  }
  updateMusicUI();
}

function nextGlobalSong() {
  if (globalSongsData.length === 0) return;
  globalCurrentIndex = (globalCurrentIndex + 1) % globalSongsData.length;
  loadGlobalSong(globalCurrentIndex);
  globalAudio.play();
  isGlobalPlaying = true;
  updateMusicUI();
}

function prevGlobalSong() {
  if (globalSongsData.length === 0) return;
  globalCurrentIndex = (globalCurrentIndex - 1 + globalSongsData.length) % globalSongsData.length;
  loadGlobalSong(globalCurrentIndex);
  globalAudio.play();
  isGlobalPlaying = true;
  updateMusicUI();
}



function updateMusicUI() {
  const musicPage = document.querySelector('.music-page');
  if (!musicPage) return;

  const song = globalSongsData[globalCurrentIndex];
  if (!song) return;

  const titleEl = document.getElementById('songTitle');
  const artistEl = document.getElementById('artist');
  if (titleEl) titleEl.innerText = song.title;
  if (artistEl) artistEl.innerText = song.artist;

  const playPauseIcon = document.getElementById('playPauseIcon');
  if (playPauseIcon) {
    playPauseIcon.className = globalAudio.paused ? 'fas fa-play' : 'fas fa-pause';
  }

  const lyricsContainer = document.getElementById('lyricsContainer');
  if (lyricsContainer && song.lyrics) {
    lyricsContainer.innerHTML = '';
    song.lyrics.forEach(line => {
      const p = document.createElement('p');
      p.innerText = line.text;
      lyricsContainer.appendChild(p);
    });
  }

  if (!cassetteWrapper) {
    cassetteWrapper = document.querySelector('.cassette-wrapper');
  }
  if (cassetteWrapper) {
    if (!globalAudio.paused) {
      cassetteWrapper.classList.add('playing');
    } else {
      cassetteWrapper.classList.remove('playing');
    }
  }

  if (progressInterval) clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (!globalAudio.duration) return;
    const percent = (globalAudio.currentTime / globalAudio.duration) * 100;
    const progressBar = document.getElementById('musicProgress');
    if (progressBar) progressBar.style.width = percent + '%';

    const currentSong = globalSongsData[globalCurrentIndex];
    if (currentSong && currentSong.lyrics) {
      const lines = document.querySelectorAll('#lyricsContainer p');
      let activeIndex = -1;
      for (let i = 0; i < currentSong.lyrics.length; i++) {
        if (globalAudio.currentTime >= currentSong.lyrics[i].time) activeIndex = i;
        else break;
      }
      lines.forEach((line, idx) => {
        if (idx === activeIndex) line.classList.add('active');
        else line.classList.remove('active');
      });
      
      // ========== AUTO-SCROLL DIHAPUS ==========
      // Tidak ada lagi panggilan scrollIntoView
    }
  }, 200);
}
function initMusicGlobal() {
  if (globalSongsData.length > 0) return Promise.resolve();
  return fetch('listmusic.json')
    .then(res => res.json())
    .then(data => {
      globalSongsData = data.songs;
      if (globalSongsData.length > 0 && !globalAudio.src) {
        loadGlobalSong(0);
        isGlobalPlaying = false;
        globalAudio.pause();
      }
    })
    .catch(err => console.error('Gagal load music:', err));
}

function attachMusicControls() {
  const playBtn = document.getElementById('playPauseBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressContainer = document.getElementById('progressContainer');

  if (playBtn) playBtn.onclick = () => toggleGlobalPlay();
  if (prevBtn) prevBtn.onclick = () => prevGlobalSong();
  if (nextBtn) nextBtn.onclick = () => nextGlobalSong();
  if (progressContainer) {
    progressContainer.onclick = (e) => {
      const width = e.currentTarget.clientWidth;
      const clickX = e.offsetX;
      if (globalAudio.duration) {
        globalAudio.currentTime = (clickX / width) * globalAudio.duration;
      }
    };
  }
}

// ==================== PLAYLIST BOTTOM SHEET ====================
function initPlaylistSheet() {
  if (document.getElementById('playlistSheet')) return;
  const sheetHTML = `
    <div id="playlistSheet" class="bottom-sheet" style="display: none;">
      <div class="bottom-sheet-overlay"></div>
      <div class="bottom-sheet-container">
        <div class="bottom-sheet-header">
          <div class="sheet-handle"></div>
          <h3>🎵 Daftar Lagu</h3>
          <button class="sheet-close">&times;</button>
        </div>
        <div id="playlistSheetItems" class="bottom-sheet-list"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', sheetHTML);
  const sheet = document.getElementById('playlistSheet');
  const overlay = sheet.querySelector('.bottom-sheet-overlay');
  const closeBtn = sheet.querySelector('.sheet-close');
  const closeSheet = () => {
    sheet.classList.remove('show');
    setTimeout(() => { if (!sheet.classList.contains('show')) sheet.style.display = 'none'; }, 300);
  };
  overlay.onclick = closeSheet;
  closeBtn.onclick = closeSheet;
}

function showPlaylistSheet() {
  const sheet = document.getElementById('playlistSheet');
  const container = document.getElementById('playlistSheetItems');
  if (!container) return;
  container.innerHTML = '';
  if (globalSongsData.length === 0) {
    container.innerHTML = '<div class="empty-playlist">Belum ada lagu</div>';
    sheet.style.display = 'flex';
    setTimeout(() => sheet.classList.add('show'), 10);
    return;
  }
  globalSongsData.forEach((song, idx) => {
    const item = document.createElement('div');
    item.className = 'playlist-sheet-item';
    if (idx === globalCurrentIndex) item.classList.add('active');
    item.innerHTML = `
      <div class="playlist-item-info">
        <div class="playlist-item-title">${escapeHtml(song.title)}</div>
        <div class="playlist-item-artist">${escapeHtml(song.artist)}</div>
      </div>
      <button class="playlist-item-play" data-index="${idx}"><i class="fas fa-play"></i></button>
    `;
    const playBtn = item.querySelector('.playlist-item-play');
    playBtn.onclick = (e) => {
      e.stopPropagation();
      globalCurrentIndex = idx;
      loadGlobalSong(globalCurrentIndex);
      globalAudio.play();
      isGlobalPlaying = true;
      updateMusicUI();
      closeSheet();
    };
    container.appendChild(item);
  });
  sheet.style.display = 'flex';
  setTimeout(() => sheet.classList.add('show'), 10);
}

function closeSheet() {
  const sheet = document.getElementById('playlistSheet');
  if (sheet) {
    sheet.classList.remove('show');
    setTimeout(() => { if (!sheet.classList.contains('show')) sheet.style.display = 'none'; }, 300);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// Override tombol playlist (setelah attachMusicControls)
const originalAttach = attachMusicControls;
attachMusicControls = function() {
  originalAttach();
  const playlistBtn = document.getElementById('playlistBtn');
  if (playlistBtn) playlistBtn.onclick = () => showPlaylistSheet();
};

// Init music utama
function initMusic() {
  initPlaylistSheet();
  initMusicGlobal().then(() => {
    updateMusicUI();
    attachMusicControls();
  });
}

// ==================== BANTUAN ====================
function initBantuan() {
  // Tidak ada inisialisasi khusus, hanya konten statis
}

// ==================== KALKULATOR ====================
// Data default setiap mode
// ==================== KALKULATOR ====================
// ==================== KALKULATOR (AUTO-HITUNG) ====================
// ==================== KALKULATOR (AUTO-HITUNG) ====================
function initKalkulator() {
    const defaultValues = {
        winrate: { totalMatches: '', currentWR: '', targetWR: '' },
        magic: { currentCore: 0 },
        zodiac: { currentSP: 0, bonusSkin: 0 }
    };

    let currentTab = "winrate";
    let activeListeners = [];

    const formContainer = document.getElementById("formContainer");
    const resetBtn = document.getElementById("resetBtn");
    const resultArea = document.getElementById("resultArea");

    // ========== FUNGSI HITUNG ==========
    function hitung() {
        if (currentTab === "winrate") {
            const total = document.getElementById("totalMatches")?.value;
            const wrNow = document.getElementById("currentWR")?.value;
            const target = document.getElementById("targetWR")?.value;

            if (total === "" || wrNow === "" || target === "") {
                resultArea.innerHTML = `<div class="result-placeholder"><i class="fas fa-exclamation-triangle"></i> Harap isi semua data terlebih dahulu</div>`;
                return;
            }

            const totalNum = parseFloat(total);
            const wrNum = parseFloat(wrNow);
            const targetNum = parseFloat(target);

            if (isNaN(totalNum) || isNaN(wrNum) || isNaN(targetNum)) {
                resultArea.innerHTML = `<div class="result-placeholder"><i class="fas fa-times-circle"></i> Input tidak valid!</div>`;
                return;
            }
            if (totalNum < 1) {
                resultArea.innerHTML = `<div class="result-placeholder"><i class="fas fa-info-circle"></i> Minimal total match adalah 1</div>`;
                return;
            }
            if (wrNum < 0 || wrNum > 100 || targetNum < 0 || targetNum > 100) {
                resultArea.innerHTML = `<div class="result-placeholder"><i class="fas fa-chart-simple"></i> Win rate harus antara 0-100%</div>`;
                return;
            }
            if (targetNum <= wrNum) {
                resultArea.innerHTML = `<div class="result-value"><i class="fas fa-check-circle"></i> Target sudah tercapai!</div><div class="result-desc">Tidak perlu kemenangan beruntun.</div>`;
                return;
            }
            const currentWins = (wrNum / 100) * totalNum;
            const leftCoeff = 1 - (targetNum / 100);
            const rightSide = (targetNum * totalNum) / 100 - currentWins;
            let neededWins = Math.ceil(rightSide / leftCoeff);
            neededWins = Math.max(0, neededWins);
            resultArea.innerHTML = `<div class="result-value"><i class="fas fa-chart-line"></i> ${neededWins.toLocaleString()} kemenangan beruntun</div>
                                    <div class="result-desc">Dibutuhkan untuk mencapai ${targetNum}% WR dari ${wrNum}% (${totalNum} match)</div>`;
        } 
        else if (currentTab === "magic") {
            let currentCore = parseInt(document.getElementById("magicCore")?.value);
            if (isNaN(currentCore)) currentCore = 0;
            let needCore = 200 - currentCore;
            if (needCore <= 0) {
                resultArea.innerHTML = `<div class="result-value"><i class="fas fa-check-circle"></i> Magic Core sudah cukup!</div><div class="result-desc">Skin Legend siap diklaim.</div>`;
                return;
            }
            let fiveDrawsNeeded = Math.ceil(needCore / 5);
            let totalDiamond = fiveDrawsNeeded * 270;
            resultArea.innerHTML = `<div class="result-value"><i class="fas fa-gem"></i> ${totalDiamond.toLocaleString()} Diamond</div>
                                    <div class="result-desc">Maksimal yang dibutuhkan (worst case: 5 core per 5x draw)</div>`;
        } 
        else if (currentTab === "zodiac") {
            let currentSP = parseInt(document.getElementById("starPower")?.value);
            let bonus = parseInt(document.getElementById("bonusSkin")?.value);
            if (isNaN(currentSP)) currentSP = 0;
            if (isNaN(bonus)) bonus = 0;
            let totalSP = currentSP + bonus;
            let needSP = 100 - totalSP;
            if (needSP <= 0) {
                resultArea.innerHTML = `<div class="result-value"><i class="fas fa-check-circle"></i> Star Power sudah cukup!</div><div class="result-desc">Skin Zodiac siap diklaim.</div>`;
                return;
            }
            let totalDiamond = needSP * 60;
            resultArea.innerHTML = `<div class="result-value"><i class="fas fa-gem"></i> ${totalDiamond.toLocaleString()} Diamond</div>
                                    <div class="result-desc">Maksimal yang dibutuhkan (worst case: 1 SP per draw, 60💎/draw)</div>`;
        }
    }

    // ========== RENDER FORM & PASANG AUTO LISTENER ==========
    function renderForm() {
        if (currentTab === "winrate") {
            formContainer.innerHTML = `
                <div class="input-group">
                    <label><i class="fas fa-chart-line"></i> Total Match</label>
                    <input type="number" id="totalMatches" placeholder="Masukkan total match" step="1" min="1">
                </div>
                <div class="input-group">
                    <label><i class="fas fa-bullseye"></i> Win Rate Saat Ini (%)</label>
                    <input type="number" id="currentWR" placeholder="Masukkan win rate saat ini (%)" step="0.1" min="0" max="100">
                </div>
                <div class="input-group">
                    <label><i class="fas fa-star"></i> Target Win Rate (%)</label>
                    <input type="number" id="targetWR" placeholder="Masukkan target win rate (%)" step="0.1" min="0" max="100">
                </div>
            `;
            const inputs = formContainer.querySelectorAll('input');
            inputs.forEach(inp => inp.addEventListener('input', () => hitung()));
            hitung();
        } 
        else if (currentTab === "magic") {
            formContainer.innerHTML = `
                <div class="input-group">
                    <label><i class="fas fa-magic"></i> Poin Magic Wheel : <span id="magicCoreLabel">${defaultValues.magic.currentCore}</span></label>
                    <input type="range" id="magicCore" min="0" max="199" value="${defaultValues.magic.currentCore}" step="1">
                    <div class="range-value">
                        <span class="badge-hint">Saat ini: ${defaultValues.magic.currentCore}</span>
                        <span class="badge-hint">Target: 200</span>
                    </div>
                </div>
            `;
            const slider = document.getElementById("magicCore");
            const label = document.getElementById("magicCoreLabel");
            const updateLabel = () => { label.innerText = slider.value; hitung(); };
            slider.addEventListener("input", updateLabel);
            activeListeners.push({ element: slider, listener: updateLabel });
            hitung();
        } 
        else if (currentTab === "zodiac") {
            formContainer.innerHTML = `
                <div class="input-group">
                    <label><i class="fas fa-star-of-life"></i> Star Power Saat Ini : <span id="starPowerLabel">${defaultValues.zodiac.currentSP}</span></label>
                    <input type="range" id="starPower" min="0" max="99" value="${defaultValues.zodiac.currentSP}" step="1">
                    <div class="range-value">
                        <span class="badge-hint">Saat ini: ${defaultValues.zodiac.currentSP}</span>
                        <span class="badge-hint">Target: 100</span>
                    </div>
                </div>
                <div class="input-group">
                    <label><i class="fas fa-gift"></i> Bonus Skin Zodiac Dimiliki</label>
                    <select id="bonusSkin">
                        <option value="0">0 skin (+0 SP)</option>
                        <option value="1">1 skin (+1 SP)</option>
                        <option value="2">2 skin (+2 SP)</option>
                        <option value="3">3 skin (+3 SP)</option>
                        <option value="4">4 skin (+4 SP)</option>
                        <option value="5">5 skin (+5 SP)</option>
                        <option value="6">6+ skin (+6 SP)</option>
                    </select>
                </div>
            `;
            const slider = document.getElementById("starPower");
            const label = document.getElementById("starPowerLabel");
            const select = document.getElementById("bonusSkin");
            const updateSlider = () => { label.innerText = slider.value; hitung(); };
            const updateSelect = () => { hitung(); };
            slider.addEventListener("input", updateSlider);
            select.addEventListener("change", updateSelect);
            activeListeners.push({ element: slider, listener: updateSlider });
            activeListeners.push({ element: select, listener: updateSelect });
            hitung();
        }
    }

    // ========== RESET FORM ==========
    function resetForm() {
        if (currentTab === "winrate") {
            const totalInput = document.getElementById("totalMatches");
            const wrInput = document.getElementById("currentWR");
            const targetInput = document.getElementById("targetWR");
            if (totalInput) totalInput.value = '';
            if (wrInput) wrInput.value = '';
            if (targetInput) targetInput.value = '';
            hitung();
        } 
        else if (currentTab === "magic") {
            const slider = document.getElementById("magicCore");
            if (slider) {
                slider.value = defaultValues.magic.currentCore;
                const label = document.getElementById("magicCoreLabel");
                if (label) label.innerText = defaultValues.magic.currentCore;
                hitung();
            }
        } 
        else if (currentTab === "zodiac") {
            const slider = document.getElementById("starPower");
            const select = document.getElementById("bonusSkin");
            if (slider) {
                slider.value = defaultValues.zodiac.currentSP;
                const label = document.getElementById("starPowerLabel");
                if (label) label.innerText = defaultValues.zodiac.currentSP;
            }
            if (select) select.value = defaultValues.zodiac.bonusSkin;
            hitung();
        }
    }

    // ========== BERSIHKAN LISTENER LAMA ==========
    function cleanupListeners() {
        activeListeners.forEach(({ element, listener }) => {
            element.removeEventListener("input", listener);
            element.removeEventListener("change", listener);
        });
        activeListeners = [];
    }

    // ========== EVENT UNTUK TAB ==========
    const tabBtns = document.querySelectorAll('.kalkulator-page .tab-btn');
    function onTabClick(e) {
        const btn = e.currentTarget;
        if (btn.classList.contains('active')) return;
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTab = btn.getAttribute('data-tab');
        cleanupListeners();
        renderForm();
    }
    tabBtns.forEach(btn => {
        btn.removeEventListener('click', onTabClick);
        btn.addEventListener('click', onTabClick);
    });

    // ========== RESET BUTTON ==========
    if (resetBtn) {
        resetBtn.removeEventListener('click', resetForm);
        resetBtn.addEventListener('click', resetForm);
    }

    // Inisialisasi pertama
    cleanupListeners();
    renderForm();
}
// ==================== SIDEBAR & NAVBAR FUNCTIONS ====================
window.toggleMenu = function() {
  document.getElementById('sidebar').classList.add('active');
  document.getElementById('overlay').classList.add('active');
};

window.closeMenu = function() {
  document.getElementById('sidebar').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
};

window.openAccountMenu = function() {
  alert("Fitur akun akan segera hadir.\nSilakan hubungi admin untuk transaksi.");
};

window.showAdmin = function() {
  document.getElementById('popupOverlay').style.display = 'flex';
  document.getElementById('adminBox').style.display = 'block';
  document.getElementById('notifBox').style.display = 'none';
};

window.showNotif = function() {
  document.getElementById('popupOverlay').style.display = 'flex';
  document.getElementById('notifBox').style.display = 'block';
  document.getElementById('adminBox').style.display = 'none';
};

window.closePopup = function() {
  document.getElementById('popupOverlay').style.display = 'none';
};

// ==================== SPLASH SCREEN ====================
document.getElementById('loginBtn').addEventListener('click', () => {
  const splash = document.getElementById('splash');
  splash.classList.add('hide');
  setTimeout(() => {
    splash.style.display = 'none';
    document.getElementById('mainContent').classList.add('show');
    loadPage('beranda');
  }, 500);
});

// ==================== NAVIGATION EVENT LISTENERS ====================
document.querySelectorAll('.bottom-nav div').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.getAttribute('data-page');
    if (page) loadPage(page);
  });
});
document.querySelectorAll('#sidebar .menu p[data-page]').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.getAttribute('data-page');
    if (page) loadPage(page);
  });
});