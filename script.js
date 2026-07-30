/* =============================================
   WANDERWAVE – script.js
   ============================================= */

/* ── Destination Data ── */
const destinations = [
  { name: "Paris", country: "France", category: "europe", emoji: "🗼", price: "From $799", rating: "⭐ 4.9", color: "#D62828", img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&q=80" },
  { name: "Bali", country: "Indonesia", category: "asia", emoji: "🌴", price: "From $649", rating: "⭐ 4.8", color: "#F77F00", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80" },
  { name: "New York", country: "USA", category: "americas", emoji: "🗽", price: "From $899", rating: "⭐ 4.7", color: "#E85D04", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80" },
  { name: "Tokyo", country: "Japan", category: "asia", emoji: "⛩️", price: "From $1,099", rating: "⭐ 4.9", color: "#D62828", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80" },
  { name: "Santorini", country: "Greece", category: "europe", emoji: "🏛️", price: "From $999", rating: "⭐ 4.8", color: "#F77F00", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80" },
  { name: "Marrakech", country: "Morocco", category: "africa", emoji: "🕌", price: "From $549", rating: "⭐ 4.6", color: "#E85D04", img: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&q=80" },
  { name: "Machu Picchu", country: "Peru", category: "americas", emoji: "🏔️", price: "From $1,199", rating: "⭐ 5.0", color: "#D62828", img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80" },
  { name: "Dubai", country: "UAE", category: "asia", emoji: "🏙️", price: "From $849", rating: "⭐ 4.7", color: "#F77F00", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80" },
];

let visibleDestinations = destinations;
let itinerary = {};

/* ── Render Destinations ── */
function renderDestinations(list) {
  const grid = document.getElementById('destinationsGrid');
  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML = `<p style="text-align:center;color:var(--gray);grid-column:1/-1;padding:40px">No destinations found for this region.</p>`;
    return;
  }

  list.forEach((dest, i) => {
    const card = document.createElement('div');
    card.className = 'dest-card';
    card.style.animationDelay = `${i * 0.08}s`;
    card.innerHTML = `
      <img class="dest-card-img" src="${dest.img}" alt="${dest.name}" loading="lazy" onerror="this.src='https://placehold.co/600x400/${dest.color.replace('#','')}/fff?text=${dest.name}'"/>
      <div class="dest-card-overlay"></div>
      <div class="dest-card-emoji">${dest.emoji}</div>
      <div class="dest-card-body">
        <h3>${dest.name}</h3>
        <div class="dest-meta">
          <span class="dest-country">📍 ${dest.country}</span>
          <span class="dest-price">${dest.price}</span>
        </div>
        <div class="dest-rating">${dest.rating} · Highly rated</div>
      </div>
    `;
    card.addEventListener('click', () => openDestination(dest));
    grid.appendChild(card);
  });
}

function filterDestinations(category, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  visibleDestinations = category === 'all' ? destinations : destinations.filter(d => d.category === category);
  renderDestinations(visibleDestinations);
}

function loadMoreDestinations() {
  showToast('🌍 Loading all 500+ destinations...');
}

function openDestination(dest) {
  showToast(`✈️ Exploring ${dest.name}, ${dest.country}...`);
}

/* ── Search ── */
function handleSearch() {
  const dest = document.getElementById('destInput').value.trim();
  const depart = document.getElementById('departDate').value;
  const ret = document.getElementById('returnDate').value;

  if (!dest) { showToast('⚠️ Please enter a destination!'); return; }
  if (!depart) { showToast('⚠️ Please choose a departure date!'); return; }

  showToast(`🔍 Searching trips to ${dest}...`);
  setTimeout(() => {
    document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
    showToast(`🎉 Found ${Math.floor(Math.random() * 20) + 5} trips to ${dest}!`);
  }, 1200);
}

/* ── Itinerary Planner ── */
function addActivity() {
  const day = document.getElementById('actDay').value;
  const time = document.getElementById('actTime').value;
  const name = document.getElementById('actName').value.trim();
  const category = document.getElementById('actCategory').value;
  const notes = document.getElementById('actNotes').value.trim();

  if (!name) { showToast('⚠️ Please enter an activity name!'); return; }

  if (!itinerary[day]) itinerary[day] = [];
  itinerary[day].push({ time, name, category, notes, id: Date.now() });
  itinerary[day].sort((a, b) => a.time.localeCompare(b.time));

  document.getElementById('actName').value = '';
  document.getElementById('actNotes').value = '';

  renderItinerary();
  showToast(`✅ Added "${name}" to ${day}!`);
}

function deleteActivity(day, id) {
  itinerary[day] = itinerary[day].filter(item => item.id !== id);
  if (itinerary[day].length === 0) delete itinerary[day];
  renderItinerary();
  showToast('🗑️ Activity removed.');
}

function renderItinerary() {
  const container = document.getElementById('plannerTimeline');
  const days = Object.keys(itinerary).sort((a, b) => {
    return parseInt(a.replace('Day ', '')) - parseInt(b.replace('Day ', ''));
  });

  if (days.length === 0) {
    container.innerHTML = `
      <div class="timeline-placeholder">
        <span>📋</span>
        <p>Your itinerary will appear here.<br/>Start adding activities!</p>
      </div>`;
    return;
  }

  container.innerHTML = days.map(day => `
    <div class="day-group">
      <div class="day-group-header">
        <span class="day-label">${day}</span>
        <div class="day-line"></div>
      </div>
      ${itinerary[day].map(item => `
        <div class="timeline-item">
          <span class="item-time">${formatTime(item.time)}</span>
          <div class="item-body">
            <div class="item-name">${item.category} ${item.name}</div>
            ${item.notes ? `<div class="item-notes">${item.notes}</div>` : ''}
          </div>
          <button class="item-delete" onclick="deleteActivity('${day}', ${item.id})" title="Remove">✕</button>
        </div>
      `).join('')}
    </div>
  `).join('');
}

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  return `${hour > 12 ? hour - 12 : hour || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

/* ── Packages ── */
function selectPackage(name) {
  showToast(`🎒 You selected the ${name} package! Redirecting...`);
  setTimeout(() => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  }, 1200);
}

/* ── Newsletter ── */
function handleSubscribe(e) {
  e.preventDefault();
  const email = e.target.querySelector('input').value;
  e.target.reset();
  showToast(`🎉 Subscribed! Welcome aboard, ${email.split('@')[0]}!`);
}

/* ── Toast ── */
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── Navbar Scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── Hamburger Menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const open = navLinks.classList.contains('open');
  hamburger.children[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  hamburger.children[1].style.opacity   = open ? '0' : '1';
  hamburger.children[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.children[0].style.transform = '';
    hamburger.children[1].style.opacity   = '1';
    hamburger.children[2].style.transform = '';
  });
});

/* ── Testimonial Dots ── */
function setupTestimonialDots() {
  const track  = document.getElementById('testimonialsTrack');
  const dotsEl = document.getElementById('testimonialDots');
  const cards  = track.querySelectorAll('.testimonial-card');
  const total  = cards.length;

  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => {
      cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    });
    dotsEl.appendChild(d);
  }

  track.addEventListener('scroll', () => {
    const scrollLeft = track.scrollLeft;
    const cardWidth  = cards[0].offsetWidth + 24;
    const index      = Math.round(scrollLeft / cardWidth);
    document.querySelectorAll('#testimonialDots .dot').forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  });
}

/* ── Scroll Animations ── */
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.dest-card, .feature-card, .package-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });
}

/* ── Counter Animation ── */
function animateCounters() {
  const stats = [
    { el: document.querySelectorAll('.stat h3')[0], target: 500, suffix: '+' },
    { el: document.querySelectorAll('.stat h3')[1], target: 12,  suffix: 'K+' },
    { el: document.querySelectorAll('.stat h3')[2], target: 98,  suffix: '%' },
    { el: document.querySelectorAll('.stat h3')[3], target: 24,  suffix: '/7' },
  ];

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      stats.forEach(s => {
        let current = 0;
        const step = Math.ceil(s.target / 60);
        const interval = setInterval(() => {
          current = Math.min(current + step, s.target);
          s.el.textContent = current + s.suffix;
          if (current >= s.target) clearInterval(interval);
        }, 20);
      });
      observer.disconnect();
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observer.observe(heroStats);
}

/* ── Set default dates ── */
function setDefaultDates() {
  const today = new Date();
  const next  = new Date(today);
  next.setDate(today.getDate() + 7);

  const fmt = d => d.toISOString().split('T')[0];
  const dep = document.getElementById('departDate');
  const ret = document.getElementById('returnDate');
  if (dep) dep.min = fmt(today);
  if (ret) { ret.min = fmt(today); ret.value = fmt(next); }
  if (dep) dep.value = fmt(today);
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  renderDestinations(destinations);
  setupTestimonialDots();
  setupScrollAnimations();
  animateCounters();
  setDefaultDates();
});
