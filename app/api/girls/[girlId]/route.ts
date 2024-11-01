import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET(req: Request, context: { params: { girlId: string } }) {
  const { girlId } = context.params;

  if (!girlId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const cacheKey = `girl-:${girlId}`;

  try {
    const cachedGirl = await redis.get(cacheKey);

    if (cachedGirl) {
      return NextResponse.json(JSON.parse(cachedGirl), { status: 200 });
    }

    const girl = await db.girl.findUnique({
      where: { slug: girlId },
      include: {
        services: true,
        city: true,
        subarea: true,
        images: {
          where: { isVisible: true },
          orderBy: { isPrimary: 'desc' },
        },
        languages: {
          include: { language: true },
        },
      },
    });

    if (!girl) {
      return NextResponse.json({ error: 'Girl not found' }, { status: 404 });
    }

    await redis.set(cacheKey, JSON.stringify(girl), 'EX', 3600);

    return NextResponse.json(girl, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching girl data:', error);
    return NextResponse.json({ error: 'Error fetching data', details: error.message }, { status: 500 });
  }
}
