// ═══════════════ PARTICLES ═══════════════
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const particles = [];
class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 1.8 + 0.4;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '79,156,249' : '124,58,237';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}
for (let i = 0; i < 60; i++) particles.push(new Particle());

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(79,156,249,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ═══════════════ NAVBAR SCROLL ═══════════════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ═══════════════ LANGUAGE SYSTEM ═══════════════
let isEnglish = localStorage.getItem('lang') === 'en';

function applyLanguage() {
  document.querySelectorAll('[data-es]').forEach(el => {
    el.textContent = isEnglish ? el.dataset.en : el.dataset.es;
  });
  const btn = document.getElementById('lang-btn');
  if (btn) btn.innerHTML = isEnglish
    ? '🇪🇸 <span>ES</span>'
    : '🇬🇧 <span>EN</span>';
  localStorage.setItem('lang', isEnglish ? 'en' : 'es');
}

function toggleLang() {
  isEnglish = !isEnglish;
  applyLanguage();
}

document.addEventListener('DOMContentLoaded', () => {
  applyLanguage();
  // Run counters after DOM ready
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObserver.observe(heroStats);
});

// ═══════════════ COUNTER ANIMATION ═══════════════
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ═══════════════ SCROLL ANIMATIONS ═══════════════
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (entry.target.classList.contains('fade-up')) entry.target.classList.add('visible');
    entry.target.querySelectorAll('.sk-fill').forEach(bar => { bar.style.width = bar.dataset.w + '%'; });
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.about, .skills, .projects, .download, .contact').forEach(s => {
  s.classList.add('fade-up');
  observer.observe(s);
});

// ═══════════════ STAGGERED CARD REVEAL ═══════════════
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 100);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.proj-card, .tech-card, .can-list li').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  cardObserver.observe(el);
});
