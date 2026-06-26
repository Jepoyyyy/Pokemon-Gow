import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router';
import { useMyPokemon } from '../context/MyPokemonContext';
import type { Route } from './+types/my-pokemon.$id';
import type { MyPokemon } from '../types/pokemon';
import PokemonDetail from '../components/pokemon/PokemonDetail';
import { getDetailSpriteUrl } from '../utils/spriteUrl';
import { ArrowBigLeft } from 'lucide-react';

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `My Pokemon #${params.id} - Pokemon Game` },
    { name: 'description', content: 'View your caught Pokemon details' },
  ];
}

export default function MyPokemonDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { myPokemon, removePokemon } = useMyPokemon();

  const [pokemon, setPokemon] = useState<MyPokemon | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Find the pokemon by ID and custom name from query
  useEffect(() => {
    const id = parseInt(params.id || '0', 10);
    const customName = searchParams.get('name');

    if (id && customName) {
      const found = myPokemon.find(
        p => p.id === id && p.customName === customName
      );
      setPokemon(found || null);
    }
  }, [params.id, searchParams, myPokemon]);

  const handleFreeClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmFree = () => {
    if (pokemon) {
      removePokemon(pokemon.id, pokemon.customName);
      setShowConfirmModal(false);
      navigate('/my-pokemon');
    }
  };

  const handleCancelFree = () => {
    setShowConfirmModal(false);
  };

  // Handle ESC key for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showConfirmModal) {
        setShowConfirmModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showConfirmModal]);

  if (!pokemon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="text-xl mb-6 text-gray-600 dark:text-gray-400">
          Pokemon not found in your collection
        </div>
        <Link
          to="/my-pokemon"
          className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Back to My Pokemon
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-full">
      <Link
        to="/my-pokemon"
        className="inline-flex rounded-xl  border-black hover:bg-black/40 bg-black/20 dark:bg-white/30 hover:dark:bg-white/40 p-3 items-center text-black dark:text-white hover:underline mb-6"
      >
        <ArrowBigLeft /> 
      </Link>

      <PokemonDetail
        id={pokemon.id}
        name={pokemon.name}
        sprite={getDetailSpriteUrl(pokemon.id)}
        types={pokemon.types}
        stats={pokemon.stats}
        height={pokemon.height}
        weight={pokemon.weight}
        abilities={pokemon.abilities}
        variant="myPokemon"
        customName={pokemon.customName}
        caughtAt={pokemon.caughtAt}
        onFree={handleFreeClick}
      />

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full animate-[fade-in_0.3s_ease-out]">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Are you sure?
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Do you really want to release <strong className="text-gray-900 dark:text-gray-100">{pokemon.customName}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmFree}
                className="flex-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Yes, Release
              </button>
              <button
                onClick={handleCancelFree}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
