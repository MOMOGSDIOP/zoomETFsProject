import '../../styles/exemple.css';
import React from 'react';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LinearScale, CategoryScale, BarElement, Tooltip, Legend);

// Plugin personnalisé pour afficher les valeurs à l’intérieur des barres
const insideLabelPlugin = {
  id: 'insideLabel',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((bar, index) => {
        const value = Math.abs(dataset.data[index]);
        ctx.save();
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${value}%`, bar.x, bar.y);
        ctx.restore();
      });
    });
  },
};

const Exemple = () => {
  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'];
  const productA = [80, 60, 50, 90, 30, 20];
  const productB = [20, 70, 80, 70, 10, 40];

  const data = {
    labels: options,
    datasets: [
      {
        label: 'Product A',
        data: productA.map(value => -value),
        backgroundColor: '#AF804F',
        borderColor: '#F6E6D1',
        borderWidth: 1,
        barThickness: 20,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
      },
      {
        label: 'Product B',
        data: productB,
        backgroundColor: '#BCA17C',
        borderColor: '#BCA17C',
        borderWidth: 1,
        barThickness: 20,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
      },
    ],
  };

  const config = {
    type: 'bar',
    data,
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: false,
          min: -100,
          max: 100,
          grid: {
            drawTicks: true,
            drawBorder: false,
            color: (ctx) => (ctx.tick.value === 0 ? '#000' : '#e0e0e0'),
            lineWidth: (ctx) => (ctx.tick.value === 0 ? 2 : 1),
          },
          ticks: {
            display: false, // supprime les % en bas
          },
        },
        y: {
          stacked: false,
          position: 'right',
          grid: {
            display: false,
          },
          ticks: {
            mirror: true,
            padding: -10,
            align: 'center',
            font: {
              weight: 'bold',
            },
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${Math.abs(ctx.raw)}%`,
          },
        },
        legend: {
          display: false,
        },
      },
    },
    plugins: [insideLabelPlugin],
  };

  return (
    <div className="chart-container">
      <h2 style={{ textAlign: 'center' }}>Fiche de Comparaison</h2>

      {/* Titres au-dessus des barres */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '0 auto 10px auto',
          maxWidth: '600px',
          padding: '0 40px',
          fontWeight: 'bold',
          fontSize: '16px',
        }}
      >
        <div style={{ textAlign: 'right', width: '25%',color:'#AF804F'}}>Product A</div>
        <div style={{ textAlign: 'left', width: '25%',color:'#BCA17C'}}>Product B</div>
      </div>

      {/* Graphique */}
      <div className="chart-wrapper" style={{ height: '400px' }}>
        <Chart {...config} />
      </div>
    </div>
  );
};

export default Exemple;
