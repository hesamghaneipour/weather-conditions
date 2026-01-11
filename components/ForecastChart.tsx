
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ForecastDay } from '../types';
import { translations, Language } from '../translations';

interface ForecastChartProps {
  data: ForecastDay[];
  unit: 'C' | 'F';
  lang: Language;
}

const ForecastChart: React.FC<ForecastChartProps> = ({ data, unit, lang }) => {
  const t = translations[lang];
  const convertTemp = (temp: number) => {
    return unit === 'F' ? Math.round((temp * 9) / 5 + 32) : temp;
  };

  const chartData = data.map(d => ({
    ...d,
    dayName: t.days[parseInt(d.day)] || d.day,
    tempMax: convertTemp(d.tempMax),
    tempMin: convertTemp(d.tempMin),
  }));

  return (
    <div className="h-80 w-full mt-6">
      <h3 className="text-xl font-black mb-6 text-slate-800">{t.forecastTitle}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="dayName" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fontWeight: 'bold', fill: '#64748b' }}
            unit={`°${unit}`}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '20px', 
              border: 'none', 
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', 
              direction: t.dir as any 
            }}
            labelStyle={{ fontWeight: 'black', marginBottom: '8px', color: '#1e293b' }}
            itemStyle={{ fontWeight: 'bold' }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} />
          <Area 
            type="monotone" 
            dataKey="tempMax" 
            name={t.maxTemp} 
            stroke="#ef4444" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorMax)" 
          />
          <Area 
            type="monotone" 
            dataKey="tempMin" 
            name={t.minTemp} 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorMin)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
