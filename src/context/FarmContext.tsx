import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FarmerProfile,
  WeatherState,
  RiskItem,
  DiseaseScreeningResult,
  CropOption,
  MarketOption,
  DigitalZone,
  ActionPlanItem,
  CopilotMessage,
  Language,
  ExplainableMetadata,
} from '../types/farm';

export interface FarmContextType {
  // Profile
  profile: FarmerProfile;
  updateProfile: (updates: Partial<FarmerProfile>) => void;
  loadPresetProfile: (presetKey: string) => void;

  // Language & Connectivity
  language: Language;
  setLanguage: (lang: Language) => void;
  isOffline: boolean;
  toggleOffline: () => void;
  isSyncing: boolean;

  // Weather & Agronomic Advisory
  weather: WeatherState;

  // Risk Intelligence
  risks: RiskItem[];

  // Disease Screening
  screeningHistory: DiseaseScreeningResult[];
  addScreeningResult: (result: DiseaseScreeningResult) => void;

  // Crop Engine
  cropOptions: CropOption[];
  comparedCropIds: string[];
  toggleCompareCrop: (cropId: string) => void;

  // Markets & Calculator
  markets: MarketOption[];

  // Digital Twin
  digitalZones: DigitalZone[];
  selectedZone: DigitalZone | null;
  setSelectedZone: (zone: DigitalZone | null) => void;

  // Action Plan
  actionPlan: ActionPlanItem[];
  toggleActionCompleted: (id: string) => void;

  // AI Copilot
  copilotMessages: CopilotMessage[];
  addCopilotMessage: (msg: Omit<CopilotMessage, 'id' | 'timestamp'>) => void;
  isCopilotLoading: boolean;
  sendCopilotQuery: (userQuery: string) => Promise<void>;

  // Explainable AI Modal
  explainableData: ExplainableMetadata | null;
  openExplainableModal: (data: ExplainableMetadata) => void;
  closeExplainableModal: () => void;

