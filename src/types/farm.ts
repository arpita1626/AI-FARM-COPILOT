export type Language = 'en' | 'hi' | 'or';

export type SoilType =
  | 'Alluvial Soil'
  | 'Black Cotton Soil'
  | 'Red Sandy Loam'
  | 'Clay Loam'
  | 'Laterite Soil'
  | 'Silty Loam';

export type CropStage =
  | 'Sowing / Germination'
  | 'Vegetative Stage'
  | 'Tillering / Branching'
  | 'Flowering / Panicle Initiation'
  | 'Grain Filling / Fruit Setting'
  | 'Maturity / Ripening'
  | 'Ready for Harvest';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type DataSourceTag =
  | 'VERIFIED'
  | 'ESTIMATED'
  | 'HISTORICAL'
  | 'AI PREDICTION'
  | 'DEMO DATA';

export interface FarmerProfile {
  farmerName: string;
  location: string;
  state: string;
  farmSize: number;
  sizeUnit: 'Acres' | 'Hectares';
  soilType: SoilType;
  currentCrop: string;
  cropVariety: string;
  cropStage: CropStage;
  sowingDate: string;
  expectedHarvestDate: string;
  previousCrops: string;
  previousYield: number; // in quintals/acre
  previousProblems: string;
  waterAvailability: string;
  irrigationType: 'Canal' | 'Borewell' | 'Drip Irrigation' | 'Sprinkler' | 'Rainfed';
  preferredMarkets: string;
}

export interface WeatherDay {
  dayName: string;
  dateStr: string;
  tempMax: number;
  tempMin: number;
  rainProb: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rain Showers' | 'Heavy Rain' | 'Overcast' | 'Thunderstorm';
  humidity: number;
  windSpeedKm: number;
  spraySuitability: 'Ideal' | 'Caution' | 'Unsuitable';
  irrigationAdvice: string;
}

export interface WeatherState {
  currentTemp: number;
  feelsLike: number;
  humidity: number;
  rainProbability: number;
  windSpeed: number;
  windDirection: string;
  condition: string;
  warningAlert?: string;
  cropImpact: string;
  irrigationRecommendation: string;
  sprayingRecommendation: string;
  harvestRecommendation: string;
  reason: string;
  forecast7Days: WeatherDay[];
  dataSource: DataSourceTag;
}

export interface RiskItem {
  id: string;
  category: 'Weather' | 'Pest' | 'Water' | 'Market';
  name: string;
  level: RiskLevel;
  probability: number; // 0-100%
  confidence: number; // 0-100%
  impactDescription: string;
  reason: string;
  recommendedAction: string;
  timeHorizon: 'TODAY' | 'TOMORROW' | '+3 DAYS' | '+7 DAYS';
  dataSource: DataSourceTag;
}

export interface DiseaseScreeningResult {
  id: string;
  imagePreviewUrl: string;
  cropType: string;
  possibleIssue: string;
  confidence: number;
  severity: RiskLevel;
  symptoms: string[];
  recommendedSteps: string[];
  whyRecommendation: string;
  warning: string;
  scannedAt: string;
}

export interface CropOption {
  id: string;
  name: string;
  suitableSeason: string;
  expectedYieldRange: string;
  expectedYieldNumeric: number; // quintals/acre
  waterRequirement: 'Low' | 'Medium' | 'High';
  waterRequirementLiters: string;
  growingPeriodDays: number;
  marketDemand: 'High' | 'Very High' | 'Medium';
  expectedPricePerQ: number; // in INR
  expectedRevenuePerAcre: number; // in INR
  costPerAcre: number;
  netMarginPerAcre: number;
  riskLevel: RiskLevel;
  whyRecommended: string;
  confidence: number;
  suitableSoilTypes: SoilType[];
}

export interface MarketOption {
  id: string;
  name: string;
  type: 'APMC Mandi' | 'Private Processor' | 'Local Haat' | 'Direct Buyer';
  location: string;
  distanceKm: number;
  sellingPricePerQ: number;
  transportCostPerQ: number;
  storageCostPerQ: number;
  handlingCostPerQ: number;
  paymentTerm: 'Same Day UPI/Cash' | '3 Days Bank Transfer' | 'Immediate Mandi Slip';
  priceTrend: 'up' | 'down' | 'stable';
  trendPercent: number;
  dataSource: DataSourceTag;
}

export interface DigitalZone {
  id: string;
  zoneCode: string;
  name: string;
  areaAcres: number;
  crop: string;
  status: 'Healthy' | 'Water Stressed' | 'Pest Risk' | 'Needs Inspection';
  healthScore: number; // 0-100
  soilMoisturePct: number;
  nitrogenStatus: 'Adequate' | 'Deficient' | 'Optimal';
  identifiedRisk: string;
  recommendedAction: string;
  color: string;
  polygonPoints?: string;
}

export interface ActionPlanItem {
  id: string;
  timeframe: 'TODAY' | 'NEXT 3 DAYS' | 'NEXT 7 DAYS';
  urgency: 'Urgent' | 'Important' | 'Planned';
  title: string;
  description: string;
  why: string;
  riskIfIgnored: string;
  dataUsed: string[];
  completed: boolean;
  category: 'Irrigation' | 'Protection' | 'Harvest' | 'Market' | 'Nutrition';
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  whyExplanation?: {
    inputsConsidered: string[];
    weatherFactors: string;
    cropStageFactor: string;
    confidence: number;
    dataSource: DataSourceTag;
    disclaimer: string;
  };
}

export interface ExplainableMetadata {
  title: string;
  recommendation: string;
  inputsConsidered: string[];
  weatherFactor: string;
  cropStageFactor: string;
  soilFactor: string;
  marketFactor: string;
  confidence: number;
  dataSource: DataSourceTag;
  dataFreshness: string;
  disclaimer: string;
}
