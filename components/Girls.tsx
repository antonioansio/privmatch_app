'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Filter from '@/components/Filter';
import { differenceInDays, parseISO } from 'date-fns';
import { getDistance } from 'geolib';

interface GirlsComponentProps {
  city?: string | null;
  subzone?: string | null;
  cityTitle?: string | null;
  zoneTitle?: string | null;
}

interface GirlFilters {
  city: string | null;
  subarea: string | null;
  price: number;
  age: number;
  offersVideoCall: boolean;
  isNew: boolean;
  latitude?: number;
  longitude?: number;
}

interface GirlProfile {
  id: number;
  name: string;
  slug: string;
  age: number;
  ratePerHour: number;
  createdAt: string;
  offersVideoCall: boolean;
  latitude: number;
  longitude: number;
  images: { url: string; isPrimary: boolean }[];
  city: { name: string; slug: string };
  subarea: { name: string; slug: string };
  city_slug: string;
  subarea_slug: string;
  imageUrl: string;
}

const MAX_DISTANCE = 10000;

const Girls = ({ city = null, subzone = null }: GirlsComponentProps) => {
  const [filters, setFilters] = useState<GirlFilters>({
    city,
    subarea: subzone,
    price: 1500,
    age: 60,
    offersVideoCall: false,
    isNew: false,
  });
  const [girls, setGirls] = useState<GirlProfile[]>([]);

  const handleFilterChange = (updatedFilters: GirlFilters) => {
    setFilters(updatedFilters);
  };

  useEffect(() => {
    async function fetchGirls() {
      try {
        const response = await fetch(`/api/girls`);
        const data = await response.json();

        const mappedData = data.map((girl: GirlProfile) => {
          const primaryImage = girl.images.find(image => image.isPrimary);
          return {
            ...girl,
            imageUrl: primaryImage ? primaryImage.url : null,
          };
        });

        setGirls(mappedData);
      } catch (error) {
        console.error('Error fetching girls:', error);
      }
    }
    fetchGirls();
  }, []);

  const filteredGirls = Array.isArray(girls)
    ? girls.filter(girl => {
        const matchesCity = filters.city === null || girl.city.slug === filters.city;
        const matchesSubarea = filters.subarea === null || girl.subarea.slug === filters.subarea;
        const matchesPrice = filters.price >= girl.ratePerHour;
        const matchesAge = filters.age >= girl.age;
        const matchesVideoCall = !filters.offersVideoCall || girl.offersVideoCall;

        const daysSinceCreation = differenceInDays(new Date(), parseISO(girl.createdAt));
        const matchesNew = !filters.isNew || daysSinceCreation <= 15;

        const matchesDistance =
          filters.latitude && filters.longitude
            ? getDistance(
                { latitude: filters.latitude, longitude: filters.longitude },
                { latitude: girl.latitude, longitude: girl.longitude },
              ) <= MAX_DISTANCE
            : true;

        return (
          matchesCity &&
          matchesSubarea &&
          matchesPrice &&
          matchesAge &&
          matchesVideoCall &&
          matchesNew &&
          matchesDistance
        );
      })
    : [];

  return (
    <>
      <Filter filters={filters} setFilters={handleFilterChange} />
      <h2 className="mt-8 text-3xl font-extrabold text-black">Escorts</h2>
      <div className="grid grid-cols-2 gap-2 py-6 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {filteredGirls.map(girl => (
          <Link key={girl.id} href={`/girls/${girl.slug}`}>
            <div className="cursor-pointer rounded-lg bg-zinc-950 p-2 shadow-lg transition-shadow duration-200 hover:shadow-xl">
              {girl.imageUrl ? (
                <img src={girl.imageUrl} alt={`${girl.name}`} className="mb-4 h-full w-full rounded-lg object-cover" />
              ) : (
                <div className="mb-4 h-80 rounded-lg bg-zinc-900"></div>
              )}
              <h3 className="mb-1 text-xl font-extrabold text-white">
                {girl.name} {girl.age}
              </h3>
              <p className="mb-3 text-sm font-light text-white">
                {girl.subarea || girl.city
                  ? `${girl.subarea.name || ''}${girl.subarea && girl.city ? ', ' : ''}${girl.city.name || ''}`
                  : 'Ubicación no especificada'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Girls;
