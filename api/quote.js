export default async function handler(request, response) {
  const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
  const symbol = searchParams.get('symbol');
  
  const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

  if (!symbol) {
    return response.status(400).json({ error: 'Symbol is required' });
  }

  if (!API_KEY) {
    return response.status(500).json({ error: 'API key not configured' });
  }

  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

  try {
    const apiResponse = await fetch(url);
    const data = await apiResponse.json();
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: 'Failed to fetch data from Alpha Vantage' });
  }
}