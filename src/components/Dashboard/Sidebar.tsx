'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Map as MapIcon, ArrowLeft, Sprout, Fish, User, Moon, Sun, Languages } from 'lucide-react';
import { NavigationState, GlobalStats } from '@/types';
import { useTranslations } from 'next-intl';
import FilterList from './FilterList';
import { useTheme } from '@/context/ThemeContext';

interface SidebarProps {
  currentView: NavigationState;
  history: NavigationState[];
  hoveredZone: string | null;
  onJumpToHistory: (index: number) => void;
  onReset: () => void;
  onSelectFilter: (sectorId: number | null) => void;
  activeFilter: number | null;
  globalStats: GlobalStats | null;
}

export default function Sidebar({
  currentView,
  history,
  onJumpToHistory,
  onReset,
  onSelectFilter,
  activeFilter,
}: SidebarProps) {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('Sidebar');
  const tApp = useTranslations('App');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (cat: string) => {
    if (selectedCategory === cat) setSelectedCategory(null);
    else setSelectedCategory(cat);
  };

  const handleBack = () => {
    if (history.length > 0) {
      onJumpToHistory(history.length - 1);
    } else {
      onReset();
    }
  };

  const getLevelLabel = () => {
    if (!currentView.parentId) return "PAYS";
    if (currentView.level === 'DEPARTEMENT') return "RÉGION";
    if (currentView.level === 'ARRONDISSEMENT') return "DÉPARTEMENT";
    return currentView.level;
  };

  return (
    <aside className="w-80 flex-shrink-0 z-20 bg-white dark:bg-gray-950 shadow-2xl flex flex-col border-r border-gray-100 dark:border-gray-800 h-screen font-sans">

      {/* HEADER */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20">
            <MapIcon size={24} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white leading-none tracking-tight">
              {tApp('title')}
            </h1>
            <span className="text-xs text-gray-400 font-medium">{tApp('subtitle')}</span>
          </div>
        </div>
      </div>

      {/* CONTENU */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 space-y-6">
        {/* Zone Actuelle */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 relative overflow-hidden">
            <div className="absolute right-[-10px] bottom-[-10px] text-gray-200 dark:text-gray-800 opacity-50 pointer-events-none">
                <MapIcon size={80} />
            </div>
            <div className="flex justify-between items-start mb-2 relative z-10">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {t('current_zone')}
                </span>
                {(history.length > 0 || currentView.name !== 'Cameroun') && (
                    <button onClick={handleBack} className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 px-2 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer">
                        <ArrowLeft size={12} /> {t('return')}
                    </button>
                )}
            </div>
            <div className="relative z-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-1 truncate">
                    {currentView.name}
                </h2>
                <span className="inline-block px-2 py-0.5 border border-gray-200 dark:border-gray-700 rounded text-[10px] font-bold text-gray-500 uppercase bg-white dark:bg-gray-800">
                    {getLevelLabel()}
                </span>
            </div>
        </div>

        {/* Filtres */}
        <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('category_filters')}</h3>
            <div className="space-y-2">
                <CategoryButton label={t('agriculture')} icon={<Sprout size={20}/>} isActive={selectedCategory === 'AGRICULTURE'} onClick={() => handleCategoryClick('AGRICULTURE')} />
                <CategoryButton label={t('elevage')} icon={<User size={20}/>} isActive={selectedCategory === 'ELEVAGE'} onClick={() => handleCategoryClick('ELEVAGE')} />
                <CategoryButton label={t('peche')} icon={<Fish size={20}/>} isActive={selectedCategory === 'PECHE'} onClick={() => handleCategoryClick('PECHE')} />
            </div>
        </div>

        {/* Bassins */}
        <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('production_basins')}</h3>
            <p className="text-[10px] text-gray-400 italic mb-4">{t('click_instruction')}</p>
            <FilterList parentId={currentView.parentId} activeFilter={activeFilter} selectedCategory={selectedCategory} onSelectFilter={onSelectFilter} />
        </div>
      </div>

      {/* FOOTER (Settings & User) */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 space-y-4">
        {/* Toggles */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600"></div>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 flex items-center gap-1">
                <Languages size={18} /> <span className="text-xs font-bold">FR</span>
            </button>
        </div>

        {/* User */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-emerald-800 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user?.firstName?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 dark:text-white">{user?.firstName || 'User'}</span>
                    <span className="text-[10px] text-gray-500 font-medium">Connecté</span>
                </div>
            </div>
            <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={20} />
            </button>
        </div>
      </div>
    </aside>
  );
}

function CategoryButton({ label, icon, isActive, onClick }: { label: string, icon: React.ReactNode, isActive: boolean, onClick: () => void }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${isActive ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300 hover:shadow-sm'}`}>
            <span className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{icon}</span>
            <span className="font-bold text-sm">{label}</span>
        </button>
    );
}
