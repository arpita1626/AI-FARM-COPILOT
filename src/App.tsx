import React, { useState } from 'react';
import { FarmProvider, useFarm } from './context/FarmContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ExplainableModal } from './components/ExplainableModal';
import { HackathonDemoModal } from './components/HackathonDemoModal';

// Views
import { DashboardView } from './views/DashboardView';
import { ProfileView } from './views/ProfileView';
import { CopilotView } from './views/CopilotView';
import { CropPlannerView } from './views/CropPlannerView';
import { CropHealthView } from './views/CropHealthView';
import { WeatherAdvisoryView } from './views/WeatherAdvisoryView';
import { RiskIntelligenceView } from './views/RiskIntelligenceView';
import { MarketIntelligenceView } from './views/MarketIntelligenceView';
import { MarketOptimizerView } from './views/MarketOptimizerView';
import { NetReturnCalculatorView } from './views/NetReturnCalculatorView';
import { WhatIfSimulatorView } from './views/WhatIfSimulatorView';
import { FarmDigitalTwinView } from './views/FarmDigitalTwinView';
import { ActionPlanView } from './views/ActionPlanView';

import { Sprout, ShieldCheck, Heart, Sparkles, AlertCircle } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, profile } = useFarm();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'profile':
        return <ProfileView />;
      case 'copilot':
        return <CopilotView />;
      case 'cropPlanner':
        return <CropPlannerView />;
      case 'cropHealth':
        return <CropHealthView />;
      case 'weather':
        return <WeatherAdvisoryView />;
      case 'riskIntel':
        return <RiskIntelligenceView />;
      case 'marketIntel':
        return <MarketIntelligenceView />;
      case 'marketOptimizer':
        return <MarketOptimizerView />;
      case 'netReturn':
        return <NetReturnCalculatorView />;
      case 'whatIf':
        return <WhatIfSimulatorView />;
      case 'digitalTwin':
        return <FarmDigitalTwinView />;
      case 'actionPlan':
        return <ActionPlanView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 lg:pl-72 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}

          {/* Platform Positioning & Trust Footer */}
          <footer className="mt-12 pt-8 border-t border-slate-200 text-xs text-slate-500 space-y-4 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>AI FARM COPILOT</span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    One intelligent platform for every farming decision
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] max-w-2xl leading-relaxed">
                  "From crop planning to protection, risk management, harvesting and selling — understand your farm, simulate decisions and act with confidence."
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-400">
                <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">
                  AI Copilot
                </span>
                <span>+</span>
                <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">
                  Risk Intelligence
                </span>
                <span>+</span>
                <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">
                  Market Optimizer
                </span>
                <span>+</span>
                <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">
                  What-If Simulator
                </span>
                <span>+</span>
                <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">
                  Explainable AI
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-100 rounded-2xl flex items-start gap-2.5 text-[11px] text-slate-600 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Decision Support Boundary:</strong> AI Farm Copilot calculations, weather forecasts, disease screening, and market prices are decision-support estimates calibrated for {profile.farmerName}'s parcel. No guarantee of yield, disease eradication, or mandi prices is expressed or implied. Consult local Krishi Vigyan Kendra (KVK) and agricultural extension officers.
              </span>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Modals */}
      <ExplainableModal />
      <HackathonDemoModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <FarmProvider>
      <MainAppContent />
    </FarmProvider>
  );
}
