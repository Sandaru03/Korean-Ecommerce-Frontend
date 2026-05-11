import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('LKR');
  const [exchangeRates, setExchangeRates] = useState({ LKR: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(res => res.json())
      .then(data => {
        const rates = data.rates;
        const lkrRate = rates.LKR;
        const normalizedRates = {};
        
        for (const [cur, rate] of Object.entries(rates)) {
            normalizedRates[cur] = rate / lkrRate;
        }
        
        setExchangeRates(normalizedRates);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching exchange rates:', err);
        setLoading(false);
      });
  }, []);

  const formatPrice = (priceInLKR) => {
    const numPrice = typeof priceInLKR === 'string' ? parseFloat(priceInLKR.replace(/[^0-9.]/g, '')) : priceInLKR;
    
    if (isNaN(numPrice)) return priceInLKR;

    if (!exchangeRates[currency] || currency === 'LKR') {
      return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 0
      }).format(numPrice);
    }
    
    const convertedPrice = numPrice * exchangeRates[currency];
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: (currency === 'KRW' || currency === 'JPY') ? 0 : 2
    }).format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates, formatPrice, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
