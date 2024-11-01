import { db } from '@/lib/db';

export async function getCityDetails(city: string) {
  try {
    return await db.city.findUnique({
      where: { name: city },
      select: { name: true },
    });
  } catch (error) {
    console.error('Failed to fetch city details:', error);
    return null;
  }
}

export async function getSubzoneDetails(subzone: string) {
  try {
    return await db.subarea.findUnique({
      where: { slug: subzone },
      select: { name: true },
    });
  } catch (error) {
    console.error('Failed to fetch subzone details:', error);
    return null;
  }
}
