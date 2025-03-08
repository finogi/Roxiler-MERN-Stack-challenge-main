import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ data }) {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Generate colors dynamically
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137) % 360; // Golden angle approximation for good distribution
      colors.push(`hsla(${hue}, 70%, 60%, 0.7)`);
    }
    return colors;
  };

  const backgroundColors = generateColors(data.length);
  const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));

  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}

export default PieChart;