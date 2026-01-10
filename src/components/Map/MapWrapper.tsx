'use client';
import dynamic from 'next/dynamic';
import { FeatureCollection, DivisionLevel } from '@/types';
import Loader from '../UI/Loader';
import { LatLngBoundsExpression } from 'leaflet';

// Import dynamique
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Loader size="lg" />
      <p className="mt-4 text-sm text-gray-500 animate-pulse">Chargement de la carte...</p>
    </div>
  )
});
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const MapController = dynamic(() => import('./MapController'), { ssr: false });

import 'leaflet/dist/leaflet.css';

interface MapWrapperProps {
  data: FeatureCollection | null;
  onZoneDoubleClick: (id: number, name: string, level: DivisionLevel) => void;
  onHover: (name: string | null) => void;
  isDarkMode: boolean;
}

const MapWrapper = ({ data, onZoneDoubleClick, onHover, isDarkMode }: MapWrapperProps) => {

  // Limites précises du Cameroun (Sud-Ouest -> Nord-Est)
  const cameroonBounds: LatLngBoundsExpression = [
    [1.6, 8.4],   // Sud
    [13.1, 16.2]  // Nord
  ];

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        // REMPLACEMENT DE center/zoom PAR bounds
        // Cela force la carte à zoomer au maximum possible pour faire tenir ce rectangle
        bounds={cameroonBounds}

        // Permet des zooms précis (ex: 6.4 au lieu de 6 ou 7) pour remplir l'écran
        zoomSnap={0.1}
        zoomDelta={0.5}

        // Contraintes de navigation
        minZoom={6}
        maxBounds={cameroonBounds}
        maxBoundsViscosity={1.0}

        scrollWheelZoom={true}
        doubleClickZoom={false}
        className="h-full w-full outline-none bg-gray-100 dark:bg-gray-900"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap & CARTO'
          url={isDarkMode
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          }
        />
        <MapController
          data={data}
          onZoneDoubleClick={onZoneDoubleClick}
          onHover={onHover}
          isDarkMode={isDarkMode}
        />
      </MapContainer>
    </div>
  );
};

export default MapWrapper;
