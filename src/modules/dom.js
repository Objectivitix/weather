import { addDays, format } from "date-fns";

import getData, { LocationError } from "./data";
import processData from "./process";

const ENTER = "Enter";

const METRIC_TEXT = "°C / kph";
const IMPERIAL_TEXT = "°F / mph";

const searchControl = document.querySelector(".search__control");
const searchEnter = document.querySelector(".search__enter");
const searchError = document.querySelector(".search__error");

const unitToggle = document.querySelector(".unit-toggle");

const location = document.querySelector(".header__location");
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

let currQuery = "Kanata";
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
  city,
  country,
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
  location.textContent = `${city}, ${country}`;
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
    run(currQuery, currImperial);

    if (currImperial) {
      unitToggle.textContent = METRIC_TEXT;
    } else {
      unitToggle.textContent = IMPERIAL_TEXT;
    }
  });

  searchEnter.addEventListener("click", onEnter);
  document.addEventListener("keyup", (evt) => {
    if (evt.key === ENTER) {
      onEnter();
    }
  });
}

async function onEnter() {
  const tentative = searchControl.value;

  if (!(tentative && /\S/.test(tentative))) {
    displayError("Location input cannot be empty.");
    return;
  }

  try {
    await run(tentative, currImperial);
    currQuery = tentative;
    searchControl.value = "";
  } catch (err) {
    if (err instanceof LocationError) {
      displayError("Cannot find this location.");
      return;
    }

    displayError("Sorry! There was an error.");
  }
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

function displayError(message) {
  searchError.textContent = message;

  searchControl.addEventListener(
    "input",
    () => {
      searchError.textContent = "";
    },
    { once: true },
  );
}
