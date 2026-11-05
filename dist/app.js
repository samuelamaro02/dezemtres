const program = [
  { time: '08h – 08h50', period: 'morning', title: 'Boas-vindas e credenciamento', text: 'O primeiro encontro. Chegue, conheça o espaço e comece suas conexões.', tag: 'RECEPÇÃO' },
  { time: '09h – 09h20', period: 'morning', title: 'Abertura do Experience', text: 'Boas-vindas dos sócios e apresentação do propósito do Dez em Três.', tag: 'ABERTURA' },
  { time: '09h30 – 11h', period: 'morning', title: 'Reconhecer. Celebrar. Experienciar.', text: 'Homenagens, premiações e momentos de reconhecimento da comunidade.', tag: 'EXPERIÊNCIA' },
  { time: '11h – 12h', period: 'morning', title: 'Pausa para o almoço', text: 'Um intervalo para recarregar e continuar as conversas.', tag: 'INTERVALO' },
  { time: '12h – 12h30', period: 'afternoon', title: 'Retorno e networking', text: 'Novas conexões antes dos conteúdos da tarde.', tag: 'CONEXÕES' },
  { time: '12h30 – 13h20', period: 'afternoon', title: 'Palestrante surpresa', text: 'Primeiro bloco de conteúdo da tarde. Revelação e tema em breve.', tag: 'PALESTRA 02', surprise: true },
  { time: '13h30 – 14h20', period: 'afternoon', title: 'Palestrante surpresa', text: 'Segundo bloco de conteúdo da tarde. Revelação e tema em breve.', tag: 'PALESTRA 03', surprise: true },
  { time: '14h30 – 15h20', period: 'afternoon', title: 'Palestrante surpresa', text: 'Terceiro bloco de conteúdo da tarde. Revelação e tema em breve.', tag: 'PALESTRA 04', surprise: true },
  { time: '15h30 – 16h', period: 'afternoon', title: 'Um café. Muitas possibilidades.', text: 'Coffee break, networking e conexões para levar além do evento.', tag: 'NETWORKING' },
  { time: '16h – 18h', period: 'afternoon', title: 'Programação a confirmar', text: 'O evento segue até as 18h. Os detalhes deste período serão divulgados pela organização.', tag: 'EM BREVE' },
];

const speakers = {
  regis: { name: 'Régis Neto', announcement: 'assets/regis-confirmado.png' },
  vinicius: { name: 'Vinícius de Morais', announcement: 'assets/vinicius-confirmado.png' },
  lucas: {
    name: 'Lucas Nicácio',
    announcement: 'assets/lucas-nicacio.png',
    imageAlt: 'Lucas Nicácio, um dos idealizadores do Dez em Três Experience',
    role: 'UM DOS IDEALIZADORES',
    description: 'Lucas Nicácio é um dos idealizadores do Dez em Três Experience, um encontro que conecta inteligência, equilíbrio e resultados em uma programação de conhecimento, reconhecimento e networking.',
  },
};

const agendaItems = document.querySelector('#agenda-items');
function renderProgram(period = 'all') {
  const entries = program.filter(item => period === 'all' || item.period === period);
  agendaItems.replaceChildren(...entries.map(item => {
    const article = document.createElement('article');
    article.className = 'agenda-item';
    const time = document.createElement('span');
    time.className = 'agenda-item-time';
    time.textContent = item.time;
    const content = document.createElement('div');
    const label = document.createElement('span');
    label.className = 'agenda-tag';
    label.textContent = item.tag;
    const heading = document.createElement('h3');
    heading.textContent = item.title;
    const description = document.createElement('p');
    description.textContent = item.text;
    content.append(label, heading, description);
    article.append(time, content);
    return article;
  }));
}
renderProgram();

document.querySelectorAll('[data-period]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-period]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    renderProgram(button.dataset.period);
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  mobileMenu.hidden = true;
}
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
  mobileMenu.hidden = expanded;
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});
window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);

