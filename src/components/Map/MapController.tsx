'use client';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { FeatureCollection, DivisionLevel } from '@/types';
import { useTheme } from '@/context/ThemeContext';

interface MapControllerProps {
  data: FeatureCollection | null;
  onZoneDoubleClick: (id: number, name: string, level: DivisionLevel) => void;
  onZoneClick: (properties: any) => void;
  onHover: (name: string | null) => void;
  activeFilter: number | null;
  sectorColor?: string;
}

const MapController = ({
  data,
  onZoneDoubleClick,
  onZoneClick,
  onHover,
  activeFilter,
  sectorColor
}: MapControllerProps) => {
  const map = useMap();
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // --- MAGIE ICI : On stocke les props changeantes dans des Refs ---
  // Cela permet aux événements Leaflet (qui ne se mettent pas à jour souvent)
  // de lire la valeur "actuelle" de React sans rester bloqués sur l'ancienne.
  const propsRef = useRef({
    activeFilter,
    onZoneClick,
    onZoneDoubleClick,
    onHover,
    sectorColor,
    isDarkMode
  });

  // On met à jour la ref à chaque rendu
  useEffect(() => {
    propsRef.current = {
      activeFilter,
      onZoneClick,
      onZoneDoubleClick,
      onHover,
      sectorColor,
      isDarkMode
    };
  }, [activeFilter, onZoneClick, onZoneDoubleClick, onHover, sectorColor, isDarkMode]);

  // Calcul du max pour l'échelle de couleur
  const maxVal = data?.features.reduce((max, f) => Math.max(max, f.properties.value || 0), 0) || 1;

  // Fonction de style (utilise la Ref pour être toujours à jour)
  const getStyle = (feature?: any) => {
    const { activeFilter, sectorColor, isDarkMode } = propsRef.current;
    const level = feature?.properties?.level;
    const value = feature?.properties?.value || 0;

    let fillColor = isDarkMode ? '#1d4ed8' : '#4CAF50';
    let fillOpacity = 0.7;
    let weight = 1;
    let color = isDarkMode ? '#ffffff' : '#1e3a8a';

    if (activeFilter) {
       const baseColor = sectorColor || '#10b981';
       if (value > 0) {
           const intensity = 0.4 + (value / maxVal) * 0.6;
           fillColor = baseColor;
           fillOpacity = intensity;
       } else {
           fillColor = isDarkMode ? '#374151' : '#e5e7eb';
           fillOpacity = 0.2;
       }
       weight = 1.5;
       color = isDarkMode ? '#9ca3af' : '#64748b';
    } else {
       if (level === 'DEPARTEMENT') fillColor = isDarkMode ? '#3b82f6' : '#bfdbfe';
       if (level === 'ARRONDISSEMENT') fillColor = '#ea580c';
       weight = 2;
    }

    return {
        fillColor,
        weight,
        opacity: 1,
        color,
        fillOpacity,
        className: 'transition-all duration-300 ease-in-out cursor-pointer outline-none'
    };
  };

  // Gestion de la couche GeoJSON
  useEffect(() => {
    if (!data) return;

    // Nettoyage complet avant recréation
    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
    }

    const layer = L.geoJSON(data as any, {
      // On passe une fonction pour le style, Leaflet l'appellera au besoin
      style: (feature) => getStyle(feature),

      onEachFeature: (feature, leafletLayer) => {
        // Tooltip
        const { activeFilter, isDarkMode } = propsRef.current;
        let content = feature.properties.name;

        // Note: Pour le tooltip, on utilise les valeurs au moment du rendu initial de la couche.
        // Si on veut un tooltip dynamique, il faut le mettre à jour via setContent dans les events.
        if (feature.properties.value !== undefined && activeFilter) {
            const val = feature.properties.value;
            const unit = feature.properties.unit || '';
            if (val > 0) content += ` : ${val.toLocaleString()} ${unit}`;
        }

        leafletLayer.bindTooltip(content, {
          permanent: false,
          direction: 'center',
          className: `text-xs font-bold px-2 py-1 rounded shadow-sm border-0 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white/90 text-gray-800'}`
        });

        // Événements
        leafletLayer.on({
          mouseover: (e) => {
            const target = e.target;
            target.setStyle({ weight: 3, color: '#fbbf24', fillOpacity: 0.9 });
            target.bringToFront();
            // Utilisation de la Ref pour appeler la fonction la plus récente
            propsRef.current.onHover(feature.properties.name);
          },
          mouseout: (e) => {
            if (geoJsonLayerRef.current) {
              geoJsonLayerRef.current.resetStyle(e.target);
            }
            propsRef.current.onHover(null);
          },
          click: (e) => {
            L.DomEvent.stopPropagation(e);

            // ICI C'EST CRITIQUE : On lit la valeur actuelle via la Ref
            const { activeFilter, onZoneClick, onZoneDoubleClick } = propsRef.current;

            console.log("CLICK DETECTÉ. Filtre actif ?", activeFilter); // Debug

            if (activeFilter) {
                // Mode Statistiques : On ouvre le modal
                onZoneClick(feature.properties);
            } else {
                // Mode Navigation : On zoom
                map.fitBounds(e.target.getBounds(), { padding: [20, 20], animate: true });
                onZoneDoubleClick(
                  feature.properties.id,
                  feature.properties.name,
                  feature.properties.level
                );
            }
          }
        });
      }
    });

    layer.addTo(map);
    geoJsonLayerRef.current = layer;

    // Cleanup
    return () => {
      if (geoJsonLayerRef.current) {
        map.removeLayer(geoJsonLayerRef.current);
      }
    };
  // On recrée la couche si les données changent, ou si le filtre change (pour mettre à jour les couleurs/tooltips)
  }, [data, activeFilter, isDarkMode, map, sectorColor]);

  return null;
};

export default MapController;
