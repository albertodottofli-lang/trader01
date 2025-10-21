import yahooFinance from 'yahoo-finance2';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const tickers = body.tickers || [];
    const buyThreshold = Number(body.buyThreshold || 9999);
    const sellThreshold = Number(body.sellThreshold || 9999);
    const maxPct = Number(body.maxPctPerSymbol || 10);
    const maxShares = Number(body.maxSharesPerSymbol || 1000);
    // compute available cash from trades total
    const tradeSum = await prisma.trade.aggregate({ _sum: { total: true } });
    let cash = Number(process.env.INITIAL_CASH || 10000);
    if (tradeSum && tradeSum._sum && tradeSum._sum.total) cash = +(cash - tradeSum._sum.total).toFixed(2);
    for (const symbol of tickers) {
      try {
        const quote = await yahooFinance.quote(symbol);
        const price = quote.regularMarketPrice || quote.regularMarketPreviousClose || 0;
        const open = quote.regularMarketOpen || price;
        const changePercent = open ? ((price - open)/open)*100 : 0;
        if (changePercent >= buyThreshold) {
          const maxInvest = (maxPct/100) * cash;
          const qty = Math.min(Math.floor(maxInvest/price), maxShares);
          if (qty>0) {
            const total = +(qty*price).toFixed(2);
            await prisma.trade.create({ data: { type: 'buy', symbol, qty, price, total } });
            const pos = await prisma.position.findFirst({ where: { symbol } });
            if (!pos) {
              await prisma.position.create({ data: { symbol, qty, avgPrice: price, peakPrice: price } });
            } else {
              const newQty = pos.qty + qty;
              const newAvg = ((pos.avgPrice*pos.qty) + total) / newQty;
              await prisma.position.update({ where: { id: pos.id }, data: { qty: newQty, avgPrice: newAvg, peakPrice: Math.max(pos.peakPrice, price) } });
            }
            cash = +(cash - total).toFixed(2);
          }
        }
        const pos = await prisma.position.findFirst({ where: { symbol } });
        if (pos) {
          const dropFromPeak = ((pos.peakPrice - price)/pos.peakPrice)*100;
          if (dropFromPeak >= sellThreshold) {
            const qty = pos.qty;
            const total = +(qty*price).toFixed(2);
            await prisma.trade.create({ data: { type: 'sell', symbol, qty, price, total: -total } });
            await prisma.position.delete({ where: { id: pos.id } });
            cash = +(cash + total).toFixed(2);
          } else if (price > pos.peakPrice) {
            await prisma.position.update({ where: { id: pos.id }, data: { peakPrice: price } });
          }
        }
      } catch(e) { console.error('ticker err', symbol, e); }
    }
    // record portfolio snapshot
    const tradeSum2 = await prisma.trade.aggregate({ _sum: { total: true } });
    let cash2 = Number(process.env.INITIAL_CASH || 10000);
    if (tradeSum2 && tradeSum2._sum && tradeSum2._sum.total) cash2 = +(cash2 - tradeSum2._sum.total).toFixed(2);
    const positions = await prisma.position.findMany();
    let totalValue = cash2;
    for (const p of positions) {
      try { const q = await yahooFinance.quote(p.symbol); totalValue += (q.regularMarketPrice || p.avgPrice) * p.qty; } catch{ totalValue += p.avgPrice * p.qty; }
    }
    await prisma.portfolioHistory.create({ data: { total: totalValue } });
    return new Response(JSON.stringify({ ok: true, cash: cash2 }), { status: 200 });
  } catch(e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'trading error' }), { status: 500 });
  }
}
