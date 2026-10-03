import React, { useState, useRef, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { translations } from '../utils/translations';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  HelpCircle,
  Sparkles,
  Info,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export const CopilotView: React.FC = () => {
  const {
    profile,
    weather,
    copilotMessages,
    sendCopilotQuery,
    isCopilotLoading,
    openExplainableModal,
    speakText,
    language,
    isOffline,
  } = useFarm();

  const t = translations[language] || translations.en;
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [copilotMessages, isCopilotLoading]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isCopilotLoading) return;
    sendCopilotQuery(inputText.trim());
    setInputText('');
  };

  const handleQuickQuestion = (q: string) => {
    sendCopilotQuery(q);
  };

  // Web Speech Recognition for in-copilot voice
  const handleMicClick = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Microphone speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'or' ? 'or-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsRecording(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);
        if (transcript) {
          sendCopilotQuery(transcript);
        }
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const PROMPT_SUGGESTIONS = [
    'What should I do today?',
    'Will rain affect my crop?',
    'When should I irrigate?',
    'Should I harvest now?',
    'Which market should I sell to?',
    'What are my risks for the next 7 days?',
    'Why are you recommending this?',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-8">
      {/* Header Context Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-sm shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2 font-['Outfit']">
              <span>AI Farm Copilot</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Grounding Active
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Personalized agricultural decision support for{' '}
              <strong className="text-slate-800">{profile.farmerName}</strong> ({profile.currentCrop},{' '}
              {profile.cropStage})
            </p>
          </div>
        </div>

        {/* Live Grounding Summary */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-slate-500 font-medium">Context Ingested:</span>
          <span className="px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-700 font-semibold">
            {profile.soilType}
          </span>
          <span className="px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-700 font-semibold">
            {profile.cropStage}
          </span>
          <span className="px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-700 font-semibold">
            {weather.currentTemp}°C · Rain {weather.rainProbability}%
          </span>
          {isOffline && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">
              OFFLINE CACHED
            </span>
          )}
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 whitespace-nowrap pl-1">
          Quick Questions:
        </span>
        {PROMPT_SUGGESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickQuestion(q)}
            disabled={isCopilotLoading}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-600 hover:text-white text-slate-700 border border-slate-200 shadow-2xs whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Panel */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {copilotMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-slate-800 text-white'
                      : 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  }`}
                >
                  {isUser ? profile.farmerName.charAt(0) : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-slate-900 text-white rounded-tr-xs'
                        : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Actions for Assistant Message: Why this recommendation & Listen */}
                  {!isUser && msg.whyExplanation && (
                    <div className="flex items-center gap-2 pt-1 pl-1">
                      <button
                        onClick={() =>
                          openExplainableModal({
                            title: 'Farm Copilot Priority Recommendation',
                            recommendation: msg.text.slice(0, 220) + '...',
                            inputsConsidered: msg.whyExplanation!.inputsConsidered,
                            weatherFactor: msg.whyExplanation!.weatherFactors,
                            cropStageFactor: msg.whyExplanation!.cropStageFactor,
                            soilFactor: `Soil moisture retention on ${profile.soilType}`,
                            marketFactor: 'Evaluated against regional spot market curves',
                            confidence: msg.whyExplanation!.confidence,
                            dataSource: msg.whyExplanation!.dataSource,
                            dataFreshness: 'Synchronized with farm sensors and local weather',
                            disclaimer: msg.whyExplanation!.disclaimer,
                          })
                        }
                        className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{t.common.whyRecommendation}</span>
                      </button>

                      <button
                        onClick={() => speakText(msg.text)}
                        title="Listen to Advice"
                        className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-[10px] text-slate-400 ml-auto">{msg.timestamp}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isCopilotLoading && (
            <div className="flex items-center gap-3 mr-auto max-w-[80%]">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-xs text-xs text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Evaluating farm context, weather radar & agronomic rules...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleMicClick}
              title={isRecording ? 'Listening...' : 'Voice Input (Microphone)'}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isRecording
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask anything about your ${profile.currentCrop} farm, ${profile.farmerName}...`}
              className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isCopilotLoading}
              className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-sm shadow-emerald-700/20 transition-all cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Grounding: Soil, Weather, Phenology & Risk Database</span>
            </span>
            <span className="hidden sm:inline">Press Enter to send</span>
          </div>
        </form>
      </div>

      {/* Safety Notice */}
      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Decision Support Notice:</strong> AI Farm Copilot provides advisory estimates based on agronomic models and weather radar. It does not guarantee harvest outcomes or crop immunity. Confirm vital chemical and financial choices with certified Krishi Vigyan Kendra agronomists.
        </p>
      </div>
    </div>
  );
};
