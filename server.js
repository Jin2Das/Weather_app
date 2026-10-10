const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve frontend files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Weather API endpoint
app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city?.trim();

    if (!city) {
      return res.status(400).json({
        error: "Please enter a city name."
      });
    }

    // Step 1: Find the city's latitude and longitude
    const geoUrl = new URL(
      "https://geocoding-api.open-meteo.com/v1/search"
    );

    geoUrl.searchParams.set("name", city);
    geoUrl.searchParams.set("count", "1");
    geoUrl.searchParams.set("language", "en");
    geoUrl.searchParams.set("format", "json");

    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error("Could not find the city.");
    }

    const geoData = await geoResponse.json();
    const place = geoData.results?.[0];

    if (!place) {
      return res.status(404).json({
        error: "City not found. Please try another city."
      });
    }

    // Step 2: Fetch weather using the coordinates
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
        "is_day",
        "precipitation",
        "weather_code",
        "wind_speed_10m"
      ].join(",")
    );

    weatherUrl.searchParams.set(
      "daily",
      "weather_code,temperature_2m_max,temperature_2m_min"
    );

    weatherUrl.searchParams.set("forecast_days", "5");
    weatherUrl.searchParams.set("timezone", "auto");

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error("Could not fetch weather data.");
    }

    const weatherData = await weatherResponse.json();

    // Step 3: Send the result to the frontend
    res.json({
      city: place.name,
      country: place.country,
      current: weatherData.current,
      daily: weatherData.daily,
      units: weatherData.current_units
    });
  } catch (error) {
    console.error("Weather error:", error.message);

    res.status(500).json({
      error: "Unable to fetch weather. Please try again."
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Weather app running at http://localhost:${PORT}`);
});