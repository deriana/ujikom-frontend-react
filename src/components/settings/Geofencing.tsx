import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { Navigation, MapPin, Search, Save, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import L, { Marker as LeafletMarker } from "leaflet";
import { useUpdateSetting } from "@/hooks/useSetting";
import { GeoFencingValues } from "@/types";
import toast from "react-hot-toast";

/* ---------------- ICON FIX ---------------- */
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/**
 * Helper component untuk animasi smooth flyTo
 */
function MapController({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 16, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }, [lat, lng, map]);
  return null;
}

export default function GeoSetting({ data }: { data: GeoFencingValues }) {
  const [radius, setRadius] = useState<number>(data.radius_meters);
  const [position, setPosition] = useState({
    lat: data.office_latitude,
    lng: data.office_longitude,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const markerRef = useRef<LeafletMarker | null>(null);
  const { mutateAsync: updateSetting, isPending } = useUpdateSetting<"geo_fencing">();

  const handleSave = useCallback(async () => {
    try {
      await updateSetting({
        type: "geo_fencing",
        data: {
          office_latitude: position.lat,
          office_longitude: position.lng,
          radius_meters: radius,
        },
      });
      toast.success("Location Settings saved successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error saving settings");
    }
  }, [position, radius, updateSetting]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });

    if (results.length > 0) {
      const { x, y } = results[0];
      setPosition({ lat: y, lng: x });
    } else {
      toast.error("Location not found");
    }
  };

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const newPos = marker.getLatLng();
          setPosition({ lat: newPos.lat, lng: newPos.lng });
        }
      },
    }),
    [],
  );

  return (
    <ComponentCard title="Geo Fencing Configuration">
      <div className="space-y-6 text-slate-900 dark:text-white/90">
        
        {/* SEARCH SECTION - Refined Glassmorphism */}
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search office location (e.g. South Jakarta)..."
            className="w-full pl-12 pr-40 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm shadow-sm transition-all
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:ring-indigo-400/30 dark:text-white"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-indigo-500/20"
          >
            Search Location
          </button>
        </form>

        {/* MAP CONTAINER - Smooth UI */}
        <div className="relative w-full h-112.5 rounded-4xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl ring-4 ring-slate-50 dark:ring-white/5">
          <MapContainer
            center={[position.lat, position.lng]}
            zoom={16}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
            className="z-0"
          >
            {/* Dark Mode TileLayer Filter */}
            <TileLayer 
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
              className="dark:filter dark:invert dark:hue-rotate-180 dark:brightness-95 dark:contrast-90"
            />
            
            <MapController lat={position.lat} lng={position.lng} />

            <Marker
              draggable
              eventHandlers={eventHandlers}
              position={[position.lat, position.lng]}
              icon={markerIcon}
              ref={markerRef}
            />

            <Circle
              center={[position.lat, position.lng]}
              radius={radius}
              pathOptions={{
                fillColor: "#6366f1",
                color: "#4f46e5",
                weight: 2,
                fillOpacity: 0.15,
              }}
            />
          </MapContainer>
        </div>

        {/* CONTROLS - Matching white/3 palette */}
        <div className="bg-slate-50 dark:bg-white/3 backdrop-blur-md p-6 rounded-4xl border border-slate-200 dark:border-white/5 space-y-8 shadow-inner">
          
          {/* RADIUS SLIDER */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <h5 className="text-sm font-bold flex items-center gap-2 dark:text-white/80">
                  <Navigation size={16} className="text-indigo-500" /> Geofence Radius
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 uppercase tracking-widest font-semibold">
                  Employee check-in perimeter
                </p>
              </div>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">
                {radius}
                <span className="text-xs font-bold text-slate-400 ml-1 uppercase">m</span>
              </div>
            </div>

            <input
              type="range"
              min="10"
              max="1500"
              step="10"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
            />
          </div>

          {/* COORDINATES & SAVE - Refined Button */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3 text-xs font-mono bg-white dark:bg-white/5 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
              <MapPin size={14} className="text-rose-500 animate-pulse" />
              <span className="text-slate-600 dark:text-gray-300 font-bold">
                {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
              </span>
            </div>

            <button
              onClick={handleSave}
              disabled={isPending}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white rounded-3xl font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-70 group"
            >
              {isPending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Save size={20} className="group-hover:scale-110 transition-transform" />
              )}
              <span>{isPending ? "Applying Changes..." : "Save Configuration"}</span>
            </button>
          </div>
        </div>
      </div>
    </ComponentCard>
  );
}