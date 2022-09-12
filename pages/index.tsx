import Head from "next/head";
import { useState } from "react";

import WeatherCard from "../components/WeatherCard";
import { fetchWeather, fetchWeatherApi } from "../utils/utils";

export default function Home(props: any) {
  const { weather } = props;

  const [innerWeather, setWeather] = useState(weather);
  const refreshWeather = async (location: string = "london") => {
    const data = await fetchWeatherApi(location);
    setWeather(data);
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
