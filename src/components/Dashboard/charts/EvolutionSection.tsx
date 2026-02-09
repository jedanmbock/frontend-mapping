'use client';
import { useState, useMemo, useEffect } from 'react';
import { Sprout, Fish, PawPrint, CheckSquare, Square } from 'lucide-react';
import EvolutionChart from '../charts/EvolutionChart';

interface EvolutionSectionProps {
  data: any; // Données brutes de l'API
}

// Mapping des icônes et couleurs par catégorie
const TABS = [
  { id: 'AGRICULTURE', label: 'Agriculture', icon: <Sprout size={18} />, color: 'text-green-600', bg: 'bg-green-100' },
  { id: 'ELEVAGE', label: 'Élevage', icon: <PawPrint size={18} />, color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 'PECHE', label: 'Pêche', icon: <Fish size={18} />, color: 'text-blue-600', bg: 'bg-blue-100' },
];

export default function EvolutionSection({ data }: EvolutionSectionProps) {
  const [activeTab, setActiveTab] = useState<string>('AGRICULTURE');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  // 1. Filtrer les filières disponibles pour l'onglet actif
  const availableSectors = useMemo(() => {
    if (!data?.categories) return [];
    return Object.keys(data.categories).filter(
      sector => data.categories[sector] === activeTab
    );
  }, [data, activeTab]);

  // 2. Quand on change d'onglet, on sélectionne tout par défaut (ou les 5 premiers si trop nombreux)
  useEffect(() => {
    setSelectedSectors(availableSectors);
  }, [availableSectors]);

  // Gestion des cases à cocher
  const toggleSector = (sector: string) => {
    setSelectedSectors(prev => 
      prev.includes(sector) 
        ? prev.filter(s => s !== sector) 
        : [...prev, sector]
    );
  };

  const toggleAll = () => {
    if (selectedSectors.length === availableSectors.length) {
      setSelectedSectors([]);
    } else {
      setSelectedSectors(availableSectors);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* --- ONGLETS --- */}
      <div className="flex gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-t-xl font-bold text-sm transition-all
              ${activeTab === tab.id 
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}
            `}
          >
            <span className={activeTab === tab.id ? tab.color : ''}>{tab.icon}</span>
            {tab.label}
            {/* Badge de compteur */}
            <span className="ml-1 text-[10px] bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded-full shadow-sm">
                {data?.categories ? Object.values(data.categories).filter((c:any) => c === tab.id).length : 0}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* --- GRAPHIQUE (75% largeur) --- */}
        <div className="flex-1 min-h-[350px] relative">
           {selectedSectors.length > 0 ? (
               <EvolutionChart 
                 evolutionData={{
                   data: data.data,
                   sectors: selectedSectors // On passe seulement les secteurs cochés
                 }} 
               />
           ) : (
               <div className="absolute inset-0 flex items-center justify-center text-gray-400 italic">
                   Sélectionnez au moins une filière
               </div>
           )}
        </div>

        {/* --- FILTRES (25% largeur) --- */}
        <div className="w-full lg:w-48 shrink-0 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl max-h-[350px] overflow-y-auto custom-scrollbar border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-bold text-gray-500 uppercase">Filières</span>
                <button onClick={toggleAll} className="text-[10px] text-blue-600 font-bold hover:underline">
                    {selectedSectors.length === availableSectors.length ? 'Aucun' : 'Tout'}
                </button>
            </div>
            
            <div className="space-y-1">
                {availableSectors.length === 0 && <p className="text-xs text-gray-400 text-center py-4">Aucune donnée</p>}
                
                {availableSectors.map(sector => {
                    const isChecked = selectedSectors.includes(sector);
                    return (
                        <button
                            key={sector}
                            onClick={() => toggleSector(sector)}
                            className={`
                                w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors
                                ${isChecked ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white font-medium' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}
                            `}
                        >
                            {isChecked 
                                ? <CheckSquare size={14} className="text-blue-500 shrink-0" /> 
                                : <Square size={14} className="text-gray-400 shrink-0" />}
                            <span className="truncate text-left">{sector}</span>
                        </button>
                    )
                })}
            </div>
        </div>
      </div>
    </div>
  );
}