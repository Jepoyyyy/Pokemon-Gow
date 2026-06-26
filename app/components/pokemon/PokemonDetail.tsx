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

const statColor: Record<string, string> = {
  hp:      'from-green-400 to-green-500',
  attack:  'from-red-400 to-orange-400',
  defense: 'from-blue-400 to-blue-500',
  speed:   'from-yellow-400 to-amber-400',
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
  const isMyPokemon = variant === 'myPokemon';
  const primaryType = types[0];
  const typeBg = typeColorMap[primaryType] ?? '';

  return (
    <div className="w-full space-y-8">

      {/* Hero */}
      <div className="text-center animate-[fade-in_0.3s_ease-out]">
        <div className="relative w-48 h-48 mx-auto mb-4">
          {/* Glow */}
          <div className={`absolute inset-4 rounded-full blur-2xl opacity-30 ${typeBg}`} />
          <img
            src={sprite}
            alt={customName || name}
            className="relative z-10 w-full h-full object-contain drop-shadow-xl"
          />
        </div>

        {isMyPokemon && customName && (
          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            "{customName}"
          </h1>
        )}

        <h2 className={`capitalize font-semibold mt-1
          ${isMyPokemon
            ? 'text-lg text-gray-500 dark:text-gray-400'
            : 'text-3xl font-bold text-gray-900 dark:text-gray-100 mt-4'
          }`}
        >
          {name}
        </h2>

        <span className="inline-block mt-1 text-sm font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full">
          #{id.toString().padStart(3, '0')}
        </span>

        {/* Types */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {types.map((type) => (
            <span
              key={type}
              className={`${typeColorMap[type] ?? 'bg-gray-400 text-white'} px-4 py-1 rounded-full text-sm font-semibold capitalize shadow-sm`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      <Divider />

      {/* Stats */}
      <Section title="Stats">
        <div className="space-y-3">
          {Object.entries(stats).map(([statName, value]) => (
            <div key={statName}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium capitalize text-gray-600 dark:text-gray-400">
                  {statName}
                </span>
                <span className="text-sm font-bold tabular-nums text-gray-900 dark:text-gray-100">
                  {value}
                  <span className="text-gray-400 dark:text-gray-600 font-normal"> / {maxStat}</span>
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${statColor[statName] ?? 'from-gray-400 to-gray-500'} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${(value / maxStat) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* Physical */}
      <Section title="Physical">
        <div className="grid grid-cols-2 gap-3">
          <StatBox label="Height" value={`${(height / 10).toFixed(1)} m`} />
          <StatBox label="Weight" value={`${(weight / 10).toFixed(1)} kg`} />
        </div>
      </Section>

      <Divider />

      {/* Abilities */}
      <Section title="Abilities">
        <div className="flex flex-wrap gap-2">
          {abilities.map((ability) => (
            <span
              key={ability}
              className="capitalize px-3 py-1.5 rounded-lg text-sm font-medium
                bg-gray-100 dark:bg-gray-800
                text-gray-700 dark:text-gray-300
                border border-gray-200 dark:border-gray-700"
            >
              {ability.replace('-', ' ')}
            </span>
          ))}
        </div>
      </Section>

      {/* Evolution Chain */}
      {evolutionChain && evolutionChain.length > 1 && (
        <>
          <Divider />
          <Section title="Evolution Chain">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-center">
              {evolutionChain.map((evo, index) => (
                <div key={evo.id} className="flex items-center gap-2 flex-shrink-0 py-4 ">
                  <Link
                    to={`/pokemon/${evo.id}`}
                    className={`flex flex-col items-center p-3 rounded-xl transition-all duration-150
                      ${evo.id === id
                        ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-400 dark:ring-blue-500'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-0.5'
                      }`}
                  >
                    <img
                      src={getSpriteUrl(evo.id)}
                      alt={evo.name}
                      className="w-16 h-16 object-contain"
                    />
                    <span className="text-xs font-semibold capitalize mt-1 text-gray-800 dark:text-gray-200">
                      {evo.name}
                    </span>
                  </Link>
                  {index < evolutionChain.length - 1 && (
                    <span className="text-gray-300 dark:text-gray-600 text-xl select-none">›</span>
                  )}
                </div>
              ))}
            </div>
          </Section>
        </>
      )}

      {/* Caught At */}
      {isMyPokemon && caughtAt && (
        <>
          <Divider />
          <Section title="Caught At">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(caughtAt).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </Section>
        </>
      )}

      {/* Free button */}
      {isMyPokemon && onFree && (
        <button
          onClick={onFree}
          className="w-full mt-4 py-4 rounded-xl font-bold text-white
            bg-red-500 hover:bg-red-600 active:scale-95
            transition-all duration-150 shadow-md shadow-red-200 dark:shadow-none"
        >
          Release {customName ?? name}
        </button>
      )}
    </div>
  );
}

/* ── Small reusable sub-components ── */

function Divider() {
  return <hr className="border-gray-100 dark:border-gray-800" />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5 rounded-xl p-4
      bg-gray-50 dark:bg-gray-800
      border border-gray-200 dark:border-gray-700"
    >
      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}