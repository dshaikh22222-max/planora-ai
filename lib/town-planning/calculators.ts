// ─────────────────────────────────────────────────────────────
// Town Planning AI Suite — UDCPR & MRTP Calculation Engine
// Ported from C:\app\town_planning_ai Flutter codebase
// ─────────────────────────────────────────────────────────────

export interface CalculatorDefinition {
  id: string;
  name: string;
  description: string;
  category: "Development Control" | "Statutory Fee" | "Spatial Planning" | "Architectural Standards" | "Valuation & TDR";
  iconName: string;
}

export const ALL_CALCULATORS: CalculatorDefinition[] = [
  {
    id: "fsi",
    name: "FSI & Built-up Area Calculator",
    description: "Calculates Basic FSI, Premium FSI (0.5), TDR loading (0.4), Ancillary FSI (80%), and Max BUA under UDCPR.",
    category: "Development Control",
    iconName: "Maximize2",
  },
  {
    id: "parking",
    name: "Parking Requirement Calculator (ECS)",
    description: "Calculates Equivalent Car Spaces (ECS) & 2-wheeler slots for Residential, Commercial, and Industrial per UDCPR Reg 8.2.",
    category: "Development Control",
    iconName: "Car",
  },
  {
    id: "premium_fsi",
    name: "Premium FSI Purchasing Fee",
    description: "Calculates Premium FSI purchasing cost based on Ready Reckoner ASR Land Rates.",
    category: "Statutory Fee",
    iconName: "Coins",
  },
  {
    id: "dev_charges",
    name: "Development Charges (MRTP Sec 124)",
    description: "Calculates Development Charge assessment under Section 124B & 124C of MRTP Act 1966.",
    category: "Statutory Fee",
    iconName: "Receipt",
  },
  {
    id: "road_width",
    name: "Road Width & ROW FSI Potential",
    description: "Calculates permissible building height, road setback, and FSI caps based on existing/proposed Road Width.",
    category: "Spatial Planning",
    iconName: "Navigation",
  },
  {
    id: "open_space",
    name: "Recreational Open Space (10% ROS)",
    description: "Calculates mandatory 10% / 15% Recreational Open Space layout surrender requirements for layout plots > 1000 sq.m.",
    category: "Spatial Planning",
    iconName: "Trees",
  },
  {
    id: "amenity",
    name: "Amenity Space Surrender (5% / 15%)",
    description: "Calculates statutory Amenity Space reservation percentage for large layout sub-divisions under UDCPR Regulation 3.5.",
    category: "Spatial Planning",
    iconName: "Building",
  },
  {
    id: "setback",
    name: "Setback & Side Margin Calculator",
    description: "Calculates mandatory Front, Rear, and Side marginal open spaces based on building height (H/4 formula).",
    category: "Architectural Standards",
    iconName: "Ruler",
  },
  {
    id: "height",
    name: "Building Height & Fire Tender Buffer",
    description: "Calculates maximum allowable building height subject to road width and mandatory 6m fire tender access.",
    category: "Architectural Standards",
    iconName: "ShieldAlert",
  },
  {
    id: "ready_reckoner",
    name: "Ready Reckoner Valuation (ASR 2024-25)",
    description: "Calculates official property valuation based on Annual Statement of Rates (ASR 2024-25) land & construction rates.",
    category: "Valuation & TDR",
    iconName: "BadgeIndianRupee",
  },
  {
    id: "tdr",
    name: "TDR Generation & Loading Potential",
    description: "Calculates TDR generated from surrender of DP Road / Amenity land (200% Road TDR) and max loading limits.",
    category: "Valuation & TDR",
    iconName: "ArrowLeftRight",
  },
];

// ── Calculation Implementations ───────────────────────────────

