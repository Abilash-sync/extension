/* ════════════════════════════════════════
   WanderWave – Travel Planner Script
════════════════════════════════════════ */

// ── STATE ──────────────────────────────
let trips      = JSON.parse(localStorage.getItem('ww_trips')      || '[]');
let itinerary  = JSON.parse(localStorage.getItem('ww_itinerary')  || '[]');
let packItems  = JSON.parse(localStorage.getItem('ww_pack')       || '[]');

// ── DESTINATIONS DATA ───────────────────
const destinations = [
  {
    name: 'Paris, France', badge: 'Trending',
    desc: 'The city of lights, art, cuisine, and timeless romance.',
    img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',
    rating: '4.9', price: 'From $899',
  },
  {
    name: 'Bali, Indonesia', badge: 'Hot',
    desc: 'Tropical paradise with lush rice terraces and sacred temples.',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    rating: '4.8', price: 'From $649',
  },
  {
    name: 'New York, USA', badge: 'Popular',
    desc: 'The city that never sleeps — skyscrapers, culture, and energy.',
    img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80',
    rating: '4.7', price: 'From $799',
  },
  {
    name: 'Tokyo, Japan', badge: 'Trending',
    desc: 'Where ancient traditions meet dazzling modern innovation.',
    img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
    rating: '4.9', price: 'From $1,099',
  },
  {
    name: 'Santorini, Greece', badge: 'Romantic',
    desc: 'Iconic blue-domed churches perched above the Aegean Sea.',
    img: 'https://images.unsplash.com/photo-1507501336603-6e31db2be093?w=600&q=80',
    rating: '4.8', price: 'From $949',
  },
  {
    name: 'Safari, Kenya', badge: 'Adventure',
    desc: 'Witness the great migration across the Maasai Mara savannah.',
    img: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80',
    rating: '4.7', price: 'From $1,299',
  },
  {
    name: 'Maldives', badge: 'Luxury',
    desc: 'Overwater bungalows, crystal lagoons, and absolute serenity.',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    rating: '5.0', price: 'From $1,499',
  },
  {
    name: 'Barcelona, Spain', badge: 'Cultural',
    desc: 'Gaudí architecture, vibrant tapas bars, and Mediterranean beaches.',
    img: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=600&q=80',
    rating: '4.8', price: 'From $749',
  },
];

// ── QUICK PACK ITEMS ────────────────────
const quickPackItems = [
  'Passport', 'Sunscreen', 'Adapter', 'Earbuds',
  'Power Bank', 'Camera', 'Medications', 'Snacks',
];

// ── INIT ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderDestinations();
  renderTrips();
  renderItinerary();
  renderPackItems();
  renderQuickTags();
  initHamburger();
  setMinDate();
});

// ── SCROLL HELPER ───────────────────────
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ── SET MIN DATE ────────────────────────
function setMinDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('tripStart').setAttribute('min', today);
  document.getElementById('tripEnd').setAttribute('min', today);
}

