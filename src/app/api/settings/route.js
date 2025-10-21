import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const all = await prisma.setting.findMany();
  return new Response(JSON.stringify(all), { status: 200 });
}

export async function POST(req) {
  const body = await req.json(); // { key, value }
  const existing = await prisma.setting.findUnique({ where: { key: body.key } }).catch(()=>null);
  if (existing) {
    await prisma.setting.update({ where: { key: body.key }, data: { value: body.value } });
  } else {
    await prisma.setting.create({ data: { key: body.key, value: body.value } });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
