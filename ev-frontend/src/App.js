import React, { useState, useEffect } from "react";

function App() {
  const [name, setName] = useState("");
  const [stations, setStations] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [stationName, setStationName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [available, setAvailable] = useState("");

  // Base URLs of your backend services
  const stationApi = process.env.REACT_APP_STATION_API || "http://localhost:5000";
  const userApi = process.env.REACT_APP_USER_API || "http://localhost:5001";

 

  // Fetch stations
  const fetchStations = async () => {
    try {
      console.log("Fetching stations from:", `${stationApi}/stations`);
      const res = await fetch(`${stationApi}/stations`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setStations(data);
    } catch (err) {
      console.error("Error fetching stations:", err);
      alert("Failed to fetch stations: " + err.message);
    }
  };

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      console.log("Fetching bookings from:", `${userApi}/bookings`);
      const res = await fetch(`${userApi}/bookings`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      alert("Failed to fetch bookings: " + err.message);
    }
  };

  // Add a new station
  const addStation = async () => {
    const station = {
      name: stationName,
      location,
      capacity: parseInt(capacity),
      available: parseInt(available),
    };

    try {
      const res = await fetch(`${stationApi}/stations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(station),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      fetchStations(); // refresh list
      setStationName("");
      setLocation("");
      setCapacity("");
      setAvailable("");
    } catch (err) {
      console.error("Error adding station:", err);
      alert("Failed to add station: " + err.message);
    }
  };

  // Book a slot at a station
  const bookSlot = async (stationId) => {
    const booking = {
      user: name || "Anonymous",
      station_id: stationId,
    };

    try {
      const res = await fetch(`${userApi}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      fetchBookings();
      fetchStations(); // update availability
    } catch (err) {
      console.error("Error booking slot:", err);
      alert("Failed to book slot: " + err.message);
    }
  };

  useEffect(() => {
    fetchStations();
    fetchBookings();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚗 EV Charging Station App</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>Your Name: </label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <h2>Add New Station</h2>
      <input placeholder="Name" value={stationName} onChange={(e) => setStationName(e.target.value)} />
      <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <input placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
      <input placeholder="Available" value={available} onChange={(e) => setAvailable(e.target.value)} />
      <button onClick={addStation}>Add Station</button>

      <h2>Stations</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>Available</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.location}</td>
              <td>{s.capacity}</td>
              <td>{s.available}</td>
              <td>
                <button onClick={() => bookSlot(s.id)} disabled={s.available <= 0}>
                  Book Slot
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Bookings</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>User</th>
            <th>Station ID</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.user}</td>
              <td>{b.station_id}</td>
              <td>{b.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button style={{ marginTop: "20px" }} onClick={() => { fetchStations(); fetchBookings(); }}>
        Refresh
      </button>
    </div>
  );
}

export default App;

