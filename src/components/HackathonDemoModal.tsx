import React from 'react';
import { useFarm } from '../context/FarmContext';
import {
  Sparkles,
  X,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Cpu,
  HelpCircle,
  TrendingUp,
  Image as ImageIcon,
  Calculator,
  CalendarCheck,
} from 'lucide-react';

interface HackathonDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HackathonDemoModal: React.FC<HackathonDemoModalProps> = ({ isOpen, onClose }) => {
  const {
    demoStep,
    setDemoStep,
    setActiveTab,
    profile,
    updateProfile,
    openExplainableModal,
    risks,
  } = useFarm();

  if (!isOpen) return null;

  const DEMO_STEPS = [
    {
      step: 1,
      title: 'Farmer Profile Configuration',
      desc: 'Enter farmer name, location, farm size, soil, crop and crop stage. Dynamic name propagation across app.',
      targetTab: 'profile',
      actionLabel: 'Go to Profile & Set Data',
      icon: Cpu,
      onRun: () => {
        setActiveTab('profile');
        setDemoStep(1);
        onClose();
      },
    },
    {
      step: 2,
      title: 'Dashboard Loads Farm Context',
      desc: 'Dashboard immediately synchronizes with farmer name, crop phenology, and active field parameters.',
      targetTab: 'dashboard',
      actionLabel: 'View Dashboard Context',
      icon: CheckCircle2,
      onRun: () => {
        setActiveTab('dashboard');
        setDemoStep(2);
        onClose();
      },
    },
    {
      step: 3,
      title: 'Live Weather, Risks & Market Pulse',
      desc: 'Answers: What is happening on my farm? Real-time temperature, humidity, rain alert, and market price.',
      targetTab: 'dashboard',
      actionLabel: 'Inspect Farm Status',
      icon: TrendingUp,
      onRun: () => {
        setActiveTab('dashboard');
        setDemoStep(3);
        onClose();
      },
    },
    {
      step: 4,
      title: 'AI Identifies Upcoming Risk',
      desc: 'Risk Intelligence detects heavy rainfall collision with saturated alluvial topsoil and pest pressure.',
      targetTab: 'riskIntel',
      actionLabel: 'Review Risk Intelligence',
      icon: Cpu,
      onRun: () => {
        setActiveTab('riskIntel');
        setDemoStep(4);
        onClose();
      },
    },
    {
      step: 5,
      title: 'AI Explains WHY Risk Was Identified',
      desc: 'Explainable AI modal reveals exact factors: Barometric pressure drop, 78% humidity, and crop vulnerability.',
      targetTab: 'riskIntel',
      actionLabel: 'Open "Why This?" XAI Breakdown',
      icon: HelpCircle,
      onRun: () => {
        setActiveTab('riskIntel');
        setDemoStep(5);
        const topRisk = risks[0];
        openExplainableModal({
          title: topRisk.name,
          recommendation: topRisk.recommendedAction,
          inputsConsidered: [
            `Farmer: ${profile.farmerName} (${profile.location})`,
            `Soil: ${profile.soilType} with 68% saturation`,
            `Weather: 75% precipitation probability (18-24mm) in next 24h`,
            `Crop: ${profile.currentCrop} in ${profile.cropStage}`,
            `Historical Record: Drainage ditch overflow problem`,
          ],
          weatherFactor: 'Frontal monsoon depression causing nocturnal dew and barometric dip',
          cropStageFactor: 'Vegetative tillering root zone requires aerobic soil conditions',
          soilFactor: 'High clay/alluvial fraction impedes rapid vertical percolation',
          marketFactor: 'N/A for microclimate risk',
          confidence: topRisk.confidence,
          dataSource: topRisk.dataSource,
          dataFreshness: 'Radar updated 8 mins ago',
          disclaimer:
            'Predictive meteorological simulation. Keep spillway ditches unobstructed to prevent stagnation.',
        });
        onClose();
      },
    },
    {
      step: 6,
      title: 'Upload Crop Image',
      desc: 'Farmer takes or uploads a leaf/canopy photo for preliminary disease and pest screening.',
      targetTab: 'cropHealth',
      actionLabel: 'Go to Crop Health Screener',
      icon: ImageIcon,
      onRun: () => {
        setActiveTab('cropHealth');
        setDemoStep(6);
        onClose();
      },
    },
    {
      step: 7,
      title: 'AI Crop-Health Screening Result',
      desc: 'Multimodal AI classifies lesion geometry, computes confidence %, lists symptoms, and provides cultural remedies.',
      targetTab: 'cropHealth',
      actionLabel: 'View Screening Output',
      icon: Cpu,
      onRun: () => {
        setActiveTab('cropHealth');
        setDemoStep(7);
        onClose();
      },
    },
    {
      step: 8,
      title: 'Open Market Optimizer',
      desc: 'Examine multiple nearby APMC mandis, local haats, and private food processors.',
      targetTab: 'marketOptimizer',
      actionLabel: 'Launch Market Optimizer',
      icon: TrendingUp,
      onRun: () => {
        setActiveTab('marketOptimizer');
        setDemoStep(8);
        onClose();
      },
    },
    {
      step: 9,
      title: 'Compare Markets by Net Return',
      desc: 'Price minus Transport, Storage, and Handling costs reveals true net profitability.',
      targetTab: 'marketOptimizer',
      actionLabel: 'Inspect Net Return Trade-Offs',
      icon: Calculator,
      onRun: () => {
        setActiveTab('marketOptimizer');
        setDemoStep(9);
        onClose();
      },
    },
    {
      step: 10,
      title: 'Open What-If Simulator',
      desc: 'Dedicated interactive sandbox to test complex decisions before spending money.',
      targetTab: 'whatIf',
      actionLabel: 'Open What-If Simulator',
      icon: PlayCircle,
      onRun: () => {
        setActiveTab('whatIf');
        setDemoStep(10);
        onClose();
      },
    },
    {
      step: 11,
      title: 'Simulate: "What if I harvest 3 days later?"',
      desc: 'Adjust harvest delay slider to 3 days. System calculates moisture drop, quality bonus, and weather exposure.',
      targetTab: 'whatIf',
      actionLabel: 'Simulate Harvest 3 Days Later',
      icon: Cpu,
      onRun: () => {
        setActiveTab('whatIf');
        setDemoStep(11);
        onClose();
      },
    },
    {
      step: 12,
      title: 'Compare Scenarios Side-by-Side',
      desc: 'Harvest Today vs Harvest 3 Days Later shows expected net return delta (+₹4,500) and risk factors.',
      targetTab: 'whatIf',
      actionLabel: 'View Comparative Analytics',
      icon: TrendingUp,
      onRun: () => {
        setActiveTab('whatIf');
        setDemoStep(12);
        onClose();
      },
    },
    {
      step: 13,
      title: 'Actionable Plan: Today + 3 Days + 7 Days',
      desc: 'Farmer receives a prioritized, concrete action plan categorized into Today, Next 3 Days, and Next 7 Days.',
      targetTab: 'actionPlan',
      actionLabel: 'Open Action Plan',
      icon: CalendarCheck,
      onRun: () => {
        setActiveTab('actionPlan');
        setDemoStep(13);
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 border border-emerald-400/40 rounded-xl">
              <Sparkles className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight flex items-center gap-2">
                <span>Hackathon Demo Walkthrough Guide</span>
                <span className="text-xs bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">
                  13-Step Flow
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Demonstrates how one continuous AI decision engine connects profile to harvest and sale
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="p-6 overflow-y-auto space-y-3 divide-y divide-slate-100">
          {DEMO_STEPS.map((item) => {
            const Icon = item.icon;
            const isCurrent = demoStep === item.step;
            return (
              <div
                key={item.step}
                className={`pt-3 first:pt-0 p-3 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-emerald-50 border border-emerald-300 ring-2 ring-emerald-500/20'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCurrent
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.step}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                        <span>{item.title}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                            Active Step
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={item.onRun}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                  >
                    <span>Execute</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Active Farmer:{' '}
            <span className="font-semibold text-slate-800">{profile.farmerName}</span> (
            {profile.location})
          </div>
          <button
            onClick={() => {
              DEMO_STEPS[0].onRun();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Start from Step 1</span>
          </button>
        </div>
      </div>
    </div>
  );
};
