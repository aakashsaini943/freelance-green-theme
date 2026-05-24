/* =============================================
   GETRO CLEANING — SCRIPT.JS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Sticky Navbar ---- */
  const navbar = document.getElementById('navbar');
  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---- Mobile Menu ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---- Scroll Reveal ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // stagger siblings
        const siblings = Array.from(entry.target.parentElement.children).filter(c => c.classList.contains('reveal'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (idx * 0.1) + 's';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---- Animated Counters ---- */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = +el.dataset.target;
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  /* ---- Testimonials Slider ---- */
  const cards = document.querySelectorAll('.testi-card');
  const dots  = document.querySelectorAll('.testi-dot');
  let activeIdx = 0;

  function showSlide(idx) {
    cards.forEach(c => c.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    cards[idx].classList.add('active');
    dots[idx].classList.add('active');
    activeIdx = idx;
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => showSlide(+dot.dataset.idx));
  });

  // Auto-rotate
  setInterval(() => {
    showSlide((activeIdx + 1) % cards.length);
  }, 5000);

  /* ---- Smooth Scrolling for all anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  /* ---- Lazy Loading Images ---- */
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading already set via loading="lazy" attribute
  } else {
    const lazyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            lazyObserver.unobserve(img);
          }
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(img => lazyObserver.observe(img));
  }

  /* ---- Active Nav Highlight on Scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function highlightNav() {
    let scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        navAnchors.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + section.id) a.classList.add('active');
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ---- Parallax subtle on hero ---- */
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      hero.style.backgroundPositionY = `calc(50% + ${scrolled * 0.25}px)`;
    }, { passive: true });
  }

  /* ---- Toast helper ---- */
  window.showToast = function(msg, duration = 3500) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  };

  /* ---- Form Submissions ---- */
  window.handleFormSubmit = function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Appointment Booked!';
      btn.style.background = '#27ae60';
      showToast('✅ Appointment booked successfully! We\'ll contact you soon.');
      e.target.reset();
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1800);
  };

  window.handleNewsletter = function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const input = e.target.querySelector('input');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Subscribed!';
      showToast('🎉 Thank you for subscribing to our newsletter!');
      input.value = '';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
      }, 3000);
    }, 1200);
  };

  /* ---- Hover scale for service/team/blog cards ---- */
  // Already handled via CSS transitions — JS adds tilt effect on team cards
  document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---- Step cards sequential reveal delay ---- */
  document.querySelectorAll('.step-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.12) + 's';
  });

  document.querySelectorAll('.service-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.1) + 's';
  });

  document.querySelectorAll('.blog-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.1) + 's';
  });

  /* ---- Active nav link style injection ---- */
  const style = document.createElement('style');
  style.textContent = `.nav-links a.active { color: var(--green) !important; background: var(--green-light); }`;
  document.head.appendChild(style);

  console.log('🌿 Getro Cleaning Website — Initialized');
});
