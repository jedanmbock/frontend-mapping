'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, TrendingUp } from 'lucide-react';
import { mapApi } from '@/services/api';
import { ZoneStatDetail, GeoProperties } from '@/types';
import Loader from '../UI/Loader';

interface StatsModalProps {
  zone: GeoProperties | null;
  onClose: () => void;
}

export default function StatsModal({ zone, onClose }: StatsModalProps) {
  const t = useTranslations('Modal');
  const [data, setData] = useState<ZoneStatDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const getSubLevelName = () => {
    if (zone?.level === 'REGION') return 'départements';
    if (zone?.level === 'DEPARTEMENT') return 'arrondissements';
    return 'zones';
  }

  useEffect(() => {
    const fetchData = async () => {
      if (zone) {
        setLoading(true);
        try {
          console.log("Chargement stats modal pour:", zone.id);
          const res = await mapApi.get<ZoneStatDetail[]>('/api/zone/stats', { params: { zone_id: zone.id } });
          console.log("Données reçues:", res.data);
          setData(res.data);
        } catch (err) {
          console.error("Erreur stats zone", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [zone]);

  if (!zone) return null;

  return (
    // pointer-events-auto est important si le parent a pointer-events-none
    <div className="w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[60vh] animate-in slide-in-from-bottom-10 fade-in duration-300 pointer-events-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-blue-600 dark:bg-blue-900">
        <div className="flex items-center gap-2 text-white">
            <TrendingUp size={18} />
            <h2 className="text-sm font-bold truncate max-w-[200px]">
             {zone.name}
            </h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors text-white cursor-pointer">
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="p-0 overflow-y-auto flex-1 bg-white dark:bg-gray-900 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader size="sm" />
          </div>
        ) : data.length === 0 ? (
          // --- CORRECTION DU MESSAGE ICI ---
          <div className="p-6 text-center">
            <div className="mb-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-full inline-block">
                <span className="text-2xl">∅</span>
            </div>
            <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-1">
                Aucune donnée disponible
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
               Il n'y a pas de production enregistrée pour cette filière dans les <strong>{getSubLevelName()}</strong> de {zone.name}.
            </p>
            {zone.level !== 'ARRONDISSEMENT' && (
                <p className="text-[10px] text-gray-400 mt-2 italic">
                    (La production est peut-être comptabilisée au niveau supérieur uniquement)
                </p>
            )}
          </div>
          ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-2 text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{t('sector')}</th>
                <th className="px-4 py-2 text-right text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{t('volume')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {item.sector}
                    <span className="block text-[10px] text-gray-400 font-normal">{item.category}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                    <span className="font-bold">{item.volume.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-500 ml-1">{item.unit}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer info */}
      <div className="p-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 text-center">
          <span className="text-[10px] text-gray-400">Données consolidées 2021-2024</span>
      </div>
    </div>
  );
}
