'use client';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapController from './MapController'; // Le contrôleur de logique
import { FeatureCollection, DivisionLevel } from '@/types';

interface MapComponentProps {
  geoData: FeatureCollection | null;
  onZoneSelect: (level: DivisionLevel, id: number, name: string) => void;
  onHover: (name: string | null) => void;
  isDarkMode: boolean;
}

const MapComponent = ({ geoData, onZoneSelect, onHover, isDarkMode }: MapComponentProps) => {
  // Coordonnées par défaut (Centre du Cameroun)
  const center: [number, number] = [7.3697, 12.3547];

  return (
    <div className="h-full w-full outline-none">
      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom={true}
        doubleClickZoom={false} // Désactivé pour laisser la place à notre drill-down
        className="h-full w-full z-0"
        zoomControl={false}
      >
        {/* Tuiles de fond (Style Google-like Minimaliste) */}
        <TileLayer
          url={isDarkMode
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          }
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        />

        {/* Boutons de zoom repositionnés en bas à droite pour libérer la vue */}
        <ZoomControl position="bottomright" />

        {/* Notre logique de rendu des polygones et du double-clic */}
        <MapController
          data={geoData}
          onZoneSelect={onZoneSelect}
          onHover={onHover}
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
