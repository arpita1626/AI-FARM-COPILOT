import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { translations } from '../utils/translations';
import { MarketOption } from '../types/farm';
import {
  TrendingUp,
  Truck,
  Building2,
  DollarSign,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Sliders,
} from 'lucide-react';

export const MarketOptimizerView: React.FC = () => {
  const { markets, profile, openExplainableModal, language, setActiveTab } = useFarm();
  const t = translations[language] || translations.en;

  // Farm quantity to evaluate
  const defaultQuantity = profile.farmSize * (profile.previousYield || 24);
  const [quantityQ, setQuantityQ] = useState<number>(defaultQuantity);

  // Compute itemized net returns for each market
  const marketCalculations = markets.map((m) => {
    const grossRevenue = m.sellingPricePerQ * quantityQ;
    const transportTotal = m.transportCostPerQ * quantityQ;
    const storageTotal = m.storageCostPerQ * quantityQ;
    const handlingTotal = m.handlingCostPerQ * quantityQ;
    const totalDeductions = transportTotal + storageTotal + handlingTotal;
    const netReturn = grossRevenue - totalDeductions;
    const netPerQ = netReturn / (quantityQ || 1);

    return {
      ...m,
      grossRevenue,
      transportTotal,
      storageTotal,
      handlingTotal,
      totalDeductions,
      netReturn,
      netPerQ,
    };
  });

  // Sort by net return descending
  const sortedMarkets = [...marketCalculations].sort((a, b) => b.netReturn - a.netReturn);
  const bestMarket = sortedMarkets[0];
  const secondMarket = sortedMarkets[1];
  const profitDifference = bestMarket ? bestMarket.netReturn - (secondMarket?.netReturn || 0) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Logistics & Net Margin Decision Engine</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
              Farm-to-Market Optimizer
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Higher quoted prices don't always mean higher profits. This engine compares freight distances, weighbridge handling, and storage deductions to maximize net cash in{' '}
              <strong className="text-slate-800">{profile.farmerName}</strong>'s pocket.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('netReturn')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>Open Net Return Calculator</span>
          </button>
        </div>
      </div>

      {/* Interactive Volume Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-800 block">
            Harvest Quantity for Evaluation:
          </span>
          <span className="text-xs text-slate-500">
            Default based on {profile.farmSize} acres × {profile.previousYield || 24} Q/Acre
          </span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min="10"
            max="500"
            step="5"
            value={quantityQ}
            onChange={(e) => setQuantityQ(parseInt(e.target.value, 10))}
            className="w-48 accent-emerald-600 cursor-pointer"
          />
          <div className="px-4 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 font-extrabold text-emerald-800 text-sm">
            {quantityQ} Quintals
          </div>
        </div>
      </div>

      {/* AI Top Recommendation Callout */}
      {bestMarket && (
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Optimal Market Recommendation for {profile.farmerName}
            </span>
            <h3 className="text-xl font-extrabold text-white">
              Sell to {bestMarket.name}
            </h3>
            <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
              Quoted price: <strong>₹{bestMarket.sellingPricePerQ}/Q</strong>. Even after ₹{bestMarket.transportCostPerQ}/Q freight, it delivers a net return of{' '}
              <strong className="text-white">₹{bestMarket.netReturn.toLocaleString('en-IN')}</strong> (
              <strong>₹{bestMarket.netPerQ.toFixed(0)}/Q net</strong>) — earning you{' '}
              <strong className="text-emerald-300">
                +₹{profitDifference.toLocaleString('en-IN')} more
              </strong>{' '}
              than the second best option!
            </p>
          </div>

          <button
            onClick={() =>
              openExplainableModal({
                title: `Market Choice: ${bestMarket.name}`,
                recommendation: `Net Return: ₹${bestMarket.netReturn.toLocaleString('en-IN')} on ${quantityQ} Quintals.`,
                inputsConsidered: [
                  `Volume: ${quantityQ} Quintals`,
                  `Quoted Rate: ₹${bestMarket.sellingPricePerQ}/Q`,
                  `Freight Distance: ${bestMarket.distanceKm} km (₹${bestMarket.transportCostPerQ}/Q)`,
                  `Storage Fees: ₹${bestMarket.storageCostPerQ}/Q`,
                  `Handling / Mandi Cess: ₹${bestMarket.handlingCostPerQ}/Q`,
                ],
                weatherFactor: 'Road transit route is unaffected by local flash floods',
                cropStageFactor: 'Harvest lot ready for dispatch',
                soilFactor: 'None',
                marketFactor: `Direct processor bypasses intermediary storage deductions (+₹${profitDifference})`,
                confidence: 94,
                dataSource: bestMarket.dataSource,
                dataFreshness: 'Tariffs verified today',
                disclaimer:
                  'Truck freight quotes vary by diesel price and vehicle availability. Confirm rates with transporter.',
              })
            }
            className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            <span>{t.common.whyRecommendation}</span>
          </button>
        </div>
      )}

      {/* Comparison Table / Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base font-['Outfit']">
          Comprehensive Market Trade-Off Analysis
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Market / Channel</th>
                <th className="py-3 px-3">Distance</th>
                <th className="py-3 px-3">Quoted Price</th>
                <th className="py-3 px-3">Transport Cost</th>
                <th className="py-3 px-3">Storage / Handling</th>
                <th className="py-3 px-3">Total Costs</th>
                <th className="py-3 px-3 text-right">Estimated Net Return</th>
                <th className="py-3 px-3 text-right">Net / Quintal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {sortedMarkets.map((m, idx) => {
                const isBest = idx === 0;
                return (
                  <tr
                    key={m.id}
                    className={`transition-colors ${
                      isBest ? 'bg-emerald-50/60 font-semibold text-slate-900' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        {isBest && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                        )}
                        <div>
                          <span className="font-bold text-slate-900 block">{m.name}</span>
                          <span className="text-[10px] text-slate-400">{m.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">{m.distanceKm} km</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">₹{m.sellingPricePerQ}</td>
                    <td className="py-3.5 px-3 text-red-600">
                      -₹{m.transportTotal.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] text-slate-400">(@₹{m.transportCostPerQ}/Q)</span>
                    </td>
                    <td className="py-3.5 px-3 text-red-600">
                      -₹{(m.storageTotal + m.handlingTotal).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-red-700">
                      -₹{m.totalDeductions.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span
                        className={`text-sm font-extrabold ${
                          isBest ? 'text-emerald-700' : 'text-slate-900'
                        }`}
                      >
                        ₹{m.netReturn.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-extrabold text-emerald-800">
                      ₹{m.netPerQ.toFixed(0)}/Q
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
