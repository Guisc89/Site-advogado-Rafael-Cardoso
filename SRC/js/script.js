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

  const areaDialogTriggers = document.querySelectorAll('[data-area-dialog]');
  const areaDialogs = document.querySelectorAll('.area-dialog');
  let activeAreaTrigger = null;
  let areaDialogCloseTimer;

  const closeAreaDialog = (dialog) => {
    if (!dialog || !dialog.hasAttribute('open')) return;

    const triggerToRestore = activeAreaTrigger;
    const finishClosing = () => {
      dialog.classList.remove('is-closing');
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
      document.body.classList.remove('dialog-open');
      triggerToRestore?.setAttribute('aria-expanded', 'false');
      activeAreaTrigger = null;
      triggerToRestore?.focus();
    };

    window.clearTimeout(areaDialogCloseTimer);
    if (reducedMotion.matches) {
      finishClosing();
      return;
    }

    dialog.classList.add('is-closing');
    areaDialogCloseTimer = window.setTimeout(finishClosing, 180);
  };

  areaDialogTriggers.forEach((trigger) => {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', () => {
      const dialog = document.getElementById(trigger.dataset.areaDialog);
      if (!dialog) return;

      activeAreaTrigger = trigger;
      trigger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('dialog-open');
      dialog.classList.remove('is-closing');

      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    });
  });

  areaDialogs.forEach((dialog) => {
    dialog.querySelector('[data-dialog-close]')?.addEventListener('click', () => closeAreaDialog(dialog));

    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeAreaDialog(dialog);
    });

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeAreaDialog(dialog);
    });
  });

  const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
  whatsappLinks.forEach((link) => {
    link.setAttribute('aria-label', 'Falar no WhatsApp');
  });

  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.noValidate = true;
  const fields = [...form.querySelectorAll('input, textarea')];
  const status = form.querySelector('.form-status');
  const submitButton = form.querySelector('button[type="submit"]');

  const validate = (field) => {
    let error = '';
    if (!field.value.trim()) {
      error = 'Preencha este campo.';
    } else if (field.name === 'email' && field.validity.typeMismatch) {
      error = 'Informe um e-mail válido, como voce@exemplo.com.';
    } else if (field.name === 'phone' && (!/^[+\d\s().-]+$/.test(field.value) || !/^\d{10,15}$/.test(field.value.replace(/\D/g, '')))) {
      error = 'Informe um telefone válido, incluindo o DDD.';
    }
    field.setAttribute('aria-invalid', String(Boolean(error)));
    document.getElementById(`${field.name}-error`).textContent = error;
    return !error;
  };

  fields.forEach((field) => {
    field.addEventListener('blur', () => validate(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validate(field);
      status.textContent = '';
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitButton.disabled) return;
    const valid = fields.map(validate).every(Boolean);
    status.dataset.state = 'error';
    if (!valid) {
      status.textContent = 'Revise os campos indicados antes de enviar.';
      fields.find((field) => field.getAttribute('aria-invalid') === 'true').focus();
      return;
    }

    const endpoint = form.dataset.endpoint.trim();
    if (!endpoint) {
      status.textContent = 'O envio pelo formulário ainda não está disponível. Seus dados foram mantidos; tente novamente mais tarde.';
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando…';
    form.setAttribute('aria-busy', 'true');
    status.textContent = '';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(fields.map((field) => [field.name, field.value.trim()]))),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Submission failed');
      form.reset();
      fields.forEach((field) => field.removeAttribute('aria-invalid'));
      status.dataset.state = 'success';
      status.textContent = 'Mensagem enviada. Obrigado pelo contato!';
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'Não foi possível confirmar o envio. Seus dados foram mantidos. Tente novamente em instantes.';
    } finally {
      clearTimeout(timeout);
      submitButton.disabled = false;
      submitButton.innerHTML = 'Enviar mensagem <span aria-hidden="true">→</span>';
      form.removeAttribute('aria-busy');
    }
  });
});
