'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { mapApi } from '@/services/api';
import { ArrowLeft, Printer, TrendingUp, Users, BarChart3 } from 'lucide-react';
import Loader from '@/components/UI/Loader';
import EvolutionChart from '@/components/Dashboard/charts/EvolutionChart';
import ComparisonChart from '@/components/Dashboard/charts/ComparisonChart';

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

  const getEvolutionTitle = () => {
    if (!stats?.evolution?.data || stats.evolution.data.length === 0) {
      return "Évolution de la Production";
    }
    const data = stats.evolution.data;
    // On suppose que les données sont triées par le backend, sinon :
    const years = data.map((d: any) => d.year);
    const min = Math.min(...years);
    const max = Math.max(...years);
    
    if (min === max) return `Production en ${min}`;
    return `Évolution de la Production (${min}-${max})`;
  };

  if (loading) {
      return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center">
            <Loader size="lg"/>
            <p className="mt-4 text-gray-600 dark:text-gray-300 animate-pulse">Chargement du rapport...</p>
          </div>
      );
  }

  if (!stats) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">Aucune donnée trouvée pour ce rapport.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-2">
              <ArrowLeft size={16} /> Retour à la carte
            </button>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Rapport pour <span className="text-blue-600">{stats?.global?.zone_name}</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Analyse détaillée de la production agricole, de l'élevage et de la pêche.
            </p>
          </div>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors self-start sm:self-center">
            <Printer size={16} /> Imprimer
          </button>
        </header>

        {/* Grille de stats */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Colonne de gauche (KPIs) */}
            <aside className="lg:col-span-1 space-y-6">
                <KPICard icon={<BarChart3 />} title="Volume de Production Total" value={`${stats?.global?.total_volume?.toLocaleString() ?? 0} T`} color="blue" />
                <KPICard icon={<Users />} title="Producteurs Enregistrés" value={stats?.global?.total_producers?.toLocaleString() ?? 0} color="green" />

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white flex items-center gap-2"><TrendingUp size={20} className="text-orange-500"/> Productions Principales</h3>
                    <ul className="space-y-3">
                        {stats?.global?.top_products?.map((prod: any, i: number) => (
                            <li key={i} className="flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-700 dark:text-gray-300">{prod.name}</span>
                                <span className="font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                    {prod.volume.toLocaleString()} {prod.unit}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Colonne de droite (Graphiques) */}
            <section className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 h-[300px] sm:h-[350px]">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{getEvolutionTitle()}</h3>
                    <EvolutionChart evolutionData={stats.evolution} />
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 h-[300px] sm:h-[350px]">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Répartition par Sous-zone (Top Produit)</h3>
                    <ComparisonChart comparisonData={stats.comparison} />
                </div>
            </section>
        </main>
      </div>
    </div>
  );
}

// Composant pour les cartes KPI
const KPICard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string, color: 'blue' | 'green' }) => {
    const colors = {
        blue: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
        green: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
    }
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5">
            <div className={`p-4 rounded-full ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{value}</p>
            </div>
        </div>
    );
};