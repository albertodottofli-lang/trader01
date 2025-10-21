
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await fetch("/api/stocks");
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 p-8">
      <h1 className="text-4xl mb-6 text-center font-bold">NASDAQ Real-Time Tracker</h1>
      <table className="w-full text-left border-collapse">
        <thead className="border-b border-green-700">
          <tr>
            <th className="p-2">Symbol</th>
            <th className="p-2">Price</th>
            <th className="p-2">Change</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.symbol} className="border-b border-green-800 hover:bg-green-900/20">
              <td className="p-2">{item.symbol}</td>
              <td className="p-2">{item.price}</td>
              <td className={`p-2 ${item.change > 0 ? "text-green-300" : "text-red-400"}`}>
                {item.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
