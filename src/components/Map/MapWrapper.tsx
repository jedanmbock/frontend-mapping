'use client';

import dynamic from 'next/dynamic';
import { FeatureCollection, DivisionLevel } from '@/types';
import Loader from '../UI/Loader';
import { LatLngBoundsExpression } from 'leaflet';
import { useTranslations } from 'next-intl';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center"><Loader size="lg" /></div>
});
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const MapController = dynamic(() => import('./MapController'), { ssr: false });

import 'leaflet/dist/leaflet.css';

interface MapWrapperProps {
  data: FeatureCollection | null;
  onZoneDoubleClick: (id: number, name: string, level: DivisionLevel) => void;
  onZoneClick: (properties: any) => void;
  onHover: (name: string | null) => void;
  activeFilter: number | null;
  isDarkMode: boolean;
  sectorColor?: string; // Ajout
}

const MapWrapper = ({ data, onZoneDoubleClick, onZoneClick, onHover, activeFilter, isDarkMode, sectorColor }: MapWrapperProps) => {
  const t = useTranslations('Map');
  const cameroonBounds: LatLngBoundsExpression = [[1.6, 8.4], [13.1, 16.2]];

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        bounds={cameroonBounds}
        zoomSnap={0.1}
        zoomDelta={0.5}
        minZoom={5}
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
          onZoneClick={onZoneClick}
          onHover={onHover}
          activeFilter={activeFilter}
          sectorColor={sectorColor} // Passage de la couleur
        />
      </MapContainer>

      {!data && (
        <div className="absolute top-4 right-4 z-[1000] bg-white/80 dark:bg-black/80 px-3 py-1 rounded text-xs">
          {t('loading')}
        </div>
      )}
    </div>
  );
};

export default MapWrapper;
