'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { mapApi } from '@/services/api';
import { ArrowLeft, Printer } from 'lucide-react';
import Loader from '@/components/UI/Loader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function StatsReportPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
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
    if (id) fetchAllStats();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader size="lg"/></div>;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600">
            <ArrowLeft /> Retour à la carte
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rapport Statistique Détaillé</h1>
          <button onClick={() => window.print()} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
            <Printer />
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm text-gray-500 uppercase font-bold">Producteurs</h3>
            <p className="text-4xl font-extrabold text-blue-600 mt-2">{stats?.global?.total_producers?.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm text-gray-500 uppercase font-bold">Top Produit</h3>
            <p className="text-4xl font-extrabold text-green-600 mt-2">{stats?.global?.top_products?.[0]?.name || 'N/A'}</p>
            <p className="text-sm text-gray-400">{stats?.global?.top_products?.[0]?.volume?.toLocaleString()} {stats?.global?.top_products?.[0]?.unit}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Evolution */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold mb-6">Évolution de la Production (2021-2024)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.evolution?.data}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {stats?.evolution?.sectors?.slice(0,3).map((s:string, i:number) => (
                    <Bar key={s} dataKey={s} fill={COLORS[i]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Répartition */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold mb-6">Répartition par Sous-zone</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.comparison}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {stats?.comparison?.map((entry:any, index:number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
