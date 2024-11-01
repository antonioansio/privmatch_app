import StoriesList from '@/components/StoriesList';
import Girls from '@/components/Girls';
import { notFound } from 'next/navigation';
import { getCityDetails } from '@/lib/actions';

const CityPage = async ({ params }: { params: { city: string } }) => {
  const { city } = await params;

  const cityDetails = await getCityDetails(city);

  if (!cityDetails) return notFound();

  return (
    <>
      <div className="container mx-auto px-4 sm:px-0">
        <StoriesList />
        <Girls city={city} />
      </div>
    </>
  );
};

export default CityPage;
