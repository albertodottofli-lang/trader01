import yahooFinance from 'yahoo-finance2';
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol') || 'AAPL';
  const period = searchParams.get('period') || '1mo';
  try {
    const history = await yahooFinance.historical(symbol, { period });
    return new Response(JSON.stringify(history), { status: 200 });
  } catch(e){ console.error(e); return new Response(JSON.stringify({ error:'historic error'}), { status:500 }); }
}
