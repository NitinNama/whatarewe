import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import indusAvatar from '../assets/images/avatar_indus_friend_1791121741937.jpg';
import mayaAvatar from '../assets/images/avatar_maya_testimonial_1791121755845.jpg';
import marcusAvatar from '../assets/images/avatar_marcus_testimonial_1791121767868.jpg';
import chloeAvatar from '../assets/images/avatar_chloe_testimonial_1791121780424.jpg';
import { RoutePath } from '../components/Header';
import { RelationshipType } from '../types';

interface HomePageProps {
  onNavigate: (path: RoutePath, reportId?: string) => void;
  onSelectRelationshipType: (type: RelationshipType) => void;
}

const SUPPORTED_CHAT_TYPES: { label: RelationshipType; accent: string }[] = [
  { label: 'Ex 💔', accent: 'hover:border-rose-300 hover:bg-rose-50/60' },
  { label: 'Situationship 🌀', accent: 'hover:border-violet-300 hover:bg-violet-50/60' },
  { label: 'Boyfriend 💌', accent: 'hover:border-pink-300 hover:bg-pink-50/60' },
  { label: 'Best friend 🤝', accent: 'hover:border-amber-300 hover:bg-amber-50/60' },
  { label: 'Boys group 🐐', accent: 'hover:border-emerald-300 hover:bg-emerald-50/60' },
  { label: 'Family group 🏠', accent: 'hover:border-orange-300 hover:bg-orange-50/60' },
  { label: 'Husband 💍', accent: 'hover:border-sky-300 hover:bg-sky-50/60' },
  { label: 'Girls group 💅', accent: 'hover:border-fuchsia-300 hover:bg-fuchsia-50/60' },
  { label: 'Crush 👀', accent: 'hover:border-purple-300 hover:bg-purple-50/60' },
  { label: 'Siblings 👫', accent: 'hover:border-teal-300 hover:bg-teal-50/60' },
  { label: 'Talking stage 💬', accent: 'hover:border-indigo-300 hover:bg-indigo-50/60' },
  { label: 'Uni group 🎓', accent: 'hover:border-lime-300 hover:bg-lime-50/60' },
];

