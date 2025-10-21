import yahooFinance from 'yahoo-finance2';

function statsFromHistory(history) {
  const returns = [];
  for (let i=1;i<history.length;i++) {
    returns.push((history[i].close - history[i-1].close)/history[i-1].close *100);
  }
  const avg = returns.reduce((a,b)=>a+b,0)/returns.length;
  const std = Math.sqrt(returns.reduce((a,b)=>a+(b-avg)*(b-avg),0)/returns.length);
  const max = Math.max(...returns);
  const min = Math.min(...returns);
  return { avg, std, max, min };
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol') || 'AAPL';
  try {
    const history = await yahooFinance.historical(symbol, { period: '1mo' });
    if (!history || history.length < 10) return new Response(JSON.stringify({ error: 'not enough data' }), { status: 400 });
    const s = statsFromHistory(history.slice(-30));
    const buyThreshold = Math.max(0.5, s.avg + s.std*0.5);
    const sellThreshold = Math.max(1, Math.abs(s.min) * 1.2);
    return new Response(JSON.stringify({ symbol, buyThreshold:+buyThreshold.toFixed(2), sellThreshold:+sellThreshold.toFixed(2), stats: s }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'strategy error' }), { status: 500 });
  }
}
