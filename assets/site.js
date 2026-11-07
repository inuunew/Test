/* Skrip bersama untuk halaman dalam: tema gelap/terang, menu HP, layar loading antar halaman */
(function () {
  var root = document.documentElement;

  function applyTheme(t) {
    root.classList.toggle('dark', t === 'dark');
    document.body && document.body.classList.toggle('dark', t === 'dark');
    var ic = document.getElementById('themeIcon');
    if (ic) ic.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
  var saved = 'light';
  try { saved = localStorage.getItem('theme') || 'light'; } catch (e) {}
  root.classList.toggle('dark', saved === 'dark');

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(saved);

    var tbtn = document.getElementById('themeToggleBtn');
    if (tbtn) tbtn.addEventListener('click', function () {
      var next = root.classList.contains('dark') ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch (e) {}
      applyTheme(next);
    });

    var nav = document.querySelector('.nav');
    var mbtn = document.getElementById('menuBtn');
    if (nav && mbtn) mbtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      mbtn.setAttribute('aria-expanded', open);
      mbtn.firstElementChild.className = open ? 'fas fa-times' : 'fas fa-bars';
    });
  });

  // Layar loading hanya saat pindah halaman
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a.transisi-ai');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#' || event.ctrlKey || event.metaKey || link.target === '_blank') return;
    event.preventDefault();
    var layar = document.getElementById('loading-layar');
    if (layar) layar.classList.add('on');
    setTimeout(function () { window.location.href = href; }, 600);
  });

  // Perbaikan: layar loading menempel saat tombol Back
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      var layar = document.getElementById('loading-layar');
      if (layar) layar.classList.remove('on');
    }
  });
})();
