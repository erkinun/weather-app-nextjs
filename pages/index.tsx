import Head from "next/head";
import { useState } from "react";

import WeatherCard from "../components/WeatherCard";
import { fetchWeather } from "../utils/utils";

export default function Home(props: any) {
  const { weather } = props;

  const [innerWeather, setWeather] = useState(weather);
  const refreshWeather = async () => {
    const data = await fetchWeather();
    setWeather(data);
  };

  const {
    main,
    dt,
    name,
    weather: [first],
    wind,
    forecast,
  } = innerWeather;
  return (
    <>
      <Head>
        <title>Weather Card App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WeatherCard
        main={main}
        date={dt}
        city={name}
        condition={first}
        wind={wind}
        forecast={forecast}
        refreshWeather={refreshWeather}
      />
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const data = await fetchWeather();

  return {
    props: {
      weather: data,
    },
  };
}
