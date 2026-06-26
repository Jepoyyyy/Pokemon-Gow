

import { useState, useEffect } from 'react';
import { useSearchParams, useLoaderData } from 'react-router';
import type { Route } from './+types/home';
import PokemonCard from '../components/pokemon/PokemonCard';
import LoadingPokeball from '../components/ui/LoadingPokeball';
import { getListSpriteUrl } from '../utils/spriteUrl';
import {ArrowBigRight,ArrowBigLeft} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ITEMS_PER_PAGE = 20;
const LS_KEY = 'pokemon-home-page';

function getSavedPage(): number | null {
  try {
    const saved = localStorage.getItem(LS_KEY);
    const n = parseInt(saved || '', 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch { return null; }
}

function savePage(page: number): void {
  try { localStorage.setItem(LS_KEY, String(page)); } catch {  }
}

interface PokemonItem {
  name: string;
  url: string;
}

function extractIdFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

export function meta() {
  return [
    { title: 'Home - Pokemon Game' },
    { name: 'description', content: 'Browse all Pokemon' },
  ];
}

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const raw = url.searchParams.get('page');
  return { urlPage: raw ? Math.max(1, parseInt(raw, 10) || 1) : null };
}

export default function HomePage() {
  const { urlPage } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(() => urlPage ?? getSavedPage() ?? 1);
  const [pokemonList, setPokemonList] = useState<PokemonItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError('');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        if (cancelled) return;
        setPokemonList(data.results || []);
        setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message || 'Failed to load Pokemon');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [currentPage, retryKey]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    savePage(page);
    setSearchParams(page > 1 ? { page: String(page) } : {});
  };

  const handlePrevious = () => {
    goToPage(currentPage - 1);
  };

  const handleNext = () => {
    goToPage(currentPage + 1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 text-center">
          <p className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </p>
        </div>
        <LoadingPokeball />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <p className="text-red-500 dark:text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => setRetryKey(k => k + 1)}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (pokemonList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No Pokemon found.
          </p>
        </div>
      </div>
    );
  }
  const { theme, toggleTheme } = useTheme();  

  return (
    <div className="container mx-auto px-4 py-6">

      {}
      <div className="mb-6 text-center">
        <p className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {pokemonList.map((pokemon, index) => {
          const id = extractIdFromUrl(pokemon.url);
          const spriteUrl = getListSpriteUrl(id);

          return (
            <PokemonCard
              key={pokemon.url}
              id={id}
              name={pokemon.name}
              sprite={spriteUrl}
              variant="home"
              priority={currentPage === 1 && index < 2}
              lazyLoad={index >= 4}
            />
          );
        })}
      </div>

      {}
      <div className="flex items-center justify-center gap-4 pb-8">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="
            px-3 py-3 rounded-lg font-semibold text-lg
            hover:bg-red-400/20
            border-3 dark:border-white border-black
            dark:hover:bg-white/20
            text-white transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:bg-blue-500 dark:disabled:hover:bg-blue-600"
        >
         <ArrowBigLeft className="text-black dark:text-white" />
        </button>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="
            px-3 py-3 rounded-lg font-semibold text-lg
            hover:bg-red-400/20
            border-3 dark:border-white border-black
            dark:hover:bg-white/20
            text-white transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:bg-blue-500 dark:disabled:hover:bg-blue-600">
        <ArrowBigRight className='text-black dark:text-white'></ArrowBigRight>
        </button>
      </div>
    </div>
  );
}
