import React from "react";
import styled from "styled-components";

export interface WeatherCardProps {}

const WeatherCard: React.FC<WeatherCardProps> = (props) => {
  return (
    <WeatherCardWrapper>
      <p>I should show the weather</p>
    </WeatherCardWrapper>
  );
};

const WeatherCardWrapper = styled.div``;

export default WeatherCard;
