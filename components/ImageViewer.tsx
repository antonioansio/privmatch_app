import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

interface ImageViewerProps {
  images: { url: string }[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const ImageViewer = ({ images, currentIndex, onClose, onNext, onPrev }: ImageViewerProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <button onClick={onClose} className="absolute right-5 top-5 text-3xl text-white">
        <FaTimes />
      </button>

      <div className="flex items-center">
        <button onClick={onPrev} className="mr-5 text-3xl text-white">
          <FaChevronLeft />
        </button>

        <img src={images[currentIndex].url} alt="Imagen ampliada" className="max-h-full max-w-full rounded-lg" />

        <button onClick={onNext} className="ml-5 text-3xl text-white">
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
