type StoryProps = {
  index: number;
  hasImage?: boolean;
};

const Story = ({ index, hasImage = false }: StoryProps) => {
  return (
    <div className="flex min-w-[80px] cursor-pointer snap-center flex-col items-center sm:min-w-[90px] md:min-w-[100px]">
      <div
        className={`relative h-24 w-24 md:h-28 md:w-28 ${
          hasImage
            ? 'animate-pulse rounded-full bg-gradient-to-tr from-red-500 to-purple-500 p-1'
            : 'rounded-full bg-zinc-900 p-1 shadow-md hover:shadow-lg'
        }`}
      >
        {hasImage ? (
          <img
            src="https://placehold.co/160x140"
            alt={`Historia ${index}`}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <div className="h-full w-full rounded-full bg-zinc-800"></div>
        )}
      </div>
      <p className="mt-3 text-center text-xs font-medium text-gray-500">Historia {index}</p>
    </div>
  );
};

export default Story;
