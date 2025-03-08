const API_BASE_URL = 'http://localhost:5000/api';

const fetchData = async () => {
  try {
    setIsLoading(true);
    const [statsRes, barRes, pieRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/statistics?month=${month}`),
      axios.get(`${API_BASE_URL}/bar-chart?month=${month}`),
      axios.get(`${API_BASE_URL}/pie-chart?month=${month}`)
    ]);

    setStatistics(statsRes.data);
    setBarData({
      labels: barRes.data.map(item => item.range),
      datasets: [{
        label: 'Number of Items',
        data: barRes.data.map(item => item.count),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }]
    });

    setPieData({
      labels: pieRes.data.map(item => item.category),
      datasets: [{
        data: pieRes.data.map(item => item.count),
        backgroundColor: generateColors(pieRes.data.length)
      }]
    });
  } catch (error) {
    console.error('API Error:', error);
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};