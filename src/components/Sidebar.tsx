import React from 'react';
import { useFarm } from '../context/FarmContext';
import { translations } from '../utils/translations';
import {
  LayoutDashboard,
  User,
  Bot,
  Sprout,
  ScanLine,
  CloudSun,
  ShieldAlert,
  Store,
  TrendingUp,
  Calculator,
  PlaySquare,
  MapPin,
  CheckSquare,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDemoGuide: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenDemoGuide }) => {
  const { activeTab, setActiveTab, language, profile } = useFarm();
  const t = translations[language] || translations.en;

  const NAV_ITEMS = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'profile', label: t.nav.profile, icon: User },
    { id: 'copilot', label: t.nav.copilot, icon: Bot, badge: 'AI' },
    { id: 'cropPlanner', label: t.nav.cropPlanner, icon: Sprout },
    { id: 'cropHealth', label: t.nav.cropHealth, icon: ScanLine },
    { id: 'weather', label: t.nav.weather, icon: CloudSun },
    { id: 'riskIntel', label: t.nav.riskIntel, icon: ShieldAlert },
    { id: 'marketIntel', label: t.nav.marketIntel, icon: Store },
    { id: 'marketOptimizer', label: t.nav.marketOptimizer, icon: TrendingUp },
    { id: 'netReturn', label: t.nav.netReturn, icon: Calculator },
    { id: 'whatIf', label: t.nav.whatIf, icon: PlaySquare, highlight: true },
    { id: 'digitalTwin', label: t.nav.digitalTwin, icon: MapPin },
    { id: 'actionPlan', label: t.nav.actionPlan, icon: CheckSquare },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        style={{ width: '280px', minWidth: '280px' }}
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:shrink-0 lg:h-screen lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Mobile Close */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm tracking-wide font-['Outfit']">
                AI FARM COPILOT
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">Smart Decision Engine</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                    : item.highlight
                    ? 'text-emerald-300 hover:bg-slate-800/80 bg-emerald-950/30 border border-emerald-900/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-white'
                        : item.highlight
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                      isActive
                        ? 'bg-emerald-700 text-emerald-100'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Walkthrough CTA & Farm Context Snapshot */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={() => {
              onOpenDemoGuide();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-700 hover:to-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hackathon Demo Guide</span>
          </button>

          {/* Active Field Context Box */}
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px]">
            <div className="text-slate-400 font-medium flex justify-between items-center">
              <span>Active Farm:</span>
              <span className="text-emerald-400 font-bold">{profile.farmerName}</span>
            </div>
            <div className="text-slate-200 font-semibold mt-1 truncate">
              {profile.currentCrop} ({profile.farmSize} {profile.sizeUnit})
            </div>
            <div className="text-slate-400 text-[10px] mt-0.5">{profile.cropStage}</div>
          </div>
        </div>
      </aside>
    </>
  );
};
