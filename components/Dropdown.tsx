import { useState, useEffect, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface Option {
  name: string;
  slug: string;
}

interface DropdownProps {
  label: string;
  options: Option[];
  selected: Option | null;
  onSelect: (option: Option | null) => void;
  disabled?: boolean;
}

const Dropdown = ({ label, options, selected, onSelect, disabled }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!disabled) setOpen(prevOpen => !prevOpen);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const filteredOptions = options.filter(option => option.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div ref={dropdownRef} className="dropdown relative w-full">
      <button
        onClick={toggleDropdown}
        className={`flex w-full items-center justify-between rounded-lg bg-zinc-900 p-2 ${
          open ? 'ring-blue-600' : ''
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        disabled={disabled}
      >
        <span>{selected?.name || label}</span>
        <FiChevronDown className="text-xl" />
      </button>

      {open && !disabled && (
        <div className="absolute z-10 mt-1 w-full rounded-lg bg-zinc-900 p-1">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
            className="mb-2 w-full rounded-lg bg-zinc-800 p-2 text-white outline-none"
          />

          <ul>
            <li
              key="all"
              className="mb-1 cursor-pointer select-none rounded-lg p-2 hover:bg-zinc-950"
              onClick={() => {
                onSelect(null);
                setOpen(false);
                setSearchQuery('');
              }}
            >
              Todos los resultados
            </li>

            {filteredOptions.map(option => (
              <li
                key={option.slug}
                className={`mb-1 cursor-pointer select-none rounded-lg p-2 hover:bg-zinc-950 ${
                  selected?.slug === option.slug ? 'bg-zinc-950' : ''
                }`}
                onClick={() => {
                  onSelect(option);
                  setOpen(false);
                  setSearchQuery('');
                }}
              >
                {option.name}
              </li>
            ))}

            {filteredOptions.length === 0 && <li className="p-2 text-gray-400">No hay resultados</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
