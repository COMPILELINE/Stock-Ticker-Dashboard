import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const StockContext = createContext();

const initialState = {
  watchlist: [],
  stockData: {},
  error: null,
  loading: false,
};

function stockReducer(state, action) {
  switch (action.type) {
    case 'ADD_STOCK':
      if (state.watchlist.includes(action.payload)) {
        return state;
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
  const [persistedWatchlist, setPersistedWatchlist] = useLocalStorage(
    'ticker_watchlist',
    []
  );

  const [state, dispatch] = useReducer(stockReducer, {
    ...initialState,
    watchlist: persistedWatchlist,
  });

  useEffect(() => {
    setPersistedWatchlist(state.watchlist);
  }, [state.watchlist, setPersistedWatchlist]);

  const value = { state, dispatch };

  return (
    <StockContext.Provider value={value}>{children}</StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};