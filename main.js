const WHATSAPP_BASE = "https://wa.me/51944266759?text=";
const FALLBACK_MESSAGE = "Hola, deseo una consulta legal. ¿Podemos agendar dentro del horario de atención? Estoy en Santa Anita.";

// Menú móvil
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  });
}

// Botones de consulta por área
const caseButtons = document.querySelectorAll('.whatsapp-case');
caseButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const caseType = button.dataset.case || 'consulta legal';
    const text = `Hola, deseo una consulta sobre ${caseType}. ¿Podemos agendar dentro del horario de atención? Estoy en Santa Anita.`;
    window.open(`${WHATSAPP_BASE}${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
});

// Slider automático de testimonios
const testimonials = document.querySelectorAll('.testimonial');
let currentTestimonial = 0;
if (testimonials.length > 0) {
  setInterval(() => {
    testimonials[currentTestimonial].classList.remove('active');
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    testimonials[currentTestimonial].classList.add('active');
  }, 4500);
}

// Filtro de artículos
const filterButtons = document.querySelectorAll('.filter-btn');
const blogCards = document.querySelectorAll('.blog-card');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;
    blogCards.forEach((card) => {
      const categories = card.dataset.category || '';
      const shouldShow = filter === 'all' || categories.includes(filter);
      card.classList.toggle('hidden', !shouldShow);
    });
  });
});

// Modal de blog
const modal = document.getElementById('blog-modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');
const readMoreButtons = document.querySelectorAll('.read-more');

readMoreButtons.forEach((button) => {
  button.addEventListener('click', () => {
    modalTitle.textContent = button.dataset.title || 'Artículo';
    modalContent.textContent = button.dataset.content || '';
    modal.showModal();
  });
});

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => modal.close());
}

if (modal) {
  modal.addEventListener('click', (event) => {
    const dialogDimensions = modal.getBoundingClientRect();
    const outsideDialog =
      event.clientX < dialogDimensions.left ||
      event.clientX > dialogDimensions.right ||
      event.clientY < dialogDimensions.top ||
      event.clientY > dialogDimensions.bottom;

    if (outsideDialog) modal.close();
  });
}

// FAQ acordeón
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach((question) => {
  question.addEventListener('click', () => {
    const item = question.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    faqQuestions.forEach((q) => {
      q.setAttribute('aria-expanded', 'false');
      q.closest('.faq-item').classList.remove('open');
    });

    if (!isOpen) {
      item.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});

// Formulario + mensaje prellenado dinámico
const contactForm = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

const buildWhatsappMessage = ({ nombre, tipoCaso, mensaje }) => {
  if (!nombre || !tipoCaso || !mensaje) {
    return FALLBACK_MESSAGE;
  }

  return `Hola, soy ${nombre}. Quiero una consulta sobre ${tipoCaso}. Mi situación es: ${mensaje}. ¿Podemos agendar dentro del horario de atención? (L–V 9am–12pm y 1pm–6pm, Sáb 9am–1pm). Dirección: Av. Los Ruiseñores N° 866, 2do Piso, Oficinas 59 y 60, Urb. Santa Anita.`;
};

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const nombre = (formData.get('nombre') || '').toString().trim();
    const telefono = (formData.get('telefono') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const tipoCaso = (formData.get('tipo-caso') || '').toString().trim();
    const mensaje = (formData.get('mensaje') || '').toString().trim();

    if (!nombre || !telefono || !email || !tipoCaso || !mensaje) {
      feedback.textContent = 'Completa todos los campos para enviar tu consulta personalizada.';
      feedback.className = 'form-feedback error';
      const text = buildWhatsappMessage({ nombre, tipoCaso, mensaje });
      window.open(`${WHATSAPP_BASE}${encodeURIComponent(text)}`, '_blank', 'noopener');
      return;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) {
      feedback.textContent = 'Ingresa un correo electrónico válido.';
      feedback.className = 'form-feedback error';
      return;
    }

    feedback.textContent = 'Redirigiendo a WhatsApp con tu consulta...';
    feedback.className = 'form-feedback success';

    const fullMessage = buildWhatsappMessage({ nombre, tipoCaso, mensaje });
    window.open(`${WHATSAPP_BASE}${encodeURIComponent(fullMessage)}`, '_blank', 'noopener');
    contactForm.reset();
  });
}

// Año dinámico
const yearElement = document.getElementById('current-year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
