// Wait until DOM is fully loaded before running anything
document.addEventListener("DOMContentLoaded", function () {
  // API credentials + base URLs
  const RAPIDAPI_KEY = "3076e5de99mshf61cd53abfe6b35p1d6f75jsn5ba92d9697c9";
  const RAPIDAPI_HOST = "weatherapi-com.p.rapidapi.com";

  // Used to get user's IP for initial location load
  const ipLookupURL = "https://api.ipify.org/?format=json";

  // Base weather endpoint — location gets appended dynamically
  const weatherBaseURL =
    "https://weatherapi-com.p.rapidapi.com/forecast.json?q=";

  // Standard fetch config for RapidAPI
  const weatherOptions = {
    method: "GET",
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": RAPIDAPI_HOST
    }
  };

  // Cache DOM elements once instead of querying repeatedly
  const statusMessage = document.querySelector("#statusMessage");

  // Modal + input controls
  const modalCover = document.querySelector("#modalCover");
  const findLocationBtn = document.querySelector("#findLocationBtn");
  const closeModalBtn = document.querySelector("#closeModalBtn");
  const locationForm = document.querySelector("#locationForm");
  const locationBox = document.querySelector("#locationBox");

  // Main weather display elements
  const cityName = document.querySelector("#cityName");
  const currentTemp = document.querySelector("#currentTemp");
  const currentConditionIcon = document.querySelector("#currentConditionIcon");
  const conditionText = document.querySelector("#conditionText");
  const feelsLikeTemp = document.querySelector("#feelsLikeTemp");
  const highTemp = document.querySelector("#highTemp");
  const lowTemp = document.querySelector("#lowTemp");

  // Wind + compass
  const windTop = document.querySelector("#windTop");
  const windSpeed = document.querySelector("#windSpeed");
  const windGust = document.querySelector("#windGust");
  const windDirection = document.querySelector("#windDirection");
  const compassNeedle = document.querySelector("#compassNeedle");
  const compassWindValue = document.querySelector("#compassWindValue");

  // Humidity
  const humidityValue = document.querySelector("#humidityValue");
  const dewPointValue = document.querySelector("#dewPointValue");

  // Air quality
  const airQualityNumber = document.querySelector("#airQualityNumber");
  const airQualityWord = document.querySelector("#airQualityWord");
  const airQualitySummary = document.querySelector("#airQualitySummary");
  const aqBar = document.querySelector("#aqBar");

  // Moon data
  const moonPhaseTitle = document.querySelector("#moonPhaseTitle");
  const moonIllumination = document.querySelector("#moonIllumination");
  const moonriseTime = document.querySelector("#moonriseTime");
  const moonsetTime = document.querySelector("#moonsetTime");

  // Simple UI status updater
  function setStatus(message) {
    statusMessage.textContent = message;
  }

  // Modal open/close logic
  function openModal() {
    modalCover.classList.add("show-modal");
    modalCover.setAttribute("aria-hidden", "false");
    locationBox.focus();
  }

  function closeModal() {
    modalCover.classList.remove("show-modal");
    modalCover.setAttribute("aria-hidden", "true");
  }

  // Generic fetch wrapper — throws error if response fails
  function getData(url, options = {}) {
    return fetch(url, options).then(function (response) {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    });
  }

  // Convert date → readable day label
  function getDayLabel(dateString, index) {
    if (index === 0) return "Today";
    const dateObject = new Date(dateString + "T12:00:00");
    return dateObject.toLocaleDateString("en-US", { weekday: "short" });
  }

  // Map API AQI scale → custom UI values
  function getAQIData(usEpaIndex) {
    switch (Number(usEpaIndex)) {
      case 1:
        return { number: 30, word: "Good", pos: "12%", color: "#1ee37a" };
      case 2:
        return { number: 70, word: "Moderate", pos: "30%", color: "#f4f000" };
      case 3:
        return {
          number: 120,
          word: "Sensitive Groups",
          pos: "48%",
          color: "#ff8a00"
        };
      case 4:
        return { number: 170, word: "Unhealthy", pos: "64%", color: "#ff2a6d" };
      case 5:
        return {
          number: 250,
          word: "Very Unhealthy",
          pos: "82%",
          color: "#7f2bff"
        };
      case 6:
        return { number: 320, word: "Hazardous", pos: "96%", color: "#8b0012" };
      default:
        return {
          number: "--",
          word: "Unavailable",
          pos: "12%",
          color: "#1ee37a"
        };
    }
  }

  // Populate one forecast row (used in loop)
  function updateForecastRow(dayData, index) {
    document.querySelector(
      `#forecastDay${index}Name`
    ).textContent = getDayLabel(dayData.date, index);
    document.querySelector(`#forecastDay${index}Condition`).textContent =
      dayData.day.condition.text;
    document.querySelector(`#forecastDay${index}High`).textContent = Math.round(
      dayData.day.maxtemp_f
    );
    document.querySelector(`#forecastDay${index}Low`).textContent = Math.round(
      dayData.day.mintemp_f
    );
    document.querySelector(`#forecastDay${index}Wind`).textContent = Math.round(
      dayData.day.maxwind_mph
    );

    const iconElement = document.querySelector(`#forecastDay${index}Icon`);
    iconElement.src = `https:${dayData.day.condition.icon}`;
    iconElement.alt = dayData.day.condition.text;
  }

  // Main render function — takes API response and updates UI
  function updateWeather(weatherObject) {
    // Core current weather
    cityName.textContent = `${weatherObject.location.name}, ${
      weatherObject.location.region || weatherObject.location.country
    }`;
    currentTemp.textContent = Math.round(weatherObject.current.temp_f);
    conditionText.textContent = weatherObject.current.condition.text;
    feelsLikeTemp.textContent = Math.round(weatherObject.current.feelslike_f);

    currentConditionIcon.src = `https:${weatherObject.current.condition.icon}`;
    currentConditionIcon.alt = weatherObject.current.condition.text;

    // High / low pulled from forecast day 0
    highTemp.textContent = Math.round(
      weatherObject.forecast.forecastday[0].day.maxtemp_f
    );
    lowTemp.textContent = Math.round(
      weatherObject.forecast.forecastday[0].day.mintemp_f
    );

    // Wind + compass rotation
    windTop.textContent = Math.round(weatherObject.current.wind_mph);
    windSpeed.textContent = Math.round(weatherObject.current.wind_mph);
    windGust.textContent = Math.round(weatherObject.current.gust_mph);
    windDirection.textContent = `${weatherObject.current.wind_degree}° ${weatherObject.current.wind_dir}`;
    compassWindValue.textContent = Math.round(weatherObject.current.wind_mph);
    compassNeedle.style.transform = `rotate(${
      weatherObject.current.wind_degree + 180
    }deg)`;

    // Humidity
    humidityValue.textContent = weatherObject.current.humidity;
    dewPointValue.textContent = Math.round(weatherObject.current.dewpoint_f);

    // Air quality mapping + styling
    const usEpaIndex = weatherObject.current.air_quality
      ? weatherObject.current.air_quality["us-epa-index"]
      : null;

    const aqData = getAQIData(usEpaIndex);
    airQualityNumber.textContent = aqData.number;
    airQualityWord.textContent = aqData.word;
    airQualitySummary.textContent = aqData.word;
    aqBar.style.setProperty("--pos", aqData.pos);
    aqBar.style.setProperty("--aq", aqData.color);

    // Moon / astro data
    const astroData = weatherObject.forecast.forecastday[0].astro;
    moonPhaseTitle.textContent = astroData.moon_phase.toUpperCase();
    moonIllumination.textContent = astroData.moon_illumination;
    moonriseTime.textContent = astroData.moonrise;
    moonsetTime.textContent = astroData.moonset;

    // Loop through forecast array (dynamic — supports up to 7 days)
    const forecastDays = weatherObject.forecast.forecastday;

    for (let i = 0; i < 7; i += 1) {
      if (forecastDays[i]) {
        updateForecastRow(forecastDays[i], i);
      }
    }

    setStatus(`Showing live weather for ${weatherObject.location.name}.`);
  }

  // Build URL dynamically + fetch weather
  function loadWeatherFromQuery(queryValue) {
    setStatus("Loading live weather data...");

    // Hardest part: correctly building URL with query + parameters
    const weatherLookupURL = `${weatherBaseURL}${encodeURIComponent(
      queryValue
    )}&days=7&aqi=yes&alerts=no`;

    getData(weatherLookupURL, weatherOptions)
      .then(function (weatherResult) {
        updateWeather(weatherResult);
      })
      .catch(function (error) {
        console.error("Weather lookup error:", error);
        setStatus("Sorry — I couldn't load live weather for that location.");
      });
  }

  // Runs on page load — attempts automatic location detection
  function loadInitialWeather() {
    setStatus("Looking up your location...");

    getData(ipLookupURL)
      .then(function (ipResult) {
        loadWeatherFromQuery(ipResult.ip);
      })
      .catch(function () {
        // Fallback if IP lookup fails
        loadWeatherFromQuery("Seattle");
      });
  }

  // =========================================================
  // USER INTERACTIONS
  // =========================================================

  // Open modal
  findLocationBtn.addEventListener("click", function () {
    openModal();
  });

  // Close modal (button)
  closeModalBtn.addEventListener("click", function () {
    closeModal();
  });

  // Close modal (click outside)
  modalCover.addEventListener("click", function (event) {
    if (event.target === modalCover) {
      closeModal();
    }
  });

  // Handle user submitting new location
  locationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newLocation = locationBox.value.trim();

    if (newLocation === "") {
      setStatus("Please enter a location first.");
      return;
    }

    closeModal();
    loadWeatherFromQuery(newLocation);
    locationForm.reset();
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modalCover.classList.contains("show-modal")) {
      closeModal();
    }
  });

  // Initial app load trigger
  loadInitialWeather();
});
