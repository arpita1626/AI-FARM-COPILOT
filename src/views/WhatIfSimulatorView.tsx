import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { translations } from '../utils/translations';
import {
  PlaySquare,
  TrendingUp,
  TrendingDown,
  Calendar,
  CloudRain,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sliders,
  Store,
  Droplets,
  Sprout,
  DollarSign,
  Layers,
} from 'lucide-react';

export const WhatIfSimulatorView: React.FC = () => {
  const { profile, weather, markets, cropOptions, openExplainableModal, language } = useFarm();
  const t = translations[language] || translations.en;

  const [activeScenario, setActiveScenario] = useState<
    'harvest' | 'market' | 'crop' | 'irrigation'
  >('harvest');

  // Scenario 1: Harvest Timing
  const [harvestDelayDays, setHarvestDelayDays] = useState<number>(3);

  // Scenario 2: Market Selection
  const [marketAId, setMarketAId] = useState<string>(markets[0].id);
  const [marketBId, setMarketBId] = useState<string>(markets[1].id);

  // Scenario 3: Change Crop
  const [alternateCropId, setAlternateCropId] = useState<string>('crop-maize');

  // Scenario 4: Change Irrigation
  const [irrigationChangePct, setIrrigationChangePct] = useState<number>(-25); // -50% to +50%

  // Total quintals based on farmer profile
  const baseYieldQ = profile.farmSize * (profile.previousYield || 24);

  // -------------------------
  // Scenario 1 Calculations:
  // Harvesting today vs harvesting N days later
  // -------------------------
  // Moisture drop bonus: Each day of holding reduces moisture ~1.5%, fetching ~₹30/Q bonus up to 4 days, but after day 5 rain risk kicks in
  const baseRatePerQ = 2420;
  const todayRevenue = baseYieldQ * baseRatePerQ;

  // Rate change with delay
  const priceBonusPerQ =
    harvestDelayDays <= 4 ? harvestDelayDays * 30 : 4 * 30 - (harvestDelayDays - 4) * 20;
  const delayedRatePerQ = baseRatePerQ + priceBonusPerQ;

  // Rain risk penalty if delay overlaps with rain on day 1/2
  const weatherRiskLevel =
    harvestDelayDays >= 1 && harvestDelayDays <= 2
      ? 'HIGH (Rain expected tomorrow)'
      : harvestDelayDays === 3
      ? 'MEDIUM (Post-rain dampness)'
      : 'LOW (Clear sunny window)';

  const weatherRiskColor =
    harvestDelayDays <= 2
      ? 'text-red-600 bg-red-50'
      : harvestDelayDays === 3
      ? 'text-amber-600 bg-amber-50'
      : 'text-emerald-600 bg-emerald-50';

  // Overall simulated revenue
  const delayedRevenue = baseYieldQ * delayedRatePerQ;
  const revenueDifference = delayedRevenue - todayRevenue;

  // -------------------------
  // Scenario 2 Calculations: Market comparison
  // -------------------------
  const marketA = markets.find((m) => m.id === marketAId) || markets[0];
  const marketB = markets.find((m) => m.id === marketBId) || markets[1];

  const marketANet =
    baseYieldQ *
    (marketA.sellingPricePerQ -
      (marketA.transportCostPerQ + marketA.storageCostPerQ + marketA.handlingCostPerQ));
  const marketBNet =
    baseYieldQ *
    (marketB.sellingPricePerQ -
      (marketB.transportCostPerQ + marketB.storageCostPerQ + marketB.handlingCostPerQ));
  const marketDifference = marketBNet - marketANet;

  // -------------------------
  // Scenario 3 Calculations: Change Crop
  // -------------------------
  const currentCropInfo = cropOptions.find((c) => c.id === 'crop-paddy') || cropOptions[0];
  const altCropInfo = cropOptions.find((c) => c.id === alternateCropId) || cropOptions[2];

  const currentCropTotalNet = currentCropInfo.netMarginPerAcre * profile.farmSize;
  const altCropTotalNet = altCropInfo.netMarginPerAcre * profile.farmSize;
  const cropNetDifference = altCropTotalNet - currentCropTotalNet;

  // -------------------------
  // Scenario 4 Calculations: Change Irrigation
  // -------------------------
  // Base water usage: 100%
  // Pumping cost: ~₹3,200 per acre
  const basePumpingCost = profile.farmSize * 3200;
  const simulatedPumpingCost = basePumpingCost * (1 + irrigationChangePct / 100);
  const waterSavings = basePumpingCost - simulatedPumpingCost;

  // Yield impact: reducing water by up to 25% when rain is incoming has NO yield loss (+benefits root aeration)
  // reducing >35% causes mild stress
  const yieldImpactPct =
    irrigationChangePct < -30
      ? -8
      : irrigationChangePct < 0
      ? 0 // Optimal because rain is coming
      : -4; // Excessive water causes waterlogging in alluvial soil

  const simulatedCropHealth =
    irrigationChangePct === -25
      ? '94% (Optimal: Aerated root zone + Rain sync)'
      : irrigationChangePct < -30
      ? '78% (Water deficit stress)'
      : irrigationChangePct > 20
      ? '72% (Waterlogging risk in alluvial soil)'
      : '88% (Baseline)';

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200 mb-2">
              <PlaySquare className="w-3.5 h-3.5" />
              <span>Predictive Decision Sandbox</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
              Interactive What-If Decision Simulator
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Test critical agricultural decisions before executing them. Compare revenue changes, weather risks, storage costs, and agronomic trade-offs for{' '}
              <strong className="text-slate-800">{profile.farmerName}</strong>'s farm.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
            <span>Farm Base: {profile.farmSize} Acres ({baseYieldQ} Quintals)</span>
          </div>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setActiveScenario('harvest')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeScenario === 'harvest'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Scenario 1</span>
          </div>
          <div className="font-extrabold text-sm leading-tight">Harvest Decision</div>
          <div className={`text-[11px] mt-0.5 ${activeScenario === 'harvest' ? 'text-slate-400' : 'text-slate-500'}`}>
            "What if I harvest 3 days later?"
          </div>
        </button>

        <button
          onClick={() => setActiveScenario('market')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeScenario === 'market'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Scenario 2</span>
          </div>
          <div className="font-extrabold text-sm leading-tight">Change Market</div>
          <div className={`text-[11px] mt-0.5 ${activeScenario === 'market' ? 'text-slate-400' : 'text-slate-500'}`}>
            "What if I sell at another market?"
          </div>
        </button>

        <button
          onClick={() => setActiveScenario('crop')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeScenario === 'crop'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>Scenario 3</span>
          </div>
          <div className="font-extrabold text-sm leading-tight">Change Crop</div>
          <div className={`text-[11px] mt-0.5 ${activeScenario === 'crop' ? 'text-slate-400' : 'text-slate-500'}`}>
            "What if I grow another crop?"
          </div>
        </button>

        <button
          onClick={() => setActiveScenario('irrigation')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeScenario === 'irrigation'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
            <Droplets className="w-4 h-4 text-emerald-400" />
            <span>Scenario 4</span>
          </div>
          <div className="font-extrabold text-sm leading-tight">Change Irrigation</div>
          <div className={`text-[11px] mt-0.5 ${activeScenario === 'irrigation' ? 'text-slate-400' : 'text-slate-500'}`}>
            "What if I reduce pumping by 25%?"
          </div>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SCENARIO 1: HARVEST DECISION ("What if I harvest 3 days later?") */}
      {/* ======================================================== */}
      {activeScenario === 'harvest' && (
        <div className="space-y-6">
          {/* Interactive Control Panel */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Simulation Variable: Harvest Delay Days
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-0.5">
                  Adjust Harvest Timeline: {harvestDelayDays} Days Later
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {[0, 1, 3, 5, 7].map((d) => (
                  <button
                    key={d}
                    onClick={() => setHarvestDelayDays(d)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      harvestDelayDays === d
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {d === 0 ? 'Harvest Today' : `+${d} Days`}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={harvestDelayDays}
                onChange={(e) => setHarvestDelayDays(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Today (0 Days)</span>
                <span>Optimal Dry Window (+3 to +4 Days)</span>
                <span>Late Harvest (+10 Days)</span>
              </div>
            </div>
          </div>

          {/* Comparison Cards: CURRENT SCENARIO vs WHAT-IF SCENARIO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Card: Harvest Today */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 uppercase tracking-wider">
                  Current Scenario
                </span>
                <span className="text-xs font-bold text-slate-400">Baseline</span>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-lg">HARVEST TODAY</h4>
                <div className="text-xs text-slate-500 mt-0.5">
                  Immediate dispatch to Sambalpur APMC
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Rate:</span>
                  <span className="font-bold text-slate-900">₹{baseRatePerQ} / Q</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Grain Moisture:</span>
                  <span className="font-bold text-amber-700">~21% (Wet grain deduction ₹40)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Weather Risk:</span>
                  <span className="font-bold text-emerald-700">LOW (Harvested before rain)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Storage Required:</span>
                  <span className="font-bold text-slate-900">Zero (Direct sale)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-700">Expected Gross Revenue:</span>
                  <span className="text-base font-extrabold text-slate-900">
                    ₹{todayRevenue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card: Harvest N Days Later */}
            <div className="bg-gradient-to-br from-emerald-50/60 to-white rounded-3xl p-6 border-2 border-emerald-500 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white uppercase tracking-wider">
                  What-If Scenario (+{harvestDelayDays} Days)
                </span>
                <span className="text-xs font-bold text-emerald-700">Simulated Outcome</span>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-lg">
                  HARVEST {harvestDelayDays} DAYS LATER
                </h4>
                <div className="text-xs text-slate-500 mt-0.5">
                  Natural field drying & price movement forecast
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-emerald-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Rate:</span>
                  <span className="font-bold text-emerald-800">
                    ₹{delayedRatePerQ} / Q{' '}
                    <span className="text-[10px] text-emerald-600">
                      ({priceBonusPerQ >= 0 ? `+₹${priceBonusPerQ}` : `-₹${Math.abs(priceBonusPerQ)}`})
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Grain Moisture:</span>
                  <span className="font-bold text-emerald-700">
                    {harvestDelayDays >= 3 ? '~14% (Dry premium grade)' : '~19%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Weather Risk:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${weatherRiskColor}`}>
                    {weatherRiskLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Storage Requirement:</span>
                  <span className="font-bold text-slate-800">
                    {harvestDelayDays >= 3 ? 'Standard Bagging' : 'Plastic Sheeting Needed'}
                  </span>
                </div>
                <div className="pt-2 border-t border-emerald-100 flex justify-between items-center">
                  <span className="font-bold text-slate-700">Projected Revenue:</span>
                  <span className="text-base font-extrabold text-emerald-800">
                    ₹{delayedRevenue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Difference Callout & Recommendation Explanation */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    revenueDifference >= 0
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {revenueDifference >= 0 ? (
                    <TrendingUp className="w-6 h-6" />
                  ) : (
                    <TrendingDown className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium">Net Revenue Difference:</span>
                  <div className="text-2xl font-extrabold text-slate-900">
                    {revenueDifference >= 0 ? '+' : '-'}₹
                    {Math.abs(revenueDifference).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  openExplainableModal({
                    title: `Harvest Simulation: +${harvestDelayDays} Days vs Today`,
                    recommendation:
                      harvestDelayDays === 3
                        ? `Harvesting 3 days later unlocks +₹${revenueDifference.toLocaleString('en-IN')} additional revenue due to moisture dropping to 14%, but requires watching Friday rainfall.`
                        : `Evaluated revenue change of ${revenueDifference >= 0 ? '+' : '-'}₹${Math.abs(
                            revenueDifference
                          ).toLocaleString('en-IN')}.`,
                    inputsConsidered: [
                      `Volume: ${baseYieldQ} Quintals (${profile.farmSize} Acres)`,
                      `Base Mandi Rate: ₹${baseRatePerQ}/Q`,
                      `Moisture drop from 21% to 14% (+₹90/Q quality bonus)`,
                      `Rain probability radar (75% tomorrow, clears by Friday)`,
                    ],
                    weatherFactor: 'Nocturnal showers tomorrow pose a lodging risk if unharvested',
                    cropStageFactor: 'Grain physiological maturity index at 92%',
                    soilFactor: 'Drainage status in Zone C',
                    marketFactor: 'Terminal market arrival premium for dry grain',
                    confidence: 89,
                    dataSource: 'AI PREDICTION',
                    dataFreshness: 'Simulated just now',
                    disclaimer:
                      'Simulation assumes normal field drying rate and no lodging from extreme winds.',
                  })
                }
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>{t.common.whyRecommendation}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-700 leading-relaxed border border-slate-200">
              <strong className="text-slate-900">AI Agronomist Synthesis:</strong> If you harvest 3 days later, grain moisture drops from 21% to ~14%, eliminating wet-grain docking deductions at Bargarh Mandi and earning you <strong className="text-emerald-700">+₹{revenueDifference.toLocaleString('en-IN')}</strong> in net profit. However, since rain is predicted tomorrow, ensure your crop bund drainage is open to prevent water accumulation.
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENARIO 2: CHANGE MARKET */}
      {/* ======================================================== */}
      {activeScenario === 'market' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Select Markets to Compare Side-by-Side:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Market A (Current Benchmark)
                </label>
                <select
                  value={marketAId}
                  onChange={(e) => setMarketAId(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {markets.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (₹{m.sellingPricePerQ}/Q · {m.distanceKm} km)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Market B (What-If Alternative)
                </label>
                <select
                  value={marketBId}
                  onChange={(e) => setMarketBId(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {markets.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (₹{m.sellingPricePerQ}/Q · {m.distanceKm} km)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 uppercase">
                Market A: {marketA.name}
              </span>
              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Quoted Selling Price:</span>
                  <span className="font-bold text-slate-900">₹{marketA.sellingPricePerQ}/Q</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transport ({marketA.distanceKm} km):</span>
                  <span className="font-bold text-red-600">
                    -₹{(marketA.transportCostPerQ * baseYieldQ).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Storage & Handling:</span>
                  <span className="font-bold text-red-600">
                    -₹{((marketA.storageCostPerQ + marketA.handlingCostPerQ) * baseYieldQ).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-700">Estimated Net Return:</span>
                  <span className="text-lg font-extrabold text-slate-900">
                    ₹{marketANet.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50/60 to-white rounded-3xl p-6 border-2 border-emerald-500 shadow-md space-y-4">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white uppercase">
                Market B: {marketB.name}
              </span>
              <div className="p-4 bg-white rounded-2xl border border-emerald-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Quoted Selling Price:</span>
                  <span className="font-bold text-emerald-800">₹{marketB.sellingPricePerQ}/Q</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transport ({marketB.distanceKm} km):</span>
                  <span className="font-bold text-red-600">
                    -₹{(marketB.transportCostPerQ * baseYieldQ).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Storage & Handling:</span>
                  <span className="font-bold text-red-600">
                    -₹{((marketB.storageCostPerQ + marketB.handlingCostPerQ) * baseYieldQ).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-2 border-t border-emerald-100 flex justify-between items-center">
                  <span className="font-bold text-slate-700">Estimated Net Return:</span>
                  <span className="text-lg font-extrabold text-emerald-800">
                    ₹{marketBNet.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-3xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Net Profit Advantage of choosing {marketDifference >= 0 ? marketB.name : marketA.name}:
            </span>
            <span className="text-base font-extrabold text-emerald-700">
              +₹{Math.abs(marketDifference).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENARIO 3: CHANGE CROP */}
      {/* ======================================================== */}
      {activeScenario === 'crop' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Simulate Switching Next Season Rotation Crop:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {cropOptions.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setAlternateCropId(c.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    alternateCropId === c.id
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-xs truncate">{c.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{c.suitableSeason}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 text-xs">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Current: {currentCropInfo.name}
              </span>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span>Growing Duration:</span>
                  <span className="font-bold">{currentCropInfo.growingPeriodDays} Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Water Requirement:</span>
                  <span className="font-bold">{currentCropInfo.waterRequirement}</span>
                </div>
                <div className="flex justify-between">
                  <span>Market Demand:</span>
                  <span className="font-bold">{currentCropInfo.marketDemand}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-100 pt-2">
                  <span>Farm Net Margin:</span>
                  <span>₹{currentCropTotalNet.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50/60 to-white rounded-3xl p-6 border-2 border-emerald-500 shadow-md space-y-3 text-xs">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                Alternate: {altCropInfo.name}
              </span>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span>Growing Duration:</span>
                  <span className="font-bold">{altCropInfo.growingPeriodDays} Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Water Requirement:</span>
                  <span className="font-bold">{altCropInfo.waterRequirement}</span>
                </div>
                <div className="flex justify-between">
                  <span>Market Demand:</span>
                  <span className="font-bold text-emerald-700">{altCropInfo.marketDemand}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800 border-t border-emerald-100 pt-2">
                  <span>Projected Farm Net Margin:</span>
                  <span>₹{altCropTotalNet.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENARIO 4: CHANGE IRRIGATION */}
      {/* ======================================================== */}
      {activeScenario === 'irrigation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Simulate Canal & Borewell Irrigation Pumping Adjustment:
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-0.5">
                  Irrigation Adjustment: {irrigationChangePct > 0 ? `+${irrigationChangePct}%` : `${irrigationChangePct}%`}
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
                Power Savings: ₹{Math.max(0, waterSavings).toLocaleString('en-IN')}
              </span>
            </div>

            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={irrigationChangePct}
              onChange={(e) => setIrrigationChangePct(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>−50% (Strict Deficit)</span>
              <span>−25% (Optimal for Tomorrow's Rain)</span>
              <span>Baseline (0%)</span>
              <span>+50% (Excess Flooding)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 font-bold block mb-1">Crop Condition Impact</span>
              <span className="font-extrabold text-slate-900 text-sm block">
                {simulatedCropHealth}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 font-bold block mb-1">Electricity / Diesel Cost</span>
              <span className="font-extrabold text-slate-900 text-sm block">
                ₹{simulatedPumpingCost.toFixed(0)}{' '}
                <span className="text-[10px] text-emerald-600">
                  ({waterSavings >= 0 ? `Saved ₹${waterSavings.toFixed(0)}` : `Added ₹${Math.abs(waterSavings).toFixed(0)}`})
                </span>
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 font-bold block mb-1">Weather & Waterlogging Risk</span>
              <span
                className={`font-extrabold text-sm block ${
                  irrigationChangePct > 10 ? 'text-red-600' : 'text-emerald-700'
                }`}
              >
                {irrigationChangePct > 10
                  ? 'HIGH (Excess standing water)'
                  : 'LOW (Optimal aerobic root zone)'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
