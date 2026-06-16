function renderCurrentWeather(response) {
  let temperatureElement = document.querySelector("#current-temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#current-city");
  let descriptionElement = document.querySelector("#current-weather-description");
  let humidityElement = document.querySelector("#current-humidity");
  let windSpeedElement = document.querySelector("#current-wind-speed");
  let timeElement = document.querySelector("#current-weather-time");
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#current-weather-icon");

  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatCurrentWeatherDate(date);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

  fetchForecastByCity(response.data.city);
}

function formatCurrentWeatherDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function fetchCurrentWeatherByCity(city) {
  let apiKey = "b2a5adcct04b33178913oc335f405433";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(renderCurrentWeather);
}

function handleCitySearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#city-search-input");

  fetchCurrentWeatherByCity(searchInput.value);
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function detectForecastEffect(condition) {
  let description = (condition.description || "").toLowerCase();
  let icon = condition.icon ? condition.icon.toLowerCase() : "";
  let weatherText = `${description} ${icon}`;

  if (weatherText.includes("rain") || weatherText.includes("shower")) {
    return "rain";
  }

  if (weatherText.includes("snow")) {
    return "snow";
  }

  if (weatherText.includes("thunder") || weatherText.includes("storm")) {
    return "storm";
  }

  if (weatherText.includes("cloud")) {
    return "cloud";
  }

  if (
    weatherText.includes("clear") ||
    weatherText.includes("sun") ||
    weatherText.includes("fair")
  ) {
    return "sun";
  }

  if (
    weatherText.includes("mist") ||
    weatherText.includes("fog") ||
    weatherText.includes("haze")
  ) {
    return "mist";
  }

  return "default";
}

function createForecastParticles(weatherEffect) {
  if (weatherEffect === "rain" || weatherEffect === "storm") {
    return `
      <span class="rain-drop rain-drop-one"></span>
      <span class="rain-drop rain-drop-two"></span>
      <span class="rain-drop rain-drop-three"></span>
      <span class="rain-drop rain-drop-four"></span>
    `;
  }

  if (weatherEffect === "snow") {
    return `
      <span class="snowflake snowflake-one"></span>
      <span class="snowflake snowflake-two"></span>
      <span class="snowflake snowflake-three"></span>
      <span class="snowflake snowflake-four"></span>
    `;
  }

  return "";
}
function fetchForecastByCity(city) {
  let apiKey = "b2a5adcct04b33178913oc335f405433";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(renderForecastCards);
}

function renderForecastCards(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      let weatherEffect = detectForecastEffect(day.condition);
      let weatherParticles = createForecastParticles(weatherEffect);

      forecastHtml =
        forecastHtml +
        `
      <div class="weather-forecast-day weather-${weatherEffect}">
        <div class="weather-forecast-date">${formatForecastDay(day.time)}</div>

        <div class="weather-forecast-icon-stage">
          <div class="weather-effect" aria-hidden="true">${weatherParticles}</div>
          <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
        </div>
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature">
            <strong>${Math.round(day.temperature.maximum)}&deg;</strong>
          </div>
          <div class="weather-forecast-temperature">${Math.round(
            day.temperature.minimum
          )}&deg;</div>
        </div>
      </div>
    `;
    }
  });

  let forecastElement = document.querySelector("#five-day-forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#city-search-form");
searchFormElement.addEventListener("submit", handleCitySearchSubmit);

fetchCurrentWeatherByCity("Paris");
