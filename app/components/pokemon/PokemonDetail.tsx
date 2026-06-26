

import { Link } from 'react-router';
import { getSpriteUrl } from '../../utils/spriteUrl';


interface PokemonDetailProps {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  height: number;
  weight: number;
  abilities: string[];
  variant: 'home' | 'myPokemon';
  customName?: string;
  caughtAt?: string;
  onFree?: () => void;
  evolutionChain?: Array<{ id: number; name: string }>;
}

const typeColorMap: Record<string, string> = {
  fire: 'bg-[var(--color-type-fire)] text-white',
  water: 'bg-[var(--color-type-water)] text-white',
  grass: 'bg-[var(--color-type-grass)] text-white',
  electric: 'bg-[var(--color-type-electric)] text-gray-900',
  ice: 'bg-[var(--color-type-ice)] text-gray-900',
  fighting: 'bg-[var(--color-type-fighting)] text-white',
  poison: 'bg-[var(--color-type-poison)] text-white',
  ground: 'bg-[var(--color-type-ground)] text-gray-900',
  flying: 'bg-[var(--color-type-flying)] text-white',
  psychic: 'bg-[var(--color-type-psychic)] text-white',
  bug: 'bg-[var(--color-type-bug)] text-white',
  rock: 'bg-[var(--color-type-rock)] text-white',
  ghost: 'bg-[var(--color-type-ghost)] text-white',
  dragon: 'bg-[var(--color-type-dragon)] text-white',
  dark: 'bg-[var(--color-type-dark)] text-white',
  steel: 'bg-[var(--color-type-steel)] text-gray-900',
  fairy: 'bg-[var(--color-type-fairy)] text-white',
  normal: 'bg-[var(--color-type-normal)] text-white',
};

export default function PokemonDetail({
  id,
  name,
  sprite,
  types,
  stats,
  height,
  weight,
  abilities,
  variant,
  customName,
  caughtAt,
  onFree,
  evolutionChain,
}: PokemonDetailProps) {
  const maxStat = 255;

  return (
    <div className="w-full">
      {}
      <div className="text-center mb-8 animate-[fade-in_0.3s_ease-out] ">
        {}
        <div className="relative w-48 h-48 mx-auto mb-6 ">
          {}
          <div className="absolute inset-0  rounded-2xl" />
          {}
          <img
            src={sprite}
            alt={customName || name}
            className="relative z-10 w-full h-full object-contain"
          />
        </div>

        <div className='h-0.5 bg-black dark:bg-white w-full'></div>

        {variant === 'myPokemon' && customName && (
          <h1 className="text-4xl font-bold mt-6 text-gray-900 dark:text-gray-100">
           " {customName} "
          </h1>
        )}

        <h2 className={`
          ${variant === 'myPokemon' ? 'text-xl text-gray-600 dark:text-gray-400' : 'text-3xl font-bold text-gray-900 dark:text-gray-100 mt-6'}
          capitalize
        `}>
          {name}
        </h2>

        <p className="text-gray-500 dark:text-gray-500 text-lg mt-2">
          #{id.toString().padStart(3, '0')}
        </p>
      </div>

      {}
      <div className="mb-6 text-center">
  

  <div className="flex flex-wrap justify-center gap-4">
    {types.map((type) => (
      <span
        key={type}
        className={`
          ${typeColorMap[type] || 'bg-gray-400 text-white'}
          px-4 py-2 rounded-full text-sm font-medium  capitalize
        `}
      >
        {type}
      </span>
    ))}
  </div>
</div>

      {}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Stats
        </h3>
        <div className="space-y-3">
          {Object.entries(stats).map(([statName, value]) => (
            <div key={statName}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                  {statName}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {value}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700  h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-400 to-blue-400 h-2.5  transition-all duration-500"
                  style={{ width: `${(value / maxStat) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Physical Attributes
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-300/40 dark:bg-gray-800 flex justify-center items-center flex-col rounded-lg p-3 border-black/20 border-2 dark:border-white/20">
            <p className="text-sm text-gray-600 dark:text-gray-400">Height</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {(height / 10).toFixed(1)} m
            </p>
          </div>
          <div className="bg-gray-300/40 dark:bg-gray-800 flex justify-center items-center flex-col rounded-lg p-3 border-black/20 border-2 dark:border-white/20">
            <p className="text-sm text-gray-600 dark:text-gray-400">Weight</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {(weight / 10).toFixed(1)} kg
            </p>
          </div>
        </div>
      </div>

      {}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Abilities
        </h3>
        <ul className="space-y-2">
          {abilities.map((ability) => (
            <li
              key={ability}
              className="flex items-center text-gray-700 dark:text-gray-300"
            >
              <span className="w-2 h-2 bg-gradient-to-r from-white to-gray-500 dark:bg-white  mr-3 transform rotate-45 border-2 dark:border-white border-black  " />
              <span className="capitalize">{ability.replace('-', ' ')}</span>
            </li>
          ))}
        </ul>
      </div>

      {}
      {evolutionChain && evolutionChain.length > 1 && (
        <div className="mb-6 ">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Evolution Chain
          </h3>
          <div className="flex items-center gap-3 overflow-x-auto p-5">
            {evolutionChain.map((evo, index) => (
              <div key={evo.id} className="flex items-center gap-3 flex-shrink-0">
                <Link
                  to={`/pokemon/${evo.id}`}
                  className={`
                    flex flex-col items-center p-3 rounded-lg transition-all
                    ${evo.id === id
                      ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <img
                    src={getSpriteUrl(evo.id)}
                    alt={evo.name}
                    className="w-16 h-16 object-contain"
                  />
                  <span className="text-xs font-medium capitalize mt-1 text-gray-900 dark:text-gray-100">
                    {evo.name}
                  </span>
                </Link>
                {index < evolutionChain.length - 1 && (
                  <span className="text-gray-400 dark:text-gray-600 text-2xl">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      {variant === 'myPokemon' && caughtAt && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Caught At
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date(caughtAt).toLocaleString()}
          </p>
        </div>
      )}

      {}
      {variant === 'myPokemon' && onFree && (
        <button
          onClick={onFree}
          className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 mt-8"
        >
          FREE {customName}?
        </button>
      )}
    </div>
  );
}
