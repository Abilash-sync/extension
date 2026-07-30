/* ═══════════════════════════════════════════
   WANDERLUST – Travel Planner App Logic
═══════════════════════════════════════════ */

// ── DESTINATIONS DATA ──────────────────────
const destinations = [
  {
    id: 1, name: "Bali, Indonesia", category: "beach",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
    price: 1099, duration: "7 days", rating: 4.9, reviews: 2314,
    tags: ["Beach", "Culture", "Spa"]
  },
  {
    id: 2, name: "Santorini, Greece", category: "beach",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop",
    price: 1399, duration: "5 days", rating: 4.8, reviews: 1876,
    tags: ["Beach", "Romantic", "Wine"]
  },
  {
    id: 3, name: "Swiss Alps, Switzerland", category: "mountain",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    price: 1799, duration: "6 days", rating: 4.9, reviews: 1542,
    tags: ["Skiing", "Hiking", "Views"]
  },
  {
    id: 4, name: "Paris, France", category: "city",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
    price: 999, duration: "5 days", rating: 4.7, reviews: 3201,
    tags: ["Culture", "Cuisine", "Art"]
  },
  {
    id: 5, name: "Machu Picchu, Peru", category: "cultural",
    img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&h=400&fit=crop",
    price: 1299, duration: "8 days", rating: 4.9, reviews: 1123,
    tags: ["History", "Hiking", "Ruins"]
  },
  {
    id: 6, name: "Tokyo, Japan", category: "city",
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
    price: 1599, duration: "7 days", rating: 4.8, reviews: 2765,
    tags: ["Culture", "Food", "Tech"]
  },
  {
    id: 7, name: "Safari, Kenya", category: "cultural",
    img: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop",
    price: 2199, duration: "10 days", rating: 5.0, reviews: 876,
    tags: ["Wildlife", "Nature", "Adventure"]
  },
  {
    id: 8, name: "Patagonia, Argentina", category: "mountain",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    price: 1899, duration: "9 days", rating: 4.9, reviews: 654,
    tags: ["Glaciers", "Trekking", "Wild"]
  },
  {
    id: 9, name: "Maldives", category: "beach",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    price: 2499, duration: "6 days", rating: 5.0, reviews: 1988,
    tags: ["Luxury", "Snorkeling", "Overwater Bungalow"]
  }
];

// ── ITINERARY STORE ────────────────────────
let itinerary = JSON.parse(localStorage.getItem('wanderlust_itinerary') || '[]');
let carouselIndex = 0;
const CAROUSEL_VISIBLE = window.innerWidth > 768 ? (window.innerWidth > 1024 ? 3 : 2) : 1;

// ── INIT ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  renderDestinations('all');
  renderItinerary();
  initFilterTabs();
  initCounterAnimation();
  initBackToTop();
  updateCarouselVisible();
});

// ── NAVBAR ──────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      document.getElementById('backToTop').classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      document.getElementById('backToTop').classList.remove('visible');
    }
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close nav on link click (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // Smooth-scroll active link highlight
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        const active = navLinks.querySelector(`a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

// ── DESTINATIONS ────────────────────────────
function renderDestinations(filter) {
  const grid = document.getElementById('destinationsGrid');
  const filtered = filter === 'all' ? destinations : destinations.filter(d => d.category === filter);

  grid.innerHTML = filtered.map(d => `
    <div class="destination-card" data-id="${d.id}" data-filter="${d.category}">
      <div class="dest-img-wrap">
        <img src="${d.img}" alt="${d.name}" loading="lazy" />
        <span class="dest-category">${d.category}</span>
        <button class="dest-fav" onclick="toggleFav(event, ${d.id})" title="Save">
          <i class="fa${isFav(d.id) ? 's' : 'r'} fa-heart" style="${isFav(d.id) ? 'color:#dc2626' : ''}"></i>
        </button>
      </div>
      <div class="dest-info">
        <h3>${d.name}</h3>
        <div class="dest-meta">
          <span class="dest-rating">
            <i class="fas fa-star" style="color:#f59e0b"></i> ${d.rating}
            <span style="color:#9ca3af">(${d.reviews.toLocaleString()})</span>
          </span>
          <span><i class="fas fa-clock"></i> ${d.duration}</span>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
          ${d.tags.map(t => `<span style="font-size:.72rem;background:#fff0eb;color:#ea580c;padding:3px 10px;border-radius:50px;font-weight:600;">${t}</span>`).join('')}
        </div>
        <div class="dest-footer">
          <div class="dest-price">$${d.price.toLocaleString()} <small>/ person</small></div>
          <button class="btn-dest" onclick="quickAddToPlanner('${d.name}')">
            <i class="fas fa-plus"></i> Plan Trip
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Animate cards in
  requestAnimationFrame(() => {
    grid.querySelectorAll('.destination-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'all .4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 80);
    });
  });
}

