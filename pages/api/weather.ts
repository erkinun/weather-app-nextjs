import type { NextApiRequest, NextApiResponse } from "next";

interface WeatherResponse {}

export default (req: NextApiRequest, res: NextApiResponse<WeatherResponse>) => {
  res.status(200).json({});
};
