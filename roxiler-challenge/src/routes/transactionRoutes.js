const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Initialize database
router.get('/initialize', transactionController.initializeDB);

// List transactions with search and pagination
router.get('/transactions', transactionController.listTransactions);

// Statistics for the selected month
router.get('/statistics', transactionController.getStatistics);

// Bar chart data
router.get('/bar-chart', transactionController.getBarChartData);

// Pie chart data
router.get('/pie-chart', transactionController.getPieChartData);

// Combined data
router.get('/combined-data', transactionController.getCombinedData);

module.exports = router;
