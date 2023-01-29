import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import Image from "next/image";
import {
  tempSuffix,
  windDirection,
  windSpeed as windSpeedUnit,
} from "../utils/config";
import { capitalise } from "../utils/utils";

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
  icon: string;
};

type Forecast = {
  index: number;
  descriptive: Condition;
  dt: number;
  max: number;
  min: number;
};
type Forecasts = Array<Forecast>;

type Wind = { deg: number; speed: number };
// TODO change wind speed to km/h
// TODO there's an error with the main temperature reading, check out forecast too
// TODO figure out why the icons change from day to night
// TODO replace the icons with something nicer
// TODO divide the components into their own files
export interface WeatherCardProps {
  locationName: string;
  main: Main;
  date: number;
  city: string;
  wind: Wind;
  condition: Condition;
  forecast: Forecasts;
  searchLocation: (loc: string) => {};
  searchGeoloc: (lat: number, lon: number) => {};
}

const HeaderDiv = styled.div`
  background-color: rgba(0, 0, 0, 0.55);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  color: #fff;
  padding: 10px 15px;
`;

const CityTimeSection = styled.section`
  display: flex;
  align-items: center;
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

const HeaderSearch = styled.section`
  @media (min-width: 768px) {
    display: flex;
  }

  input[type="text"] {
    display: block;
    padding: 10px;
    margin: 10px 0;
    border: 0;
    border-radius: 6px;
    box-shadow: 0 0 15px 4px rgba(255, 255, 255, 0.5);
    width: 100%;

    font-family: inherit;
    font-size: inherit;

    @media (min-width: 768px) {
      width: 300px;
    }
  }
`;

const GeoSection = styled.section`
  padding: 10px 0;
  margin: 10px 0;

  @media (min-width: 768px) {
    padding: 10px;
  }
`;

type HeaderProps = {
  city: string;
  date: number;
  onSearch: () => void;
  onGeoLoc: (coords: { lat: number; lon: number }) => void;
};
const Header = React.forwardRef<HTMLInputElement, HeaderProps>(function Header(
  { city, date, onSearch, onGeoLoc },
  ref,
) {
  const [timeoutId, setTimeoutId] = useState(0);

  const handleKey = (key: string) => {
    if (key === "Enter") {
      onSearch();
    } else {
      timeoutId && clearTimeout(timeoutId);
      const id = window.setTimeout(() => onSearch(), 500);
      setTimeoutId(id);
    }
  };

  const turnOnGeoLoc = (checked: Boolean) => {
    if (checked) {
      navigator.geolocation.getCurrentPosition(
        function success(position) {
          console.log({ position });
          onGeoLoc({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        function error(e) {
          console.log("some kind of failure: ", e);
        },
      );
    }
    localStorage.setItem("geoLocation", checked.toString());
    setGeoLocation(checked as boolean);
  };
  const [geoLocation, setGeoLocation] = useState<boolean>(false);
  useEffect(() => {
    setGeoLocation(localStorage.getItem("geoLocation") === "true");
  }, []);
  return (
    <HeaderDiv>
      <HeaderSearch>
        <input
          ref={ref}
          onKeyDown={(e) => handleKey(e.key)}
          onBlur={() => onSearch()}
          type="text"
          name="location"
          placeholder="Search for an address"
        />
        <GeoSection>
          <input
            checked={geoLocation}
            type="checkbox"
            name="geoLocation"
            onChange={(e) => turnOnGeoLoc(e.target.checked)}
          />
          <label htmlFor="location">Use my location</label>
        </GeoSection>
      </HeaderSearch>
      <CityTimeSection>
        <HeaderH1>{city}</HeaderH1>
        <HeaderSpan>
          as of {new Date(date * 1000).toLocaleTimeString()}
        </HeaderSpan>
      </CityTimeSection>
    </HeaderDiv>
  );
});

const TodaySection = styled.section`
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;

  @media (min-width: 768px) {
    justify-content: space-evenly;
  }
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

type TodayProps = {
  main: Main;
  wind: Wind;
  condition: Condition;
};

const convertMetersPerSecondToKilometersPerHour = (metersPerSecond: number) =>
  Math.floor(metersPerSecond * 3.6);

const Today: React.FC<TodayProps> = ({
  main: { temp, temp_max, temp_min },
  wind: { speed, deg },
  condition: { main, description, icon },
}) => (
  <TodaySection>
    <TodayMain>
      <MainTemp>
        {Math.floor(temp)} {tempSuffix}
      </MainTemp>
      <MainInfo>{`${capitalise(description)}`}</MainInfo>
      <MainInfo>{`Day ${Math.floor(temp_max)}${tempSuffix} • Night ${Math.floor(
        temp_min,
      )}${tempSuffix}`}</MainInfo>
      <WindInfo>
        Wind: {convertMetersPerSecondToKilometersPerHour(speed)} {windSpeedUnit}{" "}
        {windDirection(deg)} winds
      </WindInfo>
    </TodayMain>
    <div>
      <Image
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={main}
        width={100}
        height={100}
      />
    </div>
  </TodaySection>
);

const ForecastSection = styled.section`
  background-color: rgba(255, 255, 255, 0.2);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  padding: 10px 16px;
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
  justify-content: initial;
  flex-direction: column;
  font-size: 0.75rem;

  &:last-child {
    border-right-width: 0px;
  }
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

type ForecastProps = {
  forecast: Forecasts;
};
const Forecast: React.FC<ForecastProps> = ({ forecast: forecasts }) => (
  <ForecastSection>
    <ForecastTitle>5 Day Forecast</ForecastTitle>
    <ForecastFlex>
      {forecasts
        .slice(1)
        .map(({ max, min, dt, descriptive: { main, description, icon } }) => (
          <ForecastListItem key={dt}>
            <div>{dayjs(new Date(dt * 1000)).format("ddd DD")}</div>
            <ForecastMax>
              {Math.floor(max)}
              {tempSuffix}
            </ForecastMax>
            <div>
              {Math.floor(min)}
              {tempSuffix}
            </div>
            <div>
              <ForecastListImage
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={main}
              />
            </div>
            <div>{capitalise(description)}</div>
          </ForecastListItem>
        ))}
    </ForecastFlex>
  </ForecastSection>
);

// TODO best practice for styled components?
// TODO best practice for nextjs apps?
const Button = styled.button`
  background-color: rgba(0, 0, 0, 0.55);
  border-radius: 6px;
  color: #fff;
  padding: 10px 15px;
  margin: 10px 15px;

  font-weight: 600;
  font-size: 1.125rem;
  margin-right: 10px;

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const WeatherCard: React.FC<WeatherCardProps> = ({
  main,
  date,
  wind,
  condition,
  forecast,
  searchLocation,
  searchGeoloc,
  locationName,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSearch = () => {
    const searchVal = inputRef?.current?.value;
    searchVal && searchVal !== "" && searchLocation(searchVal);
  };
  const handleGeoLoc = ({ lat, lon }: { lat: number; lon: number }) => {
    lat && lon && searchGeoloc(lat, lon);
  };
  return (
    <WeatherCardWrapper>
      <Header
        ref={inputRef}
        city={locationName}
        date={date}
        onSearch={handleSearch}
        onGeoLoc={handleGeoLoc}
      />
      <Today main={main} wind={wind} condition={condition} />
      <Forecast forecast={forecast} />
      <Button onClick={handleSearch}>Refresh</Button>
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
