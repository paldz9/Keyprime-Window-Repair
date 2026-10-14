/* =============================================
   KEYPRIME WINDOW REPAIR — JS
   Fixed hero · Snow FX · FAQ char reveal
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
  const navLinks = menu.querySelectorAll('.navbar__link:not(.navbar__link--cta)');
  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      if (menu.classList.contains('open')) flipNav();
    });
  });
  menu.querySelectorAll('.navbar__link--cta').forEach(a =>
    a.addEventListener('click', () => menu.classList.contains('open') && flipNav())
  );

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

  /* ── Show side tab only between hero and CTA ── */
  const sideTab = document.querySelector('.side-tab');
  const ctaEl = document.querySelector('.cta');
  const pageContent = document.querySelector('.page-content');
  if (sideTab && ctaEl && pageContent) {
    function checkSideTab() {
      const pageTop = pageContent.getBoundingClientRect().top;
      const ctaTop = ctaEl.getBoundingClientRect().top;
      const inMiddle = pageTop <= 0 && ctaTop > 0;
      sideTab.classList.toggle('side-tab--visible', inMiddle);
    }
    window.addEventListener('scroll', checkSideTab, { passive: true });
    checkSideTab();
  }

  /* ── Hide hero content behind CTA section ── */
  const ctaSection = document.querySelector('.cta');
  if (ctaSection && heroEl) {
    const ctaObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        heroEl.classList.toggle('hero--hide-content', e.isIntersecting);
      });
    }, { threshold: 0.05 });
    ctaObs.observe(ctaSection);
  }

  /* ── Mobile comparison accordion ── */
  const compAccordion = document.getElementById('compAccordion');
  if (compAccordion) {
    compAccordion.addEventListener('click', e => {
      const item = e.target.closest('.comparison__acc-item');
      if (!item) return;
      const wasOpen = item.classList.contains('open');
      compAccordion.querySelectorAll('.comparison__acc-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  }

  /* ── Hero entry animations ── */
  const heroAnims = document.querySelectorAll('.hero-anim');
  heroAnims.forEach(el => {
    const d = parseInt(el.dataset.delay) || 0;
    setTimeout(() => el.classList.add('visible'), 300 + d);
  });

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

  /* ═══════════════════════════════════════════
     SNOWFALL EFFECT — canvas-based
     ═══════════════════════════════════════════ */
  const canvas = document.getElementById('snowCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let flakes = [], raf = null, snowActive = false;
  const N = 80;

  function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
  resize();
  addEventListener('resize', resize);

  function mkFlake() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * -1,
      r: 1 + Math.random() * 3,
      sp: .5 + Math.random() * 1.5,
      op: .15 + Math.random() * .45,
      wx: Math.random() * .5 - .25,
      phase: Math.random() * Math.PI * 2
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const f of flakes) {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${f.op})`;
      ctx.fill();
      f.y += f.sp;
      f.x += Math.sin(f.phase) * f.wx;
      f.phase += .01;
      if (f.y > canvas.height + 10) {
        f.y = -f.r * 2;
        f.x = Math.random() * canvas.width;
      }
    }
    raf = requestAnimationFrame(draw);
  }

  function startSnow() {
    if (snowActive) return;
    snowActive = true;
    canvas.classList.add('active');
    flakes = Array.from({ length: N }, mkFlake);
    flakes.forEach(f => { f.y = Math.random() * canvas.height; });
    draw();
  }
  function stopSnow() {
    if (!snowActive) return;
    snowActive = false;
    canvas.classList.remove('active');
    cancelAnimationFrame(raf);
  }

  startSnow();

  function snowCheck() {
    if (window.scrollY < window.innerHeight * 0.85) {
      startSnow();
    } else {
      stopSnow();
    }
  }
  window.addEventListener('scroll', snowCheck, { passive: true });

  /* ═══════════════════════════════════════════
     COMPARISON — paired hover across columns
     ═══════════════════════════════════════════ */
  const kpItems = document.querySelectorAll('.comparison__col--kp .comparison__list li');
  const otherItems = document.querySelectorAll('.comparison__col--others .comparison__list li');

  kpItems.forEach((li, i) => {
    li.addEventListener('mouseenter', () => {
      li.classList.add('hover-active');
      if (otherItems[i]) otherItems[i].classList.add('hover-active');
    });
    li.addEventListener('mouseleave', () => {
      li.classList.remove('hover-active');
      if (otherItems[i]) otherItems[i].classList.remove('hover-active');
    });
  });
  otherItems.forEach((li, i) => {
    li.addEventListener('mouseenter', () => {
      li.classList.add('hover-active');
      if (kpItems[i]) kpItems[i].classList.add('hover-active');
    });
    li.addEventListener('mouseleave', () => {
      li.classList.remove('hover-active');
      if (kpItems[i]) kpItems[i].classList.remove('hover-active');
    });
  });

  /* ═══════════════════════════════════════════
     FAQ ACCORDION — auto-close + char reveal
     ═══════════════════════════════════════════ */
  const faqItems = document.querySelectorAll('.faq__item');

  function wrapChars(answerEl) {
    const p = answerEl.querySelector('p');
    if (!p || p.querySelector('.char')) return;
    const text = p.textContent;
    p.innerHTML = '';
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = text[i] === ' ' ? ' ' : text[i];
      span.style.animationDelay = `${i * 4}ms`;
      p.appendChild(span);
    }
  }

  faqItems.forEach(item => {
    item.querySelector('summary').addEventListener('click', e => {
      e.preventDefault();
      const wasOpen = item.hasAttribute('open');

      faqItems.forEach(other => {
        if (other !== item && other.hasAttribute('open')) {
          other.removeAttribute('open');
          const op = other.querySelector('.faq__answer p');
          if (op && op.querySelector('.char')) op.innerHTML = op.textContent;
        }
      });

      if (!wasOpen) {
        item.setAttribute('open', '');
        wrapChars(item.querySelector('.faq__answer'));
      } else {
        item.removeAttribute('open');
        const p = item.querySelector('.faq__answer p');
        if (p && p.querySelector('.char')) p.innerHTML = p.textContent;
      }
    });
  });

  const openFaq = document.querySelector('.faq__item[open] .faq__answer');
  if (openFaq) wrapChars(openFaq);
});
