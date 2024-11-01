import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cities = await db.city.findMany({
      select: {
        name: true,
        slug: true,
        subareas: {
          where: {
            girls: {
              some: {},
            },
          },
          select: {
            name: true,
            slug: true,
          },
        },
      },
      where: {
        subareas: {
          some: {
            girls: {
              some: {},
            },
          },
        },
      },
    });

    const citiesWithSubareas = cities
      .map(city => ({
        name: city.name,
        slug: city.slug,
        subareas: city.subareas.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ cities: citiesWithSubareas }, { status: 200 });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}
