import "./styles.css";

const GEOCODING = "https://geocoding-api.open-meteo.com/v1/search?";
const WEATHER = "https://api.open-meteo.com/v1/forecast?";

async function getLocationData(query) {
  const response = await fetch(
    GEOCODING +
      new URLSearchParams({
        count: 1,
        name: query,
      }),
  );

  const data = await response.json();

  if (!("results" in data)) {
    throw new Error("cannot find location");
  }

  return data;
}

async function getWeatherData(latitude, longitude, timezone) {
  const response = await fetch(
    WEATHER +
      new URLSearchParams({
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
      }),
  );

  return response.json();
}

export default async function getData(query) {
  const {
    results: [{ latitude, longitude, timezone }],
  } = await getLocationData(query);

  console.log(await getWeatherData(latitude, longitude, timezone));

  // [Symbol()] guarantees a non-existent property because
  // data is retrieved from JSON. Hacky, but very cool, so
  // we're keeping it.

  const {
    current_weather: {
      temperature: currTemp,
      time: lastUpdateTime,
      windspeed: currWind,
      weathercode: currDesc,
    },
    hourly: {
      time: hours,
      [Symbol()]: currIndex = hours.indexOf(lastUpdateTime),
      apparent_temperature: { [currIndex]: currApparTemp },
      precipitation_probability: { [currIndex]: currPrecip },
      relativehumidity_2m: { [currIndex]: currHumidity },
      uv_index: { [currIndex]: currUV },
    },
    daily: {
      temperature_2m_max: [, ...nextTempsMax],
      temperature_2m_min: [, ...nextTempsMin],
      weathercode: [, ...nextDescs],
    },
  } = await getWeatherData(latitude, longitude, timezone);

  return {
    lastUpdateTime,
    currApparTemp,
    currTemp,
    currWind,
    currDesc,
    currPrecip,
    currHumidity,
    currUV,
    nextDescs,
    nextTempsMax,
    nextTempsMin,
  };
}
