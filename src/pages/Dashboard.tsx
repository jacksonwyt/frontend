import React, { useState, useEffect, type ReactElement } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ArrowUpIcon } from '@heroicons/react/solid';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  change_24h: number;
  score: number;
}

interface WebSocketData {
  data: MarketData[];
}

const getCSRFToken = (): string | null => {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1] || '';
  return csrfToken;
};

const Dashboard = (): ReactElement => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/market-data', {
          withCredentials: true,
          headers: {
            'X-CSRF-Token': getCSRFToken()
          }
        });
        setMarketData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching market data:', error);
        setLoading(false);
      }
    };
    fetchData();

    // Get WebSocket auth token from the server
    const getWsToken = async () => {
      try {
        const response = await axios.get('/api/ws-token', {
          withCredentials: true,
          headers: { 'X-CSRF-Token': getCSRFToken() }
        });
        return response.data.token;
      } catch (error) {
        console.error('Error getting WebSocket token:', error);
        return null;
      }
    };

    let ws: WebSocket | null = null;
    
    const connectWebSocket = async () => {
      const token = await getWsToken();
      if (!token) return;

      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
      ws = new WebSocket(wsUrl, token);
      
      ws.onmessage = (event) => {
        try {
          const data: WebSocketData = JSON.parse(event.data);
          setMarketData(data.data);
        } catch (error) {
          console.error('Error parsing WebSocket data:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const chartData = {
    labels: marketData.map((d: MarketData) => d.symbol),
    datasets: [{
      label: 'Profit Score',
      data: marketData.map((d: MarketData) => d.score),
      borderColor: '#00ff99',
      backgroundColor: 'rgba(0, 255, 153, 0.1)',
      tension: 0.4,
      pointRadius: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      }
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="space-y-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-800/30 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                  Crypto Intelligence
                </h1>
                <p className="mt-4 text-xl text-gray-400">Powered by advanced AI predictions</p>
              </motion.div>

              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-16"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {marketData.slice(0, 3).map((coin: MarketData, index: number) => (
                    <motion.div
                      key={coin.symbol}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-20" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-2xl font-medium">{coin.symbol.toUpperCase()}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            coin.change_24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {coin.change_24h >= 0 ? '+' : ''}{coin.change_24h.toFixed(2)}%
                          </span>
                        </div>
                        <div className="space-y-3">
                          <p className="text-3xl font-bold text-white">
                            ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <div className="flex justify-between text-gray-400">
                            <span>Volume</span>
                            <span>{coin.volume.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>AI Score</span>
                            <span className="font-medium text-emerald-400">{coin.score.toFixed(3)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8"
              >
                <h2 className="text-2xl font-semibold mb-8 flex items-center">
                  Market Trends
                  <ArrowUpIcon className="h-5 w-5 ml-2 text-emerald-400" />
                </h2>
                <div className="h-[400px]">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </motion.section>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Dashboard;
