import React, { useState } from 'react';
import {
  Paper, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

import '../styles/ETFList.css';
import etfs from '../data/dataETFsFull';

export default function ETFList({ onSelect, onNavigate, loading }) {
  const [viewMode, setViewMode] = useState('chart'); // 'chart' ou 'list'

  const calculateDailyPerformance = (etf) => (
    ((etf.currentPrice - etf.previousClose) / etf.previousClose) * 100
  );

  const sortedETFs = etfs.filter(etf => etf.currentPrice && etf.previousClose);

  const bestETFs = [...sortedETFs]
    .sort((a, b) => calculateDailyPerformance(b) - calculateDailyPerformance(a))
    .slice(0, 3);

  const worstETFs = [...sortedETFs]
    .sort((a, b) => calculateDailyPerformance(a) - calculateDailyPerformance(b))
    .slice(0, 3);

  const chartData = [
    ...bestETFs.map(etf => ({
      name: etf.name,
      performance: parseFloat(calculateDailyPerformance(etf).toFixed(2)),
    })),
    ...worstETFs.map(etf => ({
      name: etf.name,
      performance: parseFloat(calculateDailyPerformance(etf).toFixed(2)),
    }))
  ];

  const PriceWithArrow = ({ currentPrice, previousClose }) => {
    const perf = calculateDailyPerformance({ currentPrice, previousClose });
    if (perf > 0) return <span>{perf.toFixed(2)} % <ArrowDropUpIcon color="success" /></span>;
    if (perf < 0) return <span>{perf.toFixed(2)} % <ArrowDropDownIcon color="error" /></span>;
    return <span>0.00 %</span>;
  };

  const renderTable = (title, data, viewType) => (
    <Paper className="etf-section" sx={{ padding: 2 }}>
      <Typography
        variant="h6"
        className="etf-title"
        sx={{
          cursor: 'pointer',
          textAlign: 'center',
          marginBottom: 2,
          userSelect: 'none',
        }}
        onClick={() => onNavigate(viewType)}
      >
        {title}
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell align="right">Performance journalière</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(etf => (
              <TableRow
                key={etf.name}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => onSelect(etf.name)}
              >
                <TableCell>{etf.name}</TableCell>
                <TableCell align="right">
                  <PriceWithArrow currentPrice={etf.currentPrice} previousClose={etf.previousClose} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  return (
    <div className="etf-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setViewMode(viewMode === 'chart' ? 'list' : 'chart')}
        >
          {viewMode === 'chart' ? 'Voir en liste' : 'Voir en graphique'}
        </Button>
      </div>

      {viewMode === 'list' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {renderTable('Meilleure performance du jour', bestETFs, 'best')}
          {renderTable('Pire performance du jour', worstETFs, 'worst')}
        </div>
      ) : (
        <Paper className="etf-chart-container">
          <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2 }}>
            Performances journalières des meilleurs et pires ETFs
          </Typography>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 12, height: 12, backgroundColor: '#4caf50', borderRadius: 2 }} />
              <span style={{ fontSize: 14 }}>Meilleures performances</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 12, height: 12, backgroundColor: '#f44336', borderRadius: 2 }} />
              <span style={{ fontSize: 14 }}>Pires performances</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 40, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#555', fontSize: 12 }}
                angle={-15}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: '#555', fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Performance']}
                contentStyle={{ backgroundColor: '#f5f5f5', borderRadius: 8 }}
              />
              <Bar
                dataKey="performance"
                radius={[6, 6, 0, 0]}
                isAnimationActive
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.performance >= 0 ? '#4caf50' : '#f44336'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}
    </div>
  );
}
