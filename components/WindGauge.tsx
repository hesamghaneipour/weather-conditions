
import React from 'react';
import { Navigation } from 'lucide-react';
import { translations, Language } from '../translations';

interface WindGaugeProps {
  speed: number;
  direction: number;
  unit: 'km/h' | 'mph' | 'm/s';
  lang: Language;
}

const WindGauge: React.FC<WindGaugeProps> = ({ speed, direction, unit, lang }) => {
  const t = translations[lang];

  const getCardinal = (angle: number) => {
    const dirs = [t.north, t.northEast, t.east, t.southEast, t.south, t.southWest, t.west, t.northWest];
    return dirs[Math.round(angle / 45) % 8];
  };

  const convertSpeed = (s: number) => {
    switch (unit) {
      case 'mph': return (s * 0.621371).toFixed(1);
      case 'm/s': return (s / 3.6).toFixed(1);
      default: return Math.round(s);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="relative w-40 h-40 flex items-center justify-center mb-6">
        <div className="absolute inset-0 border-[6px] border-slate-800 rounded-full shadow-inner"></div>
        <div className="absolute top-2 text-[10px] font-black text-slate-500">N</div>
        <div className="absolute bottom-2 text-[10px] font-black text-slate-500">S</div>
        <div className="absolute left-2 text-[10px] font-black text-slate-500">W</div>
        <div className="absolute right-2 text-[10px] font-black text-slate-500">E</div>
        
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-3 bg-slate-700 rounded-full" 
            style={{ transform: `rotate(${i * 45}deg) translateY(-68px)` }}
          ></div>
        ))}
        
        <div 
          className="transition-transform duration-[1500ms] cubic-bezier(0.34, 1.56, 0.64, 1)"
          style={{ transform: `rotate(${direction}deg)` }}
        >
          <div className="relative">
             <Navigation className="w-16 h-16 text-blue-400 fill-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-blue-500"></div>
          </div>
        </div>
      </div>
      
      <div className="text-center z-10">
        <div className="text-4xl font-black text-blue-400 tracking-tight">
          {convertSpeed(speed)} 
          <span className="text-sm text-slate-500 mx-2 font-bold uppercase">{unit}</span>
        </div>
        <div className="text-sm font-bold text-slate-400 mt-2 bg-slate-800/50 px-4 py-1 rounded-full inline-block">
          {getCardinal(direction)} ({direction}°)
        </div>
      </div>
    </div>
  );
};

export default WindGauge;
