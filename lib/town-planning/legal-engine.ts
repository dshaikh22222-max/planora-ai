// ─────────────────────────────────────────────────────────────
// Legal Engine & Statutory Knowledge Base
// Contains MRTP Act 1966, MLRC 1966, Gunthewari Act, Zoning & GIS layers
// Ported from C:\app\town_planning_ai Flutter codebase
// ─────────────────────────────────────────────────────────────

export interface ActSection {
  act: "MRTP 1966" | "MLRC 1966" | "UDCPR 2020" | "Gunthewari 2001/2021" | "RERA 2016";
  section: string;
  title: string;
  description: string;
  keyPoints: string[];
}

export const LEGAL_SECTIONS: ActSection[] = [
  {
    act: "MRTP 1966",
    section: "Section 44",
    title: "Application for Permission for Development",
    description: "Every person intending to carry out development on any land shall make an application in writing to the Planning Authority.",
    keyPoints: [
      "Mandatory permission required before starting construction",
      "Submission of 7/12 extract, city survey sheet, layout plan, and architectural drawings",
      "Deemed permission if no decision communicated within 60 days",
    ],
  },
  {
    act: "MRTP 1966",
    section: "Section 124A - 124L",
    title: "Levy and Assessment of Development Charge",
    description: "Statutory provisions for calculating and levying development charges on land development and building construction.",
    keyPoints: [
      "Charge calculated based on Annual Statement of Rates (ASR)",
      "0.5% to 2% charge levied depending on land vs. building development",
      "Exemption available for public amenities & educational institutions",
    ],
  },
  {
    act: "MLRC 1966",
    section: "Section 42 & 44",
    title: "Non-Agricultural (NA) Permission & Conversion",
    description: "Procedure for converting agricultural land for non-agricultural (Residential, Commercial, Industrial) use.",
    keyPoints: [
      "District Collector or Tahsildar approval mandatory for NA conversion",
      "Sanctioned Final Regional Plan / DP plan exempts separate NA permission under 2017 amendment",
      "NA Tax & Conversion premium payable as per Ready Reckoner ASR rate",
    ],
  },
  {
    act: "Gunthewari 2001/2021",
    section: "Section 3 & 4",
    title: "Regularization of Unauthorized Sub-divisions",
    description: "Framework for regularizing Gunthewari layouts and constructions formed on or before October 31, 2020.",
    keyPoints: [
      "Compounding fee & Infrastructure development charge calculation",
      "Mandatory 3m/6m road access verification",
      "Excludes layouts affected by DP Road / Amenity reservations or Green Zones",
    ],
  },
  {
    act: "UDCPR 2020",
    section: "Reg 3.5 & 3.6",
    title: "Amenity Space & Open Space Surrender",
    description: "Statutory requirements for surrendering 5% to 15% amenity space for sub-division of layout plots above 1000 sq.m.",
    keyPoints: [
      "10% Recreational Open Space mandatory for plots > 1000 sq.m",
      "Amenity space surrender generates 100% FSI / TDR credit",
      "Public utility hand-over required for Municipal Corporation vesting",
    ],
  },
];

export interface ZoningRule {
  zone: string;
  code: string;
  permittedUses: string[];
  maxBaseFsi: number;
  maxBuildingHeight: string;
}

export const ZONING_RULES: ZoningRule[] = [
  {
    zone: "Residential Zone 1 (R-1)",
    code: "R1",
    permittedUses: ["Single & Multi-family Dwellings", "Local Retail Stores (<50 sq.m)", "Doctor Clinics & Daycare", "Parks & Playgrounds"],
    maxBaseFsi: 1.1,
    maxBuildingHeight: "Up to 24m (Subject to Road Width)",
  },
  {
    zone: "Residential Zone 2 (R-2)",
    code: "R2",
    permittedUses: ["High-rise Apartments", "Commercial / Bank Branches", "Nursing Homes & Schools", "Mixed-use Commercial Ground Floor"],
    maxBaseFsi: 1.2,
    maxBuildingHeight: "Up to 70m (Subject to Fire Tender Access & Road Width >= 12m)",
  },
  {
    zone: "Commercial Zone (C)",
    code: "C",
    permittedUses: ["Shopping Complexes & Malls", "IT Parks & Corporate Offices", "Hotels & Multiplexes", "Wholesale Markets"],
    maxBaseFsi: 1.5,
    maxBuildingHeight: "No Height Limit (Subject to Airport NOC & Road Width >= 18m)",
  },
  {
    zone: "Industrial Zone (I)",
    code: "I",
    permittedUses: ["Manufacturing Units & Warehouses", "Logistics Parks & Service Stations", "Cold Storage & R&D Labs"],
    maxBaseFsi: 1.0,
    maxBuildingHeight: "As per Industrial Safety & Factory Inspectorate NOC",
  },
  {
    zone: "Green / Agriculture Zone",
    code: "G / AG",
    permittedUses: ["Agriculture & Agro-tourism", "Farm Houses (max 150 sq.m BUA)", "Solar Power Plants", "Poultry & Brick Kilns"],
    maxBaseFsi: 0.2,
    maxBuildingHeight: "Single storey / max 9m",
  },
];

// Gunthewari Regularization Fee Assessment
export function calculateGunthewariFee(data: { plotAreaSqFt: number; asrLandRatePerSqM: number; builtUpSqFt: number }) {
  const { plotAreaSqFt, asrLandRatePerSqM, builtUpSqFt } = data;

  const plotAreaSqM = plotAreaSqFt / 10.764;
  const builtUpSqM = builtUpSqFt / 10.764;

  // Regularization Charge: 10% of ASR Land Rate for Plot Area
  const plotRegularizationFee = Math.round(plotAreaSqM * (asrLandRatePerSqM * 0.10));
  // Compounding Charge for Construction: 15% of ASR Construction Rate
  const constructionCompoundingFee = Math.round(builtUpSqM * (asrLandRatePerSqM * 0.15));
  // Development & Scrutiny Fee
  const infrastructureFee = Math.round(plotAreaSqFt * 15); // ₹15 per sq.ft

  const totalRegularizationCost = plotRegularizationFee + constructionCompoundingFee + infrastructureFee;

  return {
    plotRegularizationFee,
    constructionCompoundingFee,
    infrastructureFee,
    totalRegularizationCost,
  };
}
