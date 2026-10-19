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
          className="text-xl tracking-tight text-zinc-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs hover:bg-zinc-50 cursor-pointer whitespace-nowrap px-3 py-1 rounded-md"
          style={{
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontFamily: 'EB Garamond',
            textDecorationLine: 'none',
            backgroundColor: '#ffffff',
            textAlign: 'center',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: '#18181b',
          }}
        >
          Whatarewe
        </button>

        <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-600">
          <button
            onClick={() => onNavigate('/')}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap hover:-translate-y-0.5 hover:shadow-xs hover:bg-zinc-100 hover:text-zinc-900 active:translate-y-0 ${
              currentPath === '/' ? 'text-zinc-900 font-semibold bg-zinc-100/80' : 'text-zinc-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('/report', 'maya-julian-sample')}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap hover:-translate-y-0.5 hover:shadow-xs hover:bg-zinc-100 hover:text-zinc-900 active:translate-y-0 ${
              currentPath === '/report' ? 'text-zinc-900 font-semibold bg-zinc-100/80' : 'text-zinc-600'
            }`}
          >
            Sample Report
          </button>
          <button
            onClick={() => onNavigate('/pricing')}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap hover:-translate-y-0.5 hover:shadow-xs hover:bg-zinc-100 hover:text-zinc-900 active:translate-y-0 ${
              currentPath === '/pricing' ? 'text-zinc-900 font-semibold bg-zinc-100/80' : 'text-zinc-600'
            }`}
          >
            Pricing
          </button>
          <button
            onClick={() => onNavigate('/privacy')}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap hover:-translate-y-0.5 hover:shadow-xs hover:bg-zinc-100 hover:text-zinc-900 active:translate-y-0 ${
              currentPath === '/privacy' ? 'text-zinc-900 font-semibold bg-zinc-100/80' : 'text-zinc-600'
            }`}
          >
            Privacy
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/setup')}
            className="inline-flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 rounded-full hover:bg-zinc-800 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 cursor-pointer whitespace-nowrap shrink-0"
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
