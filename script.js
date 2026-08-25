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

  mobileBreakpoint.addEventListener('change', closeMenu);

  const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
  whatsappLinks.forEach((link) => {
    link.setAttribute('aria-label', 'Falar no WhatsApp');
  });
});
