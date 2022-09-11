import type { NextApiRequest, NextApiResponse } from "next";

import { fetchWeather, groupBy } from "../../utils/utils";
import { fetchFromCache, saveToCache } from "./cache";

interface WeatherResponse {}

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
