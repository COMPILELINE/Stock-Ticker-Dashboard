// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { useStock } from '../contexts/StockContext';
import { fetchStockQuote } from '../services/api';

function SearchBar() {
  const [symbol, setSymbol] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useStock();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol) return;

    const upperSymbol = symbol.toUpperCase();
    
    if (state.watchlist.includes(upperSymbol)) {
        setError('Stock is already in your watchlist.');
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // We "ping" the API first to validate the symbol
      const data = await fetchStockQuote(upperSymbol);
      
      // If valid, we add to context. The StockList will handle fetching data.
      dispatch({ type: 'ADD_STOCK', payload: upperSymbol });
      dispatch({ type: 'UPDATE_STOCK_DATA', payload: { symbol: upperSymbol, data } });
      setSymbol(''); // Clear input
    } catch (err) {
      setError(`Failed to find symbol "${upperSymbol}". Please try again.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter stock symbol (e.g., AAPL)"
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Stock'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default SearchBar;