async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const result = document.getElementById("weatherResult");

  if (city.trim() === "") {
    result.innerHTML = "Please enter a city name";
    return;
  }

  result.innerHTML = "Loading weather...";

  try {
    // Get city latitude and longitude from India only
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5&language=en&format=json&countryCode=IN`;

    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      result.innerHTML = "City not found";
      return;
    }

    const place = geoData.results[0];
    const latitude = place.latitude;
    const longitude = place.longitude;
    const cityName = place.name;
    const state = place.admin1 || "";
    const country = place.country;

    // Better current weather API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const temp = weatherData.current.temperature_2m;
    const humidity = weatherData.current.relative_humidity_2m;
    const wind = weatherData.current.wind_speed_10m;
    const code = weatherData.current.weather_code;

    let condition = "Clear";

    if (code === 0) condition = "Clear sky";
    else if (code >= 1 && code <= 3) condition = "Partly cloudy";
    else if (code >= 45 && code <= 48) condition = "Foggy";
    else if (code >= 51 && code <= 67) condition = "Rainy";
    else if (code >= 80 && code <= 82) condition = "Rain showers";
    else if (code >= 95) condition = "Thunderstorm";

    result.innerHTML = `
      <h3>${cityName}, ${state}, ${country}</h3>
      <p>Temperature: ${temp}°C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${wind} km/h</p>
      <p>Condition: ${condition}</p>
    `;
  } catch (error) {
    result.innerHTML = "Weather data not available";
  }
}
