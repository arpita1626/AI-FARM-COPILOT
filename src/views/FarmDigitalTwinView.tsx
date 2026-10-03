import React from 'react';
import { useFarm } from '../context/FarmContext';
import { translations } from '../utils/translations';
import { DigitalZone } from '../types/farm';
import {
  MapPin,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const FarmDigitalTwinView: React.FC = () => {
  const { digitalZones, selectedZone, setSelectedZone, profile, openExplainableModal, language } =
    useFarm();
  const t = translations[language] || translations.en;

  const activeZone = selectedZone || digitalZones[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Healthy':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Pest Risk':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Water Stressed':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'Needs Inspection':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Spatial Parcel Intelligence</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
              Farm Digital Twin Map
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Virtual twin of <strong className="text-slate-800">{profile.farmerName}</strong>'s {profile.farmSize}-acre farm in {profile.location}. Click any zone to inspect micro-soil moisture, canopy vigor, and localized actions.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
            <span>4 Active Zones ({profile.farmSize} Total Acres)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Map Grid (7 cols) + Selected Zone Drawer (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Visual Farm Map (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Interactive Farm Parcel Layout:
            </span>
            <span className="text-[11px] text-slate-400">Click a sector below</span>
          </div>

          {/* Graphical 2x2 Field Parcel Map with styled soil texture */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950 rounded-2xl relative overflow-hidden shadow-inner min-h-[340px]">
            {digitalZones.map((zone) => {
              const isSelected = activeZone.id === zone.id;
              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between relative group ${
                    isSelected
                      ? 'border-white bg-slate-900/90 shadow-xl ring-4 ring-emerald-500/30'
                      : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  {/* Top sector label */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-white/10 text-white border border-white/10">
                      {zone.zoneCode}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getStatusBadge(
                        zone.status
                      )}`}
                    >
                      {zone.status}
                    </span>
                  </div>

                  {/* Center name & health */}
                  <div className="my-3">
                    <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {zone.name}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {zone.areaAcres} Acres · {zone.crop}
                    </div>
                  </div>

                  {/* Bottom moisture bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                      <span>Soil Moisture</span>
                      <span className="font-bold">{zone.soilMoisturePct}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${zone.soilMoisturePct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-500">
            <span className="font-bold text-slate-700">Legend:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Healthy (Zone A)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Pest Risk (Zone B)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span>Water Stressed (Zone C)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Needs Inspection (Zone D)</span>
            </span>
          </div>
        </div>

        {/* Right Drawer: Selected Zone Agronomic Telemetry (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Selected Sector Details
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                {activeZone.name} ({activeZone.zoneCode})
              </h3>
              <div className="text-xs text-slate-500 mt-0.5">
                Area: {activeZone.areaAcres} Acres · Crop: {activeZone.crop}
              </div>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1 rounded-xl border ${getStatusBadge(
                activeZone.status
              )}`}
            >
              {activeZone.status}
            </span>
          </div>

          {/* Sector Diagnostics Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Canopy Health Score</span>
              <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                {activeZone.healthScore} / 100
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Soil Moisture Level</span>
              <span className="text-lg font-bold text-cyan-700 mt-0.5 block">
                {activeZone.soilMoisturePct}%
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Nitrogen Availability</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                {activeZone.nitrogenStatus}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Irrigation Channel</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                Hirakud Sluice 2
              </span>
            </div>
          </div>

          {/* Identified Risk & Immediate Action */}
          <div className="space-y-3">
            <div className="p-3.5 bg-red-50/60 rounded-2xl border border-red-200/80 text-xs">
              <span className="font-bold text-red-900 block mb-1">Identified Sector Risk:</span>
              <p className="text-red-950/90 leading-relaxed">{activeZone.identifiedRisk}</p>
            </div>

            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 text-xs">
              <span className="font-bold text-emerald-900 block mb-1">Recommended Action:</span>
              <p className="text-emerald-950 leading-relaxed font-medium">
                {activeZone.recommendedAction}
              </p>
            </div>
          </div>

          {/* Explainable Button */}
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
            <button
              onClick={() =>
                openExplainableModal({
                  title: `${activeZone.zoneCode}: ${activeZone.name}`,
                  recommendation: activeZone.recommendedAction,
                  inputsConsidered: [
                    `Sector: ${activeZone.name} (${activeZone.areaAcres} Acres)`,
                    `Soil Moisture: ${activeZone.soilMoisturePct}%`,
                    `Canopy Health Score: ${activeZone.healthScore}/100`,
                    `Current Stage: ${profile.cropStage}`,
                  ],
                  weatherFactor: 'Surface rain runoff accumulates towards south-facing slope',
                  cropStageFactor: 'Tillering root zone requires aerobic soil conditions',
                  soilFactor: `Alluvial clay retention profile on ${profile.soilType}`,
                  marketFactor: 'None',
                  confidence: 91,
                  dataSource: 'VERIFIED',
                  dataFreshness: 'Soil probes synchronized 10m ago',
                  disclaimer: 'Digital twin telemetry. Inspect on-ground drainage gates.',
                })
              }
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.common.whyRecommendation}</span>
            </button>

            <span className="text-[10px] text-slate-400">DEMO DATA / SIMULATED SENSORS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
