
import { GoogleGenAI } from "@google/genai";
import { WeatherData } from "../types";
import { Language } from "../translations";

export const analyzeWeather = async (data: WeatherData, lang: Language): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const langNames = {
    fa: 'Persian (Farsi)',
    en: 'English',
    ar: 'Arabic'
  };

  const prompt = `
    As a senior meteorologist, analyze the weather for ${data.city} with these details:
    Temp: ${data.temp}°C
    Condition: ${data.condition}
    Humidity: ${data.humidity}%
    Wind: ${data.windSpeed} km/h
    Storm Chance: ${data.stormChance}%
    Clouds: ${data.clouds}%

    Please provide a short and practical analysis in ${langNames[lang]} including:
    1. General overview for today.
    2. Safety advice (e.g., if there's high wind or storm).
    3. Suggested activities for this weather.
    Respond in short paragraphs.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Analysis not available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error communicating with AI for analysis.";
  }
};
