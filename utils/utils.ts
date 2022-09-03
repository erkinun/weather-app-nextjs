import { HOSTNAME } from "./config";

export const capitalise = (str: string) =>
  str && str.length > 0 && str[0]?.toUpperCase() + str.slice(1);

export const fetchWeather = async () => {
  const weather = await fetch(`${HOSTNAME}/api/weather`, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });

  const data = await weather.json();
  return data;
};

export const groupBy = function (xs: Array<any>, key: string) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
