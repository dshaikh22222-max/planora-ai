// ─────────────────────────────────────────────────────────────
// Advanced GIS & Spatial Engine — Vector Geometry & Spatial Analysis
// ─────────────────────────────────────────────────────────────

export interface LatLng {
  lat: number;
  lng: number;
}

export interface PolygonBoundary {
  id: string;
  surveyNo: string;
  gatNo?: string;
  ctsNo?: string;
  village: string;
  zone: "R1" | "R2" | "C" | "I" | "G" | "DP_RESERVATION";
  ownerName: string;
  areaSqM: number;
  coordinates: [number, number][]; // [lng, lat]
}

/** Calculate Euclidean / Haversine distance between two coordinates in meters */
export function calculateDistanceMeters(p1: LatLng, p2: LatLng): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (p1.lat * Math.PI) / 180;
  const φ2 = (p2.lat * Math.PI) / 180;
  const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
  const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/** Calculate polygon area in square meters using Shoelace formula */
export function calculatePolygonAreaSqM(coords: [number, number][]): number {
  if (coords.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < coords.length; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % coords.length];
    if (p1 && p2) {
      area += p1[0] * p2[1];
      area -= p2[0] * p1[1];
    }
  }
  // Convert approximate degrees to sq.m near Pune lat (18.52° N)
  const degSqM = Math.abs(area / 2);
  const factor = 111320 * 111320 * Math.cos((18.52 * Math.PI) / 180);
  return Math.round(degSqM * factor);
}

/** Calculate buffer zone radius coordinates */
export function generateBufferPolygon(center: LatLng, radiusMeters: number): [number, number][] {
  const points = 32;
  const coords: [number, number][] = [];
  const km = radiusMeters / 1000;
  const latR = (center.lat * Math.PI) / 180;

  for (let i = 0; i < points; i++) {
    const theta = (i * 2 * Math.PI) / points;
    const dLat = (km / 6371) * (180 / Math.PI) * Math.sin(theta);
    const dLng =
      ((km / 6371) * (180 / Math.PI) * Math.cos(theta)) / Math.cos(latR);

    coords.push([+(center.lng + dLng).toFixed(6), +(center.lat + dLat).toFixed(6)]);
  }

  return coords;
}

/** Sample Land Record Boundaries for Pune Jurisdiction */
export const SAMPLE_LAND_PARCELS: PolygonBoundary[] = [
  {
    id: "parcel-44-2a",
    surveyNo: "44/2A",
    gatNo: "128",
    ctsNo: "892",
    village: "Kothrud",
    zone: "R2",
    ownerName: "Rajesh Kumar & Sons",
    areaSqM: 1450,
    coordinates: [
      [73.8123, 18.5082],
      [73.8135, 18.5085],
      [73.8138, 18.5076],
      [73.8125, 18.5073],
      [73.8123, 18.5082],
    ],
  },
  {
    id: "parcel-108-1b",
    surveyNo: "108/1B",
    gatNo: "245",
    ctsNo: "1402",
    village: "Baner",
    zone: "C",
    ownerName: "Maharashtra Infra Developers",
    areaSqM: 3200,
    coordinates: [
      [73.7845, 18.5592],
      [73.7862, 18.5598],
      [73.7868, 18.5585],
      [73.7850, 18.5579],
      [73.7845, 18.5592],
    ],
  },
  {
    id: "parcel-DP-ROAD-04",
    surveyNo: "DP-RES-14",
    gatNo: "310",
    village: "Wakad",
    zone: "DP_RESERVATION",
    ownerName: "Pimpri Chinchwad Municipal Corp (PMC)",
    areaSqM: 4800,
    coordinates: [
      [73.7621, 18.5982],
      [73.7645, 18.5990],
      [73.7650, 18.5975],
      [73.7626, 18.5968],
      [73.7621, 18.5982],
    ],
  },
];
