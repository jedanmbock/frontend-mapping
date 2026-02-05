export type Role = 'ADMIN' | 'USER';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export type DivisionLevel = 'COUNTRY' | 'REGION' | 'DEPARTEMENT' | 'ARRONDISSEMENT';

export interface GeoProperties {
  id: number;
  name: string;
  level: DivisionLevel;
  parent_id: number | null;
  code: string; // Ajout du code zone
  value?: number; // Pour les stats
  unit?: string;  // Pour les stats
}

export interface GeoFeature {
  type: "Feature";
  id: number;
  properties: GeoProperties;
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][];
  };
}

export interface FeatureCollection {
  type: "FeatureCollection";
  features: GeoFeature[];
}

export interface NavigationState {
  level: DivisionLevel;
  parentId: number | null;
  name: string;
}

// --- Types pour les Statistiques ---
export interface Sector {
    id: number;
    name: string; // Ex: Cacao
    category: string; // Ex: Agriculture
    color?: string;
}

export interface GlobalStats {
  total: number;
  unit: string;
}

export interface ZoneStatDetail {
    sector: string;
    category: string;
    volume: number;
    unit: string;
    year?: number;
}
