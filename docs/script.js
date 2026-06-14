/* ═══════════════════════════════════════════════════
   DESTOPIAN PIRATE — Interface Controller v2
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
    '.pillar-card, .signal-item, .intel-card, .principle-card, .tech-card, .contact-card'
  );

  interactiveCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.3s ease';
    });
  });

  // ── Smooth Appear on Scroll ──
  const revealElements = document.querySelectorAll(
    '.pillar-card, .signal-item, .stat-cell, .ext-feature, ' +
    '.principle-card, .timeline-item, .intel-card, .tech-card, ' +
    '.contact-card, .faq-item, .step-item'
  );

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
  console.log('Theme Toggle script active. Button element found:', themeToggle);

  if (themeToggle) {
    let savedTheme = 'dark';
    try {
      savedTheme = localStorage.getItem('theme') || 'dark';
      console.log('Successfully loaded theme from localStorage:', savedTheme);
    } catch (e) {
      console.warn('localStorage is blocked or unavailable:', e);
    }

    if (savedTheme === 'light') {
      console.log('Applying saved light theme to html...');
      document.documentElement.classList.add('light-theme');
      updateThemeToggleText(true);
    }

    themeToggle.addEventListener('click', () => {
      console.log('Theme Toggle button clicked!');
      const isLight = document.documentElement.classList.toggle('light-theme');
      console.log('Toggled light-theme class on html. Current state isLight:', isLight);

      try {
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        console.log('Saved updated theme preference to localStorage.');
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
    console.log('Updating theme toggle labels. isLight:', isLight, 'label:', label, 'icon:', icon);
    if (isLight) {
      if (label) label.textContent = 'THEME // LIGHT';
      if (icon) icon.textContent = '☀';
    } else {
      if (label) label.textContent = 'THEME // DARK';
      if (icon) icon.textContent = '🌙';
    }
  }

})();
