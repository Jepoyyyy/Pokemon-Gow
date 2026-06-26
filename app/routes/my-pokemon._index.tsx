

import { Link } from 'react-router';
import { useMyPokemon } from '../context/MyPokemonContext';
import type { Route } from './+types/my-pokemon._index';
import PokemonCard from '../components/pokemon/PokemonCard';
import LoadingPokeball from '../components/ui/LoadingPokeball';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'My Pokemon - Pokemon Game' },
    { name: 'description', content: 'View your Pokemon collection' },
  ];
}

export default function MyPokemonPage() {
  const { myPokemon, isLoading, totalCaught } = useMyPokemon();

  if (isLoading) {
    return <LoadingPokeball />;
  }

  if (myPokemon.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          My Pokemon
        </h1>
        <div className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          No Pokemon yet. Go catch some!
        </div>
        <Link
          to="/catch"
          className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Go Catch Pokemon
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          My Pokemon
        </h1>
        <div className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
          {totalCaught} / 151 Caught
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {myPokemon.map((pokemon, index) => (
          <PokemonCard
            key={`${pokemon.id}-${pokemon.customName}-${index}`}
            id={pokemon.id}
            name={pokemon.name}
            sprite={pokemon.sprite}
            variant="myPokemon"
            customName={pokemon.customName}
          />
        ))}
      </div>
    </div>
  );
}
