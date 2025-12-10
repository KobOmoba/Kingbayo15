import React from 'react';
import { AccumulatorResult, AppMode } from '../types';
import { Clock, Radio, Trash2, ArrowRight, Calendar, Layers, Download } from 'lucide-react';

interface HistoryPanelProps {
  history: AccumulatorResult[];
  onSelect: (item: AccumulatorResult) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onDelete, onClear }) => {
  if (history.length === 0) return null;

  const downloadCSV = () => {
    if (history.length === 0) return;

    // Define CSV Headers
    const headers = ['ID', 'Date', 'Mode', 'Sport', 'Ticket Name', 'Matches', 'Total Odds', 'Analysis'];
    
    // Process rows
    const rows = history.flatMap(item => {
      return (item.tickets || []).map(ticket => {
        const matchDetails = ticket.matches.map(m => `${m.homeTeam} vs ${m.awayTeam} (${m.prediction} @ ${m.odds})`).join(' | ');
        return [
          item.id,
          new Date(item.generatedAt).toLocaleString(),
          item.mode,
          item.sport,
          ticket.name,
          `"${matchDetails}"`, // Quote to handle commas in text
          ticket.totalOdds.toFixed(2),
          `"${ticket.analysisSummary.replace(/"/g, '""')}"` // Escape quotes
        ].join(',');
      });
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kingbayo_history_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-12 border-t border-gray-200 dark:border-slate-800 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" /> Recent Scans
        </h3>
        <div className="flex gap-4">
          <button
            onClick={downloadCSV}
            className="text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors font-medium"
          >
            <Download className="w-3 h-3" /> Export CSV
          </button>
          <button
            onClick={onClear}
            className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            Clear History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item) => {
          const isLive = item.mode === AppMode.LIVE;
          const date = new Date(item.generatedAt);
          const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
          
          // Determine display odds (max odds of any ticket)
          const maxOdds = item.tickets 
            ? Math.max(...item.tickets.map(t => t.totalOdds)) 
            : (item as any).totalOdds || 0; // Fallback for old data

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-lg transition-all duration-200 group relative overflow-hidden"
            >
              {/* Side color strip */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${isLive ? 'bg-red-500' : 'bg-emerald-500'}`} />

              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLive ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {isLive ? <Radio className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                    {item.mode === AppMode.LIVE ? 'Live Scan' : 'Accumulator'}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-slate-500 mt-1">{item.sport || 'Mixed Sports'}</span>
                </div>
                <div className="text-right">
                   <div className="text-xs text-gray-400 dark:text-slate-500">ID: {item.id}</div>
                   <div className="text-xs font-mono font-medium text-gray-600 dark:text-slate-400">{dateStr} • {timeStr}</div>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase text-gray-500 dark:text-slate-500 font-bold">
                    {item.tickets?.length > 1 ? 'Max Odds' : 'Total Odds'}
                  </div>
                  <div className="text-xl font-mono font-bold text-gray-900 dark:text-white">
                    {maxOdds.toFixed(2)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                   {item.tickets?.length > 1 && (
                     <span className="text-[10px] bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-gray-500 dark:text-slate-400 flex items-center gap-1">
                       <Layers className="w-3 h-3" /> {item.tickets.length} Vars
                     </span>
                   )}
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSelect(item)}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-xs font-medium text-gray-900 dark:text-white rounded-lg transition-colors"
                  >
                    Load <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryPanel;