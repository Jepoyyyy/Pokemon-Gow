import { Link } from 'react-router';
import { memo } from 'react';
import { getListSpriteUrl } from '../../utils/spriteUrl';
import { Card, CardContent } from '../ui/card';

interface PokemonCardProps {
  id: number;
  name: string;
  sprite: string;
  variant: 'home' | 'myPokemon';
  customName?: string;
  priority?: boolean;
  lazyLoad?: boolean;
}

function PokemonCard({
  id,
  name,
  sprite,
  variant,
  customName,
  priority = false,
  lazyLoad = false,
}: PokemonCardProps) {
  const imageUrl = getListSpriteUrl(id);
  const to =
    variant === 'home'
      ? `/pokemon/${id}`
      : `/my-pokemon/${id}?name=${encodeURIComponent(customName || '')}`;

  const isMyPokemon = variant === 'myPokemon';

  return (
    <Link
      to={to}
      className="block focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-2xl"
    >
      <Card
        size="sm"
        className={`
          group border-2 rounded-2xl transition-all duration-200
          animate-[fade-in_0.3s_ease-out]
          hover:shadow-xl hover:-translate-y-0.5
          ${isMyPokemon
            ? 'border-green-400 dark:border-green-600 bg-gradient-to-b from-green-50 to-white dark:from-green-900/20 dark:to-gray-800'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
          }
        `}
      >
        <CardContent className="flex flex-col items-center text-center p-3">
          {/* Sprite */}
          <div className="relative w-24 h-24">
            <div className={`
              absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300
              ${isMyPokemon ? 'bg-green-300 dark:bg-green-700' : 'bg-blue-200 dark:bg-blue-900'}
            `} />
            <img
              src={imageUrl}
              alt={customName || name}
              className="relative z-10 w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-200"
              loading={lazyLoad ? 'lazy' : undefined}
              fetchPriority={priority ? 'high' : undefined}
            />
          </div>

          {/* Custom name */}
          {isMyPokemon && customName && (
            <div className="mt-2 font-bold text-base leading-tight text-gray-900 dark:text-gray-100 truncate w-full">
              {customName}
            </div>
          )}

          {/* Species name */}
          <div className={`
            capitalize truncate w-full leading-tight
            ${isMyPokemon
              ? 'text-xs text-gray-500 dark:text-gray-400 mt-0.5'
              : 'text-sm font-semibold text-gray-800 dark:text-gray-100 mt-2'
            }
          `}>
            {name}
          </div>

          {/* Dex number */}
          <div className={`
            text-xs font-mono mt-1 px-2 py-0.5 rounded-full
            ${isMyPokemon
              ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }
          `}>
            #{id.toString().padStart(3, '0')}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default memo(PokemonCard);