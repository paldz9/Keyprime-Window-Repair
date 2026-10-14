document.addEventListener('DOMContentLoaded', function () {
  // Navbar scroll effect
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile nav toggle
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function () {
    links.classList.toggle('active');
    toggle.classList.toggle('active');
  });

  // Close mobile nav on link click
  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      links.classList.remove('active');
      toggle.classList.remove('active');
    });
  });

  // Snowfall effect
  var snowfall = document.getElementById('snowfall');
  function createSnowflake() {
    var flake = document.createElement('div');
    flake.className = 'snowflake';
    flake.textContent = '●';
    flake.style.left = Math.random() * 100 + '%';
    flake.style.fontSize = (Math.random() * 6 + 4) + 'px';
    flake.style.opacity = Math.random() * 0.4 + 0.1;
    flake.style.animationDuration = (Math.random() * 8 + 6) + 's';
    flake.style.animationDelay = (Math.random() * 5) + 's';
    snowfall.appendChild(flake);
    setTimeout(function () { flake.remove(); }, 16000);
  }

  for (var i = 0; i < 30; i++) {
    setTimeout(createSnowflake, i * 300);
  }
  setInterval(createSnowflake, 800);

  // Scroll reveal animation
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.service-card, .type-card, .testimonial-card, .step, .problem-item, .trust-item'
  ).forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Contact form handling
  var form = document.getElementById('contactForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var wrapper = document.querySelector('.contact-form-wrapper');
    wrapper.innerHTML =
      '<div class="contact-form form-success">' +
        '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
          '<circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/>' +
        '</svg>' +
        '<h3>Thank You!</h3>' +
        '<p>We\'ve received your request. A Keyprime window specialist will contact you within 24 hours to schedule your free inspection.</p>' +
        '<p style="margin-top: 16px; font-size: 0.9rem;">Need immediate help? Call us at <a href="tel:+19525223705" style="color: #c8102e; font-weight: 600;">(952) 522-3705</a></p>' +
      '</div>';

    wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

// Reveal animation class
document.head.insertAdjacentHTML('beforeend',
  '<style>.revealed { opacity: 1 !important; transform: translateY(0) !important; }</style>'
);
