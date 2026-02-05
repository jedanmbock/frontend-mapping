'use client';
import { useEffect, useState } from 'react';
import { X, TrendingUp, Users, BarChart2, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { mapApi } from '@/services/api';
import Loader from '../UI/Loader';
import { useRouter } from 'next/navigation';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts';

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  zoneId: number | null;
  zoneName: string;
  level: string;
}

export default function RightPanel({ isOpen, onClose, zoneId, zoneName, level }: RightPanelProps) {
  const t = useTranslations('Stats');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [evolutionData, setEvolutionData] = useState<any>(null);
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && zoneId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [resGlobal, resEvol, resComp] = await Promise.all([
            mapApi.get('/api/stats/global', { params: { zone_id: zoneId } }),
            mapApi.get('/api/stats/evolution', { params: { zone_id: zoneId } }),
            mapApi.get('/api/stats/comparison', { params: { zone_id: zoneId } })
          ]);

          setGlobalStats(resGlobal.data);
          setEvolutionData(resEvol.data);
          setComparisonData(resComp.data);
        } catch (error) {
          console.error("Error fetching panel stats", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, zoneId]);

  if (!isOpen) return null;

  // Couleurs pour les graphiques
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="absolute top-4 right-4 z-[1000] w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-right-10 fade-in duration-300">

      {/* Header */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{zoneName}</h3>
          <p className="text-xs text-gray-500 uppercase font-bold">{level}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center py-10"><Loader /></div>
        ) : (
          <>
            {/* 1. Top Productions */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <TrendingUp size={16} /> Productions Principales
              </h4>
              <div className="space-y-2">
                {globalStats?.top_products?.map((prod: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      <span className="text-sm font-medium">{prod.name}</span>
                    </div>
                    <span className="text-sm font-bold">{prod.volume.toLocaleString()} <span className="text-[10px] text-gray-500">{prod.unit}</span></span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Comparaison (Enfants) */}
            {comparisonData.length > 0 && (
              <div className="h-48">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <BarChart2 size={16} /> Comparaison {level === 'REGION' ? 'Départementale' : 'Communale'}
                </h4>
                <p className="text-[10px] text-gray-400 mb-2">Volume du produit principal</p>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <XAxis dataKey="name" hide />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* 3. Evolution */}
            {evolutionData?.data?.length > 0 && (
              <div className="h-56">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Évolution 2021-2024</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionData.data}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="year" style={{ fontSize: '10px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    {evolutionData.sectors.slice(0, 3).map((sector: string, idx: number) => (
                      <Line
                        key={sector}
                        type="monotone"
                        dataKey={sector}
                        stroke={colors[idx % colors.length]}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* 4. Producteurs */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-200">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Producteurs actifs</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {globalStats?.total_producers?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Action */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          onClick={() => router.push(`/dashboard/stats/${zoneId}`)}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
        >
          Voir le rapport complet <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
