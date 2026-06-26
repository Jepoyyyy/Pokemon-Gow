

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getItem, setItem } from '../utils/localStorage';
import type { MyPokemon } from '../types/pokemon';

interface MyPokemonContextValue {
  myPokemon: MyPokemon[];
  isLoading: boolean;
  addPokemon: (pokemon: MyPokemon) => void;
  removePokemon: (id: number, customName: string) => void;
  getPokemonById: (id: number) => MyPokemon | undefined;
  totalCaught: number;
}

const MyPokemonContext = createContext<MyPokemonContextValue | undefined>(undefined);

const STORAGE_KEY = 'my_pokemon';

export function MyPokemonProvider({ children }: { children: ReactNode }) {
  const [myPokemon, setMyPokemon] = useState<MyPokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getItem<MyPokemon[]>(STORAGE_KEY);
    if (stored && Array.isArray(stored)) {
      setMyPokemon(stored);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setItem(STORAGE_KEY, myPokemon);
    }
  }, [myPokemon, isLoading]);

  const addPokemon = (pokemon: MyPokemon) => {
    setMyPokemon(prev => [...prev, pokemon]);
  };

  const removePokemon = (id: number, customName: string) => {
    setMyPokemon(prev =>
      prev.filter(p => !(p.id === id && p.customName === customName))
    );
  };

  const getPokemonById = (id: number): MyPokemon | undefined => {
    return myPokemon.find(p => p.id === id);
  };

  const value: MyPokemonContextValue = {
    myPokemon,
    isLoading,
    addPokemon,
    removePokemon,
    getPokemonById,
    totalCaught: myPokemon.length,
  };

  return (
    <MyPokemonContext.Provider value={value}>
      {children}
    </MyPokemonContext.Provider>
  );
}

export function useMyPokemon() {
  const context = useContext(MyPokemonContext);
  if (context === undefined) {
    throw new Error('useMyPokemon must be used within a MyPokemonProvider');
  }
  return context;
}
