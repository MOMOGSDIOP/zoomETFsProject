import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default function ETFChart({ data }) {
    const chartData = {
        labels: data.labels,  // Dates
        datasets: [{
            label: 'Performance (1 an)',
            data: data.values,  // Prix
            borderColor: '#3e95cd',
            tension: 0.1,
            fill: true
        }]
    };

    return (
        <div className="chart-container">
            <Line 
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: { mode: 'index' }
                    }
                }}
            />
        </div>
    );
}