import { useState, useEffect, useCallback } from 'react';
import { useMyPokemon } from '../context/MyPokemonContext';
import { attemptCatch, shouldPokemonFlee } from '../utils/catchLogic';
import type { PokemonDetail, CatchPhase } from '../types/pokemon';
import LoadingPokeball from '../components/ui/LoadingPokeball';
import Toast from '../components/ui/Toast';
import { getRandomPokemonId } from '../data/pokemon';
import { Target, Footprints, MapPin, ShieldAlert } from 'lucide-react';
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
          if (speciesData.habitat) setHabitat(speciesData.habitat.name);
        }
      } catch {
        // habitat optional, skip silently
      }
    } catch (error) {
      console.error('Error fetching pokemon:', error);
      setMessage('Failed to load pokemon. Try again.');
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

    if (attemptCatch()) {
      setPhase('caught');
      setMessage(`You caught ${currentPokemon.name}!`);
      setShowNicknameModal(true);
    } else {
      if (shouldPokemonFlee(newAttempts)) {
        setPhase('gone');
        setMessage(`${currentPokemon.name.toUpperCase()} ALREADY GONE`);
        setTimeout(() => fetchRandomPokemon(), 3000);
      } else {
        setMessage(`Oh no! ${currentPokemon.name} broke free!`);
      }
    }
  };

  const handleNicknameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPokemon || !nickname.trim()) return;

    addPokemon({
      id: currentPokemon.id,
      name: currentPokemon.name,
      customName: nickname.trim(),
      sprite:
        currentPokemon.sprites.other.showdown?.front_default ||
        currentPokemon.sprites.other['official-artwork'].front_default,
      types: currentPokemon.types.map((t) => t.type.name),
      stats: {
        hp: currentPokemon.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0,
        attack: currentPokemon.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0,
        defense: currentPokemon.stats.find((s) => s.stat.name === 'defense')?.base_stat || 0,
        speed: currentPokemon.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0,
      },
      height: currentPokemon.height,
      weight: currentPokemon.weight,
      abilities: currentPokemon.abilities.map((a) => a.ability.name),
      caughtAt: new Date().toISOString(),
    });

    setShowNicknameModal(false);
    setNickname('');
    setToastMessage(`${currentPokemon.name} added to your team!`);
    setShowToast(true);
    setTimeout(() => fetchRandomPokemon(), 500);
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

  if (isLoading || !currentPokemon) return <LoadingPokeball />;

  const spriteUrl =
    currentPokemon.sprites.other.showdown?.front_default ||
    currentPokemon.sprites.other['official-artwork'].front_default;

  return (
    <div className="flex flex-col h-full">

      {/* ── ARENA ── */}
      <div
        className="flex-1 flex flex-col bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${background})` }}
      >
        {/* Appear banner — strip hitam transparan, bukan card */}
        <div className="bg-black/65 backdrop-blur-sm border-b-2 border-yellow-400 px-4 py-3 text-center">
          <span className="text-yellow-400 font-black tracking-widest uppercase text-base drop-shadow-[0_0_10px_rgba(250,204,21,0.9)]">
            ★&nbsp;{currentPokemon.name.toUpperCase()}&nbsp;IS APPEAR!&nbsp;★
          </span>
        </div>

        {/* Sprite */}
        <div className="flex-1 flex items-center justify-center">
          {!imageLoaded && (
            <span className="text-white/50 text-sm animate-pulse">Loading...</span>
          )}
          <img
            src={spriteUrl}
            alt={currentPokemon.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-48 h-48 object-contain drop-shadow-2xl transition-opacity duration-300 ${
              imageLoaded
                ? 'opacity-100 animate-[float_2s_ease-in-out_infinite]'
                : 'opacity-0 absolute'
            }`}
          />
        </div>

        {/* Habitat + attempts — row di atas garis bawah arena */}
        <div className="flex justify-between items-center px-5 pb-4">
          {habitat ? (
            <span className="flex items-center gap-1.5 text-white/75 text-xs uppercase tracking-wide bg-black/40 px-2.5 py-1 rounded-full">
              <MapPin size={11} />
              {habitat}
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1.5 text-white/75 text-xs bg-black/40 px-2.5 py-1 rounded-full">
            <ShieldAlert size={11} />
            {catchAttempts} / 5
          </span>
        </div>
      </div>

      {/* ── ACTION PANEL ── */}
      <div className="bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 px-6 py-5 shrink-0">

        {/* Feedback message */}
        {message && phase !== 'caught' && (
          <p
            className={`text-center text-sm font-semibold mb-4 ${
              phase === 'gone'
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-red-500 dark:text-red-400'
            }`}
          >
            {message}
          </p>
        )}

        {phase === 'battle' && (
          <>
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
              What will you do?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCatch}
                disabled={!imageLoaded}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold py-3.5 rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <Target size={17} />
                CATCH
              </button>
              <button
                onClick={fetchRandomPokemon}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3.5 rounded-xl transition-all duration-150 active:scale-95"
              >
                <Footprints size={17} />
                RUN
              </button>
            </div>
          </>
        )}

        {phase === 'gone' && (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-1">
            Finding next pokemon...
          </p>
        )}
      </div>

      {/* ── NICKNAME MODAL ── */}
      {showNicknameModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm animate-[fade-in_0.2s_ease-out]">
      <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
        Gotcha!
      </p>
      <h2 className="text-2xl font-black capitalize text-gray-900 dark:text-gray-100 mb-1">
        {currentPokemon.name}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        Give it a nickname
      </p>
      <div>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter nickname..."
          autoFocus
          maxLength={20}
          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl mb-4 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-red-400 dark:focus:border-red-500 transition-colors"
        />
        <button
          type="button"
          onClick={handleNicknameSubmit}
          className="w-full bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold py-3 rounded-xl transition-all duration-150"
        >
          Save & Continue
        </button>
      </div>
    </div>
  </div>
)}

      {/* ── TOAST ── */}
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