import React, { useContext, useEffect, useState } from 'react'
import './Home.css'
import { CoinContext } from '../../context/CoinContext'
import { Link } from 'react-router-dom'

const Home = () => {
  const { allCoin = [], currency = { name: "usd", symbol: "$" } } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState('');

  const inputHandler = (event) => {
    const value = event.target.value;
    setInput(value);
    if (value === "") {
      setDisplayCoin(Array.isArray(allCoin) ? allCoin : []);
    }
  }

  const searchHandler = async (event) => {
    event.preventDefault();
    if (!Array.isArray(allCoin)) return;

    const coins = allCoin.filter((item) => {
      return item?.name?.toLowerCase().includes(input.toLowerCase());
    })
    setDisplayCoin(coins);
  }

// Safely sync context data with your display state without triggering infinite updates
  useEffect(() => {
    if (Array.isArray(allCoin) && allCoin.length > 0) {
      setDisplayCoin(allCoin);
    }
  }, [allCoin]);

  return (
    <div className='home'>
      <div className="hero">
        <h1>Next-Gen <br/> Crypto Intelligence</h1>
        <p>Welcome to NovaMint. Analyze trends, track assets, and explore global crypto markets in real-time.</p>
        
        <form onSubmit={searchHandler}>
          <input 
            onChange={inputHandler} 
            list='coinlist' 
            value={input} 
            type="text" 
            placeholder='Search crypto..' 
            required
          />

          <datalist id='coinlist'>
            {Array.isArray(allCoin) && allCoin.map((item, index) => (
              <option key={index} value={item?.name || ''}/>
            ))}
          </datalist>

          <button type="submit">Search</button>
        </form>
      </div>

      <div className="crypto-table">
        <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{textAlign:"center"}}>24H Change</p>
          <p className='market-cap'>Market Cap</p>
        </div>
        {
          Array.isArray(displayCoin) && displayCoin.length > 0 ? (
            displayCoin.slice(0, 10).map((item, index) => (
              <Link to={`/coin/${item?.id}`} className="table-layout" key={index}>
                <p>{item?.market_cap_rank}</p>
                <div>
                  <img src={item?.image} alt="" />
                  <p>{(item?.name || '') + " - " + (item?.symbol || '').toUpperCase()}</p>
                </div>
                <p>{currency?.symbol} {item?.current_price?.toLocaleString()}</p>
                <p className={(item?.price_change_percentage_24h || 0) > 0 ? "green" : "red"}>
                  {Math.floor((item?.price_change_percentage_24h || 0) * 100) / 100}%
                </p>
                <p className='market-cap'>{currency?.symbol} {item?.market_cap?.toLocaleString()}</p>
              </Link>
            ))
          ) : (
            <div className="table-layout" style={{ gridTemplateColumns: "1fr", textAlign: "center", padding: "20px" }}>
              <p>Loading market data from CoinGecko...</p>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home