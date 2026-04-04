// main.js
// ==================== GLOBAL VARIABLES ====================
let currentGame = null, currentType = 'regular', selectedItem = null, isOtherProduct = false, isPanel = false;
let audioPlayer = null;
let currentSongIndex = 0;
let songsData = [];

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

// ==================== GLOBAL AUDIO PLAYER ====================
let globalAudio = new Audio();
let globalSongsData = [];
let globalCurrentIndex = 0;
let isGlobalPlaying = false;

// ✅ Tambahkan ini SEKALI setelah globalAudio dibuat
globalAudio.addEventListener('ended', () => {
    nextGlobalSong();  // Akan lanjut ke lagu berikutnya, dan jika sudah terakhir kembali ke awal
});

// ... sisanya tetap seperti kode Anda, tapi hapus event listener yang ada di dalam initMusicGlobal ...

// Fungsi untuk memuat lagu ke globalAudio
function loadGlobalSong(index) {
  if (!globalSongsData[index]) return;
  const song = globalSongsData[index];
  globalAudio.src = song.src;
  globalAudio.load();
  if (isGlobalPlaying) globalAudio.play();
  // Simpan metadata untuk UI nanti
  window.currentSongMeta = {
    title: song.title,
    artist: song.artist,
    cover: song.cover,
    lyrics: song.lyrics,
    index: index
  };
}

// Fungsi untuk toggle play/pause global
function toggleGlobalPlay() {
  if (globalAudio.paused) {
    globalAudio.play();
    isGlobalPlaying = true;
  } else {
    globalAudio.pause();
    isGlobalPlaying = false;
  }
  // Update UI music jika halaman music sedang aktif
  updateMusicUI();
}

// Fungsi untuk next lagu
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

// Fungsi untuk menyinkronkan UI music.html dengan global player
function updateMusicUI() {
  const musicPage = document.querySelector('.music-page');
  if (!musicPage) return; // Halaman music tidak aktif
  
  const song = globalSongsData[globalCurrentIndex];
  if (!song) return;
  
  document.getElementById('songTitle').innerText = song.title;
  document.getElementById('artist').innerText = song.artist;
  document.getElementById('musicCover').src = song.cover;
  
  const playPauseIcon = document.getElementById('playPauseIcon');
  if (playPauseIcon) {
    playPauseIcon.className = globalAudio.paused ? 'fas fa-play' : 'fas fa-pause';
  }
  
  // Update lyrics
  const lyricsContainer = document.getElementById('lyricsContainer');
  if (lyricsContainer && song.lyrics) {
    lyricsContainer.innerHTML = '';
    song.lyrics.forEach(line => {
      const p = document.createElement('p');
      p.innerText = line.text;
      lyricsContainer.appendChild(p);
    });
  }
  
  // Update progress bar secara berkala jika halaman aktif
  if (window.progressInterval) clearInterval(window.progressInterval);
  window.progressInterval = setInterval(() => {
    if (!globalAudio.duration) return;
    const percent = (globalAudio.currentTime / globalAudio.duration) * 100;
    const progressBar = document.getElementById('musicProgress');
    if (progressBar) progressBar.style.width = percent + '%';
    
    // Update lyrics highlight
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
      if (activeIndex >= 0 && lines[activeIndex]) {
        lines[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, 200);
}

// Inisialisasi music (load data JSON) hanya sekali
function initMusicGlobal() {
  if (globalSongsData.length > 0) return Promise.resolve();
  return fetch('listmusic.json')
    .then(res => res.json())
    .then(data => {
      globalSongsData = data.songs;
      if (globalSongsData.length > 0 && !globalAudio.src) {
        loadGlobalSong(0);
      }
    })
    .catch(err => console.error('Gagal load music:', err));
}

// ==================== MUSIC ====================
function initMusic() {
  initMusicGlobal().then(() => {
    // Tampilkan UI sesuai global player
    updateMusicUI();
    // Pasang event listener untuk kontrol tombol di music.html
    attachMusicControls();
  });
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

function setupMusicPlayer() {
  const audioHtml = '<audio id="musicAudio"></audio>';
  if (!document.getElementById('musicAudio')) {
    document.querySelector('.music-page .player').insertAdjacentHTML('beforeend', audioHtml);
  }
  audioPlayer = document.getElementById('musicAudio');
  if (!audioPlayer) return;
  
  // Event listener untuk progress
  audioPlayer.addEventListener('timeupdate', updateProgress);
  audioPlayer.addEventListener('ended', nextSong);
}

function loadSong(index) {
  if (!songsData[index]) return;
  const song = songsData[index];
  document.getElementById('songTitle').innerText = song.title;
  document.getElementById('artist').innerText = song.artist;
  document.getElementById('musicCover').src = song.cover;
  audioPlayer.src = song.src;
  audioPlayer.load();
  audioPlayer.play();
  document.getElementById('playPauseIcon').classList.replace('fa-play', 'fa-pause');
  
  // Render lyrics
  const lyricsContainer = document.getElementById('lyricsContainer');
  if (lyricsContainer && song.lyrics) {
    lyricsContainer.innerHTML = '';
    song.lyrics.forEach(line => {
      const p = document.createElement('p');
      p.innerText = line.text;
      lyricsContainer.appendChild(p);
    });
  }
  
  // Update active playlist
  document.querySelectorAll('.playlist-item').forEach((item, idx) => {
    if (idx === index) item.classList.add('active');
    else item.classList.remove('active');
  });
}

function updateProgress() {
  if (!audioPlayer.duration) return;
  const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  const progressBar = document.getElementById('musicProgress');
  if (progressBar) progressBar.style.width = percent + '%';
  
  // Update lyrics highlight
  const currentSong = songsData[currentSongIndex];
  if (currentSong && currentSong.lyrics) {
    const lines = document.querySelectorAll('#lyricsContainer p');
    let activeIndex = -1;
    for (let i = 0; i < currentSong.lyrics.length; i++) {
      if (audioPlayer.currentTime >= currentSong.lyrics[i].time) {
        activeIndex = i;
      } else break;
    }
    lines.forEach((line, idx) => {
      if (idx === activeIndex) line.classList.add('active');
      else line.classList.remove('active');
    });
    if (activeIndex >= 0) {
      lines[activeIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

window.togglePlay = function() {
  if (audioPlayer.paused) {
    audioPlayer.play();
    document.getElementById('playPauseIcon').classList.replace('fa-play', 'fa-pause');
  } else {
    audioPlayer.pause();
    document.getElementById('playPauseIcon').classList.replace('fa-pause', 'fa-play');
  }
};

window.nextSong = function() {
  currentSongIndex = (currentSongIndex + 1) % songsData.length;
  loadSong(currentSongIndex);
};

window.prevSong = function() {
  currentSongIndex = (currentSongIndex - 1 + songsData.length) % songsData.length;
  loadSong(currentSongIndex);
};

window.setProgress = function(e) {
  const width = e.currentTarget.clientWidth;
  const clickX = e.offsetX;
  if (audioPlayer.duration) {
    audioPlayer.currentTime = (clickX / width) * audioPlayer.duration;
  }
};

// ==================== BANTUAN ====================
function initBantuan() {
  // Tidak ada inisialisasi khusus, hanya konten statis
}

// ==================== CHECKOUT ====================
function initCheckout() {
  // Kode checkout akan dijalankan dari dalam file checkout.html
  // Namun kita panggil fungsi yang ada di global scope
  if (typeof window.initCheckoutForm === 'function') {
    window.initCheckoutForm();
  }
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