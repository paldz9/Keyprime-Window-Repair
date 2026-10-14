/* =============================================
   KEYPRIME WINDOW REPAIR — JS
   Fixed hero · Snow FX · Form · Scroll FX
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll: transparent → solid ── */
  const navbar   = document.getElementById('navbar');
  const topBar   = document.getElementById('topBar');
  const heroEl   = document.getElementById('hero');
  const triggerY = window.innerHeight * 0.6;

  function onScroll() {
    const past = window.scrollY > triggerY;
    navbar.classList.toggle('navbar--hero', !past);
    navbar.classList.toggle('navbar--scrolled', past);
    topBar.classList.toggle('top-bar--solid', past);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile nav ── */
  const toggle  = document.getElementById('navToggle');
  const menu    = document.getElementById('navMenu');
  const overlay = document.getElementById('navOverlay');

  function flipNav() {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('active', open);
    overlay.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', flipNav);
  overlay.addEventListener('click', flipNav);
  menu.querySelectorAll('.navbar__link').forEach(a => {
    a.addEventListener('click', () => {
      if (menu.classList.contains('open')) flipNav();
    });
  });

  /* ── Scroll-in animations ── */
  const animEls = document.querySelectorAll('.anim-in, .anim-slide-right');
  const animObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const d = parseInt(e.target.dataset.delay) || 0;
        setTimeout(() => e.target.classList.add('visible'), d);
        animObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  animEls.forEach(el => animObs.observe(el));

  /* ── Hero entry animations ── */
  const heroAnims = document.querySelectorAll('.hero-anim');
  heroAnims.forEach(el => {
    const d = parseInt(el.dataset.delay) || 0;
    setTimeout(() => el.classList.add('visible'), 300 + d);
  });

  /* ── Show side tab between page-content start and contact section ── */
  const sideTab = document.querySelector('.side-tab');
  const contactSection = document.getElementById('contact');
  const pageContent = document.querySelector('.page-content');
  if (sideTab && contactSection && pageContent) {
    function checkSideTab() {
      const pageTop = pageContent.getBoundingClientRect().top;
      const ctaTop = contactSection.getBoundingClientRect().top;
      const inMiddle = pageTop <= 0 && ctaTop > 0;
      sideTab.classList.toggle('side-tab--visible', inMiddle);
    }
    window.addEventListener('scroll', checkSideTab, { passive: true });
    checkSideTab();
  }

  /* ── Hide hero content when contact is in view ── */
  if (contactSection && heroEl) {
    const ctaObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        heroEl.classList.toggle('hero--hide-content', e.isIntersecting);
      });
    }, { threshold: 0.05 });
    ctaObs.observe(contactSection);
  }

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) {
        e.preventDefault();
        const navH = navbar.offsetHeight + topBar.offsetHeight;
        const y = t.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ── Contact form submit ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const origText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Quote Requested!';
        btn.style.background = '#22c55e';
        btn.style.borderColor = '#22c55e';
        setTimeout(() => {
          btn.textContent = origText;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.disabled = false;
          form.reset();
        }, 3000);
      }, 1200);
    });
  }

  /* ═══════════════════════════════════════════
     SCROLL FROST — spread-based intensity
     Ice texture generated once (small canvas),
     mask-size grows from edges toward center
     ═══════════════════════════════════════════ */
  (function initFrost() {
    var el = document.getElementById('frost');
    if (!el) return;

    /* ── Generate ice crystal texture (512×512) ── */
    var S = 512;
    var tc = document.createElement('canvas');
    tc.width = S; tc.height = S;
    var t = tc.getContext('2d');

    function branch(x, y, len, ang, depth, max) {
      if (depth > max || len < 2) return;
      var ex = x + Math.cos(ang) * len;
      var ey = y + Math.sin(ang) * len;
      t.beginPath(); t.moveTo(x, y); t.lineTo(ex, ey); t.stroke();
      var nl = len * (0.6 + Math.random() * 0.12);
      branch(ex, ey, nl, ang + (Math.random() - 0.5) * 0.2, depth + 1, max);
      if (len > 5) {
        var sp = 0.4 + Math.random() * 0.35;
        if (Math.random() < 0.8) branch(ex, ey, nl * 0.75, ang + sp, depth + 1, max);
        if (Math.random() < 0.8) branch(ex, ey, nl * 0.75, ang - sp, depth + 1, max);
      }
      if (depth > 1 && Math.random() < 0.3 && len > 8) {
        var s = Math.random() < 0.5 ? 1 : -1;
        branch(ex, ey, nl * 0.4, ang + s * 0.7, depth + 2, max);
      }
    }

    function crystal(cx, cy, size, arms) {
      var maxD = size > 50 ? 5 : 4;
      for (var a = 0; a < arms; a++) {
        var ang = (Math.PI * 2 / arms) * a + (Math.random() - 0.5) * 0.25;
        branch(cx, cy, size * 0.4, ang, 0, maxD);
      }
    }

    /* Fill the full 512×512 with crystals spread across it */
    t.lineCap = 'round';

    /* Glow pass */
    t.shadowColor = 'rgba(200,225,245,0.5)';
    t.shadowBlur = 10;
    t.lineWidth = 2.5;
    t.strokeStyle = 'rgba(190,215,240,0.1)';
    for (var i = 0; i < 15; i++) {
      crystal(Math.random() * S, Math.random() * S, 50 + Math.random() * 70, 5 + Math.floor(Math.random() * 2));
    }

    /* Medium pass */
    t.shadowBlur = 4;
    t.lineWidth = 1.2;
    t.strokeStyle = 'rgba(210,235,255,0.2)';
    for (var i = 0; i < 25; i++) {
      crystal(Math.random() * S, Math.random() * S, 30 + Math.random() * 55, 5 + Math.floor(Math.random() * 3));
    }

    /* Sharp detail pass */
    t.shadowBlur = 1;
    t.lineWidth = 0.5;
    t.strokeStyle = 'rgba(220,240,255,0.28)';
    for (var i = 0; i < 35; i++) {
      crystal(Math.random() * S, Math.random() * S, 15 + Math.random() * 40, 4 + Math.floor(Math.random() * 3));
    }

    /* Bright highlights */
    t.shadowColor = 'rgba(230,245,255,0.4)';
    t.shadowBlur = 6;
    t.lineWidth = 1;
    t.strokeStyle = 'rgba(235,245,255,0.32)';
    for (var i = 0; i < 10; i++) {
      crystal(Math.random() * S, Math.random() * S, 40 + Math.random() * 60, 6);
    }

    /* Apply texture to all corners */
    var dataUrl = tc.toDataURL('image/png');
    var corners = el.querySelectorAll('.frost__corner');
    for (var c = 0; c < corners.length; c++) {
      corners[c].style.backgroundImage = 'url(' + dataUrl + ')';
    }

    /* ── Scroll-driven spread ── */
    var frost = 0;
    var target = 0;
    var accum = 0;
    var prevY = window.scrollY;
    var decayTimer = null;
    var raf = null;

    /* MIN/MAX mask size — controls how far ice spreads
       At frost=0 → 0% (invisible)
       At frost=1 → 110% (nearly full screen from each corner) */
    function applyFrost(v) {
      el.style.setProperty('--frost', v);
      var pct = (v * 110) + '%';
      for (var c = 0; c < corners.length; c++) {
        corners[c].style.webkitMaskSize = pct + ' ' + pct;
        corners[c].style.maskSize = pct + ' ' + pct;
      }
    }

    function tick() {
      if (frost < target) {
        frost = Math.min(frost + 0.03, target);
      } else if (frost > target) {
        frost = Math.max(frost - 0.002, target);
      }

      applyFrost(frost);

      if (frost > 0.001 || target > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        frost = 0;
        applyFrost(0);
        raf = null;
      }
    }

    function startTick() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    /* Start with 0 spread */
    applyFrost(0);

    window.addEventListener('scroll', function() {
      var nowY = window.scrollY;
      var delta = Math.abs(nowY - prevY);
      prevY = nowY;

      accum += delta * 0.0008;
      target = Math.min(accum, 1);

      clearTimeout(decayTimer);
      decayTimer = setTimeout(function() {
        target = 0;
        accum = 0;
      }, 700);

      startTick();
    }, { passive: true });
  })();
});
