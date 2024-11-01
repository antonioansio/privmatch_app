import StoriesList from '@/components/StoriesList';
import Girls from '@/components/Girls';

const HomePage = () => {
  return (
    <>
      <div className="container mx-auto px-4 sm:px-0">
        <StoriesList />
        <Girls />
      </div>
    </>
  );
};

export default HomePage;
