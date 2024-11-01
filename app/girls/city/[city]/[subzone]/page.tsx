import StoriesList from '@/components/StoriesList';
import Girls from '@/components/Girls';
import { notFound } from 'next/navigation';
import { getCityDetails, getSubzoneDetails } from '@/lib/actions';

const ZonePage = async ({ params }: { params: { city: string; subzone: string } }) => {
  const { city, subzone } = await params;

  const cityDetails = await getCityDetails(city);
  if (!cityDetails) return notFound();

  const subzoneDetails = await getSubzoneDetails(subzone);
  if (!subzoneDetails) return notFound();

  return (
    <>
      <div className="container mx-auto px-4 sm:px-0">
        <StoriesList />
        <Girls city={city} subzone={subzone} />
      </div>
    </>
  );
};

export default ZonePage;
