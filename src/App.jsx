// src/App.jsx
import React from 'react';
import { StockProvider } from './contexts/StockContext';
import SearchBar from './components/SearchBar';
import StockList from './components/StockList';
import './index.css';

function App() {
  return (
    <StockProvider>
      <div className="app-container">
        <header>
          <h1>React Stock Ticker</h1>
          <SearchBar />
        </header>
        <main>
          <StockList />
        </main>
        <footer>
          <p>Data provided by Alpha Vantage. Not for financial advice.</p>
          {/* RefreshTimer component would go here */}
        </footer>
      </div>
    </StockProvider>
  );
}

export default App;