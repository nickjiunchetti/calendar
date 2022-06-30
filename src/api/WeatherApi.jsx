const axios = require('axios')

const accuWeatherApiKey = '8POqsSyGVi1q1DfImvBkchkvbg5A2Ajc'
const dapikey = 'B22XET7K5HY6FQ5BVFAEWGWQ8'

export async function getCities(text) {
  try {
    const response = await axios.get(
      'http://dataservice.accuweather.com/locations/v1/cities/search',
      {
        params: {
          apikey: accuWeatherApiKey,
          q: text,
        },
      }
    )
    return response
  } catch (error) {
    console.error(error)
  }
}

export async function getCityWeather(city, time) {
  try {
    const response = await axios.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${time}`,
      {
        params: {
          key: dapikey,
        },
      }
    )
    return response
  } catch (error) {
    console.error(error)
  }
}
