const tripForm = document.getElementById('tripForm');
const tripList = document.getElementById('tripList');
const stopCount = document.getElementById('stopCount');

const trips = [];

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function renderTrips() {
  tripList.innerHTML = '';

  if (trips.length === 0) {
    tripList.innerHTML = '<li class="empty-state">No stops added yet. Start planning your adventure.</li>';
    stopCount.textContent = '0 stops';
    return;
  }

  trips.forEach((trip) => {
    const tripItem = document.createElement('li');
    tripItem.className = 'trip-item';
    tripItem.innerHTML = `
      <h3>${trip.destination}</h3>
      <p><strong>Dates:</strong> ${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}</p>
      <p><strong>Top Activity:</strong> ${trip.activity}</p>
    `;
    tripList.appendChild(tripItem);
  });

  stopCount.textContent = `${trips.length} stop${trips.length === 1 ? '' : 's'}`;
}

tripForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const destination = document.getElementById('destination').value.trim();
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const activity = document.getElementById('activity').value.trim();

  if (endDate < startDate) {
    return;
  }

  trips.push({ destination, startDate, endDate, activity });
  renderTrips();
  tripForm.reset();
});

renderTrips();
