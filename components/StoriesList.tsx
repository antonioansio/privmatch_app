import Story from './Story';

const StoriesList = () => {
  return (
    <>
      <h2 className="mb-3 mt-10 text-3xl font-extrabold text-black">Para ti</h2>
      <div className="mx-auto mb-5 flex w-full py-6">
        <div className="scrollbar-hide flex w-full snap-x snap-mandatory justify-start gap-4 overflow-x-scroll">
          <Story index={0} hasImage={true} />
          {[...Array(3)].map((_, index) => (
            <Story key={index + 1} index={index + 1} />
          ))}
        </div>
      </div>
    </>
  );
};

export default StoriesList;
