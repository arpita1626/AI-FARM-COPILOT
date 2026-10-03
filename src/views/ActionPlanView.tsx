import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { translations } from '../utils/translations';
import { ActionPlanItem } from '../types/farm';
import {
  CheckSquare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HelpCircle,
  ShieldCheck,
  Calendar,
  Sparkles,
  Filter,
} from 'lucide-react';

export const ActionPlanView: React.FC = () => {
  const { actionPlan, toggleActionCompleted, profile, openExplainableModal, language } = useFarm();
  const t = translations[language] || translations.en;

  const [activeTimeframe, setActiveTimeframe] = useState<string>('ALL');

  const TIMEFRAMES: Array<'TODAY' | 'NEXT 3 DAYS' | 'NEXT 7 DAYS'> = [
    'TODAY',
    'NEXT 3 DAYS',
    'NEXT 7 DAYS',
  ];

  const filteredActions =
    activeTimeframe === 'ALL'
      ? actionPlan
      : actionPlan.filter((a) => a.timeframe === activeTimeframe);

  const completedCount = actionPlan.filter((a) => a.completed).length;
  const progressPct = Math.round((completedCount / (actionPlan.length || 1)) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Prioritized Agronomic Execution</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
              AI-Generated Farm Action Plan
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Concrete operational steps formulated for <strong className="text-slate-800">{profile.farmerName}</strong>'s {profile.farmSize}-acre {profile.currentCrop} plot, sequenced by urgency and weather timing.
            </p>
          </div>

          {/* Progress Pill */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Plan Completion
              </div>
              <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                {completedCount} / {actionPlan.length} Done
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-emerald-600 flex items-center justify-center font-bold text-xs text-emerald-700">
              {progressPct}%
            </div>
          </div>
        </div>
      </div>

      {/* Timeframe Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTimeframe('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTimeframe === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Actions ({actionPlan.length})
        </button>

        {TIMEFRAMES.map((tf) => {
          const count = actionPlan.filter((a) => a.timeframe === tf).length;
          return (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTimeframe === tf
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tf} ({count})
            </button>
          );
        })}
      </div>

      {/* Actions List by Horizon */}
      <div className="space-y-4">
        {filteredActions.map((action) => (
          <div
            key={action.id}
            className={`bg-white rounded-3xl p-6 border transition-all shadow-2xs space-y-4 ${
              action.completed
                ? 'border-slate-200 bg-slate-50/50 opacity-75'
                : action.urgency === 'Urgent'
                ? 'border-red-300 ring-2 ring-red-500/10'
                : 'border-slate-200'
            }`}
          >
            {/* Action Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Interactive Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleActionCompleted(action.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                    action.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white hover:border-emerald-500'
                  }`}
                >
                  {action.completed && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {action.timeframe} · {action.category}
                  </span>
                  <h3
                    className={`text-base font-extrabold leading-snug ${
                      action.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {action.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-xl ${
                    action.urgency === 'Urgent'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : action.urgency === 'Important'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  {action.urgency}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-700 leading-relaxed pl-9">
              {action.description}
            </p>

            {/* Detailed Spec: Why, Risk if ignored, Data Used */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9 text-xs">
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-emerald-950">
                <span className="font-bold block mb-0.5">Why This Action:</span>
                <p className="leading-relaxed text-emerald-900/90">{action.why}</p>
              </div>

              <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 text-red-950">
                <span className="font-bold block mb-0.5">Risk If Ignored:</span>
                <p className="leading-relaxed text-red-900/90">{action.riskIfIgnored}</p>
              </div>
            </div>

            {/* Data Source Chips & Explainable button */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-9">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                <span className="font-bold text-slate-400">Data Used:</span>
                {action.dataUsed.map((source, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium text-[10px]"
                  >
                    {source}
                  </span>
                ))}
              </div>

              <button
                onClick={() =>
                  openExplainableModal({
                    title: action.title,
                    recommendation: action.description,
                    inputsConsidered: [
                      `Action Horizon: ${action.timeframe} (${action.urgency})`,
                      `Farmer: ${profile.farmerName}`,
                      `Crop Stage: ${profile.cropStage}`,
                      `Soil Type: ${profile.soilType}`,
                      ...action.dataUsed,
                    ],
                    weatherFactor: action.why,
                    cropStageFactor: `Current vegetative/ripening sensitivity on ${profile.currentCrop}`,
                    soilFactor: `Permeability and drainage in ${profile.soilType}`,
                    marketFactor: action.category === 'Market' ? action.why : 'None',
                    confidence: 92,
                    dataSource: 'VERIFIED',
                    dataFreshness: 'Formulated today',
                    disclaimer: action.riskIfIgnored,
                  })
                }
                className="shrink-0 flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
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
