/* ====================================================
   WanderPlan – script.js
   ==================================================== */

// ─── Destination Data ───────────────────────────────
const destinations = [
  { id:1,  name:"Paris",        country:"France 🇫🇷",        emoji:"🗼", region:"europe",  rating:"4.9", price:"From $1,200", badge:"Trending",  bg:"linear-gradient(135deg,#ffe4e4,#ffd0bb)" },
  { id:2,  name:"Bali",         country:"Indonesia 🇮🇩",     emoji:"🌴", region:"asia",    rating:"4.8", price:"From $800",   badge:"Popular",   bg:"linear-gradient(135deg,#ffe8cc,#ffe4e4)" },
  { id:3,  name:"Tokyo",        country:"Japan 🇯🇵",         emoji:"🏯", region:"asia",    rating:"4.9", price:"From $1,500", badge:"Top Pick",  bg:"linear-gradient(135deg,#ffd0bb,#ffe8cc)" },
  { id:4,  name:"New York",     country:"USA 🇺🇸",           emoji:"🗽", region:"america", rating:"4.7", price:"From $900",   badge:"Classic",   bg:"linear-gradient(135deg,#ffe4e4,#ffe8cc)" },
  { id:5,  name:"Sydney",       country:"Australia 🇦🇺",     emoji:"🦘", region:"oceania", rating:"4.8", price:"From $1,300", badge:"Popular",   bg:"linear-gradient(135deg,#ffd0bb,#ffe4e4)" },
  { id:6,  name:"Rome",         country:"Italy 🇮🇹",         emoji:"🏛",  region:"europe",  rating:"4.8", price:"From $1,000", badge:"Classic",   bg:"linear-gradient(135deg,#ffe8cc,#ffd0bb)" },
  { id:7,  name:"Machu Picchu", country:"Peru 🇵🇪",          emoji:"⛰",  region:"america", rating:"4.9", price:"From $1,100", badge:"Adventure", bg:"linear-gradient(135deg,#ffe4e4,#ffd0bb)" },
  { id:8,  name:"Santorini",    country:"Greece 🇬🇷",        emoji:"⛵", region:"europe",  rating:"4.9", price:"From $1,400", badge:"Romantic",  bg:"linear-gradient(135deg,#ffd0bb,#ffe8cc)" },
  { id:9,  name:"Dubai",        country:"UAE 🇦🇪",           emoji:"🌆", region:"asia",    rating:"4.7", price:"From $1,200", badge:"Luxury",    bg:"linear-gradient(135deg,#ffe8cc,#ffe4e4)" },
  { id:10, name:"Maldives",     country:"Maldives 🇲🇻",      emoji:"🏝", region:"asia",    rating:"5.0", price:"From $2,000", badge:"Paradise",  bg:"linear-gradient(135deg,#ffe4e4,#ffe8cc)" },
  { id:11, name:"Cape Town",    country:"South Africa 🇿🇦",  emoji:"🦁", region:"africa",  rating:"4.7", price:"From $1,000", badge:"Wild",      bg:"linear-gradient(135deg,#ffd0bb,#ffe4e4)" },
  { id:12, name:"Queenstown",   country:"New Zealand 🇳🇿",   emoji:"🎿", region:"oceania", rating:"4.8", price:"From $1,600", badge:"Adventure", bg:"linear-gradient(135deg,#ffe8cc,#ffd0bb)" },
];

// ─── Packing Presets ─────────────────────────────────
const presets = {
  essentials: [
    { name:"Passport / ID",         cat:"Documents" },
    { name:"Travel Insurance Docs", cat:"Documents" },
    { name:"Flight Tickets",        cat:"Documents" },
    { name:"Hotel Confirmation",    cat:"Documents" },
    { name:"Cash / Travel Card",    cat:"Documents" },
  ],
  clothes: [
    { name:"T-Shirts (×5)",         cat:"Clothing" },
    { name:"Pants / Shorts",        cat:"Clothing" },
    { name:"Underwear (×7)",        cat:"Clothing" },
    { name:"Socks (×7)",            cat:"Clothing" },
    { name:"Jacket / Sweater",      cat:"Clothing" },
    { name:"Comfortable Shoes",     cat:"Clothing" },
  ],
  toiletries: [
    { name:"Toothbrush & Toothpaste", cat:"Toiletries" },
    { name:"Shampoo & Conditioner",   cat:"Toiletries" },
    { name:"Deodorant",               cat:"Toiletries" },
    { name:"Razor",                   cat:"Toiletries" },
    { name:"Moisturizer",             cat:"Toiletries" },
  ],
  electronics: [
    { name:"Phone & Charger",         cat:"Electronics" },
    { name:"Power Bank",              cat:"Electronics" },
    { name:"Universal Adapter",       cat:"Electronics" },
    { name:"Laptop / Tablet",         cat:"Electronics" },
    { name:"Earphones",               cat:"Electronics" },
  ],
  beach: [
    { name:"Swimsuit",                cat:"Clothing" },
    { name:"Flip Flops",              cat:"Clothing" },
    { name:"Sunscreen SPF 50+",       cat:"Health" },
    { name:"Sunglasses",              cat:"General" },
    { name:"Beach Towel",             cat:"General" },
    { name:"After-Sun Lotion",        cat:"Health" },
  ],
};

