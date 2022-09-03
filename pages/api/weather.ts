import type { NextApiRequest, NextApiResponse } from "next";

import { API_KEY } from "../../utils/config";
import { groupBy } from "../../utils/utils";
import { fetchFromCache, saveToCache } from "./cache";

interface WeatherResponse {}

const fetchWeather = async () => {
  const weatherResponse = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=${API_KEY}&units=metric`,
  );
  const { main, weather, wind, name, dt } = await weatherResponse.json();

  // 5 day forecast is available at any location on the globe. It includes weather forecast data with 3-hour step.
  const forecast = await fetch(
    `http://api.openweathermap.org/data/2.5/forecast?q=London,uk&APPID=${API_KEY}&units=metric`,
  );

  const { list } = await forecast.json();

  const updated = list.map((l) => ({
    ...l,
    dayIndex: new Date(l.dt * 1000).getDay(),
  }));
  const perDay = groupBy(updated, "dayIndex");
  const transformedForecast = Object.keys(perDay)
    .map((k) => {
      const all = perDay[k];
      const max = all.reduce((agg, { main: { temp_max } }) => {
        return temp_max > agg ? temp_max : agg;
      }, Number.NEGATIVE_INFINITY);

      const min = all.reduce((agg, { main: { temp_min } }) => {
        return temp_min < agg ? temp_min : agg;
      }, Number.POSITIVE_INFINITY);

      return {
        index: parseInt(k),
        descriptive: all[0].weather[0],
        dt: all[0].dt,
        max,
        min,
      };
    })
    .sort((a, b) => a.dt - b.dt);

  return {
    main,
    dt,
    weather,
    wind,
    name,
    forecast: transformedForecast,
  };
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<WeatherResponse>,
) => {
  let data;

  data = await fetchFromCache();

  if (!data) {
    data = await fetchWeather();
  }

  !data.ts && saveToCache(data);

  res.status(200).json({
    ...data,
  });
};
