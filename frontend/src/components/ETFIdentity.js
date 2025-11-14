import React from 'react';
import { Paper, Typography, Box, Divider, Button, Grid } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar
} from 'recharts';

import etfs from '../data/dataETFsFull';
import ETFExchanges from './etfidentity/ETFExchanges';
import ETFGeneralInfo from './etfidentity/ETFGeneralInfo';
import ETFLegalStructure from './etfidentity/ETFLegalStructure';
import ETFPositions from './etfidentity/ETFPositions';
import ETFRiskChart from './etfidentity/ETFRiskChart';

import '../styles/ETFIdentity.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#A4DE6C'];

export default function ETFIdentity({ name, onBack }) {
  const navigate = useNavigate();
  const theme = useTheme();

  const etf = etfs.find(e => e.name === name);
  if (!etf) {
    return (
      <Paper className="etf-container">
        <Typography variant="h5">ETF introuvable</Typography>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Retour
        </Button>
      </Paper>
    );
  }

  const performance = ((etf.currentPrice - etf.previousClose) / etf.previousClose) * 100;
  const formattedPerformance = performance.toFixed(2) + ' %';

  const PerformanceWithIcon = () => (
    <span className={performance > 0 ? 'perf-positive' : performance < 0 ? 'perf-negative' : ''}>
      {formattedPerformance}
      {performance > 0 && <ArrowDropUpIcon />}
      {performance < 0 && <ArrowDropDownIcon />}
    </span>
  );

  // Données graphiques
  const countryData = etf.positions?.byCountry?.map(item => ({ name: item.country, value: item.percentage })) || [];
  const sectorData = etf.positions?.bySector?.map(item => ({ name: item.sector, value: item.percentage })) || [];
  const positionData = etf.positions?.topAssets?.map(item => ({ name: item.name, value: item.percentage })) || [];

  const returnsData = [
    { name: '1M', value: etf.returns?.monthly || 0 },
    { name: '3M', value: etf.returns?.bimonthly || 0 },
    { name: '6M', value: etf.returns?.quarterly || 0 },
    { name: '1Y', value: etf.returns?.semiAnnual || 0 },
    { name: '3Y', value: etf.returns?.annual || 0 }
  ];

  const riskData = [
    { subject: '30J', value: etf.riskMetrics?.vol30d || 0 },
    { subject: '90J', value: etf.riskMetrics?.vol90d || 0 },
    { subject: '180J', value: etf.riskMetrics?.vol180d || 0 },
    { subject: '1A', value: etf.riskMetrics?.vol1y || 0 }
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 12 }}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="custom-tooltip">
          <p>{`${label} : ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Paper className="etf-container">
      <Box mb={6} className="etf-header" sx={{ backgroundColor: 'transparent' }}>
        <Typography variant="h4" className="etf-title">{etf.name}</Typography>
        <Button className="etf-back-button" onClick={() => onBack()}>
          Retour
        </Button>
      </Box>

      <Divider className="etf-divider" />

      <Box  mb={4}  className="etf-basic-info etf-section" sx={{ backgroundColor: 'transparent' }}>
        <Typography variant="h6">Catégorie : <strong>{etf.category || 'N/A'}</strong></Typography>
        <Typography variant="h6">Prix actuel : <strong>{etf.currentPrice} €</strong></Typography>
        <Typography variant="h6">Clôture précédente : <strong>{etf.previousClose} €</strong></Typography>
        <Typography variant="h6">Performance journalière:  <PerformanceWithIcon /></Typography>
      </Box>


      <Grid container spacing={4} className="etf-section">
  <Grid item xs={12}>
    <Box className="etf-table-section">
      <Typography variant="h6" className="etf-section-title">Informations générales</Typography>
      <table className="etf-info-table">
        <tbody>
          {Object.entries(etf.generalInfo || {}).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  </Grid>
</Grid>


      {/* Performance */}
      <Typography variant="h5" className="etf-section-title">Performance</Typography>
      <Box  mb={4} className="chart-container" sx={{ backgroundColor: 'transparent' }}>
        <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={returnsData} style={{ backgroundColor: 'transparent' }}>
        {/* Suppression du CartesianGrid pour pas de lignes */}
        <XAxis dataKey="name" axisLine={{ stroke: '#ccc' }} tick={{ fill: theme.palette.text.primary }} />
        <YAxis axisLine={false} tick={{ fill: theme.palette.text.primary }} />
        <Tooltip
        content={<CustomTooltip />}
        contentStyle={{ backgroundColor: 'transparent', border: 'none' }}
        cursor={false} // Pas de surbrillance au survol
        />
       <Legend 
        layout="vertical" 
        verticalAlign="middle" 
        align="right" 
        wrapperStyle={{ backgroundColor: 'transparent', paddingLeft: 10 }}
        />

      {/* Dégradé pour l’aire */}
      <defs>
        <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
        </linearGradient>
      </defs>
      
      <Area
        type="monotone"
        dataKey="value"
        stroke="#8884d8"
        fill="url(#colorPerformance)"
        fillOpacity={1}
        dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4, fill: 'white' }} // points visibles
        activeDot={{ r: 6 }}
      />
    </AreaChart>
  </ResponsiveContainer>
      </Box>

      {/* Répartition géographique */}
      <Typography variant="h5" className="etf-section-title">Répartition géographique</Typography>
      <Box  mb={4}  className="chart-container" sx={{ backgroundColor: 'transparent' }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={countryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              dataKey="value"
            >
              {countryData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, 'Part']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Répartition par secteur */}
      <Typography variant="h5" className="etf-section-title">Répartition par secteur</Typography>
      <Box  mb={4} className="chart-container" sx={{ backgroundColor: 'transparent' }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={sectorData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
          >
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={90} />
            <Tooltip />
            <Bar dataKey="value" barSize={20}>
              {sectorData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Top positions */}
      <Typography variant="h5" className="etf-section-title">Top positions</Typography>
      <Box  mb={4} className="chart-container" sx={{ backgroundColor: 'transparent' }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={positionData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              labelLine={false}
              label={renderCustomizedLabel}
              dataKey="value"
            >
              {positionData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, 'Part']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Risque */}
      <Typography variant="h5" className="etf-section-title">Volatilité</Typography>
      <Box  mb={4}  className="chart-container" sx={{ backgroundColor: 'transparent' }}>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={riskData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis domain={[0, 'dataMax + 5']} />
            <Radar name="Volatilité" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.5} />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}