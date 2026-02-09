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

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

export default function EvolutionChart({ evolutionData }: { evolutionData: any }) {
  if (!evolutionData || !evolutionData.data || evolutionData.data.length === 0) {
    return <div className="text-center p-10 text-gray-500">Données d'évolution insuffisantes.</div>;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        data={evolutionData.data} 
        // 1. Augmenter la marge du bas pour laisser place à la légende
        margin={{ top: 10, right: 30, left: 0, bottom: 40 }} 
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
        <XAxis dataKey="year" axisLine={false} tickLine={false} dy={10} />
        <YAxis axisLine={false} tickLine={false} tickFormatter={(val)=> val >= 1000 ? `${(val/1000).toFixed(0)}k` : val} />
        <Tooltip content={<CustomTooltip />} />
        
        {/* 2. Positionner la légende en bas avec un wrapperStyle pour l'espacement */}
        <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ paddingTop: "20px" }} // Espace entre le graph et la légende
        />
        
        {evolutionData.sectors?.map((sector: string, i: number) => (
          <Line 
            key={sector} 
            type="monotone" 
            dataKey={sector} 
            stroke={COLORS[i % COLORS.length]} 
            strokeWidth={COLORS[i % COLORS.length]} 
            dot={false}
            activeDot={{ r: 6 }} 
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}