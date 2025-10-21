'use client';
import { useEffect, useState } from 'react';
import StockList from './components/StockList';
import ControlsPanel from './components/ControlsPanel';
import PortfolioPanel from './components/PortfolioPanel';
import HistoryPanel from './components/HistoryPanel';
import PerformanceChart from './components/PerformanceChart';

export default function Page() {
  const tickers = ['AAPL','MSFT','AMZN','GOOG','META','NVDA','TSLA','NFLX','INTC','AMD'];
  const [portfolio, setPortfolio] = useState(null);
  const [settings, setSettings] = useState({});

  async function reload() {
    const res = await fetch('/api/portfolio');
    const data = await res.json();
    setPortfolio(data);
    const s = {};
    (data.settings||[]).forEach(item=>s[item.key]=item.value);
    setSettings(s);
  }

  useEffect(()=>{ reload(); const i=setInterval(()=>{ fetch('/api/trading',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ tickers, buyThreshold: Number(settings.buyThreshold||1), sellThreshold: Number(settings.sellThreshold||5), maxPctPerSymbol:Number(settings.maxPct||10), maxSharesPerSymbol:Number(settings.maxShares||50) }) }).then(()=>reload()); reload(); }, Number(process.env.NEXT_PUBLIC_UPDATE_INTERVAL || 30000)); return ()=>clearInterval(i); },[settings]);

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Trader01 - Integrated Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <StockList tickers={tickers} />
          <ControlsPanel tickers={tickers} onReload={reload} settings={settings} />
        </div>
        <div className="col-span-1">
          <PortfolioPanel portfolio={portfolio} onReload={reload} />
          <PerformanceChart portfolio={portfolio} />
        </div>
      </div>
      <div className="mt-6">
        <HistoryPanel portfolio={portfolio} />
      </div>
    </main>
  );
}
