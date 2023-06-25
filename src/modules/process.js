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

const METRIC = {
  temp: "°C",
  wind: " kph",
};

const IMPERIAL = {
  temp: "°F",
  wind: " mph",
};

function modify(dataObj, propsToCallbacks) {
  const clone = structuredClone(dataObj);

  Object.entries(clone).forEach(([key, value]) => {
    clone[key] = propsToCallbacks[key]?.(value) ?? value;
  });

  return clone;
}

export default function processData(dataObj, imperial) {
  const unitObj = imperial ? IMPERIAL : METRIC;

  const processTime = (time) =>
    format(parseISO(time), "EEEE, MMMM d, y 'at' HH:mm");

  const processWeatherCode = (code) => WEATHERCODE[code];
  const processTemp = (temp) => Math.round(temp) + unitObj.temp;
  const processPercentage = (percentage) => percentage + "%";
  const processWind = (wind) => wind + unitObj.wind;
  const processUV = (uv) => uv.toFixed(1);

  const processWeatherCodeArray = (arr) => arr.map(processWeatherCode);
  const processTempArray = (arr) => arr.map(processTemp);

  return modify(dataObj, {
    lastUpdateTime: processTime,
    currDesc: processWeatherCode,
    currTemp: processTemp,
    currApparTemp: processTemp,
    currHumidity: processPercentage,
    currPrecip: processPercentage,
    currWind: processWind,
    currUV: processUV,
    nextDescs: processWeatherCodeArray,
    nextTempsHigh: processTempArray,
    nextTempsLow: processTempArray,
  });
}
