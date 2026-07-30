/* ═══════════════════════════════════════════════════
   WANDERWAVE – script.js
   ═══════════════════════════════════════════════════ */

/* ──────────────────────────────────────
   DATA
────────────────────────────────────── */
const destinations = [
  {
    id: 1, name: "Paris", country: "France 🇫🇷",
    region: "europe", price: "from $699",
    rating: "⭐ 4.9 (2.4k)", emoji: "🗼",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80"
  },
  {
    id: 2, name: "Bali", country: "Indonesia 🇮🇩",
    region: "asia", price: "from $549",
    rating: "⭐ 4.8 (3.1k)", emoji: "🌴",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80"
  },
  {
    id: 3, name: "New York", country: "USA 🇺🇸",
    region: "americas", price: "from $799",
    rating: "⭐ 4.7 (4.2k)", emoji: "🗽",
    img: "https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=600&q=80"
  },
  {
    id: 4, name: "Tokyo", country: "Japan 🇯🇵",
    region: "asia", price: "from $899",
    rating: "⭐ 4.9 (1.9k)", emoji: "🏯",
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80"
  },
  {
    id: 5, name: "Santorini", country: "Greece 🇬🇷",
    region: "europe", price: "from $749",
    rating: "⭐ 4.8 (2.0k)", emoji: "🏛️",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80"
  },
  {
    id: 6, name: "Marrakech", country: "Morocco 🇲🇦",
    region: "africa", price: "from $449",
    rating: "⭐ 4.6 (1.2k)", emoji: "🕌",
    img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80"
  },
  {
    id: 7, name: "Machu Picchu", country: "Peru 🇵🇪",
    region: "americas", price: "from $999",
    rating: "⭐ 4.9 (980)", emoji: "🏔️",
    img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80"
  },
  {
    id: 8, name: "Maldives", country: "Maldives 🇲🇻",
    region: "asia", price: "from $1299",
    rating: "⭐ 5.0 (765)", emoji: "🌊",
    img: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&q=80"
  },
  {
    id: 9, name: "Cape Town", country: "South Africa 🇿🇦",
    region: "africa", price: "from $599",
    rating: "⭐ 4.7 (1.4k)", emoji: "🦁",
    img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80"
  },
  {
    id: 10, name: "Rome", country: "Italy 🇮🇹",
    region: "europe", price: "from $649",
    rating: "⭐ 4.8 (3.3k)", emoji: "🏟️",
    img: "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=600&q=80"
  },
  {
    id: 11, name: "Rio de Janeiro", country: "Brazil 🇧🇷",
    region: "americas", price: "from $749",
    rating: "⭐ 4.6 (1.8k)", emoji: "🎭",
    img: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=80"
  },
  {
    id: 12, name: "Safari Kenya", country: "Kenya 🇰🇪",
    region: "africa", price: "from $1599",
    rating: "⭐ 5.0 (540)", emoji: "🐘",
    img: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=600&q=80"
  }
];

/* ──────────────────────────────────────
   STATE
────────────────────────────────────── */
let currentFilter = "all";
let itinerary = {};            // { "Day 1": [{...}], "Day 2": [...] }
let visibleCount = 8;

/* ──────────────────────────────────────
   INIT
────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  setMinDates();
  renderDestinations(currentFilter);
  setupTestimonialDots();
  setupNavScroll();
  setupHamburger();
});

/* ──────────────────────────────────────
   DATE HELPERS
────────────────────────────────────── */
function setMinDates() {
  const today = new Date().toISOString().split("T")[0];
  const depart = document.getElementById("departDate");
  const ret    = document.getElementById("returnDate");
  if (depart) {
    depart.min = today;
    depart.value = today;
    depart.addEventListener("change", () => { ret.min = depart.value; });
  }
  if (ret) ret.min = today;
}

/* ──────────────────────────────────────
   NAVBAR — scroll & hamburger
────────────────────────────────────── */
function setupNavScroll() {
  const nav = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 50);
  });
}

