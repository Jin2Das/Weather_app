const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve frontend files from the app folder
app.use(express.static(path.join(__dirname, "app")));

// Test API
app.get("/api/test", (req, res) => {
  res.json({
    message: "Weather app server is working!"
  });
});

// Get weather by city name
app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city?.trim();

    if (!city) {
      return res.status(400).json({
        error: "Please enter a city name."
      });
    }

    // Find city coordinates
    const geoUrl = new URL(
      "https://geocoding-api.open-meteo.com/v1/search"
    );

    geoUrl.searchParams.set("name", city);
    geoUrl.searchParams.set("count", "1");
    geoUrl.searchParams.set("language", "en");
    geoUrl.searchParams.set("format", "json");

    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error("Unable to find the city.");
    }

    const geoData = await geoResponse.json();
    const place = geoData.results?.[0];

    if (!place) {
      return res.status(404).json({
        error: `City "${city}" was not found.`
      });
    }

    // Get current weather and 5-day forecast
    const weatherUrl = new URL(
      "https://api.open-meteo.com/v1/forecast"
    );

    weatherUrl.searchParams.set("latitude", place.latitude);
    weatherUrl.searchParams.set("longitude", place.longitude);

    weatherUrl.searchParams.set(
      "current",
      [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "precipitation",
        "weather_code",
        "wind_speed_10m"
      ].join(",")
    );

    weatherUrl.searchParams.set(
      "daily",
      "weather_code,temperature_2m_max,temperature_2m_min"
    );

    weatherUrl.searchParams.set("timezone", "auto");
    weatherUrl.searchParams.set("forecast_days", "5");

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error("Unable to fetch weather data.");
    }

    const weatherData = await weatherResponse.json();

    // Match the data structure expected by app.js
    res.json({
      city: place.name,
      country: place.country || place.country_code || "",
      current: weatherData.current,
      daily: weatherData.daily,
      units: {
        temperature_2m:
          weatherData.current_units.temperature_2m,
        apparent_temperature:
          weatherData.current_units.apparent_temperature,
        relative_humidity_2m:
          weatherData.current_units.relative_humidity_2m,
        wind_speed_10m:
          weatherData.current_units.wind_speed_10m,
        precipitation:
          weatherData.current_units.precipitation
      }
    });
  } catch (error) {
    console.error("Weather API error:", error.message);

    res.status(500).json({
      error: "Unable to load weather data. Please try again."
    });
  }
});

// Handle unknown API routes with JSON instead of HTML
app.use("/api", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found."
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});