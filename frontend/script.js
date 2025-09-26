// Base URLs for services
const STATION_SERVICE_URL = 'http://localhost:5002';
const USER_SERVICE_URL = 'http://localhost:5001';

// Load all stations
async function loadStations() {
  try {
    const response = await fetch(`${STATION_SERVICE_URL}/stations`);
    const stations = await response.json();
    const list = document.getElementById('stations-list');
    list.innerHTML = stations.map(station => `
      <div class="station">
        <h3>${station.name}</h3>
        <p>Location: ${station.location}</p>
        <p>Capacity: ${station.capacity}, Available: ${station.available}</p>
      </div>
    `).join('');
    updateStationSelect(stations);
  } catch (error) {
    console.error('Error loading stations:', error);
    document.getElementById('stations-list').innerHTML = '<p class="error">Error loading stations.</p>';
  }
}

// Search stations by location
async function searchStations() {
  const location = document.getElementById('location-input').value;
  try {
    const response = await fetch(`${USER_SERVICE_URL}/search?location=${encodeURIComponent(location)}`);
    const stations = await response.json();
    const results = document.getElementById('search-results');
    results.innerHTML = stations.map(station => `
      <div class="station">
        <h3>${station.name}</h3>
        <p>Location: ${station.location}</p>
        <p>Available: ${station.available ? 'Yes' : 'No'}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error searching stations:', error);
    document.getElementById('search-results').innerHTML = '<p class="error">Error searching stations.</p>';
  }
}

// Add a new station
document.getElementById('add-station-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById('station-name').value,
    location: document.getElementById('station-location').value,
    capacity: parseInt(document.getElementById('station-capacity').value),
    available: parseInt(document.getElementById('station-available').value)
  };
  try {
    const response = await fetch(`${STATION_SERVICE_URL}/stations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    alert('Station added successfully!');
    loadStations(); // Refresh list
  } catch (error) {
    console.error('Error adding station:', error);
    alert('Error adding station.');
  }
});

// Update station select for booking
function updateStationSelect(stations) {
  const select = document.getElementById('station-select');
  select.innerHTML = '<option value="">Select a station</option>' +
    stations.filter(s => s.available > 0).map(s => `<option value="${s.id}">${s.name} (${s.location})</option>`).join('');
}

// Book a station
async function bookStation() {
  const user = document.getElementById('user-name').value;
  const stationId = document.getElementById('station-select').value;
  if (!user || !stationId) {
    alert('Please enter your name and select a station.');
    return;
  }
  try {
    const response = await fetch(`${USER_SERVICE_URL}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, station_id: parseInt(stationId) })
    });
    const result = await response.json();
    if (response.ok) {
      document.getElementById('booking-result').innerHTML = '<p class="success">Booking successful! ID: ' + result.id + '</p>';
      loadStations(); // Refresh availability
    } else {
      document.getElementById('booking-result').innerHTML = '<p class="error">' + result.error + '</p>';
    }
  } catch (error) {
    console.error('Error booking station:', error);
    document.getElementById('booking-result').innerHTML = '<p class="error">Error booking station.</p>';
  }
}

// Load bookings
async function loadBookings() {
  try {
    const response = await fetch(`${USER_SERVICE_URL}/bookings`);
    const bookings = await response.json();
    const list = document.getElementById('bookings-list');
    list.innerHTML = bookings.map(booking => `
      <div class="booking">
        <p>Booking ID: ${booking.id}</p>
        <p>User: ${booking.user}</p>
        <p>Station ID: ${booking.station_id}</p>
        <p>Time: ${booking.time}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading bookings:', error);
    document.getElementById('bookings-list').innerHTML = '<p class="error">Error loading bookings.</p>';
  }
}

// Load stations on page load
window.onload = loadStations;