function setupHamburger() {
  const btn   = document.getElementById("hamburger");
  const links = document.getElementById("navLinks");
  if (!btn) return;
  btn.addEventListener("click", () => {
    links.classList.toggle("open");
    const spans = btn.querySelectorAll("span");
    if (links.classList.contains("open")) {
      spans[0].style.transform = "translateY(7px) rotate(45deg)";
      spans[1].style.opacity   = "0";
      spans[2].style.transform = "translateY(-7px) rotate(-45deg)";
    } else {
      spans[0].style.transform = "";
      spans[1].style.opacity   = "";
      spans[2].style.transform = "";
    }
  });
  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      btn.querySelectorAll("span").forEach(s => {
        s.style.transform = "";
        s.style.opacity   = "";
      });
    });
  });
}

/* ──────────────────────────────────────
   SEARCH
────────────────────────────────────── */
function handleSearch() {
  const dest   = document.getElementById("destInput").value.trim();
  const depart = document.getElementById("departDate").value;
  const ret    = document.getElementById("returnDate").value;

  if (!dest) {
    showToast("⚠️ Please enter a destination!");
    return;
  }
  if (ret && depart && ret < depart) {
    showToast("⚠️ Return date must be after departure.");
    return;
  }

  showToast(`🔍 Searching trips to ${dest}…`);
  setTimeout(() => {
    showToast(`✈️ Found 24 trips to ${dest}! Scroll to explore.`);
    document.getElementById("destinations").scrollIntoView({ behavior: "smooth" });
  }, 1800);
}

/* ──────────────────────────────────────
   DESTINATIONS
────────────────────────────────────── */
function filterDestinations(region, btn) {
  currentFilter = region;
  visibleCount  = 8;

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");

  renderDestinations(region);
}

function renderDestinations(filter) {
  const grid    = document.getElementById("destinationsGrid");
  const filtered = filter === "all"
    ? destinations
    : destinations.filter(d => d.region === filter);
  const slice   = filtered.slice(0, visibleCount);

  grid.innerHTML = "";
  if (slice.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--gray);padding:40px">No destinations found for this region yet.</p>`;
    return;
  }

  slice.forEach((d, i) => {
    const card = document.createElement("div");
    card.className = "dest-card";
    card.style.animationDelay = `${i * 60}ms`;
    card.style.animation = "fadeUp .5s ease both";
    card.innerHTML = `
      <img class="dest-card-img" src="${d.img}" alt="${d.name}" loading="lazy"/>
      <div class="dest-card-overlay"></div>
      <div class="dest-card-emoji">${d.emoji}</div>
      <div class="dest-card-body">
        <h3>${d.name}</h3>
        <p class="dest-rating">${d.rating}</p>
        <div class="dest-meta">
          <span class="dest-country">${d.country}</span>
          <span class="dest-price">${d.price}</span>
        </div>
      </div>
    `;
    card.addEventListener("click", () => bookDestination(d));
    grid.appendChild(card);
  });
}

function loadMoreDestinations() {
  visibleCount += 4;
  renderDestinations(currentFilter);
  showToast("🌍 More destinations loaded!");
}

function bookDestination(dest) {
  showToast(`🗺️ Exploring ${dest.name}… Adding to planner!`);
  setTimeout(() => {
    document.getElementById("actName").value = `Visit ${dest.name}`;
    document.getElementById("planner").scrollIntoView({ behavior: "smooth" });
  }, 800);
}

/* ──────────────────────────────────────
   ITINERARY PLANNER
────────────────────────────────────── */
function addActivity() {
  const day      = document.getElementById("actDay").value;
  const time     = document.getElementById("actTime").value;
  const name     = document.getElementById("actName").value.trim();
  const category = document.getElementById("actCategory").value;
  const notes    = document.getElementById("actNotes").value.trim();

  if (!name) {
    showToast("⚠️ Please enter an activity name.");
    return;
  }

  if (!itinerary[day]) itinerary[day] = [];

  itinerary[day].push({ time, name, category, notes, id: Date.now() });

  // Sort by time
  itinerary[day].sort((a, b) => a.time.localeCompare(b.time));

  // Clear fields
  document.getElementById("actName").value  = "";
  document.getElementById("actNotes").value = "";

  renderTimeline();
  showToast(`✅ "${name}" added to ${day}!`);
}

