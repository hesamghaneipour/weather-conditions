
import { WeatherData, ForecastDay } from '../types';

const conditions = ['صاف', 'نیمه ابری', 'ابری', 'بارانی', 'طوفانی', 'برفی'];

export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  // Use OpenStreetMap's Nominatim for global geocoding
  let lat = 35.6892;
  let lon = 51.3890;
  let displayName = city;

  try {
    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`);
    const geoData = await geoResponse.json();
    
    if (geoData && geoData.length > 0) {
      lat = parseFloat(geoData[0].lat);
      lon = parseFloat(geoData[0].lon);
      displayName = geoData[0].display_name.split(',')[0]; // Get the main city name
    } else {
      throw new Error('شهر پیدا نشد');
    }
  } catch (err) {
    console.error("Geocoding error:", err);
    throw new Error('موقعیت جغرافیایی این شهر یافت نشد. لطفاً نام را دقیق‌تر وارد کنید.');
  }

  // Simulate weather data based on the location
  // Day index 0 = Saturday, 1 = Sunday, etc.
  const forecast: ForecastDay[] = [0, 1, 2, 3, 4, 5, 6].map(index => ({
    day: index.toString(), // Store as string index for mapping
    tempMax: Math.floor(Math.random() * 15) + 20,
    tempMin: Math.floor(Math.random() * 10) + 10,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    rainProb: Math.floor(Math.random() * 100)
  }));

  return {
    city: displayName,
    temp: Math.floor(Math.random() * 25) + 15,
    condition: conditions[Math.floor(Math.random() * 3)],
    description: 'weatherDesc', // Use a translation key
    humidity: Math.floor(Math.random() * 60) + 20,
    windSpeed: Math.floor(Math.random() * 45) + 5,
    windDirection: Math.floor(Math.random() * 360),
    pressure: 1012,
    clouds: Math.floor(Math.random() * 100),
    rain: Math.random() * 10,
    stormChance: Math.floor(Math.random() * 40),
    uvIndex: Math.floor(Math.random() * 11),
    forecast,
    lat,
    lon
  };
};
