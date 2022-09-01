import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

type Main = {
  feels_like: number;
  humidity: number;
  pressure: number;
  temp: number;
  temp_max: number;
  temp_min: number;
};

type Condition = {
  main: string;
  description: string;
  icon: string; // TODO maybe remove
};

export interface WeatherCardProps {
  // TODO remove unused
  main: Main;
  date: number;
  city: string;
  wind: { deg: number; speed: number };
  condition: Condition;
  forecast: Array<{ main: Main; dt: number; weather: Array<Condition> }>;
}

const HeaderDiv = styled.div`
  background-color: rgba(0, 0, 0, 0.55);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  color: #fff;
  padding: 10px 15px;
`;

const HeaderH1 = styled.div`
  display: inline;
  font-weight: 600;
  font-size: 1.125rem;
  margin-right: 10px;

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const HeaderSpan = styled.span`
  font-size: 0.8125rem;

  @media (min-width: 768px) {
    font-size: 1;
  }
`;

// TODO define interfaces if you can
// TODO handle the dates
const Header = ({ city, date }: any) => (
  <HeaderDiv>
    <HeaderH1>{city}</HeaderH1>
    <HeaderSpan>as of {new Date(date * 1000).toLocaleTimeString()}</HeaderSpan>
  </HeaderDiv>
);

const TodaySection = styled.section`
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
`;

const TodayMain = styled.div`
  text-align: left;
`;

const MainTemp = styled.div`
  font-size: 3.5rem;
  line-height: 1;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 6rem;
  }
`;

const MainInfo = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.1;
  margin-bottom: 5px;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const WindInfo = styled.div`
  font-size: 0.75rem;
  font-weight: 300;
  margin-bottom: 5px;
`;

// TODO look at semantic html
// TODO look at wind degree conversion
// TODO prep or write about different units
// TODO maybe create a utils module

const capitalise = (str) => str[0].toUpperCase() + str.slice(1);
const Today = ({
  main: { temp, temp_max, temp_min },
  wind: { speed, deg },
  condition: { main, description, icon },
}) => (
  <TodaySection>
    <TodayMain>
      <MainTemp>{Math.floor(temp)} °C</MainTemp>
      <MainInfo>{`${capitalise(description)}`}</MainInfo>
      <MainInfo>{`Day ${Math.floor(temp_max)}° • Night ${Math.floor(
        temp_min,
      )}°`}</MainInfo>
      <WindInfo>
        Wind speed: {speed} with {deg} degrees
      </WindInfo>
    </TodayMain>
    <div>
      <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt={main} />
    </div>
  </TodaySection>
);

const ForecastSection = styled.section`
  background-color: rgba(255, 255, 255, 0.2);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  padding: 10px 16px;

  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`;

const ForecastTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0px;
`;

const ForecastFlex = styled.ul`
  overflow: auto;
  display: flex;
  padding-left: 0;
  justify-content: center;
  box-sizing: border-box;
  list-style-type: none;
`;

// TODO remove the border from the last item
const ForecastListItem = styled.li`
  border-image: linear-gradient(
      180deg,
      hsla(0, 0%, 87.1%, 0) 0,
      #dedede 25%,
      #dedede 70%,
      hsla(0, 0%, 87.1%, 0) 85%,
      hsla(0, 0%, 87.1%, 0)
    )
    1 100%;
  border-style: solid;
  border-width: 0 1px 0 0;
  display: flex;
  align-items: center;
  text-align: center;
  flex-basis: 20%;
  justify-content: center;
  flex-direction: column;
  font-size: 0.75rem;
`;

const ForecastListImage = styled.img`
  width: 50px !important;
  box-sizing: border-box;
`;

const ForecastMax = styled.div`
  font-size: 1rem;

  @media (min-width: 768px) {
    font-size: 2.25rem;
  }
`;

// TODO fix the min max temperature
const Forecast = ({ forecast }) => (
  <ForecastSection>
    <ForecastTitle>5 Day Forecast</ForecastTitle>
    <ForecastFlex>
      {forecast.map(
        ({
          main: { temp_max, temp_min },
          dt,
          weather: [{ main, description, icon }],
        }) => (
          <ForecastListItem key={dt}>
            <div>{dayjs(new Date(dt * 1000)).format("ddd DD")}</div>
            <ForecastMax>{Math.floor(temp_max)}°C</ForecastMax>
            <div>{Math.floor(temp_min)}°C</div>
            <div>
              <ForecastListImage
                src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={main}
              />
            </div>
            <div>{capitalise(description)}</div>
          </ForecastListItem>
        ),
      )}
    </ForecastFlex>
  </ForecastSection>
);

// TODO add storyboard - readme
const WeatherCard: React.FC<WeatherCardProps> = ({
  main,
  date,
  city,
  wind,
  condition,
  forecast,
}) => {
  return (
    <WeatherCardWrapper>
      <Header city={city} date={date} />
      <Today main={main} wind={wind} condition={condition} />
      <Forecast forecast={forecast} />
    </WeatherCardWrapper>
  );
};

const WeatherCardWrapper = styled.div`
  margin: 12px 10px;
  line-height: 1.5;
  border-radius: 6px;
  background-color: #58baff;
  color: #fff;

  @media (min-width: 768px) {
    max-width: 768px;
    margin: auto;
  }
`;

export default WeatherCard;
