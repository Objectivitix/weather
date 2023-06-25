const GEOCODING = "https://geocoding-api.open-meteo.com/v1/search?";
const WEATHER = "https://api.open-meteo.com/v1/forecast?";
const LOCATION_CACHE = "locationCache";

export class LocationError extends Error {}

async function getLocationData(query) {
  // Cache is weird... is it making the site faster?

  const cache = await caches.open(LOCATION_CACHE);

  const URL =
    GEOCODING +
    new URLSearchParams({
      count: 1,
      name: query,
    });

  let response = await cache.match(URL);

  if (!response) {
    await cache.add(URL);
    response = await cache.match(URL);
  }

  const data = await response.json();

  if (!("results" in data)) {
    throw new LocationError("cannot find location");
  }

  return data;
}

async function getWeatherData(latitude, longitude, timezone, imperial) {
  const standardOptions = {
    current_weather: true,
    forecast_days: 8,
    hourly: [
      "apparent_temperature",
      "precipitation_probability",
      "relativehumidity_2m",
      "uv_index",
    ],
    daily: ["temperature_2m_max", "temperature_2m_min", "weathercode"],
    latitude,
    longitude,
    timezone,
  };

  const imperialUnits = {
    temperature_unit: "fahrenheit",
    windspeed_unit: "mph",
  };

  const response = await fetch(
    WEATHER +
      new URLSearchParams({
        ...standardOptions,
        ...(imperial ? imperialUnits : {}),
      }),
  );

  return response.json();
}

export default async function getData(query, imperial) {
  const {
    results: [{ name: city, country, latitude, longitude, timezone }],
  } = await getLocationData(query);

  // [Symbol()] guarantees a non-existent property because
  // data is retrieved from JSON. Hacky, but very cool, so
  // we're keeping it.

  const {
    current_weather: {
      time: lastUpdateTime,
      weathercode: currDesc,
      temperature: currTemp,
      windspeed: currWind,
    },
    hourly: {
      time: hours,
      [Symbol()]: currIndex = hours.indexOf(lastUpdateTime),
      apparent_temperature: { [currIndex]: currApparTemp },
      relativehumidity_2m: { [currIndex]: currHumidity },
      precipitation_probability: { [currIndex]: currPrecip },
      uv_index: { [currIndex]: currUV },
    },
    daily: {
      weathercode: [, ...nextDescs],
      temperature_2m_max: [, ...nextTempsHigh],
      temperature_2m_min: [, ...nextTempsLow],
    },
  } = await getWeatherData(latitude, longitude, timezone, imperial);

  return {
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
    nextDescs,
    nextTempsHigh,
    nextTempsLow,
  };
}
