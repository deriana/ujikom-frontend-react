"use client";
import React, { useState, useMemo, useRef } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { Navigation, MousePointer2, Search, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function GeoSetting({ data }: { data: any }) {
  const [radius, setRadius] = useState(data.radius_meters);
  // State untuk menyimpan koordinat yang bisa berubah
  const [position, setPosition] = useState({
    lat: data.office_latitude,
    lng: data.office_longitude,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const markerRef = useRef<any>(null);

  // Fungsi untuk menangani pencarian alamat
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });
    
    if (results && results.length > 0) {
      const { x, y } = results[0]; // x = lng, y = lat
      setPosition({ lat: y, lng: x });
    }
  };

  // Komponen Helper untuk memindahkan view peta saat koordinat berubah
  function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
    const map = useMapEvents({});
    map.setView([lat, lng], map.getZoom());
    return null;
  }

  // Handler saat marker selesai digeser
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setPosition({ lat: newPos.lat, lng: newPos.lng });
        }
      },
    }),
    [],
  );

  return (
    <ComponentCard title="Geo Fencing Configuration">
      <div className="space-y-6">
        
        {/* SEARCH BOX AREA */}
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari lokasi kantor (Contoh: Monas, Jakarta)..."
            className="w-full pl-12 pr-28 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner placeholder-gray-400 dark:placeholder-gray-500 focus:placeholder-indigo-300"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition shadow-lg"
          >
            Cari Lokasi
          </button>
        </form>

        {/* MAP SECTION */}
        <div className="relative w-full h-110 rounded-4xl overflow-hidden border-8 border-gray-50 dark:border-gray-800 shadow-xl z-0">
          <MapContainer 
            center={[position.lat, position.lng]} 
            zoom={16} 
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            
            <RecenterMap lat={position.lat} lng={position.lng} />

            <Marker 
              draggable={true}
              eventHandlers={eventHandlers}
              position={[position.lat, position.lng]} 
              icon={markerIcon}
              ref={markerRef}
            />
            
            <Circle
              center={[position.lat, position.lng]}
              radius={radius}
              pathOptions={{ 
                fillColor: '#4f46e5', 
                color: '#4f46e5', 
                weight: 2, 
                fillOpacity: 0.15,
                dashArray: '5, 10'
              }}
            />
          </MapContainer>

          {/* Floating Instructions */}
          <div className="absolute bottom-4 left-4 z-1000 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 shadow-xl flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 rounded-lg">
               <MousePointer2 size={16} />
            </div>
            <p className="text-[11px] font-medium text-gray-600 dark:text-gray-300 leading-tight">
              Klik dan tahan <span className="font-bold text-indigo-500 underline">Pin Biru</span> <br/>untuk memindahkan posisi kantor.
            </p>
          </div>
        </div>

        {/* RADIUS & COORDINATE INFO CARD */}
        <div className="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-6">
          
          {/* Slider Jarak */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
               <h5 className="text-sm font-bold text-gray-700 dark:text-white flex items-center gap-2">
                 <Navigation size={18} className="text-indigo-600" /> Radius Jarak Absensi
               </h5>
               <div className="text-2xl font-black text-indigo-600">
                {radius}<span className="text-xs text-gray-400 ml-1 font-normal uppercase">Meter</span>
               </div>
            </div>
            <input 
              type="range" 
              min="10" 
              max="1500" 
              step="10"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700 w-full" />

          {/* Coordinate Display */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Latitude</span>
                <span className="text-sm font-mono font-bold text-gray-700 dark:text-gray-300">{position.lat.toFixed(6)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Longitude</span>
                <span className="text-sm font-mono font-bold text-gray-700 dark:text-gray-300">{position.lng.toFixed(6)}</span>
              </div>
            </div>

            <button className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              Simpan Perubahan
            </button>
          </div>
        </div>

      </div>
    </ComponentCard>
  );
}