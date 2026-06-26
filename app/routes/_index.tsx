

import { useNavigate } from 'react-router';
import type { Route } from './+types/_index';
import logo from '../assets/pokemon.svg';
import ball from '../assets/pokeball.svg';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Pokemon Game' },
    { name: 'description', content: 'Catch and collect Pokemon!' },
  ];
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center px-4" style={{ background: '#091057' }}>
      <div className=" mb-4 animate-[fade-in_0.5s_ease-out]">
      <img src={logo} alt="" />
      </div>

      <h1 className=" mb-8 animate-[fade-in_0.5s_ease-out]">
      <img src={ball} className='w-40 h-40' alt="" />
      </h1>

      <button
        onClick={() => navigate('/home')}
        className="bg-white hover:bg-gray-500 text-black font-bold text-xl py-4 px-12 rounded-full shadow-lg hover:shadow-xl  transition-all duration-200 animate-[fade-in_0.5s_ease-out_0.3s_both]"
      >
        Click to Continue
      </button>

      <p className="absolute bottom-8 text-white/80 text-sm">
        Built for JDT purpose by Jepoyyyy
      </p>
    </div>
  );
}
