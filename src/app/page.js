'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stocks')
      .then(res => res.json())
      .then(data => {
        setStocks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 Nasdaq Dashboard</h1>
      {loading ? (
        <p className="text-gray-600">Caricamento dati in corso...</p>
      ) : (
        <table className="w-full bg-white rounded-2xl shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Titolo</th>
              <th className="p-3">Ticker</th>
              <th className="p-3">Prezzo Attuale</th>
              <th className="p-3">Prezzo Apertura</th>
              <th className="p-3">Differenza</th>
              <th className="p-3">RSI</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => (
              <tr key={stock.symbol} className="border-t hover:bg-gray-50">
                <td className="p-3">{stock.name}</td>
                <td className="p-3 font-mono">{stock.symbol}</td>
                <td className="p-3">{stock.price?.toFixed(2)} $</td>
                <td className="p-3">{stock.open?.toFixed(2)} $</td>
                <td className={`p-3 ${stock.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change?.toFixed(2)} $
                </td>
                <td className="p-3">{stock.rsi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
