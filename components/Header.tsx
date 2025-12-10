import React from 'react';
import { Zap, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6 text-white dark:text-slate-900 fill-current" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
            KingBayo Money Empire
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-xs font-mono text-gray-500 dark:text-slate-400 hidden sm:block border-r border-gray-300 dark:border-slate-700 pr-4">
            POWERED BY GEMINI 2.5 FLASH
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;