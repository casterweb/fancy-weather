import { langEn } from "./languageEn";
import { langRu } from "./languageRu";

const dateTimeWeather = document.querySelector(".weather-date-and-time");
const firstDay = document.querySelector(".first-day");
const secondDay = document.querySelector(".second-day");
const thirdDay = document.querySelector(".third-day");

export function showTime(checkRu, timezone) {
    if (!timezone) return;
    const translator = checkRu ? langRu : langEn;
    let now = new Date();
    let currentTimeZoneOffsetInHours = now.getTimezoneOffset() * 60000;
    let localTime =
      now.getTime() + currentTimeZoneOffsetInHours + timezone * 1000;
    let today = new Date(localTime);
    let hour = today.getHours();
    let min = today.getMinutes();
    let sec = today.getSeconds();
    let d = today.getDay();
    let m = today.getMonth();
    let date = today.getDate();
    dateTimeWeather.textContent = `${translator.shortDay[d]} ${date} ${
      translator.month[m]
    }   ${hour}:${addZero(min)}:${addZero(sec)}`;
    firstDay.textContent = `${translator.fullDay[getFullDay(d + 1)]}`;
    secondDay.textContent = `${translator.fullDay[getFullDay(d + 2)]}`;
    thirdDay.textContent = `${translator.fullDay[getFullDay(d + 3)]}`;
    setTimeout( () => {
        showTime(checkRu, timezone)}
        , 1000);
    
  }
  
  function addZero(n) {
    return (parseInt(n, 10) < 10 ? "0" : "") + n;
  }
  
  function getFullDay(n) {
    return n % 7;
  }