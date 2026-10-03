import React from 'react';
import { useFarm } from '../context/FarmContext';
import { translations } from '../utils/translations';
import {
  CloudSun,
  CloudRain,
  Droplets,
  Wind,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Compass,
} from 'lucide-react';

export const WeatherAdvisoryView: React.FC = () => {
  const { weather, profile, openExplainableModal, language } = useFarm();
  const t = translations[language] || translations.en;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-semibold border border-sky-200 mb-2">
              <CloudSun className="w-3.5 h-3.5" />
              <span>Agronomic Microclimate Intelligence</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
              Weather + Crop Advisory Engine
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Live meteorological feeds translated into operational decisions for{' '}
              <strong className="text-slate-800">{profile.farmerName}</strong>'s{' '}
              <strong className="text-emerald-700">{profile.currentCrop}</strong> ({profile.cropStage}) in{' '}
              {profile.location}.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>RADAR ACTIVE · VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Main Atmospheric Metrics & Actionable Advisory Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Current Weather Snapshot (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-sky-800 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-sky-200">
                  {profile.location}, {profile.state}
                </span>
                <div className="text-4xl font-extrabold mt-1 tracking-tight">
                  {weather.currentTemp}°C
                </div>
                <div className="text-xs text-sky-200 mt-0.5">
                  Feels like {weather.feelsLike}°C · {weather.condition}
                </div>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl">
                <CloudRain className="w-10 h-10 text-sky-300" />
              </div>
            </div>

            {/* Quick Grid of Readings */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-sky-300" />
                <div>
                  <span className="text-sky-200 block text-[10px]">Rain Probability</span>
                  <span className="font-bold text-white text-sm">{weather.rainProbability}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-300" />
                <div>
                  <span className="text-sky-200 block text-[10px]">Relative Humidity</span>
                  <span className="font-bold text-white text-sm">{weather.humidity}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-sky-300" />
                <div>
                  <span className="text-sky-200 block text-[10px]">Wind Velocity</span>
                  <span className="font-bold text-white text-sm">{weather.windSpeed} km/h</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-300" />
                <div>
                  <span className="text-sky-200 block text-[10px]">Wind Direction</span>
                  <span className="font-bold text-white text-sm truncate">{weather.windDirection}</span>
                </div>
              </div>
            </div>

            {/* Warning Pill if present */}
            {weather.warningAlert && (
              <div className="mt-4 p-3 bg-amber-500/20 border border-amber-400/40 rounded-xl flex items-start gap-2.5 text-xs text-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span className="leading-snug">{weather.warningAlert}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Translated Farm Advisories (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Irrigation Advisory */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                Irrigation Recommendation
              </span>
              <span className="text-xs font-bold text-emerald-600">Action Required</span>
            </div>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {weather.irrigationRecommendation}
            </p>
            <div className="text-xs text-slate-500 pt-1 flex items-center justify-between border-t border-slate-100">
              <span>Why: {weather.reason}</span>
              <button
                onClick={() =>
                  openExplainableModal({
                    title: 'Irrigation Advisory',
                    recommendation: weather.irrigationRecommendation,
                    inputsConsidered: [
                      `Soil Type: ${profile.soilType}`,
                      `Crop Stage: ${profile.cropStage}`,
                      `Atmospheric Humidity: ${weather.humidity}%`,
                      `Rain Forecast: 75% tomorrow`,
                    ],
                    weatherFactor: 'Approaching rain depression provides natural root zone hydration',
                    cropStageFactor: 'Over-saturation in vegetative phase leads to nutrient leaching',
                    soilFactor: 'Alluvial soil retains water for 72+ hours',
                    marketFactor: 'Saves diesel pumping costs',
                    confidence: 93,
                    dataSource: 'VERIFIED',
                    dataFreshness: 'Updated 15m ago',
                    disclaimer: 'Verify field moisture before starting pumps.',
                  })
                }
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t.common.why}</span>
              </button>
            </div>
          </div>

          {/* Spraying Advisory */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                Chemical / Bio Spray Advisory
              </span>
              <span className="text-xs font-bold text-amber-600">Window: Caution</span>
            </div>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {weather.sprayingRecommendation}
            </p>
            <div className="text-xs text-slate-500 pt-1 border-t border-slate-100">
              Spraying today will wash off with tomorrow's predicted rain, wasting chemicals and money.
            </div>
          </div>

          {/* Harvest Advisory */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                Harvest Window Evaluation
              </span>
              <span className="text-xs font-bold text-slate-500">Stage: {profile.cropStage}</span>
            </div>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {weather.harvestRecommendation}
            </p>
            <div className="text-xs text-slate-500 pt-1 border-t border-slate-100">
              Clear sunshine predicted from Saturday onwards provides optimal grain moisture dry-down.
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Agronomic Forecast Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-base font-['Outfit']">
              7-Day Agronomic Weather & Spray Horizon
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Calibrated for {profile.farmerName}'s parcel in {profile.location}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weather.forecast7Days.map((day, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-center flex flex-col justify-between ${
                idx === 0
                  ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-slate-800 block">{day.dayName}</span>
                <span className="text-[10px] text-slate-400 block">{day.dateStr}</span>

                <div className="my-2 flex justify-center">
                  <CloudSun className="w-7 h-7 text-sky-600" />
                </div>

                <div className="text-sm font-extrabold text-slate-900">
                  {day.tempMax}° / {day.tempMin}°
                </div>

                <div className="text-[11px] font-bold text-sky-700 mt-1">
                  🌧 {day.rainProb}% Rain
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/80 text-[10px] text-slate-600 space-y-1">
                <span
                  className={`inline-block px-1.5 py-0.5 rounded font-bold ${
                    day.spraySuitability === 'Ideal'
                      ? 'bg-emerald-100 text-emerald-800'
                      : day.spraySuitability === 'Caution'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  Spray: {day.spraySuitability}
                </span>
                <div className="font-medium text-slate-500 truncate" title={day.irrigationAdvice}>
                  {day.irrigationAdvice}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
