async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const result = document.getElementById("weatherResult");

  if (city.trim() === "") {
    result.innerHTML = "Please enter a city name";
    return;
  }

  result.innerHTML = "Loading weather...";

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      result.innerHTML = "City not found";
      return;
    }

    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;
    const cityName = geoData.results[0].name;
    const country = geoData.results[0].country;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const temp = weatherData.current_weather.temperature;
    const wind = weatherData.current_weather.windspeed;

    result.innerHTML = `
      <h3>${cityName}, ${country}</h3>
      <p>Temperature: ${temp}°C</p>
      <p>Wind Speed: ${wind} km/h</p>
    `;
  } catch (error) {
    result.innerHTML = "Weather data not available";
  }
}
