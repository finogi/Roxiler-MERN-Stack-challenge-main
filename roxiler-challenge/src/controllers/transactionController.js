const axios = require('axios');

let transactionsData = [];

// Initialize data from JSON endpoint
const initializeData = async () => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    transactionsData = response.data.map(transaction => ({
      ...transaction,
      dateOfSale: new Date(transaction.dateOfSale)
    }));
    return true;
  } catch (error) {
    console.error('Data initialization error:', error);
    return false;
  }
};

// Initialize DB with seed data
exports.initializeDB = async (req, res) => {
  try {
    const success = await initializeData();
    if (success) {
      res.status(200).json({ message: 'Database initialized successfully' });
    } else {
      throw new Error('Failed to initialize data');
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize database', details: error.message });
  }
};

// Get all transactions
exports.listTransactions = async (req, res) => {
  try {
    const { month = '', search = '', page = 1, perPage = 10 } = req.query;
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;

    let filtered = transactionsData.filter(transaction => 
      new Date(transaction.dateOfSale).getMonth() + 1 === monthNumber
    );

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.price.toString().includes(search)
      );
    }

    const total = filtered.length;
    const start = (page - 1) * perPage;
    const end = start + Number(perPage);
    const paginatedData = filtered.slice(start, end);

    return res.json({
      transactions: paginatedData,
      total,
      page: Number(page),
      perPage: Number(perPage)
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Statistics API
exports.getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;
    
    const monthData = transactionsData.filter(transaction => 
      new Date(transaction.dateOfSale).getMonth() + 1 === monthNumber
    );

    const stats = {
      totalSaleAmount: monthData.reduce((sum, item) => sum + item.price, 0),
      totalSoldItems: monthData.filter(item => item.sold).length,
      totalNotSoldItems: monthData.filter(item => !item.sold).length
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bar Chart API
exports.getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;
    
    const monthData = transactionsData.filter(transaction => 
      new Date(transaction.dateOfSale).getMonth() + 1 === monthNumber
    );

    const ranges = [
      { range: '0-100', min: 0, max: 100 },
      { range: '101-200', min: 101, max: 200 },
      { range: '201-300', min: 201, max: 300 },
      { range: '301-400', min: 301, max: 400 },
      { range: '401-500', min: 401, max: 500 },
      { range: '501-600', min: 501, max: 600 },
      { range: '601-700', min: 601, max: 700 },
      { range: '701-800', min: 701, max: 800 },
      { range: '801-900', min: 801, max: 900 },
      { range: '901-above', min: 901, max: Infinity }
    ];

    const result = ranges.map(range => ({
      range: range.range,
      count: monthData.filter(item => 
        item.price >= range.min && item.price <= range.max
      ).length
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pie Chart API
exports.getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;
    
    const monthData = transactionsData.filter(transaction => 
      new Date(transaction.dateOfSale).getMonth() + 1 === monthNumber
    );

    const categoryData = Object.entries(
      monthData.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {})
    ).map(([category, count]) => ({ category, count }));

    res.status(200).json(categoryData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Combined Data API
exports.getCombinedData = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: 'Month parameter is required' });
    }

    const monthNumber = new Date(`${month} 1`).getMonth() + 1;
    const monthData = transactionsData.filter(transaction => 
      new Date(transaction.dateOfSale).getMonth() + 1 === monthNumber
    );

    const statistics = {
      totalSaleAmount: monthData.reduce((sum, item) => sum + item.price, 0),
      totalSoldItems: monthData.filter(item => item.sold).length,
      totalNotSoldItems: monthData.filter(item => !item.sold).length
    };

    const barChart = getBarChartData(month);
    const pieChart = getPieChartData(month);

    res.status(200).json({
      statistics,
      barChart,
      pieChart
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Initialize data when the server starts
initializeData();
