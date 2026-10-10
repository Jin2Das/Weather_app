const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const message = document.getElementById("message");
const result = document.getElementById("weather-result");

// Convert weather codes into descriptions and icons
function getWeatherInfo(code) {
  if (code === 0) return { text: "Clear sky", icon: "☀️" };

  if ([1, 2].includes(code)) {
    return { text: "Partly cloudy", icon: "🌤️" };
  }

  if (code === 3) {
    return { text: "Overcast", icon: "☁️" };
  }

  if ([45, 48].includes(code)) {
    return { text: "Foggy", icon: "🌫️" };
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return { text: "Drizzle", icon: "🌦️" };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { text: "Rainy", icon: "🌧️" };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { text: "Snowy", icon: "❄️" };
  }

  if ([95, 96, 99].includes(code)) {
    return { text: "Thunderstorm", icon: "⛈️" };
  }

  return { text: "Weather unavailable", icon: "🌡️" };
}

// Fetch weather when the form is submitted
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) return;

  message.textContent = "Loading weather...";
  result.hidden = true;

  try {
    const response = await fetch(
      `/api/weather?city=${encodeURIComponent(city)}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    displayWeather(data);
    message.textContent = "";
  } catch (error) {
    message.textContent = error.message;
  }
});

// Display the current weather and forecast
function displayWeather(data) {
  const current = data.current;
  const units = data.units;

  const info = getWeatherInfo(current.weather_code);

  document.getElementById("city-name").textContent =
    `${data.city}, ${data.country}`;

  document.getElementById("weather-description").textContent =
    `${info.icon} ${info.text}`;

  document.getElementById("temperature").textContent =
    `${Math.round(current.temperature_2m)}${units.temperature_2m}`;

  document.getElementById("feels-like").textContent =
    `Feels like ${Math.round(current.apparent_temperature)}${units.apparent_temperature}`;

  document.getElementById("humidity").textContent =
    `${current.relative_humidity_2m}${units.relative_humidity_2m}`;

  document.getElementById("wind").textContent =
    `${current.wind_speed_10m} ${units.wind_speed_10m}`;

  document.getElementById("precipitation").textContent =
    `${current.precipitation} ${units.precipitation}`;

  displayForecast(data.daily);

  result.hidden = false;
}

// Display the 5-day forecast
function displayForecast(daily) {
  const forecast = document.getElementById("forecast");
  forecast.replaceChildren();

  daily.time.forEach((date, index) => {
    const info = getWeatherInfo(daily.weather_code[index]);

    const card = document.createElement("div");
    card.className = "forecast-card";

    const dateText = new Date(
      `${date}T12:00:00`
    ).toLocaleDateString("en", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });

    const day = document.createElement("p");
    day.textContent = dateText;

    const icon = document.createElement("div");
    icon.className = "icon";
    icon.textContent = info.icon;

    const description = document.createElement("p");
    description.textContent = info.text;

    const temperatures = document.createElement("strong");
    temperatures.textContent =
      `${Math.round(daily.temperature_2m_max[index])}° / ` +
      `${Math.round(daily.temperature_2m_min[index])}°`;

    card.append(day, icon, description, temperatures);
    forecast.appendChild(card);
  });
}

// Load an example city when the page opens
cityInput.value = "Guwahati";
form.requestSubmit();