
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Language, translations } from '../translations';

interface WeatherMapProps {
  lat: number;
  lon: number;
  layerType: 'clouds' | 'precipitation';
  lang: Language;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ lat, lon, layerType, lang }) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const weatherLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const t = translations[lang];

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([lat, lon], 7);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(mapRef.current);
      
      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
    } else {
      mapRef.current.flyTo([lat, lon], 8, { duration: 1.5 });
    }

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lon]);
    } else {
      markerRef.current = L.marker([lat, lon]).addTo(mapRef.current);
    }

    if (weatherLayerRef.current) {
      mapRef.current.removeLayer(weatherLayerRef.current);
    }

    const timestamp = Math.floor(Date.now() / 600000) * 600;
    
    let layerUrl = '';
    if (layerType === 'precipitation') {
      layerUrl = `https://tilecache.rainviewer.com/v2/radar/${timestamp}/256/{z}/{x}/{y}/2/1_1.png`;
    } else {
      layerUrl = `https://tilecache.rainviewer.com/v2/satellite/${timestamp}/256/{z}/{x}/{y}/0/1_1.png`;
    }

    weatherLayerRef.current = L.tileLayer(layerUrl, {
      opacity: 0.7,
      zIndex: 1000
    }).addTo(mapRef.current);

    return () => {};
  }, [lat, lon, layerType]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[2rem] shadow-2xl bg-slate-100 border-4 border-white/50">
      <div className={`absolute top-4 ${lang === 'en' ? 'right-4' : 'left-4'} z-[1000] flex flex-col gap-2`}>
        <div className="bg-white/95 backdrop-blur px-5 py-2.5 rounded-2xl text-[11px] font-black shadow-lg border border-slate-100 text-blue-600">
          {t.mapOnline}: {layerType === 'clouds' ? t.cloudsLayer : t.precipLayer}
        </div>
        <div className="bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] text-white flex items-center gap-2 border border-slate-700">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          {t.autoUpdate}
        </div>
      </div>
      <div ref={containerRef} style={{ height: '450px' }} className="w-full" />
    </div>
  );
};

export default WeatherMap;
