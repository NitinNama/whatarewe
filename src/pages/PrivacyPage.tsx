import React from 'react';
import { ShieldCheck, Trash2, Lock, ServerOff } from 'lucide-react';
import { RoutePath } from '../components/Header';

interface PrivacyPageProps {
  onNavigate: (path: RoutePath) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
      <div>
        <p className="text-xs font-medium text-zinc-500">Privacy & Data Handling</p>
        <h1 className="mt-2 text-4xl font-editorial text-zinc-900 tracking-tight">
          We read your chat so Indus can roast it—then we delete the transcript immediately.
        </h1>
        <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
          Last updated: October 2026. Your personal conversations are deeply private. Here is the exact, plain-English breakdown of what happens the moment you drop a `.txt` file into <span className="font-semibold text-zinc-900">Indus</span>.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/90 divide-y divide-zinc-100">
        <div className="p-7 flex items-start gap-4">
          <Trash2 className="w-5 h-5 text-zinc-800 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-editorial text-zinc-900">01. Zero Raw Chat Storage</h2>
            <p className="mt-1.5 text-sm text-zinc-600 leading-relaxed">
              We never write your raw `.txt` chat file to a database or disk. Quantitative statistics (message counts, reply latency, time-of-day bins, and emoji tallies) are calculated directly in your browser before the analysis request is made.
            </p>
          </div>
        </div>

        <div className="p-7 flex items-start gap-4">
          <ServerOff className="w-5 h-5 text-zinc-800 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-editorial text-zinc-900">02. Ephemeral In-Memory AI Processing</h2>
            <p className="mt-1.5 text-sm text-zinc-600 leading-relaxed">
              To generate Indus’s qualitative commentary, the truncated text is streamed over encrypted HTTPS to our server-side LLM endpoint and immediately garbage-collected once the structured JSON report is returned. Your chat is never used to train any models.
            </p>
          </div>
        </div>

        <div className="p-7 flex items-start gap-4">
          <Lock className="w-5 h-5 text-zinc-800 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-editorial text-zinc-900">03. What IS Stored for Shareable Links</h2>
            <p className="mt-1.5 text-sm text-zinc-600 leading-relaxed">
              When your report finishes, we store only: (a) the random unguessable report ID, (b) the generated report JSON (Overview, Character Profiles, Awards, Verdict), (c) aggregate numerical counts, and (d) the creation timestamp.
            </p>
          </div>
        </div>

        <div className="p-7 flex items-start gap-4">
          <ShieldCheck className="w-5 h-5 text-zinc-800 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-editorial text-zinc-900">04. No Account or Login Required</h2>
            <p className="mt-1.5 text-sm text-zinc-600 leading-relaxed">
              You do not need to give us your phone number, email address, or social accounts to analyze a chat.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={() => onNavigate('/setup')}
          className="px-6 py-3 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          Go to Chat Setup →
        </button>
      </div>
    </div>
  );
};
