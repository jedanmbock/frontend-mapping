import { useState, useEffect, useCallback } from 'react';
import { mapApi } from '@/services/api';
import { FeatureCollection, DivisionLevel, NavigationState } from '@/types';

export const useMapDrillDown = () => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // État initial
  const [currentView, setCurrentView] = useState<NavigationState>({
    level: 'REGION',
    parentId: null,
    name: 'Cameroun'
  });

  const [history, setHistory] = useState<NavigationState[]>([]);

  const fetchZones = useCallback(async (level: DivisionLevel, pId: number | null) => {
    setLoading(true);
    try {
      const params: any = { level };

      if (level !== 'REGION') {
        if (pId) params.parent_id = pId;
      }

      console.log(`📡 API Call: Level=${level}, ParentID=${pId}`); // Debug

      const response = await mapApi.get<FeatureCollection>('/api/gis/zones', { params });
      setGeoData(response.data);
    } catch (err) {
      console.error("Erreur API:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchZones(currentView.level, currentView.parentId);
  }, [currentView, fetchZones]);

  // --- ACTIONS ---

  // MISE A JOUR : On accepte 'clickedLevel' en argument
  const drillDown = (id: number, name: string, clickedLevel: DivisionLevel) => {
    let nextLevel: DivisionLevel | null = null;

    // Logique basée sur ce qu'on vient de CLIQUER
    if (clickedLevel === 'REGION') nextLevel = 'DEPARTEMENT';
    else if (clickedLevel === 'DEPARTEMENT') nextLevel = 'ARRONDISSEMENT';

    if (nextLevel) {
      // On sauvegarde l'état actuel dans l'historique
      setHistory(prev => [...prev, currentView]);

      // On met à jour la vue
      setCurrentView({
        level: nextLevel,
        parentId: id,
        name: name
      });
    }
  };

  const jumpToHistory = (index: number) => {
    const targetView = history[index];
    const newHistory = history.slice(0, index);
    setHistory(newHistory);
    setCurrentView(targetView);
  };

  const resetMap = () => {
    setHistory([]);
    setCurrentView({
      level: 'REGION',
      parentId: null,
      name: 'Cameroun'
    });
  };

  return {
    geoData,
    loading,
    currentView,
    history,
    drillDown,
    jumpToHistory,
    resetMap
  };
};
