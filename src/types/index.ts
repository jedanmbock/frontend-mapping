export type Role = 'ADMIN' | 'USER';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export type DivisionLevel = 'COUNTRY' | 'REGION' | 'DEPARTEMENT' | 'ARRONDISSEMENT';

export interface GeoProperties {
  id: number;
  name: string;
  level: DivisionLevel;
  parent_id: number | null;
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

export interface BreadcrumbItem {
  level: DivisionLevel;
  parentId: number | null;
  name: string;
}

export interface NavigationState {
  level: DivisionLevel;
  parentId: number | null;
  name: string; // Nom de la zone affichée (ex: "Cameroun", "Centre", "Mfoundi")
}
