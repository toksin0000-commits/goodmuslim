// app/[lang]/mosques/mosque.types.ts
export interface OsmElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: {
    name?: string;
    "name:ar"?: string;
    "name:en"?: string;
    "name:ur"?: string;
    denomination?: string;
    religion?: string;
    "addr:street"?: string;
    "addr:housenumber"?: string;
    "addr:city"?: string;
    "addr:town"?: string;
    "addr:village"?: string;
    "addr:hamlet"?: string;
    "addr:place"?: string;
    "addr:county"?: string;
    "addr:district"?: string;
    "addr:country"?: string;
    "opening_hours"?: string;
    "phone"?: string;
    "website"?: string;
    "wikipedia"?: string;
  };
}

export interface Mosque {
  name: string;
  name_ar?: string;
  name_en?: string;
  name_ur?: string;
  address: string;
  lat: number;
  lng: number;
  denomination?: string; // např. "sunni", "shia"
  opening_hours?: string;
  phone?: string;
  website?: string;
}

export interface MosqueWithDistance extends Mosque {
  distance: number;
}

export interface CacheData {
  elements: OsmElement[];
  timestamp: number;
}

export type Lang = 'ar' | 'en' | 'ur';