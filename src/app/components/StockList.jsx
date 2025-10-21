'use client';
import { useEffect, useState } from 'react';

export default function StockList({ tickers }) {
  const [data, setData] = useState([]);
  useEffect(()=>{
    async function load(){ 
      const results = await Promise.all(tickers.map(t=>fetch(`/api/yahoo?symbol=${t}`).then(r=>r.json()).catch(()=>({symbol:t}))));
      setData(results);
    }
    load();
    const i = setInterval(load,30000);
    return ()=>clearInterval(i);
  },[tickers]);

  return (<div className="bg-white p-4 rounded shadow mb-4">
    <h2 className="font-semibold mb-2">Market Overview</h2>
    <table className="w-full text-sm">
      <thead><tr className="text-left"><th>Title</th><th>Ticker</th><th>Price</th><th>Open</th><th>%Day</th><th>RSI</th></tr></thead>
      <tbody>{data.map(d=>{
        const price = d.regularMarketPrice ?? 0;
        const open = d.regularMarketOpen ?? price;
        const pct = open ? ((price-open)/open*100).toFixed(2) : '0.00';
        return (<tr key={d.symbol} className="border-t"><td>{d.shortName||d.symbol}</td><td className="font-mono">{d.symbol}</td><td>{price?.toFixed?.(2)}</td><td>{open?.toFixed?.(2)}</td><td className={pct>=0?'text-green-600':'text-red-600'}>{pct}%</td><td>{d.rsi||'—'}</td></tr>);
      })}</tbody>
    </table>
  </div>);
}
