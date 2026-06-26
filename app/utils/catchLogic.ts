

export const attemptCatch = (): boolean => {
  return Math.random() < 0.5;
};

export const shouldPokemonFlee = (attempts: number): boolean => {
  return attempts >= 5;
};

export const getRandomPokemon = <T>(list: T[]): T | null => {
  if (!list || list.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
};
