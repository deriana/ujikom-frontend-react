import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Clock, User } from "lucide-react";
import { MapLocation } from "@/types"; // Import type yang kita buat tadi

// Perbaikan icon default Leaflet yang sering hilang di React
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface AttendanceMapProps {
  locations?: MapLocation[];
}

export default function AttendanceMapCard({ locations = [] }: AttendanceMapProps) {
  // Koordinat default (Jakarta) jika tidak ada data
  const defaultPosition: [number, number] = [-6.200000, 106.816666];

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-500" />
            Lokasi Kehadiran Hari Ini
          </h3>
          <p className="text-xs text-slate-500 mt-1">Titik koordinat check-in karyawan</p>
        </div>
        <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-400">
          {locations.length} Karyawan
        </div>
      </div>

      <div className="flex-1 min-h-100 relative rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <MapContainer
          center={defaultPosition}
          zoom={11}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations.map((loc, i) => {
             // Pastikan lat & lng adalah angka
             const lat = typeof loc.lat === 'string' ? parseFloat(loc.lat) : loc.lat;
             const lng = typeof loc.lng === 'string' ? parseFloat(loc.lng) : loc.lng;

             if (!lat || !lng) return null;

             return (
               <Marker key={i} position={[lat, lng]} icon={markerIcon}>
                 <Popup className="rounded-xl overflow-hidden">
                   <div className="p-1 space-y-2">
                     <div className="flex items-center gap-2 border-b pb-2">
                       <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                         <User size={14} />
                       </div>
                       <span className="font-bold text-slate-800">{loc.name}</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-slate-500">
                       <Clock size={12} />
                       <span>Check-in: {loc.time || '--:--'}</span>
                     </div>
                   </div>
                 </Popup>
               </Marker>
             );
          })}
        </MapContainer>
      </div>

      <div className="mt-4 flex gap-4 overflow-x-auto pb-2 no-scrollbar">
         {/* Legenda singkat atau list mini */}
         {locations.slice(0, 3).map((loc, i) => (
           <div key={i} className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">{loc.name}</span>
           </div>
         ))}
      </div>
    </div>
  );
}