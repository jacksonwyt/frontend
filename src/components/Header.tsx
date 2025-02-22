// frontend/src/components/Header.tsx
import { useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, XIcon } from '@heroicons/react/solid';

const Header: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full p-6 flex justify-between items-center border-b border-gray-800 bg-darkGray/80 backdrop-blur-md z-10">
      <Link to="/" className="text-2xl font-bold tracking-tight">Crypto Predictor</Link>
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>
      <nav className={`md:flex space-x-6 ${menuOpen ? 'block absolute top-16 left-0 w-full bg-darkGray p-6' : 'hidden md:block'}`}>
        <Link to="/" className="block text-gray-400 hover:text-white transition py-2">Home</Link>
        <Link to="/app" className="block text-gray-400 hover:text-white transition py-2">Dashboard</Link>
        <a href="#subscribe" className="block text-neonGreen hover:text-green-300 transition py-2 font-semibold">Upgrade</a>
      </nav>
    </header>
  );
};

export default Header;