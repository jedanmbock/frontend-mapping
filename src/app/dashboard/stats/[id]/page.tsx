'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { mapApi } from '@/services/api';
import { ArrowLeft, Printer, BarChart3, TrendingUp } from 'lucide-react';
import Loader from '@/components/UI/Loader';
import EvolutionChart from '@/components/Dashboard/charts/EvolutionChart';
import ComparisonChart from '@/components/Dashboard/charts/ComparisonChart';
import EvolutionSection from '@/components/Dashboard/charts/EvolutionSection';

export default function StatsReportPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const fetchAllStats = async () => {
      try {
        const [global, evol, comp] = await Promise.all([
            mapApi.get('/api/stats/global', { params: { zone_id: id } }),
            mapApi.get('/api/stats/evolution', { params: { zone_id: id } }),
            mapApi.get('/api/stats/comparison', { params: { zone_id: id } })
        ]);
        setStats({ global: global.data, evolution: evol.data, comparison: comp.data });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAllStats();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader size="lg"/></div>;
  if (!stats) return <div className="h-screen flex items-center justify-center">Données indisponibles</div>;

  // --- CORRECTION BUG VISUEL 1 : HAUTEUR DYNAMIQUE ---
  // Si on a beaucoup de sous-zones, on agrandit le graphique
  // 40px par barre, avec un minimum de 350px
  const comparisonHeight = Math.max(350, (stats.comparison?.length || 0) * 40);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-2 transition-colors">
              <ArrowLeft size={16} /> Retour
            </button>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Rapport : <span className="text-blue-600">{stats?.global?.zone_name}</span>
            </h1>
          </div>
          <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex gap-2 items-center print:hidden">
            <Printer size={16} /> Imprimer
          </button>
        </header>

        {/* Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Colonne de Gauche : KPI & Liste Exhaustive */}
            <aside className="lg:col-span-1 space-y-6">
                
                {/* KPI Unique (Volume) */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5">
                    <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm text-gray-500 font-medium">Volume Total Produit</h3>
                        <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                            {stats?.global?.total_volume?.toLocaleString()} <span className="text-lg font-normal text-gray-400">T</span>
                        </p>
                    </div>
                </div>

                {/* LISTE EXHAUSTIVE (Tableau scrollable) */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[600px]">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                            <TrendingUp size={18} className="text-orange-500"/> 
                            Production par Filière
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Liste complète des productions</p>
                    </div>
                    
                    <div className="overflow-y-auto flex-1 p-0 custom-scrollbar">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Filière</th>
                                    <th className="px-4 py-3 text-right">Volume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {stats?.global?.top_products?.map((prod: any, i: number) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{prod.name}</td>
                                        <td className="px-4 py-3 text-right font-bold text-gray-700 dark:text-gray-300">
                                            {prod.volume.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">{prod.unit}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </aside>

            {/* Colonne de Droite : Graphiques */}
            <section className="lg:col-span-2 space-y-8">
                
                {/* GRAPHIQUE 1 : ÉVOLUTION */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">
                        Evolution Temporelle
                    </h3>
                    
                    {/* APPEL DU NOUVEAU COMPOSANT */}
                    <EvolutionSection data={stats.evolution} />
                    
                </div>

                {/* GRAPHIQUE 2 : COMPARAISON (Hauteur Dynamique) */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Distribution par Sous-zone</h3>
                    <p className="text-sm text-gray-400 mb-6">Volume cumulé de la filière principale</p>
                    
                    {/* -- CORRECTION : On applique la hauteur calculée ici -- */}
                    <div style={{ height: `${comparisonHeight}px` }} className="w-full transition-all duration-300">
                        <ComparisonChart comparisonData={stats.comparison} />
                    </div>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
}