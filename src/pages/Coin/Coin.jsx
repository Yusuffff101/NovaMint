import React, { useContext, useEffect, useState } from 'react'
import './Coin.css'
import { useParams } from 'react-router-dom'
import { CoinContext } from '../../context/CoinContext';
import LineChart from '../../components/LineChart/LineChart';

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const { currency, API_KEY } = useContext(CoinContext);
  
  // Track timeline window selection: 1 day, 7 days, 30 days, or 365 days
  const [days, setDays] = useState(7);

  const fetchCoinData = async () => {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': API_KEY }
    };
    
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setCoinData(data);
    } catch (err) {
      console.error("Error fetching coin metadata:", err);
    }
  }

  const fetchHistoricalData = async () => {
    // Dynamically inject standard lookup windows. 
    // Dropped strict daily flags so 1-day windows query clean hourly details automatically
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=${days}`;
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': API_KEY }
    };
    
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setHistoricalData(data);
    } catch (err) {
      console.error("Error fetching line string metrics:", err);
    }
  }

  // Trigger data reload automatically whenever currency or lookback parameters shift
  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  }, [currency, days]);

  if (coinData && historicalData) {
    return (
      <div className='coin'>
        <div className="coin-name">
          <img src={coinData.image?.large} alt={coinData.name} />
          <p><b>{coinData.name} ({coinData.symbol?.toUpperCase()})</b></p>
        </div>

        {/* Timeline Toggle Navigation Button Array */}
        <div className="timeline-wrapper" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '25px' }}>
          {[
            { label: '24H', value: 1 },
            { label: '7D', value: 7 },
            { label: '30D', value: 30 },
            { label: '1Y', value: 365 }
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={() => setDays(btn.value)}
              style={{
                background: days === btn.value ? '#6366f1' : '#1e1b4b',
                color: '#fff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'all 0.2s ease'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="coin-chart" style={{ height: '320px', width: '100%', maxWidth: '700px', margin: 'auto' }}>
          <LineChart historicalData={historicalData} />
        </div>

        <div className="coin-info">
          <ul>
            <li>Crypto Market Rank</li>
            <li>#{coinData.market_cap_rank}</li>
          </ul>
          <ul>
            <li>Current Price</li>
            <li>{currency.symbol} {coinData.market_data?.current_price?.[currency.name]?.toLocaleString()}</li>
          </ul>
          <ul>
            <li>Market Cap</li>
            <li>{currency.symbol} {coinData.market_data?.market_cap?.[currency.name]?.toLocaleString()}</li>
          </ul>
          <ul>
            <li>24 Hour High</li>
            <li>{currency.symbol} {coinData.market_data?.high_24h?.[currency.name]?.toLocaleString()}</li>
          </ul>
          <ul>
            <li>24 Hour Low</li>
            <li>{currency.symbol} {coinData.market_data?.low_24h?.[currency.name]?.toLocaleString()}</li>
          </ul>
        </div>
      </div>
    )
  } else {
    return (
      <div className='spinner'>
        <div className="spin"></div>
      </div>
    )
  }
}

export default Coin