import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center bg-gray-100 px-6 text-center">
      <h1 className="mb-4 mt-48 text-5xl font-bold text-zinc-950">404</h1>
      <p className="mb-8 text-2xl text-zinc-950">¡Ups! Página no encontrada</p>
      <p className="mb-8 text-zinc-950">Parece que la página que estás buscando no existe.</p>
      <Link href="/" className="rounded-lg bg-zinc-950 px-6 py-3 text-white">
        Volver a la página principal
      </Link>
    </div>
  );
};

export default NotFound;