// ─── App State ───────────────────────────────────────
let trips      = JSON.parse(localStorage.getItem('wp_trips')      || '[]');
let itinerary  = JSON.parse(localStorage.getItem('wp_itinerary')  || '[]');
let packItems  = JSON.parse(localStorage.getItem('wp_pack')       || '[]');
let expenses   = JSON.parse(localStorage.getItem('wp_expenses')   || '[]');
let totalBudgetAmt = parseFloat(localStorage.getItem('wp_budget') || '0');

// ─── On Load ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderDestinations(destinations);
  renderSavedTrips();
  renderItinerary();
  renderPackingList();
  renderExpenses();
  updateBudgetUI();

  // Set min dates for trip planner
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('tripStart').min = today;
  document.getElementById('tripEnd').min   = today;
});

// ─── Navbar scroll effect ─────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── Hamburger ───────────────────────────────────────
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

// ─── Toast ───────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── Hero Search ─────────────────────────────────────
function searchDestination() {
  const q = document.getElementById('heroSearch').value.trim().toLowerCase();
  if (!q) return;
  document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    const match = destinations.filter(d =>
      d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
    );
    renderDestinations(match.length ? match : destinations);
    if (!match.length) showToast(`No exact match for "${q}" — showing all destinations`);
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.filter-btn')[0].classList.add('active');
  }, 600);
}
document.getElementById('heroSearch').addEventListener('keypress', e => {
  if (e.key === 'Enter') searchDestination();
});

// ─── Destinations ────────────────────────────────────
function renderDestinations(list) {
  const grid = document.getElementById('destGrid');
  grid.innerHTML = '';
  if (!list.length) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1">No destinations found.</div>';
    return;
  }
  list.forEach((d, i) => {
    const card = document.createElement('div');
    card.className = 'dest-card fade-in';
    card.style.animationDelay = `${i * 0.06}s`;
    card.innerHTML = `
      <div class="dest-img" style="background:${d.bg}">
        <span>${d.emoji}</span>
        <span class="dest-badge">${d.badge}</span>
      </div>
      <div class="dest-body">
        <h3>${d.name}</h3>
        <p class="dest-country">📍 ${d.country}</p>
        <div class="dest-meta">
          <span class="dest-rating">⭐ ${d.rating}</span>
          <span class="dest-price">${d.price}</span>
        </div>
        <button class="dest-add-btn" onclick="addDestToTrip('${d.name}')">+ Plan This Trip</button>
      </div>`;
    grid.appendChild(card);
  });
}

function filterDest(btn, region) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const list = region === 'all' ? destinations : destinations.filter(d => d.region === region);
  renderDestinations(list);
}

function addDestToTrip(name) {
  document.getElementById('tripDest').value = name;
  document.getElementById('planner').scrollIntoView({ behavior: 'smooth' });
  showToast(`✈ "${name}" added to your trip planner!`);
}

// ─── Trip Planner ─────────────────────────────────────
function saveTrip() {
  const name      = document.getElementById('tripName').value.trim();
  const dest      = document.getElementById('tripDest').value.trim();
  const start     = document.getElementById('tripStart').value;
  const end       = document.getElementById('tripEnd').value;
  const travelers = document.getElementById('tripTravelers').value;
  const type      = document.getElementById('tripType').value;
  const notes     = document.getElementById('tripNotes').value.trim();

  if (!name || !dest || !start || !end) {
    showToast('⚠ Please fill in Trip Name, Destination, and Dates.');
    return;
  }
  if (end < start) {
    showToast('⚠ End date must be after start date.');
    return;
  }

  const days = Math.round((new Date(end) - new Date(start)) / 86400000);

  trips.push({
    id: Date.now(),
    name, dest, start, end,
    travelers: travelers || 1,
    type: type || 'General',
    notes,
    days,
  });
  localStorage.setItem('wp_trips', JSON.stringify(trips));
  renderSavedTrips();
  clearTripForm();
  showToast(`🎉 Trip "${name}" saved!`);
}

