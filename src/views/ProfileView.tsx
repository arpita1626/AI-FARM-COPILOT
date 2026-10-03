import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { translations } from '../utils/translations';
import { SoilType, CropStage } from '../types/farm';
import {
  User,
  Save,
  RotateCcw,
  Sparkles,
  MapPin,
  Sprout,
  Droplets,
  Store,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile, loadPresetProfile, language, setActiveTab } = useFarm();
  const t = translations[language] || translations.en;

  const [formData, setFormData] = useState(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const SOIL_OPTIONS: SoilType[] = [
    'Alluvial Soil',
    'Black Cotton Soil',
    'Red Sandy Loam',
    'Clay Loam',
    'Laterite Soil',
    'Silty Loam',
  ];

  const CROP_STAGES: CropStage[] = [
    'Sowing / Germination',
    'Vegetative Stage',
    'Tillering / Branching',
    'Flowering / Panicle Initiation',
    'Grain Filling / Fruit Setting',
    'Maturity / Ripening',
    'Ready for Harvest',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2800);
  };

  const handlePresetSelect = (presetKey: string) => {
    loadPresetProfile(presetKey);
    // synchronize local form
    setTimeout(() => {
      // will be updated from context or directly:
      if (presetKey === 'ramesh') {
        setFormData((prev) => ({
          ...prev,
          farmerName: 'Ramesh Patel',
          location: 'Sambalpur',
          state: 'Odisha',
          farmSize: 5,
          soilType: 'Alluvial Soil',
          currentCrop: 'Paddy (Swarna)',
          cropStage: 'Vegetative Stage',
          previousYield: 24,
          previousProblems: 'Stem Borer & Leaf Blast during humid monsoon peak',
        }));
      } else if (presetKey === 'priya') {
        setFormData((prev) => ({
          ...prev,
          farmerName: 'Priya Mohanty',
          location: 'Bargarh',
          state: 'Odisha',
          farmSize: 8,
          soilType: 'Clay Loam',
          currentCrop: 'Paddy (Pooja)',
          cropStage: 'Flowering / Panicle Initiation',
          previousYield: 28,
          previousProblems: 'Brown Plant Hopper (BPH) & Water stagnation in lower parcel',
        }));
      } else if (presetKey === 'harpreet') {
        setFormData((prev) => ({
          ...prev,
          farmerName: 'Harpreet Singh',
          location: 'Karnal',
          state: 'Haryana',
          farmSize: 12,
          soilType: 'Alluvial Soil',
          currentCrop: 'Wheat (HD 3086)',
          cropStage: 'Tillering / Branching',
          previousYield: 22,
          previousProblems: 'Yellow Rust outbreak & terminal heat stress in late March',
        }));
      } else if (presetKey === 'rajesh') {
        setFormData((prev) => ({
          ...prev,
          farmerName: 'Rajesh Patil',
          location: 'Jalgaon',
          state: 'Maharashtra',
          farmSize: 6,
          soilType: 'Black Cotton Soil',
          currentCrop: 'Bt Cotton',
          cropStage: 'Flowering / Panicle Initiation',
          previousYield: 14,
          previousProblems: 'Pink Bollworm & intermittent dry spells',
        }));
      }
    }, 50);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
              <User className="w-3.5 h-3.5" />
              <span>Unified Farm Context</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
              Farmer Profile & Farm Specifications
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Whatever details you specify here will instantly synchronize across all 13 modules, including
              AI Copilot, What-If Simulator, Risk Intelligence, and Market Optimizer.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="shrink-0 flex flex-wrap gap-1.5 sm:flex-col sm:items-end">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Test Profiles:
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handlePresetSelect('ramesh')}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 transition-colors"
              >
                Ramesh (Paddy)
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('priya')}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 transition-colors"
              >
                Priya (Bargarh)
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('harpreet')}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 transition-colors"
              >
                Harpreet (Wheat)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Success Alert */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <div className="text-xs">
              <span className="font-bold">Profile synchronized successfully!</span> Active farmer name: "
              {formData.farmerName}". All modules have recalculated decisions.
            </div>
          </div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-xs font-bold bg-white text-emerald-900 px-3 py-1.5 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            Go to Dashboard →
          </button>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Farmer & Farm Identity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-emerald-600" />
            <span>1. Farmer Identity & Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Farmer Name * <span className="text-[11px] text-emerald-600">(Appears everywhere)</span>
              </label>
              <input
                type="text"
                required
                value={formData.farmerName}
                onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                placeholder="e.g. Ramesh Patel"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location (District / Block) *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Sambalpur, Dhankauda Block"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Farm Size & Unit *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  required
                  value={formData.farmSize}
                  onChange={(e) => setFormData({ ...formData, farmSize: parseFloat(e.target.value) || 1 })}
                  className="w-2/3 text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                />
                <select
                  value={formData.sizeUnit}
                  onChange={(e) => setFormData({ ...formData, sizeUnit: e.target.value as any })}
                  className="w-1/3 text-sm px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                >
                  <option value="Acres">Acres</option>
                  <option value="Hectares">Hectares</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Soil Type *
              </label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value as SoilType })}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
              >
                {SOIL_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Crop Phenology & Stage */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>2. Crop & Phenological Stage</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Crop *
              </label>
              <input
                type="text"
                required
                value={formData.currentCrop}
                onChange={(e) => setFormData({ ...formData, currentCrop: e.target.value })}
                placeholder="e.g. Paddy (Swarna MTU 7029)"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Crop Stage *
              </label>
              <select
                value={formData.cropStage}
                onChange={(e) => setFormData({ ...formData, cropStage: e.target.value as CropStage })}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
              >
                {CROP_STAGES.map((cs) => (
                  <option key={cs} value={cs}>
                    {cs}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Previous Crops (Crop Rotation History)
              </label>
              <input
                type="text"
                value={formData.previousCrops}
                onChange={(e) => setFormData({ ...formData, previousCrops: e.target.value })}
                placeholder="e.g. Mustard, Moong pulse, Groundnut"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Previous Yield (Quintals / Acre)
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={formData.previousYield}
                onChange={(e) => setFormData({ ...formData, previousYield: parseFloat(e.target.value) || 20 })}
                placeholder="e.g. 24"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Water, History & Market Channels */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <Droplets className="w-4 h-4 text-emerald-600" />
            <span>3. Water Availability, Recurring Problems & Markets</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Water Availability & Irrigation Infrastructure *
              </label>
              <input
                type="text"
                required
                value={formData.waterAvailability}
                onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value })}
                placeholder="e.g. Canal sluice gate + 1 Electric Borewell (Adequate water)"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Previous Farming Problems (Used by AI for early pest/disease prevention)
              </label>
              <textarea
                rows={2}
                value={formData.previousProblems}
                onChange={(e) => setFormData({ ...formData, previousProblems: e.target.value })}
                placeholder="e.g. Yellow Stem Borer, Blast at panicle stage, Waterlogging after heavy monsoon downpour"
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Markets & Buyers
              </label>
              <input
                type="text"
                value={formData.preferredMarkets}
                onChange={(e) => setFormData({ ...formData, preferredMarkets: e.target.value })}
                placeholder="e.g. Sambalpur APMC Mandi, Bargarh Grain Terminal, Local Haat"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setFormData(profile)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.common.reset}</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t.common.save}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
