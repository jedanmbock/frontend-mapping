'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-bold text-gray-900 dark:text-white">{`Année : ${label}`}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="text-sm">
            {`${p.name}: ${p.value.toLocaleString()} T`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function EvolutionChart({ evolutionData }: { evolutionData: any }) {
  if (!evolutionData || !evolutionData.data || evolutionData.data.length === 0) {
    return <div className="text-center p-10 text-gray-500">Données d'évolution insuffisantes.</div>;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={evolutionData.data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="year" style={{ fontSize: '12px' }} />
        <YAxis style={{ fontSize: '12px' }} tickFormatter={(value) => `${(value / 1000)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        {evolutionData.sectors?.slice(0, 4).map((sector: string, i: number) => (
          <Line key={sector} type="monotone" dataKey={sector} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}