function deleteActivity(day, id) {
  itinerary[day] = itinerary[day].filter(a => a.id !== id);
  if (itinerary[day].length === 0) delete itinerary[day];
  renderTimeline();
  showToast("🗑️ Activity removed.");
}

function renderTimeline() {
  const container = document.getElementById("plannerTimeline");
  const days = Object.keys(itinerary).sort((a, b) => {
    return parseInt(a.replace("Day ", "")) - parseInt(b.replace("Day ", ""));
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
        <span class="day-label">📅 ${day}</span>
        <div class="day-line"></div>
        <small style="color:var(--gray);font-size:.75rem">${itinerary[day].length} activit${itinerary[day].length > 1 ? "ies" : "y"}</small>
      </div>
      ${itinerary[day].map(act => `
        <div class="timeline-item">
          <span class="item-time">⏰ ${formatTime(act.time)}</span>
          <div class="item-body">
            <div class="item-name">${act.category} ${act.name}</div>
            ${act.notes ? `<div class="item-notes">📝 ${act.notes}</div>` : ""}
          </div>
          <button class="item-delete" onclick="deleteActivity('${day}', ${act.id})" title="Remove">✕</button>
        </div>
      `).join("")}
    </div>
  `).join("");
}

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm   = h >= 12 ? "PM" : "AM";
  const hh     = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
}

/* ──────────────────────────────────────
   PACKAGES
────────────────────────────────────── */
function selectPackage(name) {
  if (name === "Explorer") {
    showToast("🌱 Free Explorer plan selected! Create your account.");
  } else if (name === "Adventurer") {
    showToast("🚀 Starting your 14-day free Adventurer trial!");
  } else {
    showToast("🏆 Globetrotter plan selected! Our team will contact you.");
  }
}

/* ──────────────────────────────────────
   TESTIMONIALS DOTS
────────────────────────────────────── */
function setupTestimonialDots() {
  const track = document.getElementById("testimonialsTrack");
  const dotsEl = document.getElementById("testimonialDots");
  if (!track || !dotsEl) return;

  const cards = track.querySelectorAll(".testimonial-card");
  const count = cards.length;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Go to review ${i + 1}`);
    dot.addEventListener("click", () => {
      cards[i].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    });
    dotsEl.appendChild(dot);
  }

  // Update active dot on scroll
  track.addEventListener("scroll", () => {
    const scrollLeft = track.scrollLeft;
    const cardWidth  = cards[0].offsetWidth + 24; // gap
    const idx = Math.round(scrollLeft / cardWidth);
    dotsEl.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === idx));
  });
}

/* ──────────────────────────────────────
   NEWSLETTER
────────────────────────────────────── */
function handleSubscribe(e) {
  e.preventDefault();
  const email = e.target.querySelector("input[type=email]").value;
  showToast(`📧 Subscribed! Welcome aboard, ${email.split("@")[0]}!`);
  e.target.reset();
}

/* ──────────────────────────────────────
   TOAST
────────────────────────────────────── */
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

/* ──────────────────────────────────────
   SCROLL ANIMATION (IntersectionObserver)
────────────────────────────────────── */
const observerOpts = { threshold: 0.12 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity    = "1";
      e.target.style.transform  = "translateY(0)";
      e.target.style.transition = "opacity .6s ease, transform .6s ease";
    }
  });
}, observerOpts);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(
    ".feature-card, .package-card, .testimonial-card, .dest-card, .stat"
  ).forEach(el => {
    el.style.opacity   = "0";
    el.style.transform = "translateY(24px)";
    observer.observe(el);
  });
});
