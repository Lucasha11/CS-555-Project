import React, { useState } from 'react';
import { Cloud, MapPin, Clock, Loader2 } from 'lucide-react';
import './App.css';

export default function WeatherForecast() {
  const [location, setLocation] = useState('');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchForecast = async () => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError('');
    setForecast(null);

    try {
      const response = await fetch(`http://localhost:3000/weather/hourly?location=${encodeURIComponent(location)}`);
      
      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);
      
      if (!response.ok) {
        throw new Error(responseText || 'Failed to fetch forecast');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Server returned invalid JSON: ' + responseText.substring(0, 100));
      }
      
      setForecast(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchForecast();
    }
  };

  return (
    <div className="weather-app">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="header-title">
            <Cloud size={40} />
            <h1>Hourly Weather</h1>
          </div>
          <p className="header-subtitle">Get detailed hourly forecasts for any location</p>
        </div>

        {/* Search Form */}
        <div className="search-section">
          <div className="search-bar">
            <div className="input-wrapper">
              <MapPin className="input-icon" size={20} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter city name (e.g., London, New York)"
                className="search-input"
              />
            </div>
            <button
              onClick={fetchForecast}
              disabled={loading}
              className="search-button"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="spinner" />
                  Loading...
                </>
              ) : (
                'Get Forecast'
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Forecast Results */}
        {forecast && forecast.length > 0 && (
          <div className="forecast-section">
            <div className="forecast-header">
              <h2>
                <MapPin size={24} />
                {location}
              </h2>
              <p>Showing {forecast.length} hourly forecasts</p>
            </div>

            <div className="forecast-grid">
              {forecast.map((hour, index) => (
                <div key={index} className="forecast-card">
                  <div className="card-time">
                    <Clock size={20} />
                    <div className="time-text">{hour.time}</div>
                  </div>
                  <div className="card-temp">{hour.temp}°</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!forecast && !loading && !error && (
          <div className="empty-state">
            <Cloud size={96} className="empty-icon" />
            <p>Enter a location to see the hourly forecast</p>
          </div>
        )}
      </div>
    </div>
  );
}
