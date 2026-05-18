import React, { useMemo } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'

const LineChart = ({ historicalData }) => {
  
  // Wrap data parsing in useMemo to prevent performance heavy re-renders
  const chartData = useMemo(() => {
    if (!historicalData || !historicalData.prices) return [];
    
    return historicalData.prices.map((item) => {
      const date = new Date(item[0]);
      
      // If data points are dense (e.g., 24h lookback), show time. Otherwise, show dates.
      const isShortTimeframe = historicalData.prices.length <= 30;
      const label = isShortTimeframe 
        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString([], { month: 'short', day: 'numeric' });

      return {
        Time: label,
        Price: item[1]
      };
    });
  }, [historicalData]);

  if (chartData.length === 0) {
    return <div style={{ color: '#6b7280', textAlign: 'center', paddingTop: '50px' }}>No historic metrics available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
        <defs>
          {/* Sleek theme color opacity fade down drop */}
          <linearGradient id="cryptoGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
          </linearGradient>
        </defs>
        
        <XAxis 
          dataKey="Time" 
          stroke="#4b5563" 
          fontSize={11} 
          tickLine={false} 
          dy={10}
        />
        
        <YAxis 
          stroke="#4b5563" 
          fontSize={11} 
          tickLine={false} 
          domain={['auto', 'auto']}
          tickFormatter={(val) => 
            val >= 1e6 ? `$${(val / 1e6).toFixed(1)}M` :
            val >= 1e3 ? `$${(val / 1e3).toFixed(1)}K` : `$${val.toFixed(2)}`
          }
        />
        
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#111827', 
            borderColor: '#374151', 
            borderRadius: '8px', 
            color: '#fff',
            fontSize: '13px'
          }}
          itemStyle={{ color: '#818cf8' }}
          labelStyle={{ color: '#9ca3af', fontWeight: '500' }}
        />
        
        <Area 
          type="monotone" 
          dataKey="Price" 
          stroke="#6366f1" 
          strokeWidth={2} 
          fillOpacity={1} 
          fill="url(#cryptoGradient)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default LineChart