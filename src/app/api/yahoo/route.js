import yahooFinance from 'yahoo-finance2';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol') || 'AAPL';
  try {
    const quote = await yahooFinance.quote(symbol);
    // try to compute RSI quickly using 14 recent closes
    let rsi = null;
    try {
      const hist = await yahooFinance.historical(symbol, { period: '1mo' });
      const closes = hist.map(h=>h.close).slice(-15);
      if (closes.length>14) {
        let gains=0, losses=0;
        for (let i=1;i<closes.length;i++){ const d = closes[i]-closes[i-1]; if (d>0) gains+=d; else losses+=Math.abs(d); }
        const avgG = gains/14, avgL = losses/14;
        rsi = avgL===0?100: +(100 - 100/(1 + (avgG/avgL))).toFixed(2);
      }
    } catch(e) {}
    return new Response(JSON.stringify({...quote, rsi}), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'yahoo error' }), { status: 500 });
  }
}
