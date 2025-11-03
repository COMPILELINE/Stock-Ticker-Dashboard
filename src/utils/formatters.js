// src/utils/formatters.js

/**
 * Formats a number as a USD price.
 * e.g., 175.5 -> "$175.50"
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number') return '...';
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

/**
 * Formats change and percent, adding a + sign for positive values.
 * e.g., (1.5, 0.25) -> "+$1.50 (+0.25%)"
 * e.g., (-0.5, -0.1) -> "-$0.50 (-0.10%)"
 */
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

/**
 * Returns 'up' for positive, 'down' for negative, 'neutral' for 0.
 */
export const getChangeDirection = (change) => {
  if (typeof change !== 'number') return 'neutral';
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'neutral';
};