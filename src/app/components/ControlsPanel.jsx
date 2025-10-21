'use client';
import { useState } from 'react';

export default function ControlsPanel({ tickers, onReload, settings }) {
  const [buy, setBuy] = useState(settings.buyThreshold||1);
  const [sell, setSell] = useState(settings.sellThreshold||5);
  const [maxPct, setMaxPct] = useState(settings.maxPct||10);
  const [maxShares, setMaxShares] = useState(settings.maxShares||50);

  async function save() {
    // store settings to server via API (simple approach: POST to portfolio endpoint as settings)
    const s = [{ key: 'buyThreshold', value: String(buy) },{ key:'sellThreshold', value:String(sell) },{ key:'maxPct', value:String(maxPct) },{ key:'maxShares', value:String(maxShares) }];
    for (const item of s) {
      await fetch('/api/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(item) });
    }
    if (onReload) onReload();
    alert('Settings saved');
  }

  async function runNow() {
    await fetch('/api/trading', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ tickers, buyThreshold: Number(buy), sellThreshold: Number(sell), maxPctPerSymbol: Number(maxPct), maxSharesPerSymbol: Number(maxShares) }) });
    if (onReload) onReload();
    alert('Automation run completed');
  }

  async function suggest() {
    const results = await Promise.all(tickers.map(t=>fetch(`/api/strategy?symbol=${t}`).then(r=>r.json()).catch(()=>null)));
    const buys = results.filter(r=>r && r.buyThreshold).map(r=>r.buyThreshold);
    const sells = results.filter(r=>r && r.sellThreshold).map(r=>r.sellThreshold);
    if (buys.length) setBuy((buys.reduce((a,b)=>a+b,0)/buys.length).toFixed(2));
    if (sells.length) setSell((sells.reduce((a,b)=>a+b,0)/sells.length).toFixed(2));
  }

  return (<div className="bg-white p-4 rounded shadow mb-4">
    <h3 className="font-semibold mb-2">Automation Controls</h3>
    <div className="flex flex-col gap-2">
      <label>Buy % threshold <input value={buy} onChange={e=>setBuy(e.target.value)} className="ml-2 border p-1 rounded w-20 inline-block" />%</label>
      <label>Sell % threshold <input value={sell} onChange={e=>setSell(e.target.value)} className="ml-2 border p-1 rounded w-20 inline-block" />%</label>
      <label>Max % per symbol <input value={maxPct} onChange={e=>setMaxPct(e.target.value)} className="ml-2 border p-1 rounded w-20 inline-block" />%</label>
      <label>Max shares per symbol <input value={maxShares} onChange={e=>setMaxShares(e.target.value)} className="ml-2 border p-1 rounded w-20 inline-block" /></label>
      <div className="flex gap-2">
        <button onClick={runNow} className="bg-blue-600 text-white px-3 py-1 rounded">Run Now</button>
        <button onClick={suggest} className="bg-green-600 text-white px-3 py-1 rounded">Suggest</button>
        <button onClick={save} className="bg-gray-600 text-white px-3 py-1 rounded">Save Settings</button>
      </div>
    </div>
  </div>);
}
