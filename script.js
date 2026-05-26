// ══════════════════════════════════════════════════════════════
//  PARTICLES + MOUSE GLOW
// ══════════════════════════════════════════════════════════════
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let   particles = [];
const mouse = { x: null, y: null };

function initCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = [];
  const count = Math.min(80, Math.floor(window.innerWidth / 16));
  for (let i = 0; i < count; i++) {
    particles.push({
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      size:   Math.random() * 1.8 + 0.4,
      vx:     (Math.random() - 0.5) * 0.4,
      vy:     (Math.random() - 0.5) * 0.4,
      color:  Math.random() > 0.5 ? '#00F0FF' : '#BC13FE',
    });
  }
}

window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('resize',    initCanvas);

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    if (mouse.x && mouse.y) {
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 180) { p.x += dx * 0.008; p.y += dy * 0.008; }
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.18;
    ctx.fill();
  });

  // Draw connecting lines between close particles
  ctx.globalAlpha = 0.04;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  // Mouse glow
  if (mouse.x && mouse.y) {
    const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 160);
    g.addColorStop(0, 'rgba(0,240,255,0.04)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  requestAnimationFrame(animateParticles);
}

initCanvas();
animateParticles();

// ══════════════════════════════════════════════════════════════
//  TYPING EFFECT
// ══════════════════════════════════════════════════════════════
const target  = document.getElementById('typing-target');
const texts   = ['Christian González', 'Mobile Developer', 'Flutter Specialist', 'Game Developer'];
let tIdx = 0, cIdx = 0, deleting = false;

function type() {
  const current = texts[tIdx];
  if (!deleting) {
    target.textContent = current.slice(0, ++cIdx);
    if (cIdx === current.length) {
      if (tIdx === 0) return; // keep first text, just add cursor
      setTimeout(() => { deleting = true; type(); }, 2200);
      return;
    }
  } else {
    target.textContent = current.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      tIdx = (tIdx + 1) % texts.length;
      setTimeout(type, 400);
      return;
    }
  }
  setTimeout(type, deleting ? 38 : 75);
}

setTimeout(type, 600);

// ══════════════════════════════════════════════════════════════
//  INTERSECTION OBSERVER — reveals & skill bars
// ══════════════════════════════════════════════════════════════
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('active');
    entry.target.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.width = bar.dataset.w + '%';
    });
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ══════════════════════════════════════════════════════════════
//  COUNTER ANIMATION
// ══════════════════════════════════════════════════════════════
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-n').forEach(el => {
      const target = +el.dataset.target;
      let current = 0;
      const step = target / 60;
      const id = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current);
        if (current >= target) clearInterval(id);
      }, 16);
    });
    counterObs.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(el => counterObs.observe(el));

// ══════════════════════════════════════════════════════════════
//  NAVBAR SCROLL
// ══════════════════════════════════════════════════════════════
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Active link highlight
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ══════════════════════════════════════════════════════════════
//  LANGUAGE TOGGLE
// ══════════════════════════════════════════════════════════════
let isEn = false;

function toggleLang() {
  isEn = !isEn;
  document.getElementById('lang-flag').textContent = isEn ? '🇪🇸' : '🇬🇧';
  document.getElementById('lang-code').textContent  = isEn ? 'ES' : 'EN';

  document.querySelectorAll('[data-es]').forEach(el => {
    el.textContent = isEn ? el.dataset.en : el.dataset.es;
  });
}
