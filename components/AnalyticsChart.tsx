import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DATA = [
  { name: 'Mon', views: 120 },
  { name: 'Tue', views: 150 },
  { name: 'Wed', views: 200 },
  { name: 'Thu', views: 180 },
  { name: 'Fri', views: 250 },
  { name: 'Sat', views: 300 },
  { name: 'Sun', views: 280 },
];

export const AnalyticsChart: React.FC = () => {
  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={DATA}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#9CA3AF' }} 
            dy={10}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: 'none', 
              borderRadius: '8px', 
              color: 'white',
              fontSize: '12px'
            }}
          />
          <Bar dataKey="views" radius={[4, 4, 0, 0]}>
            {DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === DATA.length - 1 ? '#4F46E5' : '#E5E7EB'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-center text-gray-400 mt-2">Total views this week: 1,480</p>
    </div>
  );
};
