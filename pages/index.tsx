import Head from "next/head";
import { useState } from "react";

import WeatherCard from "../components/WeatherCard";
import { fetchWeather, fetchWeatherApi } from "../utils/utils";

type RefreshParameters = string | { lat: number; lon: number };

export default function Home(props: any) {
  const { weather } = props;

  console.log({ weather })

  const [innerWeather, setWeather] = useState(weather);
  const refreshWeather = async (params: RefreshParameters) => {
    const data = await fetchWeatherApi(params);
    if (!data.error) {
      setWeather(data);
    }
    else {
      console.error(data.error)
    }
  };

  const {
    locationName,
    main,
    dt,
    name,
    weather: [first],
    wind,
    forecast,
  } = innerWeather;

  // TODO loading animation with wireframe
  return (
    <>
      <Head>
        <title>Weather Card App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WeatherCard
        searchLocation={(loc: string) => refreshWeather(loc)}
        searchGeoloc={(lat: number, lon: number) =>
          refreshWeather({ lat, lon })
        }
        locationName={locationName}
        main={main}
        date={dt}
        city={name}
        condition={first}
        wind={wind}
        forecast={forecast}
      />
    </>
  );
}

export async function getServerSideProps() {
  const data = await fetchWeather();

  return {
    props: {
      weather: data,
    },
  };
}
