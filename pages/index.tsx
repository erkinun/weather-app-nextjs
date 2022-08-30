import Head from "next/head";

import WeatherCard from "../components/WeatherCard";
import { HOSTNAME } from "../config";

export default function Home(props: any) {
  console.log(props);
  return (
    <>
      <Head>
        <title>Weather Card App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WeatherCard />
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");
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
