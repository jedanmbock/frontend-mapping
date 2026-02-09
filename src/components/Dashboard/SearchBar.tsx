'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { mapApi } from '@/services/api';
import { DivisionLevel } from '@/types';

interface SearchResult {
  id: number;
  name: string;
  level: DivisionLevel;
  parent_id: number;
}

interface SearchBarProps {
  onSelectZone: (zone: SearchResult) => void;
}

export default function SearchBar({ onSelectZone }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce de la recherche
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const res = await mapApi.get('/api/gis/search', { params: { q: query } });
          setResults(res.data);
          setIsOpen(true);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300); // Attendre 300ms après la frappe

    return () => clearTimeout(timer);
  }, [query]);

  // Fermer si on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (zone: SearchResult) => {
    onSelectZone(zone);
    setQuery(''); // On vide ou on garde le nom, au choix
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full mb-4 z-50">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une localité..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
        </div>
        {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                <X size={16} />
            </button>
        )}
      </div>

      {/* Dropdown Résultats */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 max-h-60 overflow-y-auto custom-scrollbar">
          {results.map((zone) => (
            <button
              key={`${zone.level}-${zone.id}`}
              onClick={() => handleSelect(zone)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0"
            >
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full shrink-0">
                <MapPin size={14} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{zone.name}</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                  {zone.level}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {isOpen && results.length === 0 && query.length >= 2 && !loading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl text-center text-sm text-gray-400 border border-gray-100 dark:border-gray-800">
              Aucun résultat
          </div>
      )}
    </div>
  );
}