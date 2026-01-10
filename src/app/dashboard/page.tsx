'use client';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import MapWrapper from '@/components/Map/MapWrapper';
import Sidebar from '@/components/Dashboard/Sidebar';
import { useMapDrillDown } from '@/hooks/useMapDrillDown';
import Loader from '@/components/UI/Loader';

export default function DashboardPage() {
  const { theme } = useTheme();
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const {
    geoData,
    loading,
    currentView,
    history,
    drillDown,
    jumpToHistory,
    resetMap
  } = useMapDrillDown();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">

      <Sidebar
        currentView={currentView}
        history={history}
        hoveredZone={hoveredZone}
        onJumpToHistory={jumpToHistory}
        onReset={resetMap}
      />

      <main className="flex-1 relative h-full w-full">
        {loading && (
          <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-sm transition-all">
            <Loader size="lg" />
            <span className="mt-4 text-sm font-medium text-gray-700 dark:text-white animate-pulse">
              Chargement des données géographiques...
            </span>
          </div>
        )}

        <MapWrapper
          data={geoData}
          onZoneDoubleClick={drillDown}
          onHover={setHoveredZone}
          isDarkMode={theme === 'dark'}
        />
      </main>
    </div>
  );
}
