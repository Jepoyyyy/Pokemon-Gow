

import { useLoaderData, Link } from 'react-router';
import type { Route } from './+types/pokemon.$id';
import type { PokemonDetail as PokemonDetailType } from '../types/pokemon';
import PokemonDetail from '../components/pokemon/PokemonDetail';
import { getSpriteUrl } from '../utils/spriteUrl';
import {ArrowBigLeft} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export async function loader({ params }: Route.LoaderArgs) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
  if (!response.ok) {
    throw new Response('Pokemon not found', { status: 404 });
  }
  const pokemon: PokemonDetailType = await response.json();

  let evolutionChain: Array<{ id: number; name: string }> = [];
  try {
    const speciesRes = await fetch(pokemon.species.url);
    if (speciesRes.ok) {
      const speciesData = await speciesRes.json();
      const chainRes = await fetch(speciesData.evolution_chain.url);
      if (chainRes.ok) {
        const chainData = await chainRes.json();
        evolutionChain = parseEvolutionChain(chainData.chain);
      }
    }
  } catch {

  }

  return { pokemon, evolutionChain };
}

function parseEvolutionChain(chain: any): Array<{ id: number; name: string }> {
  const result: Array<{ id: number; name: string }> = [];

  const traverse = (node: any) => {
    const url = node.species.url;
    const id = parseInt(url.split('/').filter(Boolean).pop() || '0', 10);
    result.push({ id, name: node.species.name });

    if (node.evolves_to && node.evolves_to.length > 0) {
      node.evolves_to.forEach(traverse);
    }
  };

  traverse(chain);
  return result;
}

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Pokemon #${params.id} - Pokemon Detail` },
    { name: 'description', content: `Details about Pokemon #${params.id}` },
  ];
}

export default function PokemonDetailPage() {
  const { pokemon, evolutionChain } = useLoaderData<typeof loader>();

  const spriteUrl = getSpriteUrl(pokemon.id);

  const hp = pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0;
  const attack = pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
  const defense = pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0;
  const speed = pokemon.stats.find(s => s.stat.name === 'speed')?.base_stat || 0;

  const types = pokemon.types.map(t => t.type.name);
  const abilities = pokemon.abilities.map(a => a.ability.name);

  const getSavedPage = () => {
    try {
      const saved = localStorage.getItem('pokemon-home-page');
      const n = parseInt(saved || '', 10);
      return Number.isFinite(n) && n > 1 ? n : null;
    } catch { return null; }
  };

  const savedPage = getSavedPage();
  const backUrl = savedPage ? `/home?page=${savedPage}` : '/home';

  return (
    <div className="container mx-auto px-4 py-6 max-w-full">
      <Link
        to={backUrl}
        className="inline-flex rounded-xl  border-black hover:bg-black/40 bg-black/20 dark:bg-white/30 hover:dark:bg-white/40 p-3 items-center text-black dark:text-white hover:underline mb-6"
      >
        <ArrowBigLeft /> 
      </Link>

      <PokemonDetail
        id={pokemon.id}
        name={pokemon.name}
        sprite={spriteUrl}
        types={types}
        stats={{ hp, attack, defense, speed }}
        height={pokemon.height}
        weight={pokemon.weight}
        abilities={abilities}
        variant="home"
        evolutionChain={evolutionChain}
      />
    </div>
  );
}
