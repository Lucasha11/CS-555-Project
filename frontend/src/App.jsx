import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState('Hoboken'); // default city
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await axios.get(`http://localhost:3000/weather/forecast/${city}`);
        setForecast(data);
      } catch (error) {
        setError('Failed to fetch weather data.');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city]); 

  const getMinMaxTemperatures = (forecast) => {
    if (forecast.length === 0) return { min: null, max: null };

    let temperatures = forecast.map(item => item.temperature);
    let minTemp = Math.min(...temperatures);
    let maxTemp = Math.max(...temperatures);

    return { min: minTemp, max: maxTemp };
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== '') {
      setCity(search);
      setSearch(''); 
    }
  };

  const { min, max } = getMinMaxTemperatures(forecast);

  return (
    <div className="app-container">
      <h1 className="app-title">Weather Forecast</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Enter city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      <h2 className="city-name">{city}</h2>

      <div className="temperature-range">
              <p>Lowest Temperature: {min}°</p>
              <p>Highest Temperature: {max}°</p>
      </div>


      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : (
        <div>
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
      )}
    </div>
  );
}

