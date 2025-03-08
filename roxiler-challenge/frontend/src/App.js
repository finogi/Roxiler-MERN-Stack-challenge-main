import React, { useState, useEffect } from 'react';
import MonthSelector from './components/MonthSelector';
import TransactionTable from './components/TransactionTable';
import StatisticsBox from './components/StatisticsBox';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import { getTransactions, getStatistics, getBarChartData, getPieChartData } from './services/api';
import './App.css';

function App() {
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [searchText, setSearchText] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Load transactions when month, search, or page changes
  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const result = await getTransactions(selectedMonth, searchText, currentPage, 10);
        setTransactions(result.transactions);
        setTotalPages(Math.ceil(result.total / result.perPage));
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [selectedMonth, searchText, currentPage]);

  // Load statistics, bar chart, and pie chart data when month changes
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load statistics
        const statsData = await getStatistics(selectedMonth);
        setStatistics(statsData);

        // Load bar chart data
        const barData = await getBarChartData(selectedMonth);
        setBarChartData(barData);

        // Load pie chart data
        const pieData = await getPieChartData(selectedMonth);
        setPieChartData(pieData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [selectedMonth]);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setCurrentPage(1);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="app-container">
      <h1>Transaction Dashboard</h1>
      
      <div className="month-search-container">
        <MonthSelector 
          selectedMonth={selectedMonth} 
          onMonthChange={handleMonthChange} 
        />
        <div className="search-container">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchText && (
            <button className="clear-button" onClick={() => handleSearch('')}>
              Clear
            </button>
          )}
        </div>
      </div>
      
      <StatisticsBox statistics={statistics} />
      
      <div className="charts-container">
        <div className="chart-box">
          <h2>Transactions by Price Range</h2>
          <BarChart data={barChartData} />
        </div>
        <div className="chart-box">
          <h2>Transactions by Category</h2>
          <PieChart data={pieChartData} />
        </div>
      </div>
      
      <TransactionTable 
        transactions={transactions}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />
    </div>
  );
}

export default App;
