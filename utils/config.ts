export const HOSTNAME = process.env.HOSTNAME || "http://localhost:3000";

export const API_KEY = process.env.API_KEY || console.warn("NO API KEY FOUND");

const units = {
  metric: {
    temperature: "°C",
    wind: "m/s",
  },
};

const UNIT = process.env.UNITS || "metric";

export const tempSuffix = units[UNIT]?.temperature;

export const windSpeed = units[UNIT]?.wind;

export const windDirection = (deg: number) => {
  if (deg === 0) {
    return "northly";
  } else if (deg < 90) {
    return "north easternly";
  } else if (deg === 90) {
    return "easternly";
  } else if (deg < 180) {
    return "south easternly";
  } else if (deg === 180) {
    return "southernly";
  } else if (deg < 270) {
    return "south westernly";
  } else if (deg === 270) {
    return "westernly";
  } else {
    return "north westernly";
  }
};
