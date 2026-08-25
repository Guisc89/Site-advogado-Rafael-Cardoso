document.addEventListener('DOMContentLoaded', () => {
  const siteHeader = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileBreakpoint = window.matchMedia('(max-width: 760px)');
  const navLinks = document.querySelectorAll('.main-nav a');

  const closeMenu = () => {
    siteHeader.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = siteHeader.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
      closeMenu();
    });
  });

  document.addEventListener('click', (event) => {
    if (siteHeader.classList.contains('menu-open') && !siteHeader.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteHeader.classList.contains('menu-open')) {
      closeMenu();
      menuToggle.focus();
    }
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionItems = document.querySelectorAll('.area-card, .step-item');
  let revealObserver;

  const setupMobileMotion = () => {
    if (revealObserver) {
      revealObserver.disconnect();
    }

    document.body.classList.remove('mobile-motion-ready');
    motionItems.forEach((item) => item.classList.remove('is-visible'));

    if (!mobileBreakpoint.matches || reducedMotion.matches || !('IntersectionObserver' in window)) {
      return;
    }

    document.body.classList.add('mobile-motion-ready');
    revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    motionItems.forEach((item) => revealObserver.observe(item));
  };

  mobileBreakpoint.addEventListener('change', () => {
    closeMenu();
    setupMobileMotion();
  });
  reducedMotion.addEventListener('change', setupMobileMotion);
  setupMobileMotion();

  const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
  whatsappLinks.forEach((link) => {
    link.setAttribute('aria-label', 'Falar no WhatsApp');
  });
});
