const searchBtn = document.querySelector("button");
const cityInput = document.querySelector("input");
const resultDiv = document.querySelector("p");

searchBtn.addEventListener("click", getWeather);

async function getWeather() {
  const city = cityInput.value.trim();

  if (city === "") {
    resultDiv.innerHTML = "Please enter a city name";
    return;
  }

  resultDiv.innerHTML = "Loading weather...";

  try {
    // Step 1: Get latitude and longitude of city
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      resultDiv.innerHTML = "City not found";
      return;
    }

    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;
    const cityName = geoData.results[0].name;
    const country = geoData.results[0].country;

    // Step 2: Get weather using latitude and longitude
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const temperature = weatherData.current_weather.temperature;
    const windspeed = weatherData.current_weather.windspeed;

    resultDiv.innerHTML = `
      <strong>${cityName}, ${country}</strong><br>
      Temperature: ${temperature}°C<br>
      Wind Speed: ${windspeed} km/h
    `;
  } catch (error) {
    resultDiv.innerHTML = "Weather data not available";
  }
}
