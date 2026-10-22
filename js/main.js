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
  var hCarouselWrap = document.querySelector('.heartland__carousel-wrap');
  if (sideTab && contactSection && pageContent) {
    function checkSideTab() {
      var pageTop = pageContent.getBoundingClientRect().top;
      var ctaTop = contactSection.getBoundingClientRect().top;
      var inMiddle = pageTop <= 0 && ctaTop > 0;
      var hideForCarousel = false;
      if (hCarouselWrap) {
        var r = hCarouselWrap.getBoundingClientRect();
        hideForCarousel = r.top < window.innerHeight && r.bottom > 0;
      }
      sideTab.classList.toggle('side-tab--visible', inMiddle && !hideForCarousel);
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

  /* ── Product tabs — 3-column selector ── */
  const productData = [
    { desc: 'Low-maintenance, energy-efficient frames with fusion-welded corners, argon-filled double or triple glazing, and Low-E coatings. Built to last decades without fading, peeling, or warping.', img: 'assets/images/products/vinyl-windows.png', alt: 'Vinyl Windows' },
    { desc: 'The best of both worlds — a wood interior for warmth and beauty, with an aluminum, fiberglass, or vinyl exterior that fights the elements. Hail-resistant with strong air-infiltration ratings.', img: 'assets/images/products/clad-windows.png', alt: 'Clad Windows' },
    { desc: 'Solid wood frames in pine, oak, maple, or mahogany with custom stains and strong insulating value. Perfect for historic homes and luxury rebuilds — we can match any existing millwork profile.', img: 'assets/images/products/wood-windows.png', alt: 'Wood Windows' },
    { desc: 'Maximum insulation for the harshest climates. Three layers of glass with argon gas fill block cold transfer and reduce noise dramatically — ideal for Minnesota winters.', img: 'assets/images/products/triple-pane-glass.png', alt: 'Triple-Pane Glass' },
    { desc: 'High-security steel, insulated fiberglass, sliding patio, and French multi-slide doors — custom-fit for energy efficiency, curb appeal, and lasting durability.', img: 'assets/images/products/entry-patio-doors.png', alt: 'Entry & Patio Doors' }
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

  /* ── Parallax for products background ── */
  const parallaxBg = document.querySelector('[data-parallax]');
  if (parallaxBg) {
    const rate = parseFloat(parallaxBg.dataset.parallax) || 0.1;
    window.addEventListener('scroll', () => {
      const rect = parallaxBg.parentElement.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const offset = rect.top * rate;
        parallaxBg.style.transform = `translateY(${offset}px)`;
      }
    }, { passive: true });
  }

  /* ── Testimonial stars (inject SVGs) ── */
  const starSVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
  document.querySelectorAll('.testimonial-card__stars').forEach(el => {
    el.innerHTML = starSVG.repeat(5);
  });

  /* ── Testimonial paging ── */
  const reviewGrid = document.getElementById('reviewGrid');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');

  if (reviewGrid && prevBtn && nextBtn) {
    const cards = Array.from(reviewGrid.querySelectorAll('.testimonial-card'));
    let page = 0;

    function getPerPage() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function showPage() {
      const perPage = getPerPage();
      const start = page * perPage;
      cards.forEach((c, i) => {
        c.style.display = (i >= start && i < start + perPage) ? '' : 'none';
      });
    }

    function maxPage() {
      return Math.ceil(cards.length / getPerPage()) - 1;
    }

    prevBtn.addEventListener('click', () => {
      if (page > 0) { page--; showPage(); }
    });
    nextBtn.addEventListener('click', () => {
      if (page < maxPage()) { page++; showPage(); }
    });

    window.addEventListener('resize', () => {
      if (page > maxPage()) page = maxPage();
      showPage();
    });

    showPage();
  }

  /* ── Heartland dynamic window type → series switcher ── */
  (function initHeartland() {
    var types = {
      'double-hung': {
        label: 'Double Hung Windows',
        desc: 'The most popular replacement window — both sashes tilt in for easy cleaning. Available in three performance tiers.',
        series: [
          { key:'ultra', label:'Ultra Series', tagline:'Smart Sash Window System', img:'assets/images/heartland/DH_ultra.gif',
            desc:'The only window with a patented integrated hardware locking system. Combines lock, lift, and clean-on-demand into one flush mechanism. Crafted from maintenance-free u-PVC vinyl with fusion-welded corners and 1" double-strength glass.',
            features:['Patented Integrated Lock System — lock, lift & tilt in one flush mechanism','1" Glazing with 7/8" double-strength glass & Intercept spacer','Triple Weatherstripping — seals out air and water','Fusion Welded Corners for structural integrity','Multiple Hollow Chamber Design for thermal efficiency','ENERGY STAR Certified — 3-1/4" frame depth']},
          { key:'elite', label:'Elite Series', tagline:'A Lifetime Investment', img:'assets/images/heartland/DH_elite.gif',
            desc:'Fully welded construction with a structural vinyl I-beam multi-chamber meeting rail, integrated low-profile tilt latches, and dual cam locks for a weather-tight seal.',
            features:['Fully Welded System — maximum strength & weather resistance','Structural Vinyl I-Beam Meeting Rail','Integrated Low-Profile Tilt Latches — flush-mount design','Twin Recessed Locking Handles with dual cam lock','Dual Radius Integral Lift Rails','Glazing up to 7/8" overall with double-strength glass']},
          { key:'hampton', label:'Hampton Series', tagline:'Performance & Durability', img:'assets/images/heartland/double-hung1.png',
            desc:'Maintenance-free u-PVC vinyl with fusion-welded corners, dual cam locks, tilt-in sashes, and integral interlocks with lift handles for reliable, lasting operation.',
            features:['Fusion Welded Corners for structural integrity','Dual Cam Lock — weather-tight seal with added security','Tilt-In Sashes — easy cleaning from inside your home','Integral Interlocks & Lift Handles','Multiple Hollow Chamber Design','ENERGY STAR Certified']}
        ]
      },
      'single-hung': {
        label: 'Single Hung Windows',
        desc: 'Bottom sash tilts in for cleaning while the top sash stays fixed — great for bedrooms and living areas.',
        series: [
          { key:'hampton', label:'Hampton Series', tagline:'Performance & Durability', img:'assets/images/heartland/single-hung1.png',
            desc:'Features interlocking sashes for maximum wind and water protection, with a tilt-in bottom sash for easy cleaning from inside your home.',
            features:['Fusion Welded Corners for structural integrity','Dual Cam Lock — weather-tight seal','Interlocking Sashes — maximum wind & water protection','Tilt-In Bottom Sash for easy interior cleaning','Multiple Hollow Chamber Design','ENERGY STAR Certified']}
        ]
      },
      'slider': {
        label: 'Slider Windows',
        desc: 'For horizontal rather than vertical openings. Available in single, double, and triple slider configurations.',
        series: [
          { key:'ultra', label:'Ultra Series', tagline:'Smart Sash System', img:'assets/images/heartland/SLIDE_ultra.gif',
            desc:'The Smart Sash window system — the only slider with an integrated hardware locking system. Combines lock, lift, and clean-on-demand into one flush lock with triple weatherstripping and a recessed lift rail.',
            features:['Patented Integrated Locking System — Smart Sash','Triple Weather Stripped for superior sealing','Recessed Lift Rail — clean, modern profile','Tilt-In Sashes for easy cleaning','Available in Double & Triple Slider','ENERGY STAR Certified']},
          { key:'elite', label:'Elite Series', tagline:'A Lifetime Investment', img:'assets/images/heartland/SLIDE_elite.gif',
            desc:'Dual cam lock ensures a weather-tight seal and added security. Tilt-on-command feature makes cleaning a snap, with a recessed lift rail for a clean look.',
            features:['Fully Welded System — structural strength','Dual Cam Lock for weather-tight seal','Tilt-On-Command for easy cleaning','Recessed Lift Rail — modern profile','Available in Double & Triple Slider','ENERGY STAR Certified']},
          { key:'hampton', label:'Hampton Series', tagline:'Performance & Durability', img:'assets/images/heartland/double-hung1.png',
            desc:'Maintenance-free u-PVC vinyl with fusion-welded corners, dual cam locks, and tilt-in sashes. The only series offering a single slider configuration.',
            features:['Fusion Welded Corners','Dual Cam Lock — added security','Tilt-In Sashes for cleaning','Integral Interlocks & Lift Handles','Available in Single, Double & Triple Slider','ENERGY STAR Certified']}
        ]
      },
      'casement': {
        label: 'Casement Windows',
        desc: 'Hinged on the side and cranked open outward — excellent ventilation and an unobstructed view. Uniquely designed to transfer the weight of the glass away from the open sash.',
        series: [
          { key:'regency', label:'Regency Series', tagline:'The Strength of the Heartland', img:'assets/images/heartland/CASE_regency.gif',
            desc:'Special hinge design that makes cleaning a snap, with a unique system that prevents sagging and ensures long-lasting operation. Egress hardware available upon request.',
            features:['Fusion Welded Corners — u-PVC vinyl construction','Special Hinge Design — easy cleaning','Anti-Sag System for lasting operation','Energy-Efficient Hollow Chamber Design','Custom Made to exact opening','ENERGY STAR Certified — egress hardware available']}
        ]
      },
      'awning': {
        label: 'Awning Windows',
        desc: 'Hinged at the top and opens outward from the bottom — allows ventilation even in light rain. Often paired with picture windows.',
        series: [
          { key:'regency', label:'Regency Series', tagline:'The Strength of the Heartland', img:'assets/images/heartland/CASE_regency.gif',
            desc:'Same proven Regency design as casement, with a special hinge that prevents sagging. Custom made to your exact window opening with maintenance-free u-PVC vinyl.',
            features:['Fusion Welded Corners — u-PVC vinyl construction','Special Hinge Design — easy cleaning','Anti-Sag System for lasting operation','Energy-Efficient Hollow Chamber Design','Custom Made to exact opening','ENERGY STAR Certified']}
        ]
      },
      'picture': {
        label: 'Picture Windows',
        desc: 'Fixed, non-opening windows for maximum light and unobstructed views. Available in special shapes: circle, half round, eyebrow, arch, triangle, and more.',
        series: [
          { key:'hartford', label:'Hartford Series', tagline:'Classic Design', img:'assets/images/heartland/PIC_regency.gif',
            desc:'Maintenance-free u-PVC vinyl with fusion-welded corners and energy-efficient multiple hollow chamber design. Available in a wide range of special shapes for unique architectural accents.',
            features:['Fusion Welded Corners — structural integrity','Multiple Hollow Chamber Design','Special Shapes — circle, half round, eyebrow, arch, triangle, trapezoid, pentagon, hexagon, octagon','Custom Made to exact opening','ENERGY STAR Certified']},
          { key:'regency', label:'Regency Series', tagline:'Performance & Style', img:'assets/images/heartland/PIC_regency.gif',
            desc:'Same high-performance construction as the Hartford with additional design flexibility. Custom made in standard and specialty shapes for any architectural application.',
            features:['Fusion Welded Corners — u-PVC vinyl','Energy-Efficient Hollow Chamber Design','Available in all special shapes','Custom Made to exact opening','ENERGY STAR Certified']},
          { key:'hampton', label:'Hampton Series', tagline:'Versatile Value', img:'assets/images/heartland/heartland-lg.png',
            desc:'Quality picture windows with maintenance-free u-PVC vinyl, fusion-welded corners, and hollow chamber design. Available in standard and specialty shapes.',
            features:['Fusion Welded Corners','Multiple Hollow Chamber Design','Available in special shapes','Custom Made to exact opening','ENERGY STAR Certified']}
        ],
        shapes: [
          { name:'Circle', img:'assets/images/heartland/shapes/circle.gif' },
          { name:'Half Round', img:'assets/images/heartland/shapes/half.gif' },
          { name:'Eyebrow', img:'assets/images/heartland/shapes/eyebrow.gif' },
          { name:'Quarter Arch', img:'assets/images/heartland/shapes/quarter.gif' },
          { name:'Triangle', img:'assets/images/heartland/shapes/triangle.gif' },
          { name:'Trapezoid', img:'assets/images/heartland/shapes/trapezoid.gif' },
          { name:'Pentagon', img:'assets/images/heartland/shapes/pentagon.gif' },
          { name:'Hexagon', img:'assets/images/heartland/shapes/hexagon.gif' },
          { name:'Octagon', img:'assets/images/heartland/shapes/octagon.gif' }
        ]
      },
      'bay-bow': {
        label: 'Bay & Bow Windows',
        desc: 'Project outward from your home to create space, light, and dimension. Oak (standard) or birch options for seat, head, and jamb. Available in 9°, 15° (standard), and 20° angles.',
        series: [
          { key:'bay', label:'Bay Window', tagline:'Space & Light', img:'assets/images/heartland/BAY_casement.gif', img2:'assets/images/heartland/BAY_doublehung.gif',
            desc:'Bay windows combine a large center picture window with angled side windows (casement or double hung) for ventilation and panoramic views. Available with oak or birch seat, head, and jamb.',
            features:['Fusion Welded Corners — u-PVC vinyl','Oak (standard) or Birch interior options','Available in 9°, 15° (standard), and 20° angles','Casement or Double Hung side windows','Multiple Hollow Chamber Design','ENERGY STAR Certified']},
          { key:'bow', label:'Bow Window', tagline:'Curved Elegance', img:'assets/images/heartland/BOW.gif',
            desc:'Bow windows create a graceful curved projection with 4 or more equal-sized window panels for a sweeping, panoramic view. Available with oak or birch interior.',
            features:['Fusion Welded Corners — u-PVC vinyl','Oak (standard) or Birch interior options','4+ equal panels for curved projection','Available in 9°, 15° (standard), and 20° angles','Multiple Hollow Chamber Design','ENERGY STAR Certified']}
        ]
      },
      'basement': {
        label: 'Basement Windows',
        desc: 'Keep your basement dry and draft-free. Custom made to fit the existing opening, with sashes that open into the house at 45° or 90° angles.',
        series: [
          { key:'basement', label:'Basement Series', tagline:'Dry & Draft-Free', img:'assets/images/heartland/basement.png',
            desc:'Custom-made basement windows with maintenance-free u-PVC vinyl, fusion-welded corners, and sashes that open inward at 45° or 90° for ventilation and egress.',
            features:['Fusion Welded Corners — u-PVC vinyl','Custom Made to exact opening','Opens inward at 45° or 90° angles','Multiple Hollow Chamber Design','Energy-Efficient construction','ENERGY STAR Certified']}
        ]
      }
    };

    var typeCards = document.querySelectorAll('.heartland__type-card');
    var detailType = document.getElementById('hDetailType');
    var detailDesc = document.getElementById('hDetailDesc');
    var tabsWrap = document.getElementById('hSeriesTabs');
    var seriesTitle = document.getElementById('hSeriesTitle');
    var seriesTagline = document.getElementById('hSeriesTagline');
    var seriesDesc = document.getElementById('hSeriesDesc');
    var seriesFeatures = document.getElementById('hSeriesFeatures');
    var seriesImg = document.getElementById('hSeriesImg');
    var seriesImg2 = document.getElementById('hSeriesImg2');
    var seriesImg2Wrap = document.getElementById('hSeriesImg2Wrap');
    var shapesWrap = document.getElementById('hShapes');

    if (!detailType || !typeCards.length) return;

    function featureHTML(text) {
      return '<div class="heartland__feature"><div class="heartland__feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg></div><div><strong>' + text.split(' — ')[0] + '</strong>' + (text.indexOf(' — ') > -1 ? '<span>' + text.split(' — ')[1] + '</span>' : '') + '</div></div>';
    }

    function showSeries(s) {
      seriesTitle.textContent = s.label;
      seriesTagline.textContent = s.tagline;
      seriesDesc.textContent = s.desc;
      seriesFeatures.innerHTML = s.features.map(featureHTML).join('');
      seriesImg.src = s.img;
      seriesImg.alt = s.label + ' window diagram';
      if (s.img2 && seriesImg2Wrap) {
        seriesImg2.src = s.img2;
        seriesImg2.alt = s.label + ' — double hung configuration';
        seriesImg2Wrap.style.display = '';
      } else if (seriesImg2Wrap) {
        seriesImg2Wrap.style.display = 'none';
      }
    }

    function showType(typeKey) {
      var t = types[typeKey];
      if (!t) return;
      detailType.textContent = t.label;
      detailDesc.textContent = t.desc;

      tabsWrap.innerHTML = '';
      t.series.forEach(function(s, i) {
        var btn = document.createElement('button');
        btn.className = 'heartland__tab' + (i === 0 ? ' heartland__tab--active' : '');
        btn.textContent = s.label;
        btn.addEventListener('click', function() {
          tabsWrap.querySelectorAll('.heartland__tab').forEach(function(b) { b.classList.remove('heartland__tab--active'); });
          btn.classList.add('heartland__tab--active');
          showSeries(s);
        });
        tabsWrap.appendChild(btn);
      });

      showSeries(t.series[0]);

      if (t.shapes && shapesWrap) {
        shapesWrap.style.display = '';
        shapesWrap.innerHTML = '<h4 class="heartland__section-title" style="margin-top:32px">Special Shapes</h4>' +
          '<p class="heartland__section-sub">Custom-made specialty shapes for unique architectural accents.</p>' +
          '<div class="heartland__shapes-grid">' +
          t.shapes.map(function(sh) {
            return '<div class="heartland__shape-item"><img src="' + sh.img + '" alt="' + sh.name + ' window shape" loading="lazy"><span>' + sh.name + '</span></div>';
          }).join('') + '</div>';
      } else if (shapesWrap) {
        shapesWrap.style.display = 'none';
        shapesWrap.innerHTML = '';
      }
    }

    var cardsArr = Array.prototype.slice.call(typeCards);
    var currentIdx = 0;
    var dotsWrap = document.getElementById('hDots');
    var counterEl = document.getElementById('hSliderCount');
    var prevBtn = document.getElementById('hCarouselPrev');
    var nextBtn = document.getElementById('hCarouselNext');

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      cardsArr.forEach(function(_, i) {
        var dot = document.createElement('button');
        dot.className = 'heartland__dot' + (i === 0 ? ' heartland__dot--active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', function() { goTo(i); });
        dotsWrap.appendChild(dot);
      });
    }

    function updateSlider() {
      cardsArr.forEach(function(c, i) {
        c.classList.toggle('heartland__type-card--active', i === currentIdx);
      });
      if (dotsWrap) {
        var dots = dotsWrap.querySelectorAll('.heartland__dot');
        dots.forEach(function(d, i) {
          d.classList.toggle('heartland__dot--active', i === currentIdx);
        });
      }
      if (counterEl) {
        var n = String(currentIdx + 1);
        counterEl.innerHTML = '<strong>' + (n.length < 2 ? '0' + n : n) + '</strong> / ' + (cardsArr.length < 10 ? '0' : '') + cardsArr.length;
      }
      showType(cardsArr[currentIdx].dataset.type);
    }

    function goTo(idx) {
      currentIdx = (idx + cardsArr.length) % cardsArr.length;
      updateSlider();
    }

    buildDots();
    if (prevBtn) prevBtn.addEventListener('click', function() { goTo(currentIdx - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { goTo(currentIdx + 1); });

    updateSlider();
  })();

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq__item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
      btn.setAttribute('aria-expanded', !isOpen);
    });
  });

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
    var blur = 0;
    var target = 0;
    var accum = 0;
    var prevY = window.scrollY;
    var decayTimer = null;
    var raf = null;

    /* frost drives texture mask-size, blur drives backdrop blur separately */
    function applyFrost(fv, bv) {
      el.style.setProperty('--frost', fv);
      el.style.setProperty('--blur', bv);
      var pct = (fv * 110) + '%';
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

      if (blur < target) {
        blur = Math.min(blur + 0.03, target);
      } else if (blur > target) {
        blur = Math.max(blur - 0.015, target);
      }

      applyFrost(frost, blur);

      if (frost > 0.001 || blur > 0.001 || target > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        frost = 0;
        blur = 0;
        applyFrost(0, 0);
        raf = null;
      }
    }

    function startTick() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    /* Start with 0 spread */
    applyFrost(0, 0);

    window.addEventListener('scroll', function() {
      var nowY = window.scrollY;
      var delta = Math.abs(nowY - prevY);
      prevY = nowY;

      accum += delta * 0.0003;
      target = Math.min(accum, 0.4);

      clearTimeout(decayTimer);
      decayTimer = setTimeout(function() {
        target = 0;
        accum = 0;
      }, 700);

      startTick();
    }, { passive: true });
  })();
});
