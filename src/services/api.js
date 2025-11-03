// src/services/api.js

// We point to our own serverless function proxy, not directly to Alpha Vantage
// We'll set this in a .env.local file: VITE_API_URL=/api
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Fetches the global quote for a given stock symbol.
 * This function queries our own serverless proxy.
 */
export const fetchStockQuote = async (symbol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quote?symbol=${symbol}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check for Alpha Vantage API errors (e.g., invalid symbol)
    if (data["Error Message"]) {
      throw new Error(data["Error Message"]);
    }
    
    // Check for rate limiting
    if (data["Note"]) {
       console.warn('API Rate limit hit:', data["Note"]);
       // We can throw a specific error type here if we want
       throw new Error('API rate limit reached. Please wait.');
    }

    // Process the "Global Quote" object
    const quote = data["Global Quote"];
    if (!quote || Object.keys(quote).length === 0) {
      throw new Error(`No quote data found for symbol ${symbol}.`);
    }

    // Transform data to a cleaner format
    return {
      symbol: quote["01. symbol"],
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"]),
      changePercent: parseFloat(quote["10. change percent"].replace('%', '')),
      previousClose: parseFloat(quote["08. previous close"]),
    };
  } catch (error) {
    console.error(`Failed to fetch stock data for ${symbol}:`, error);
    // Re-throw the error so the calling component can handle it
    throw error;
  }
};