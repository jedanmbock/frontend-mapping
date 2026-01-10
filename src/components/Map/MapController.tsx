'use client';
import { useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { FeatureCollection, GeoFeature, DivisionLevel } from '@/types'; // Import DivisionLevel
import { GeoJsonObject } from 'geojson';

interface MapControllerProps {
  data: FeatureCollection | null;
  // MISE A JOUR : on ajoute le paramètre 'level'
  onZoneDoubleClick: (id: number, name: string, level: DivisionLevel) => void;
  onHover: (name: string | null) => void;
  isDarkMode: boolean;
}

const MapController = ({ data, onZoneDoubleClick, onHover, isDarkMode }: MapControllerProps) => {
  const map = useMap();
  const geoJsonLayerRef = useRef<L.GeoJSON>(null);

  const getStyle = (feature?: any) => {
    const level = feature?.properties?.level;

    // 1. REGIONS
    if (level === 'REGION') {
      return {
        fillColor: isDarkMode ? '#1d4ed8' : '#4CAF50',
        weight: 2,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: 0.7,
        className: 'transition-all duration-300 ease-in-out cursor-pointer outline-none'
      };
    }

    // 2. DEPARTEMENTS
    if (level === 'DEPARTEMENT') {
      return {
        fillColor: isDarkMode ? '#3b82f6' : '#bfdbfe',
        weight: 1.5,
        opacity: 1,
        color: isDarkMode ? '#ffffff' : '#1e3a8a', // Contour foncé
        fillOpacity: 0.6,
        className: 'transition-all duration-300 ease-in-out cursor-pointer outline-none'
      };
    }

    // 3. ARRONDISSEMENTS
    if (level === 'ARRONDISSEMENT') {
      return {
        fillColor: '#ea580c',
        weight: 3, // Contour plus épais pour bien voir
        opacity: 1,
        color: '#ea580c', // Orange Vif
        fillOpacity: 0.0, // Totalement transparent pour voir le fond
        className: 'transition-all duration-300 ease-in-out cursor-pointer outline-none'
      };
    }

    return { fillColor: '#ccc', weight: 1, color: '#000' };
  };

  const highlightFeature = (e: L.LeafletMouseEvent) => {
    const layer = e.target;
    const level = layer.feature.properties.level;

    if (level === 'ARRONDISSEMENT') {
        layer.setStyle({ weight: 5, color: '#fbbf24', fillOpacity: 0.2 });
    } else {
        layer.setStyle({ weight: 4, color: '#fbbf24', fillOpacity: 0.8 });
    }
    layer.bringToFront();
    onHover(layer.feature.properties.name);
  };

  const resetHighlight = (e: L.LeafletMouseEvent) => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.resetStyle(e.target);
    }
    onHover(null);
  };

  const handleDoubleClick = (e: L.LeafletMouseEvent) => {
    L.DomEvent.stopPropagation(e);
    const feature = e.target.feature as GeoFeature;

    // Zoom
    map.fitBounds(e.target.getBounds(), { padding: [20, 20], animate: true });

    // MISE A JOUR : On passe le niveau de la zone cliquée (ex: "DEPARTEMENT")
    onZoneDoubleClick(
      feature.properties.id,
      feature.properties.name,
      feature.properties.level
    );
  };

  useEffect(() => {
    if (data && geoJsonLayerRef.current) {
      geoJsonLayerRef.current.clearLayers();
      geoJsonLayerRef.current.addData(data as unknown as GeoJsonObject);

      const bounds = geoJsonLayerRef.current.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20], animate: true });
      }
    }
  }, [data, map]);

  useEffect(() => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.eachLayer((layer) => {
        if (layer instanceof L.Path && (layer as any).feature) {
           layer.setStyle(getStyle((layer as any).feature));
        }
      });
    }
  }, [isDarkMode]);

  if (!data) return null;

  return (
    <GeoJSON
      ref={geoJsonLayerRef}
      data={data as unknown as GeoJsonObject}
      style={getStyle}
      onEachFeature={(feature, layer) => {
        layer.bindTooltip(feature.properties.name, {
          permanent: false,
          direction: 'center',
          className: `text-xs font-bold px-2 py-1 rounded shadow-sm border-0 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white/90 text-gray-800'}`
        });

        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          dblclick: handleDoubleClick
        });
      }}
    />
  );
};

export default MapController;
