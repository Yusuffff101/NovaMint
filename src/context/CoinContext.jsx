import { createContext, useEffect, useState } from "react";

export const CoinContext = createContext();

const CoinContextProvider = (props) => {
    const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

    const [allCoin, setAllCoin] = useState([]);
    const [currency, setCurrency] = useState({ name: "usd", symbol: "$" });

    // --- PORTFOLIO STATE HOOKS ---
    // Start with $10,000 USD virtual cash balance (or load saved balance)
    const [balance, setBalance] = useState(() => {
        const savedBalance = localStorage.getItem("novamint_balance");
        return savedBalance ? parseFloat(savedBalance) : 10000;
    });

    // Structure: [{ id, name, symbol, image, qty, avgBuyPrice }]
    const [portfolio, setPortfolio] = useState(() => {
        const savedPortfolio = localStorage.getItem("novamint_portfolio");
        return savedPortfolio ? JSON.parse(savedPortfolio) : [];
    });

    // Sync portfolio state changes to local browser storage automatically
    useEffect(() => {
        localStorage.setItem("novamint_balance", balance.toString());
        localStorage.setItem("novamint_portfolio", JSON.stringify(portfolio));
    }, [balance, portfolio]);


    // --- TRANSACTION LOGIC ENGINE ---
    const buyCoin = (coin, qty, currentPrice) => {
        const cost = currentPrice * qty;
        if (balance < cost) return { success: false, message: "Insufficient funds available!" };

        setBalance(prev => prev - cost);
        setPortfolio(prev => {
            const existingIndex = prev.findIndex(item => item.id === coin.id);
            if (existingIndex > -1) {
                const updated = [...prev];
                const existing = updated[existingIndex];
                
                // Recalculate cost-basis (weighted average price buy in)
                const newQty = existing.qty + qty;
                const newAvgPrice = ((existing.avgBuyPrice * existing.qty) + cost) / newQty;
                
                updated[existingIndex] = { ...existing, qty: newQty, avgBuyPrice: newAvgPrice };
                return updated;
            }
            return [...prev, { 
                id: coin.id, 
                name: coin.name, 
                symbol: coin.symbol, 
                image: coin.image?.large || coin.image, 
                qty: qty, 
                avgBuyPrice: currentPrice 
            }];
        });
        return { success: true, message: `Successfully bought ${qty} ${coin.symbol?.toUpperCase()}!` };
    };

    const sellCoin = (coinId, qty, currentPrice) => {
        const existingIndex = portfolio.findIndex(item => item.id === coinId);
        if (existingIndex === -1 || portfolio[existingIndex].qty < qty) {
            return { success: false, message: "You do not own enough tokens to execute this order!" };
        }

        const credit = currentPrice * qty;
        setBalance(prev => prev + credit);
        
        setPortfolio(prev => {
            const updated = [...prev];
            const existing = updated[existingIndex];
            const remainingQty = existing.qty - qty;

            if (remainingQty <= 0) {
                return updated.filter(item => item.id !== coinId); // Drop asset completely if empty
            } else {
                updated[existingIndex] = { ...existing, qty: remainingQty };
                return updated;
            }
        });
        return { success: true, message: `Successfully liquidated ${qty} tokens.` };
    };


    const fetchAllCoin = async () => {
        if (!API_KEY) return;
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&order=market_cap_desc&per_page=50&page=1&sparkline=false`;
        const options = {
            method: 'GET',
            headers: { accept: 'application/json', 'x-cg-demo-api-key': API_KEY }
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const data = await response.json();
            if (Array.isArray(data)) setAllCoin(data);
        } catch (err) {
            console.error("Live Stream Fetch Exception:", err.message);
        }
    };

    useEffect(() => {
        fetchAllCoin();
    }, [currency]);

    const contextValue = {
        allCoin, currency, setCurrency, API_KEY,
        balance, portfolio, buyCoin, sellCoin // Export parameters globally
    };

    return (
        <CoinContext.Provider value={contextValue}>
            {props.children}
        </CoinContext.Provider>
    );
};

export default CoinContextProvider;