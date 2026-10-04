import React from 'react';
import { RoutePath } from './Header';

interface FooterProps {
  onNavigate: (path: RoutePath, reportId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-zinc-200/80 bg-[#FAF9F6] py-12 mt-20 no-print">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-editorial text-lg font-semibold text-zinc-900">Indus</p>
          <p className="text-xs text-zinc-500 mt-1">
            Honest relationship & group chat reads. Zero raw transcripts stored.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-zinc-600">
          <button
            onClick={() => onNavigate('/setup')}
            className="hover:text-zinc-900 transition-colors cursor-pointer"
          >
            Analyze Chat
          </button>
          <button
            onClick={() => onNavigate('/report', 'maya-julian-sample')}
            className="hover:text-zinc-900 transition-colors cursor-pointer"
          >
            Sample Report
          </button>
          <button
            onClick={() => onNavigate('/pricing')}
            className="hover:text-zinc-900 transition-colors cursor-pointer"
          >
            Pricing
          </button>
          <button
            onClick={() => onNavigate('/privacy')}
            className="hover:text-zinc-900 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 transition-colors"
          >
            Instagram ↗
          </a>
        </div>
      </div>
    </footer>
  );
};
