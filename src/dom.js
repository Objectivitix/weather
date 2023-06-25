import { addDays, format } from "date-fns";

const time = document.querySelector("[data-time]");
const desc = document.querySelector(".basic__desc");
const appar = document.querySelector("[data-appar]");
const temp = document.querySelector(".basic__temp");
const humidity = document.querySelector("[data-humidity]");
const precip = document.querySelector("[data-precip]");
const wind = document.querySelector("[data-wind]");
const uv = document.querySelector("[data-uv]");

const days = document.querySelectorAll(".forecast__day");
const highs = document.querySelectorAll(".forecast__high");
const lows = document.querySelectorAll(".forecast__low");

export function renderWeek() {
  const today = new Date();

  const week = Array.from({ length: 7 }, (_, i) =>
    format(addDays(today, i + 1), "E"),
  );

  week.forEach((day, index) => {
    days[index].textContent = day;
  });
}

export function render({
  lastUpdateTime,
  currDesc,
  currTemp,
  currApparTemp,
  currHumidity,
  currPrecip,
  currWind,
  currUV,
  nextTempsHigh,
  nextTempsLow,
}) {
  time.textContent = lastUpdateTime;
  desc.textContent = currDesc;
  temp.textContent = currTemp;
  appar.textContent = currApparTemp;
  humidity.textContent = currHumidity;
  precip.textContent = currPrecip;
  wind.textContent = currWind;
  uv.textContent = currUV;

  nextTempsHigh.forEach((temperature, index) => {
    highs[index].textContent = temperature;
  });

  nextTempsLow.forEach((temperature, index) => {
    lows[index].textContent = temperature;
  });
}
