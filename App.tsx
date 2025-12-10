import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import TicketDisplay from './components/TicketDisplay';
import SourceList from './components/SourceList';
import HistoryPanel from './components/HistoryPanel';
import { generatePredictions } from './services/geminiService';
import { SportType, RiskLevel, AccumulatorResult, SourceLink, AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.ACCUMULATOR);
  const [sport, setSport] = useState<SportType>(SportType.FOOTBALL);
  const [risk, setRisk] = useState<RiskLevel>(RiskLevel.BALANCED);
  const [legs, setLegs] = useState<number>(5);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]); // For Bet Builder
  
  const [result, setResult] = useState<AccumulatorResult | null>(null);
  const [sources, setSources] = useState<SourceLink[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<AccumulatorResult[]>([]);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      // Check local storage first
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      // Default to dark if system prefers dark or no preference found
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // History Load Effect with Migration Logic
  useEffect(() => {
    const savedHistory = localStorage.getItem('accaHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Migration: Convert old flat matches to tickets
        const migrated = parsed.map((item: any) => {
          if (!item.tickets && item.matches) {
            return {
              ...item,
              tickets: [{
                id: 'legacy-' + item.id,
                name: item.mode === AppMode.LIVE ? 'Live Scan Results' : 'Accumulator (Legacy)',
                matches: item.matches,
                totalOdds: item.totalOdds,
                analysisSummary: item.analysisSummary
              }]
            };
          }
          return item;
        });
        setHistory(migrated);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const saveToHistory = (newResult: AccumulatorResult, newSources: SourceLink[]) => {
    // Embed sources into result for self-contained history items
    const historyItem: AccumulatorResult = { ...newResult, sources: newSources };
    
    const updatedHistory = [historyItem, ...history].slice(0, 12); // Keep last 12
    setHistory(updatedHistory);
    localStorage.setItem('accaHistory', JSON.stringify(updatedHistory));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSources([]);

    try {
      const response = await generatePredictions(mode, sport, risk, legs, selectedMarkets);
      setResult(response.data);
      setSources(response.sources);
      saveToHistory(response.data, response.sources);
    } catch (err: any) {
      setError(err.message || "Failed to generate predictions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (item: AccumulatorResult) => {
    setResult(item);
    setSources(item.sources || []);
    if (item.mode) setMode(item.mode);
    if (item.sport) setSport(item.sport);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHistoryDelete = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('accaHistory', JSON.stringify(updatedHistory));
  };

  const handleHistoryClear = () => {
    if (window.confirm('Are you sure you want to clear all scan history?')) {
      setHistory([]);
      localStorage.removeItem('accaHistory');
    }
  };

  return (
    <div className="min-h-screen pb-6 bg-gray-100 dark:bg-[#0f172a] transition-colors duration-300 flex flex-col">
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-grow w-full">
        {/* Hero / Intro */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
            {mode === AppMode.ACCUMULATOR ? 'Build Your Winning Streak' : 
             mode === AppMode.BET_BUILDER ? 'Smart Market Architect' : 
             'Live Market Scanner'}
          </h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors duration-300">
            {mode === AppMode.ACCUMULATOR && "Gemini AI now generates multiple strategy options for you. Choose between high-volume, balanced, or high-value power plays."}
            {mode === AppMode.BET_BUILDER && "Select your preferred markets (e.g. Goals, Corners) and let AI build high-value combinations from just a few games."}
            {mode === AppMode.LIVE && "Scan active matches globally in real-time to find momentum shifts, undervalue favorites, and high-confidence live opportunities."}
          </p>
        </div>

        <Controls 
          mode={mode}
          setMode={setMode}
          sport={sport}
          setSport={setSport}
          risk={risk}
          setRisk={setRisk}
          legs={legs}
          setLegs={setLegs}
          selectedMarkets={selectedMarkets}
          setSelectedMarkets={setSelectedMarkets}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />

        {error && (
          <div className="mt-6 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/50 text-red-800 dark:text-red-200 p-4 rounded-lg text-center transition-colors duration-300">
            {error}
          </div>
        )}

        <TicketDisplay result={result} />
        
        {result && <SourceList sources={sources} />}

        <HistoryPanel 
          history={history} 
          onSelect={handleHistorySelect} 
          onDelete={handleHistoryDelete}
          onClear={handleHistoryClear}
        />
        
        <footer className="mt-16 border-t border-gray-200 dark:border-slate-800 py-8 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
               &copy; {new Date().getFullYear()} AariNAT Company Limited
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-500 mb-6">
               All rights reserved. Engineered for Ruthless Efficiency.
            </p>
            
            <div className="text-[10px] text-gray-400 dark:text-slate-600 leading-relaxed border-t border-gray-200 dark:border-slate-800 pt-4">
              <strong className="block mb-1">DISCLAIMER & RESPONSIBLE GAMBLING</strong>
              KingBayo Money Empire is an information and analytics tool provided by AariNAT Company Limited. It does not guarantee winnings. 
              Sports betting involves high risk and you may lose money. 
              This application is not a gambling platform and does not accept bets. 
              Please gamble responsibly and only with money you can afford to lose. 
              If you or someone you know has a gambling problem, please seek help from relevant authorities in your jurisdiction.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;