import React from 'react';
import { useFarm } from '../context/FarmContext';
import { translations } from '../utils/translations';
import { X, HelpCircle, ShieldCheck, Database, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ExplainableModal: React.FC = () => {
  const { explainableData, closeExplainableModal, language } = useFarm();
  const t = translations[language] || translations.en;

  if (!explainableData) return null;

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'VERIFIED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'AI PREDICTION':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'ESTIMATED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'HISTORICAL':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-700/60 rounded-xl">
              <HelpCircle className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight flex items-center gap-2">
                <span>{t.common.whyRecommendation}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Explainable AI (XAI)
                </span>
              </h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Full transparency into factors, data freshness, and decision logic
              </p>
            </div>
          </div>
          <button
            onClick={closeExplainableModal}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Target Recommendation */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
              Evaluated Action / Recommendation:
            </div>
            <div className="font-semibold text-slate-900 text-base leading-snug">
              {explainableData.title}
            </div>
            <p className="text-xs text-slate-600 mt-2 bg-white/80 p-2.5 rounded-lg border border-emerald-100">
              {explainableData.recommendation}
            </p>
          </div>

          {/* Key Metrics / Confidence / Data Source */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs text-slate-500 font-medium">Model Confidence</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-emerald-700">{explainableData.confidence}%</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${explainableData.confidence}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs text-slate-500 font-medium">Source Freshness</div>
              <div className="mt-1.5">
                <span
                  className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-md border ${getSourceBadge(
                    explainableData.dataSource
                  )}`}
                >
                  {explainableData.dataSource}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">{explainableData.dataFreshness || 'Updated 12m ago'}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-500 font-medium">Cross-Validation</div>
              <div className="text-xs font-semibold text-slate-800 mt-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Multi-Factor Synthesized</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Agronomy + Weather radar</div>
            </div>
          </div>

          {/* Factors Considered */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Inputs & Agronomic Factors Considered</span>
            </div>
            <ul className="space-y-2">
              {explainableData.inputsConsidered.map((factor, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-800 leading-relaxed">{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Factor Breakdown Grid */}
          <div className="space-y-2 border-t border-slate-200 pt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Detailed Factor Attribution
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {explainableData.weatherFactor && (
                <div className="p-2.5 bg-sky-50/70 border border-sky-200 rounded-lg">
                  <span className="font-semibold text-sky-900 block mb-0.5">Atmospheric / Weather:</span>
                  <span className="text-sky-800">{explainableData.weatherFactor}</span>
                </div>
              )}
              {explainableData.cropStageFactor && (
                <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg">
                  <span className="font-semibold text-amber-900 block mb-0.5">Crop Phenology / Stage:</span>
                  <span className="text-amber-800">{explainableData.cropStageFactor}</span>
                </div>
              )}
              {explainableData.soilFactor && (
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                  <span className="font-semibold text-emerald-900 block mb-0.5">Soil Moisture & Drainage:</span>
                  <span className="text-emerald-800">{explainableData.soilFactor}</span>
                </div>
              )}
              {explainableData.marketFactor && (
                <div className="p-2.5 bg-purple-50/70 border border-purple-200 rounded-lg">
                  <span className="font-semibold text-purple-900 block mb-0.5">Market & Transportation:</span>
                  <span className="text-purple-800">{explainableData.marketFactor}</span>
                </div>
              )}
            </div>
          </div>

          {/* Responsible AI Boundary & Disclaimer */}
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Responsible AI Boundary Notice</span>
              <p className="text-amber-800 leading-relaxed">
                {explainableData.disclaimer || t.common.disclaimerDecisionSupport}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={closeExplainableModal}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium text-xs transition-colors"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
};