const TESTIMONIALS = [
  {
    name: 'Maya Lin',
    role: 'Art Director · Brooklyn',
    chatType: 'Situationship 🌀 · 1,842 messages',
    avatar: mayaAvatar,
    quote:
      'Before uploading our thread, I kept excusing his 11:45 PM texts as studio burnout. Indus pinpointed the exact week in February his reply speed dropped by 118% after I invited him to my birthday dinner. Sent him the link, we finally had a real 7 PM dinner conversation, and I stopped cushioning my boundaries.',
  },
  {
    name: 'Marcus Vance',
    role: 'Product Manager · London',
    chatType: 'Boys group 🐐 · 6,410 messages',
    avatar: marcusAvatar,
    quote:
      'Dropped our 5-person Lisbon trip group chat in. Indus crowned me "Minister of Unread Google Sheets" and exposed that Leo had voted on the rental car tab thinking it was a villa. All five flights were booked within four hours of sharing the report.',
  },
  {
    name: 'Chloe Moreau',
    role: 'Architect · Montreal',
    chatType: 'Ex 💔 · 2,930 messages',
    avatar: chloeAvatar,
    quote:
      'My ex kept texting me about old vinyl records and laminated pho menus every three weeks. Indus called it "nostalgia breadcrumb leasing" and showed he initiated 85% of messages after 11 PM on Sundays. Gave me more closure in four minutes than six months of overthinking.',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectRelationshipType }) => {
  const handleTagClick = (type: RelationshipType) => {
    onSelectRelationshipType(type);
    onNavigate('/setup');
  };

  return (
    <div className="space-y-24 pb-12">
      {/* 1. Hero Section */}
      <section className="pt-12 sm:pt-20 px-6 max-w-4xl mx-auto text-center">
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-white border border-zinc-200 shadow-sm transition-transform duration-300 hover:scale-105 overflow-hidden">
            <img
              src={indusAvatar}
              alt="Indus avatar"
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-cover transition-transform duration-300 ease-out hover:scale-110 cursor-pointer"
            />
          </div>
          <span className="absolute -bottom-1 right-0 bg-zinc-900 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full border-2 border-[#FAF9F6]">
            Indus
          </span>
        </div>

        <h1
          className="text-4xl sm:text-6xl font-editorial font-medium tracking-tight text-zinc-900 leading-[1.08] max-w-2xl mx-auto"
          style={{ textWrap: 'balance' }}
        >
          Upload a chat. <span className="italic font-normal text-zinc-700">Indus</span> tells you what’s really going on.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-600 max-w-xl mx-auto leading-relaxed">
          Your opinionated, emotionally intelligent friend who reads every message in your WhatsApp or iMessage export and gives you the honest voice-note truth—who cares more, when the shift happened, and what the subtext actually means.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={() => onNavigate('/setup')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-zinc-900 text-white text-sm font-semibold rounded-full hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            <span>Try It Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('/report', 'maya-julian-sample')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-zinc-800 text-sm font-medium rounded-full border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Read Maya & Julian’s Sample Report</span>
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-zinc-500">
          <div className="inline-flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#25D366]/15 text-[#128C7E] inline-flex items-center justify-center">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
              </svg>
            </span>
            <span>WhatsApp (.txt export)</span>
          </div>
          <span aria-hidden="true" className="text-zinc-300">·</span>
          <div className="inline-flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#007AFF]/15 text-[#007AFF] inline-flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
            </span>
            <span>iMessage (.txt export)</span>
          </div>
          <span aria-hidden="true" className="text-zinc-300">·</span>
          <span>100% private in-memory parsing</span>
        </div>
      </section>

      {/* 2. Scrolling Pill Tags (Interactive Category Buttons) */}
      <section className="overflow-hidden py-3 border-y border-zinc-200/80 bg-white/60">
        <div className="animate-marquee flex items-center gap-3 px-4">
          {[...SUPPORTED_CHAT_TYPES, ...SUPPORTED_CHAT_TYPES].map((item, idx) => (
            <button
              key={`${item.label}-${idx}`}
              onClick={() => handleTagClick(item.label)}
              className={`px-4 py-2 rounded-full bg-white border border-zinc-200/90 text-sm font-medium text-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-2xs ${item.accent}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Bento Grid Showcase */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-medium text-zinc-500">01. How It Works</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-editorial text-zinc-900 tracking-tight" style={{ textWrap: 'balance' }}>
            Every pattern your friends suspect, backed by the actual timestamps.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl border border-zinc-200/90 p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500">01. Quantitative Receipt Check</p>
              <h3 className="mt-2 text-2xl font-editorial text-zinc-900">
                Initiation ratios, reply latency, and the 11:00 PM curfew test
              </h3>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed max-w-xl">
                Before Indus writes a single word of commentary, our parser maps every timestamp across your entire chat history: who breaks 6-hour silences, whose average reply time stretches on weekends, and how much of your connection only exists after 11 PM.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-100 grid grid-cols-3 gap-4 font-mono tabular-nums">
              <div>
                <p className="text-xs text-zinc-500">Initiation Split</p>
                <p className="text-xl font-semibold text-zinc-900 mt-1">72% / 28%</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Reply Shift (Feb)</p>
                <p className="text-xl font-semibold text-rose-600 mt-1">+118% slower</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">After 11 PM</p>
                <p className="text-xl font-semibold text-zinc-900 mt-1">46% of texts</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200/90 p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500">02. Character Profiles & Awards</p>
              <h3 className="mt-2 text-2xl font-editorial text-zinc-900">
                Affectionate titles & subtext translation
              </h3>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Every participant gets a custom title—like <span className="italic text-zinc-900">“CEO of Let Me Play It By Ear”</span>—plus scores on emotional availability, response speed, and double-text energy.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-zinc-100">
              <p className="text-xs text-zinc-500">Story-Format Presentation</p>
              <p className="text-sm font-medium text-zinc-900 mt-1">
                7 interactive story slides + 18 deep relationship autopsy chapters
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs font-medium text-zinc-500">02. Proof & Outcomes</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-editorial text-zinc-900 tracking-tight">
              What happened after they read the verdict.
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/setup')}
            className="text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600 transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap"
          >
            Upload your own chat →
          </button>
        </div>

        <div className="flex overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 gap-6 snap-x snap-mandatory">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="min-w-[310px] sm:min-w-0 snap-start bg-white rounded-2xl border border-zinc-200/90 p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
                  <span>{t.chatType}</span>
                </div>
                <p className="text-sm text-zinc-700 leading-relaxed">
                  “{t.quote}”
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center gap-3.5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-zinc-200 shrink-0"
                />
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Bottom Conversion Callout */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="bg-zinc-900 text-white rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-editorial font-normal tracking-tight max-w-xl mx-auto" style={{ textWrap: 'balance' }}>
            Ready to find out what Indus really thinks about your chat?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-300 max-w-lg mx-auto">
            Takes 45 seconds. Raw messages are parsed in memory and immediately discarded after your report is created.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/setup')}
              className="px-7 py-3.5 bg-white text-zinc-900 text-sm font-semibold rounded-full hover:bg-zinc-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              Analyze My Chat →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
