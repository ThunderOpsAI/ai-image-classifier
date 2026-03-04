import { NavLink } from 'react-router-dom';

const linkBase =
  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white';

export default function NavBar() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <h1 className="text-lg font-semibold text-cyan-300">AI Image Classifier</h1>
        <nav className="flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) => `${linkBase} ${isActive ? 'bg-slate-700 text-white' : 'text-slate-300'}`}
          >
            Classify
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => `${linkBase} ${isActive ? 'bg-slate-700 text-white' : 'text-slate-300'}`}
          >
            History
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `${linkBase} ${isActive ? 'bg-slate-700 text-white' : 'text-slate-300'}`}
          >
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
