import React, { useContext } from 'react'
import { CoinContext } from '../../context/CoinContext'
import { Link } from 'react-router-dom'

const Portfolio = () => {
  const { portfolio, balance, currency, allCoin } = useContext(CoinContext);

  // Cross-reference live coin arrays to map portfolio assets with actual current valuations
  const portfolioSummary = portfolio.map(hold => {
    const liveCoin = allCoin.find(c => c.id === hold.id);
    const livePrice = liveCoin ? liveCoin.current_price : hold.avgBuyPrice;
    const currentValuation = hold.qty * livePrice;
    const totalCost = hold.qty * hold.avgBuyPrice;
    const netProfitLoss = currentValuation - totalCost;
    const profitLossPercentage = totalCost > 0 ? (netProfitLoss / totalCost) * 100 : 0;

    return { ...hold, livePrice, currentValuation, netProfitLoss, profitLossPercentage };
  });

  const aggregateAssetValuation = portfolioSummary.reduce((acc, curr) => acc + curr.currentValuation, 0);
  const totalNetWorth = aggregateAssetValuation + balance;

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', color: '#fff', minHeight: '80vh' }}>
      
      {/* Metrics Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#111827', border: '1px solid #1f2937', padding: '20px', borderRadius: '12px' }}>
          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '5px' }}>Total Portfolio Net Worth</p>
          <h2 style={{ color: '#818cf8' }}>{currency.symbol}{totalNetWorth.toLocaleString(undefined, {maximumFractionDigits: 2})}</h2>
        </div>
        <div style={{ background: '#111827', border: '1px solid #1f2937', padding: '20px', borderRadius: '12px' }}>
          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '5px' }}>Liquid Cash Balance</p>
          <h2>{currency.symbol}{balance.toLocaleString(undefined, {maximumFractionDigits: 2})}</h2>
        </div>
        <div style={{ background: '#111827', border: '1px solid #1f2937', padding: '20px', borderRadius: '12px' }}>
          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '5px' }}>Invested Asset Capital</p>
          <h2>{currency.symbol}{aggregateAssetValuation.toLocaleString(undefined, {maximumFractionDigits: 2})}</h2>
        </div>
      </div>

      {/* Asset Breakdown Layout */}
      <h3 style={{ marginBottom: '20px', color: '#818cf8' }}>Active Positions Breakdown</h3>
      {portfolioSummary.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: '#111827', borderRadius: '12px', color: '#6b7280' }}>
          Your asset portfolio layout is currently empty. Visit the markets panel to deploy capital!
        </div>
      ) : (
        <div style={{ background: '#111827', borderRadius: '12px', overflowX: 'auto', border: '1px solid #1f2937' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1f2937', color: '#9ca3af', fontSize: '14px' }}>
                <th style={{ padding: '15px' }}>Asset</th>
                <th style={{ padding: '15px' }}>Holdings Qty</th>
                <th style={{ padding: '15px' }}>Avg Cost Basis</th>
                <th style={{ padding: '15px' }}>Current Price</th>
                <th style={{ padding: '15px' }}>Current Value</th>
                <th style={{ padding: '15px' }}>Net Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {portfolioSummary.map(coin => (
                <tr key={coin.id} style={{ borderBottom: '1px solid #1f2937', fontSize: '14px' }}>
                  <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={coin.image} alt="" style={{ width: '24px', height: '24px' }} />
                    <Link to={`/coin/${coin.id}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: '600' }}>
                      {coin.name} <span style={{ color: '#6b7280', fontSize: '12px' }}>{coin.symbol?.toUpperCase()}</span>
                    </Link>
                  </td>
                  <td style={{ padding: '15px' }}>{coin.qty}</td>
                  <td style={{ padding: '15px' }}>{currency.symbol}{coin.avgBuyPrice.toLocaleString()}</td>
                  <td style={{ padding: '15px' }}>{currency.symbol}{coin.livePrice.toLocaleString()}</td>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{currency.symbol}{coin.currentValuation.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                  <td style={{ padding: '15px', color: coin.netProfitLoss >= 0 ? '#10b981' : '#ef4444', fontWeight: '500' }}>
                    {coin.netProfitLoss >= 0 ? '+' : ''}{coin.netProfitLoss.toLocaleString(undefined, {maximumFractionDigits: 2})} ({coin.profitLossPercentage.toFixed(2)}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Portfolio