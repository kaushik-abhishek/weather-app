import React, { useState } from "react";
import { FaSearch, FaWind } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { WiHumidity } from "react-icons/wi";
import "./Weather.css";

// Reminder: Store API keys securely in environment variables in production.
const API_KEY = process.env.REACT_APP_API_KEY;

export const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeatherData(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeatherData(null);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
      } else {
        setError(data.message || "City not found. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while fetching data. Please try again.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="city">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="city-input"
        />
        <button
          onClick={fetchData}
          className="search-button"
          disabled={loading}
        >
          {loading ? "Loading..." : <FaSearch />}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {weatherData && (
        <div className="content">
          <div className="weather-image">
            <img
              alt="weather-icon"
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0]?.icon}@2x.png`}
            />
            <h3 className="desc">{weatherData.weather[0].description}</h3>
          </div>
          <div className="weather-temp">
            <h2>{(weatherData.main.temp - 273.15).toFixed(2)}°C</h2>
          </div>
          <div className="weather-city">
            <div className="location">
              <MdLocationOn className="location-icon" />
            </div>
            <p>
              {weatherData.name}, <span>{weatherData.sys.country}</span>
            </p>
          </div>
          <div className="weather-stats">
            <div className="wind">
              <div className="wind-icon">
                <FaWind></FaWind>
              </div>
              <h3 className="wind-speed">{weatherData.wind.speed} m/s</h3>
              <h3 className="wind-heading">Wind Speed</h3>
            </div>
            <div className="humidity">
              <div className="humidity-icon">
                <WiHumidity />
              </div>
              <h3 className="humidity-percentage">
                {weatherData.main.humidity}%
              </h3>
              <h3 className="humidity-heading">Humidity</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
