import "./style.css";
import { getBackground } from "./modules/refresh-bg";
import { langEn } from "./modules/languageEn";
import { langRu } from "./modules/languageRu";
import {showTime} from "./modules/time";

const refreshBg = document.querySelector(".refresh-background");
const buttonEn = document.querySelector(".language-button-en");
const buttonRu = document.querySelector(".language-button-ru");
const buttonF = document.querySelector(".temperature-button-farenheit");
const buttonC = document.querySelector(".temperature-button-celsius");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const cityAndCountry = document.querySelector(".weather-city");
const temperatureNow = document.querySelector(".weather-temperature");
const feels_like = document.querySelector(".feelsLike");
const wind = document.querySelector(".speedWind");
const iconWeather = document.querySelector(".weather-image");
const humidity = document.querySelector(".humidity");
const overcast = document.querySelector(".overcast");
const firstTemp = document.querySelector(".first-forecast-temperature");
const secondTemp = document.querySelector(".second-forecast-temperature");
const thirdTemp = document.querySelector(".third-forecast-temperature");
const firstIcon = document.querySelector(".first-icon");
const secondIcon = document.querySelector(".second-icon");
const thirdIcon = document.querySelector(".third-icon");
const latitude = document.querySelector(".latitude");
const longitude = document.querySelector(".longitude");
let positionLatit;
let positionLongit;
let address;
let placeName;
let country;
let checkTemp = false;
let checkRu = false;
let translator;
let requestLang;
let timezone;

//-----start app----
function start() {
  navigator.geolocation.getCurrentPosition( (position)=> {
       checkRu = localStorage.getItem("checkRu");
  checkTemp = localStorage.getItem("checkTemp");
  showMap(position);

 checkRu === "true" ? activeRu() : activeEn();
 checkTemp === "true" ? activeFarenheit() : activeCelsius();
 
})

 }

//-----search------
function getAddress(positionLatit, positionLongit) {
  return fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${positionLatit}+${positionLongit}&key=f650e4b67c054cfd9c0224e9b3ddf880&language=${requestLang}&pretty=1`
  ).then((response) => response.json());
}

async function showAddress(positionLatit, positionLongit) {
  try {
    requestLang = checkRu ? "ru" : "en";
    address = await getAddress(positionLatit, positionLongit);
    timezone = address.results[0].annotations.timezone.offset_sec;
    placeName = address.results[0].components.city;
    country = address.results[0].components.country;
    cityAndCountry.textContent = `${placeName}, ${country}`;
    showWeatherNow(placeName);
    showForecastWeather(placeName);
    showTime(checkRu, timezone);
  } catch (error) {
    alert(error);
  }
}

function searchCity(placeName) {
  return fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${placeName}&key=f650e4b67c054cfd9c0224e9b3ddf880&language=${requestLang}&pretty=1`
  ).then((response) => response.json());
}

async function showCity() {
  if (!placeName) return;
  try {
    requestLang = checkRu ? "ru" : "en";
    address = await searchCity(placeName);
    console.log(address);
    timezone = address.results[0].annotations.timezone.offset_sec;
    console.log(timezone);
    if (address) {
      const result = address.results[0].components;
      placeName = result.city
        ? result.city
        : result.town
        ? result.town
        : result.village;
      const { country } = result;
      cityAndCountry.textContent = `${placeName}, ${country}`;
      const pos = address.results[0].geometry;
      positionLatit = pos.lat.toFixed(2);
      positionLongit = pos.lng.toFixed(2);
      localStorage.setItem("placeName", placeName);
      searchInput.value = "";
      showWeatherNow(placeName);
      showForecastWeather(placeName);
      getMap(positionLatit, positionLongit);
      getCoords(positionLatit, positionLongit);
      showTime(checkRu, timezone);
    }
  } catch (error) {
    alert(error);
  }
}

//----------------map---------------
  function showMap(position) {
    positionLatit = position.coords.latitude.toFixed(2);
    positionLongit = position.coords.longitude.toFixed(2);
    getCoords(positionLatit, positionLongit);
    showAddress(positionLatit, positionLongit);
    getMap(positionLatit, positionLongit);
  }

function getMap(positionLatit, positionLongit) {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiZ2Fub2NpaiIsImEiOiJja2pzZXQzdTEwMnpzMnNwOHR2M2drM2YzIn0.dXphpFRS-DDUvodGD7CR8g";
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [positionLongit, positionLatit],
    zoom: 13,
  });
  const marker = new mapboxgl.Marker()
    .setLngLat([positionLongit, positionLatit])
    .addTo(map);
}

function getCoords(positionLatit, positionLongit) {
  translator = checkRu ? langRu : langEn;
  const lat = String(positionLatit).split(".");
  const lon = String(positionLongit).split(".");
  const latDegree = lat[0];
  const latMinute = lat[1];
  const lonDegree = lon[0];
  const lonMinute = lon[1];
  latitude.textContent = `${translator.coordinates.latit} ${latDegree}°  ${latMinute}'`;
  longitude.textContent = `${translator.coordinates.longit} ${lonDegree}°  ${lonMinute}'`;
}

