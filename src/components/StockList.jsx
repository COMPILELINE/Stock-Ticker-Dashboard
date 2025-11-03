// src/components/StockList.jsx
import React, { useState, useEffect } from 'react';
import { useStock } from '../contexts/StockContext';
import { fetchStockQuote } from '../services/api';
import { useInterval } from '../hooks/useInterval';
import StockCard from './StockCard';

// As per our plan: 5 calls/min. We'll poll one stock every 13s.
// (60s / 5 calls = 12s/call. We'll add 1s for safety.)
const POLLING_INTERVAL = 13000; // 13 seconds

function StockList() {
  const { state, dispatch } = useStock();
  const { watchlist, stockData } = state;
  const [stockIndexToFetch, setStockIndexToFetch] = useState(0);

  // This function fetches data for *one* stock
  const fetchStock = async (symbol) => {
    try {
      const data = await fetchStockQuote(symbol);
      dispatch({ type: 'UPDATE_STOCK_DATA', payload: { symbol, data } });
    } catch (error) {
      console.error(`Failed to fetch ${symbol}:`, error);
      // We could dispatch a symbol-specific error here
      if (error.message.includes('rate limit')) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }
  };

  // --- Staggered Polling Logic ---
  useInterval(
    () => {
      if (watchlist.length === 0) return;

      // Get the symbol to fetch based on the current index
      const symbolToFetch = watchlist[stockIndexToFetch];
      fetchStock(symbolToFetch);

      // Move to the next stock in the list for the next interval
      setStockIndexToFetch((prevIndex) => (prevIndex + 1) % watchlist.length);
    },
    // Only run the interval if there's something in the watchlist
    watchlist.length > 0 ? POLLING_INTERVAL : null
  );

  // --- Initial Data Fetch ---
  // When a stock is *first added*, fetch its data immediately.
  // The polling interval will handle subsequent updates.
  useEffect(() => {
    for (const symbol of watchlist) {
      // If a symbol is in the watchlist but has no data, fetch it.
      if (!stockData[symbol]) {
        fetchStock(symbol);
      }
    }
  }, [watchlist, stockData]); // Re-run if watchlist changes

  if (watchlist.length === 0) {
    return (
      <div className="stock-list-empty">
        <p>Your watchlist is empty.</p>
        <p>Use the search bar above to add a stock.</p>
      </div>
    );
  }

  return (
    <div className="stock-list">
      {state.error && <p className="error-message global-error">{state.error}</p>}
      {watchlist.map((symbol) => (
        <StockCard key={symbol} symbol={symbol} data={stockData[symbol]} />
      ))}
    </div>
  );
}

export default StockList;