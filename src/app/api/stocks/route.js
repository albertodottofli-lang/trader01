import yahooFinance from 'yahoo-finance2';

export async function GET() {
  const tickers = ['AAPL', 'MSFT', 'AMZN', 'GOOG', 'META', 'NVDA', 'TSLA', 'NFLX', 'INTC', 'AMD'];

  try {
    const data = await Promise.all(
      tickers.map(async (symbol) => {
        const quote = await yahooFinance.quote(symbol);
        return {
          symbol: quote.symbol,
          name: quote.shortName,
          price: quote.regularMarketPrice,
          open: quote.regularMarketOpen,
          change: quote.regularMarketPrice - quote.regularMarketOpen,
          rsi: quote.rsi || '—'
        };
      })
    );

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Errore nel recupero dati Yahoo Finance' }), { status: 500 });
  }
}
