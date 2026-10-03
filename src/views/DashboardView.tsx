import React from 'react';
import { useFarm } from '../context/FarmContext';
import { translations } from '../utils/translations';
import {
  Sprout,
  ShieldAlert,
  Droplets,
  TrendingUp,
  HelpCircle,
  CloudRain,
  ArrowRight,
  Bot,
  AlertTriangle,
  PlaySquare,
  CheckCircle2,
  Calendar,
  Sparkles,
  Volume2,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    profile,
    weather,
    risks,
    actionPlan,
    toggleActionCompleted,
    setActiveTab,
    openExplainableModal,
    language,
    speakText,
    sendCopilotQuery,
  } = useFarm();

  const t = translations[language] || translations.en;

  // Calculate high-level metrics
  const pendingActions = actionPlan.filter((a) => !a.completed);
  const urgentCount = actionPlan.filter((a) => a.urgency === 'Urgent' && !a.completed).length;
  const highRisks = risks.filter((r) => r.level === 'HIGH' || r.level === 'MEDIUM');

  // Estimated gross harvest revenue
  const totalQuintals = profile.farmSize * (profile.previousYield || 24);
  const currentRatePerQ = 2420;
  const estimatedRevenue = totalQuintals * currentRatePerQ;

  const quickQuestions = [
    'What should I do today?',
    'Will rain affect my crop?',
    'When should I irrigate?',
    'Should I harvest now?',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Welcome & Identity Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.dashboard.farmStatusTitle}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit']">
              {t.dashboard.greeting}, {profile.farmerName}!
            </h1>

            <p className="text-emerald-100/90 text-sm mt-1 max-w-2xl">
              Connected Farm: <span className="font-bold text-white">{profile.farmSize} {profile.sizeUnit}</span> of{' '}
              <span className="font-bold text-white">{profile.currentCrop}</span> in{' '}
              <span className="font-bold text-white">{profile.location}, {profile.state}</span> · Soil:{' '}
              <span className="text-emerald-200">{profile.soilType}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('whatIf')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <PlaySquare className="w-4 h-4" />
              <span>{t.dashboard.runSimulation}</span>
            </button>

            <button
              onClick={() => setActiveTab('copilot')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>{t.dashboard.viewCopilot}</span>
            </button>
          </div>
        </div>
      </div>

      {/* The 3 Core Decision Pillars: What is happening? What risks? What should I do now? */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: What is happening on my farm? */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Pillar 1
              </span>
              <span className="text-xs text-slate-500 font-medium">Real-time sync</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-2">
              {t.dashboard.whatHappening}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your <strong className="text-slate-800">{profile.currentCrop}</strong> is in the{' '}
              <strong className="text-emerald-700">{profile.cropStage}</strong>. Root zone moisture in your{' '}
              {profile.soilType} is at <strong className="text-slate-800">72%</strong>.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Crop Health Index</span>
                <span className="font-bold text-emerald-600">88% (Good)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }} />
              </div>
              <div className="flex justify-between text-slate-500 text-[11px] pt-1">
                <span>Weather: {weather.currentTemp}°C, {weather.humidity}% Humidity</span>
                <span className="font-semibold text-sky-700">Rain Prob: {weather.rainProbability}%</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('digitalTwin')}
            className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start cursor-pointer"
          >
            <span>View Farm Digital Twin Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: What risks are coming? */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                Pillar 2
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                {highRisks.length} Detected
              </span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-2">
              {t.dashboard.risksComing}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-red-700">Rain alert tomorrow (75%)</strong> may cause localized runoff in{' '}
              Zone C. Pest risk for stem borer is elevated due to 78% nocturnal humidity.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              {risks.slice(0, 2).map((r) => (
                <div
                  key={r.id}
                  className="p-2 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <AlertTriangle
                      className={`w-3.5 h-3.5 shrink-0 ${
                        r.level === 'HIGH' ? 'text-red-500' : 'text-amber-500'
                      }`}
                    />
                    <span className="font-medium text-slate-800 truncate">{r.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 shrink-0">{r.timeHorizon}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('riskIntel')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore 7-Day Risk Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() =>
                openExplainableModal({
                  title: risks[0].name,
                  recommendation: risks[0].recommendedAction,
                  inputsConsidered: [
                    `Farm Soil: ${profile.soilType}`,
                    `Rain Radar: 75% probability tomorrow (18-24mm)`,
                    `Saturation Index: 68% in Zone C`,
                  ],
                  weatherFactor: 'Nocturnal barometric drop (-3.2 hPa)',
                  cropStageFactor: 'Tillering root system vulnerability to anaerobic waterlogging',
                  soilFactor: 'High clay/alluvial fraction prevents instant downward percolation',
                  marketFactor: 'None',
                  confidence: risks[0].confidence,
                  dataSource: 'AI PREDICTION',
                  dataFreshness: 'Updated 10m ago',
                  disclaimer: 'Meteorological predictive model. Clear spillways.',
                })
              }
              className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.common.why}</span>
            </button>
          </div>
        </div>

        {/* Card 3: What should I do now? */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                Pillar 3
              </span>
              <span className="text-xs font-bold text-slate-500">
                {pendingActions.length} Actions
              </span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-2">
              {t.dashboard.whatToDoNow}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Immediate prioritized farm tasks derived from weather, crop phenology, and risk intelligence:
            </p>

            <div className="mt-3 space-y-2">
              {actionPlan.slice(0, 2).map((action) => (
                <div
                  key={action.id}
                  onClick={() => toggleActionCompleted(action.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    action.completed
                      ? 'bg-slate-50 border-slate-200 text-slate-400'
                      : 'bg-blue-50/50 border-blue-200/80 text-slate-800 hover:bg-blue-50'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border ${
                      action.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {action.completed && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                  <div className="text-xs flex-1">
                    <div
                      className={`font-semibold leading-tight ${
                        action.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {action.title}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{action.timeframe} · {action.urgency}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('actionPlan')}
            className="mt-4 text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 self-start cursor-pointer"
          >
            <span>View Full Action Plan Checklist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Prominent AI Farm Copilot Interactive Section */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-3xl p-6 sm:p-7 border border-emerald-200/90 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm font-['Outfit']">
              <Bot className="w-5 h-5 text-emerald-700" />
              <span>AI FARM COPILOT · REAL-TIME ADVISORY FOR {profile.farmerName.toUpperCase()}</span>
            </div>
            <div className="p-4 bg-white/90 rounded-2xl border border-emerald-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Current Priority Recommendation:
              </div>
              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                "Hold canal irrigation for the next 48 hours. Rainfall expected tomorrow will replenish topsoil naturally. Clear drainage trenches in Zone C to prevent standing water."
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 pt-2 border-t border-emerald-100 text-xs">
                <button
                  onClick={() =>
                    openExplainableModal({
                      title: 'Hold canal irrigation for 48 hours',
                      recommendation:
                        'Pause pumping today. Rain forecast (75% probability, 18-24mm) will deliver sufficient moisture.',
                      inputsConsidered: [
                        `Farmer: ${profile.farmerName}`,
                        `Crop: ${profile.currentCrop} (${profile.cropStage})`,
                        `Soil: ${profile.soilType}`,
                        `Current Root Moisture: 72%`,
                        `Rain Forecast: 75% tomorrow`,
                      ],
                      weatherFactor: 'Monsoon precipitation band passing over Sambalpur region',
                      cropStageFactor: 'Vegetative tillering needs aerobic conditions, not standing flood',
                      soilFactor: 'Alluvial soil has high water retention capacity',
                      marketFactor: 'Saves diesel/electricity pumping charges',
                      confidence: 94,
                      dataSource: 'VERIFIED',
                      dataFreshness: 'Forecast synced 12m ago',
                      disclaimer: 'Irrigation decision support model. Inspect plot surface moisture.',
                    })
                  }
                  className="flex items-center gap-1.5 font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/70 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{t.common.whyRecommendation}</span>
                </button>

                <button
                  onClick={() =>
                    speakText(
                      `Hello ${profile.farmerName}. Hold canal irrigation for 48 hours. Rain expected tomorrow will provide natural moisture. Clear drainage trenches to prevent water stagnation.`
                    )
                  }
                  className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>{t.common.speak}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick ask prompt chips */}
          <div className="w-full lg:w-80 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              Ask Copilot Quick Questions:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTab('copilot');
                    sendCopilotQuery(q);
                  }}
                  className="text-left text-xs font-semibold p-2.5 rounded-xl bg-white hover:bg-emerald-600 hover:text-white text-slate-800 border border-emerald-200/80 shadow-2xs transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>"{q}"</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Numbers Grid: Weather, Market, Expected Net Return */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Crop & Variety</span>
            <Sprout className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 mt-2 truncate">
            {profile.currentCrop}
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-0.5">
            {profile.cropStage}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Current Mandi Price</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 mt-2">
            ₹{currentRatePerQ} <span className="text-xs font-normal text-slate-500">/ Quintal</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <span className="text-[10px] font-bold px-1.5 rounded bg-emerald-100 text-emerald-800">
              VERIFIED
            </span>
            <span>Sambalpur APMC</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Expected Farm Harvest</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 mt-2">
            {totalQuintals} <span className="text-xs font-normal text-slate-500">Quintals</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Based on {profile.previousYield || 24} Q/Acre past yield
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Estimated Gross Value</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 mt-2 text-emerald-800">
            ₹{estimatedRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <span className="text-[10px] font-bold px-1.5 rounded bg-blue-100 text-blue-800">
              ESTIMATED
            </span>
            <span>Check Net Return</span>
          </div>
        </div>
      </div>

      {/* Quick Launchers / Next Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Optimizer Banner */}
        <div
          onClick={() => setActiveTab('marketOptimizer')}
          className="p-5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="text-xs text-emerald-200 font-bold uppercase tracking-wider">
              Market Decision Tool
            </div>
            <h4 className="font-bold text-base mt-1">Farm-to-Market Optimizer</h4>
            <p className="text-xs text-emerald-100 mt-1">
              Compare Sambalpur APMC vs Bargarh vs Maa Samaleswari Processor. Save up to ₹4,800 in transport!
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <ArrowRight className="w-5 h-5 text-emerald-200" />
          </div>
        </div>

        {/* What-If Simulator Banner */}
        <div
          onClick={() => setActiveTab('whatIf')}
          className="p-5 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="text-xs text-amber-200 font-bold uppercase tracking-wider">
              Scenario Testing
            </div>
            <h4 className="font-bold text-base mt-1">Interactive What-If Simulator</h4>
            <p className="text-xs text-amber-100 mt-1">
              "What if I harvest 3 days later?" Compare revenue changes, weather exposure, and risk trade-offs.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <ArrowRight className="w-5 h-5 text-amber-200" />
          </div>
        </div>
      </div>
    </div>
  );
};
