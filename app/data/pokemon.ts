export const TOTAL_POKEMON = 151;

export function getRandomPokemonId(): number {
  return Math.floor(Math.random() * TOTAL_POKEMON) + 1;
}
