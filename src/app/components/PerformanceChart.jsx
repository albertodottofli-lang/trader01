'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PerformanceChart({ portfolio }) {
  const [series, setSeries] = useState([]);

  useEffect(()=>{
    if (!portfolio) return;
    const hist = (portfolio.history || []).map(h=>({ time: new Date(h.createdAt || h.time || h.timestamp).toLocaleTimeString(), total: h.total || 0 }));
    // fallback: use portfolio.history snapshot totals if available, else show cash-only
    const points = (portfolio.history || []).map(h=>({ time: new Date(h.createdAt || h.time || h.timestamp).toLocaleTimeString(), portfolio: h.total || portfolio.cash }));
    if (points.length===0) {
      setSeries([{ time: 'now', portfolio: portfolio.cash || 0 }]);
    } else {
      setSeries(points.concat([{ time: 'now', portfolio: portfolio.cash }]));
    }
  },[portfolio]);

  if (!series || series.length===0) return null;
  return (<div className="bg-white p-4 rounded shadow mb-4">
    <h4 className="font-semibold mb-2">Portfolio Performance</h4>
    <LineChart width={350} height={200} data={series}>
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <CartesianGrid strokeDasharray="3 3" />
      <Line type="monotone" dataKey="portfolio" stroke="#8884d8" strokeWidth={2} dot={false} />
    </LineChart>
  </div>);
}
