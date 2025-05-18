import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { School } from '@/types/school';

// Fix for default markers
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface SchoolsMapProps {
  schools?: School[];
}

export default function SchoolsMap({ schools = [] }: SchoolsMapProps) {
  // Default center at a middle point if no schools
  const defaultCenter = { lat: 0, lng: 0 };
  const defaultZoom = 2;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '400px', width: '100%' }}
      className="rounded-b-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {schools.map((school) => (
        <Marker
          key={school.id}
          position={[school.latitude, school.longitude]}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{school.name}</h3>
              <p className="text-sm text-gray-600">{school.region}</p>
              <p className="text-xs text-gray-500">
                Students: {school.totalStudents}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