  // Voice TTS
  speakText: (text: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;

  // Hackathon Demo Walkthrough
  demoStep: number | null;
  setDemoStep: (step: number | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DEFAULT_PROFILE: FarmerProfile = {
  farmerName: 'Ramesh Patel',
  location: 'Sambalpur',
  state: 'Odisha',
  farmSize: 5,
  sizeUnit: 'Acres',
  soilType: 'Alluvial Soil',
  currentCrop: 'Paddy (Swarna)',
  cropVariety: 'Swarna MTU 7029',
  cropStage: 'Vegetative Stage',
  sowingDate: '2026-07-15',
  expectedHarvestDate: '2026-11-20',
  previousCrops: 'Mustard, Green Gram (Moong)',
  previousYield: 24, // Q/acre
  previousProblems: 'Stem Borer & Leaf Blast during humid monsoon peak',
  waterAvailability: 'Hirakud Canal System + 1 Electric Borewell (Adequate)',
  irrigationType: 'Canal',
  preferredMarkets: 'Sambalpur Regulated APMC Mandi, Bargarh Grain Hub',
};

const PRESETS: Record<string, Partial<FarmerProfile>> = {
  ramesh: {
    farmerName: 'Ramesh Patel',
    location: 'Sambalpur',
    state: 'Odisha',
    farmSize: 5,
    soilType: 'Alluvial Soil',
    currentCrop: 'Paddy (Swarna)',
    cropVariety: 'Swarna MTU 7029',
    cropStage: 'Vegetative Stage',
    previousYield: 24,
    previousProblems: 'Stem Borer & Leaf Blast during humid monsoon peak',
    waterAvailability: 'Hirakud Canal System + 1 Electric Borewell (Adequate)',
    preferredMarkets: 'Sambalpur Regulated APMC Mandi, Bargarh Grain Hub',
  },
  priya: {
    farmerName: 'Priya Mohanty',
    location: 'Bargarh',
    state: 'Odisha',
    farmSize: 8,
    soilType: 'Clay Loam',
    currentCrop: 'Paddy (Pooja)',
    cropVariety: 'Pooja (CR 1018)',
    cropStage: 'Flowering / Panicle Initiation',
    previousYield: 28,
    previousProblems: 'Brown Plant Hopper (BPH) & Water stagnation in lower parcel',
    waterAvailability: 'Lift Irrigation Project + Borewell',
    preferredMarkets: 'Bargarh Main Mandi, Attabira Rice Millers',
  },
  harpreet: {
    farmerName: 'Harpreet Singh',
    location: 'Karnal',
    state: 'Haryana',
    farmSize: 12,
    soilType: 'Alluvial Soil',
    currentCrop: 'Wheat (HD 3086)',
    cropVariety: 'Pusa Wheat HD 3086',
    cropStage: 'Tillering / Branching',
    previousYield: 22,
    previousProblems: 'Yellow Rust outbreak & terminal heat stress in late March',
    waterAvailability: 'Western Yamuna Canal + Deep Submersible Tube-well',
    preferredMarkets: 'Karnal Grain Market, Taraori Basmati Hub',
  },
  rajesh: {
    farmerName: 'Rajesh Patil',
    location: 'Jalgaon',
    state: 'Maharashtra',
    farmSize: 6,
    soilType: 'Black Cotton Soil',
    currentCrop: 'Bt Cotton',
    cropVariety: 'Bollgard II Hybrid',
    cropStage: 'Flowering / Panicle Initiation',
    previousYield: 14,
    previousProblems: 'Pink Bollworm & intermittent dry spells',
    waterAvailability: 'Drip Irrigation from Farm Pond + Borewell',
    preferredMarkets: 'Jalgaon Cotton Yard, Bhusawal Cotton Ginning',
  },
};

const DEFAULT_WEATHER: WeatherState = {
  currentTemp: 31,
  feelsLike: 35,
  humidity: 78,
  rainProbability: 45,
  windSpeed: 11,
  windDirection: 'South-Southwest (SSW)',
  condition: 'Partly Cloudy with Humidity Spike',
  warningAlert: 'Rain expected tomorrow (18-24mm). Consider reviewing irrigation before applying additional water.',
  cropImpact:
    'Favorable for vegetative tillering, but high leaf moisture (>80%) creates favorable conditions for sheath blight and fungal colonization.',
  irrigationRecommendation:
    'Rain expected tomorrow. Pause canal pumping today to prevent waterlogging and nitrogen leaching.',
  sprayingRecommendation:
    'Hold systemic foliar sprays until Thursday morning when wind drops below 8 km/h and rain clears.',
  harvestRecommendation:
    'Dry window expected in +4 to +7 days. Unfavorable for harvesting wet grain today.',
  reason:
    'Cross-correlation of Barometric drop (-3.2 hPa), 78% relative humidity, and 45% precipitation probability within 36 hours.',
  dataSource: 'VERIFIED',
  forecast7Days: [
    {
      dayName: 'Today',
      dateStr: 'Oct 3',
      tempMax: 32,
      tempMin: 24,
      rainProb: 20,
      condition: 'Partly Cloudy',
      humidity: 74,
      windSpeedKm: 11,
      spraySuitability: 'Ideal',
      irrigationAdvice: 'Delay: Rain incoming',
    },
    {
      dayName: 'Tomorrow',
      dateStr: 'Oct 4',
      tempMax: 29,
      tempMin: 23,
      rainProb: 75,
      condition: 'Rain Showers',
      humidity: 88,
      windSpeedKm: 16,
      spraySuitability: 'Unsuitable',
      irrigationAdvice: 'Zero irrigation needed',
    },
    {
      dayName: 'Fri',
      dateStr: 'Oct 5',
      tempMax: 30,
      tempMin: 23,
      rainProb: 40,
      condition: 'Partly Cloudy',
      humidity: 82,
      windSpeedKm: 12,
      spraySuitability: 'Caution',
      irrigationAdvice: 'Drain standing water',
    },
    {
      dayName: 'Sat',
      dateStr: 'Oct 6',
      tempMax: 33,
      tempMin: 24,
      rainProb: 15,
      condition: 'Sunny',
      humidity: 68,
      windSpeedKm: 8,
      spraySuitability: 'Ideal',
      irrigationAdvice: 'Optimal soil moisture',
    },
    {
      dayName: 'Sun',
      dateStr: 'Oct 7',
      tempMax: 34,
      tempMin: 25,
      rainProb: 10,
      condition: 'Sunny',
      humidity: 62,
      windSpeedKm: 9,
      spraySuitability: 'Ideal',
      irrigationAdvice: 'Light irrigation if needed',
    },
    {
      dayName: 'Mon',
      dateStr: 'Oct 8',
      tempMax: 33,
      tempMin: 24,
      rainProb: 20,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeedKm: 10,
      spraySuitability: 'Ideal',
      irrigationAdvice: 'Adequate moisture',
    },
    {
      dayName: 'Tue',
      dateStr: 'Oct 9',
      tempMax: 32,
      tempMin: 24,
      rainProb: 25,
      condition: 'Partly Cloudy',
      humidity: 70,
      windSpeedKm: 11,
      spraySuitability: 'Ideal',
      irrigationAdvice: 'Routine schedule',
    },
  ],
};

const DEFAULT_RISKS: RiskItem[] = [
  {
    id: 'risk-1',
    category: 'Weather',
    name: 'Localized Waterlogging & Runoff',
    level: 'MEDIUM',
    probability: 72,
    confidence: 88,
    impactDescription: 'Water accumulation in lower plots may deprive root zones of oxygen and leach urea top-dressing.',
    reason: '75% probability of 22mm rainfall tomorrow colliding with saturated topsoil (68% current moisture).',
    recommendedAction: 'Clear field bund spillways and open peripheral drainage ditches before nightfall.',
    timeHorizon: 'TOMORROW',
    dataSource: 'AI PREDICTION',
  },
  {
    id: 'risk-2',
    category: 'Pest',
    name: 'Yellow Stem Borer / Sheath Blight Surge',
    level: 'HIGH',
    probability: 68,
    confidence: 83,
    impactDescription: 'Canopy humidity exceeding 80% for >18 consecutive hours accelerates pathogen spore germination.',
    reason: 'Historical farm incident record shows vulnerability at current vegetative stage under warm-humid conditions.',
    recommendedAction: 'Install 4 pheromone traps per acre today; inspect lower stem sheaths for oval necrotic lesions.',
    timeHorizon: '+3 DAYS',
    dataSource: 'AI PREDICTION',
  },
  {
    id: 'risk-3',
    category: 'Water',
    name: 'Canal Headworks Scheduled Maintenance',
    level: 'LOW',
    probability: 35,
    confidence: 90,
    impactDescription: 'Temporary 48-hour canal flow reduction; borewell will be required if rain is insufficient.',
    reason: 'Department of Water Resources rotational gate inspection notice for Sambalpur main distributary.',
    recommendedAction: 'Check borewell motor wiring and test backup diesel generator if canal level dips.',
    timeHorizon: '+7 DAYS',
    dataSource: 'VERIFIED',
  },
  {
    id: 'risk-4',
    category: 'Market',
    name: 'Post-Harvest Mandi Influx Price Dip',
    level: 'MEDIUM',
    probability: 60,
    confidence: 79,
    impactDescription: 'Heavy arrivals from neighboring districts could dampen spot prices by ₹90-140/quintal in week 3.',
    reason: 'AI prediction model shows cluster harvest arrivals synchronizing across Bargarh-Sambalpur belt.',
    recommendedAction: 'Consider booking warehouse storage receipt financing or lock in agro-processor forward contracts.',
    timeHorizon: '+7 DAYS',
    dataSource: 'AI PREDICTION',
  },
];

const DEFAULT_CROPS: CropOption[] = [
  {
    id: 'crop-paddy',
    name: 'Swarna Paddy (MTU 7029)',
    suitableSeason: 'Kharif',
    expectedYieldRange: '24 - 28 Q/Acre',
    expectedYieldNumeric: 26,
    waterRequirement: 'High',
    waterRequirementLiters: '1,200 - 1,400 mm',
    growingPeriodDays: 140,
    marketDemand: 'Very High',
    expectedPricePerQ: 2420,
    expectedRevenuePerAcre: 62920,
    costPerAcre: 21500,
    netMarginPerAcre: 41420,
    riskLevel: 'LOW',
    whyRecommended:
      'Proven high yield history on your Alluvial soil with assured Hirakud canal irrigation. High MSP procurement backing.',
    confidence: 94,
    suitableSoilTypes: ['Alluvial Soil', 'Clay Loam'],
  },
  {
    id: 'crop-mustard',
    name: 'Pusa Bold Mustard (Rabi Rotation)',
    suitableSeason: 'Rabi (Post-Paddy)',
    expectedYieldRange: '8 - 10 Q/Acre',
    expectedYieldNumeric: 9,
    waterRequirement: 'Low',
    waterRequirementLiters: '300 - 400 mm',
    growingPeriodDays: 115,
    marketDemand: 'High',
    expectedPricePerQ: 5850,
    expectedRevenuePerAcre: 52650,
    costPerAcre: 13200,
    netMarginPerAcre: 39450,
    riskLevel: 'LOW',
    whyRecommended:
      'Ideal residual moisture crop following Kharif paddy. Requires minimal water (2 irrigations) with strong edible oil market demand.',
    confidence: 91,
    suitableSoilTypes: ['Alluvial Soil', 'Red Sandy Loam', 'Clay Loam'],
  },
  {
    id: 'crop-maize',
    name: 'Hybrid Yellow Maize (NK 6240)',
    suitableSeason: 'Rabi / Spring',
    expectedYieldRange: '32 - 38 Q/Acre',
    expectedYieldNumeric: 35,
    waterRequirement: 'Medium',
    waterRequirementLiters: '500 - 600 mm',
    growingPeriodDays: 110,
    marketDemand: 'Very High',
    expectedPricePerQ: 2150,
    expectedRevenuePerAcre: 75250,
    costPerAcre: 24000,
    netMarginPerAcre: 51250,
    riskLevel: 'MEDIUM',
    whyRecommended:
      'Huge demand from regional poultry and feed manufacturers in Odisha. Shorter duration than paddy with superior net margins.',
    confidence: 87,
    suitableSoilTypes: ['Alluvial Soil', 'Red Sandy Loam'],
  },
  {
    id: 'crop-blackgram',
    name: 'Black Gram / Urad (PU 31)',
    suitableSeason: 'Summer / Rabi Catch',
    expectedYieldRange: '5 - 7 Q/Acre',
    expectedYieldNumeric: 6,
    waterRequirement: 'Low',
    waterRequirementLiters: '250 - 300 mm',
    growingPeriodDays: 75,
    marketDemand: 'High',
    expectedPricePerQ: 7400,
    expectedRevenuePerAcre: 44400,
    costPerAcre: 9800,
    netMarginPerAcre: 34600,
    riskLevel: 'LOW',
    whyRecommended:
      'Fixes atmospheric nitrogen into your soil, replenishing nutrients after exhaustive cereals. Short 75-day cash rotation.',
    confidence: 89,
    suitableSoilTypes: ['Alluvial Soil', 'Clay Loam', 'Red Sandy Loam'],
  },
];

const DEFAULT_MARKETS: MarketOption[] = [
  {
    id: 'market-1',
    name: 'Sambalpur APMC Mandi (Regulated)',
    type: 'APMC Mandi',
    location: 'Khetrajpur, Sambalpur',
    distanceKm: 14,
    sellingPricePerQ: 2420,
    transportCostPerQ: 45,
    storageCostPerQ: 18,
    handlingCostPerQ: 22,
    paymentTerm: 'Immediate Mandi Slip',
    priceTrend: 'stable',
    trendPercent: 0.8,
    dataSource: 'VERIFIED',
  },
  {
    id: 'market-2',
    name: 'Bargarh Grain Trading Hub',
    type: 'APMC Mandi',
    location: 'Bargarh Bypass Terminal',
    distanceKm: 42,
    sellingPricePerQ: 2510,
    transportCostPerQ: 110,
    storageCostPerQ: 20,
    handlingCostPerQ: 25,
    paymentTerm: '3 Days Bank Transfer',
    priceTrend: 'up',
    trendPercent: 3.7,
    dataSource: 'VERIFIED',
  },
  {
    id: 'market-3',
    name: 'Maa Samaleswari Rice Processor Direct',
    type: 'Private Processor',
    location: 'Industrial Estate, Jharsuguda Road',
    distanceKm: 26,
    sellingPricePerQ: 2490,
    transportCostPerQ: 75,
    storageCostPerQ: 0, // Direct unloading
    handlingCostPerQ: 15,
    paymentTerm: 'Same Day UPI/Cash',
    priceTrend: 'up',
    trendPercent: 2.9,
    dataSource: 'ESTIMATED',
  },
  {
    id: 'market-4',
    name: 'Local Village Farmer Haat',
    type: 'Local Haat',
    location: 'Dhankauda Block',
    distanceKm: 4,
    sellingPricePerQ: 2340,
    transportCostPerQ: 15,
    storageCostPerQ: 0,
    handlingCostPerQ: 10,
    paymentTerm: 'Same Day UPI/Cash',
    priceTrend: 'down',
    trendPercent: -1.2,
    dataSource: 'DEMO DATA',
  },
];

const DEFAULT_ZONES: DigitalZone[] = [
  {
    id: 'zone-1',
    zoneCode: 'ZONE A',
    name: 'North Canal Parcel',
    areaAcres: 1.8,
    crop: 'Paddy (Swarna)',
    status: 'Healthy',
    healthScore: 92,
    soilMoisturePct: 72,
    nitrogenStatus: 'Optimal',
    identifiedRisk: 'None imminent; vigorous canopy development',
    recommendedAction: 'Maintain current biological pest scouting schedule',
    color: '#10b981', // green
  },
  {
    id: 'zone-2',
    zoneCode: 'ZONE B',
    name: 'East Slope Section',
    areaAcres: 1.2,
    crop: 'Paddy (Swarna)',
    status: 'Pest Risk',
    healthScore: 78,
    soilMoisturePct: 69,
    nitrogenStatus: 'Adequate',
    identifiedRisk: 'Stem borer egg masses noted on border leaf margins',
    recommendedAction: 'Install 2 pheromone lure traps and spray Neem oil (5ml/L)',
    color: '#f59e0b', // amber
  },
  {
    id: 'zone-3',
    zoneCode: 'ZONE C',
    name: 'South Lowland Drain',
    areaAcres: 1.0,
    crop: 'Paddy (Swarna)',
    status: 'Water Stressed',
    healthScore: 71,
    soilMoisturePct: 86,
    nitrogenStatus: 'Deficient',
    identifiedRisk: 'Excessive water stagnation causing early root yellowing',
    recommendedAction: 'Open trench gate to discharge excess water into main drain',
    color: '#06b6d4', // cyan/water
  },
  {
    id: 'zone-4',
    zoneCode: 'ZONE D',
    name: 'West Borewell Patch',
    areaAcres: 1.0,
    crop: 'Paddy (Swarna)',
    status: 'Needs Inspection',
    healthScore: 66,
    soilMoisturePct: 54,
    nitrogenStatus: 'Deficient',
    identifiedRisk: 'Irregular leaf chlorosis and patchiness detected in sensor sweep',
    recommendedAction: 'Conduct physical walk-through and upload close-up leaf photo for AI screening',
    color: '#ef4444', // red
  },
];

const DEFAULT_ACTIONS: ActionPlanItem[] = [
  {
    id: 'act-1',
    timeframe: 'TODAY',
    urgency: 'Urgent',
    title: 'Open plot spillways to prepare for rain runoff',
    description: 'Ensure drainage channels at the lower corner of Zone C are cleared of silt.',
    why: 'Rainfall of 22mm is expected tomorrow. Standing water in heavy alluvial soil causes root asphyxiation.',
    riskIfIgnored: 'Root rot and premature sheath degradation in 1.0 acre of paddy.',
    dataUsed: ['Weather Model (75% Rain Prob)', 'Soil Profile (Alluvial Clay Content)', 'Digital Twin Zone C Moisture (86%)'],
    completed: false,
    category: 'Irrigation',
  },
  {
    id: 'act-2',
    timeframe: 'TODAY',
    urgency: 'Important',
    title: 'Hold canal pumping for 48 hours',
    description: 'Do not run the borewell or request canal sluice release today.',
    why: 'Root zone moisture is already at 72%. Additional water is redundant and wastes ₹320 in power.',
    riskIfIgnored: 'Excess nutrient leaching and nitrogen runoff into peripheral ditches.',
    dataUsed: ['Field Moisture Sensors (72%)', 'Rain Probability (75% Tomorrow)'],
    completed: false,
    category: 'Irrigation',
  },
  {
    id: 'act-3',
    timeframe: 'NEXT 3 DAYS',
    urgency: 'Important',
    title: 'Install 4 yellow stem borer pheromone traps',
    description: 'Set traps 1 foot above the crop canopy across Zone B and Zone A.',
    why: 'Warm, humid weather (78% humidity, 31°C) triggers adult stem borer flight and egg laying.',
    riskIfIgnored: 'Dead-heart damage at tillering stage, leading to up to 15% yield loss.',
    dataUsed: ['Farm History (Stem Borer Recurring Problem)', 'Microclimate Humidity Index', 'Crop Stage (Vegetative)'],
    completed: false,
    category: 'Protection',
  },
  {
    id: 'act-4',
    timeframe: 'NEXT 3 DAYS',
    urgency: 'Planned',
    title: 'Perform visual leaf spot screening in Zone D',
    description: 'Take 2 close-up photos of leaves showing yellowing margins and run through AI Disease Screener.',
    why: 'Early chlorosis detected; early biological intervention costs 80% less than corrective chemical fungicide.',
    riskIfIgnored: 'Uncontrolled fungal blast spread across adjacent 1.8-acre parcel.',
    dataUsed: ['Digital Twin Zone D Health Alert (66%)', 'Agronomy Disease Knowledge Base'],
    completed: false,
    category: 'Protection',
  },
  {
    id: 'act-5',
    timeframe: 'NEXT 7 DAYS',
    urgency: 'Planned',
    title: 'Review Forward Purchase with Maa Samaleswari Processor',
    description: 'Compare transport costs and lock in ₹2,490/Q with zero storage deductions.',
    why: 'Market arrivals surge predicted in 2 weeks; direct processor agreement guarantees immediate cash liquidity.',
    riskIfIgnored: 'Forced to sell during post-harvest price glut at ₹120-180/Q lower rate.',
    dataUsed: ['Market Optimizer (Net Return +₹4,800)', 'Historical APMC Arrival Curves'],
    completed: false,
    category: 'Market',
  },
];

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial profile from localStorage or fallback
  const [profile, setProfile] = useState<FarmerProfile>(() => {
    const saved = localStorage.getItem('ai_farm_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_PROFILE;
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ai_farm_lang');
    return (saved as Language) || 'en';
  });

  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [weather] = useState<WeatherState>(DEFAULT_WEATHER);
  const [risks] = useState<RiskItem[]>(DEFAULT_RISKS);
  const [cropOptions] = useState<CropOption[]>(DEFAULT_CROPS);
  const [comparedCropIds, setComparedCropIds] = useState<string[]>(['crop-paddy', 'crop-maize']);
  const [markets] = useState<MarketOption[]>(DEFAULT_MARKETS);
  const [digitalZones] = useState<DigitalZone[]>(DEFAULT_ZONES);
  const [selectedZone, setSelectedZone] = useState<DigitalZone | null>(DEFAULT_ZONES[1]);
  const [actionPlan, setActionPlan] = useState<ActionPlanItem[]>(() => {
    const saved = localStorage.getItem('ai_farm_actions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_ACTIONS;
  });

  const [screeningHistory, setScreeningHistory] = useState<DiseaseScreeningResult[]>([
    {
      id: 'scan-init-1',
      imagePreviewUrl: 'https://images.unsplash.com/photo-1599818818556-91e847c50a1d?w=400&auto=format&fit=crop&q=80',
      cropType: 'Paddy',
      possibleIssue: 'Early Leaf Blast (Magnaporthe oryzae)',
      confidence: 84,
      severity: 'MEDIUM',
      symptoms: [
        'Elliptical diamond-shaped lesions with grayish center',
        'Brown necrosis on leaf margins',
        'Early chlorosis in leaf sheath',
      ],
      recommendedSteps: [
        'Drain standing excess water to reduce leaf wetness',
        'Pause chemical urea/nitrogen fertilization',
        'Apply bio-fungicide Pseudomonas fluorescens or consult KVK agronomist',
      ],
      whyRecommendation:
        'Visual pattern of acute spindle-shaped spots matches fungal blast triggered by high humidity (78%) and night dew.',
      warning: 'Preliminary AI screening only. Consult certified extension specialists.',
      scannedAt: 'Yesterday, 4:15 PM',
    },
  ]);

  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Namaste ${profile.farmerName}! I am your AI Farm Copilot. I have synchronized with your ${profile.farmSize}-acre ${profile.currentCrop} farm in ${profile.location}. How can I assist your farming decisions today?`,
      timestamp: 'Just now',
      whyExplanation: {
        inputsConsidered: [
          'Farmer Profile: ' + profile.farmerName,
          'Current Crop: ' + profile.currentCrop,
          'Crop Stage: ' + profile.cropStage,
          'Soil: ' + profile.soilType,
          'Live Weather Forecast: 45% Rain probability',
        ],
        weatherFactors: 'Approaching rain front with high humidity',
        cropStageFactor: 'Vegetative growth phase requires careful water management',
        confidence: 96,
        dataSource: 'VERIFIED',
        disclaimer: 'Decision-support assistant. Always verify field parameters.',
      },
    },
  ]);

  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [explainableData, setExplainableData] = useState<ExplainableMetadata | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [demoStep, setDemoStep] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Save profile to localStorage on change
  useEffect(() => {
    localStorage.setItem('ai_farm_profile', JSON.stringify(profile));
  }, [profile]);

  // Save actions to localStorage
  useEffect(() => {
    localStorage.setItem('ai_farm_actions', JSON.stringify(actionPlan));
  }, [actionPlan]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ai_farm_lang', lang);
  };

  const updateProfile = (updates: Partial<FarmerProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      // If name changed, update welcome message dynamically
      if (updates.farmerName && updates.farmerName !== prev.farmerName) {
        setCopilotMessages((m) => [
          ...m,
          {
            id: 'profile-update-' + Date.now(),
            sender: 'assistant',
            text: `Profile updated. Welcome, ${updates.farmerName}! All farm recommendations, market plans, and risk alerts are now customized for your farm in ${updated.location}.`,
            timestamp: 'Just now',
          },
        ]);
      }
      return updated;
    });
  };

  const loadPresetProfile = (presetKey: string) => {
    if (PRESETS[presetKey]) {
      setProfile((prev) => ({
        ...prev,
        ...PRESETS[presetKey],
      }));
    }
  };

  const toggleOffline = () => {
    setIsOffline((prev) => {
      const next = !prev;
      if (!next) {
        // Turning back online -> trigger syncing simulation
        setIsSyncing(true);
        setTimeout(() => {
          setIsSyncing(false);
        }, 1800);
      }
      return next;
    });
  };

  const toggleCompareCrop = (cropId: string) => {
    setComparedCropIds((prev) => {
      if (prev.includes(cropId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((id) => id !== cropId);
      } else {
        if (prev.length >= 3) {
          return [prev[1], prev[2], cropId];
        }
        return [...prev, cropId];
      }
    });
  };

  const addScreeningResult = (result: DiseaseScreeningResult) => {
    setScreeningHistory((prev) => [result, ...prev]);
  };

  const toggleActionCompleted = (id: string) => {
    setActionPlan((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const addCopilotMessage = (msg: Omit<CopilotMessage, 'id' | 'timestamp'>) => {
    const newMsg: CopilotMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setCopilotMessages((prev) => [...prev, newMsg]);
  };

  const sendCopilotQuery = async (userQuery: string) => {
    if (!userQuery.trim()) return;

    // Add user message
    addCopilotMessage({
      sender: 'user',
      text: userQuery,
    });

    setIsCopilotLoading(true);

    try {
      if (!isOffline) {
        const res = await fetch('/api/gemini/copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userQuery,
            profile,
            currentContext: {
              weather: `${weather.currentTemp}°C, ${weather.humidity}% Humidity, Rain ${weather.rainProbability}%`,
              alert: weather.warningAlert,
              stage: profile.cropStage,
              soil: profile.soilType,
            },
            language,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          addCopilotMessage({
            sender: 'assistant',
            text: data.text || 'Recommendation formulated.',
            whyExplanation: {
              inputsConsidered: [
                `Farmer Profile: ${profile.farmerName} (${profile.location})`,
                `Soil Type: ${profile.soilType}`,
                `Crop & Stage: ${profile.currentCrop} (${profile.cropStage})`,
                `Water Availability: ${profile.waterAvailability}`,
                `Weather: ${weather.currentTemp}°C, Rain ${weather.rainProbability}%`,
                `Historical Problem: ${profile.previousProblems}`,
              ],
              weatherFactors: `${weather.condition}, Humidity ${weather.humidity}%, Rain probability ${weather.rainProbability}%`,
              cropStageFactor: `Current stage (${profile.cropStage}) sensitivity to moisture and disease pressure`,
              confidence: 91,
              dataSource: (data.source?.includes('AI Prediction') ? 'AI PREDICTION' : 'VERIFIED') as any,
              disclaimer:
                'Decision support guidance based on agronomic models and weather radar. Consult your local agriculture department.',
            },
          });
          setIsCopilotLoading(false);
          return;
        }
      }

      // Offline or server fallback
      await new Promise((r) => setTimeout(r, 600));
      const fallbackResponse = generateLocalCopilotResponse(userQuery, profile, language);
      addCopilotMessage({
        sender: 'assistant',
        text: fallbackResponse,
        whyExplanation: {
          inputsConsidered: [
            `Farmer Name: ${profile.farmerName}`,
            `Location: ${profile.location}`,
            `Soil Type: ${profile.soilType}`,
            `Crop: ${profile.currentCrop}`,
            `Crop Stage: ${profile.cropStage}`,
            `Offline Cached Knowledge Engine`,
          ],
          weatherFactors: 'Local cached atmospheric forecast model',
          cropStageFactor: 'Stage-specific agronomic guidelines',
          confidence: 88,
          dataSource: isOffline ? 'DEMO DATA' : 'ESTIMATED',
          disclaimer: isOffline
            ? 'Operating in Offline Mode using cached agronomic models.'
            : 'Decision support estimation.',
        },
      });
    } catch (err) {
      console.warn('Copilot error:', err);
      const fallbackResponse = generateLocalCopilotResponse(userQuery, profile, language);
      addCopilotMessage({
        sender: 'assistant',
        text: fallbackResponse,
      });
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const openExplainableModal = (data: ExplainableMetadata) => {
    setExplainableData(data);
  };

  const closeExplainableModal = () => {
    setExplainableData(null);
  };

  // Text-To-Speech
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Voice synthesis not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <FarmContext.Provider
      value={{
        profile,
        updateProfile,
        loadPresetProfile,
        language,
        setLanguage,
        isOffline,
        toggleOffline,
        isSyncing,
        weather,
        risks,
        screeningHistory,
        addScreeningResult,
        cropOptions,
        comparedCropIds,
        toggleCompareCrop,
        markets,
        digitalZones,
        selectedZone,
        setSelectedZone,
        actionPlan,
        toggleActionCompleted,
        copilotMessages,
        addCopilotMessage,
        isCopilotLoading,
        sendCopilotQuery,
        explainableData,
        openExplainableModal,
        closeExplainableModal,
        speakText,
        isSpeaking,
        stopSpeaking,
        demoStep,
        setDemoStep,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};

function generateLocalCopilotResponse(query: string, profile: FarmerProfile, lang: Language): string {
  const name = profile.farmerName;
  const crop = profile.currentCrop;
  const stage = profile.cropStage;
  const soil = profile.soilType;
  const q = query.toLowerCase();

  if (lang === 'hi') {
    if (q.includes('rain') || q.includes('बारिश') || q.includes('barish')) {
      return `नमस्ते ${name} जी! कल 75% वर्षा (18-24 मिमी) की संभावना है। आपके ${soil} खेत में सिंचाई तुरंत रोक दें। जलभराव रोकने के लिए जल निकासी नाली साफ करें।`;
    }
    return `नमस्ते ${name} जी! आपके ${profile.farmSize} एकड़ के ${crop} (${stage}) खेत के लिए: आज मुख्य प्राथमिकता जल निकासी तैयार रखना और तना छेदक कीट की निगरानी करना है।`;
  }

  if (lang === 'or') {
    return `ନମସ୍କାର ${name} ଆଜ୍ଞା! ଆପଣଙ୍କର ${profile.farmSize} ଏକର ${crop} (${stage}) ପାଇଁ: ଆସନ୍ତାକାଲି ବର୍ଷା ହେବାର ସମ୍ଭାବନା ଅଛି। ଜଳସେଚନ ବନ୍ଦ ରଖନ୍ତୁ ଏବଂ ନିଷ୍କାସନ ନାଳି ଯାଞ୍ଚ କରନ୍ତୁ।`;
  }

  if (q.includes('today') || q.includes('should i do')) {
    return `Hello ${name}! Priority action plan for today:
1. **Irrigation**: Hold off canal pumping; rain expected tomorrow (75% probability).
2. **Crop Defense (${stage})**: Inspect Zone B border for early stem borer egg masses.
3. **Drainage**: Clear runoff ditches at the lower end of Zone C to avoid water stagnation.`;
  }

  if (q.includes('rain') || q.includes('weather')) {
    return `Hello ${name}! Rain Impact Assessment:
• 75% rain probability (18-24mm) predicted within 24-36 hours.
• In your ${soil}, this will provide ~4 days of natural soil moisture.
• Action: Pause planned chemical spraying until after rainfall clears.`;
  }

  if (q.includes('harvest')) {
    return `Hello ${name}! Harvest Decision Analysis:
• Current recorded stage: **${stage}**.
• If grain moisture is ~20%, harvesting 3 days later allows moisture to drop to 14-15%, gaining ₹90/Q quality bonus at Bargarh Mandi.
• Check our **What-If Simulator** to see side-by-side revenue comparisons!`;
  }

  if (q.includes('market') || q.includes('sell')) {
    return `Hello ${name}! Market Net Return Advisory:
• **Bargarh Hub**: ₹2,510/Q (Transport ₹110/Q) → Net: ₹2,355/Q.
• **Maa Samaleswari Processor**: ₹2,490/Q (Transport ₹75/Q, zero storage) → Net: ₹2,400/Q.
• Recommended: Selling to the Processor yields +₹4,800 more net profit for your harvest!`;
  }

  return `Hello ${name}! Farm status summary for ${crop} (${stage}):
• Crop Health Index: 88% (Good condition).
• Soil Moisture: 72% (Adequate).
• Recommended Next Step: Check the Action Plan tab for today's high-priority tasks.`;
}
