import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { translations } from '../utils/translations';
import {
  Store,
  TrendingUp,
  TrendingDown,
  Minus,
  HelpCircle,
  ShieldCheck,
  Calendar,
  AlertCircle,
  BarChart3,
} from 'lucide-react';

export const MarketIntelligenceView: React.FC = () => {
  const { markets, profile, openExplainableModal, language, setActiveTab } = useFarm();
  const t = translations[language] || translations.en;

  const [activeCommodity, setActiveCommodity] = useState<string>(profile.currentCrop);

  // 30-day historical price points for the active crop
  const HISTORICAL_PRICE_POINTS = [
    { date: 'Sep 3', price: 2310, status: 'HISTORICAL' },
    { date: 'Sep 10', price: 2340, status: 'HISTORICAL' },
    { date: 'Sep 17', price: 2380, status: 'HISTORICAL' },
    { date: 'Sep 24', price: 2390, status: 'HISTORICAL' },
    { date: 'Oct 1', price: 2420, status: 'VERIFIED' },
    { date: 'Oct 8 (Proj)', price: 2470, status: 'AI PREDICTION' },
    { date: 'Oct 15 (Proj)', price: 2440, status: 'AI PREDICTION' },
  ];

  const minPrice = 2250;
  const maxPrice = 2550;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
              <Store className="w-3.5 h-3.5" />
              <span>Real-Time Wholesale Mandi Intelligence</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
              Market Prices & Predictive Trends
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Live Mandi arrivals, modal rates, and supply-demand price forecasts for{' '}
              <strong className="text-slate-800">{profile.farmerName}</strong>'s crop ({profile.currentCrop}) across regional trading hubs.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('marketOptimizer')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <span>Launch Market Optimizer</span>
            <TrendingUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Trust & Tag Legend Bar */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
          Data Source Classification:
        </span>
        <div className="flex flex-wrap gap-2 text-[11px] font-bold">
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
            VERIFIED: Government APMC E-Nam
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-300">
            AI PREDICTION: Arrival Curves
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-300">
            ESTIMATED: Processor Direct
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
            HISTORICAL: Past 30 Days
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-700 border border-slate-300">
            DEMO DATA: Simulated Feed
          </span>
        </div>
      </div>

      {/* Historical & Projected Price Trend Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-base font-['Outfit']">
              Price Trajectory & Harvest Timing Window (₹ / Quintal)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Base: {profile.currentCrop}
          </span>
        </div>

        {/* Visual Bar Chart */}
        <div className="grid grid-cols-7 gap-3 pt-6 pb-2 items-end h-56">
          {HISTORICAL_PRICE_POINTS.map((pt, idx) => {
            const heightPercent = Math.max(15, ((pt.price - minPrice) / (maxPrice - minPrice)) * 100);
            const isPredicted = pt.status === 'AI PREDICTION';
            const isCurrent = pt.status === 'VERIFIED';

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-bold text-slate-700 mb-1 group-hover:scale-110 transition-transform">
                  ₹{pt.price}
                </span>

                <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden h-full flex items-end">
                  <div
                    className={`w-full rounded-t-xl transition-all ${
                      isPredicted
                        ? 'bg-gradient-to-t from-purple-600 to-indigo-400 border-2 border-dashed border-purple-300'
                        : isCurrent
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md shadow-emerald-500/20'
                        : 'bg-gradient-to-t from-slate-400 to-slate-300'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <div className="text-center mt-2">
                  <span className="text-[10px] font-bold text-slate-700 block whitespace-nowrap">
                    {pt.date}
                  </span>
                  <span
                    className={`text-[8px] font-bold uppercase px-1 rounded block mt-0.5 ${
                      isPredicted
                        ? 'text-purple-700 bg-purple-50'
                        : isCurrent
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-slate-400'
                    }`}
                  >
                    {pt.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-900 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
            <span>
              <strong>AI Market Insight:</strong> Regional prices expected to peak around Oct 8-10 before heavy cluster harvest arrivals trigger a temporary dip in late October.
            </span>
          </span>
          <button
            onClick={() =>
              openExplainableModal({
                title: 'Market Price Forecast (Oct 8-15)',
                recommendation: 'Target sale between Oct 8 and Oct 12 to capture peak price before bulk arrivals.',
                inputsConsidered: [
                  'Historical APMC 5-year arrival curves',
                  'Regional sowing statistics for Odisha & Chhattisgarh belt',
                  'State civil supplies corporation procurement schedule',
                  'Industrial rice millers processing buffer targets',
                ],
                weatherFactor: 'None',
                cropStageFactor: 'Matches optimal grain ripening window',
                soilFactor: 'None',
                marketFactor: 'Arrival volume supply shock prediction',
                confidence: 81,
                dataSource: 'AI PREDICTION',
                dataFreshness: 'Simulated market arrival model',
                disclaimer:
                  'Predictions are not guaranteed. Spot prices fluctuate based on daily truck queue volume and moisture grading.',
              })
            }
            className="font-bold text-purple-800 hover:text-purple-950 shrink-0 cursor-pointer"
          >
            {t.common.why}
          </button>
        </div>
      </div>

      {/* Market Listing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {markets.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {m.type} · {m.distanceKm} km away
                </span>
                <h4 className="text-base font-extrabold text-slate-900">{m.name}</h4>
                <div className="text-xs text-slate-500 mt-0.5">{m.location}</div>
              </div>

              <div className="text-right">
                <div className="text-xl font-extrabold text-slate-900">
                  ₹{m.sellingPricePerQ}
                </div>
                <div className="text-[10px] text-slate-400">per Quintal</div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 text-[10px] block">Transport</span>
                <span className="font-bold text-slate-800">₹{m.transportCostPerQ}/Q</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Storage</span>
                <span className="font-bold text-slate-800">₹{m.storageCostPerQ}/Q</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Settlement</span>
                <span className="font-bold text-emerald-700 truncate block text-[11px]">
                  {m.paymentTerm}
                </span>
              </div>
            </div>

            {/* Bottom Tag & Trend */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {m.dataSource}
              </span>

              <div className="flex items-center gap-1 font-semibold">
                {m.priceTrend === 'up' ? (
                  <span className="text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> +{m.trendPercent}% (Rising)
                  </span>
                ) : m.priceTrend === 'down' ? (
                  <span className="text-red-600 flex items-center gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" /> {m.trendPercent}% (Falling)
                  </span>
                ) : (
                  <span className="text-slate-500 flex items-center gap-0.5">
                    <Minus className="w-3.5 h-3.5" /> Stable
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
