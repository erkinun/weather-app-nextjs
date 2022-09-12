import { API_KEY } from "./config";

export const capitalise = (str: string) =>
  str && str.length > 0 && str[0]?.toUpperCase() + str.slice(1);

export const fetchWeatherApi = async (location?: string) => {
  const weather = await fetch(`./api/weather?location=${location}`, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });

  const data = await weather.json();
  return data;
};

type SortTemp = {
  main: {
    temp_max: number;
    temp_min: number;
  };
};

export const fetchWeather = async (loc: string = "london") => {
  const geoResponse = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${loc}&appid=${API_KEY}`,
  );

  // reading the first response from the geo api
  const [{ name: locationName, lat, lon }] = await geoResponse.json();
  const weatherResponse = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`,
  );
  const { main, weather, wind, name, dt } = await weatherResponse.json();

  // 5 day forecast is available at any location on the globe. It includes weather forecast data with 3-hour step.
  const forecast = await fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`,
  );

  const { list } = await forecast.json();

  const updated = list.map((l: any) => ({
    ...l,
    dayIndex: new Date(l.dt * 1000).getDay(),
  }));
  const perDay = groupBy(updated, "dayIndex");
  const transformedForecast = Object.keys(perDay)
    .map((k) => {
      const all = perDay[k];
      const max = all.reduce(
        (agg: number, { main: { temp_max } }: SortTemp) => {
          return temp_max > agg ? temp_max : agg;
        },
        Number.NEGATIVE_INFINITY,
      );

      const min = all.reduce(
        (agg: number, { main: { temp_min } }: SortTemp) => {
          return temp_min < agg ? temp_min : agg;
        },
        Number.POSITIVE_INFINITY,
      );

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
    locationName,
    main,
    dt,
    weather,
    wind,
    name,
    forecast: transformedForecast,
  };
};

export const groupBy = function (xs: Array<any>, key: string) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
