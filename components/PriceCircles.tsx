import { FaEuroSign } from 'react-icons/fa';

interface PriceCirclesProps {
  rate: number;
}

const PriceCircles: React.FC<PriceCirclesProps> = ({ rate }) => {
  const maxCircles = 5;
  const filledCircles = Math.min(Math.ceil(rate / 100), maxCircles);

  return (
    <div className="mb-5 mt-3 flex space-x-2">
      {[...Array(filledCircles)].map((_, index) => (
        <div key={index} className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500">
          <FaEuroSign className="text-md text-white" />
        </div>
      ))}
      {[...Array(maxCircles - filledCircles)].map((_, index) => (
        <div key={index} className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900">
          <FaEuroSign className="text-md text-white" />
        </div>
      ))}
    </div>
  );
};

export default PriceCircles;
