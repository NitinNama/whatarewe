import React from 'react';
import { Sun, Moon } from 'lucide-react';
import indusAvatar from '../assets/images/avatar_indus_friend_1791121741937.jpg';
import { useTheme } from '../context/ThemeContext';

export type RoutePath = '/' | '/setup' | '/report' | '/pricing' | '/privacy';

interface HeaderProps {
  currentPath: RoutePath;
  onNavigate: (path: RoutePath, reportId?: string) => void;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { isDark, toggleTheme } = useTheme();
  const [ripples, setRipples] = React.useState<Ripple[]>([]);

  const handleAnalyzeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const newRipple: Ripple = { x, y, size, id: Date.now() };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onNavigate('/setup');
  };
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/90 dark:bg-[#121214]/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 no-print transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="text-xl tracking-tight text-zinc-900 dark:text-zinc-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer whitespace-nowrap px-3 py-1 rounded-md"
          style={{
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontFamily: 'EB Garamond',
            textDecorationLine: 'none',
            backgroundColor: isDark ? '#18181b' : '#ffffff',
            textAlign: 'center',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: isDark ? '#e4e4e7' : '#18181b',
          }}
        >
          Whatarewe
        </button>

        <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <button
            onClick={() => onNavigate('/')}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap hover:-translate-y-0.5 hover:shadow-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 active:translate-y-0 ${
              currentPath === '/' ? 'text-zinc-900 dark:text-white font-semibold bg-zinc-100/80 dark:bg-zinc-800/80' : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('/report', 'maya-julian-sample')}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap hover:-translate-y-0.5 hover:shadow-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 active:translate-y-0 ${
              currentPath === '/report' ? 'text-zinc-900 dark:text-white font-semibold bg-zinc-100/80 dark:bg-zinc-800/80' : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Sample Report
          </button>
          <button
            onClick={() => onNavigate('/pricing')}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap hover:-translate-y-0.5 hover:shadow-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 active:translate-y-0 ${
              currentPath === '/pricing' ? 'text-zinc-900 dark:text-white font-semibold bg-zinc-100/80 dark:bg-zinc-800/80' : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Pricing
          </button>
          <button
            onClick={() => onNavigate('/privacy')}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap hover:-translate-y-0.5 hover:shadow-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 active:translate-y-0 ${
              currentPath === '/privacy' ? 'text-zinc-900 dark:text-white font-semibold bg-zinc-100/80 dark:bg-zinc-800/80' : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Privacy
          </button>
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700/80 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-2xs"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700 transition-transform duration-300 rotate-0 hover:-rotate-12" />
            )}
          </button>

          <button
            onClick={handleAnalyzeClick}
            className="relative overflow-hidden inline-flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-white dark:text-zinc-900 bg-zinc-900 dark:bg-zinc-100 rounded-full hover:bg-zinc-800 dark:hover:bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 cursor-pointer whitespace-nowrap shrink-0"
          >
            <img
              src={indusAvatar}
              alt="Indus avatar"
              referrerPolicy="no-referrer"
              className="relative z-10 w-5 h-5 rounded-full object-cover border border-white/20 dark:border-zinc-900/20"
            />
            <span className="relative z-10">Analyze a Chat</span>
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                className="absolute rounded-full bg-white/30 dark:bg-zinc-900/30 pointer-events-none animate-button-ripple"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: ripple.size,
                  height: ripple.size,
                }}
              />
            ))}
          </button>
        </div>
      </div>
    </header>
  );
};