function initFilterTabs() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDestinations(btn.dataset.filter);
    });
  });
}

// ── FAVORITES ───────────────────────────────
let favorites = JSON.parse(localStorage.getItem('wanderlust_favs') || '[]');

function isFav(id) { return favorites.includes(id); }

function toggleFav(event, id) {
  event.stopPropagation();
  const btn = event.currentTarget;
  if (isFav(id)) {
    favorites = favorites.filter(f => f !== id);
    btn.innerHTML = '<i class="far fa-heart"></i>';
    showToast('Removed from wishlist');
  } else {
    favorites.push(id);
    btn.innerHTML = '<i class="fas fa-heart" style="color:#dc2626"></i>';
    showToast('❤️ Added to wishlist!', 'success');
  }
  localStorage.setItem('wanderlust_favs', JSON.stringify(favorites));
}

// ── SEARCH ──────────────────────────────────
function handleSearch() {
  const dest = document.getElementById('searchDestination').value.trim();
  const date = document.getElementById('searchDate').value;
  const travelers = document.getElementById('searchTravelers').value;

  if (!dest) {
    showToast('Please enter a destination', 'error');
    document.getElementById('searchDestination').focus();
    return;
  }

  showToast(`🔍 Searching ${dest}${travelers ? ' · ' + travelers : ''}${date ? ' · ' + formatDate(date) : ''}…`, 'success');

  // Scroll to destinations and filter
  setTimeout(() => {
    document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
    const matched = destinations.find(d => d.name.toLowerCase().includes(dest.toLowerCase()));
    if (matched) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
      renderDestinations('all');
      setTimeout(() => {
        const card = document.querySelector(`[data-id="${matched.id}"]`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.style.boxShadow = '0 0 0 4px rgba(234,88,12,.5)';
          setTimeout(() => card.style.boxShadow = '', 2500);
        }
      }, 600);
    }
  }, 800);
}

// ── PLANNER / ITINERARY ─────────────────────
function addActivity() {
  const day         = parseInt(document.getElementById('actDay').value);
  const destination = document.getElementById('actDestination').value.trim();
  const activity    = document.getElementById('actActivity').value.trim();
  const time        = document.getElementById('actTime').value;
  const notes       = document.getElementById('actNotes').value.trim();
  const category    = document.getElementById('actCategory').value;

  if (!day || !destination || !activity) {
    showToast('Please fill in Day, Destination, and Activity', 'error');
    return;
  }

  const item = { id: Date.now(), day, destination, activity, time, notes, category };
  itinerary.push(item);
  itinerary.sort((a, b) => a.day - b.day || (a.time > b.time ? 1 : -1));
  saveItinerary();
  renderItinerary();
  clearPlannerForm();
  showToast('✅ Activity added to itinerary!', 'success');
}

function renderItinerary() {
  const list = document.getElementById('itineraryList');
  if (itinerary.length === 0) {
    list.innerHTML = `
      <div class="itinerary-empty">
        <i class="fas fa-suitcase-rolling"></i>
        <p>No activities yet. Start adding to your itinerary!</p>
      </div>`;
    return;
  }

  const categoryEmojis = {
    sightseeing: '🏛', food: '🍽', adventure: '🧗',
    transport: '✈', accommodation: '🏨', shopping: '🛍'
  };

  list.innerHTML = itinerary.map(item => `
    <div class="activity-item" id="act-${item.id}">
      <div class="activity-day">
        <small>DAY</small>
        <span>${item.day}</span>
      </div>
      <div class="activity-body">
        <strong>${item.activity}</strong>
        <p>${item.destination}</p>
        <div class="activity-meta">
          ${item.time ? `<span><i class="fas fa-clock"></i> ${formatTime(item.time)}</span>` : ''}
          <span>${categoryEmojis[item.category] || '📍'} ${item.category}</span>
          ${item.notes ? `<span><i class="fas fa-sticky-note"></i> ${item.notes.substring(0, 40)}${item.notes.length > 40 ? '…' : ''}</span>` : ''}
        </div>
      </div>
      <button class="activity-del" onclick="deleteActivity(${item.id})" title="Remove">
        <i class="fas fa-times-circle"></i>
      </button>
    </div>
  `).join('');
}

