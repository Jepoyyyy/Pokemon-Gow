

import { useState, useEffect, useCallback } from 'react';
import { useMyPokemon } from '../context/MyPokemonContext';
import { attemptCatch, shouldPokemonFlee } from '../utils/catchLogic';
import type { PokemonDetail, CatchPhase } from '../types/pokemon';
import LoadingPokeball from '../components/ui/LoadingPokeball';
import Toast from '../components/ui/Toast';
import { getRandomPokemonId } from '../data/pokemon';
import background from '../assets/battleground-4W-D7Jj0.png';

export function meta() {
  return [
    { title: 'Catch Pokemon - Pokemon Game' },
    { name: 'description', content: 'Catch wild Pokemon!' },
  ];
}

export default function CatchPage() {
  const { addPokemon } = useMyPokemon();

  const [currentPokemon, setCurrentPokemon] = useState<PokemonDetail | null>(null);
  const [habitat, setHabitat] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [catchAttempts, setCatchAttempts] = useState(0);
  const [phase, setPhase] = useState<CatchPhase>('appearing');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nickname, setNickname] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchRandomPokemon = useCallback(async () => {
    setIsLoading(true);
    setImageLoaded(false);
    setMessage('');
    setCatchAttempts(0);
    setPhase('appearing');
    setCurrentPokemon(null);
    setHabitat('');

    try {
      const id = getRandomPokemonId();
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!response.ok) throw new Error('Failed to fetch pokemon');

      const pokemon: PokemonDetail = await response.json();
      setCurrentPokemon(pokemon);
      setPhase('battle');

      try {
        const speciesRes = await fetch(pokemon.species.url);
        if (speciesRes.ok) {
          const speciesData = await speciesRes.json();
          if (speciesData.habitat) {
            setHabitat(speciesData.habitat.name);
          }
        }
      } catch (error) {
        console.error('Failed to fetch habitat:', error);

      }
    } catch (error) {
      console.error('Error fetching pokemon:', error);
      setMessage('Failed to load pokemon');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomPokemon();
  }, [fetchRandomPokemon]);

  const handleCatch = () => {
    if (!currentPokemon || phase !== 'battle') return;

    const newAttempts = catchAttempts + 1;
    setCatchAttempts(newAttempts);

    const success = attemptCatch();

    if (success) {
      setPhase('caught');
      setMessage(`You caught ${currentPokemon.name}!`);
      setShowNicknameModal(true);
    } else {
      if (shouldPokemonFlee(newAttempts)) {
        setPhase('gone');
        setMessage(`${currentPokemon.name.toUpperCase()} ALREADY GONE`);
        setTimeout(() => {
          fetchRandomPokemon();
        }, 3000);
      } else {
        setMessage(`Oh no! ${currentPokemon.name} broke free!`);
      }
    }
  };

  const handleRun = () => {
    fetchRandomPokemon();
  };

  const handleNicknameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPokemon || !nickname.trim()) return;

    const caughtPokemon = {
      id: currentPokemon.id,
      name: currentPokemon.name,
      customName: nickname.trim(),
      sprite: currentPokemon.sprites.other.showdown?.front_default ||
              currentPokemon.sprites.other['official-artwork'].front_default,
      types: currentPokemon.types.map(t => t.type.name),
      stats: {
        hp: currentPokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
        attack: currentPokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
        defense: currentPokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
        speed: currentPokemon.stats.find(s => s.stat.name === 'speed')?.base_stat || 0,
      },
      height: currentPokemon.height,
      weight: currentPokemon.weight,
      abilities: currentPokemon.abilities.map(a => a.ability.name),
      caughtAt: new Date().toISOString(),
    };

    addPokemon(caughtPokemon);
    setShowNicknameModal(false);
    setNickname('');

    setToastMessage(`You caught ${currentPokemon.name}!`);
    setShowToast(true);

    setTimeout(() => {
      fetchRandomPokemon();
    }, 500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showNicknameModal) {
        setShowNicknameModal(false);
        setNickname('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNicknameModal]);

  if (isLoading || !currentPokemon) {
    return <LoadingPokeball />;
  }

  const spriteUrl = currentPokemon.sprites.other.showdown?.front_default ||
                    currentPokemon.sprites.other['official-artwork'].front_default;

  return (
    <div className="container mx-auto px-4 py-6 max-w-full">
      <div className="mx-auto">
        {}
        <div
  className="rounded-2xl p-6 shadow-xl bg-cover bg-center bg-no-repeat relative overflow-hidden"
  style={{
    backgroundImage: `url(${background})`,
  }}
>
          
          {}
          <div className="text-center bg-red-500 dark:bg-red-600 text-white text-2xl font-bold py-4 px-6 rounded-xl mb-6 animate-[fade-in_0.3s_ease-out]">
            {currentPokemon.name.toUpperCase()} IS APPEAR!!!
          </div>

          {}
          {habitat && (
            <div className="text-center bg-blue-500 dark:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg mb-6 animate-[fade-in_0.3s_ease-out] uppercase">
              Found in: {habitat}
            </div>
          )}

          {}
          <div className=" rounded-xl p-8 mb-6 flex justify-center items-center min-h-[250px]">
            {!imageLoaded && (
              <div className="text-gray-600 dark:text-gray-400 text-lg animate-pulse">
                Loading sprite...
              </div>
            )}
            <img
              src={spriteUrl}
              alt={currentPokemon.name}
              onLoad={() => setImageLoaded(true)}
              className={`w-48 h-48 object-contain drop-shadow-2xl transition-opacity duration-300 ${
                imageLoaded
                  ? 'animate-[float_2s_ease-in-out_infinite] opacity-100'
                  : 'opacity-0 absolute'
              }`}
            />
          </div>

          {}
          {message && (
            <div className={`
              text-center py-3 px-6 rounded-lg mb-6 font-semibold animate-[fade-in_0.3s_ease-out]
              ${phase === 'caught'
                ? 'bg-green-500 dark:bg-green-600 text-white'
                : phase === 'gone'
                ? 'bg-gray-500 dark:bg-gray-600 text-white'
                : 'bg-red-500 dark:bg-red-600 text-white animate-[shake_0.5s_ease-in-out]'}
            `}>
              {message}
            </div>
          )}

          {}
          {phase === 'battle' && (
            <div className="animate-[fade-in_0.3s_ease-out]">
              <div className="text-center text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                WHAT WILL YOU DO?
              </div>
              <div className="flex gap-4 justify-center mb-4">
                <button
                  onClick={handleCatch}
                  disabled={!imageLoaded}
                  className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold text-lg py-4 px-12 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  CATCH
                </button>
                <button
                  onClick={handleRun}
                  className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white font-bold text-lg py-4 px-12 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  RUN
                </button>
              </div>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Attempts: {catchAttempts} / 5
              </div>
            </div>
          )}

          {}
          {phase === 'gone' && (
            <div className="text-center text-lg text-gray-600 dark:text-gray-400 animate-[fade-in_0.3s_ease-out]">
              Loading new Pokemon...
            </div>
          )}
        </div>
      </div>

      {}
      {showNicknameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full animate-[fade-in_0.3s_ease-out]">
            <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              Success! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Give your new {currentPokemon?.name} a nickname!
            </p>
            <form onSubmit={handleNicknameSubmit}>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter nickname"
                autoFocus
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg mb-6 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600"
                required
                maxLength={20}
              />
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold text-lg py-3 rounded-lg transition-colors duration-200"
              >
                Save & Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
