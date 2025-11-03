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
    e.stopPropagation();
    dispatch({ type: 'REMOVE_STOCK', payload: symbol });
  };

  useEffect(() => {
    if (!data || !data.prevPrice) return;

    if (data.price > data.prevPrice) {
      setFlashClass('price-flash-up');
    } else if (data.price < data.prevPrice) {
      setFlashClass('price-flash-down');
    }

    const timer = setTimeout(() => {
      setFlashClass('');
    }, 500);

    return () => clearTimeout(timer);
  }, [data]);


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

export default memo(StockCard);