//-------weather now-------
function getWeatherNow(placeName) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${placeName}&appid=8f688ccc6f525b68944b9eab6d340d1b&lang=${requestLang}&pretty=1`
  ).then((response) => response.json());
}

async function showWeatherNow(placeName) {
  if (!placeName) return;
  try {
    requestLang = checkRu ? "ru" : "en";
    const weather = await getWeatherNow(placeName);
    translator = checkRu ? langRu : langEn;
    const feelsLike = weather.main.feels_like;
    const humidityNow = weather.main.humidity;
    const tempNow = weather.main.temp;
    const iconNow = weather.weather[0].icon;
    const windNow = weather.wind.speed;
    temperatureNow.textContent = checkTemp
      ? `${Math.round((tempNow - 273.15) * 1.8 + 32)}°`
      : `${Math.round(tempNow - 273.15)}°`;
    feels_like.textContent = checkTemp
      ? `${translator.summary.feels} ${`${Math.round(
          (feelsLike - 273.15) * 1.8 + 32
        )}°`}`
      : `${translator.summary.feels} ${`${Math.round(feelsLike - 273.15)}°`}`;
    humidity.textContent = `${translator.summary.humidity} ${humidityNow}%`;
    wind.textContent = `${translator.summary.wind} ${windNow} ${translator.summary.speed}`;
    overcast.textContent = weather.weather[0].description;
    iconWeather.style.backgroundImage = `url(http://openweathermap.org/img/wn/${iconNow}@2x.png)`;
    
    searchButton.textContent = `${translator.search.button}`;
    searchInput.placeholder = `${translator.search.input}`;
  } catch (error) {
    alert(error);
  }
}

//-----forecast 3 days-----
function getForecastWeather(placeName) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${placeName}&appid=8f688ccc6f525b68944b9eab6d340d1b`
  ).then((response) => response.json());
}

async function showForecastWeather(placeName) {
  if (!placeName) return;
  try {
    const forecastWeather = await getForecastWeather(placeName);
    const firstTemperature = forecastWeather.list[9].main.temp;
    const secTemperature = forecastWeather.list[17].main.temp;
    const thirdTemperature = forecastWeather.list[25].main.temp;
    firstTemp.textContent = checkTemp
      ? `${Math.round((firstTemperature - 273.15) * 1.8 + 32)}°`
      : `${Math.round(firstTemperature - 273.15)}°`;
    secondTemp.textContent = checkTemp
      ? `${Math.round((secTemperature - 273.15) * 1.8 + 32)}°`
      : `${Math.round(secTemperature - 273.15)}°`;
    thirdTemp.textContent = checkTemp
      ? `${Math.round((thirdTemperature - 273.15) * 1.8 + 32)}°`
      : `${Math.round(thirdTemperature - 273.15)}°`;
    firstIcon.style.backgroundImage = `url(http://openweathermap.org/img/wn/${forecastWeather.list[9].weather[0].icon}@2x.png)`;
    secondIcon.style.backgroundImage = `url(http://openweathermap.org/img/wn/${forecastWeather.list[17].weather[0].icon}@2x.png)`;
    thirdIcon.style.backgroundImage = `url(http://openweathermap.org/img/wn/${forecastWeather.list[25].weather[0].icon}@2x.png)`;
  } catch (error) {
    alert(error);
  }
}

//change --------c f------
function activeFarenheit() {
  checkTemp = true;
  localStorage.setItem("checkTemp", checkTemp);
  buttonC.classList.remove("active");
  buttonF.classList.add("active");
  showWeatherNow(placeName);
  showForecastWeather(placeName);
}

function activeCelsius() {
  checkTemp = false;
  localStorage.setItem("checkTemp", checkTemp);
  buttonC.classList.add("active");
  buttonF.classList.remove("active");
  showWeatherNow(placeName);
  showForecastWeather(placeName);
}

// change language-------------
function activeRu() {
  checkRu = true;
  localStorage.setItem("checkRu", checkRu);
  buttonEn.classList.remove("active");
  buttonRu.classList.add("active");
  getCoords(positionLatit, positionLongit);
  showAddress(positionLatit, positionLongit);
  showCity();
  showWeatherNow(placeName);
  showForecastWeather(placeName);
  showTime(checkRu, timezone);
}

function activeEn() {
  checkRu = false;
  localStorage.setItem("checkRu", checkRu);
  buttonEn.classList.add("active");
  buttonRu.classList.remove("active");
  getCoords(positionLatit, positionLongit);
  showAddress(positionLatit, positionLongit);
  showCity();
  showWeatherNow(placeName);
  showForecastWeather(placeName);
  showTime(checkRu, timezone);
}

function pressEnter(e) {
  if (e.which === 13) {
    placeName = searchInput.value;
    showCity();
  }
}

buttonRu.addEventListener("click", activeRu);
buttonEn.addEventListener("click", activeEn);
searchButton.addEventListener("click", () => {
  placeName = searchInput.value;
  showCity();
});
window.addEventListener("keypress", pressEnter);
buttonF.addEventListener("click", activeFarenheit);
buttonC.addEventListener("click", activeCelsius);
refreshBg.addEventListener("click", getBackground);
window.addEventListener("load", getBackground);
window.addEventListener("load", start);


