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

  // --- CORRECTION --- : Ajout d'un état dédié pour le panneau droit
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

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
        setModalZone(null);
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

  // --- CORRECTION --- : Logique pour ouvrir/fermer le panneau quand la vue change
  useEffect(() => {
    const shouldBeVisible = currentView.level !== 'REGION' || (currentView.level === 'REGION' && currentView.parentId !== null);
    if (shouldBeVisible) {
        setIsRightPanelOpen(true); // Ouvre le panneau quand on navigue
    } else {
        setIsRightPanelOpen(false); // Ferme le panneau si on retourne au niveau pays
    }
  }, [currentView]);


  const handleReset = useCallback(() => {
      setActiveFilter(null);
      setModalZone(null);
      resetMap();
  }, [resetMap]);

  const handleZoneClick = useCallback((props: any) => {
      console.log("Zone cliquée (Dashboard):", props);
      setModalZone(props);
  }, []);

  // --- CORRECTION --- : La condition d'affichage est maintenant double
  const canShowRightPanel = currentView.level !== 'REGION' || (currentView.level === 'REGION' && currentView.parentId !== null);

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
            // --- CORRECTION --- : La visibilité dépend de la condition ET de l'état
            isOpen={canShowRightPanel && isRightPanelOpen}
            // --- CORRECTION --- : onClose change l'état pour fermer le panneau
            onClose={() => setIsRightPanelOpen(false)}
            zoneId={currentView.parentId}
            zoneName={currentView.name}
            level={currentView.level}
        />

        {modalZone && (
            <div className="absolute inset-0 z-[9999] pointer-events-none flex items-end justify-start p-8">
                <StatsModal
                    zone={modalZone}
                    onClose={() => setModalZone(null)}
                />
            </div>
        )}
      </main>
    </div>
  );
}