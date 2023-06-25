import { addDays, format } from "date-fns";

import getData from "./data";
import processData from "./process";

const METRIC_TEXT = "°C / kph";
const IMPERIAL_TEXT = "°F / mph";

const unitToggle = document.querySelector(".unit-toggle");

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

let prevQuery = "Kanata";
let currImperial = false;

export default function initialize() {
  bind();
  displayWeek();
  run("Kanata", false);
}

async function run(query, imperial) {
  const data = await getData(query, imperial);
  const processedData = await processData(data, imperial);

  displayData(processedData);
}

function displayData({
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

function bind() {
  unitToggle.addEventListener("click", async () => {
    currImperial = !currImperial;
    await run(prevQuery, currImperial);

    if (currImperial) {
      unitToggle.textContent = METRIC_TEXT;
    } else {
      unitToggle.textContent = IMPERIAL_TEXT;
    }
  });
}

function displayWeek() {
  const today = new Date();

  const week = Array.from({ length: 7 }, (_, i) =>
    format(addDays(today, i + 1), "E"),
  );

  week.forEach((day, index) => {
    days[index].textContent = day;
  });
}
