import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./Weather.css";

// Reminder: Store API keys securely in environment variables in production.
const API_KEY = process.env.REACT_APP_API_KEY;


console.log("API_KEY:", API_KEY); // Log

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

      console.log(response);

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
          <h2>{weatherData.name}</h2>
          <p>{weatherData.weather[0].description}</p>
          <p>Temperature: {(weatherData.main.temp - 273.15).toFixed(2)}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};
