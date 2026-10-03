import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { translations } from '../utils/translations';
import { CropOption } from '../types/farm';
import {
  Sprout,
  Droplets,
  Calendar,
  TrendingUp,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Columns3,
  SlidersHorizontal,
} from 'lucide-react';

export const CropPlannerView: React.FC = () => {
  const {
    profile,
    cropOptions,
    comparedCropIds,
    toggleCompareCrop,
    openExplainableModal,
    language,
  } = useFarm();

  const t = translations[language] || translations.en;
  const [seasonFilter, setSeasonFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');

  const filteredCrops = cropOptions.filter((c) => {
    if (seasonFilter !== 'All' && !c.suitableSeason.includes(seasonFilter)) return false;
    if (riskFilter !== 'All' && c.riskLevel !== riskFilter) return false;
    return true;
  });

  const comparedCrops = cropOptions.filter((c) => comparedCropIds.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
              <Sprout className="w-3.5 h-3.5" />
              <span>Multi-Factor Crop Recommendation Engine</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
              Crop Planning & Rotation Advisory
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Crops scientifically ranked for <strong className="text-slate-800">{profile.farmerName}</strong>'s farm ({profile.farmSize} {profile.sizeUnit} of {profile.soilType} in {profile.location}) based on soil physics, water availability ({profile.waterAvailability}), and MSP/market demand.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <span className="text-[11px] font-bold text-slate-400 px-2 uppercase">Season:</span>
              {['All', 'Kharif', 'Rabi', 'Summer'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSeasonFilter(s)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    seasonFilter === s ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Crops Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCrops.map((crop) => {
          const isCompared = comparedCropIds.includes(crop.id);
          const totalExpectedNet = crop.netMarginPerAcre * profile.farmSize;

          return (
            <div
              key={crop.id}
              className={`bg-white rounded-3xl p-6 border transition-all shadow-xs flex flex-col justify-between ${
                isCompared ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Top Badge Line */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {crop.suitableSeason}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        crop.riskLevel === 'LOW'
                          ? 'bg-emerald-100 text-emerald-800'
                          : crop.riskLevel === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {crop.riskLevel} RISK
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {crop.confidence}%
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{crop.name}</h3>

                {/* Key Spec Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block text-[10px]">Expected Yield</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{crop.expectedYieldRange}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block text-[10px]">Water Requirement</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{crop.waterRequirement}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block text-[10px]">Growing Period</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{crop.growingPeriodDays} Days</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block text-[10px]">Market Demand</span>
                    <span className="font-bold text-emerald-700 mt-0.5 block">{crop.marketDemand}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block text-[10px]">Expected Rate</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">₹{crop.expectedPricePerQ}/Q</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-emerald-700 font-medium block text-[10px]">Farm Net Margin</span>
                    <span className="font-extrabold text-emerald-800 mt-0.5 block">
                      ₹{totalExpectedNet.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Why this recommendation */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                  <div className="font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-slate-500">
                      Why Recommended for {profile.farmerName}:
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{crop.whyRecommended}</p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() =>
                    openExplainableModal({
                      title: `Crop Recommendation: ${crop.name}`,
                      recommendation: crop.whyRecommended,
                      inputsConsidered: [
                        `Soil: ${profile.soilType} (Matches: ${crop.suitableSoilTypes.join(', ')})`,
                        `Location: ${profile.location}`,
                        `Farm Size: ${profile.farmSize} ${profile.sizeUnit}`,
                        `Water Security: ${profile.waterAvailability}`,
                        `Cost per Acre: ₹${crop.costPerAcre.toLocaleString()}`,
                        `Net Margin Projection: ₹${crop.netMarginPerAcre.toLocaleString()}/Acre`,
                      ],
                      weatherFactor: 'Optimized for upcoming seasonal rainfall and thermal window',
                      cropStageFactor: 'Suitable for next planned rotation cycle',
                      soilFactor: `Physiochemical compatibility with ${profile.soilType}`,
                      marketFactor: `Regional wholesale mandi price forecast of ₹${crop.expectedPricePerQ}/Q`,
                      confidence: crop.confidence,
                      dataSource: 'AI PREDICTION',
                      dataFreshness: 'Agronomy matrix updated today',
                      disclaimer:
                        'Projections depend on seed quality, timely sowing, pest incidence, and mandi spot fluctuations.',
                    })
                  }
                  className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{t.common.whyRecommendation}</span>
                </button>

                <button
                  onClick={() => toggleCompareCrop(crop.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isCompared
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Columns3 className="w-3.5 h-3.5" />
                  <span>{isCompared ? 'In Comparison Matrix' : 'Compare Crop'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Crop Comparison Matrix */}
      {comparedCrops.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Columns3 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-lg font-['Outfit']">
                Side-by-Side Crop Comparison Matrix
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Comparing {comparedCrops.length} selected crops for your {profile.farmSize}-acre farm
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Metric / Parameter</th>
                  {comparedCrops.map((c) => (
                    <th key={c.id} className="py-3 px-4 text-slate-900 font-extrabold text-xs">
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Season & Soil Fit</td>
                  {comparedCrops.map((c) => (
                    <td key={c.id} className="py-3 px-4">
                      {c.suitableSeason} · {c.suitableSoilTypes[0]}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Duration (Days)</td>
                  {comparedCrops.map((c) => (
                    <td key={c.id} className="py-3 px-4 font-semibold text-slate-900">
                      {c.growingPeriodDays} days
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Water Requirement</td>
                  {comparedCrops.map((c) => (
                    <td key={c.id} className="py-3 px-4">
                      {c.waterRequirement} ({c.waterRequirementLiters})
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Expected Yield / Acre</td>
                  {comparedCrops.map((c) => (
                    <td key={c.id} className="py-3 px-4 font-bold text-slate-900">
                      {c.expectedYieldRange}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Total Farm Output</td>
                  {comparedCrops.map((c) => (
                    <td key={c.id} className="py-3 px-4 font-bold text-blue-700">
                      {c.expectedYieldNumeric * profile.farmSize} Quintals
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Expected Mandi Price</td>
                  {comparedCrops.map((c) => (
                    <td key={c.id} className="py-3 px-4 font-semibold">
                      ₹{c.expectedPricePerQ} / Q
                    </td>
                  ))}
                </tr>
                <tr className="bg-emerald-50/50">
                  <td className="py-3 px-4 font-extrabold text-emerald-900">
                    Net Return for {profile.farmerName}'s Farm
                  </td>
                  {comparedCrops.map((c) => (
                    <td key={c.id} className="py-3 px-4 font-extrabold text-emerald-800 text-sm">
                      ₹{(c.netMarginPerAcre * profile.farmSize).toLocaleString('en-IN')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Risk Profile</td>
                  {comparedCrops.map((c) => (
                    <td key={c.id} className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          c.riskLevel === 'LOW'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.riskLevel}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
