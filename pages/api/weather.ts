import type { NextApiRequest, NextApiResponse } from "next";
import { API_KEY } from "../../config";

interface WeatherResponse {}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<WeatherResponse>,
) => {
  const weatherResponse = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=${API_KEY}&units=metric`,
  );
  const { main, weather, wind, name, dt } = await weatherResponse.json();

  // 5 day forecast is available at any location on the globe. It includes weather forecast data with 3-hour step.
  const forecast = await fetch(
    `http://api.openweathermap.org/data/2.5/forecast?q=London,uk&APPID=${API_KEY}&units=metric`,
  );

  const { list } = await forecast.json();

  if (list.length !== 40) {
    throw new Error("Forecast data should have 40 forecasts with 3 hour steps");
  }
  const fiveDayForecast = [list[0], list[8], list[16], list[24], list[32]];

  res.status(200).json({
    main,
    dt,
    weather,
    wind,
    name,
    forecast: fiveDayForecast.map(({ dt, main, weather }) => ({
      dt,
      main,
      weather,
    })),
  });
};
