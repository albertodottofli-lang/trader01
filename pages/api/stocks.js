
export default async function handler(req, res) {
  const tickers = ["AAPL", "MSFT", "GOOG", "AMZN", "NVDA"];
  try {
    const results = await Promise.all(
      tickers.map(async (t) => {
        const response = await fetch(
          `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${t}`
        );
        const data = await response.json();
        const quote = data.quoteResponse.result[0];
        return {
          symbol: t,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange.toFixed(2),
        };
      })
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
