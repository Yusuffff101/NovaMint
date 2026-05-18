import { createContext, useEffect, useState } from "react";

export const CoinContext = createContext();

const CoinContextProvider = (props) => {
    const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

    const [allCoin, setAllCoin] = useState([]);
    const [currency, setCurrency] = useState({
        name: "usd",
        symbol: "$"
    });

    const fetchAllCoin = async () => {
        if (!API_KEY) {
            console.error("NovaMint Core Error: API Key is missing inside your .env configuration file.");
            return;
        }

        // Clean, unadulterated live API URL string
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&order=market_cap_desc&per_page=50&page=1&sparkline=false`;
        
        const options = {
            method: 'GET',
            headers: { 
                accept: 'application/json',
                // Official CoinGecko authentication header standard
                'x-cg-demo-api-key': API_KEY 
            }
        };
          
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP Error Code: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (Array.isArray(data)) {
                setAllCoin(data);
            } else {
                console.error("Received response is not a valid array:", data);
                setAllCoin([]);
            }
        } catch (err) {
            console.error("NovaMint Live Stream Fetch Exception:", err.message);
            setAllCoin([]); // Reset to empty array so UI loading indicators trigger smoothly
        }
    };

    useEffect(() => {
        fetchAllCoin();
    }, [currency]);

    const contextValue = {
        allCoin, 
        currency, 
        setCurrency,
        API_KEY
    };

    return (
        <CoinContext.Provider value={contextValue}>
            {props.children}
        </CoinContext.Provider>
    );
};

export default CoinContextProvider;