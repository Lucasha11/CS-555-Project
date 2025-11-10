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

export async function getCoordinates(city) {
  if (!city || typeof city !== 'string') {
    throw new Error('City must be a valid string');
  }

  const apikey = process.env.apikey;
  const url = `https://pro.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apikey}`;

  const { data } = await axios.get(url);

  if (!data || data.length === 0) {
    throw new Error('Location not found');
  }

  const { lat, lon, name, country } = data[0];
  return { lat, lon, name, country };
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

export async function getCurrentWeather(lat, lon) {
  if (!lat || !lon) {
    throw new Error('Latitude and longitude are required');
  }

  const apikey = process.env.apikey;

  const { data } = await axios.get(`https://pro.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`);

  const locationName = `${data.name}, ${data.sys.country}`;
  const currentTemp = kelvinToFahrenheit(data.main.temp);
  const highTemp = kelvinToFahrenheit(data.main.temp_max);
  const lowTemp = kelvinToFahrenheit(data.main.temp_min);

  return {
    location: locationName,
    current: Math.round(currentTemp),
    high: Math.round(highTemp),
    low: Math.round(lowTemp),
  };
}


export async function getHourlyForecast(location) {
  if (!location || typeof location !== 'string'){
    throw new Error('Location must be a valid string');
  }

  const apikey = process.env.apikey;

  try {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apikey}`);

    const result = [];
    for (let i = 0; i < 8; i++) {  
      const time = unixToHHMM(data.list[i].dt);
      const temp = kelvinToFahrenheit(data.list[i].main.temp);
      result.push({ time, temp: Math.round(temp) }); 
    }

    return result; 
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);
    throw new Error('Failed to fetch hourly forecast');
  }

}

