import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET() {
  const cacheKey = 'girls';

  try {
    const cachedGirls = await redis.get(cacheKey);

    if (cachedGirls) {
      return NextResponse.json(JSON.parse(cachedGirls), { status: 200 });
    }

    const girls = await db.girl.findMany({
      where: { isActive: true },
      include: {
        images: {
          select: {
            url: true,
            isPrimary: true,
          },
        },
        city: {
          select: { name: true, slug: true },
        },
        subarea: {
          select: { name: true, slug: true },
        },
      },
    });

    if (girls.length > 0) {
      await redis.set(cacheKey, JSON.stringify(girls), 'EX', 60 * 5);
    }

    return NextResponse.json(girls, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching girls data:', error);
    return NextResponse.json({ error: 'Error fetching data', details: error.message }, { status: 500 });
  }
}
