/* ═══════════════════════════════════════════════════
   DESTOPIAN PIRATE — Interface Controller v3
   Premium Effects · Parallax · Micro-Interactions
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Rain Effect ──
  const rainContainer = document.getElementById('rain');
  if (rainContainer) {
    for (let i = 0; i < 60; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.left = Math.random() * 100 + '%';
      drop.style.height = (20 + Math.random() * 40) + 'px';
      drop.style.animationDuration = (1.5 + Math.random() * 2) + 's';
      drop.style.animationDelay = Math.random() * 3 + 's';
      drop.style.opacity = (0.2 + Math.random() * 0.5).toString();
      rainContainer.appendChild(drop);
    }
  }

  // ── Tab Navigation ──
  const channelBtns = document.querySelectorAll('.ch-btn');
  const pageViews = document.querySelectorAll('.page-view');

  function navigateTo(pageId) {
    pageViews.forEach(p => p.classList.remove('active'));
    channelBtns.forEach(b => b.classList.remove('active'));

    const target = document.getElementById('page-' + pageId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    channelBtns.forEach(b => {
      if (b.dataset.page === pageId) b.classList.add('active');
    });

    // Close mobile menu
    const strip = document.getElementById('channel-strip');
    if (strip) strip.classList.remove('open');

    // Update URL hash
    history.replaceState(null, '', '#' + pageId);

    // Trigger counter animations if going to home
    if (pageId === 'home') {
      setTimeout(startCounters, 300);
      setTimeout(animateStatBars, 500);
    }

    // Re-trigger reveal animations for new page
    setTimeout(() => initRevealForPage(pageId), 100);
  }

  window.navigateTo = navigateTo;

  channelBtns.forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.page));
  });

  // Brand click → home
  const brandHome = document.getElementById('brand-home');
  if (brandHome) {
    brandHome.addEventListener('click', () => navigateTo('home'));
  }

  // Mobile toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const channelStrip = document.getElementById('channel-strip');
  if (mobileToggle && channelStrip) {
    mobileToggle.addEventListener('click', () => {
      channelStrip.classList.toggle('open');
    });
  }

  // Hash routing
  function handleHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById('page-' + hash)) {
      navigateTo(hash);
    }
  }
  window.addEventListener('hashchange', handleHash);
  if (window.location.hash) handleHash();

  // ── Animated Counters ──
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;

    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = parseFloat(counter.dataset.target);
      const duration = 1800;
      const startTime = performance.now();
      const isFloat = target % 1 !== 0;

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;

        if (isFloat) {
          counter.textContent = current.toFixed(2);
        } else {
          counter.textContent = Math.round(current);
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          if (isFloat) {
            counter.textContent = target.toFixed(2);
          } else {
            counter.textContent = target;
          }
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  function animateStatBars() {
    const bars = document.querySelectorAll('.stat-bar-fill');
    bars.forEach(bar => {
      const targetWidth = bar.dataset.width;
      if (targetWidth) {
        setTimeout(() => { bar.style.width = targetWidth; }, 100);
      }
    });
  }

  // Start counters on initial load if home is active
  const statsSection = document.querySelector('.stats-strip');
  if (window.IntersectionObserver && statsSection) {
    const homeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounters();
          animateStatBars();
          homeObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });

    homeObserver.observe(statsSection);
  } else if (statsSection) {
    startCounters();
    animateStatBars();
  }

  // ── FAQ Toggle ──
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-q').forEach(q => {
        q.classList.remove('open');
        q.nextElementSibling.classList.remove('open');
      });

      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    });
  });

  // ── Card Hover Micro-interactions ──
  const interactiveCards = document.querySelectorAll(
    '.pillar-card, .signal-item, .intel-card, .principle-card, .tech-card, .contact-card, ' +
    '.ss-hero-card, .ss-bento-card, .ss-stat-card, .vg-hero-card, .vg-platform-card'
  );

  interactiveCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.3s ease';
    });
  });

  // ── 3D Card Tilt Micro-interaction ──
  const tiltTargets = document.querySelectorAll(
    '.pillar-card, .ss-hero-card, .ss-bento-card, .vg-hero-card, .intel-card'
  );

  tiltTargets.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ── Parallax Scroll Handler ──
  const heroParallax = document.getElementById('hero-parallax');
  const ssParallax = document.getElementById('ss-parallax');
  const allParallaxBgs = document.querySelectorAll('.parallax-bg');

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  if (!prefersReducedMotion && !isMobile) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Hero parallax
          if (heroParallax) {
            heroParallax.style.transform = `translateY(${scrollY * 0.3}px)`;
          }

          // Section parallax backgrounds
          allParallaxBgs.forEach(bg => {
            const section = bg.parentElement;
            if (section) {
              const rect = section.getBoundingClientRect();
              if (rect.top < window.innerHeight && rect.bottom > 0) {
                const offset = (rect.top / window.innerHeight) * 80;
                bg.style.transform = `translateY(${offset}px)`;
              }
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ── Smooth Appear on Scroll ──
  const revealSelectors = [
    '.pillar-card', '.signal-item', '.stat-cell', '.ext-feature',
    '.principle-card', '.timeline-item', '.intel-card', '.tech-card',
    '.contact-card', '.faq-item', '.step-item',
    '.vg-hero-card', '.vg-platform-card', '.vg-enhancer-feature',
    '.ss-hero-card', '.ss-bento-card', '.ss-stat-card',
    '.bento-card'
  ];

  function initRevealForPage(pageId) {
    const page = document.getElementById('page-' + pageId);
    if (!page) return;

    const elements = page.querySelectorAll(revealSelectors.join(', '));
    if (!window.IntersectionObserver) {
      elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          entry.target.style.transition = `opacity 0.5s ease ${idx * 0.05}s, transform 0.5s ease ${idx * 0.05}s`;
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => {
      if (el.style.opacity === '1') return; // Already revealed
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      observer.observe(el);
    });
  }

  // Initial reveal for all visible pages
  const revealElements = document.querySelectorAll(revealSelectors.join(', '));

  if (window.IntersectionObserver) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          entry.target.style.transition = `opacity 0.5s ease ${idx * 0.05}s, transform 0.5s ease ${idx * 0.05}s`;
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // ── Theme Switcher ──
  const themeToggle = document.getElementById('theme-toggle');

  if (themeToggle) {
    let savedTheme = 'dark';
    try {
      savedTheme = localStorage.getItem('theme') || 'dark';
    } catch (e) {
      console.warn('localStorage is blocked or unavailable:', e);
    }

    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
      updateThemeToggleText(true);
    }

    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light-theme');

      try {
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
      } catch (e) {
        console.warn('Failed to save theme to localStorage:', e);
      }

      updateThemeToggleText(isLight);
    });
  }

  function updateThemeToggleText(isLight) {
    if (!themeToggle) return;
    const label = themeToggle.querySelector('.theme-label');
    const icon = themeToggle.querySelector('.theme-icon');
    if (isLight) {
      if (label) label.textContent = 'THEME // LIGHT';
      if (icon) icon.textContent = '☀';
    } else {
      if (label) label.textContent = 'THEME // DARK';
      if (icon) icon.textContent = '🌙';
    }
  }

})();
