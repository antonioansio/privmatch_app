'use client';

import { FaPhoneAlt, FaCreditCard, FaWhatsapp } from 'react-icons/fa';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import PriceCircles from '@/components/PriceCircles';
import ImageViewer from '@/components/ImageViewer';

const GirlProfilePage = ({ params }: { params: { girlId: string } }) => {
  const { girlId } = params;
  const [girl, setGirl] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchGirlProfile = async () => {
      try {
        const response = await fetch(`/api/girls/${girlId}`);
        if (!response.ok) throw new Error('Failed to fetch girl profile');
        const data = await response.json();
        setGirl(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setGirl(null);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchGirlProfile();
    if (isImageViewerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [girlId, isImageViewerOpen]);

  if (loading) {
    return (
      <div className="relative h-2 w-full bg-gray-200">
        <div
          className="absolute left-0 top-0 h-2 bg-blue-500"
          style={{
            width: '100%',
            animation: 'load 1s ease-in-out',
          }}
        />
        <style jsx>{`
          @keyframes load {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }
        `}</style>
      </div>
    );
  }

  if (!girl) return notFound();

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => setIsImageViewerOpen(false);

  const nextImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % girl.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex - 1 + girl.images.length) % girl.images.length);
  };

  const center = girl.location
    ? { lat: girl.location.latitude, lng: girl.location.longitude }
    : { lat: 40.416775, lng: -3.70379 };

  return (
    <div className="container mx-auto mt-10 px-4 sm:px-0">
      {/* Detalles del perfil */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="mb-2 text-3xl font-extrabold text-black">{girl.name}</h2>
        <div className="flex space-x-4">
          <a
            href={`tel:${girl.phoneNumber}`}
            className="flex items-center rounded-lg bg-black px-5 py-4 text-white shadow"
          >
            <FaPhoneAlt className="mr-5 text-lg" /> Teléfono
          </a>
          {girl.acceptsWhatsApp && (
            <a
              href={`https://wa.me/${girl.phoneNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center rounded-lg bg-green-500 px-5 py-4 text-white shadow"
            >
              <FaWhatsapp className="mr-5 text-xl" /> Whatsapp
            </a>
          )}
        </div>
      </div>

      <div className="mb-10 flex flex-col gap-6 lg:flex-row">
        {/* Información detallada */}
        <div className="rounded-lg bg-zinc-950 p-4 shadow-lg lg:w-1/3">
          <h2 className="mb-3 text-2xl text-white">Detalles:</h2>
          <p className="mb-2 text-lg font-light text-white">
            Ubicación actual:{' '}
            {girl.subarea ? (
              <>
                <Link
                  href={`/girls/city/${girl.city?.slug}/${girl.subarea.slug}`}
                  className="underline hover:text-yellow-500"
                >
                  {girl.subarea.name}
                </Link>
                ,{' '}
                <Link href={`/girls/city/${girl.city?.slug}`} className="underline hover:text-yellow-500">
                  {girl.city?.name}
                </Link>
              </>
            ) : girl.city ? (
              <Link href={`/girls/${girl.city.slug}`} className="underline hover:text-yellow-500">
                {girl.city.name}
              </Link>
            ) : (
              'Ubicación no especificada'
            )}
          </p>
          <p className="mb-2 text-lg font-light text-white">Edad: {girl.age} años</p>
          <p className="mb-2 text-lg font-light text-white">Nacionalidad: {girl.nationality}</p>
          <p className="mb-2 text-lg font-light text-white">Altura: {girl.heightCm} cm</p>
          <p className="mb-2 text-lg font-light text-white">Peso: {girl.weightKg} kg</p>
          <p className="mb-2 text-lg font-light text-white">
            Tarifa por hora: <span className="font-bold">{Number(girl.ratePerHour).toFixed(2)}€</span>
          </p>
          <PriceCircles rate={girl.ratePerHour} />
          {girl.acceptsCard && (
            <p className="mb-5 flex items-center text-lg font-light text-white">
              <FaCreditCard className="mr-2 h-8 w-8 text-white" /> Acepta tarjeta
            </p>
          )}
          <h2 className="mb-3 text-2xl text-white">Idiomas:</h2>
          <div className="mb-5 flex flex-wrap gap-2">
            {girl.languages.length > 0 ? (
              girl.languages.map(({ language }) => (
                <span key={language.id} className="rounded-lg bg-white px-3 py-1 text-sm font-light text-black">
                  {language.name}
                </span>
              ))
            ) : (
              <p className="text-lg font-light text-white">No hay idiomas disponibles.</p>
            )}
          </div>
          <h2 className="mb-3 text-2xl text-white">Sobre mí:</h2>
          <p className="mb-5 text-lg font-light text-white">{girl.description}</p>
          <h2 className="mb-3 text-2xl text-white">Servicios:</h2>
          <div className="mb-5 flex flex-wrap gap-2">
            {girl.services.length > 0 ? (
              girl.services.map(service => (
                <span key={service.id} className="rounded-lg bg-white px-3 py-1 text-sm font-light text-black">
                  {service.name}
                </span>
              ))
            ) : (
              <p className="text-lg font-light text-white">No hay servicios disponibles.</p>
            )}
          </div>
        </div>
        <div className="rounded-lg bg-zinc-950 p-5 shadow-lg lg:w-2/3">
          <div className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-3">
            {girl.images.length > 0 ? (
              girl.images.map((image, index) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt="Imagen de la escort"
                  className={`h-full w-full cursor-pointer rounded-lg object-cover shadow-md ${
                    image.isPrimary ? 'border-4 border-yellow-500' : ''
                  }`}
                  onClick={() => openImageViewer(index)}
                />
              ))
            ) : (
              <p className="text-lg text-white">No hay imágenes disponibles.</p>
            )}
          </div>
          <h2 className="mb-3 text-2xl text-white">Ubicación:</h2>
          <div className="h-72 w-full">
            {isLoaded ? (
              <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={center} zoom={15}>
                <Marker position={center} />
              </GoogleMap>
            ) : (
              <p className="text-lg text-white">Cargando mapa...</p>
            )}
          </div>
        </div>
      </div>

      {isImageViewerOpen && (
        <ImageViewer
          images={girl.images}
          currentIndex={currentImageIndex}
          onClose={closeImageViewer}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
};

export default GirlProfilePage;
