
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Wind, Droplets, Cloud, Zap, Sun, Loader2, BrainCircuit, Waves, ThermometerSun } from 'lucide-react';
import { fetchWeatherData } from './services/weatherService';
import { analyzeWeather } from './services/geminiService';
import { WeatherData } from './types';
import WeatherMap from './components/WeatherMap';
import ForecastChart from './components/ForecastChart';
import WindGauge from './components/WindGauge';
import { translations, Language } from './translations';

const WeatherStat: React.FC<{ icon: React.ReactNode; label: string; value: string; colorClass?: string }> = ({ icon, label, value, colorClass = "text-blue-500" }) => (
  <div className="flex items-center gap-4 p-4 bg-white/60 rounded-[1.8rem] border border-white/80 hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
    <div className={`${colorClass} bg-slate-50 p-3 rounded-2xl shadow-inner`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 mb-0.5 uppercase tracking-wider">{label}</p>
      <p className="font-black text-slate-800 text-base">{value}</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('fa');
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [mapLayer, setMapLayer] = useState<'clouds' | 'precipitation'>('clouds');
  const [error, setError] = useState<string | null>(null);
  
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [windUnit, setWindUnit] = useState<'km/h' | 'mph' | 'm/s'>('km/h');

  const t = translations[lang];
  const initialLoadDone = useRef(false);

  // Initial Load
  useEffect(() => {
    if (!initialLoadDone.current) {
      const defaultCity = lang === 'fa' ? 'تهران' : lang === 'ar' ? 'القاهرة' : 'London';
      setCity(defaultCity);
      handleSearch(undefined, defaultCity);
      initialLoadDone.current = true;
    }
  }, []);

  // Sync Gemini Analysis with both weather data and language
  useEffect(() => {
    if (weather && !loading) {
      const getAnalysis = async () => {
        setAnalyzing(true);
        try {
          const analysis = await analyzeWeather(weather, lang);
          setAiAnalysis(analysis);
        } catch (err) {
          console.error("AI Analysis Error:", err);
        } finally {
          setAnalyzing(false);
        }
      };
      getAnalysis();
    }
  }, [weather, lang]);

  const convertTemp = (c: number) => {
    return tempUnit === 'F' ? Math.round((c * 9) / 5 + 32) : c;
  };

  const handleSearch = async (e?: React.FormEvent, overrideCity?: string) => {
    if (e) e.preventDefault();
    const searchCity = overrideCity || city;
    if (!searchCity.trim()) return;

    setLoading(true);
    setError(null);
    setAiAnalysis('');
    
    try {
      const data = await fetchWeatherData(searchCity);
      setWeather(data);
    } catch (err) {
      setError(lang === 'fa' ? 'خطا در یافتن شهر' : lang === 'ar' ? 'خطأ في العثور على المدينة' : 'Error finding city');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12" dir={t.dir}>
      <header className="flex flex-col lg:flex-row items-center justify-between mb-12 gap-8">
        <div className={`text-center ${t.dir === 'rtl' ? 'lg:text-right' : 'lg:text-left'}`}>
          <h1 className="text-5xl font-black text-slate-900 flex items-center gap-4 justify-center lg:justify-start">
            <div className="bg-blue-600 p-3 rounded-3xl shadow-2xl shadow-blue-300/50">
              <Cloud className="w-10 h-10 text-white" />
            </div>
            {t.title}
          </h1>
          <p className="text-slate-500 mt-4 text-lg font-medium opacity-80">{t.subtitle}</p>
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-lg">
          <form onSubmit={handleSearch} className="relative w-full group">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full ${t.dir === 'rtl' ? 'pr-16 pl-8' : 'pl-16 pr-8'} py-5 rounded-[2.5rem] border-2 border-white bg-white shadow-2xl shadow-slate-200/60 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-xl font-black text-slate-700`}
            />
            <button type="submit" className={`absolute ${t.dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 bg-blue-600 p-3.5 rounded-2xl text-white shadow-lg hover:bg-blue-700 transition-colors`}>
              <Search className="w-6 h-6" />
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-4 w-full justify-center lg:justify-end">
             <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-white">
                {(['fa', 'en', 'ar'] as Language[]).map(l => (
                  <button 
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${lang === l ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
             </div>
             <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-white">
                <button onClick={() => setTempUnit('C')} className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${tempUnit === 'C' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>°C</button>
                <button onClick={() => setTempUnit('F')} className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${tempUnit === 'F' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>°F</button>
             </div>
             <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-white">
                {(['km/h', 'mph', 'm/s'] as const).map(u => (
                  <button key={u} onClick={() => setWindUnit(u)} className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${windUnit === u ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>
                    {u.toUpperCase()}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border-2 border-red-100 text-red-600 p-6 rounded-[2rem] mb-12 text-center font-black shadow-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-blue-50 rounded-full"></div>
            <div className="w-24 h-24 border-t-8 border-blue-600 rounded-full animate-spin absolute inset-0"></div>
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-8 animate-pulse">{t.loading}</p>
        </div>
      ) : weather && (
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-card p-10 rounded-[3rem] relative overflow-hidden border-4 border-white shadow-2xl">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black flex items-center gap-2 text-slate-900 mb-1">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    {weather.city}
                  </h2>
                  <p className="text-slate-500 font-bold bg-slate-100 px-4 py-1 rounded-full inline-block text-[11px]">
                    {new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>
                <div className="text-6xl font-black text-slate-900 tracking-tighter">
                  {convertTemp(weather.temp)}°<span className="text-2xl text-blue-500">{tempUnit}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-blue-600 text-white px-5 py-2.5 rounded-[1.2rem] font-black shadow-xl shadow-blue-200 text-sm">
                  {(t.conditions as any)[weather.condition] || weather.condition}
                </div>
                <p className="text-slate-600 font-bold text-sm leading-tight italic">{(t as any)[weather.description] || t.weatherDesc}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <WeatherStat icon={<Droplets className="w-5 h-5" />} label={t.humidity} value={`${weather.humidity}%`} />
                <WeatherStat icon={<Cloud className="w-5 h-5" />} label={t.clouds} value={`${weather.clouds}%`} />
                <WeatherStat icon={<Zap className="w-5 h-5" />} label={t.stormChance} value={`${weather.stormChance}%`} colorClass="text-amber-500" />
                <WeatherStat icon={<ThermometerSun className="w-5 h-5" />} label={t.uvIndex} value={`${weather.uvIndex}`} colorClass="text-orange-500" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 px-2">
                <Wind className="w-5 h-5 text-blue-500" />
                {t.windStatus}
              </h3>
              <WindGauge speed={weather.windSpeed} direction={weather.windDirection} unit={windUnit} lang={lang} />
            </div>

            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-indigo-500/30 p-2.5 rounded-xl">
                  <BrainCircuit className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-black text-white">{t.aiAnalysis}</h3>
              </div>
              {analyzing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-indigo-400/20 border-t-indigo-400 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-400 font-bold animate-pulse text-[11px]">{t.analyzing}</p>
                </div>
              ) : (
                <div className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap font-medium custom-scrollbar max-h-60 overflow-y-auto pr-2 italic">
                  {aiAnalysis}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-white overflow-hidden">
              <div className={`flex flex-col sm:flex-row items-center justify-between p-6 gap-4`}>
                <div className={t.dir === 'rtl' ? 'text-right' : 'text-left'}>
                  <h3 className="text-xl font-black text-slate-900">{t.mapTitle}</h3>
                  <p className="text-slate-400 text-[10px] font-bold mt-1">{t.mapSubtitle} {weather.city}</p>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
                  <button onClick={() => setMapLayer('clouds')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${mapLayer === 'clouds' ? 'bg-white shadow-lg text-blue-600' : 'text-slate-500'}`}>
                    {t.cloudsLayer}
                  </button>
                  <button onClick={() => setMapLayer('precipitation')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${mapLayer === 'precipitation' ? 'bg-white shadow-lg text-blue-600' : 'text-slate-500'}`}>
                    {t.precipLayer}
                  </button>
                </div>
              </div>
              <WeatherMap lat={weather.lat} lon={weather.lon} layerType={mapLayer} lang={lang} />
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
              <ForecastChart data={weather.forecast} unit={tempUnit} lang={lang} />
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {weather.forecast.map((f, i) => (
                  <div key={i} className="group flex flex-col items-center p-4 rounded-[2rem] bg-slate-50 hover:bg-blue-600 hover:text-white transition-all duration-300 border border-slate-100 hover:shadow-xl">
                    <span className="text-[10px] uppercase font-black text-slate-400 group-hover:text-blue-100 mb-3">
                      {t.days[parseInt(f.day)] || f.day}
                    </span>
                    <div className="mb-3 p-2.5 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      {f.rainProb > 40 ? <Waves className="w-6 h-6 text-blue-500" /> : <Sun className="w-6 h-6 text-orange-400" />}
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="font-black text-lg">{convertTemp(f.tempMax)}°</span>
                      <span className="text-[10px] font-black opacity-40">{convertTemp(f.tempMin)}°</span>
                    </div>
                    <div className="mt-3 text-[8px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full group-hover:bg-blue-400 group-hover:text-white transition-colors">
                      {f.rainProb}% {t.precipProb}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      <footer className="mt-16 text-center text-slate-400 text-[10px] border-t border-slate-200 pt-8 font-bold opacity-60">
        {t.footer}
      </footer>
    </div>
  );
};

export default App;
