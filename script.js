/* ────────────────────────────────────────────────
   script.js  —  La Tavola Restaurant Demo
────────────────────────────────────────────────── */

// ── Navbar scroll effect ─────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── Smooth scroll helper ─────────────────────────
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

// ── Mobile menu ──────────────────────────────────
function toggleMenu() {
  const links = document.getElementById('nav-links');
  const hamburger = document.getElementById('hamburger');
  const isOpen = links.classList.toggle('open');
  hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

// Close menu on nav-link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('nav-links').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── Tab switching (Menu section) ─────────────────
function switchTab(btn, panelId) {
  // Deactivate all
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  // Activate current
  btn.classList.add('active');
  document.getElementById(panelId).classList.add('active');
}

// ── Animated counters (Stats bar) ────────────────
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = start;
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseFloat(el.dataset.target);
        animateCounter(el, target);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

// ── Scroll reveal ─────────────────────────────────
function initReveal() {
  const revealEls = document.querySelectorAll(
    '.about-grid, .menu-card, .gallery-item, .review-card, .contact-grid, .stat-item, .reservation-box'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}
initReveal();

// ── Menu cards stagger reveal ─────────────────────
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.menu-card');
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 100);
      });
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.menu-cards').forEach(grid => {
  grid.querySelectorAll('.menu-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  cardObserver.observe(grid);
});

// ── Reservation form ──────────────────────────────
// Set min date to today
const dateInput = document.getElementById('r-date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

function handleReservation(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  btn.textContent = 'Invio in corso...';
  btn.disabled = true;

  // Simulate async send
  setTimeout(() => {
    document.getElementById('reservation-form').style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  }, 1800);
}

// ── Active nav link on scroll ─────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.remove('active-nav');
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.classList.add('active-nav');
        }
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => activeObserver.observe(s));

// ── Lightbox Gallery ──────────────────────────────
const galleries = {
  sala: {
    images: [
      { src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop', alt: 'La Sala Principale' },
      { src: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop', alt: 'Atmosfera e Dettagli' },
      { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop', alt: 'La Cantina e Stile' }
    ],
    title: 'La Sala'
  },
  vongole: {
    images: [{ src: 'images/pasta.png', alt: 'Spaghetti alle Vongole' }],
    title: 'Spaghetti alle Vongole'
  },
  tiramisu: {
    images: [{ src: 'images/dessert.png', alt: 'Tiramisù della Casa' }],
    title: 'Tiramisù della Casa'
  },
  costata: {
    images: [{ src: 'images/steak.png', alt: 'Costata di Manzo' }],
    title: 'Costata di Manzo'
  }
};

let currentGallery = [];
let currentIndex = 0;

function openLightbox(galleryId) {
  const data = galleries[galleryId];
  if (!data) return;
  
  currentGallery = data.images;
  currentIndex = 0;
  
  const lightbox = document.getElementById('lightbox');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  
  updateLightboxImage();
  
  if (currentGallery.length > 1) {
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
  } else {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function changeImage(direction) {
  currentIndex += direction;
  if (currentIndex < 0) {
    currentIndex = currentGallery.length - 1;
  } else if (currentIndex >= currentGallery.length) {
    currentIndex = 0;
  }
  updateLightboxImage();
}

function updateLightboxImage() {
  const imgEL = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  
  const currentItem = currentGallery[currentIndex];
  imgEL.src = currentItem.src;
  imgEL.alt = currentItem.alt;
  
  if (currentGallery.length > 1) {
    captionEl.textContent = `${currentItem.alt} (${currentIndex + 1} di ${currentGallery.length})`;
  } else {
    captionEl.textContent = currentItem.alt;
  }
}

