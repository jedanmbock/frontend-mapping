'use client';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { DivisionLevel } from '@/types';

interface NavigationHistory {
  level: DivisionLevel;
  parentId: number | null;
  name: string;
}

interface MapNavigationProps {
  history: NavigationHistory[];
  currentZoneName: string;
  onBack: () => void;
  onReset: () => void;
}

const MapNavigation = ({ history, currentZoneName, onBack, onReset }: MapNavigationProps) => {
  return (
    <div className="flex flex-col space-y-4">
      {/* Indicateur Visuel de Position */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Position Actuelle
        </div>

        <h2 className="text-xl font-bold text-gray-800 dark:text-white truncate">
          {currentZoneName}
        </h2>

        {/* Fil d'Ariane (Breadcrumbs) */}
        <nav className="flex items-center flex-wrap gap-1 mt-3 text-sm text-gray-500 dark:text-gray-400">
          <button
            onClick={onReset}
            className="hover:text-blue-600 transition-colors flex items-center"
          >
            <Home size={14} className="mr-1" /> Cameroun
          </button>

          {history.map((step, index) => (
            <div key={index} className="flex items-center gap-1">
              <ChevronRight size={14} />
              <span className="max-w-[100px] truncate">{step.name}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Boutons d'Action Rapide */}
      {history.length > 0 && (
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-all"
        >
          <ArrowLeft size={16} />
          Retour au niveau précédent
        </button>
      )}
    </div>
  );
};

export default MapNavigation;
