import React, { useState, useEffect } from 'react';
import { getTransactions, getStatistics, getBarChartData, getPieChartData } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [month, setMonth] = useState('March');
  const [data, setData] = useState({
    transactions: [],
    statistics: null,
    barChart: [],
    pieChart: []
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transactions, statistics, barData, pieData] = await Promise.all([
          getTransactions(month, '', 1, 10),
          getStatistics(month),
          getBarChartData(month),
          getPieChartData(month)
        ]);

        setData({
          transactions,
          statistics,
          barChart: barData,
          pieChart: pieData
        });
      } catch (error) {
        console.log('Data loading error:', error);
      }
    };

    loadData();
  }, [month]);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Price Range Distribution'
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Categories Distribution'
      }
    }
  };

  const barData = {
    labels: data.barChart.map(item => item.range),
    datasets: [{
      label: 'Number of Items',
      data: data.barChart.map(item => item.count),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
  };

  const pieData = {
    labels: data.pieChart.map(item => item.category),
    datasets: [{
      data: data.pieChart.map(item => item.count),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]
    }]
  };

  return (
    <div className="dashboard">
      <h1>Sales Dashboard</h1>
      
      <select value={month} onChange={(e) => setMonth(e.target.value)}>
        {['January', 'February', 'March', 'April', 'May', 'June', 
          'July', 'August', 'September', 'October', 'November', 'December'
        ].map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      {data.statistics && (
        <div className="statistics">
          <h2>Statistics - {month}</h2>
          <p>Total Sale Amount: ${data.statistics.totalSaleAmount?.toFixed(2)}</p>
          <p>Total Sold Items: {data.statistics.totalSoldItems}</p>
          <p>Total Not Sold Items: {data.statistics.totalNotSoldItems}</p>
        </div>
      )}

      <div className="charts">
        <div className="chart-container">
          <Bar options={barOptions} data={barData} />
        </div>
        <div className="chart-container">
          <Pie options={pieOptions} data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;