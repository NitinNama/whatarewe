import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { RoutePath } from '../components/Header';

interface PricingPageProps {
  onNavigate: (path: RoutePath, reportId?: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs font-medium text-zinc-500">Transparent Pricing</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-editorial text-zinc-900 tracking-tight">
          Cheaper than brunch. More honest than your group chat.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-zinc-600">
          Your full 8-section relationship report, quantitative receipt check, and interactive follow-up Q&A with Indus are completely free.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-zinc-900 p-8 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-zinc-900">For Individuals & Friends</p>
              <span className="text-xs font-mono text-emerald-700">UNLOCKED TODAY</span>
            </div>
            <h2 className="mt-2 text-3xl font-editorial text-zinc-900">The Full Verdict</h2>
            <div className="mt-4 flex items-baseline gap-1 font-mono tabular-nums">
              <span className="text-4xl font-semibold text-zinc-900">$0</span>
              <span className="text-xs text-zinc-500">/ full chat report</span>
            </div>
            <p className="mt-3 text-xs text-zinc-600 leading-relaxed">
              Everything you need to decode a situationship, ex, best friend, or chaotic trip-planning group chat.
            </p>

            <ul className="mt-6 pt-6 border-t border-zinc-100 space-y-3 text-xs text-zinc-700">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>Up to 50,000 recent tokens analyzed per chat export</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>All 8 sections: Overview, The Numbers, Character Profiles, The Shift, Subtext, Awards & Verdict</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>“What To Do Next” actionable blueprint</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>Interactive follow-up Q&A with Indus</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>Private shareable report link & PDF print view</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('/setup')}
            className="mt-8 w-full py-3.5 px-6 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>Analyze a Chat for Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/90 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-zinc-500">For Multi-Year Archives</p>
              <span className="text-xs font-mono text-zinc-400">OPTIONAL PASS</span>
            </div>
            <h2 className="mt-2 text-3xl font-editorial text-zinc-900">The Multi-Chat Pass</h2>
            <div className="mt-4 flex items-baseline gap-1 font-mono tabular-nums">
              <span className="text-4xl font-semibold text-zinc-900">$4.99</span>
              <span className="text-xs text-zinc-500">/ one-time pass</span>
            </div>
            <p className="mt-3 text-xs text-zinc-600 leading-relaxed">
              For comparing how you text across 5 different relationships or uploading multi-year archives up to 250,000 messages.
            </p>

            <ul className="mt-6 pt-6 border-t border-zinc-100 space-y-3 text-xs text-zinc-700">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>Everything in The Full Verdict</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>Cross-chat attachment style comparison across 3+ threads</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>Full multi-year timeline without token truncation</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>Unlimited follow-up voice-note coaching with Indus</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('/setup')}
            className="mt-8 w-full py-3.5 px-6 rounded-full bg-[#FAF9F6] border border-zinc-300 text-zinc-900 text-xs font-semibold hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            Start with Free Full Report →
          </button>
        </div>
      </div>
    </div>
  );
};
