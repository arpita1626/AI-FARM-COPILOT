import { Language } from '../types/farm';

export interface TranslationDict {
  appName: string;
  tagline: string;
  subTagline: string;
  nav: {
    dashboard: string;
    profile: string;
    copilot: string;
    cropPlanner: string;
    cropHealth: string;
    weather: string;
    riskIntel: string;
    marketIntel: string;
    marketOptimizer: string;
    netReturn: string;
    whatIf: string;
    digitalTwin: string;
    actionPlan: string;
    demoGuide: string;
  };
  common: {
    online: string;
    offline: string;
    syncing: string;
    why: string;
    whyRecommendation: string;
    confidence: string;
    riskLow: string;
    riskMedium: string;
    riskHigh: string;
    today: string;
    tomorrow: string;
    next3Days: string;
    next7Days: string;
    urgent: string;
    save: string;
    reset: string;
    simulate: string;
    calculate: string;
    listening: string;
    speak: string;
    verified: string;
    estimated: string;
    aiPrediction: string;
    demoData: string;
    disclaimerDecisionSupport: string;
  };
  dashboard: {
    greeting: string;
    farmStatusTitle: string;
    whatHappening: string;
    risksComing: string;
    whatToDoNow: string;
    cropHealth: string;
    waterBalance: string;
    activeRiskLevel: string;
    marketPrice: string;
    expectedRevenue: string;
    viewCopilot: string;
    runSimulation: string;
    askAi: string;
  };
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    appName: 'AI FARM COPILOT',
    tagline: 'One intelligent platform for every farming decision.',
    subTagline:
      'From crop planning to protection, risk management, harvesting and selling — understand your farm, simulate decisions and act with confidence.',
    nav: {
      dashboard: 'Dashboard',
      profile: 'Farmer Profile',
      copilot: 'AI Copilot',
      cropPlanner: 'Crop Recommendation',
      cropHealth: 'Crop Disease Screening',
      weather: 'Weather Advisory',
      riskIntel: 'Risk Intelligence',
      marketIntel: 'Market Intelligence',
      marketOptimizer: 'Market Optimizer',
      netReturn: 'Net Return Calculator',
      whatIf: 'What-If Simulator',
      digitalTwin: 'Farm Digital Twin',
      actionPlan: 'Action Plan',
      demoGuide: 'Hackathon Demo Walkthrough',
    },
    common: {
      online: 'ONLINE',
      offline: 'OFFLINE (Cached Mode)',
      syncing: 'Syncing latest information...',
      why: 'Why this?',
      whyRecommendation: 'WHY THIS RECOMMENDATION',
      confidence: 'Confidence',
      riskLow: 'LOW RISK',
      riskMedium: 'MEDIUM RISK',
      riskHigh: 'HIGH RISK',
      today: 'TODAY',
      tomorrow: 'TOMORROW',
      next3Days: '+3 DAYS',
      next7Days: '+7 DAYS',
      urgent: 'URGENT',
      save: 'Save Profile Changes',
      reset: 'Reset to Defaults',
      simulate: 'Run Simulation',
      calculate: 'Calculate Net Return',
      listening: 'Listening to your voice...',
      speak: 'Listen to Advice',
      verified: 'VERIFIED',
      estimated: 'ESTIMATED',
      aiPrediction: 'AI PREDICTION',
      demoData: 'DEMO DATA',
      disclaimerDecisionSupport:
        'AI recommendations are decision-support estimates and do not guarantee yield, market prices, or clinical diagnosis. Verify with your local Krishi Vigyan Kendra.',
    },
    dashboard: {
      greeting: 'Namaste',
      farmStatusTitle: 'Real-Time Farm Decision Center',
      whatHappening: 'What is happening on my farm?',
      risksComing: 'What risks are coming?',
      whatToDoNow: 'What should I do now?',
      cropHealth: 'Crop Health Index',
      waterBalance: 'Root Moisture Status',
      activeRiskLevel: 'Risk Pressure',
      marketPrice: 'Current Mandi Rate',
      expectedRevenue: 'Projected Net Return',
      viewCopilot: 'Ask Farm Copilot',
      runSimulation: 'Test What-If Decision',
      askAi: 'Voice or Type Question...',
    },
  },
  hi: {
    appName: 'एआई फार्म को-पायलट',
    tagline: 'हर कृषि निर्णय के लिए एक बुद्धिमान डिजिटल मंच।',
    subTagline:
      'फसल योजना से लेकर सुरक्षा, जोखिम प्रबंधन, कटाई और बिक्री तक — अपने खेत को समझें, निर्णयों का सिमुलेशन करें और आत्मविश्वास से कदम उठाएं।',
    nav: {
      dashboard: 'डैशबोर्ड',
      profile: 'किसान प्रोफाइल',
      copilot: 'एआई को-पायलट',
      cropPlanner: 'फसल सिफारिश',
      cropHealth: 'फसल रोग जांच',
      weather: 'मौसम व कृषि सलाह',
      riskIntel: 'जोखिम बुद्धिमत्ता',
      marketIntel: 'मंडी भाव व रुझान',
      marketOptimizer: 'मंडी चयन अनुकूलक',
      netReturn: 'शुद्ध लाभ कैलकुलेटर',
      whatIf: 'व्हाट-इफ सिमुलेटर',
      digitalTwin: 'खेत डिजिटल नक्शा',
      actionPlan: 'कार्य योजना (Action Plan)',
      demoGuide: 'डेमो गाइड',
    },
    common: {
      online: 'ऑनलाइन',
      offline: 'ऑफलाइन (कैश मोड)',
      syncing: 'नवीनतम डेटा सिंक हो रहा है...',
      why: 'यह क्यों?',
      whyRecommendation: 'यह सिफारिश क्यों की गई',
      confidence: 'विश्वसनीयता',
      riskLow: 'कम जोखिम',
      riskMedium: 'मध्यम जोखिम',
      riskHigh: 'उच्च जोखिम',
      today: 'आज',
      tomorrow: 'कल',
      next3Days: '+3 दिन',
      next7Days: '+7 दिन',
      urgent: 'अति आवश्यक',
      save: 'प्रोफाइल सहेजें',
      reset: 'रीसेट करें',
      simulate: 'सिमुलेशन चलाएं',
      calculate: 'शुद्ध लाभ निकालें',
      listening: 'आपकी आवाज सुन रहे हैं...',
      speak: 'सलाह सुनें',
      verified: 'सत्यापित (VERIFIED)',
      estimated: 'अनुमानित (ESTIMATED)',
      aiPrediction: 'एआई भविष्यवाणी (AI PREDICTION)',
      demoData: 'डेमो डेटा (DEMO DATA)',
      disclaimerDecisionSupport:
        'एआई सिफारिशें केवल निर्णय-सहायता के लिए हैं। अंतिम रासायनिक या कटाई निर्णय से पूर्व कृषि विज्ञान केंद्र से परामर्श लें।',
    },
    dashboard: {
      greeting: 'नमस्ते',
      farmStatusTitle: 'खेत निर्णय नियंत्रण केंद्र',
      whatHappening: 'मेरे खेत में अभी क्या हो रहा है?',
      risksComing: 'कौन से नए जोखिम आ रहे हैं?',
      whatToDoNow: 'मुझे अभी क्या कदम उठाना चाहिए?',
      cropHealth: 'फसल स्वास्थ्य सूचकांक',
      waterBalance: 'जड़ क्षेत्र नमी स्थिति',
      activeRiskLevel: 'वर्तमान जोखिम दबाव',
      marketPrice: 'वर्तमान मंडी भाव',
      expectedRevenue: 'अनुमानित शुद्ध आय',
      viewCopilot: 'को-पायलट से पूछें',
      runSimulation: 'व्हाट-इफ निर्णय परखें',
      askAi: 'बोलें या प्रश्न लिखें...',
    },
  },
  or: {
    appName: 'ଏଆଇ ଫାର୍ମ କୋ-ପାଇଲଟ୍',
    tagline: 'ପ୍ରତ୍ୟେକ କୃଷି ନିଷ୍ପତ୍ତି ପାଇଁ ଗୋଟିଏ ବୁଦ୍ଧିମାନ ଡିଜିଟାଲ୍ ମଞ୍ଚ।',
    subTagline:
      'ଫସଲ ଯୋଜନାରୁ ସୁରକ୍ଷା, ବିପଦ ପରିଚାଳନା, ଅମଳ ଏବଂ ବିକ୍ରୟ ପର୍ଯ୍ୟନ୍ତ — ନିଜ କ୍ଷେତକୁ ବୁଝନ୍ତୁ, ନିଷ୍ପତ୍ତି ସିମୁଲେସନ କରନ୍ତୁ ଏବଂ ଆତ୍ମବିଶ୍ୱାସରେ କାର୍ଯ୍ୟ କରନ୍ତୁ।',
    nav: {
      dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
      profile: 'କୃଷକ ପ୍ରୋଫାଇଲ୍',
      copilot: 'ଏଆଇ କୋ-ପାଇଲଟ୍',
      cropPlanner: 'ଫସଲ ସୁପାରିଶ',
      cropHealth: 'ଫସଲ ରୋଗ ସ୍କ୍ରିନିଂ',
      weather: 'ପାଣିପାଗ ପରାମର୍ଶ',
      riskIntel: 'ବିପଦ ବୁଦ୍ଧିମତ୍ତା',
      marketIntel: 'ମଣ୍ଡି ଦର ଏବଂ ଟ୍ରେଣ୍ଡ',
      marketOptimizer: 'ମଣ୍ଡି ଚୟନ ଅପ୍ଟିମାଇଜର',
      netReturn: 'ନିଟ୍ ଲାଭ କାଲକୁଲେଟର',
      whatIf: 'ହ୍ୱାଟ୍-ଇଫ୍ ସିମୁଲେଟର',
      digitalTwin: 'କ୍ଷେତ ଡିଜିଟାଲ୍ ମ୍ୟାପ୍',
      actionPlan: 'କାର୍ଯ୍ୟ ଯୋଜନା',
      demoGuide: 'ଡେମୋ ଗାଇଡ୍',
    },
    common: {
      online: 'ଅନଲାଇନ୍',
      offline: 'ଅଫଲାଇନ୍ (ସଞ୍ଚିତ ମୋଡ୍)',
      syncing: 'ନୂତନ ତଥ୍ୟ ସିଙ୍କ୍ ହେଉଛି...',
      why: 'କାହିଁକି?',
      whyRecommendation: 'ଏହି ସୁପାରିଶ କାହିଁକି କରାଗଲା',
      confidence: 'ବିଶ୍ୱସନୀୟତା',
      riskLow: 'କମ୍ ବିପଦ',
      riskMedium: 'ମଧ୍ୟମ ବିପଦ',
      riskHigh: 'ଉଚ୍ଚ ବିପଦ',
      today: 'ଆଜି',
      tomorrow: 'ଆସନ୍ତାକାଲି',
      next3Days: '+୩ ଦିନ',
      next7Days: '+୭ ଦିନ',
      urgent: 'ଜରୁରୀ',
      save: 'ପ୍ରୋଫାଇଲ୍ ସଂରକ୍ଷଣ କରନ୍ତୁ',
      reset: 'ରିସେଟ୍ କରନ୍ତୁ',
      simulate: 'ସିମୁଲେସନ ଚଳାନ୍ତୁ',
      calculate: 'ନିଟ୍ ଲାଭ ହିସାବ କରନ୍ତୁ',
      listening: 'ଆପଣଙ୍କ ସ୍ୱର ଶୁଣାଯାଉଛି...',
      speak: 'ପରାମର୍ଶ ଶୁଣନ୍ତୁ',
      verified: 'ଯାଞ୍ଚ ହୋଇଥିବା (VERIFIED)',
      estimated: 'ଆନୁମାନିକ (ESTIMATED)',
      aiPrediction: 'ଏଆଇ ପୂର୍ବାନୁମାନ (AI PREDICTION)',
      demoData: 'ଡେମୋ ତଥ୍ୟ (DEMO DATA)',
      disclaimerDecisionSupport:
        'ଏଆଇ ସୁପାରିଶ କେବଳ ନିଷ୍ପତ୍ତି ସହାୟତା ପାଇଁ। ଚୂଡ଼ାନ୍ତ ନିଷ୍ପତ୍ତି ପୂର୍ବରୁ କୃଷି ବିଜ୍ଞାନ କେନ୍ଦ୍ର ସହିତ ପରାମର୍ଶ କରନ୍ତୁ।',
    },
    dashboard: {
      greeting: 'ନମସ୍କାର',
      farmStatusTitle: 'କ୍ଷେତ ନିଷ୍ପତ୍ତି ନିୟନ୍ତ୍ରଣ କେନ୍ଦ୍ର',
      whatHappening: 'ମୋ କ୍ଷେତରେ ବର୍ତ୍ତମାନ କ’ଣ ଘଟୁଛି?',
      risksComing: 'ଆଗକୁ କେଉଁ ବିପଦ ଆସୁଛି?',
      whatToDoNow: 'ମୁଁ ବର୍ତ୍ତମାନ କ’ଣ କରିବା ଉଚିତ?',
      cropHealth: 'ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ସୂଚକାଙ୍କ',
      waterBalance: 'ମୂଳ କ୍ଷେତ୍ର ଆର୍ଦ୍ରତା',
      activeRiskLevel: 'ସକ୍ରିୟ ବିପଦ ଚାପ',
      marketPrice: 'ଚଳିତ ମଣ୍ଡି ଦର',
      expectedRevenue: 'ଆନୁମାନିକ ନିଟ୍ ଆୟ',
      viewCopilot: 'କୋ-ପାଇଲଟ୍ ପଚାରନ୍ତୁ',
      runSimulation: 'ହ୍ୱାଟ୍-ଇଫ୍ ନିଷ୍ପତ୍ତି ପରଖନ୍ତୁ',
      askAi: 'ସ୍ୱରରେ କୁହନ୍ତୁ କିମ୍ବା ଲେଖନ୍ତୁ...',
    },
  },
};
