import React from 'react';
import { AccumulatorResult, MatchData, AppMode, Ticket } from '../types';
import { Trophy, BarChart2, AlertTriangle, Activity, Radio, ArrowRight, CheckSquare, Hammer, ShieldCheck, BrainCircuit } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface TicketDisplayProps {
  result: AccumulatorResult | null;
}

const MatchCard: React.FC<{ match: MatchData; index: number; mode?: AppMode }> = ({ match, index, mode }) => {
  const isLive = match.isLive || mode === AppMode.LIVE;
  const borderColor = isLive ? 'border-red-500' : 'border-emerald-500';
  const accentColor = isLive ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400';

  return (
    <div className={`relative bg-gray-50 dark:bg-slate-800/50 border-l-4 ${borderColor} p-4 rounded-r-lg mb-4 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors group border-t border-r border-b border-gray-200 dark:border-slate-700/50`}>
      
      <div className="absolute top-2 right-2 flex items-center gap-2">
        {isLive && (
          <span className="flex items-center gap-1 text-[10px] font-bold bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full animate-pulse">
            <Radio className="w-3 h-3" /> LIVE
          </span>
        )}
        <div className="text-xs font-mono text-gray-500 dark:text-slate-500">
          {isLive ? (match.matchTime || 'In Play') : match.startTime}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className={`text-xs ${accentColor} font-bold uppercase tracking-wider mb-1 flex items-center gap-2`}>
             {mode === AppMode.LIVE ? <Activity className="w-3 h-3" /> : <span>Leg {index + 1}</span>}
             • {match.league} • {match.country}
          </div>
          
          <div className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
            <span>{match.homeTeam}</span>
            {isLive && match.currentScore ? (
              <span className="bg-white dark:bg-slate-950 px-2 py-0.5 rounded text-red-600 dark:text-red-500 font-mono border border-gray-200 dark:border-slate-700">
                {match.currentScore}
              </span>
            ) : (
              <span className="text-gray-400 dark:text-slate-500 text-sm">vs</span>
            )}
            <span>{match.awayTeam}</span>
          </div>
          
          <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="px-2 py-1 bg-gray-200 dark:bg-slate-700 rounded text-xs text-gray-600 dark:text-slate-300 font-medium">{match.market}</span>
              <span className="text-sm text-gray-500 dark:text-slate-400 italic border-l-2 border-gray-300 dark:border-slate-600 pl-2">
                "{match.reasoning}"
              </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2 min-w-[100px] border-t sm:border-t-0 border-gray-200 dark:border-slate-700/50 pt-3 sm:pt-0">
          <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-slate-400 uppercase">Prediction</div>
              <div className={`${accentColor} font-bold`}>{match.prediction}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 px-3 py-1 rounded border border-gray-200 dark:border-slate-700 text-center min-w-[60px]">
               <div className="text-[10px] text-gray-400 dark:text-slate-500 uppercase">Odds</div>
               <div className="font-mono font-bold text-gray-900 dark:text-white">{match.odds.toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      {/* Confidence Bar */}
      <div className="mt-3 w-full bg-gray-200 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${match.confidence > 80 ? (isLive ? 'bg-red-500' : 'bg-emerald-500') : match.confidence > 60 ? 'bg-amber-500' : 'bg-gray-400 dark:bg-slate-500'}`} 
          style={{ width: `${match.confidence}%` }}
        ></div>
      </div>
    </div>
  );
};

const TicketCard: React.FC<{ ticket: Ticket; mode?: AppMode; index: number; selectedMarkets?: string[] }> = ({ ticket, mode, index, selectedMarkets }) => {
  const isLiveMode = mode === AppMode.LIVE;
  const isBetBuilder = mode === AppMode.BET_BUILDER;
  
  const potentialReturn = (ticket.totalOdds * 10).toFixed(2); 
  const winProbability = Math.min(95, Math.max(5, 100 / ticket.totalOdds)); 
  
  const chartData = [
    { name: 'Win', value: winProbability },
    { name: 'Loss', value: 100 - winProbability },
  ];

  const headerGradient = isLiveMode 
    ? 'bg-gradient-to-r from-red-800 to-slate-900 dark:from-red-900/80 dark:to-slate-900' 
    : isBetBuilder 
      ? 'bg-gradient-to-r from-indigo-700 to-slate-900 dark:from-indigo-900/80 dark:to-slate-900'
      : 'bg-gradient-to-r from-emerald-700 to-slate-900 dark:from-emerald-900/40 dark:to-slate-900';

  const totalOddsColor = isLiveMode ? 'text-red-600 dark:text-red-400' : isBetBuilder ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400';
  const chartColor = isLiveMode ? '#ef4444' : isBetBuilder ? '#6366f1' : '#10b981';

  return (
    <div className="flex flex-col lg:flex-row gap-8 mb-12 animate-fade-in-up border-b-2 border-dashed border-gray-200 dark:border-slate-800 pb-12 last:border-0 last:pb-0 last:mb-0">
      {/* Main Ticket */}
      <div className="flex-1">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-2xl transition-colors duration-300">
          {/* Ticket Header */}
          <div className={`${headerGradient} p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center`}>
              <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded text-white font-bold text-sm w-8 h-8 flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-lg leading-tight">
                      {ticket.name}
                    </h2>
                    <div className="text-xs text-white/70 flex items-center gap-2">
                       {isLiveMode ? 'Live Scanner' : isBetBuilder ? 'Bet Builder' : `${ticket.matches.length}-Fold Accumulator`}
                    </div>
                  </div>
              </div>
              <span className="text-xs font-mono text-white/70 dark:text-slate-500 hidden sm:block">ID: {ticket.id}</span>
          </div>

          {/* Bet Builder Summary Section */}
          {isBetBuilder && selectedMarkets && selectedMarkets.length > 0 && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 border-b border-indigo-100 dark:border-indigo-900/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                 <div className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                   <Hammer className="w-3 h-3" /> Builder Configuration
                 </div>
                 <div className="flex flex-wrap gap-2">
                   {selectedMarkets.map(m => (
                     <span key={m} className="text-xs bg-white dark:bg-indigo-950 text-indigo-600 dark:text-indigo-200 px-2 py-1 rounded border border-indigo-200 dark:border-indigo-800 font-medium shadow-sm">
                       {m}
                     </span>
                   ))}
                 </div>
              </div>
              <div className="flex items-center gap-3 pl-0 sm:pl-4 border-l-0 sm:border-l border-indigo-200 dark:border-indigo-800">
                 <div className="text-right">
                   <div className="text-[10px] text-indigo-600 dark:text-indigo-300 font-bold uppercase">Combined Odds</div>
                   <div className="text-xl font-mono font-bold text-gray-900 dark:text-white">{ticket.totalOdds.toFixed(2)}</div>
                 </div>
              </div>
            </div>
          )}

          {/* Matches List */}
          <div className="p-6 bg-white dark:bg-slate-900 transition-colors duration-300">
              {ticket.matches.map((match, idx) => (
                  <MatchCard key={idx} match={match} index={idx} mode={mode} />
              ))}
          </div>

          {/* Ticket Footer / Totals */}
          <div className="bg-gray-50 dark:bg-slate-950 p-6 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="text-sm text-gray-600 dark:text-slate-400 max-w-md">
                      <p className="mb-2 font-bold text-emerald-600 dark:text-emerald-400 text-xs uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Ruthless Analysis Protocol:
                      </p>
                      <p className="italic text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-800">
                        "{ticket.analysisSummary}"
                      </p>
                  </div>
                  <div className="flex gap-8">
                      {!isBetBuilder && (
                        <div className="text-center">
                            <div className="text-gray-500 dark:text-slate-500 text-xs uppercase font-bold mb-1">Total Odds</div>
                            <div className={`text-3xl font-mono font-bold ${totalOddsColor}`}>{ticket.totalOdds.toFixed(2)}</div>
                        </div>
                      )}
                      {!isLiveMode && (
                        <div className="text-center">
                            <div className="text-gray-500 dark:text-slate-500 text-xs uppercase font-bold mb-1">Est. Return ($10)</div>
                            <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white">${potentialReturn}</div>
                        </div>
                      )}
                  </div>
              </div>
          </div>
        </div>
      </div>

      {/* Sidebar Stats */}
      <div className="lg:w-80 space-y-6">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 transition-colors duration-300 shadow-lg">
              <h3 className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" /> {isLiveMode ? 'Momentum Score' : 'Mathematical Edge'}
              </h3>
              <div className="h-48 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          startAngle={90}
                          endAngle={-270}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell key="cell-0" fill={chartColor} stroke="none" />
                          <Cell key="cell-1" fill="var(--bg-chart-track)" className="fill-gray-200 dark:fill-slate-700" stroke="none" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{winProbability.toFixed(1)}%</span>
                    </div>
              </div>
              <div className="text-center text-xs text-gray-500 dark:text-slate-500 mt-2">
                  {isLiveMode ? 'Based on in-play stats' : 'Implied Probability Calculation'}
              </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl transition-colors duration-300">
              <div className="flex items-start gap-3">
                  <BrainCircuit className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800 dark:text-amber-200/80 leading-relaxed">
                      <strong>Core Principle:</strong> Ruthless Discipline. Do not chase losses. This selection is based on cold-blooded value, not emotion.
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

const TicketDisplay: React.FC<TicketDisplayProps> = ({ result }) => {
  if (!result || !result.tickets || result.tickets.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-emerald-500" />
          Generated Options ({result.tickets.length})
        </h3>
      </div>
      {result.tickets.map((ticket, idx) => (
        <TicketCard 
          key={ticket.id} 
          ticket={ticket} 
          mode={result.mode} 
          index={idx}
          selectedMarkets={result.selectedMarkets}
        />
      ))}
    </div>
  );
};

export default TicketDisplay;