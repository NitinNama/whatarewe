import React from 'react';
import indusAvatar from '../assets/images/avatar_indus_friend_1791121741937.jpg';

export type RoutePath = '/' | '/setup' | '/report' | '/pricing' | '/privacy';

interface HeaderProps {
  currentPath: RoutePath;
  onNavigate: (path: RoutePath, reportId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/90 backdrop-blur-md border-b border-zinc-200/80 no-print">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="text-xl tracking-tight text-zinc-900 hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap px-3 py-1 border-4 border-zinc-900"
          style={{
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontFamily: 'EB Garamond',
            textDecorationLine: 'none',
            borderStyle: 'double',
            backgroundColor: '#faf5f5',
          }}
        >
          Whatarewe
        </button>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <button
            onClick={() => onNavigate('/')}
            className={`hover:text-zinc-900 transition-colors cursor-pointer whitespace-nowrap ${
              currentPath === '/' ? 'text-zinc-900 underline underline-offset-4' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('/report', 'maya-julian-sample')}
            className={`hover:text-zinc-900 transition-colors cursor-pointer whitespace-nowrap ${
              currentPath === '/report' ? 'text-zinc-900 underline underline-offset-4' : ''
            }`}
          >
            Sample Report
          </button>
          <button
            onClick={() => onNavigate('/pricing')}
            className={`hover:text-zinc-900 transition-colors cursor-pointer whitespace-nowrap ${
              currentPath === '/pricing' ? 'text-zinc-900 underline underline-offset-4' : ''
            }`}
          >
            Pricing
          </button>
          <button
            onClick={() => onNavigate('/privacy')}
            className={`hover:text-zinc-900 transition-colors cursor-pointer whitespace-nowrap ${
              currentPath === '/privacy' ? 'text-zinc-900 underline underline-offset-4' : ''
            }`}
          >
            Privacy
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/setup')}
            className="inline-flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <img
              src={indusAvatar}
              alt="Indus avatar"
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-full object-cover border border-white/20"
            />
            <span>Analyze a Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