function clearTripForm() {
  ['tripName','tripDest','tripStart','tripEnd','tripTravelers','tripNotes'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('tripType').value = '';
}

function deleteTrip(id) {
  trips = trips.filter(t => t.id !== id);
  localStorage.setItem('wp_trips', JSON.stringify(trips));
  renderSavedTrips();
  showToast('🗑 Trip deleted.');
}

function renderSavedTrips() {
  const sec  = document.getElementById('savedTripsSection');
  const list = document.getElementById('tripsList');
  if (!trips.length) { sec.style.display = 'none'; return; }
  sec.style.display = 'block';
  list.innerHTML = '';
  trips.forEach(t => {
    const el = document.createElement('div');
    el.className = 'trip-item fade-in';
    el.innerHTML = `
      <div class="trip-item-info">
        <h4>✈ ${t.name} — ${t.dest}</h4>
        <p>📅 ${fmt(t.start)} → ${fmt(t.end)} (${t.days} day${t.days !== 1 ? 's' : ''})
           &nbsp;|&nbsp; 👥 ${t.travelers} traveler${t.travelers > 1 ? 's' : ''}
           &nbsp;|&nbsp; 🏷 ${t.type}
           ${t.notes ? `<br>📝 ${t.notes}` : ''}</p>
      </div>
      <button class="trip-delete-btn" onclick="deleteTrip(${t.id})" title="Delete trip">🗑</button>`;
    list.appendChild(el);
  });
}

function fmt(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}

// ─── Itinerary Builder ────────────────────────────────
function addItinerary() {
  const day      = document.getElementById('itiDay').value.trim();
  const activity = document.getElementById('itiActivity').value.trim();
  const time     = document.getElementById('itiTime').value.trim();
  const note     = document.getElementById('itiNote').value.trim();

  if (!day || !activity) {
    showToast('⚠ Please fill in Day and Activity.');
    return;
  }
  itinerary.push({ id: Date.now(), day, activity, time, note });
  localStorage.setItem('wp_itinerary', JSON.stringify(itinerary));
  ['itiDay','itiActivity','itiTime','itiNote'].forEach(id => document.getElementById(id).value = '');
  renderItinerary();
  showToast('📅 Activity added to itinerary!');
}

function deleteItinerary(id) {
  itinerary = itinerary.filter(i => i.id !== id);
  localStorage.setItem('wp_itinerary', JSON.stringify(itinerary));
  renderItinerary();
}

function renderItinerary() {
  const list = document.getElementById('itineraryList');
  if (!itinerary.length) {
    list.innerHTML = '<div class="empty-state">📅 No itinerary yet. Add your first activity above!</div>';
    return;
  }
  // Sort by day label
  const sorted = [...itinerary].sort((a,b) => a.day.localeCompare(b.day, undefined, {numeric:true}));
  list.innerHTML = '';
  sorted.forEach(item => {
    const el = document.createElement('div');
    el.className = 'iti-item fade-in';
    el.innerHTML = `
      <div class="iti-info">
        <div class="iti-day">${item.day}</div>
        <h4>${item.activity}</h4>
        <div class="iti-time-note">${item.time ? '🕐 ' + item.time : ''}${item.time && item.note ? ' — ' : ''}${item.note ? '📝 ' + item.note : ''}</div>
      </div>
      <button class="iti-delete" onclick="deleteItinerary(${item.id})" title="Remove">✕</button>`;
    list.appendChild(el);
  });
}

// ─── Packing List ─────────────────────────────────────
function addPreset(key) {
  const items = presets[key];
  if (!items) return;
  let added = 0;
  items.forEach(p => {
    if (!packItems.find(i => i.name === p.name)) {
      packItems.push({ id: Date.now() + Math.random(), name: p.name, cat: p.cat, checked: false });
      added++;
    }
  });
  localStorage.setItem('wp_pack', JSON.stringify(packItems));
  renderPackingList();
  showToast(`🎒 Added ${added} item${added !== 1 ? 's' : ''} from preset!`);
}

function addPackItem() {
  const name = document.getElementById('packItem').value.trim();
  const cat  = document.getElementById('packCategory').value;
  if (!name) { showToast('⚠ Please enter an item name.'); return; }
  packItems.push({ id: Date.now(), name, cat, checked: false });
  document.getElementById('packItem').value = '';
  localStorage.setItem('wp_pack', JSON.stringify(packItems));
  renderPackingList();
  showToast(`✅ "${name}" added to packing list!`);
}

function togglePack(id) {
  const item = packItems.find(i => i.id === id);
  if (item) item.checked = !item.checked;
  localStorage.setItem('wp_pack', JSON.stringify(packItems));
  renderPackingList();
}

function deletePack(id) {
  packItems = packItems.filter(i => i.id !== id);
  localStorage.setItem('wp_pack', JSON.stringify(packItems));
  renderPackingList();
}

function clearPacked() {
  packItems = packItems.filter(i => !i.checked);
  localStorage.setItem('wp_pack', JSON.stringify(packItems));
  renderPackingList();
  showToast('🗑 Packed items cleared!');
}

function renderPackingList() {
  const list    = document.getElementById('packingList');
  const count   = packItems.length;
  const done    = packItems.filter(i => i.checked).length;
  const pct     = count ? Math.round((done / count) * 100) : 0;

  document.getElementById('packCount').textContent   = `${count} item${count !== 1 ? 's' : ''}`;
  document.getElementById('packDone').textContent    = `${done} packed`;
  document.getElementById('packProgress').style.width = pct + '%';

  if (!count) {
    list.innerHTML = '<div class="empty-state">🎒 Start adding items to your packing list!</div>';
    return;
  }
  list.innerHTML = '';
  packItems.forEach(item => {
    const el = document.createElement('div');
    el.className = 'pack-item' + (item.checked ? ' checked' : '');
    el.innerHTML = `
      <input type="checkbox" class="pack-check" ${item.checked ? 'checked' : ''} onchange="togglePack(${item.id})" />
      <span class="pack-name">${item.name}</span>
      <span class="pack-cat">${item.cat}</span>
      <button class="pack-del" onclick="deletePack(${item.id})" title="Remove">✕</button>`;
    list.appendChild(el);
  });
}

// ─── Budget Tracker ───────────────────────────────────
function setBudget() {
  const val = parseFloat(document.getElementById('totalBudget').value);
  if (!val || val <= 0) { showToast('⚠ Please enter a valid budget.'); return; }
  totalBudgetAmt = val;
  localStorage.setItem('wp_budget', val);
  updateBudgetUI();
  showToast(`💰 Budget set to $${val.toLocaleString()}!`);
}

function addExpense() {
  const desc   = document.getElementById('expDesc').value.trim();
  const amount = parseFloat(document.getElementById('expAmount').value);
  const cat    = document.getElementById('expCategory').value;

  if (!desc || !amount || amount <= 0) { showToast('⚠ Please fill in description and amount.'); return; }

  expenses.push({ id: Date.now(), desc, amount, cat });
  document.getElementById('expDesc').value   = '';
  document.getElementById('expAmount').value = '';
  localStorage.setItem('wp_expenses', JSON.stringify(expenses));
  updateBudgetUI();
  renderExpenses();
  showToast(`💸 Expense "${ desc}" added!`);
}

function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  localStorage.setItem('wp_expenses', JSON.stringify(expenses));
  updateBudgetUI();
  renderExpenses();
}

