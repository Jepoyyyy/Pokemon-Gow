

import { Link } from 'react-router';
import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/pokemon.svg';
import pokeball from '../../assets/pokeball.svg'
import whitepokeball from '../../assets/whitepokeball.png'
import { useState, useEffect } from 'react';

export default function TopBar() {
  const [isAnimating, setIsAnimating] = useState(false);

const handleToggle = () => {
  setIsAnimating(true);
  toggleTheme();
  setTimeout(() => setIsAnimating(false), 300);
};

  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between px-5 py-3 border border-b-black dark:border-b-white">
      <Link
        to="/home"
        className="no-underline hover:opacity-80 transition-opacity"
      >
      <img src={logo} alt="Pokemon" className="h-8" />
      </Link>

      <div className="flex items-center gap-3">
        <span className="text-lg text-black dark:text-white uppercase tracking-wider font-semibold">
          Catch & Collect!
        </span>

        <button
  onClick={handleToggle}
  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm overflow-hidden"
>
  <img
    src={theme === 'light' ? pokeball : whitepokeball}
    alt=""
    className={`w-5 h-5 ${isAnimating ? 'animate-roll' : ''}`}
  />
</button>
      </div>
    </div>
  );
}
