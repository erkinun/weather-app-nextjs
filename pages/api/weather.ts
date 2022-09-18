import type { NextApiRequest, NextApiResponse } from "next";

import { fetchWeather, getFromArrayOrUndefined } from "../../utils/utils";

interface WeatherResponse {}

const fetchApi = async (
  req: NextApiRequest,
  res: NextApiResponse<WeatherResponse>,
) => {
  let data;

  data = null;

  if (!data) {
    // TODO put the cache back at some point
    const { location, lat, lon } = req.query;
    let q;

    if (Array.isArray(location)) {
      q = location[0];
    } else {
      q = location;
    }
    data = await fetchWeather(
      q,
      parseFloat(getFromArrayOrUndefined(lat, "0")),
      parseFloat(getFromArrayOrUndefined(lon, "0")),
    );
  }

  res.status(200).json({
    ...data,
  });
};

export default fetchApi;
