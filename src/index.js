import "./styles.css";
import "weather-icons/css/weather-icons.css";
const el = {
  searchBtn: document.getElementById("get-weather"),
  cityInput: document.getElementById("city-input"),
  errorEl: document.querySelector(".error"),
  weatherEl: document.querySelector(".weather-container"),
};

const state = {
  currentData: null,
  currentUnit: "C",
};
//prettier-ignore
const iconMap = {
  "clear-day":           "wi-day-sunny",
  "clear-night":         "wi-night-clear",
  "partly-cloudy-day":   "wi-day-cloudy",
  "partly-cloudy-night": "wi-night-cloudy",
  "cloudy":              "wi-cloudy",
  "rain":                "wi-rain",
  "showers-day":         "wi-day-showers",
  "showers-night":       "wi-night-showers",
  "thunder-rain":        "wi-thunderstorm",
  "thunder-showers-day": "wi-day-thunderstorm",
  "snow":                "wi-snow",
  "snow-showers-day":    "wi-day-snow",
  "fog":                 "wi-fog",
  "wind":                "wi-strong-wind",
  "hail":                "wi-hail",
};
// prettier-ignore
const colorMap = {
  "clear-day":           "#f59e0b",
  "clear-night":         "#1e1b4b",
  "partly-cloudy-day":   "#60a5fa",
  "partly-cloudy-night": "#312e81",
  "cloudy":              "#6b7280",
  "rain":                "#1d4ed8",
  "showers-day":         "#3b82f6",
  "showers-night":       "#1e3a5f",
  "thunder-rain":        "#4b5563",
  "thunder-showers-day": "#374151",
  "snow":                "#bfdbfe",
  "snow-showers-day":    "#dbeafe",
  "fog":                 "#9ca3af",
  "wind":                "#34d399",
  "hail":                "#a5b4fc",
};
function getTextColor(hexColor) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1a1a1a" : "#e8e8e8";
}
function getIcon(condition) {
  return iconMap[condition] ?? "wi-na";
}
const getColor = (condition) => colorMap[condition] ?? "white";

const getWeather = async (city) => {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}?unitGroup=metric&key=X3XPG4NF53CUX2ZS4JQANCZSM&contentType=json`
  );
  if (!response.ok)
    throw new Error(
      `Somehtign went wrong fetchign weather: ${response.status}`
    );
  return response.json();
};

const showWeather = async (city) => {
  el.searchBtn.disabled = true;
  el.searchBtn.textContent = "🔄 Loading...";

  try {
    const data = await getWeather(city);
    state.currentData = data;
    console.log(data);
    renderWeather(state.currentData, state.currentUnit);
  } catch (err) {
    console.error(err);
  } finally {
    el.searchBtn.disabled = false;
    el.searchBtn.textContent = "Get Weather";
  }
};

const getTemp = (temp, unit) => {
  if (unit === "F") return Math.round(temp * 1.8 + 32);
  return Math.round(temp);
};

const rules = {
  capitalise: /(?<![A-Za-z])[A-Za-z]/g,
  lettersOnly: /^[A-Za-z\s]+$/,
};

const renderWeather = (data, unit) => {
  const weekForecast = data.days.slice(0, 7);
  el.weatherEl.innerHTML = ` 
   
    <div class="current-weather-wrapper">
      <div class="current-weather-time">
        <div class="label">Current Weather</div>
        <div class="value">${data.currentConditions.datetime.slice(0, 5)}</div>
      </div>

      <div class="location-date">
        <div class="location label">${data.address}</div>
        <div class="date value">${formatDate(data.days[0].datetime)}</div>
      </div>

      <div class="main-values">
        <div class="wind-icon"><i class="wi ${getIcon(data.currentConditions.icon)}"></i></div>
        <div class="temperature">${getTemp(data.currentConditions.temp, unit)}°${unit}</div>
        <div class="short-description">
          <div>${data.currentConditions.conditions}</div>
          <div class="label">Feels like: ${data.currentConditions.feelslike}</div>
        </div>
      </div>
      <div class="full-description">
        ${data.days[0].description}
      </div>
      <div class="other-values">
        <div class="air-quality">
          <div class="label">Rain Probability</div>
          <div class="value">${data.days[0].precipprob}%</div>
        </div>

        <div class="wind-speed">
          <div class="label">Wind Speed</div>
          <div class="value">${data.currentConditions.windspeed} km/h</div>
        </div>

        <div class="humidity">
          <div class="label">Humidity</div>
          <div class="value">${data.currentConditions.humidity}%</div>
        </div>

        <div class="visibility">
          <div class="label">Visibility</div>
          <div class="value">${data.currentConditions.visibility} km</div>
        </div>

        <div class="pressure">
          <div class="label">Pressure</div>
          <div class="value">${data.currentConditions.pressure} mb</div>
        </div>

        <div class="dew-point">
          <div class="label">Dew Point</div>
          <div class="value">${data.currentConditions.dew}</div>
        </div>
      </div>
    </div>
      <div class="week-forecast">
        ${weekForecast
          .map(
            (day) => `
          <div class="day-container" style="background-color:${getColor(day.icon)}; color:${getTextColor(getColor(day.icon))}">
            <div class="day label">${extractDay(day.datetime)}</div>
            <div class="icons"><i class="wi ${getIcon(day.icon)}"></i></div>
            <div class="temps">
              <div class="max-temp">${getTemp(day.tempmax, unit)}°${unit}</div>
              <div class="min-temp">${getTemp(day.tempmin, unit)}°${unit}</div>
            </div>
          </div>
          `
          )
          .join("")}
    </div>    
      
  `;
  const weatherBg = getColor(data.currentConditions.icon);
  document.querySelector(".current-weather-wrapper").style.backgroundColor =
    weatherBg;
  const textColor = getTextColor(weatherBg);
  document.querySelector(".current-weather-wrapper").style.color = textColor;
  //  document.querySelector(".week-forecast").style.backgroundColor =
  //   "green";
};

const extractDay = (date) =>
  new Date(date).toLocaleDateString("en-GB", { weekday: "short" });

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const showError = (input) => {
  if (!input) {
    el.errorEl.textContent = "Please enter a city";
    return false;
  } else if (!rules.lettersOnly.test(input)) {
    el.errorEl.textContent = "please enter letters only";
    return false;
  }

  el.errorEl.textContent = "";
  return true;
};

const handleWeatherReq = () => {
  const userInput = el.cityInput.value.trim();
  if (!showError(userInput)) return;
  const capitalised = userInput.replace(rules.capitalise, (match) =>
    match.toUpperCase()
  );
  showWeather(capitalised);
};

document.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;
  if (button.id === "get-weather") {
    handleWeatherReq();
  }
  if (button.id === "toggle-unit") {
    state.currentUnit = state.currentUnit === "C" ? "F" : "C";
    renderWeather(state.currentData, state.currentUnit);
    button.textContent =
      state.currentUnit === "C" ? "Show in °F" : "Show in °C";
  }
});

el.cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleWeatherReq();
});

