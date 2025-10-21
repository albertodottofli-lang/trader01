import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const positions = await prisma.position.findMany();
    const settings = await prisma.setting.findMany();
    const history = await prisma.portfolioHistory.findMany({ orderBy: { timestamp: 'asc' } });
    // cash stored as setting INITIAL_CASH minus spent computed from trades
    const tradeSum = await prisma.trade.aggregate({ _sum: { total: true } });
    let cash = Number(process.env.INITIAL_CASH || 10000);
    if (tradeSum && tradeSum._sum && tradeSum._sum.total) {
      cash = +(cash - tradeSum._sum.total).toFixed(2);
    }
    return new Response(JSON.stringify({ positions, settings, history, cash }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'db error' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (body.action === 'buy') {
      const { symbol, qty, price } = body;
      const total = qty * price;
      // record trade and update/create position
      await prisma.trade.create({ data: { type: 'buy', symbol, qty, price, total } });
      const pos = await prisma.position.findUnique({ where: { symbol } }).catch(()=>null);
      if (!pos) {
        await prisma.position.create({ data: { symbol, qty, avgPrice: price, peakPrice: price } });
      } else {
        const newQty = pos.qty + qty;
        const newAvg = ((pos.avgPrice * pos.qty) + total) / newQty;
        await prisma.position.update({ where: { id: pos.id }, data: { qty: newQty, avgPrice: newAvg, peakPrice: Math.max(pos.peakPrice, price) } });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 201 });
    } else if (body.action === 'sell') {
      const { symbol, qty, price } = body;
      const total = qty * price;
      await prisma.trade.create({ data: { type: 'sell', symbol, qty, price, total: -total } });
      const pos = await prisma.position.findUnique({ where: { symbol } });
      if (pos) {
        const remaining = pos.qty - qty;
        if (remaining <= 0) {
          await prisma.position.delete({ where: { id: pos.id } });
        } else {
          await prisma.position.update({ where: { id: pos.id }, data: { qty: remaining } });
        }
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } else if (body.action === 'reset') {
      await prisma.trade.deleteMany();
      await prisma.position.deleteMany();
      await prisma.portfolioHistory.deleteMany();
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: 'invalid action' }), { status: 400 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'db post error' }), { status: 500 });
  }
}
