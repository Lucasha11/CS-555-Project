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


export async function getDailyForecast(location) {
  if (!location || typeof location !== 'string'){
    throw new Error('Location must be a valid string')
  }

  const apikey = process.env.apikey;


  const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apikey}`);


  const result = {}


  for (let i = 0; i < 8; i++){
    const time = unixToHHMM(data.list[i].dt);
    const temp = kelvinToFahrenheit(data.list[i].main.temp)
    result[time] = Math.round(temp);
  }


  return result;
};