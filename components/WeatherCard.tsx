import React from "react";
import styled from "styled-components";

export interface WeatherCardProps {
  // TODO remove unused
  main: {
    feels_like: number;
    humidity: number;
    pressure: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  date: number;
  city: string;
  wind: { deg: number; speed: number };
  condition: {
    main: string;
    description: string;
    icon: string; // TODO maybe remove
  };
}

// TODO define interfaces if you can
// TODO handle the dates
const Header = ({ city, date }: any) => (
  <div>
    {city} as of {new Date(date).toLocaleTimeString()}
  </div>
);

// TODO look at semantic html
// TODO look at wind degree conversion
const Today = ({
  main: { temp, temp_max, temp_min },
  wind: { speed, deg },
  condition: { main, description },
}) => (
  <section>
    <div>
      <div>{temp} Superscript degrees</div>
      <div>{`${main} with ${description}`}</div>
      <div>{`Day ${temp_max} Night ${temp_min}`}</div>
      <div>
        Wind speed: {speed} with {deg} degrees
      </div>
    </div>
    <div>Weather mood Icon for {description} here</div>
  </section>
);

const Forecast = () => (
  <section>
    <div className="Forecast__flex__container">
      <div className="Forecast__daily">
        <div>Date of the day</div>
        <div>max</div>
        <div>min</div>
        <div>mood icon</div>
        <div>extra stuff</div>
      </div>
      <div className="Forecast__daily">
        <div>Date of the day</div>
        <div>max</div>
        <div>min</div>
        <div>mood icon</div>
        <div>extra stuff</div>
      </div>
    </div>
  </section>
);

// TODO add storyboard
// TODO maybe refresh the clock every minute or second : )
const WeatherCard: React.FC<WeatherCardProps> = ({
  main,
  date,
  city,
  wind,
  condition,
}) => {
  console.log({ date });
  return (
    <WeatherCardWrapper>
      <Header city={city} date={date} />
      <Today main={main} wind={wind} condition={condition} />
      <Forecast />
    </WeatherCardWrapper>
  );
};

const WeatherCardWrapper = styled.div``;

export default WeatherCard;
