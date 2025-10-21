'use client';
export default function HistoryPanel({ portfolio }) {
  if (!portfolio) return null;
  const history = portfolio.history || [];
  return (<div className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-2">Transaction History</h3>
    <table className="w-full text-sm">
      <thead><tr className="text-left"><th>Date</th><th>Type</th><th>Ticker</th><th>Qty</th><th>Total</th></tr></thead>
      <tbody>{history.map(h=>(<tr key={h.id} className="border-t"><td>{new Date(h.createdAt || h.time || h.timestamp).toLocaleString()}</td><td>{h.type||h.action}</td><td>{h.symbol}</td><td>{h.qty}</td><td>{(h.total||0).toFixed? (h.total).toFixed(2) : h.total}</td></tr>))}</tbody>
    </table>
  </div>);
}
