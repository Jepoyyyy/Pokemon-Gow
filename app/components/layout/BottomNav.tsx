

import { Link, useLocation } from 'react-router';
import {House,Swords} from 'lucide-react';
import pokeball from '../../assets/pokeball.svg'

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/home') {
      return location.pathname === '/home' || location.pathname.startsWith('/pokemon/');
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/home', label: 'Home', icon: <House className='pb-1'/>, ariaLabel: 'Navigate to home page' },
    { path: '/catch', label: 'Catch', icon: <Swords className='pb-1'/>, ariaLabel: 'Navigate to catch page' },
    { path: '/my-pokemon', label: 'My Pokemon', icon: <img src={pokeball} className="w-[30px] h-[30px]" alt="" />, ariaLabel: 'Navigate to my pokemon collection' },
  ];

  return (
    <nav
      className="flex justify-around items-center py-2 px-2"
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
  key={item.path}
  to={item.path}
  aria-label={item.ariaLabel}
  aria-current={active ? 'page' : undefined}
  className={`
    text-decoration-none
    ${active ? 'text-red-600 dark:text-red-400 scale-110 -translate-y-1' : 'text-gray-500 dark:text-gray-400 scale-100 translate-y-0'}
    flex flex-col items-center p-2 min-w-[60px]
    text-sm font-${active ? 'bold' : 'normal'}
    ${active ? 'bg-red-100 dark:bg-red-900/30' : ''}
    
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg
    transition-all duration-200
  `}
>
  <div
    className={`
      mb-0.5 p-1 rounded-full
      transition-all duration-200
    `}
    aria-hidden="true"
  >
    {item.icon}
  </div>
  <div className={`
    text-[10px] uppercase tracking-wider
    ${active ? 'font-bold' : 'font-normal'}
    transition-all duration-200
  `}>
    {item.label}
  </div>
</Link>
        );
      })}
    </nav>
  );
}
