import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Clock, User, Building2, Map as MapIcon } from "lucide-react";
import { MapLocation, OfficeLocation } from "@/types"; 
import { useMemo, useState, useEffect } from "react";
import Select from "../form/Select";

// Icon untuk karyawan (Biru/Standar)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Icon khusus untuk Kantor (Merah)
const officeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Helper component yang diperbarui untuk menerima koordinat [lat, lng]
function RecenterMap({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 15, { animate: true });
    }
  }, [position, map]);
  return null;
}

interface AttendanceMapProps {
  locations?: MapLocation[];
  officeLocation?: OfficeLocation;
}

export default function AttendanceMapCard({ locations = [], officeLocation }: AttendanceMapProps) {
  // 1. Set default koordinat ke office (jika ada) atau fallback ke Jakarta
  const defaultLat = officeLocation?.lat ?? -6.200000;
  const defaultLng = officeLocation?.lng ?? 106.816666;
  const defaultPosition: [number, number] = [defaultLat, defaultLng];
  
  const [selectedName, setSelectedName] = useState<string>("");
  // State untuk melacak posisi fokus peta (digunakan oleh CTA dan Filter)
  const [focusPosition, setFocusPosition] = useState<[number, number] | null>(null);

  const employeeOptions = useMemo(() => {
    const options = locations.map(loc => ({
      label: loc.name,
      value: loc.name
    }));
    return [{ label: "All Employees", value: "" }, ...options];
  }, [locations]);

  const filteredLocations = useMemo(() => {
    if (!selectedName) return locations;
    return locations.filter(loc => loc.name === selectedName);
  }, [selectedName, locations]);

  // Efek untuk memindahkan peta otomatis saat nama di dropdown dipilih
  useEffect(() => {
    if (selectedName && filteredLocations.length > 0) {
      const firstLoc = filteredLocations[0];
      const lat = typeof firstLoc.lat === 'string' ? parseFloat(firstLoc.lat) : firstLoc.lat;
      const lng = typeof firstLoc.lng === 'string' ? parseFloat(firstLoc.lng) : firstLoc.lng;
      if (lat && lng) setFocusPosition([lat, lng]);
    }
  }, [selectedName, filteredLocations]);

  // Fungsi CTA untuk kembali ke posisi kantor
  const handleBackToOffice = () => {
    setSelectedName(""); // Reset filter
    setFocusPosition([defaultLat, defaultLng]);
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-500" />
            Today's Attendance Locations
          </h3>
          <p className="text-xs text-slate-500 mt-1">Employee check-in coordinate points</p>
        </div>

        <div className="w-full md:w-64">
          <Select
            options={employeeOptions}
            value={selectedName}
            onChange={(val) => setSelectedName(val as string)}
            placeholder="Find employee..."
          />
        </div>
      </div>

      <div className="flex-1 min-h-100 relative rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <MapContainer
          center={defaultPosition}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Fokus dinamis peta */}
          <RecenterMap position={focusPosition} />

          {/* Marker untuk Lokasi Kantor */}
          {officeLocation && (
            <>
              <Marker position={[officeLocation.lat, officeLocation.lng]} icon={officeIcon}>
                <Popup className="rounded-xl overflow-hidden">
                  <div className="p-1">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                        <Building2 size={14} />
                      </div>
                      <span className="font-bold text-slate-800">Head Office</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
              
              {/* Radius kantor untuk referensi visual */}
              {officeLocation.radius_meters && (
                <Circle
                  center={[officeLocation.lat, officeLocation.lng]}
                  radius={officeLocation.radius_meters}
                  pathOptions={{ color: 'red', fillColor: '#f43f5e', fillOpacity: 0.1 }}
                />
              )}
            </>
          )}

          {/* Marker Karyawan */}
          {filteredLocations.map((loc, i) => {
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

        {/* CTA Pindah Posisi (Z-index 400 agar berada di atas Leaflet map layer) */}
        <button
          onClick={handleBackToOffice}
          className="absolute bottom-4 right-4 z-[400] flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          <MapIcon size={16} className="text-rose-500" />
          Back to Office
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
            Office Location
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
            Employee Check-in
          </span>
        </div>
      </div>
    </div>
  );
}