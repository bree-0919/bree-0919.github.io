document.addEventListener('DOMContentLoaded', () => {
  const mockData = {
    planets: ['Sun','Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune'],
    alerts: [
      { text: 'Geomagnetic field is calm', time: 'Just now' },
      { text: 'Waning gibbous moon visible', time: 'Just now' },
      { text: 'No solar flares detected', time: '12m ago' }
    ],
    apod: {
      title: 'Pillars of Creation',
      description: 'A stellar nursery captured by the James Webb Space Telescope.',
      image: 'https://images-assets.nasa.gov/image/PIA24566/PIA24566~orig.jpg'
    }
  };

  const ids = (id) => document.getElementById(id);
  const locationName = ids('locationName');
  const currentDate = ids('currentDate');
  const currentTime = ids('currentTime');

  const cityMap = {
    seattle: { name: 'Seattle, WA', lat: 47.6062, lon: -122.3321 },
    miami: { name: 'Miami, FL', lat: 25.7617, lon: -80.1918 },
    austin: { name: 'Austin, TX', lat: 30.2672, lon: -97.7431 },
    'new york': { name: 'New York, NY', lat: 40.7128, lon: -74.0060 }
  };

  let currentCity = 'seattle';

  function renderMock() {
    ids('planetRow').innerHTML = mockData.planets.map((p) => `<span class="planet">${p}</span>`).join('');
    ids('alertsList').innerHTML = mockData.alerts.map((a) => `<li><span>${a.text}</span><span>${a.time}</span></li>`).join('');
    ids('apodTitle').textContent = mockData.apod.title;
    ids('apodDesc').textContent = mockData.apod.description;
    ids('apodImage').src = mockData.apod.image;
  }

  function updateClock() {
    const now = new Date();
    currentDate.textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    currentTime.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  }

  async function loadWeather(cityKey) {
    const city = cityMap[cityKey] || cityMap.seattle;
    currentCity = cityKey;
    locationName.textContent = city.name;
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph`;
      const response = await fetch(url);
      const data = await response.json();
      ids('temp').textContent = Math.round(data.current.temperature_2m);
      ids('wind').textContent = Math.round(data.current.wind_speed_10m);
      ids('humidity').textContent = Math.round(data.current.relative_humidity_2m);
      ids('condition').textContent = ['Clear sky','Mainly clear','Partly cloudy','Overcast'][data.current.weather_code] || 'Live atmospheric data';
    } catch {
      ids('condition').textContent = 'Live weather unavailable right now.';
    }
  }

  function updateMoon() {
    const lunarCycle = 29.53058867;
    const phaseNames = ['New Moon','Waxing Crescent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Last Quarter','Waning Crescent'];
    const knownNew = new Date('2024-01-11T11:57:00Z');
    const age = ((Date.now() - knownNew.getTime()) / 86400000) % lunarCycle;
    const illum = Math.round((1 - Math.cos((2 * Math.PI * age) / lunarCycle)) * 50);
    const phase = phaseNames[Math.floor((age / lunarCycle) * 8) % 8];
    ids('moonAge').textContent = age.toFixed(1);
    ids('moonIllumination').textContent = illum;
    ids('moonPhase').textContent = phase;
  }

  document.getElementById('locationBtn').addEventListener('click', () => {
    const next = prompt('Enter city: Seattle, Miami, Austin, New York');
    if (next) loadWeather(next.toLowerCase().trim());
  });

  document.getElementById('refreshBtn').addEventListener('click', () => {
    loadWeather(currentCity);
    updateMoon();
    ids('kpIndex').textContent = (1 + Math.random() * 3).toFixed(1);
  });

  document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    document.querySelectorAll('[data-search]').forEach((card) => {
      card.style.display = !query || card.dataset.search.includes(query) ? '' : 'none';
    });
  });

  document.getElementById('saveObservation').addEventListener('click', () => {
    const value = ids('observationInput').value.trim();
    if (!value) return;
    localStorage.setItem('neurocloudy_observation', value);
    ids('savedObservation').textContent = 'Saved locally.';
  });

  ids('observationInput').value = localStorage.getItem('neurocloudy_observation') || '';
  renderMock();
  updateClock();
  updateMoon();
  loadWeather(currentCity);
  setInterval(updateClock, 1000);
});
