import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/weather/forecast/Hoboken");
        setForecast(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-title">Weather Forecast for Hoboken</h1>
      <div className="forecast-container">
        {forecast.map((item, idx) => {
          const key = item.id ?? item.time ?? item.url ?? idx;
          return (
            <div className="forecast-item" key={key}>
              <p className="forecast-time">{item.time}</p>
              <p className="forecast-temperature">{item.temperature}°</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