function deleteActivity(id) {
  const el = document.getElementById(`act-${id}`);
  if (el) {
    el.style.transition = 'all .3s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateX(20px)';
    setTimeout(() => {
      itinerary = itinerary.filter(i => i.id !== id);
      saveItinerary();
      renderItinerary();
    }, 300);
  }
}

function clearItinerary() {
  if (itinerary.length === 0) return;
  if (confirm('Clear your entire itinerary?')) {
    itinerary = [];
    saveItinerary();
    renderItinerary();
    showToast('Itinerary cleared', 'error');
  }
}

function printItinerary() {
  if (itinerary.length === 0) { showToast('No activities to print', 'error'); return; }
  const win = window.open('', '_blank');
  const rows = itinerary.map(i =>
    `<tr><td>Day ${i.day}</td><td>${i.destination}</td><td>${i.activity}</td><td>${i.time ? formatTime(i.time) : '–'}</td><td>${i.category}</td><td>${i.notes || '–'}</td></tr>`
  ).join('');

  win.document.write(`
    <html><head><title>My Wanderlust Itinerary</title>
    <style>
      body{font-family:Arial,sans-serif;padding:32px;color:#1a1a1a;}
      h1{color:#ea580c;margin-bottom:24px;}
      table{width:100%;border-collapse:collapse;}
      th{background:#ea580c;color:#fff;padding:10px 14px;text-align:left;}
      td{padding:10px 14px;border-bottom:1px solid #f0e4e2;}
      tr:nth-child(even){background:#fff7f5;}
    </style></head>
    <body>
      <h1>🗺 My Wanderlust Itinerary</h1>
      <p style="color:#6b7280;margin-bottom:20px;">Printed on ${new Date().toLocaleDateString('en-US', {weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      <table>
        <thead><tr><th>Day</th><th>Destination</th><th>Activity</th><th>Time</th><th>Category</th><th>Notes</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </body></html>
  `);
  win.document.close();
  win.print();
}

function saveItinerary() {
  localStorage.setItem('wanderlust_itinerary', JSON.stringify(itinerary));
}

function clearPlannerForm() {
  ['actDay','actDestination','actActivity','actTime','actNotes'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

function quickAddToPlanner(destination) {
  document.getElementById('actDestination').value = destination;
  document.getElementById('planner').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => document.getElementById('actActivity').focus(), 700);
  showToast(`📍 ${destination} added to planner`, 'success');
}

// ── TIPS ────────────────────────────────────
function toggleTip(card) {
  const more   = card.querySelector('.tip-more');
  const toggle = card.querySelector('.tip-toggle');
  const isOpen = card.classList.contains('open');

  card.classList.toggle('open');
  more.classList.toggle('hidden');
  toggle.innerHTML = isOpen
    ? 'Read more <i class="fas fa-chevron-down"></i>'
    : 'Show less <i class="fas fa-chevron-down"></i>';
}

// ── CAROUSEL ────────────────────────────────
function updateCarouselVisible() {
  window.addEventListener('resize', () => {
    carouselIndex = 0;
    moveCarousel(0);
  });
}

function moveCarousel(dir) {
  const track = document.getElementById('testimonialTrack');
  const cards  = track.querySelectorAll('.testimonial-card');
  const visible = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
  const max    = cards.length - visible;

  carouselIndex = Math.max(0, Math.min(carouselIndex + dir, max));
  const cardWidth = cards[0].offsetWidth + 24; // gap
  track.style.transform = `translateX(-${carouselIndex * cardWidth}px)`;
}

// ── NEWSLETTER ──────────────────────────────
function subscribeNewsletter() {
  const email = document.getElementById('newsletterEmail').value.trim();
  if (!email || !isValidEmail(email)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }
  document.getElementById('newsletterEmail').value = '';
  showToast('🎉 You\'re subscribed! Check your inbox.', 'success');
}

// ── CONTACT FORM ────────────────────────────
function submitContact(event) {
  event.preventDefault();
  showToast('✉️ Message sent! We\'ll get back to you shortly.', 'success');
  event.target.reset();
}

// ── COUNTER ANIMATION ───────────────────────
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

// ── BACK TO TOP ─────────────────────────────
function initBackToTop() {
  // handled in initNavbar scroll listener
}

// ── TOAST ────────────────────────────────────
let toastTimer;
function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = 'toast show' + (type ? ' ' + type : '');
  toastTimer = setTimeout(() => toast.className = 'toast', 3000);
}

// ── HELPERS ──────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour < 12 ? 'AM' : 'PM'}`;
}

// ── KEYBOARD SEARCH ──────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.activeElement.id === 'searchDestination') {
    handleSearch();
  }
});
