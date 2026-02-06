'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-bold text-gray-900 dark:text-white">{payload[0].payload.name}</p>
          <p className="text-sm text-blue-600">{`Volume: ${payload[0].value.toLocaleString()} T`}</p>
        </div>
      );
    }
    return null;
};

export default function ComparisonChart({ comparisonData }: { comparisonData: any[] }) {
    if (!comparisonData || comparisonData.length === 0) {
      return <div className="text-center p-10 text-gray-500">Aucune sous-zone à comparer.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(240, 240, 240, 0.2)' }}/>
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}