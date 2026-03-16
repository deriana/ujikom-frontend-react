import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Clock, User, Building2, Map as MapIcon } from "lucide-react";
import { MapLocation, OfficeLocation } from "@/types"; 
import { useMemo, useState, useEffect } from "react";
import Select from "../form/Select";

// Konfigurasi Icon tetap sama
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const officeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

/**
 * Helper component untuk animasi smooth flyTo
 */
function RecenterMap({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      // Menggunakan flyTo agar tidak teleport (gerakan kamera smooth)
      map.flyTo(position, 15, {
        duration: 1.5, // Durasi animasi
        easeLinearity: 0.25
      });
    }
  }, [position, map]);
  return null;
}

interface AttendanceMapProps {
  locations?: MapLocation[];
  officeLocation?: OfficeLocation;
}

export default function AttendanceMapCard({ locations = [], officeLocation }: AttendanceMapProps) {
  const defaultLat = officeLocation?.lat ?? -6.200000;
  const defaultLng = officeLocation?.lng ?? 106.816666;
  const defaultPosition: [number, number] = [defaultLat, defaultLng];
  
  const [selectedName, setSelectedName] = useState<string>("");
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

  useEffect(() => {
    if (selectedName && filteredLocations.length > 0) {
      const firstLoc = filteredLocations[0];
      const lat = typeof firstLoc.lat === 'string' ? parseFloat(firstLoc.lat) : firstLoc.lat;
      const lng = typeof firstLoc.lng === 'string' ? parseFloat(firstLoc.lng) : firstLoc.lng;
      if (lat && lng) setFocusPosition([lat, lng]);
    }
  }, [selectedName, filteredLocations]);

  const handleBackToOffice = () => {
    setSelectedName(""); 
    setFocusPosition([defaultLat, defaultLng]);
  };

  return (
    <div className="p-6 bg-white dark:bg-white/3 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-4xl shadow-sm h-full flex flex-col transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white/90 text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-500" />
            Attendance Tracking
          </h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 uppercase tracking-wider font-semibold">Real-time coordinate points</p>
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

      <div className="flex-1 min-h-100 relative rounded-3xl overflow-hidden border border-slate-100 dark:border-white/10 shadow-inner">
        <MapContainer
          center={defaultPosition}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
        >
          {/* Dark Mode TileLayer Filter */}
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="dark:filter dark:invert dark:hue-rotate-180 dark:brightness-95 dark:contrast-90"
          />

          <RecenterMap position={focusPosition} />

          {officeLocation && (
            <>
              <Marker position={[officeLocation.lat, officeLocation.lng]} icon={officeIcon}>
                <Popup className="custom-popup">
                  <div className="p-1 font-sans">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-1">
                      <Building2 size={14} className="text-rose-500" />
                      <span className="font-bold text-slate-800">Head Office</span>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Office Center</span>
                  </div>
                </Popup>
              </Marker>
              
              {officeLocation.radius_meters && (
                <Circle
                  center={[officeLocation.lat, officeLocation.lng]}
                  radius={officeLocation.radius_meters}
                  pathOptions={{ color: '#f43f5e', fillColor: '#f43f5e', fillOpacity: 0.1, weight: 1 }}
                />
              )}
            </>
          )}

          {filteredLocations.map((loc, i) => {
              const lat = typeof loc.lat === 'string' ? parseFloat(loc.lat) : loc.lat;
              const lng = typeof loc.lng === 'string' ? parseFloat(loc.lng) : loc.lng;

              if (!lat || !lng) return null;

              return (
                <Marker key={i} position={[lat, lng]} icon={markerIcon}>
                  <Popup>
                    <div className="p-1 space-y-2 font-sans">
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                          <User size={14} />
                        </div>
                        <span className="font-bold text-slate-800">{loc.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                        <Clock size={12} className="text-indigo-500" />
                        <span>Checked in at {loc.time || '--:--'}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
          })}
        </MapContainer>

        {/* Floating CTA Button */}
        <button
          onClick={handleBackToOffice}
          className="absolute bottom-4 right-4 z-400 flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all text-sm font-bold text-slate-700 dark:text-white/80"
        >
          <MapIcon size={16} className="text-rose-500" />
          CENTER TO OFFICE
        </button>
      </div>

      {/* Legend Footer */}
      <div className="mt-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 transition-colors">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-600 dark:text-gray-400">
            Headquarter
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 transition-colors">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-600 dark:text-gray-400">
            Employee Spot
          </span>
        </div>
      </div>
    </div>
  );
}