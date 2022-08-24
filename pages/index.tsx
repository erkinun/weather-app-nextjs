import Head from "next/head";
import WeatherCard from "../components/WeatherCard";

export default function Home() {
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
