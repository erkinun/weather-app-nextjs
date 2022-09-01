import Head from "next/head";
import { useState } from "react";

import WeatherCard from "../components/WeatherCard";
import { HOSTNAME } from "../config";

export default function Home(props: any) {
  const { weather } = props;

  const [innerWeather, setWeather] = useState(weather);
  const onClick = async () => {
    // TODO encapsulate into a function -> utils
    const weather = await fetch(`${HOSTNAME}/api/weather`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });

    const data = await weather.json();
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
      />
      {
        // TODO style this poor guy
      }
      <button onClick={onClick}>Refresh</button>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  // TODO check the cache logic - with the readme
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=5, stale-while-revalidate=59",
  );
  // TODO check if this is really the correct way of doing this
  // https://stackoverflow.com/questions/65752932/internal-api-fetch-with-getserversideprops-next-js
  const weather = await fetch(`${HOSTNAME}/api/weather`, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });

  const data = await weather.json();

  // Pass data to the page via props
  return {
    props: {
      weather: data,
    },
  };
}
