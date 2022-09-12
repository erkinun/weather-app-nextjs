import type { NextApiRequest, NextApiResponse } from "next";

import { fetchWeather } from "../../utils/utils";
import { fetchFromCache, saveToCache } from "./cache";

interface WeatherResponse {}

const fetchApi = async (
  req: NextApiRequest,
  res: NextApiResponse<WeatherResponse>,
) => {
  let data;

  data = null;

  if (!data) {
    const { location } = req.query;
    let q;

    if (Array.isArray(location)) {
      q = location[0];
    } else {
      q = location;
    }
    data = await fetchWeather(q);
  }

  !data.ts && saveToCache(data);

  res.status(200).json({
    ...data,
  });
};

export default fetchApi;