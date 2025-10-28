import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config(); 

function unixToHHMM(unixSeconds) {
  const date = new Date(unixSeconds * 1000);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

function kelvinToFahrenheit(kelvin) {
  if (typeof kelvin !== 'number' || isNaN(kelvin)) {
    throw new TypeError('Input must be a valid number');
  }
  return ((kelvin - 273.15) * 9/5) + 32;
}

/**
 * Converts timestamp to day of the week.
 * @param {number} timestamp 
 * @returns {string} - Day of the week
 */
function getDayOfWeek(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}


export async function getDailyForecast(location) {
  if (!location || typeof location !== 'string'){
    throw new Error('Location must be a valid string')
  }

  const apikey = process.env.apikey;


  const { data } = await axios.get(`https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${location}&appid=${apikey}`);


  const result = {}


  for (let i = 0; i < 24; i++){
    const time = unixToHHMM(data.list[i].dt);
    const temp = kelvinToFahrenheit(data.list[i].main.temp)
    result[time] = Math.round(temp);
  }


  return result;
};

/**
 * Fetches 10-day high/low temperature forecasts for a given location.
 * @param {string} location 
 * @returns {Array} - Object array of 10-day high/low temperature forecasts.
 */
export async function getTenDayForecast(location) {
  if (!location || typeof location != 'string') {
    throw new Error('Locaiton must be a valid string')
  }

  const apikey = process.env.apikey;

  try {

    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${location}&cnt=10&appid=${apikey}`)
    
    if(!data.list || data.list.length == 0) {
      throw new Error('Data not available for this location')
    }

    const result = []

    for (let i = 0; i < data.list.length; i++) {
      const dayData = data.list[i];

      const day = getDayOfWeek(dayData.dt);
      const high = Math.round(kelvinToFahrenheit(dayData.temp.max));
      const low = Math.round(kelvinToFahrenheit(dayData.temp.min));

      result.push({
        day: day,
        high: high,
        low: low
      });
    }

    return result;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('API Error:', error.response.data);
    } else {
      console.error('Error fetching forecast:', error.message);
    }
    throw new Error('Failed to fetch weather data.');
  }
}
