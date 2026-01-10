'use client';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { Sun, Moon, LogOut, Map as MapIcon, ChevronRight, Home, Layers } from 'lucide-react';
import { NavigationState } from '@/types';
import { useTranslations } from 'next-intl';

interface SidebarProps {
  currentView: NavigationState;
  history: NavigationState[];
  hoveredZone: string | null;
  onJumpToHistory: (index: number) => void;
  onReset: () => void;
}

export default function Sidebar({ currentView, history, hoveredZone, onJumpToHistory, onReset }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const { logout, user } = useAuth();
  const t = useTranslations('Map');

  return (
    <aside className="w-80 flex-shrink-0 z-20 bg-white dark:bg-gray-900 shadow-2xl flex flex-col border-r border-gray-100 dark:border-gray-800 transition-colors duration-300">

      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-green-500 to-blue-600 p-2 rounded-lg text-white shadow-md">
            <MapIcon size={20} />
          </div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            CamerAgro
          </h1>
        </div>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Contenu */}
      <div className="p-6 flex-1 overflow-y-auto space-y-8">

        {/* User Card */}
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Compte</p>
          <p className="font-semibold text-gray-800 dark:text-white truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>

        {/* Navigation Hiérarchique (Breadcrumb) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('location')}</span>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            {/* Titre de la zone actuelle */}
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              {currentView.name}
            </h2>

            {/* Fil d'Ariane */}
            <nav className="flex flex-wrap items-center gap-1 text-sm">

              {/* 1. Racine (Cameroun) */}
              <button
                onClick={onReset}
                className={`flex items-center transition-colors ${
                  history.length === 0
                    ? 'font-bold text-blue-600 dark:text-blue-400 cursor-default'
                    : 'text-gray-500 dark:text-gray-400 hover:text-blue-600'
                }`}
                disabled={history.length === 0}
              >
                <Home size={14} className="mr-1" />
                Cameroun
              </button>

              {/* 2. Historique (Parents intermédiaires) */}
              {history.map((step, index) => {
                // CORRECTION : On masque l'étape "REGION" (qui correspond à la vue Cameroun)
                // pour éviter le doublon avec le bouton Home.
                if (step.level === 'REGION') return null;

                return (
                  <div key={index} className="flex items-center animate-in fade-in slide-in-from-left-2 duration-300">
                    <ChevronRight size={14} className="mx-1 text-gray-300" />
                    <button
                      onClick={() => onJumpToHistory(index)}
                      className="hover:text-blue-600 hover:underline transition-colors text-gray-500 dark:text-gray-400 font-medium"
                    >
                      {step.name}
                    </button>
                  </div>
                );
              })}

              {/* 3. Vue Actuelle (Si ce n'est pas le Cameroun) */}
              {currentView.name !== 'Cameroun' && (
                <div className="flex items-center animate-in fade-in slide-in-from-left-2 duration-300">
                  <ChevronRight size={14} className="mx-1 text-gray-300" />
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {currentView.name}
                  </span>
                </div>
              )}
            </nav>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inspection</span>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-blue-500">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-0.5">Zone survolée</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {hoveredZone || "Aucune sélection"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
        >
          <LogOut size={18} />
          {t('logout')}
        </button>
      </div>
    </aside>
  );
}
