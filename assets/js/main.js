/* ============================================================
   Portfolio — interactions
   零依赖原生 JS。所有逻辑随 DOM 自动生效，替换素材无需改动此处。
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 进场动画 ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  function initReveal() {
    revealEls.forEach(function (el) {
      var d = el.dataset.delay || 0;
      el.style.setProperty('--d', d);
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 2. 导航栏形态 ---------- */
  function initNav() {
    var nav = document.getElementById('nav');
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.querySelector('.nav-links');
    var lastY = window.scrollY;

    function onScroll() {
      var y = window.scrollY;
      nav.classList.toggle('is-solid', y > window.innerHeight * 0.6);
      if (y > 200 && y > lastY) nav.classList.add('is-hidden');
      else nav.classList.remove('is-hidden');
      lastY = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function () {
        var open = navLinks.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(open));
        nav.classList.remove('is-hidden');
      });
      navLinks.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          navLinks.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /* ---------- 3. 顶部滚动进度 ---------- */
  function initProgress() {
    var bar = document.getElementById('progressBar');
    if (!bar) return;
    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = pct.toFixed(2) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- 4. 作品分类筛选 ---------- */
  function initFilters() {
    var chips = document.querySelectorAll('.chip[data-filter]');
    var cards = document.querySelectorAll('#worksGrid .card');
    if (!chips.length) return;

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var filter = chip.dataset.filter;

        chips.forEach(function (c) {
          c.classList.toggle('is-active', c === chip);
          c.setAttribute('aria-selected', String(c === chip));
        });

        cards.forEach(function (card) {
          var hit = filter === 'all' || card.dataset.cat === filter;
          card.classList.toggle('is-hidden', !hit);
        });
      });
    });
  }

  /* ---------- 5. 视频灯箱 ---------- */
  var lb = document.getElementById('lightbox');
  var lbStage = document.getElementById('lbStage');
  var lbClose = document.getElementById('lbClose');
  var lastFocused = null;

  function youtubeEmbed(url) {
    if (!url) return null;
    var m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/);
    return m ? 'https://www.youtube.com/embed/' + m[1] + '?autoplay=1&rel=0' : null;
  }

  function openLightbox(opts) {
    lastFocused = document.activeElement;
    lbStage.innerHTML = '';

    var embed = opts.embed || youtubeEmbed(opts.video || '');
    if (embed) {
      var frame = document.createElement('iframe');
      frame.src = embed;
      frame.title = opts.title || '作品视频';
      frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      lbStage.appendChild(frame);
    } else if (opts.video) {
      var v = document.createElement('video');
      v.src = opts.video;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      if (opts.poster) v.poster = opts.poster;
      lbStage.appendChild(v);
    }

    if (opts.title) {
      var cap = document.createElement('p');
      cap.className = 'lb-caption';
      cap.textContent = opts.title;
      lbStage.appendChild(cap);
    }

    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    lb.hidden = true;
    lbStage.innerHTML = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  function initLightbox() {
    if (!lb) return;

    // 主 Showreel 播放器
    var reel = document.getElementById('reelFrame');
    if (reel) {
      reel.addEventListener('click', function () {
        openLightbox({
          video: reel.dataset.video,
          embed: reel.dataset.embed,
          poster: reel.dataset.poster,
          title: 'Showreel 2026'
        });
      });
    }

    // 作品卡片
    document.querySelectorAll('#worksGrid .card').forEach(function (card) {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('click', function () {
        openLightbox({
          video: card.dataset.video,
          title: card.dataset.title
        });
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lb.hidden) closeLightbox();
    });
  }

  /* ---------- 6. Hero 视频：存在即自动补 posters 兜底 ---------- */
  function initHeroVideo() {
    var v = document.querySelector('.hero-video');
    if (!v) return;
    v.muted = true;
    var p = v.play();
    if (p && typeof p.catch === 'function') p.catch(function () { /* 自动播放被拦截时保留海报 */ });
  }

  /* ---------- 7. 数字滚动（首屏统计） ---------- */
  function initCounters() {
    if (reduceMotion) return;
    var targets = ['statWorks', 'statExp', 'statClients'];
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var raw = el.textContent.trim();
        var num = parseInt(raw, 10);
        if (isNaN(num)) return;
        var suffix = raw.replace(/^[\d.]+/, '');
        var t0 = performance.now();
        (function step(now) {
          var k = Math.min((now - t0) / 1100, 1);
          var eased = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(num * eased) + suffix;
          if (k < 1) requestAnimationFrame(step);
        })(t0);
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });

    targets.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    initReveal();
    initNav();
    initProgress();
    initFilters();
    initLightbox();
    initHeroVideo();
    initCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
