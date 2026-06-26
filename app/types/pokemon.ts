

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonType {
  type: {
    name: string;
    url: string;
  };
  slot: number;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonDetail {
  species: any;
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: {
    front_default: string | null;
    other: {
      'official-artwork': {
        front_default: string;
      };
      showdown?: {
        front_default: string | null;
      };
    };
  };
}

export interface MyPokemon {
  id: number;
  name: string;
  customName: string;
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
  caughtAt: string;
}

export type CatchPhase = 'appearing' | 'battle' | 'caught' | 'gone' | 'nickname';