function updateBudgetUI() {
  const spent = expenses.reduce((s, e) => s + e.amount, 0);
  const left  = totalBudgetAmt - spent;
  const pct   = totalBudgetAmt ? Math.min((spent / totalBudgetAmt) * 100, 100) : 0;

  document.getElementById('bTotal').textContent   = '$' + totalBudgetAmt.toLocaleString();
  document.getElementById('bSpent').textContent   = '$' + spent.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  document.getElementById('bLeft').textContent    = (left >= 0 ? '$' : '-$') + Math.abs(left).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  document.getElementById('budgetFill').style.width    = pct + '%';
  document.getElementById('budgetFill').style.background = pct > 90 ? 'linear-gradient(135deg,#b01010,#e02020)' : 'linear-gradient(135deg,#e02020,#ff8c42)';
  document.getElementById('budgetPercent').textContent = Math.round(pct) + '% used';
  if (totalBudgetAmt && spent > 0 && left < 0) showToast('⚠ Budget exceeded!');
}

function renderExpenses() {
  const list = document.getElementById('expenseList');
  if (!expenses.length) {
    list.innerHTML = '<div class="empty-state">💰 No expenses yet. Start tracking your spending!</div>';
    return;
  }
  list.innerHTML = '';
  [...expenses].reverse().forEach(exp => {
    const icon = exp.cat.split(' ')[0];
    const el = document.createElement('div');
    el.className = 'exp-item fade-in';
    el.innerHTML = `
      <span class="exp-cat-icon">${icon}</span>
      <div class="exp-info">
        <h4>${exp.desc}</h4>
        <span>${exp.cat}</span>
      </div>
      <span class="exp-amount">$${exp.amount.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
      <button class="exp-del" onclick="deleteExpense(${exp.id})" title="Remove">✕</button>`;
    list.appendChild(el);
  });
}
