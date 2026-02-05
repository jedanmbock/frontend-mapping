'use client';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { mapApi } from '@/services/api';
import { Sector } from '@/types';

interface FilterListProps {
  parentId: number | null;
  activeFilter: number | null;
  selectedCategory: string | null;
  onSelectFilter: (id: number | null) => void;
}

export default function FilterList({ parentId, activeFilter, selectedCategory, onSelectFilter }: FilterListProps) {
  const t = useTranslations('Sidebar');
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true);
      try {
        // Construction des paramètres
        // Si parentId est null, on n'envoie pas le paramètre (ou on envoie null),
        // le backend gérera le cas "Pays entier"
        const params: any = {};
        if (parentId) {
            params.parent_id = parentId;
        }

        console.log("📡 Chargement des filtres pour parent_id:", parentId);

        const res = await mapApi.get<Record<string, Sector[]>>('/api/filters', { params });

        const allSectors: Sector[] = [];
        if (res.data) {
            Object.values(res.data).forEach(list => allSectors.push(...list));
        }
        setSectors(allSectors);
      } catch (err) {
        console.error("❌ Erreur chargement filtres:", err);
        setSectors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, [parentId]); // Se déclenche à chaque changement de zone (Drill-down)

  const displayedSectors = selectedCategory
    ? sectors.filter(s => s.category.toUpperCase() === selectedCategory.toUpperCase())
    : sectors;

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 size={24} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (displayedSectors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl">
        <span className="text-2xl mb-2">∅</span>
        <p className="text-xs text-gray-400 font-medium">
          {t('no_data_for_zone')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-10">
      {displayedSectors.map((sector) => {
        let borderClass = 'border-l-gray-400';
        const catUpper = sector.category.toUpperCase();

        if (catUpper.includes('AGRICULTURE')) borderClass = 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10';
        else if (catUpper.includes('ELEVAGE')) borderClass = 'border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10';
        else if (catUpper.includes('PECHE')) borderClass = 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10';

        const isActive = activeFilter === sector.id;

        return (
          <button
            key={sector.id}
            onClick={() => onSelectFilter(isActive ? null : sector.id)}
            className={`
              w-full text-left rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700
              hover:shadow-md hover:scale-[1.02] transition-all duration-200 group relative overflow-hidden
              ${isActive ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900' : 'bg-white dark:bg-gray-800'}
            `}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderClass} rounded-l-xl`}></div>
            <div className="pl-3 flex justify-between items-center">
              <div>
                <h4 className={`font-bold text-sm ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-800 dark:text-white'}`}>
                    {sector.name}
                </h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5 tracking-wider">
                    {t(sector.category.toLowerCase().replace('é', 'e').replace('ê', 'e')) || sector.category}
                </p>
              </div>
              {sector.color && (
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: sector.color }}></div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
