const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchStockQuote = async (symbol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quote?symbol=${symbol}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();


    if (data["Error Message"]) {
      throw new Error(data["Error Message"]);
    }
    

    if (data["Note"]) {
       console.warn('API Rate limit hit:', data["Note"]);

       throw new Error('API rate limit reached. Please wait.');
    }


    const quote = data["Global Quote"];
    if (!quote || Object.keys(quote).length === 0) {
      throw new Error(`No quote data found for symbol ${symbol}.`);
    }


    return {
      symbol: quote["01. symbol"],
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"]),
      changePercent: parseFloat(quote["10. change percent"].replace('%', '')),
      previousClose: parseFloat(quote["08. previous close"]),
    };
  } catch (error) {
    console.error(`Failed to fetch stock data for ${symbol}:`, error);

    throw error;
  }
};