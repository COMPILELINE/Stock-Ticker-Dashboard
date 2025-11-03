import React, { useState, useEffect } from 'react';
import { useStock } from '../contexts/StockContext';
import { fetchStockQuote } from '../services/api';
import { useInterval } from '../hooks/useInterval';
import StockCard from './StockCard';

const POLLING_INTERVAL = 13000;

function StockList() {
  const { state, dispatch } = useStock();
  const { watchlist, stockData } = state;
  const [stockIndexToFetch, setStockIndexToFetch] = useState(0);

  const fetchStock = async (symbol) => {
    try {
      const data = await fetchStockQuote(symbol);
      dispatch({ type: 'UPDATE_STOCK_DATA', payload: { symbol, data } });
    } catch (error) {
      console.error(`Failed to fetch ${symbol}:`, error);
      if (error.message.includes('rate limit')) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }
  };

  useInterval(
    () => {
      if (watchlist.length === 0) return;

      const symbolToFetch = watchlist[stockIndexToFetch];
      fetchStock(symbolToFetch);

      setStockIndexToFetch((prevIndex) => (prevIndex + 1) % watchlist.length);
    },

    watchlist.length > 0 ? POLLING_INTERVAL : null
  );

  useEffect(() => {
    for (const symbol of watchlist) {

      if (!stockData[symbol]) {
        fetchStock(symbol);
      }
    }
  }, [watchlist, stockData]);

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