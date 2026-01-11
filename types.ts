
export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  clouds: number;
  rain: number;
  stormChance: number;
  uvIndex: number;
  forecast: ForecastDay[];
  lat: number;
  lon: number;
}

export interface ForecastDay {
  day: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  rainProb: number;
}

export interface MapLayer {
  id: string;
  name: string;
  url: string;
}
