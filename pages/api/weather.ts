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

  console.log({ name });

  const forecast = await fetch(
    `http://api.openweathermap.org/data/2.5/forecast?q=London,uk&APPID=${API_KEY}&units=metric`,
  );

  const { list } = await forecast.json();

  res.status(200).json({
    main,
    dt,
    weather,
    wind,
    name,
    forecast: list.map(({ dt, main, weather }) => ({
      dt,
      main,
      weather,
    })),
  });
};
