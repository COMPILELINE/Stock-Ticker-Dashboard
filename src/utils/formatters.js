export const formatPrice = (price) => {
  if (typeof price !== 'number') return '...';
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'INR',
  });
};

export const formatChange = (change, changePercent) => {
  if (typeof change !== 'number' || typeof changePercent !== 'number') {
    return '...';
  }

  const changeStr = `${change >= 0 ? '+' : ''}${formatPrice(change)}`;
  const percentStr = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(
    2
  )}%`;

  return `${changeStr} (${percentStr})`;
};

export const getChangeDirection = (change) => {
  if (typeof change !== 'number') return 'neutral';
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'neutral';
};