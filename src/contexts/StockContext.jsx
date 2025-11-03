// src/contexts/StockContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const StockContext = createContext();

const initialState = {
  watchlist: [], // Array of symbols: ['AAPL', 'MSFT']
  stockData: {}, // Map of symbol to data: { AAPL: { price: 150, ... } }
  error: null,
  loading: false, // For global actions, like initial load
};

function stockReducer(state, action) {
  switch (action.type) {
    case 'ADD_STOCK':
      if (state.watchlist.includes(action.payload)) {
        return state; // Avoid duplicates
      }
      return {
        ...state,
        watchlist: [...state.watchlist, action.payload],
      };
    case 'REMOVE_STOCK':
      return {
        ...state,
        watchlist: state.watchlist.filter(
          (symbol) => symbol !== action.payload
        ),
        stockData: { ...state.stockData, [action.payload]: undefined },
      };
    case 'UPDATE_STOCK_DATA':
      return {
        ...state,
        stockData: {
          ...state.stockData,
          [action.payload.symbol]: {
            ...action.payload.data,
            // Store previous price for flash animation logic
            prevPrice: state.stockData[action.payload.symbol]?.price,
          },
        },
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export const StockProvider = ({ children }) => {
  // Persist the watchlist to localStorage
  const [persistedWatchlist, setPersistedWatchlist] = useLocalStorage(
    'ticker_watchlist',
    []
  );

  // Initialize state with the persisted watchlist
  const [state, dispatch] = useReducer(stockReducer, {
    ...initialState,
    watchlist: persistedWatchlist,
  });

  // Sync reducer state back to localStorage whenever watchlist changes
  useEffect(() => {
    setPersistedWatchlist(state.watchlist);
  }, [state.watchlist, setPersistedWatchlist]);

  const value = { state, dispatch };

  return (
    <StockContext.Provider value={value}>{children}</StockContext.Provider>
  );
};

// Custom hook to use the context
export const useStock = () => {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};