export function calculateFSI(data: { plotArea: number; roadWidth: number; asrRate: number }) {
  const { plotArea, roadWidth, asrRate } = data;

  const baseFsi = roadWidth >= 24 ? 1.5 : roadWidth >= 18 ? 1.4 : roadWidth >= 12 ? 1.2 : 1.1;
  const premiumFsiRatio = roadWidth >= 12 ? 0.5 : 0.3;
  const tdrRatio = roadWidth >= 12 ? 0.4 : 0.2;
  const ancillaryRatio = 0.8; // 80%

  const maxTotalFsi = +(baseFsi + premiumFsiRatio + tdrRatio).toFixed(2);
  const basicBua = Math.round(plotArea * baseFsi);
  const premiumFsiBua = Math.round(plotArea * premiumFsiRatio);
  const tdrBua = Math.round(plotArea * tdrRatio);

  const totalGrossFsiBua = basicBua + premiumFsiBua + tdrBua;
  const ancillaryBua = Math.round(totalGrossFsiBua * ancillaryRatio);
  const totalPermissibleBua = totalGrossFsiBua + ancillaryBua;

  // Premium FSI cost (35% of ASR rate)
  const premiumFsiCost = Math.round(premiumFsiBua * (asrRate * 0.35));

  return {
    baseFsi,
    premiumFsiRatio,
    tdrRatio,
    maxTotalFsi,
    basicBua,
    premiumFsiBua,
    tdrBua,
    totalGrossFsiBua,
    ancillaryBua,
    totalPermissibleBua,
    premiumFsiCost,
  };
}

export function calculateSetbacks(data: { buildingHeight: number; roadWidth: number }) {
  const { buildingHeight, roadWidth } = data;

  let frontSetback = 3.0;
  if (roadWidth >= 24) frontSetback = 6.0;
  else if (roadWidth >= 18) frontSetback = 4.5;
  else if (roadWidth >= 12) frontSetback = 3.5;

  // H/4 margin rule for side/rear with min 3m up to 15m height, min 4.5m for 15-24m, min 6.0m for >24m
  let sideMargin = Math.max(3.0, +(buildingHeight / 4).toFixed(2));
  if (buildingHeight > 24) {
    sideMargin = Math.max(6.0, sideMargin);
  } else if (buildingHeight > 15) {
    sideMargin = Math.max(4.5, sideMargin);
  }

  const fireTenderAccessRequired = buildingHeight >= 15;

  return {
    frontSetback,
    sideMargin,
    rearSetback: sideMargin,
    fireTenderAccessRequired,
    fireBufferWidth: fireTenderAccessRequired ? 6.0 : 3.0,
  };
}

export function calculateParking(data: { residentialUnits: number; commercialAreaSqM: number }) {
  const { residentialUnits, commercialAreaSqM } = data;

  // 1 ECS per 100 sq.m commercial; 1 ECS per 2 residential units > 80 sq.m
  const resEcs = Math.ceil(residentialUnits / 2);
  const commEcs = Math.ceil(commercialAreaSqM / 100);
  const totalEcs = resEcs + commEcs;

  const totalTwoWheelers = totalEcs * 2;
  const totalBicycles = totalEcs * 2;

  return {
    resEcs,
    commEcs,
    totalEcs,
    totalTwoWheelers,
    totalBicycles,
    stiltCarSpaces: Math.ceil(totalEcs * 0.6),
    openCarSpaces: Math.floor(totalEcs * 0.4),
  };
}

export function calculateDevCharges(data: { plotArea: number; builtUpArea: number; asrRate: number }) {
  const { plotArea, builtUpArea, asrRate } = data;

  // MRTP 124B: 0.5% of ASR land rate for land, 2% of ASR rate for construction
  const landDevCharge = Math.round(plotArea * (asrRate * 0.005));
  const buildingDevCharge = Math.round(builtUpArea * (asrRate * 0.02));
  const totalDevCharge = landDevCharge + buildingDevCharge;

  return {
    landDevCharge,
    buildingDevCharge,
    totalDevCharge,
  };
}
