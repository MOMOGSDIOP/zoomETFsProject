import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ETFRiskChart({ data }) {
  const formattedData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#2196f3" />
      </BarChart>
    </ResponsiveContainer>
  );
}
