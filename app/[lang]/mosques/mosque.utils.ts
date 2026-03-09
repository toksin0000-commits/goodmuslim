// app/[lang]/mosques/mosque.utils.ts
import { OsmElement, Mosque, MosqueWithDistance, Lang } from './mosque.types';

export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371; // Poloměr Země v km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const getMosqueName = (el: OsmElement, lang: Lang): string => {
  if (lang === 'ar' && el.tags?.["name:ar"]) return el.tags["name:ar"];
  if (lang === 'ur' && el.tags?.["name:ur"]) return el.tags["name:ur"];
  if (lang === 'en' && el.tags?.["name:en"]) return el.tags["name:en"];
  return el.tags?.name || "";
};

export const processElements = (
  elements: OsmElement[], 
  latitude: number, 
  longitude: number,
  nearbyMosque: string
) => {
  return elements
    .filter((el: OsmElement) => el.tags?.name)
    .map((el: OsmElement) => ({
      name: el.tags?.name || "",
      name_ar: el.tags?.["name:ar"],
      name_en: el.tags?.["name:en"],
      name_ur: el.tags?.["name:ur"],
      address: el.tags?.["addr:city"] || 
               el.tags?.["addr:town"] || 
               el.tags?.["addr:village"] || 
               nearbyMosque,
      lat: el.lat || el.center?.lat || 0,
      lng: el.lon || el.center?.lon || 0,
      denomination: el.tags?.denomination || "",
      opening_hours: el.tags?.["opening_hours"],
      phone: el.tags?.phone,
      website: el.tags?.website
    }))
    .filter((mosque: Mosque) => mosque.lat && mosque.lng)
    .map((mosque: Mosque) => ({
      ...mosque,
      distance: calculateDistance(latitude, longitude, mosque.lat, mosque.lng)
    }))
    .filter((mosque: MosqueWithDistance) => mosque.distance <= 5) // V okruhu 5 km
    .sort((a: MosqueWithDistance, b: MosqueWithDistance) => a.distance - b.distance)
    .slice(0, 10);
};