import { useState, useEffect } from "react";
import { MapPin, Camera, Navigation, Clock as ClockIcon, ShieldAlert } from "lucide-react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/useIsMobile";
import PageHeader from "@/components/Mobile/PageHeader";
import { Home } from "lucide-react";

// Fix Leaflet icon issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const DEFAULT_LOCATION: [number, number] = [-6.200, 106.8166];
const GEOFENCE_RADIUS = 100;

// Sub-component untuk menangani animasi perpindahan kamera
function MapController({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 16, {
        duration: 1.5, // Durasi animasi dalam detik
        easeLinearity: 0.25
      });
    }
  }, [coords, map]);
  return null;
}

export default function AttendancePresence() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [targetCoords, setTargetCoords] = useState<[number, number]>(DEFAULT_LOCATION);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState("Fetching location...");
  const [locationPermission, setLocationPermission] = useState<PermissionState | "prompt">("prompt");
  const isMobile = useIsMobile();

  const getPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserCoords(coords);
        setTargetCoords(coords);
        setAddress(`Lat: ${coords[0].toFixed(4)}, Lng: ${coords[1].toFixed(4)}`);
        setLocationPermission("granted");
      }, () => {
        setLocationPermission("denied");
      });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    getPosition();
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        {isMobile && (
          <PageHeader
            icon={Home}
            to="/home"
            title="Attendance Menu"
            subtitle={
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Verification Method</p>
            }
          />
        )}
        
        {/* Header Section */}
        <header className="bg-white dark:bg-white/5 backdrop-blur-md rounded-4xl p-6 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white/90">Attendance Menu</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{formatDate(time)}</p>
          </div>
          <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-500/10 px-6 py-3 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 shadow-inner">
            <ClockIcon className="text-indigo-600 dark:text-indigo-400" size={24} />
            <span className="text-2xl font-mono font-bold text-indigo-700 dark:text-indigo-300">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </header>

        {/* Map Section */}
        <div className="bg-white dark:bg-white/3 backdrop-blur-sm rounded-4xl p-4 shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
          {locationPermission === "denied" && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="text-red-600 dark:text-red-400" size={20} />
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  Location access is required for attendance.
                </p>
              </div>
              <button 
                onClick={getPosition}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Enable Location
              </button>
            </div>
          )}
          <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden z-0 border border-gray-200 dark:border-white/10 shadow-inner">
            <MapContainer
              center={targetCoords}
              zoom={15}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="dark:filter dark:invert dark:hue-rotate-180 dark:brightness-95 dark:contrast-90"
              />
              <Marker position={DEFAULT_LOCATION} />
              <Circle
                center={DEFAULT_LOCATION}
                radius={GEOFENCE_RADIUS}
                pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.15, weight: 2 }}
              />
              {userCoords && <Marker position={userCoords} />}
              
              {/* Animasi Kamera */}
              <MapController coords={targetCoords} />
            </MapContainer>
            
            {/* Control Buttons dengan Hover yang lebih jelas */}
            <div className="absolute bottom-4 right-4 z-1000 flex flex-col gap-2">
              <button 
                onClick={() => setTargetCoords(DEFAULT_LOCATION)}
                className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-gray-200 dark:border-white/10 text-indigo-600 dark:text-indigo-400 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider group"
              >
                <Navigation size={16} className="group-hover:rotate-12 transition-transform" /> Office
              </button>
              <button 
                onClick={() => userCoords && setTargetCoords(userCoords)}
                className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-gray-200 dark:border-white/10 text-emerald-600 dark:text-emerald-400 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider group"
              >
                <MapPin size={16} className="group-hover:bounce transition-transform" /> My Location
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 px-2 font-medium">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-white/5">
                <Navigation size={14} className="text-indigo-500" />
            </div>
            <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] font-bold">Current Node:</span>
            <span className="truncate dark:text-white/70">{address}</span>
          </div>
        </div>

        {/* Action Cards with Clearer Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate("/attendance/single", { state: { coords: userCoords } })}
            className="group relative overflow-hidden bg-white dark:bg-white/3 p-8 rounded-4xl shadow-sm border border-gray-100 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 text-left"
          >
            <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
              <Camera size={140} className="text-indigo-600 dark:text-white" />
            </div>
            <div className="w-16 h-16 bg-indigo-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:rotate-3 transition-all duration-300 shadow-sm group-hover:shadow-indigo-500/50">
              <Camera className="text-indigo-600 dark:text-indigo-400 group-hover:text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white/90 mb-2">Face Recognition</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-[80%]">Secure identity verification using biometric scanning technology.</p>
          </button>

          <button
            onClick={() => navigate("/attendance/manual")} 
            className="group relative overflow-hidden bg-white dark:bg-white/3 p-8 rounded-4xl shadow-sm border border-gray-100 dark:border-white/10 hover:border-emerald-500 dark:hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 text-left"
          >
            <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
              <MapPin size={140} className="text-emerald-600 dark:text-white" />
            </div>
            <div className="w-16 h-16 bg-emerald-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:-rotate-3 transition-all duration-300 shadow-sm group-hover:shadow-emerald-500/50">
              <MapPin className="text-emerald-600 dark:text-emerald-400 group-hover:text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white/90 mb-2">Manual Presence</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-[80%]">Clock in based on your current GPS location and office proximity.</p>
          </button>
        </div>

      </div>
    </div>
  );
}