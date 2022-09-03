# Ember Technical Assessment

## Decisions made

London city and metric units are chosen for this exercise. Adding a new location is quite easy as the open weather api accepts a `q` parameter that can be a city, county etc.

### Other potential improvements

- As the potential number of component grows, [Storybook](https://storybook.js.org/) could be used to develop components in isolation. This can be further integrated with [Percy](https://percy.io/) to provide testing.
- Cache could be moved to an external Database like Redis/Mongo/Postgres
- Calling the api route from server side props is discouraged [here](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props#getserversideprops-or-api-routes), so we can just fetch the weather data directly from the root server side generation.

## Current Setup

This repository has been setup with an almost blank Next.JS project using
Typescript and Styled Components. As you complete the tasks outlined below
please use whatever tooling you find most comfortable for styling your frontend
UI- however we do recommend using Typescript if possible.

Additionally feel to free to add any additional tooling that you prefer such
as husky, eslint, node-fetch etc.

## Technical Approach

Whilst this project is very small and the question set lean- if you are more
familiar working with more robust solutions such as redux please feel to use
them if they help you with your solution. Alternatively if you want to keep
the code lean this is also okay.

## Tasks

### 1. Setup the /api/weather route

Using a free weather API, such as [OpenWeatherMap](https://openweathermap.org/api/one-call-3)
setup the `api/weather` endpoint to return weather details, please use a
location of your choosing, no need to process a search query.

Data returned at minimum should be:

- Current Weather
  - Temperature
  - Wind Speed & Direction
  - Descriptive (Cloudy / Partly Sunny / etc.)
- 5 Day Forecast
  - Min/Max Temp
  - Descriptive (Cloudy / Partly Sunny / etc.)

### 2. Load data from /api/weather in the root next.js route

Using any data fetching method of your choose, load the results of the weather
api into the react app, ready to be rendered into the UI

### 3. Create WeatherCard component

Create a styled react component that can display the current weather and 5 day
forecast based on the data given back by the API.

Feel free to use any icon packages such as `feather-icons` to help create a
good visual style.

Note: We're not looking for the best designed card, but please try to make it
easily readable/usable.

### 4. Allow refreshing of weather

Setup a button on the weather card, or elsewhere on the page that can trigger
a refresh of the current weather API data.

### (BONUS) 5. Setup Server Side Rendering

If not done in task #2, setup the Next.JS route to grab the API data on the
server-side.

### (BONUS) 6. Setup Server Side Cacheing of the API

Setup a basic file based cache for the weather API route that will cache
weather data for ~5 minutes.
