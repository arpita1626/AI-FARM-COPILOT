import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { translations } from '../utils/translations';
import { RiskItem } from '../types/farm';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CloudRain,
  Bug,
  Droplets,
  Store,
} from 'lucide-react';

export const RiskIntelligenceView: React.FC = () => {
  const { risks, profile, openExplainableModal, language } = useFarm();
  const t = translations[language] || translations.en;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedHorizon, setSelectedHorizon] = useState<string>('ALL');

  const TIMELINE_HORIZONS = ['TODAY', 'TOMORROW', '+3 DAYS', '+7 DAYS'];

  const filteredRisks = risks.filter((r) => {
    if (activeCategory !== 'All' && r.category !== activeCategory) return false;
    if (selectedHorizon !== 'ALL' && r.timeHorizon !== selectedHorizon) return false;
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Weather':
        return <CloudRain className="w-4 h-4 text-sky-600" />;
      case 'Pest':
        return <Bug className="w-4 h-4 text-red-600" />;
      case 'Water':
        return <Droplets className="w-4 h-4 text-cyan-600" />;
      case 'Market':
        return <Store className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-800 text-xs font-semibold border border-red-200 mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Predictive Threat Assessment</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
              Risk Intelligence & Early Warning Matrix
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Continuous threat scanning across Weather, Pest/Disease, Water, and Market channels for{' '}
              <strong className="text-slate-800">{profile.farmerName}</strong>'s {profile.farmSize}-acre parcel.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            {['All', 'Weather', 'Pest', 'Water', 'Market'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeCategory === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 7. VISUAL RISK TIMELINE: TODAY → TOMORROW → +3 DAYS → +7 DAYS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-base font-['Outfit']">
              Chronological Risk Timeline
            </h3>
          </div>
          <span className="text-xs text-slate-400">Click a period to filter threats</span>
        </div>

        {/* Interactive Timeline Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TIMELINE_HORIZONS.map((horizon, idx) => {
            const count = risks.filter((r) => r.timeHorizon === horizon).length;
            const hasHigh = risks.some((r) => r.timeHorizon === horizon && r.level === 'HIGH');
            const isSelected = selectedHorizon === horizon;

            return (
              <button
                key={horizon}
                onClick={() => setSelectedHorizon(isSelected ? 'ALL' : horizon)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-emerald-500'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Step {idx + 1}
                  </span>
                  {hasHigh ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500 text-white">
                      HIGH RISK
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">Moderate</span>
                  )}
                </div>

                <div className={`text-base font-extrabold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {horizon}
                </div>

                <div className={`text-xs mt-1 font-medium ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {count} Identified Threats
                </div>

                {/* Arrow connector */}
                {idx < 3 && (
                  <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-2 h-2 rounded-full bg-slate-300" />
                )}
              </button>
            );
          })}
        </div>

        {selectedHorizon !== 'ALL' && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-500">
              Filtered to: <strong>{selectedHorizon}</strong>
            </span>
            <button
              onClick={() => setSelectedHorizon('ALL')}
              className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Reset to All Periods
            </button>
          </div>
        )}
      </div>

      {/* Risk Items Cards List */}
      <div className="space-y-4">
        {filteredRisks.map((risk) => (
          <div
            key={risk.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow space-y-4"
          >
            {/* Top row: Category, Level badge, Horizon, Source tag */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-100 rounded-xl">{getCategoryIcon(risk.category)}</div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {risk.category} Risk · {risk.timeHorizon}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    {risk.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-xl ${
                    risk.level === 'HIGH'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : risk.level === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {risk.level} RISK
                </span>

                <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-purple-50 text-purple-800 border border-purple-200">
                  {risk.dataSource}
                </span>
              </div>
            </div>

            {/* Probability & Confidence Meters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-500 font-medium">Occurrence Probability:</span>
                  <span className="font-bold text-slate-900">{risk.probability}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      risk.probability > 65 ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${risk.probability}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-500 font-medium">Model Confidence:</span>
                  <span className="font-bold text-emerald-700">{risk.confidence}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${risk.confidence}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Impact & Reason */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 text-red-950">
                <span className="font-bold block mb-1">Potential Agronomic Impact:</span>
                <p className="leading-relaxed text-red-900/90">{risk.impactDescription}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-slate-800">
                <span className="font-bold block mb-1">Causal Reason / Factors:</span>
                <p className="leading-relaxed text-slate-600">{risk.reason}</p>
              </div>
            </div>

            {/* Recommended Action & Why Button */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">Recommended Action: </span>
                  <span className="text-slate-700">{risk.recommendedAction}</span>
                </div>
              </div>

              <button
                onClick={() =>
                  openExplainableModal({
                    title: risk.name,
                    recommendation: risk.recommendedAction,
                    inputsConsidered: [
                      `Farmer: ${profile.farmerName}`,
                      `Crop Stage: ${profile.cropStage}`,
                      `Soil Type: ${profile.soilType}`,
                      `Farm Location: ${profile.location}`,
                      `Historical Problem Factor: ${profile.previousProblems}`,
                    ],
                    weatherFactor: risk.category === 'Weather' ? risk.reason : 'Atmospheric moisture correlation',
                    cropStageFactor: `Current stage vulnerability (${profile.cropStage})`,
                    soilFactor: `Soil permeability on ${profile.soilType}`,
                    marketFactor: risk.category === 'Market' ? risk.reason : 'None',
                    confidence: risk.confidence,
                    dataSource: risk.dataSource,
                    dataFreshness: 'Evaluated continuously',
                    disclaimer:
                      'AI prediction model. Always check physical farm conditions before taking irreversible measures.',
                  })
                }
                className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t.common.whyRecommendation}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
