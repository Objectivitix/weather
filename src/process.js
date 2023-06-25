import { format, parseISO } from "date-fns";

const WEATHERCODE = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  56: "Light Freezing Drizzle",
  57: "Denser Freezing Drizzle",
  61: "Light Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  66: "Light Freezing Rain",
  67: "Heavier Freezing Rain",
  71: "Slight Snowfall",
  73: "Moderate Snowfall",
  75: "Heavy Snowfall",
  77: "Snow Grains",
  80: "Slight Rain Showers",
  81: "Moderate Rain Showers",
  82: "Heavy Rain Showers",
  85: "Slight Snow Showers",
  86: "Heavy Snow Showers",
  95: "Moderate Thunderstorm",
  96: "Strong Thunderstorm",
  99: "Heavy Thunderstorm",
};

// wtf
function round(obj) {
  return JSON.parse(JSON.stringify(obj), (key, value) => {
    if (typeof value === "number" && key !== "currWind") {
      return Math.round(value);
    }

    return value;
  });
}

export const DEFAULT = {
  temp: "°C",
  wind: " kph",
};

export const ALTERNATIVE = {
  temp: "°F",
  wind: " mph",
};

export function process(dataObj, unitObj) {
  const clone = round(structuredClone(dataObj));

  clone.lastUpdateTime = format(
    parseISO(clone.lastUpdateTime),
    "EEEE, MMMM d, y 'at' HH:mm",
  );

  clone.currApparTemp += unitObj.temp;
  clone.currTemp += unitObj.temp;
  clone.currDesc = WEATHERCODE[clone.currDesc];
  clone.currWind += unitObj.wind;
  clone.currPrecip += "%";
  clone.currHumidity += "%";

  clone.nextDescs.forEach((desc, index) => {
    clone.nextDescs[index] = WEATHERCODE[desc];
  });

  clone.nextTempsMax.forEach((_, index) => {
    clone.nextTempsMax[index] += unitObj.temp;
  });

  clone.nextTempsMin.forEach((_, index) => {
    clone.nextTempsMin[index] += unitObj.temp;
  });

  return clone;
}
