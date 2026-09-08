document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.main-nav a');

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
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
