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

  const propsRef = useRef({
    activeFilter,
    onZoneClick,
    onZoneDoubleClick,
    onHover,
    sectorColor,
    isDarkMode
  });

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

  const maxVal = data?.features.reduce((max, f) => Math.max(max, f.properties.value || 0), 0) || 1;

  const getStyle = (feature?: any) => {
    const { activeFilter, sectorColor, isDarkMode } = propsRef.current;
    const level = feature?.properties?.level;
    const value = feature?.properties?.value || 0;

    // Couleurs par défaut (Navigation)
    let fillColor = isDarkMode ? '#1e3a8a' : '#3b82f6'; // Bleu par défaut
    if (level === 'ARRONDISSEMENT') fillColor = '#f97316'; // Orange

    let fillOpacity = 0.2;
    let weight = 1;
    let color = isDarkMode ? '#64748b' : '#94a3b8'; // Bordure

    // Mode Filtre Actif
    if (activeFilter) {
       const baseColor = sectorColor || '#10b981';
       if (value > 0) {
           // Si production > 0 : couleur intense
           fillColor = baseColor;
           // Opacité basée sur la valeur (min 0.4, max 0.9)
           fillOpacity = 0.4 + (value / maxVal) * 0.5;
       } else {
           // Si pas de production : gris très clair
           fillColor = isDarkMode ? '#4b5563' : '#cbd5e1'; // Gris moyen
           fillOpacity = 0.5; // Assez opaque pour être vue
       }
       weight = 1.5;
       color = isDarkMode ? '#9ca3af' : '#64748b';
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

  useEffect(() => {
    if (!data) return;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
    }

    const layer = L.geoJSON(data as any, {
      style: (feature) => getStyle(feature),
      onEachFeature: (feature, leafletLayer) => {
        // Tooltip
        const { activeFilter } = propsRef.current;
        let content = feature.properties.name;
        if (feature.properties.value !== undefined && activeFilter) {
            const val = feature.properties.value;
            const unit = feature.properties.unit || '';
            if (val > 0) content += ` : ${val.toLocaleString()} ${unit}`;
        }
        leafletLayer.bindTooltip(content, { permanent: false, direction: 'center' });

        // Events
        leafletLayer.on({
          mouseover: (e) => {
            const target = e.target;
            target.setStyle({ weight: 3, color: '#fbbf24', fillOpacity: 0.9 });
            target.bringToFront();
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
            const { activeFilter, onZoneClick, onZoneDoubleClick } = propsRef.current;
            
            // On ouvre le modal si filtre actif, PEU IMPORTE la valeur (même 0)
            if (activeFilter) {
                onZoneClick(feature.properties);
            } else if (feature.properties.level === 'ARRONDISSEMENT') {
                onZoneClick(feature.properties);
            } else {
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

    // --- CORRECTION ISSUE 2 & 5 : RECADRAGE AUTO DE LA CARTE ---
    // Chaque fois que les données changent (data), on adapte la vue
    try {
        if (layer.getBounds().isValid()) {
            map.fitBounds(layer.getBounds(), { padding: [20, 20], animate: true });
        }
    } catch (e) {
        console.log("Erreur fitBounds", e);
    }

  }, [data, activeFilter, isDarkMode, map, sectorColor]); // Dépendances importantes

  return null;
};

export default MapController;