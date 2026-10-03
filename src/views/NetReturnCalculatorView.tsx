import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { translations } from '../utils/translations';
import {
  Calculator,
  RotateCcw,
  Sparkles,
  TrendingUp,
  DollarSign,
  Package,
  Truck,
  Building,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const NetReturnCalculatorView: React.FC = () => {
  const { profile, language, setActiveTab } = useFarm();
  const t = translations[language] || translations.en;

  // Formula inputs
  const defaultQuantity = profile.farmSize * (profile.previousYield || 24);
  const [quantity, setQuantity] = useState<number>(defaultQuantity);
  const [sellingPrice, setSellingPrice] = useState<number>(2420);
  const [transportCostPerQ, setTransportCostPerQ] = useState<number>(65);
  const [storageCostPerQ, setStorageCostPerQ] = useState<number>(20);
  const [otherCostsPerQ, setOtherCostsPerQ] = useState<number>(18);

  // Calculations
  const grossRevenue = quantity * sellingPrice;
  const totalTransportCost = quantity * transportCostPerQ;
  const totalStorageCost = quantity * storageCostPerQ;
  const totalOtherCosts = quantity * otherCostsPerQ;
  const totalCosts = totalTransportCost + totalStorageCost + totalOtherCosts;
  const estimatedNetReturn = grossRevenue - totalCosts;
  const netReturnPerQ = quantity > 0 ? estimatedNetReturn / quantity : 0;
  const netMarginPercentage = grossRevenue > 0 ? (estimatedNetReturn / grossRevenue) * 100 : 0;

  const handleReset = () => {
    setQuantity(defaultQuantity);
    setSellingPrice(2420);
    setTransportCostPerQ(65);
    setStorageCostPerQ(20);
    setOtherCostsPerQ(18);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Real-Time Profitability Engine</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
              Net Return & Profit Margin Calculator
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Formula: <strong className="text-slate-800">Gross Revenue − Transportation − Storage − Other Costs = Estimated Net Return</strong>. Test different volume and market price scenarios instantly.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.common.reset}</span>
          </button>
        </div>
      </div>

      {/* Main Calculator Grid: Inputs on Left, Real-Time P&L Statement on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base font-['Outfit']">
              Operational Inputs
            </h3>
            <span className="text-xs text-emerald-600 font-bold">Updates Instantly</span>
          </div>

          {/* 1. Quantity */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>Harvest Quantity to Sell</span>
              </label>
              <span className="font-extrabold text-emerald-800 text-sm">{quantity} Quintals</span>
            </div>
            <input
              type="range"
              min="10"
              max="600"
              step="5"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>10 Q</span>
              <span>For {profile.farmerName}'s {profile.farmSize} Acres</span>
              <span>600 Q</span>
            </div>
          </div>

          {/* 2. Selling Price */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Quoted Selling Price (₹ / Quintal)</span>
              </label>
              <span className="font-extrabold text-emerald-800 text-sm">₹{sellingPrice}</span>
            </div>
            <input
              type="range"
              min="1500"
              max="4000"
              step="10"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹1,500/Q</span>
              <span>MSP / Mandi Benchmark: ₹2,420</span>
              <span>₹4,000/Q</span>
            </div>
          </div>

          {/* 3. Transportation Cost */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Transportation Cost (₹ / Quintal)</span>
              </label>
              <span className="font-bold text-slate-900 text-sm">₹{transportCostPerQ}</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={transportCostPerQ}
              onChange={(e) => setTransportCostPerQ(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹0 (Farmgate)</span>
              <span>Regional Avg: ₹60-80</span>
              <span>₹200 (Long Distance)</span>
            </div>
          </div>

          {/* 4. Storage Cost */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-600" />
                <span>Storage / Warehousing Cost (₹ / Quintal)</span>
              </label>
              <span className="font-bold text-slate-900 text-sm">₹{storageCostPerQ}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="2"
              value={storageCostPerQ}
              onChange={(e) => setStorageCostPerQ(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹0 (Immediate Unload)</span>
              <span>Warehouse: ₹20/month</span>
              <span>₹100</span>
            </div>
          </div>

          {/* 5. Other Costs */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Other Costs: Weighment, Bagging, Mandi Cess (₹ / Q)</span>
              </label>
              <span className="font-bold text-slate-900 text-sm">₹{otherCostsPerQ}</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="2"
              value={otherCostsPerQ}
              onChange={(e) => setOtherCostsPerQ(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹0</span>
              <span>Standard fee: ₹15-25</span>
              <span>₹80</span>
            </div>
          </div>
        </div>

        {/* Right Output: Real-Time Financial Statement (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Financial Summary
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Formula Live
              </span>
            </div>

            {/* Top Big Result */}
            <div>
              <span className="text-xs text-slate-300 block">Estimated Net Return:</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mt-1 tracking-tight">
                ₹{estimatedNetReturn.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="font-bold text-white">₹{netReturnPerQ.toFixed(0)}/Quintal</span>
                <span className="text-slate-400">· Net Margin: {netMarginPercentage.toFixed(1)}%</span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs">
              <div className="flex justify-between items-center text-slate-200">
                <span>Gross Revenue ({quantity} Q × ₹{sellingPrice})</span>
                <span className="font-bold text-white">
                  +₹{grossRevenue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center text-red-300">
                <span>− Total Transportation Cost</span>
                <span className="font-semibold">
                  −₹{totalTransportCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center text-red-300">
                <span>− Storage & Warehousing</span>
                <span className="font-semibold">
                  −₹{totalStorageCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center text-red-300">
                <span>− Handling, Cess & Weighbridge</span>
                <span className="font-semibold">
                  −₹{totalOtherCosts.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/10 text-slate-300 font-bold">
                <span>Total Deductions & Costs</span>
                <span className="text-red-400">−₹{totalCosts.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Efficiency Indicator */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300 space-y-1">
              <div className="flex justify-between font-medium text-[11px]">
                <span>Cost Efficiency Ratio</span>
                <span className="text-emerald-400 font-bold">
                  {(100 - (totalCosts / (grossRevenue || 1)) * 100).toFixed(0)}% Retained
                </span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, Math.max(0, netMarginPercentage))}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick link to Simulator */}
          <div
            onClick={() => setActiveTab('whatIf')}
            className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900 cursor-pointer hover:bg-amber-100 transition-colors"
          >
            <span>
              <strong>Simulate harvest timing?</strong> Test how holding grain for 3 days changes revenue.
            </span>
            <span className="font-bold text-amber-700 underline shrink-0 ml-2">What-If →</span>
          </div>
        </div>
      </div>
    </div>
  );
};