const speakerDialog = document.querySelector('#speaker-dialog');
function openDialog(dialog) {
  closeMenu();
  dialog.showModal();
  document.body.classList.add('dialog-open');
}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
});
document.querySelectorAll('[data-speaker]').forEach(button => button.addEventListener('click', () => {
  const speaker = speakers[button.dataset.speaker];
  document.querySelector('#speaker-dialog-title').textContent = speaker.name;
  const image = document.querySelector('#speaker-announcement');
  image.src = speaker.announcement;
  image.alt = speaker.imageAlt || `Anúncio de ${speaker.name}, palestrante confirmado no Dez em Três Experience`;
  speakerDialog.querySelector('.eyebrow').textContent = speaker.role || 'PRESENÇA CONFIRMADA';
  speakerDialog.querySelector('.speaker-dialog-copy > p:not(.eyebrow)').textContent = speaker.description || 'No palco do Dez em Três Experience. Tema e horário da participação serão divulgados em breve.';
  openDialog(speakerDialog);
}));
document.querySelector('#speaker-agenda-link').addEventListener('click', () => speakerDialog.close());

const toast = document.querySelector('#toast');
let toastTimer;
function notify(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 4500);
}
function eventUrl() {
  return location.origin + location.pathname;
}
async function copyEventLink() {
  try {
    await navigator.clipboard.writeText(eventUrl());
    notify('Link do evento copiado!');
  } catch {
    notify('Copie o endereço do evento na barra do navegador.');
  }
}
document.querySelector('#share-event').addEventListener('click', async () => {
  if (!navigator.share) { await copyEventLink(); return; }
  try {
    await navigator.share({ title: 'Dez em Três Experience', text: 'Inteligência. Equilíbrio. Resultados. Conheça o Experience.', url: eventUrl() });
  } catch (error) {
    if (error.name !== 'AbortError') await copyEventLink();
  }
});

let periodBeforePrint = 'all';
window.addEventListener('beforeprint', () => {
  periodBeforePrint = document.querySelector('[data-period].active').dataset.period;
  renderProgram('all');
});
window.addEventListener('afterprint', () => renderProgram(periodBeforePrint));
document.querySelector('#print-agenda').addEventListener('click', () => window.print());

document.querySelector('#year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.desktop-nav a').forEach(link => {
        const active = link.hash === `#${entry.target.id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-20% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => navObserver.observe(section));
}

// Navegação manual do carrossel, compartilhada entre setas, teclado e toque.
const speakerCarousel = document.querySelector('#speaker-carousel');
const speakerPrevious = document.querySelector('#speaker-prev');
const speakerNext = document.querySelector('#speaker-next');
const speakerPosition = document.querySelector('#speaker-carousel-position');
const speakerSlides = [...speakerCarousel.querySelectorAll('.speaker-card')];
const carouselMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
function carouselStep() {
  return speakerSlides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(speakerCarousel).columnGap);
}
function updateSpeakerCarousel() {
  const maxScroll = Math.max(0, speakerCarousel.scrollWidth - speakerCarousel.clientWidth);
  speakerPrevious.disabled = speakerCarousel.scrollLeft <= 2;
  speakerNext.disabled = speakerCarousel.scrollLeft >= maxScroll - 2;
  const step = carouselStep();
  const visible = Math.max(1, Math.round(speakerCarousel.clientWidth / step));
  const first = Math.min(speakerSlides.length, Math.round(speakerCarousel.scrollLeft / step) + 1);
  const last = Math.min(speakerSlides.length, first + visible - 1);
  speakerPosition.textContent = first === last ? `${first} de ${speakerSlides.length}` : `${first}–${last} de ${speakerSlides.length}`;
}
function moveSpeakers(direction) {
  speakerCarousel.scrollBy({ left: direction * carouselStep(), behavior: carouselMotion() });
}
function jumpToSpeaker(index) {
  speakerCarousel.scrollTo({ left: index * carouselStep(), behavior: carouselMotion() });
}
speakerPrevious.addEventListener('click', () => moveSpeakers(-1));
speakerNext.addEventListener('click', () => moveSpeakers(1));
speakerCarousel.addEventListener('scroll', updateSpeakerCarousel, { passive: true });
speakerCarousel.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  if (event.key === 'Home') jumpToSpeaker(0);
  else if (event.key === 'End') jumpToSpeaker(speakerSlides.length - 1);
  else moveSpeakers(event.key === 'ArrowRight' ? 1 : -1);
});
new ResizeObserver(updateSpeakerCarousel).observe(speakerCarousel);
document.querySelector('#speaker-carousel-controls').hidden = false;
updateSpeakerCarousel();
