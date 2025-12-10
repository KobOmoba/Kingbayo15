import React from 'react';
import { SourceLink } from '../types';
import { Link } from 'lucide-react';

interface SourceListProps {
  sources: SourceLink[];
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (sources.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <h4 className="text-sm font-semibold text-gray-600 dark:text-slate-400 mb-3 flex items-center gap-2">
        <Link className="w-3 h-3" /> Verified Sources
      </h4>
      <div className="flex flex-wrap gap-3">
        {sources.map((source, idx) => (
          <a
            key={idx}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 px-3 py-1.5 rounded-full transition-colors truncate max-w-xs border border-gray-200 dark:border-slate-700"
          >
            {source.title || new URL(source.url).hostname}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SourceList;