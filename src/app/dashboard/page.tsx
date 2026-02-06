'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import MapWrapper from '@/components/Map/MapWrapper';
import Sidebar from '@/components/Dashboard/Sidebar';
import RightPanel from '@/components/Dashboard/RightPanel';
import StatsModal from '@/components/Dashboard/StatsModal';
import { useMapDrillDown } from '@/hooks/useMapDrillDown';
import Loader from '@/components/UI/Loader';
import { mapApi } from '@/services/api';
import { FeatureCollection, GlobalStats, GeoProperties, Sector } from '@/types';

export default function DashboardPage() {
  const t = useTranslations('Map');

  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);

  const [mapData, setMapData] = useState<FeatureCollection | null>(null);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);

  // État pour le modal de gauche
  const [modalZone, setModalZone] = useState<GeoProperties | null>(null);

  const [isFetchingStats, setIsFetchingStats] = useState(false);

  const {
    geoData: drillDownData,
    loading: drillDownLoading,
    currentView,
    history,
    drillDown,
    jumpToHistory,
    resetMap
  } = useMapDrillDown();

  useEffect(() => {
    if (!activeFilter) {
        setMapData(drillDownData);
        setGlobalStats(null);
        setSelectedSector(null);
        setModalZone(null); // Fermer le modal si on enlève le filtre
        return;
    }

    const fetchStatData = async () => {
        setIsFetchingStats(true);
        try {
            const params: any = {
                sector_id: activeFilter,
                level: currentView.level,
                parent_id: currentView.parentId
            };

            const res = await mapApi.get('/api/map/data', { params });

            setMapData(res.data.geojson);
            setGlobalStats(res.data.stats);
            setSelectedSector(res.data.sector);

        } catch (error) {
            console.error("Erreur chargement stats map", error);
            setMapData(null);
        } finally {
            setIsFetchingStats(false);
        }
    };

    fetchStatData();

  }, [activeFilter, currentView, drillDownData]);

  const handleReset = useCallback(() => {
      setActiveFilter(null);
      setModalZone(null);
      resetMap();
  }, [resetMap]);

  // Cette fonction est passée au MapController
  const handleZoneClick = useCallback((props: any) => {
      console.log("Zone cliquée (Dashboard):", props);
      // On force l'ouverture du modal
      setModalZone(props);
  }, []);

  const showRightPanel = currentView.level !== 'REGION' || (currentView.level === 'REGION' && currentView.parentId !== null);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">

      <Sidebar
        currentView={currentView}
        history={history}
        hoveredZone={hoveredZone}
        onJumpToHistory={jumpToHistory}
        onReset={handleReset}
        onSelectFilter={setActiveFilter}
        activeFilter={activeFilter}
        globalStats={globalStats}
      />

      <main className="flex-1 relative h-full w-full">
        {(drillDownLoading || isFetchingStats) && (
          <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-sm transition-all">
            <Loader size="lg" />
            <span className="mt-4 text-sm font-medium text-gray-700 dark:text-white animate-pulse">
              {t('loading')}
            </span>
          </div>
        )}

        <MapWrapper
          data={mapData}
          onZoneDoubleClick={drillDown}
          onZoneClick={handleZoneClick}
          onHover={setHoveredZone}
          activeFilter={activeFilter}
          isDarkMode={false}
          sectorColor={selectedSector?.color}
        />

        <RightPanel
            isOpen={showRightPanel}
            onClose={() => {}}
            zoneId={currentView.parentId}
            zoneName={currentView.name}
            level={currentView.level}
        />

        {/* LE MODAL EST ICI - DANS LE MAIN POUR ÊTRE AU DESSUS DE LA CARTE */}
        {/* On vérifie explicitement si modalZone existe */}
        {modalZone && (
            <StatsModal
                zone={modalZone}
                onClose={() => setModalZone(null)}
            />
        )}
      </main>
    </div>
  );
}
