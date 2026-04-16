"use client";

import { useState, useEffect } from "react";

export const WeatherCard = () => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherLocation, setWeatherLocation] = useState<any | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          setError("Unable to access location. Please allow location access.");
        },
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather(location.lat, location.lon);
    }
  }, [location]);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${lat},${lon}`,
      );
      const data = await response.json();
      console.log("Weather Data:", data);
      console.log("Weather Data Current:", data?.current);
      setWeather(data?.current);
      setWeatherLocation(data?.location);
    } catch (error) {
      setError("Error fetching weather data.");
      console.error("Error fetching weather:", error);
    }
  };

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <>
      {weather && (
        <div className="mb-6 bg-white/10 dark:bg-black/10 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
          <div className="flex items-center">
            <img
              src={weather?.condition?.icon}
              alt="Weather Icon"
              className="w-16 h-16 mr-4"
            />
            <div>
              <p className="text-lg">Temperature: {weather?.temp_c}°C</p>
              <p className="text-lg">Condition: {weather?.condition?.text}</p>
              <p className="text-lg">Zone: {weatherLocation?.tz_id}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
