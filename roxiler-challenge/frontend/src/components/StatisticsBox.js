import React from 'react';

function StatisticsBox({ statistics }) {
  return (
    <div className="statistics-box">
      <h2>Statistics</h2>
      <div className="stats-container">
        <div className="stat-item">
          <h3>Total Sale</h3>
          <p>${statistics.totalSaleAmount ? statistics.totalSaleAmount.toFixed(2) : '0.00'}</p>
        </div>
        <div className="stat-item">
          <h3>Sold Items</h3>
          <p>{statistics.totalSoldItems || 0}</p>
        </div>
        <div className="stat-item">
          <h3>Not Sold Items</h3>
          <p>{statistics.totalNotSoldItems || 0}</p>
        </div>
      </div>
    </div>
  );
}

export default StatisticsBox;