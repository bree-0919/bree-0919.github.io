document.addEventListener("DOMContentLoaded", function () {
  const locationName = document.querySelector("#locationName");
  const locationBtn = document.querySelector("#locationBtn");
  const refreshBtn = document.querySelector("#refreshBtn");
  const currentTime = document.querySelector("#currentTime");
  const currentDate = document.querySelector("#currentDate");

  const temp = document.querySelector("#temp");
  const condition = document.querySelector("#condition");
  const wind = document.querySelector("#wind");
  const humidity = document.querySelector("#humidity");

  const moonPhase = document.querySelector("#moonPhase");
  const moonNote = document.querySelector("#moonNote");
  const moonIllumination = document.querySelector("#moonIllumination");
  const moonAge = document.querySelector("#moonAge");

  const locationDialog = document.querySelector("#locationDialog");
  const cityInput = document.querySelector("#cityInput");
  const submitLocation = document.querySelector("#submitLocation");

  const observationInput = document.querySelector("#observationInput");
  const saveObservation = document.querySelector("#saveObservation");
  const savedObservation = document.querySelector("#savedObservation");

  let currentCity = "Seattle";

  const locations = {
    seattle: { name: "Seattle, WA", latitude: 47.6062, longitude: -122.3321 },
    portland: { name: "Portland, OR", latitude: 45.5152, longitude: -122.6784 },
    vancouver: { name: "Vancouver, WA", latitude: 45.6387, longitude: -122.6615 },
    miami: { name: "Miami, FL", latitude: 25.7617, longitude: -80.1918 },
    "new york": { name: "New York, NY", latitude: 40.7128, longitude: -74.0060 },
    "los angeles": { name: "Los Angeles, CA", latitude: 34.0522, longitude: -118.2437 }
  };

  function updateClock() {
    const now = new Date();

    currentTime.textContent = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    });

    currentDate.textContent = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  function getWeatherCodeText(code) {
    const codes = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      80: "Rain showers",
      95: "Thunderstorm"
    };

    return codes[code] || "Atmospheric data active";
  }

  function getPlace(city) {
    const cleaned = city.toLowerCase().trim();
    return locations[cleaned] || locations.seattle;
  }

  function loadWeather(city) {
    const place = getPlace(city);
    currentCity = city;
    locationName.textContent = place.name;
    condition.textContent = "Reading the atmosphere...";

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        temp.textContent = Math.round(data.current.temperature_2m);
        wind.textContent = Math.round(data.current.wind_speed_10m);
        humidity.textContent = Math.round(data.current.relative_humidity_2m);
        condition.textContent = getWeatherCodeText(data.current.weather_code);
      })
      .catch(() => {
        condition.textContent = "Weather data could not load.";
      });
  }

  function getMoonData() {
    const phases = [
      "New Moon",
      "Waxing Crescent",
      "First Quarter",
      "Waxing Gibbous",
      "Full Moon",
      "Waning Gibbous",
      "Last Quarter",
      "Waning Crescent"
    ];

    const now = new Date();
    const knownNewMoon = new Date("2024-01-11T11:57:00");
    const lunarCycle = 29.53058867;
    const daysSince = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
    const phaseAge = ((daysSince % lunarCycle) + lunarCycle) % lunarCycle;
    const phaseIndex = Math.floor((phaseAge / lunarCycle) * 8) % 8;
    const illumination = Math.round((1 - Math.cos((2 * Math.PI * phaseAge) / lunarCycle)) * 50);

    moonPhase.textContent = phases[phaseIndex];
    moonAge.textContent = Math.round(phaseAge);
    moonIllumination.textContent = illumination;
    moonNote.textContent = `The moon is approximately ${Math.round(phaseAge)} days into its cycle.`;
  }

  function loadObservation() {
    const saved = localStorage.getItem("neurocloudy_observation");

    if (saved) {
      observationInput.value = saved;
      savedObservation.textContent = "Saved observation restored.";
    }
  }

  locationBtn.addEventListener("click", function () {
    locationDialog.showModal();
  });

  submitLocation.addEventListener("click", function () {
    const nextCity = cityInput.value.trim();

    if (nextCity) {
      loadWeather(nextCity);
      cityInput.value = "";
      locationDialog.close();
    }
  });

  refreshBtn.addEventListener("click", function () {
    loadWeather(currentCity);
    getMoonData();
  });

  saveObservation.addEventListener("click", function () {
    const entry = observationInput.value.trim();

    if (!entry) {
      savedObservation.textContent = "Write an observation first.";
      return;
    }

    localStorage.setItem("neurocloudy_observation", entry);
    savedObservation.textContent = "Observation saved.";
  });

  updateClock();
  setInterval(updateClock, 1000);
  getMoonData();
  loadObservation();
  loadWeather(currentCity);
});