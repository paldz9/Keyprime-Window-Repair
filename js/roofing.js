/* =============================================
   KEYPRIME ROOFING PAGE — JS
   Dual-layer reveal hero · Scroll FX
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
      navLinks.forEach(l => l.classList.remove('nav-active'));
      a.classList.add('nav-active');
      if (menu.classList.contains('open')) flipNav();
    });
  });
  menu.querySelectorAll('.navbar__link--cta').forEach(a =>
    a.addEventListener('click', () => menu.classList.contains('open') && flipNav())
  );

  /* ── Parallax ── */
  const pxEls = document.querySelectorAll('[data-parallax]');
  function parallax() {
    const sy = window.scrollY;
    const wh = window.innerHeight;
    pxEls.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -300 || r.top > wh + 300) return;
      const speed = parseFloat(el.dataset.parallax) || 0.12;
      const off = (sy - (el.offsetTop - wh)) * speed;
      el.style.transform = `translate3d(0,${off}px,0)`;
    });
  }
  window.addEventListener('scroll', parallax, { passive: true });
  parallax();

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
     DUAL-LAYER REVEAL EFFECT
     Video underlay always visible; overlay image
     revealed through a feathered radial mask
     that follows the mouse cursor.
     ═══════════════════════════════════════════ */
  const revealCanvas = document.getElementById('revealCanvas');
  const overlayImg = document.getElementById('overlayImg');
  if (!revealCanvas) return;
  const rCtx = revealCanvas.getContext('2d');

  const REVEAL_RADIUS = 180;
  const FEATHER = 60;
  const EASE = 0.12;

  let mouse = { x: -9999, y: -9999 };
  let smoothMouse = { x: -9999, y: -9999 };
  let isHovering = false;
  let currentRadius = 0;
  let rW, rH;
  let imgLoaded = false;

  if (overlayImg) {
    if (overlayImg.complete && overlayImg.naturalWidth > 0) {
      imgLoaded = true;
    } else {
      overlayImg.addEventListener('load', () => { imgLoaded = true; });
    }
  }

  function resizeReveal() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = revealCanvas.getBoundingClientRect();
    revealCanvas.width = rect.width * dpr;
    revealCanvas.height = rect.height * dpr;
    rCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rW = rect.width;
    rH = rect.height;
  }

  function animateReveal() {
    rCtx.clearRect(0, 0, rW, rH);

    smoothMouse.x += (mouse.x - smoothMouse.x) * EASE;
    smoothMouse.y += (mouse.y - smoothMouse.y) * EASE;

    const targetRadius = isHovering ? REVEAL_RADIUS : 0;
    currentRadius += (targetRadius - currentRadius) * EASE;

    if (imgLoaded && currentRadius > 1) {
      rCtx.save();

      const inner = Math.max(0, currentRadius - FEATHER);
      const grad = rCtx.createRadialGradient(
        smoothMouse.x, smoothMouse.y, inner,
        smoothMouse.x, smoothMouse.y, currentRadius
      );
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');

      rCtx.fillStyle = grad;
      rCtx.fillRect(0, 0, rW, rH);

      rCtx.globalCompositeOperation = 'source-in';

      const imgAspect = overlayImg.naturalWidth / overlayImg.naturalHeight;
      const canvasAspect = rW / rH;
      let sx, sy, sw, sh;

      if (imgAspect > canvasAspect) {
        sh = overlayImg.naturalHeight;
        sw = sh * canvasAspect;
        sx = (overlayImg.naturalWidth - sw) / 2;
        sy = 0;
      } else {
        sw = overlayImg.naturalWidth;
        sh = sw / canvasAspect;
        sx = 0;
        sy = (overlayImg.naturalHeight - sh) / 2;
      }

      rCtx.drawImage(overlayImg, sx, sy, sw, sh, 0, 0, rW, rH);
      rCtx.restore();
    }

    requestAnimationFrame(animateReveal);
  }

  heroEl.addEventListener('mousemove', e => {
    const rect = revealCanvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    isHovering = true;
  });

  heroEl.addEventListener('mouseleave', () => {
    isHovering = false;
  });

  heroEl.addEventListener('touchmove', e => {
    const rect = revealCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
    isHovering = true;
  }, { passive: true });

  heroEl.addEventListener('touchend', () => {
    isHovering = false;
  });

  let revealResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(revealResizeTimer);
    revealResizeTimer = setTimeout(resizeReveal, 150);
  });

  resizeReveal();
  animateReveal();

  /* ═══════════════════════════════════════════
     PRODUCT TABS — 3-column selector
     ═══════════════════════════════════════════ */
  const productData = [
    { desc: 'America’s most popular residential roof type with fast installation and vast color and style options. Durable protection that can last up to 50 years.', img: 'assets/images/products/asphalt-shingles.jpg', alt: 'Asphalt Shingles' },
    { desc: 'A distinctive way to protect your home with an elevated, luxurious style. Minnesota has a proud history of using natural and historic materials for home builds.', img: 'assets/images/products/cedar-shake.jpg', alt: 'Cedar Shake' },
    { desc: 'The toughest roofing material on the market — offering 70+ maintenance-free years of weather protection. Fireproof and can lower insurance costs.', img: 'assets/images/products/metal-roofs.jpg', alt: 'Metal Roofs' },
    { desc: 'More longevity, more energy savings, and superior weather protection. One of the most popular commercial roofing systems in Minnesota.', img: 'assets/images/products/roof-coatings.avif', alt: 'Roof Coatings' },
    { desc: 'Durable and efficient low-slope roofing solutions using advanced materials like TPO, EPDM, and PVC to protect your property.', img: 'assets/images/products/flat-roofs.jpg', alt: 'Flat Roofs / Low Slope' }
  ];

  const productBtns = document.querySelectorAll('.products__item');
  const productDesc = document.getElementById('productDesc');
  const productImg  = document.getElementById('productImg');

  if (productBtns.length && productDesc && productImg) {
    productBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        const data = productData[idx];
        if (!data) return;

        productBtns.forEach(b => b.classList.remove('products__item--active'));
        btn.classList.add('products__item--active');

        productDesc.classList.add('fade-out');
        productImg.classList.add('fade-out');

        setTimeout(() => {
          productDesc.textContent = data.desc;
          productImg.src = data.img;
          productImg.alt = data.alt;
          productDesc.classList.remove('fade-out');
          productImg.classList.remove('fade-out');
        }, 300);
      });
    });
  }

  /* ═══════════════════════════════════════════
     COMPARISON — paired hover
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
