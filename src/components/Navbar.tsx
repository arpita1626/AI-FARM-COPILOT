import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { translations } from '../utils/translations';
import { Language } from '../types/farm';
import {
  Sprout,
  User,
  Mic,
  MicOff,
  Globe,
  Wifi,
  WifiOff,
  Sparkles,
  Menu,
  Volume2,
  VolumeX,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenDemoGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenDemoGuide }) => {
  const {
    profile,
    loadPresetProfile,
    language,
    setLanguage,
    isOffline,
    toggleOffline,
    isSyncing,
    setActiveTab,
    isSpeaking,
    stopSpeaking,
    sendCopilotQuery,
  } = useFarm();

  const t = translations[language] || translations.en;
  const [isListening, setIsListening] = useState(false);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  // Web Speech Recognition handler
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Functional fallback
      const promptQuery = prompt(
        language === 'hi'
          ? 'वॉयस इनपुट ब्राउज़र में उपलब्ध नहीं है। अपना प्रश्न यहाँ लिखें:'
          : language === 'or'
          ? 'ସ୍ୱର ଇନପୁଟ୍ ଉପଲବ୍ଧ ନାହିଁ। ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଏଠାରେ ଲେଖନ୍ତୁ:'
          : 'Microphone API unavailable in this browser. Type your query for Farm Copilot:'
      );
      if (promptQuery) {
        setActiveTab('copilot');
        sendCopilotQuery(promptQuery);
      }
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'or' ? 'or-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setActiveTab('copilot');
        sendCopilotQuery(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Syncing Notification Banner */}
      {isSyncing && (
        <div className="bg-emerald-600 text-white text-xs py-1 px-4 text-center flex items-center justify-center gap-2 font-medium animate-pulse">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>{t.common.syncing}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <div className="font-extrabold text-slate-900 tracking-tight text-base flex items-center gap-1.5 font-['Outfit']">
                  <span>AI FARM COPILOT</span>
                  <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    DECISION ENGINE
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 -mt-0.5 font-medium line-clamp-1">
                  Plan · Plant · Grow · Protect · Harvest · Sell
                </div>
              </div>
            </button>
          </div>

          {/* Right: Actions, Profile, Language, Voice, Connectivity */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hackathon Demo Walkthrough Button */}
            <button
              onClick={onOpenDemoGuide}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-sm hover:from-amber-600 hover:to-emerald-700 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Hackathon Demo Flow</span>
              <span className="md:hidden">Demo</span>
            </button>

            {/* Farmer Profile Pill + Preset Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200/70 text-slate-800 rounded-xl border border-slate-200 transition-colors text-xs font-medium cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {profile.farmerName.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-slate-900 leading-tight">
                    {profile.farmerName}
                  </div>
                  <div className="text-[10px] text-slate-500">{profile.location}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Profile Switcher Dropdown */}
              {showProfileSwitcher && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Active Farmer Profile
                    </span>
                    <div className="font-bold text-slate-800 text-sm mt-0.5">
                      {profile.farmerName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {profile.farmSize} {profile.sizeUnit} · {profile.currentCrop}
                    </div>
                  </div>

                  <div className="px-3 py-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Quick Demo Switcher
                    </span>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          loadPresetProfile('ramesh');
                          setShowProfileSwitcher(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 flex justify-between"
                      >
                        <span>Ramesh Patel (Paddy, Odisha)</span>
                        {profile.farmerName === 'Ramesh Patel' && (
                          <span className="text-emerald-600 font-bold">✓</span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          loadPresetProfile('priya');
                          setShowProfileSwitcher(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 flex justify-between"
                      >
                        <span>Priya Mohanty (Paddy, Bargarh)</span>
                        {profile.farmerName === 'Priya Mohanty' && (
                          <span className="text-emerald-600 font-bold">✓</span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          loadPresetProfile('harpreet');
                          setShowProfileSwitcher(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 flex justify-between"
                      >
                        <span>Harpreet Singh (Wheat, Karnal)</span>
                        {profile.farmerName === 'Harpreet Singh' && (
                          <span className="text-emerald-600 font-bold">✓</span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          loadPresetProfile('rajesh');
                          setShowProfileSwitcher(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 flex justify-between"
                      >
                        <span>Rajesh Patil (Cotton, Jalgaon)</span>
                        {profile.farmerName === 'Rajesh Patil' && (
                          <span className="text-emerald-600 font-bold">✓</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-100 px-3">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowProfileSwitcher(false);
                      }}
                      className="w-full py-1.5 text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      Edit Custom Farmer Profile →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  language === 'hi'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('or')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  language === 'or'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ଓଡ଼ିଆ
              </button>
            </div>

            {/* Voice Input Microphone */}
            <button
              onClick={handleVoiceInput}
              title={isListening ? 'Listening...' : 'Voice Assistant (Ask Farm Copilot)'}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white border-red-600 animate-pulse shadow-md shadow-red-500/30'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* TTS Speaking Indicator */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                title="Stop Audio Speech"
                className="p-2 rounded-xl bg-amber-500 text-white border border-amber-600 animate-bounce cursor-pointer"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}

            {/* Online / Offline Toggle */}
            <button
              onClick={toggleOffline}
              title={isOffline ? 'Offline mode active (cached)' : 'Online mode active'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isOffline
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-300'
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">OFFLINE</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">ONLINE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
