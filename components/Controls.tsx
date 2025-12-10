import React from 'react';
import { SportType, RiskLevel, AppMode } from '../types';
import { Target, TrendingUp, Layers, Radio, Clock, Hammer, CheckSquare } from 'lucide-react';

interface ControlsProps {
  mode: AppMode;
  setMode: (m: AppMode) => void;
  sport: SportType;
  setSport: (s: SportType) => void;
  risk: RiskLevel;
  setRisk: (r: RiskLevel) => void;
  legs: number;
  setLegs: (n: number) => void;
  selectedMarkets: string[];
  setSelectedMarkets: (m: string[]) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const AVAILABLE_MARKETS = [
  "Over 2.5 Goals",
  "Both Teams to Score",
  "Corner Handicaps",
  "Player Shots/Goals",
  "Card/Booking Points",
  "Half-Time Result",
  "Double Chance",
  "Asian Handicap"
];

const Controls: React.FC<ControlsProps> = ({
  mode,
  setMode,
  sport,
  setSport,
  risk,
  setRisk,
  legs,
  setLegs,
  selectedMarkets,
  setSelectedMarkets,
  onGenerate,
  isLoading
}) => {

  const toggleMarket = (market: string) => {
    if (selectedMarkets.includes(market)) {
      setSelectedMarkets(selectedMarkets.filter(m => m !== market));
    } else {
      setSelectedMarkets([...selectedMarkets, market]);
    }
  };

  const getButtonGradient = () => {
    if (isLoading) return 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-slate-400 cursor-not-allowed';
    switch (mode) {
      case AppMode.LIVE:
        return 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-red-500/20 hover:shadow-red-500/40';
      case AppMode.BET_BUILDER:
        return 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20 hover:shadow-indigo-500/40';
      default:
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/20 hover:shadow-emerald-500/40';
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Searching Global Markets...';
    switch (mode) {
      case AppMode.LIVE: return 'Scan Live Opportunities';
      case AppMode.BET_BUILDER: return 'Build Smart Bets';
      default: return 'Find 24h Opportunities';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden transition-colors duration-300">
      
      {/* Mode Tabs */}
      <div className="flex border-b border-gray-200 dark:border-slate-700">
        <button
          onClick={() => setMode(AppMode.ACCUMULATOR)}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors
            ${mode === AppMode.ACCUMULATOR 
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500' 
              : 'bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50'}`}
        >
          <Clock className="w-4 h-4" />
          <span className="hidden sm:inline">24h Accumulator</span>
          <span className="sm:hidden">Acca</span>
        </button>
        <button
          onClick={() => setMode(AppMode.BET_BUILDER)}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors
            ${mode === AppMode.BET_BUILDER 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' 
              : 'bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50'}`}
        >
          <Hammer className="w-4 h-4" />
          <span className="hidden sm:inline">Bet Builder</span>
          <span className="sm:hidden">Builder</span>
        </button>
        <button
          onClick={() => setMode(AppMode.LIVE)}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors
            ${mode === AppMode.LIVE 
              ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-500 border-b-2 border-red-500' 
              : 'bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50'}`}
        >
          <Radio className="w-4 h-4" />
          <span className="hidden sm:inline">Live Scanner</span>
          <span className="sm:hidden">Live</span>
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          {/* Sport Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Sport
            </label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value as SportType)}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-3 transition-colors"
              disabled={isLoading}
            >
              {Object.values(SportType).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Risk Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Strategy
            </label>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value as RiskLevel)}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-3 transition-colors"
              disabled={isLoading}
            >
              {Object.values(RiskLevel).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Third Column: Varies by Mode */}
          {mode === AppMode.LIVE ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-500 dark:text-cyan-400" /> 
                Matches to Spot
              </label>
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2 transition-colors">
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={legs}
                  onChange={(e) => setLegs(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                  disabled={isLoading}
                />
                <span className="font-mono font-bold w-8 text-center text-red-600 dark:text-red-400">{legs}</span>
              </div>
            </div>
          ) : mode === AppMode.BET_BUILDER ? (
             <div className="space-y-2 md:col-span-3 lg:col-span-1">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> 
                Focus Markets
              </label>
              <div className="text-xs text-gray-500 dark:text-slate-500 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-300 dark:border-slate-700 italic">
                Select markets below to customize your builder.
              </div>
             </div>
          ) : (
            <div className="flex items-center justify-center p-4 text-xs text-gray-500 dark:text-slate-500 italic border border-dashed border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-900/50">
              AI will generate 6 variations automatically.
            </div>
          )}
        </div>

        {/* Bet Builder Market Selection Grid */}
        {mode === AppMode.BET_BUILDER && (
          <div className="mb-6 space-y-3 animate-fade-in-up">
            <label className="text-sm font-bold text-gray-800 dark:text-white">Select Preferred Markets:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AVAILABLE_MARKETS.map(market => (
                <button
                  key={market}
                  onClick={() => toggleMarket(market)}
                  className={`text-xs py-2 px-3 rounded-lg border transition-all duration-200 font-medium
                    ${selectedMarkets.includes(market)
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-indigo-300'
                    }`}
                >
                  {market}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onGenerate}
          disabled={isLoading}
          className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${getButtonGradient()}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching Global Markets...
            </span>
          ) : (
            getButtonText()
          )}
        </button>
      </div>
    </div>
  );
};

export default Controls;