// ── DESTINATIONS ────────────────────────
function renderDestinations() {
  const grid = document.getElementById('destinationsGrid');
  grid.innerHTML = destinations.map(d => `
    <div class="dest-card" onclick="addDestToTrip('${d.name}')">
      <div class="dest-card-img">
        <img src="${d.img}" alt="${d.name}" loading="lazy" />
        <div class="dest-badge">${d.badge}</div>
      </div>
      <div class="dest-card-body">
        <h3><i class="fa-solid fa-location-dot" style="color:var(--red);font-size:.85rem"></i> ${d.name}</h3>
        <p>${d.desc}</p>
        <div class="dest-meta">
          <span class="dest-rating"><i class="fa-solid fa-star"></i> ${d.rating}</span>
          <span class="dest-price">${d.price}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function addDestToTrip(name) {
  document.getElementById('tripDest').value = name;
  scrollToSection('planner');
  showToast(`<i class="fa-solid fa-location-dot"></i> "${name}" added to planner!`);
}

function searchDestination() {
  const val = document.getElementById('heroSearch').value.trim().toLowerCase();
  if (!val) { scrollToSection('destinations'); return; }
  const match = destinations.find(d => d.name.toLowerCase().includes(val));
  if (match) {
    document.getElementById('tripDest').value = match.name;
    scrollToSection('planner');
    showToast(`<i class="fa-solid fa-magnifying-glass"></i> "${match.name}" found!`);
  } else {
    document.getElementById('tripDest').value = document.getElementById('heroSearch').value.trim();
    scrollToSection('planner');
    showToast(`<i class="fa-solid fa-map-pin"></i> Destination set to planner!`);
  }
}

// ── TRIPS ───────────────────────────────
function addTrip() {
  const dest   = document.getElementById('tripDest').value.trim();
  const start  = document.getElementById('tripStart').value;
  const end    = document.getElementById('tripEnd').value;
  const budget = document.getElementById('tripBudget').value;
  const notes  = document.getElementById('tripNotes').value.trim();

  if (!dest) { showToast('<i class="fa-solid fa-triangle-exclamation"></i> Please enter a destination!'); return; }
  if (start && end && end < start) { showToast('<i class="fa-solid fa-triangle-exclamation"></i> End date must be after start date!'); return; }

  const trip = { id: Date.now(), dest, start, end, budget, notes };
  trips.unshift(trip);
  saveTrips();
  renderTrips();

  // Clear form
  ['tripDest','tripStart','tripEnd','tripBudget','tripNotes'].forEach(id => { document.getElementById(id).value = ''; });
  showToast(`<i class="fa-solid fa-plane-departure"></i> Trip to "${dest}" added!`);
}

function deleteTrip(id) {
  trips = trips.filter(t => t.id !== id);
  saveTrips();
  renderTrips();
  showToast('<i class="fa-solid fa-trash"></i> Trip removed.');
}

function saveTrips() { localStorage.setItem('ww_trips', JSON.stringify(trips)); }

function renderTrips() {
  const list  = document.getElementById('tripsList');
  const empty = document.getElementById('emptyState');
  if (trips.length === 0) {
    list.innerHTML = '';
    list.appendChild(empty);
    empty.style.display = 'block';
    return;
  }
  list.innerHTML = trips.map(t => {
    const nights = (t.start && t.end)
      ? Math.max(0, Math.round((new Date(t.end) - new Date(t.start)) / 86400000))
      : null;
    return `
      <div class="trip-card">
        <div class="trip-card-header">
          <h4><i class="fa-solid fa-location-dot"></i> ${t.dest}</h4>
          <button class="btn-danger" onclick="deleteTrip(${t.id})" title="Delete trip">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
        <div class="trip-card-meta">
          ${t.start ? `<span class="trip-meta-item"><i class="fa-regular fa-calendar"></i> ${formatDate(t.start)}</span>` : ''}
          ${t.end   ? `<span class="trip-meta-item"><i class="fa-regular fa-calendar-check"></i> ${formatDate(t.end)}</span>` : ''}
          ${nights !== null ? `<span class="trip-meta-item"><i class="fa-solid fa-moon"></i> ${nights} night${nights !== 1 ? 's' : ''}</span>` : ''}
          ${t.budget ? `<span class="trip-meta-item"><i class="fa-solid fa-dollar-sign"></i> $${Number(t.budget).toLocaleString()} budget</span>` : ''}
        </div>
        ${t.notes ? `<div class="trip-card-notes"><i class="fa-regular fa-note-sticky" style="color:var(--orange);margin-right:6px"></i>${t.notes}</div>` : ''}
      </div>
    `;
  }).join('');
}

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── ITINERARY ───────────────────────────
function addItinerary() {
  const day      = document.getElementById('iDay').value.trim();
  const activity = document.getElementById('iActivity').value.trim();
  const time     = document.getElementById('iTime').value;
  const note     = document.getElementById('iNote').value.trim();

  if (!day || !activity) {
    showToast('<i class="fa-solid fa-triangle-exclamation"></i> Day and activity are required!');
    return;
  }

  itinerary.push({ id: Date.now(), day: parseInt(day), activity, time, note });
  itinerary.sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
  localStorage.setItem('ww_itinerary', JSON.stringify(itinerary));
  renderItinerary();

  ['iDay','iActivity','iTime','iNote'].forEach(id => { document.getElementById(id).value = ''; });
  showToast(`<i class="fa-solid fa-calendar-check"></i> Day ${day} activity added!`);
}

function deleteItinerary(id) {
  itinerary = itinerary.filter(i => i.id !== id);
  localStorage.setItem('ww_itinerary', JSON.stringify(itinerary));
  renderItinerary();
}

function renderItinerary() {
  const list  = document.getElementById('itineraryList');
  const empty = document.getElementById('iEmpty');
  if (itinerary.length === 0) {
    list.innerHTML = '';
    list.appendChild(empty);
    empty.style.display = 'block';
    return;
  }
  list.innerHTML = itinerary.map((item, idx) => `
    <div class="timeline-item">
      <div class="timeline-dot">
        <div class="dot">D${item.day}</div>
        ${idx < itinerary.length - 1 ? '<div class="dot-line"></div>' : ''}
      </div>
      <div class="timeline-content">
        ${item.time ? `<div class="timeline-time"><i class="fa-regular fa-clock"></i> ${formatTime(item.time)}</div>` : ''}
        <h4>${item.activity}</h4>
        ${item.note ? `<p><i class="fa-solid fa-location-dot" style="color:var(--orange);margin-right:4px"></i>${item.note}</p>` : ''}
      </div>
      <button class="btn-danger" onclick="deleteItinerary(${item.id})" style="align-self:flex-start;margin-top:8px">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `).join('');
}

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hr  = parseInt(h);
  const ampm = hr >= 12 ? 'PM' : 'AM';
  return `${hr % 12 || 12}:${m} ${ampm}`;
}

// ── PACKING LIST ────────────────────────
function renderQuickTags() {
  const wrap = document.getElementById('quickTags');
  wrap.innerHTML = quickPackItems.map(item => `
    <button class="quick-tag" onclick="quickAdd('${item}')">${item}</button>
  `).join('');
}

function quickAdd(name) {
  document.getElementById('packItem').value = name;
  addPackItem();
}

function addPackItem() {
  const name = document.getElementById('packItem').value.trim();
  const cat  = document.getElementById('packCategory').value;
  if (!name) { showToast('<i class="fa-solid fa-triangle-exclamation"></i> Please enter an item name!'); return; }
  if (packItems.find(i => i.name.toLowerCase() === name.toLowerCase())) {
    showToast('<i class="fa-solid fa-circle-info"></i> Item already in list!'); return;
  }
  packItems.push({ id: Date.now(), name, cat, packed: false });
  localStorage.setItem('ww_pack', JSON.stringify(packItems));
  document.getElementById('packItem').value = '';
  renderPackItems();
  showToast(`<i class="fa-solid fa-suitcase"></i> "${name}" added to packing list!`);
}

function togglePack(id) {
  const item = packItems.find(i => i.id === id);
  if (item) item.packed = !item.packed;
  localStorage.setItem('ww_pack', JSON.stringify(packItems));
  renderPackItems();
}

function deletePack(id) {
  packItems = packItems.filter(i => i.id !== id);
  localStorage.setItem('ww_pack', JSON.stringify(packItems));
  renderPackItems();
}

function renderPackItems() {
  const list  = document.getElementById('packingList');
  const empty = document.getElementById('packEmpty');
  const packed = packItems.filter(i => i.packed).length;
  const total  = packItems.length;

  document.getElementById('packCount').textContent   = `${packed} / ${total} packed`;
  document.getElementById('packPercent').textContent = total ? `${Math.round((packed/total)*100)}%` : '0%';
  document.getElementById('progressFill').style.width = total ? `${(packed/total)*100}%` : '0%';

  if (total === 0) {
    list.innerHTML = '';
    list.appendChild(empty);
    empty.style.display = 'block';
    return;
  }

  // Sort: unchecked first
  const sorted = [...packItems].sort((a, b) => a.packed - b.packed);
  list.innerHTML = sorted.map(item => `
    <div class="pack-item ${item.packed ? 'packed' : ''}">
      <div class="pack-check ${item.packed ? 'checked' : ''}" onclick="togglePack(${item.id})"></div>
      <span class="pack-name">${item.name}</span>
      <span class="pack-cat-badge">${item.cat}</span>
      <button class="btn-danger" onclick="deletePack(${item.id})"><i class="fa-solid fa-xmark"></i></button>
    </div>
  `).join('');
}

// ── HAMBURGER ───────────────────────────
function initHamburger() {
  document.getElementById('hamburger').addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    if (links.style.display === 'flex') {
      links.style.display = 'none';
    } else {
      links.style.cssText = `
        display: flex; flex-direction: column; position: absolute;
        top: 68px; left: 0; right: 0; background: rgba(26,5,5,0.97);
        padding: 20px 5%; gap: 18px; z-index: 999; border-bottom: 1px solid rgba(249,115,22,0.2);
      `;
    }
  });
}

// ── TOAST ────────────────────────────────
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className   = 'toast';
  t.innerHTML   = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── HERO SEARCH on Enter ─────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('heroSearch')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchDestination();
  });
  document.getElementById('packItem')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') addPackItem();
  });
  document.getElementById('iActivity')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') addItinerary();
  });
});
