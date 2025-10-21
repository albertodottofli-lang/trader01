'use client';
import { useState } from 'react';

export default function PortfolioPanel({ portfolio, onReload }) {
  const [symbol, setSymbol] = useState('');
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);

  async function buy() {
    if (!symbol || qty<=0 || price<=0) return alert('fill fields');
    await fetch('/api/portfolio', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'buy', symbol, qty: Number(qty), price: Number(price) }) });
    setSymbol(''); setQty(0); setPrice(0);
    if (onReload) onReload();
  }

  async function sell(symbolSell) {
    const q = prompt('Quantità da vendere per ' + symbolSell);
    const qtySell = Number(q);
    if (!qtySell) return;
    const priceNow = prompt('Prezzo di vendita');
    const priceNum = Number(priceNow);
    await fetch('/api/portfolio', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'sell', symbol: symbolSell, qty: qtySell, price: priceNum }) });
    if (onReload) onReload();
  }

  if (!portfolio) return null;
  return (<div className="bg-white p-4 rounded shadow mb-4">
    <h3 className="font-semibold mb-2">Portfolio</h3>
    <div className="mb-2">Cash: ${portfolio.cash?.toFixed(2) || '0.00'}</div>
    <div className="flex gap-2 mb-3">
      <input placeholder="Ticker" value={symbol} onChange={e=>setSymbol(e.target.value)} className="border p-1 rounded w-20" />
      <input placeholder="Qty" value={qty} onChange={e=>setQty(e.target.value)} className="border p-1 rounded w-20" />
      <input placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} className="border p-1 rounded w-24" />
      <button onClick={buy} className="bg-blue-600 text-white px-2 rounded">Buy</button>
    </div>
    <table className="w-full text-sm">
      <thead><tr className="text-left"><th>Ticker</th><th>Qty</th><th>Avg Price</th><th>Actions</th></tr></thead>
      <tbody>{(portfolio.positions||[]).map(p=>(<tr key={p.id} className="border-t"><td>{p.symbol}</td><td>{p.qty}</td><td>{p.avgPrice.toFixed(2)}</td><td><button onClick={()=>sell(p.symbol)} className="text-sm bg-red-500 text-white px-2 rounded">Sell</button></td></tr>))}</tbody>
    </table>
  </div>);
}
