// src/components/StockCard.jsx
import React, { useState, useEffect, memo } from 'react';
import { useStock } from '../contexts/StockContext';
import {
  formatPrice,
  formatChange,
  getChangeDirection,
} from '../utils/formatters';
import LoadingSpinner from './common/LoadingSpinner';

function StockCard({ symbol, data }) {
  const { dispatch } = useStock();
  const [flashClass, setFlashClass] = useState('');

  const handleRemove = (e) => {
    e.stopPropagation(); // Prevent card click
    dispatch({ type: 'REMOVE_STOCK', payload: symbol });
  };

  // --- Price Flash Animation Logic ---
  useEffect(() => {
    if (!data || !data.prevPrice) return;

    // Check if price changed
    if (data.price > data.prevPrice) {
      setFlashClass('price-flash-up');
    } else if (data.price < data.prevPrice) {
      setFlashClass('price-flash-down');
    }

    // Remove the class after the animation finishes
    const timer = setTimeout(() => {
      setFlashClass('');
    }, 500); // Must match CSS animation duration

    return () => clearTimeout(timer);
  }, [data]); // Only run when this stock's data changes

  // Show spinner if this card's data is not yet loaded
  if (!data) {
    return (
      <div className="stock-card loading">
        <h3>{symbol}</h3>
        <LoadingSpinner />
        <button onClick={handleRemove} className="remove-btn">×</button>
      </div>
    );
  }

  const direction = getChangeDirection(data.change);

  return (
    <div className={`stock-card ${direction}`}>
      <button onClick={handleRemove} className="remove-btn">×</button>
      <div className="card-header">
        <h3>{symbol}</h3>
      </div>
      <div className={`card-price ${flashClass}`}>
        <p>{formatPrice(data.price)}</p>
      </div>
      <div className="card-change">
        <p>{formatChange(data.change, data.changePercent)}</p>
      </div>
    </div>
  );
}

// Use React.memo to prevent re-rendering cards that haven't updated
export default memo(StockCard);