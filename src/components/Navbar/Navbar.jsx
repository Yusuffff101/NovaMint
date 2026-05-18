import React, { useContext } from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import arrow_icon from '../../assets/arrow_icon.png'
import { CoinContext } from '../../context/CoinContext'
import { Link } from 'react-router-dom'

const Navbar = () => {

  const { setCurrency } = useContext(CoinContext)

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "usd": {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
      case "eur": {
        setCurrency({ name: "eur", symbol: "€" });
        break;
      }
      case "inr": {
        setCurrency({ name: "inr", symbol: "₹" });
        break;
      }
      default: {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
    }
  }

  return (
    <div className='navbar'>
      <Link to={'/'} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <span style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px', color: '#fff' }}>
          Nova<span style={{ color: '#6366f1' }}>Mint</span>
        </span>
      </Link>
      
      <ul>
        <Link to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
          <li>Dashboard</li>
        </Link>
        <li>Markets</li>
        
        {/* FIXED: Wrapped the Portfolio item securely in a functional Link component */}
        <Link to={'/portfolio'} style={{ textDecoration: 'none', color: 'inherit' }}>
          <li>Portfolio</li>
        </Link>
        
        <li>Watchlist</li>
      </ul>
      
      <div className="nav-right">
        <select onChange={currencyHandler}>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="inr">INR</option>
        </select>
        <button>Sign up <img src={arrow_icon} alt="" /></button>
      </div>
    </div>
  )
}

export default Navbar