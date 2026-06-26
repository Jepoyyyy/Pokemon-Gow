

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

  return (
    <Link
      to={to}
      className="block focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-xl"
    >
      <Card
        size="sm"
        className={`
          hover:shadow-lg  duration-200 animate-[fade-in_0.3s_ease-out]
          hover:bg-white/20
          ${variant === 'myPokemon'
            ? 'border-2 rounded-2xl  border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
            : 'border-2 rounded-2xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
          }
        `}
      >
        <CardContent className="flex flex-col items-center text-center">
          {}
          <div className="relative w-24 h-24 mb-0">
            <div className="absolute inset-0 dark:from-blue-900/30 dark:to-green-900/30 rounded-lg" />
            <img
              src={imageUrl}
              alt={customName || name}
              className="relative z-10 w-full h-full object-contain"
              loading={lazyLoad ? 'lazy' : undefined}
              fetchPriority={priority ? 'high' : undefined}
            />
          </div>

          {variant === 'myPokemon' && customName && (
            <div className="mt-3 font-bold text-lg text-gray-900 dark:text-gray-100">
              {customName}
            </div>
          )}

          <div className={`
            ${variant === 'myPokemon'
              ? 'text-sm text-gray-600 dark:text-gray-400'
              : 'mt-3 font-medium text-gray-900 dark:text-gray-100'
            }
            capitalize
          `}>
            {name}
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            #{id.toString().padStart(3, '0')}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default memo(PokemonCard);
