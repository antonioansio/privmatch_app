import { useState, useEffect } from 'react';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FiChevronDown, FiChevronUp, FiCheck, FiX } from 'react-icons/fi';
import Dropdown from './Dropdown';

interface Location {
  name: string;
  slug: string;
  subareas?: Location[];
}

interface Filters {
  city: string | null;
  subarea: string | null;
  price: number;
  age: number;
  offersVideoCall: boolean;
  isNew: boolean;
  latitude?: number;
  longitude?: number;
}

interface FilterProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const Filter = ({ filters, setFilters }: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState<Location[]>([]);
  const [subareas, setSubareas] = useState<Location[]>([]);
  const [city, setCity] = useState<Location | null>(null);
  const [zone, setZone] = useState<Location | null>(null);

  useEffect(() => {
    async function fetchLocations() {
      const response = await fetch('/api/locations');
      const data = await response.json();
      setCities(data.cities || []);

      const initialCity = data.cities.find((c: Location) => c.slug === filters.city);
      if (initialCity) {
        setCity(initialCity);
        setSubareas(initialCity.subareas || []);
      }

      if (filters.subarea && initialCity) {
        const initialZone = initialCity.subareas?.find(z => z.slug === filters.subarea);
        if (initialZone) setZone(initialZone);
      }
    }
    fetchLocations();
  }, [filters.city, filters.subarea]);

  const toggleFilters = () => setIsOpen(!isOpen);

  const handleCityChange = (selectedCity: Location | null) => {
    console.log(selectedCity);
    setCity(selectedCity);
    setZone(null);
    setSubareas(selectedCity ? selectedCity.subareas || [] : []);
    setFilters({
      ...filters,
      city: selectedCity ? selectedCity.slug : null,
      subarea: null,
    });
  };

  const handleZoneChange = (selectedZone: Location | null) => {
    setZone(selectedZone);
    setFilters({
      ...filters,
      subarea: selectedZone ? selectedZone.slug : null,
    });
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      price: Number(event.target.value),
    });
  };

  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, age: Number(event.target.value) });
  };

  const handleVideoCallChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      offersVideoCall: event.target.checked,
    });
  };

  const handleNewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      isNew: event.target.checked,
    });
  };

  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setFilters({
          ...filters,
          latitude,
          longitude,
        });
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="rounded-lg text-white">
      <button onClick={toggleFilters} className="flex w-full items-center justify-between rounded-lg bg-zinc-900 p-5">
        <span>Filtros de búsqueda</span>
        {isOpen ? <FiChevronUp className="text-xl" /> : <FiChevronDown className="text-xl" />}
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        <div className="mt-1 grid grid-cols-1 gap-5 rounded-lg bg-zinc-950 p-4">
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <Dropdown label="Elige una ciudad" options={cities} selected={city} onSelect={handleCityChange} />

            <Dropdown
              label="Elige una zona"
              options={subareas}
              selected={zone}
              onSelect={handleZoneChange}
              disabled={!city}
            />

            <button onClick={handleLocationSearch} className="flex items-center gap-2 rounded-lg bg-zinc-900 p-2">
              <HiOutlineLocationMarker className="text-lg text-white" /> Ubicación
            </button>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <div className="flex w-full flex-col">
              <label className="mb-1">Precio: {filters.price}€</label>
              <input
                type="range"
                min="0"
                max="1500"
                step="100"
                value={filters.price}
                onChange={handlePriceChange}
                className="w-full"
              />
            </div>

            <div className="flex w-full flex-col">
              <label className="mb-1">Edad: {filters.age} años</label>
              <input type="range" min="18" max="60" value={filters.age} onChange={handleAgeChange} className="w-full" />
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <label className="relative flex w-full items-center">
              <input
                type="checkbox"
                checked={filters.offersVideoCall}
                onChange={handleVideoCallChange}
                className="peer appearance-none"
              />
              <span className="flex w-full cursor-pointer select-none items-center gap-2 rounded-lg border-2 border-zinc-900 p-2 text-white transition-colors duration-200 ease-in-out peer-checked:border-white peer-checked:text-white">
                {filters.offersVideoCall ? <FiCheck className="text-xl" /> : <FiX className="text-xl" />}
                Videollamada
              </span>
            </label>

            <label className="relative flex w-full items-center">
              <input
                type="checkbox"
                checked={filters.isNew}
                onChange={handleNewChange}
                className="peer appearance-none"
              />
              <span className="flex w-full cursor-pointer select-none items-center gap-2 rounded-lg border-2 border-zinc-900 p-2 text-white transition-colors duration-200 ease-in-out peer-checked:border-white peer-checked:text-white">
                {filters.isNew ? <FiCheck className="text-xl" /> : <FiX className="text-xl" />}
                Novedades (Últimos 15 días)
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
