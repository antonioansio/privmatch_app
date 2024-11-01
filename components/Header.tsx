import Link from 'next/link';

const Header = () => {
  return (
    <div className="sticky top-0 z-10 bg-zinc-950 py-4 shadow-md">
      <div className="container mx-auto flex flex-row items-center gap-8 px-4 sm:px-0">
        <a href="/" className="flex items-center space-x-1">
          <span className="text-2xl font-extrabold text-white">Priv</span>
          <span className="flex items-center justify-center rounded-lg bg-white p-1 text-2xl font-black text-black">
            Match
          </span>
        </a>
        <div className="flex grow items-center gap-6">
          <Link href="/girls/city/barcelona" className="text-md hidden font-medium text-white xl:block">
            Escorts Barcelona
          </Link>
          <Link href="/girls/city/madrid" className="text-md hidden font-medium text-white xl:block">
            Escorts Madrid
          </Link>
        </div>
        <div className="relative inline-block">
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black">
              Publicar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
