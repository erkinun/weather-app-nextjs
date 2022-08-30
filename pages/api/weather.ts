import type { NextApiRequest, NextApiResponse } from 'next'

interface WeatherResponse {}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<WeatherResponse>
) => {
  const weatherResponse = await fetch(
    'http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=988daee6a2a305a71404a1189e911173&units=metric'
  )
  const { main, weather, wind } = await weatherResponse.json()

  const forecast = await fetch(
    'http://api.openweathermap.org/data/2.5/forecast?q=London,uk&APPID=988daee6a2a305a71404a1189e911173&units=metric'
  )

  const { list } = await forecast.json()

  res.status(200).json({
    main,
    weather,
    wind,
    forecast: list.map(({ dt, main, weather }) => ({
      dt,
      main,
      weather,
    })),
  })
}
