import React, { useState, useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Share2,
  Check,
  Printer,
  Sparkles,
  Flame,
  MessageSquare,
  Music,
  Film,
  Award,
  Layers,
  FileText,
  Clock,
  Calendar,
  AlertTriangle,
  Heart,
  TrendingDown,
  ShieldCheck,
  UserCheck,
  Download,
  FileDown,
  Loader2,
  X,
  Smartphone,
  Monitor,
  Lock,
  Unlock,
  CreditCard,
  Copy,
  HelpCircle,
} from 'lucide-react';
import indusAvatar from '../assets/images/avatar_indus_friend_1791121741937.jpg';
import { StoredReport, CharacterProfileBlock } from '../types';
import { RoutePath } from '../components/Header';
import { generatePdfFromElement } from '../utils/pdfExporter';

interface ReportPageProps {
  reportData: StoredReport;
  onNavigate: (path: RoutePath, reportId?: string) => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({ reportData, onNavigate }) => {
  const { stats, report, relationshipType, id, isSample, createdAt } = reportData;

  // View mode: 'slides' (Story format, 1 of 7) vs 'dossier' (continuous full report)
  const [viewMode, setViewMode] = useState<'slides' | 'dossier'>('slides');

  // Slide navigation state: 0 to 6 (7 slides total)
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const TOTAL_SLIDES = 7;

  // Mobile UX: Phone mockup frame & touch swipe state
  const [phoneFrameMode, setPhoneFrameMode] = useState<boolean>(false);
  const touchStartXRef = useRef<number | null>(null);

  // Monetization & Paywall States
  const [isPaid, setIsPaid] = useState<boolean>(reportData.isPaid || isSample || false);
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

  // PDF Export States
  const [showExportModal, setShowExportModal] = useState(false);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [pdfProgress, setPdfProgress] = useState({ percent: 0, stage: '' });
  const [pdfErrorMessage, setPdfErrorMessage] = useState<string | null>(null);

  // Hot Take Deep Dive / Conspiracy Theory Modal States
  const [selectedHotTake, setSelectedHotTake] = useState<string | null>(null);
  const [isGeneratingTheory, setIsGeneratingTheory] = useState<boolean>(false);
  const [theoryData, setTheoryData] = useState<{
    conspiracyTitle: string;
    theory: string;
    evidencePoints: string[];
    uncomfortableTruth: string;
  } | null>(null);
  const [theoriesCache, setTheoriesCache] = useState<Record<string, any>>({});
  const [theoryCopied, setTheoryCopied] = useState(false);

  const [copied, setCopied] = useState(false);
  const [question, setQuestion] = useState('');
  const [qaHistory, setQaHistory] = useState<{ role: 'user' | 'indus'; text: string }[]>([
    {
      role: 'indus',
      text: `I’ve read all ${stats.totalMessages.toLocaleString()} messages. Ask me anything about ${
        stats.participants[0]?.name || 'this chat'
      }—like "Should I reply to their last text?" or "What happens if I stop initiating for a week?"`,
    },
  ]);
  const [isAsking, setIsAsking] = useState(false);

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {}
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(diff) > 42) {
      if (diff < 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
    touchStartXRef.current = null;
  };

  const handleNextSlide = () => {
    triggerHaptic();
    if (currentSlide < 3 || isPaid) {
      setCurrentSlide((prev) => Math.min(TOTAL_SLIDES - 1, prev + 1));
    } else {
      setShowPaywallModal(true);
    }
  };

  const handlePrevSlide = () => {
    triggerHaptic();
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const handleSelectSlide = (idx: number) => {
    triggerHaptic();
    if (idx <= 3 || isPaid) {
      setCurrentSlide(idx);
    } else {
      setShowPaywallModal(true);
    }
  };

  const handleUnlockPaidReport = async () => {
    setIsUnlocking(true);
    try {
      await fetch(`/api/reports/${id}/unlock`, { method: 'POST' });
    } catch {}
    setIsPaid(true);
    setIsUnlocking(false);
    setShowPaywallModal(false);
    triggerHaptic();
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/?report=${id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPdf = async () => {
    if (isPdfExporting) return;
    setIsPdfExporting(true);
    setPdfErrorMessage(null);
    setPdfProgress({ percent: 5, stage: 'Compiling dossier data...' });

    try {
      const el = document.getElementById('printable-dossier');
      if (!el) {
        throw new Error('Dossier DOM element not found');
      }

      const pNames = (stats.participants || []).map((p) => p.name.toLowerCase().replace(/[^a-z0-9]/g, '-')).join('-');
      const filename = `indus-relationship-report-${pNames || 'analysis'}.pdf`;

      await generatePdfFromElement({
        element: el,
        filename,
        reportTitle: `Indus · ${relationshipType} (${(stats.participants || []).map((p) => p.name).join(' & ')})`,
        onProgress: (percent, stage) => {
          setPdfProgress({ percent, stage });
        },
      });

      setTimeout(() => {
        setIsPdfExporting(false);
        setShowExportModal(false);
      }, 700);
    } catch (err: any) {
      console.error('PDF export failed:', err);
      setPdfErrorMessage(err?.message || 'Direct PDF generation encountered an issue. You can use "Print / Save as PDF" instead.');
      setIsPdfExporting(false);
    }
  };

  const handleNativePrint = () => {
    setShowExportModal(false);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleAskIndus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAsking) return;

    const userQ = question.trim();
    setQuestion('');
    const nextHistory = [...qaHistory, { role: 'user' as const, text: userQ }];
    setQaHistory(nextHistory);
    setIsAsking(true);

    try {
      const res = await fetch('/api/chat-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: id,
          question: userQ,
          history: nextHistory,
        }),
      });
      const data = await res.json();
      setQaHistory((prev) => [...prev, { role: 'indus', text: data.answer }]);
    } catch {
      setQaHistory((prev) => [
        ...prev,
        {
          role: 'indus',
          text: 'Honestly? Look at the initiation numbers above. Match their pace for 7 days and you will have your answer.',
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleOpenHotTakeModal = async (take: string) => {
    triggerHaptic();
    setSelectedHotTake(take);
    setTheoryCopied(false);

    if (theoriesCache[take]) {
      setTheoryData(theoriesCache[take]);
      return;
    }

    setIsGeneratingTheory(true);
    setTheoryData(null);

    try {
      const res = await fetch('/api/hot-take-deep-dive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: id,
          hotTake: take,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate deep dive');
      const data = await res.json();
      setTheoryData(data);
      setTheoriesCache((prev) => ({ ...prev, [take]: data }));
    } catch {
      const fallback = {
        conspiracyTitle: 'The Unspoken Pacing Agreement',
        theory: `This hot take cuts straight through the polite cover story. Neither of you is confused about where this stands; you're both running an unspoken psychological hedge to avoid the vulnerability of daylight clarity.`,
        evidencePoints: [
          'The delayed reaction: replies are scheduled according to perceived leverage rather than actual availability.',
          'The humor shield: whenever conversations approach genuine emotional stakes, a meme or self-deprecating joke is immediately deployed.',
          'The silent consensus: staying in situationship limbo feels safer than risking a definitive answer.'
        ],
        uncomfortableTruth: 'The silence isn\'t confusion; it\'s strategy.'
      };
      setTheoryData(fallback);
      setTheoriesCache((prev) => ({ ...prev, [take]: fallback }));
    } finally {
      setIsGeneratingTheory(false);
    }
  };

  const handleCopyTheory = () => {
    if (!theoryData) return;
    const textToCopy = `🌶️ BRANDON'S CONSPIRACY DOSSIER:\n"${selectedHotTake}"\n\n📁 ${theoryData.conspiracyTitle}\n\n${theoryData.theory}\n\nReceipts:\n${theoryData.evidencePoints.map((e) => `• ${e}`).join('\n')}\n\nUncomfortable Truth: ${theoryData.uncomfortableTruth}`;
    navigator.clipboard.writeText(textToCopy);
    setTheoryCopied(true);
    setTimeout(() => setTheoryCopied(false), 2000);
  };

  const handleAskAboutHotTake = (take: string) => {
    setSelectedHotTake(null);
    setQuestion(`Brandon, what is the real psychology behind this hot take: "${take}"?`);
    const qaEl = document.getElementById('brandon-qa-section');
    if (qaEl) {
      qaEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const p1 = stats?.participants?.[0] || { name: 'Person A', messageCount: 100, initiationPercent: 65, avgReplyMinutes: 6 };
  const p2 = stats?.participants?.[1] || { name: 'Person B', messageCount: 50, initiationPercent: 35, avgReplyMinutes: 60 };
  const totalMsgs = stats?.totalMessages || p1.messageCount + p2.messageCount;
  const p1MsgPct = Math.round((p1.messageCount / Math.max(1, totalMsgs)) * 100);
  const p2MsgPct = 100 - p1MsgPct;

  const maxHourlyCount = Math.max(...(stats.hourlyDistribution || []).map((h) => h.count), 1);

  // Analysis Grade calculation based on compatibility score and conversational equilibrium
  const compatibilityScore = report.compatibility?.overallScore || 61;
  const analysisGradeInfo = React.useMemo(() => {
    if (compatibilityScore >= 88) {
      return {
        grade: 'A',
        badge: 'GRADE A · SYNERGISTIC',
        descriptor: 'EXCEPTIONAL ALIGNMENT',
        summary: 'Synchronized reply pacing, mutual initiation, and high emotional safety.',
      };
    }
    if (compatibilityScore >= 75) {
      return {
        grade: 'B+',
        badge: 'GRADE B+ · STABLE',
        descriptor: 'HEALTHY RECIPROCITY',
        summary: 'Consistent banter and mutual care with manageable scheduling gaps.',
      };
    }
    if (compatibilityScore >= 60) {
      return {
        grade: 'C+',
        badge: 'GRADE C+ · ASYMMETRIC',
        descriptor: 'VOLATILE / SKEWED INITIATION',
        summary: 'High conversational chemistry offset by nocturnal drift & one-sided initiation labor.',
      };
    }
    if (compatibilityScore >= 45) {
      return {
        grade: 'C-',
        badge: 'GRADE C- · NOCTURNAL TRAP',
        descriptor: 'HIGH LATENCY & DEFLECTION',
        summary: 'Severe delay in daylight communication; high reliance on late-night convenience.',
      };
    }
    return {
      grade: 'D',
      badge: 'GRADE D · CRITICAL',
      descriptor: 'ACUTE RECIPROCITY DEFICIT',
      summary: 'Conversational exhaustion; unsustainable emotional investment gap.',
    };
  }, [compatibilityScore]);

  // Helper to format trait keys nicely
  const formatTraitLabel = (key: string) => {
    switch (key) {
      case 'emotionallyAvailable': return 'Emotionally Available';
      case 'responseSpeed': return 'Response Speed';
      case 'vulnerability': return 'Vulnerability';
      case 'doubleTextEnergy': return 'Double Text Energy';
      case 'pettyPotential': return 'Petty Potential';
      case 'humorIndex': return 'Humor Index';
      default: return key.replace(/([A-Z])/g, ' $1');
    }
  };

  // Reusable Component: Character Profiles Section (with exact WhatsApp green bubbles & blue double ticks)
  const renderCharacterProfilesSection = () => (
    <div className="w-full bg-[#FAF8F5] rounded-3xl p-6 sm:p-12 border border-zinc-200 shadow-md avoid-break">
      {/* Centered Serif Chapter Title & Divider */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">THE PERSONNEL DOSSIER</span>
        <h2 className="text-3xl sm:text-4xl font-editorial text-zinc-900 mt-2 font-normal">
          {report.characterChapterTitle || 'The Personnel File: Delinquents, Frauds, and Ghost Agents'}
        </h2>
        <div className="my-5 text-zinc-400 font-editorial tracking-widest text-lg select-none">
          — ♦ —
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 font-editorial italic">
          Unvarnished character assessments delivered directly in the 2nd person, verified with verbatim chat exhibits.
        </p>
      </div>

      {/* Roster of Profiles */}
      <div className="space-y-12 max-w-3xl mx-auto">
        {(report.characterProfiles || []).map((person, idx) => (
          <div key={idx} className="relative avoid-break">
            {idx > 0 && <hr className="border-zinc-200/80 my-10" />}

            {/* Person Header: Name — Title + emoji in bold serif */}
            <div className="mb-4">
              <h3 className="text-2xl sm:text-3xl font-editorial text-zinc-900 tracking-tight font-semibold">
                {person.funnyTitle || `${person.name} — The Unnamed Agent 🕶️`}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1 font-sans">
                {person.personalitySummary}
              </p>
            </div>

            {/* Signature Move & Best/Worst Moments */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-5">
              <div className="bg-white p-3 rounded-xl border border-zinc-200/70 shadow-2xs">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Signature Move</span>
                <p className="text-xs font-medium text-zinc-800 mt-0.5">{person.signatureMove}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-zinc-200/70 shadow-2xs">
                <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block">Best Moment</span>
                <p className="text-xs font-medium text-zinc-800 mt-0.5">{person.bestMoment}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-zinc-200/70 shadow-2xs">
                <span className="text-[10px] font-mono text-rose-600 uppercase tracking-wider block">Most Questionable</span>
                <p className="text-xs font-medium text-zinc-800 mt-0.5">{person.worstMoment}</p>
              </div>
            </div>

            {/* 6 Trait Score Meters */}
            {person.scores && (
              <div className="bg-white/80 p-4 rounded-2xl border border-zinc-200/70 my-5 shadow-2xs">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-2.5 font-semibold">
                  Behavioral Trait Scores
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(person.scores).map(([traitKey, scoreVal]) => (
                    <div key={traitKey} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-600">{formatTraitLabel(traitKey)}</span>
                        <span className="font-mono font-semibold text-zinc-900">{scoreVal}/5</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              level <= scoreVal ? 'bg-zinc-900' : 'bg-zinc-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inline Narrative Story Blocks: 2nd-person prose + WhatsApp green bubbles with blue double ticks */}
            <div className="space-y-4 my-6">
              {(person.storyBlocks || []).map((block: CharacterProfileBlock, blockIdx: number) => {
                if (block.type === 'prose' || block.content) {
                  return (
                    <p
                      key={blockIdx}
                      className="font-editorial text-base sm:text-lg text-zinc-800 leading-relaxed font-normal"
                    >
                      {block.content}
                    </p>
                  );
                }

                if (block.type === 'bubble' && block.bubble) {
                  return (
                    <div key={blockIdx} className="my-3 flex justify-end avoid-break">
                      {/* WhatsApp Light Green Bubble: #d9f7be, rounded rect, NO triangle tail */}
                      <div className="max-w-[90%] sm:max-w-[78%] bg-[#d9f7be] text-zinc-900 px-4 py-2.5 rounded-2xl shadow-xs border border-[#b7eb8f]/50 relative">
                        <p className="text-sm font-sans leading-relaxed text-zinc-900 pr-7 whitespace-pre-wrap">
                          {block.bubble.text}
                        </p>
                        {/* Blue double tick: ✓✓ in #4fc3f7 */}
                        <div className="absolute bottom-1.5 right-2.5 flex items-center text-[10px] text-[#4fc3f7] font-sans font-bold tracking-tighter select-none">
                          <span>✓✓</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Reusable Component: Full Deep Dossier Chapters
  const renderDeepDossierContent = () => (
    <div className="w-full space-y-8">
      {/* Vibe Timeline 🌡️ */}
      {(report.vibeTimeline || []).length > 0 && (
        <div className="bg-white rounded-3xl p-7 border border-zinc-200/80 shadow-xs space-y-5 avoid-break">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider">
              <span>THE VIBE TIMELINE 🌡️</span>
            </div>
            <span className="text-xs font-mono text-zinc-400">Month-by-month temperature</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.vibeTimeline.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF9F6] border border-zinc-200/70 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold text-zinc-900">{item.month}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-zinc-200 font-medium">
                      {item.temperature}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden my-2">
                    <div
                      className={`h-full rounded-full ${
                        item.degrees > 75 ? 'bg-orange-500' : item.degrees > 50 ? 'bg-amber-400' : 'bg-sky-400'
                      }`}
                      style={{ width: `${item.degrees}%` }}
                    />
                  </div>
                  <p className="text-xs text-zinc-600 mt-2 leading-relaxed">{item.summary}</p>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 mt-3">{item.degrees}° emotional index</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* The Shift ⏳ */}
      {report.theShift && (
        <div className="bg-[#FEF3C7]/60 rounded-3xl p-7 border border-amber-300/70 shadow-xs space-y-3 avoid-break">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-900 font-semibold uppercase tracking-wider">THE SHIFT ⏳ (TURNING POINT)</span>
            <span className="text-xs font-mono text-amber-800">{report.theShift.period}</span>
          </div>
          <h3 className="text-2xl font-editorial text-zinc-900 font-semibold">{report.theShift.headline}</h3>
          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">{report.theShift.analysis}</p>
          <div className="inline-block px-3 py-1.5 bg-white/80 rounded-lg border border-amber-300 font-mono text-xs font-semibold text-amber-950">
            📊 {report.theShift.metricChange}
          </div>
        </div>
      )}

      {/* Who Cares More Meter ❤️‍🔥 */}
      {report.whoCaresMore && (
        <div className="bg-white rounded-3xl p-7 border border-zinc-200/80 shadow-xs space-y-4 avoid-break">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider">
            <Flame className="w-4 h-4 text-orange-600" />
            <span>WHO CARES MORE METER ❤️‍🔥</span>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm font-semibold mb-2">
              <span className="text-teal-800">{report.whoCaresMore.personA} ({report.whoCaresMore.personAPercent}%)</span>
              <span className="text-purple-800">{report.whoCaresMore.personB} ({report.whoCaresMore.personBPercent}%)</span>
            </div>
            <div className="w-full h-3.5 bg-zinc-100 rounded-full flex overflow-hidden p-0.5">
              <div
                className="bg-teal-600 h-full rounded-l-full transition-all duration-500"
                style={{ width: `${report.whoCaresMore.personAPercent || 70}%` }}
              />
              <div
                className="bg-purple-500 h-full rounded-r-full transition-all duration-500"
                style={{ width: `${report.whoCaresMore.personBPercent || 30}%` }}
              />
            </div>
          </div>
          <ul className="space-y-1.5 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
            {(report.whoCaresMore.evidence || []).map((ev, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-zinc-400 font-mono">•</span>
                <span>{ev}</span>
              </li>
            ))}
          </ul>
          <div className="p-3.5 bg-[#FAF9F6] rounded-xl border border-zinc-200 text-xs text-zinc-800 font-medium italic">
            Verdict: “{report.whoCaresMore.verdict}”
          </div>
        </div>
      )}

      {/* The Unsaid Things 🤫 */}
      {report.theUnsaidThings && (
        <div className="bg-white rounded-3xl p-7 border border-zinc-200/80 shadow-xs space-y-4 avoid-break">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-zinc-700" />
            <span>THE UNSAID THINGS 🤫 (SUBTEXT READER)</span>
          </div>
          <p className="text-xs text-zinc-500 italic">{report.theUnsaidThings.subtextAnalysis}</p>
          <div className="space-y-3">
            {(report.theUnsaidThings.unspokenThoughts || []).map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#FAF9F6] border border-zinc-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-semibold text-zinc-500 mb-1">{item.person} texted:</p>
                  <p className="font-mono text-zinc-800 bg-white p-2.5 rounded-lg border border-zinc-200">“{item.whatTheyTexted}”</p>
                </div>
                <div>
                  <p className="font-semibold text-rose-700 mb-1">What was actually felt:</p>
                  <p className="italic text-zinc-800 bg-white p-2.5 rounded-lg border border-rose-100">“{item.whatTheyActuallyFelt}”</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conflict Report 🥊 */}
      {report.conflictReport && (
        <div className="bg-white rounded-3xl p-7 border border-zinc-200/80 shadow-xs space-y-4 avoid-break">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">CONFLICT REPORT 🥊</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="text-[10px] font-mono text-zinc-400 block uppercase">Fight Patterns</span>
              <p className="text-zinc-800 mt-1">{report.conflictReport.fightPatterns}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="text-[10px] font-mono text-zinc-400 block uppercase">Instigation vs De-escalation</span>
              <p className="text-zinc-800 mt-1">
                <strong>Instigates:</strong> {report.conflictReport.whoInstigates}
              </p>
              <p className="text-zinc-800 mt-1">
                <strong>De-escalates:</strong> {report.conflictReport.whoDeEscalates}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="text-[10px] font-mono text-zinc-400 block uppercase">Resolution Style</span>
              <p className="text-zinc-800 mt-1">{report.conflictReport.conflictResolutionStyle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Love Language Breakdown 💬 */}
      {report.loveLanguages && (
        <div className="bg-white rounded-3xl p-7 border border-zinc-200/80 shadow-xs space-y-4 avoid-break">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">LOVE LANGUAGE BREAKDOWN 💬</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(report.loveLanguages.breakdown || []).map((lp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#FAF9F6] border border-zinc-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-zinc-900">{lp.name}</span>
                  <span className="font-mono text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {lp.expressionScore}% expression
                  </span>
                </div>
                <p className="text-zinc-700"><strong>Primary:</strong> {lp.primaryLanguage}</p>
                <p className="text-zinc-700"><strong>Secondary:</strong> {lp.secondaryLanguage}</p>
                <p className="text-zinc-500 italic">{lp.notes}</p>
              </div>
            ))}
          </div>
          <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-700 leading-relaxed">
            <span className="font-semibold text-zinc-900">Mismatch Analysis:</span> {report.loveLanguages.mismatchAnalysis}
          </div>
        </div>
      )}

      {/* Attachment Style Read 🧠 */}
      {(report.attachmentStyles || []).length > 0 && (
        <div className="bg-white rounded-3xl p-7 border border-zinc-200/80 shadow-xs space-y-4 avoid-break">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">ATTACHMENT STYLE READ 🧠</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {report.attachmentStyles.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#FAF9F6] border border-zinc-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-zinc-900">{item.name}</span>
                  <span className="font-mono text-[11px] bg-zinc-200 text-zinc-800 px-2 py-0.5 rounded font-medium">
                    {item.style}
                  </span>
                </div>
                <p className="text-zinc-700 leading-relaxed">{item.evidence}</p>
                <p className="text-zinc-500 text-[11px]"><strong>Texting habit:</strong> {item.textingBehavior}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hot Takes 🌶️ */}
      {(report.hotTakes || []).length > 0 && (
        <div className="bg-[#FFF7ED] rounded-3xl p-7 border border-orange-200 shadow-xs space-y-4 avoid-break">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-mono text-orange-900 uppercase tracking-wider font-semibold">HOT TAKES 🌶️</span>
            </div>
            <span className="text-[11px] font-mono text-orange-800 bg-orange-100/90 border border-orange-300/70 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 w-fit">
              <Sparkles className="w-3 h-3 text-orange-600" />
              <span>Click any take to unlock AI Conspiracy Theory 🕵️‍♂️</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {report.hotTakes.map((take, idx) => (
              <div
                key={idx}
                onClick={() => handleOpenHotTakeModal(take)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenHotTakeModal(take);
                  }
                }}
                className="p-4 rounded-2xl bg-white border border-orange-200/90 shadow-2xs hover:border-orange-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between text-left select-none"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-wider">
                      TAKE #{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 font-medium">
                      <span>Declassify</span>
                      <span>→</span>
                    </span>
                  </div>
                  <p className="font-editorial text-sm sm:text-base text-zinc-900 italic leading-snug">
                    “{take}”
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-orange-100/80 flex items-center justify-between text-[11px] font-mono text-orange-700/80 group-hover:text-orange-900">
                  <span className="inline-flex items-center gap-1 font-semibold text-[10px] uppercase tracking-wide">
                    <span>Expand Deep Dive</span>
                    <Sparkles className="w-3 h-3 text-orange-500 group-hover:scale-125 transition-transform" />
                  </span>
                  <span className="text-[10px] text-zinc-400 font-sans">Tap to expand</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* The Most Iconic Moment 🎬 */}
      {report.iconicMoment && (
        <div className="bg-white rounded-3xl p-7 border border-zinc-200/80 shadow-xs space-y-3 avoid-break">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">THE MOST ICONIC MOMENT 🎬</span>
          <div className="p-4 bg-zinc-900 text-white rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed">
            {report.iconicMoment.quoteSnippet}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 text-xs text-zinc-600">
            <p><strong>Context:</strong> {report.iconicMoment.context}</p>
            <p><strong>Why It Matters:</strong> {report.iconicMoment.whyItMatters}</p>
          </div>
        </div>
      )}

      {/* Compatibility Score 💯 (Circular SVG Gauge) */}
      {report.compatibility && (
        <div className="bg-white rounded-3xl p-7 border border-zinc-200/80 shadow-xs space-y-6 avoid-break">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">COMPATIBILITY SCORE 💯</span>
            <span className="font-mono text-xs font-semibold text-zinc-900">{report.compatibility.overallScore} / 100</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#E4E4E7" strokeWidth="8" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#18181B"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 - (238.76 * (report.compatibility.overallScore || 60)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-semibold font-mono tabular-nums text-zinc-900">
                  {report.compatibility.overallScore}
                </span>
                <span className="text-[10px] text-zinc-500 font-semibold uppercase">MATCH</span>
              </div>
            </div>
            <div className="space-y-3 w-full">
              {(report.compatibility.dimensions || []).map((dim, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-medium text-zinc-800">{dim.dimension}</span>
                    <span className="font-mono text-zinc-500">{dim.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${dim.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-zinc-600 italic border-t border-zinc-100 pt-3">
            “{report.compatibility.summary}”
          </p>
        </div>
      )}

      {/* Green & Red Flags */}
      {report.flags && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 avoid-break">
          <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200 shadow-2xs">
            <p className="text-xs font-semibold text-emerald-900 mb-3 uppercase tracking-wider">Green Flags 🟢</p>
            <ul className="space-y-2 text-xs text-emerald-950">
              {(report.flags.greenFlags || []).map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-rose-50/60 border border-rose-200 shadow-2xs">
            <p className="text-xs font-semibold text-rose-900 mb-3 uppercase tracking-wider">Red Flags 🚩</p>
            <ul className="space-y-2 text-xs text-rose-950">
              {(report.flags.redFlags || []).map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">⚠</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Soundtrack & Movie Ending */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 avoid-break">
        {/* The Playlist 🎵 */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider">
            <Music className="w-4 h-4 text-purple-600" />
            <span>THE PLAYLIST 🎵</span>
          </div>
          {(report.playlist || []).slice(0, 5).map((t, idx) => (
            <div key={idx} className="text-xs border-b border-zinc-100 pb-2">
              <p className="font-semibold text-zinc-900">{t.title} <span className="font-normal text-zinc-500">— {t.artist}</span></p>
              <p className="text-[11px] text-zinc-500 italic mt-0.5">“{t.reason}”</p>
            </div>
          ))}
        </div>

        {/* If This Were A Movie 🎥 */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider">
            <Film className="w-4 h-4 text-sky-600" />
            <span>IF THIS WERE A MOVIE 🎥</span>
          </div>
          <p className="text-xs font-semibold text-zinc-900">{report.movie?.genre}</p>
          <p className="text-xs text-zinc-600 italic">“{report.movie?.tagline}”</p>
          <div className="pt-2 text-xs text-zinc-700 bg-[#FAF9F6] p-3 rounded-xl border border-zinc-200/60">
            <span className="font-semibold text-zinc-900 block mb-1">Ending:</span>
            {report.movie?.plotEnding}
          </div>
        </div>
      </div>

      {/* Official Awards 🏆 & Closing Verdict */}
      <div className="bg-zinc-900 text-white rounded-3xl p-8 space-y-6 shadow-md avoid-break">
        <div className="flex items-center gap-3">
          <img src={indusAvatar} alt="Brandon" className="w-10 h-10 rounded-full border border-white/20" />
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-mono">FINAL VERDICT</p>
            <h3 className="text-2xl font-editorial text-white">Brandon’s Closing Word</h3>
          </div>
        </div>
        <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-editorial italic">
          “{report.verdict}”
        </p>
        <div className="pt-4 border-t border-white/10 space-y-2">
          <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">WHAT TO DO NEXT:</p>
          {(report.whatToDoNext || []).map((step, i) => (
            <p key={i} className="text-xs text-zinc-300 flex items-start gap-2">
              <span className="text-zinc-500 font-mono">0{i + 1}.</span>
              <span>{step}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Interactive Q&A: Ask Brandon about this chat (hidden in printed PDF) */}
      <div id="brandon-qa-section" className="bg-white rounded-3xl p-7 border border-zinc-200/80 shadow-xs space-y-4 no-print avoid-break">
        <h3 className="text-lg font-editorial text-zinc-900">Ask Brandon about this chat</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {qaHistory.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl text-xs leading-relaxed ${
                m.role === 'indus' ? 'bg-[#FAF9F6] text-zinc-800 border border-zinc-200/60' : 'bg-zinc-900 text-white ml-auto max-w-sm'
              }`}
            >
              <p className="text-[10px] font-semibold opacity-60 mb-0.5">{m.role === 'indus' ? 'Brandon' : 'You'}</p>
              <p>{m.text}</p>
            </div>
          ))}
          {isAsking && <p className="text-xs text-zinc-400 italic">Brandon is voice-noting a reply...</p>}
        </div>

        <form onSubmit={handleAskIndus} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Should I double text or wait?"
            className="flex-1 px-4 py-2.5 rounded-full border border-zinc-200 bg-[#FAF9F6] text-xs focus:outline-none focus:border-zinc-900"
          />
          <button
            type="submit"
            disabled={isAsking || !question.trim()}
            className="px-4 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 disabled:opacity-40 cursor-pointer"
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );

  // Reusable Full Dossier Layout (used both on-screen and as target for PDF export / printing)
  const renderFullDossier = (isPrintContainer: boolean = false) => (
    <div
      id={isPrintContainer ? 'printable-dossier' : undefined}
      className={`w-full space-y-12 py-4 ${
        isPrintContainer
          ? 'printable-dossier bg-[#FAF9F6] p-6 sm:p-8 rounded-3xl'
          : ''
      }`}
    >
      {/* Official Dossier Letterhead */}
      <div className="border-b-2 border-zinc-900 pb-6 mb-8 avoid-break">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-md">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">
              INDUS RELATIONSHIP ARCHIVE · CONFIDENTIAL DOSSIER
            </span>
            <h1 className="text-3xl sm:text-4xl font-editorial font-semibold text-zinc-900 tracking-tight">
              {stats.participants.map((p) => p.name).join(' & ')}
            </h1>
            <p className="text-xs text-zinc-600 font-sans">
              Classification: <span className="font-semibold text-zinc-900">{relationshipType}</span> · Platform:{' '}
              <span className="font-mono uppercase font-semibold text-zinc-900">{stats.platform}</span>
            </p>
            <div className="font-mono text-[11px] text-zinc-500 pt-1 flex flex-wrap gap-x-3 gap-y-0.5">
              <span>REF: #{id.toUpperCase().slice(0, 16)}</span>
              <span>·</span>
              <span>{stats.dateRange}</span>
              <span>·</span>
              <span>{stats.totalMessages.toLocaleString()} msgs</span>
            </div>
          </div>

          {/* Printable Analysis Grade Badge (Print-Optimized with crisp borders & contrast on paper) */}
          <div className="analysis-grade-badge flex items-center gap-3.5 p-3.5 rounded-2xl border-2 border-zinc-900 bg-white shadow-xs avoid-break shrink-0">
            <div className="w-14 h-14 rounded-xl bg-zinc-900 text-white flex flex-col items-center justify-center font-mono font-bold tracking-tight shrink-0 shadow-2xs">
              <span className="text-[8px] uppercase tracking-widest text-zinc-400 leading-none">GRADE</span>
              <span className="text-2xl leading-none font-black mt-0.5">{analysisGradeInfo.grade}</span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-900">
                  {analysisGradeInfo.badge}
                </span>
              </div>
              <p className="text-xs font-bold text-zinc-900 tracking-tight leading-tight">
                {analysisGradeInfo.descriptor}
              </p>
              <p className="text-[10px] font-mono text-zinc-500">
                Score: {compatibilityScore}/100 · Certified by Indus
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 1 Heatmap in Dossier */}
      <div className="w-full bg-[#0C1222] text-white rounded-3xl p-7 sm:p-10 shadow-xl border border-slate-800 avoid-break">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
          <span>01 / TIMELINE ARCHIVE</span>
          <span>{stats.dateRange}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-editorial text-amber-100/90 tracking-tight leading-tight">
          “Your years, day by day.”
        </h2>
        <p className="mt-3 text-sm text-slate-300 max-w-xl font-light">
          {stats.activeDaysCount || 71} active talking days across {stats.totalDays} calendar days. Every gold square marks a day you exchanged words.
        </p>
        <div className="my-8 bg-[#070B14] p-5 sm:p-6 rounded-2xl border border-slate-800/80 overflow-x-auto">
          <div className="grid grid-rows-7 grid-flow-col gap-1.5 w-max mx-auto py-2">
            {(stats.heatmapDays || []).slice(0, 112).map((d, i) => {
              const levelClasses = [
                'bg-slate-800/60',
                'bg-amber-900/60',
                'bg-amber-600',
                'bg-amber-400',
                'bg-amber-200 shadow-xs shadow-amber-300/40',
              ];
              return (
                <div
                  key={i}
                  title={`${d.date}: ${d.count} messages`}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-xs ${levelClasses[d.level] || 'bg-slate-800/60'}`}
                />
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 font-mono tabular-nums text-xs">
          <div>
            <p className="text-slate-400">Total Volume</p>
            <p className="text-lg font-semibold text-white mt-0.5">{stats.totalMessages.toLocaleString()} msgs</p>
          </div>
          <div>
            <p className="text-slate-400">Active Rate</p>
            <p className="text-lg font-semibold text-amber-300 mt-0.5">
              {Math.round(((stats.activeDaysCount || 71) / Math.max(1, stats.totalDays)) * 100)}%
            </p>
          </div>
          <div>
            <p className="text-slate-400">Peak Month</p>
            <p className="text-lg font-semibold text-white mt-0.5">{stats.monthlyTimeline?.[0]?.month || 'Jan 2026'}</p>
          </div>
        </div>
      </div>

      {/* Slide 2 Who Talks / Who Starts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 avoid-break">
        <div className="bg-[#EAE6F8] rounded-3xl p-7 flex flex-col justify-between border border-purple-200/60 shadow-xs">
          <div>
            <span className="text-xs font-mono text-purple-800 uppercase tracking-wider font-semibold">Message Distribution</span>
            <h3 className="text-2xl font-editorial text-zinc-900 mt-1">Who fills the screen</h3>
          </div>
          <div className="my-6 flex items-center justify-center relative">
            <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" stroke="#0D9488" strokeWidth="16" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#8B5CF6"
                strokeWidth="16"
                fill="none"
                strokeDasharray="238.76"
                strokeDashoffset={238.76 * (p1MsgPct / 100)}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs font-mono text-zinc-500 uppercase">Leader</span>
              <span className="text-2xl font-semibold font-mono text-zinc-900">{p1.name}</span>
              <span className="text-xs font-mono text-teal-700 font-semibold">{p1MsgPct}%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-purple-200/50 text-xs font-mono tabular-nums">
            <div>
              <p className="font-semibold text-zinc-900">{p1.name}</p>
              <p className="text-zinc-500">{p1.messageCount} msgs ({p1MsgPct}%)</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-900">{p2.name}</p>
              <p className="text-zinc-500">{p2.messageCount} msgs ({p2MsgPct}%)</p>
            </div>
          </div>
        </div>

        <div className="bg-[#E6F4EA] rounded-3xl p-7 flex flex-col justify-between border border-emerald-200/60 shadow-xs">
          <div>
            <span className="text-xs font-mono text-emerald-800 uppercase tracking-wider font-semibold">Conversation Starters</span>
            <h3 className="text-2xl font-editorial text-zinc-900 mt-1">Who breaks the silence</h3>
          </div>
          <div className="my-8 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span>{p1.name}</span>
                <span className="font-mono text-teal-800">{p1.initiationPercent}% ({p1.initiationCount} starts)</span>
              </div>
              <div className="w-full h-4 bg-emerald-200/60 rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-teal-600 rounded-full" style={{ width: `${p1.initiationPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span>{p2.name}</span>
                <span className="font-mono text-purple-800">{p2.initiationPercent}% ({p2.initiationCount} starts)</span>
              </div>
              <div className="w-full h-4 bg-emerald-200/60 rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${p2.initiationPercent}%` }} />
              </div>
            </div>
          </div>
          <div className="p-3.5 bg-white/70 rounded-xl border border-emerald-200/70 text-xs text-zinc-700">
            <span className="font-semibold text-emerald-950">Brandon Note:</span> {p1.name} initiates {p1.initiationPercent}% of all conversations.
          </div>
        </div>
      </div>

      {/* Slide 3 Rhythm & Cadence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 avoid-break">
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-zinc-500">SPEED RANKINGS</span>
            <h3 className="text-lg font-editorial text-zinc-900 mt-1">Average Reply Latency</h3>
          </div>
          <div className="space-y-3.5 my-4">
            <div className="p-3 rounded-2xl bg-[#FFFBEB] border border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🥇</span>
                <div>
                  <p className="text-xs font-semibold text-zinc-900">{p1.name}</p>
                  <p className="text-[11px] text-amber-800">Lightning Reflexes</p>
                </div>
              </div>
              <span className="font-mono text-base font-semibold text-amber-900">{p1.avgReplyMinutes} min</span>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🥈</span>
                <div>
                  <p className="text-xs font-semibold text-zinc-900">{p2.name}</p>
                  <p className="text-[11px] text-zinc-500">Deliberate Pacing</p>
                </div>
              </div>
              <span className="font-mono text-base font-semibold text-zinc-700">{p2.avgReplyMinutes} min</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500">
            {p2.name} takes <span className="font-semibold text-zinc-800 font-mono">{Math.round(p2.avgReplyMinutes / Math.max(1, p1.avgReplyMinutes))}x longer</span> to reply.
          </p>
        </div>

        <div className="space-y-4 flex flex-col justify-between">
          <div className="bg-[#FEF3C7] rounded-3xl p-5 border border-amber-300/70 shadow-xs flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-900 font-semibold">RECORD DAY 🔥</span>
              <span className="text-xs font-mono text-amber-800">{stats.recordDay?.date || 'Peak Night'}</span>
            </div>
            <div className="my-2">
              <p className="text-3xl font-semibold font-mono tabular-nums text-zinc-900">
                {stats.recordDay?.count || 186} msgs
              </p>
              <p className="text-xs text-amber-950 mt-1">Most intense single 24-hour exchange</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1">
            <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Longest Streak</span>
              <p className="text-2xl font-semibold font-mono text-emerald-600 my-1">
                {stats.longestStreakDays || 24} days
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Max Silence</span>
              <p className="text-2xl font-semibold font-mono text-rose-600 my-1">
                {stats.longestSilenceHours || 74}h
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-zinc-500">BY HOUR</span>
            <h3 className="text-lg font-editorial text-zinc-900 mt-1">When You Talk</h3>
            <p className="text-xs text-zinc-500">Peak: {stats.peakHourLabel}</p>
          </div>
          <div className="grid grid-cols-6 gap-2 items-end h-28 my-4">
            {(stats.hourlyDistribution || []).map((slot) => {
              const heightPct = Math.max(12, Math.round((slot.count / maxHourlyCount) * 100));
              return (
                <div key={slot.hour} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-zinc-100 rounded-md h-16 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-zinc-900 rounded-md transition-all duration-300"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{slot.hour}</span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">
            {stats.lateNightPercent}% of all messages arrive between 11 PM and 4 AM.
          </p>
        </div>
      </div>

      {/* Slide 4 Vocabulary & Emoji Autopsy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 avoid-break">
        <div className="bg-[#D1FAE5] rounded-3xl p-7 border border-emerald-300/70 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-emerald-900 uppercase font-semibold">SHARED VOCABULARY</span>
            <h2 className="text-2xl font-editorial text-zinc-900 mt-1">Most recurring words</h2>
          </div>
          <div className="my-6 space-y-2.5">
            {(stats.topSharedWords || []).slice(0, 6).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-white/70 rounded-xl border border-emerald-200/60 font-mono text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-700 font-bold">#{idx + 1}</span>
                  <span className="font-semibold text-zinc-900 capitalize">“{item.word}”</span>
                </div>
                <span className="text-zinc-600 tabular-nums">{item.count} times</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-emerald-900 italic">Filtered for recurring callbacks & nouns</p>
        </div>

        <div className="bg-[#FEF08A] rounded-3xl p-7 border border-yellow-300/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-yellow-950 uppercase font-semibold">EMOJI AUTOPSY</span>
            <h2 className="text-2xl font-editorial text-zinc-900 mt-1">Emotional punctuation</h2>
          </div>
          <div className="my-6 flex items-center justify-around p-4 bg-white/80 rounded-2xl border border-yellow-300/60">
            {((p1.topEmojis || []).slice(0, 2)).concat((p2.topEmojis || []).slice(0, 2)).map((e, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-4xl sm:text-5xl">{e.emoji}</span>
                <span className="font-mono text-xs font-semibold text-zinc-700 mt-1">{e.count}x</span>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white/80 rounded-xl border border-yellow-300/60 text-xs text-zinc-800 leading-relaxed">
            <span className="font-semibold text-zinc-900">Read:</span> {report.emojiAutopsy?.overallRead || 'Buffer emojis to cushion direct questions.'}
          </div>
        </div>
      </div>

      {/* Slide 5 Brandon Monologue in Dossier */}
      <div className="w-full bg-[#FAF8F5] rounded-3xl p-8 sm:p-14 border border-zinc-200 shadow-md text-center max-w-2xl mx-auto avoid-break">
        <div className="w-16 h-16 rounded-full p-1 bg-white border border-zinc-200 mx-auto mb-5 shadow-xs">
          <img src={indusAvatar} alt="Brandon" className="w-full h-full rounded-full object-cover" />
        </div>
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">CHAPTER 05 · BRANDON’S MONOLOGUE</span>
        <h2 className="text-3xl sm:text-4xl font-editorial text-zinc-900 mt-3 tracking-tight font-normal">
          {report.headline}
        </h2>
        <div className="my-6 text-zinc-400 font-editorial tracking-widest text-lg select-none">
          — ♦ —
        </div>
        <p className="text-base sm:text-lg font-editorial text-zinc-800 leading-relaxed italic text-left sm:text-center">
          “{report.overview}”
        </p>
      </div>

      {/* Gated Premium Dossier Sections */}
      {!isPaid && !isSample ? (
        <div className="bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-8 sm:p-10 text-center space-y-5 shadow-md avoid-break my-8">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-900 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-amber-700" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-900 font-semibold block">PREMIUM CHAPTERS LOCKED</span>
            <h3 className="text-2xl sm:text-3xl font-editorial text-zinc-900 mt-1 font-semibold">
              Unlock The Complete Relationship Autopsy
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto mt-2">
              Unlock the remaining 14 chapters including The Personnel File with verbatim WhatsApp green bubbles, The Subtext Reader, Conflict Resolution, and Full Multi-Page PDF Download.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowPaywallModal(true)}
              className="px-6 py-3 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm"
            >
              Unlock Full Access — $4.99
            </button>
            <button
              onClick={handleUnlockPaidReport}
              className="px-4 py-3 rounded-full bg-white text-zinc-800 border border-zinc-200 text-xs font-medium hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              Instant Demo Unlock
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Character Profiles with WhatsApp Green Bubbles */}
          {renderCharacterProfilesSection()}

          {/* Deep Dossier Remaining Sections */}
          {renderDeepDossierContent()}
        </>
      )}

      {/* Verification Footer for Print/PDF */}
      <div className="border-t border-zinc-200/80 pt-6 mt-12 text-center text-xs text-zinc-400 font-mono avoid-break">
        <p>INDUS ARCHIVE · CONFIDENTIAL RELATIONSHIP AUTOPSY · REF #{id.toUpperCase().slice(0, 16)}</p>
        <p className="mt-1">Generated {new Date(createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · End of Official Dossier</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-between px-4 sm:px-6 py-6 max-w-4xl mx-auto w-full font-sans">
      {/* Off-screen / Print Dossier Container (Always available in DOM for instant PDF export & browser print) */}
      <div
        className={
          viewMode === 'slides'
            ? 'fixed -left-[9999px] top-0 w-[820px] pointer-events-none opacity-0 print:static print:opacity-100 print:pointer-events-auto print:w-full print:block'
            : 'hidden'
        }
      >
        {renderFullDossier(true)}
      </div>

      {/* 1. Header Bar: Mode Switcher + Story Progress / Share / Export PDF buttons */}
      <div className="w-full space-y-3 mb-6 no-print">
        {/* Top bar: Mode Toggle & Utilities */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-semibold text-zinc-900">{relationshipType}</span>
            <span aria-hidden="true">·</span>
            <span>{stats.totalMessages.toLocaleString()} msgs</span>

            {/* Analysis Grade Badge in Top Bar */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-zinc-300 bg-white text-zinc-900 shadow-2xs font-mono font-bold text-[10px]">
              <span className="text-zinc-400 uppercase text-[9px]">GRADE</span>
              <span className="font-black text-xs text-zinc-900">{analysisGradeInfo.grade}</span>
              <span className="text-zinc-300">·</span>
              <span className="text-zinc-600 font-medium text-[9px] uppercase tracking-wide">{analysisGradeInfo.descriptor}</span>
            </div>

            {/* 30-Day Archive Badge */}
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
              <Clock className="w-2.5 h-2.5" />
              <span>30-Day Archive</span>
            </span>

            {isSample && <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px]">Sample</span>}
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-zinc-100 p-1 rounded-full border border-zinc-200">
              <button
                onClick={() => setViewMode('slides')}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  viewMode === 'slides' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Story Slides
              </button>
              <button
                onClick={() => setViewMode('dossier')}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  viewMode === 'dossier' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Full Dossier
              </button>
            </div>

            {/* Mobile / Phone Frame Mode Toggle */}
            <button
              onClick={() => {
                triggerHaptic();
                setPhoneFrameMode((prev) => !prev);
              }}
              title={phoneFrameMode ? 'Switch to wide view' : 'Switch to phone mockup view'}
              className={`px-2.5 py-1 rounded-full border transition-colors inline-flex items-center gap-1 cursor-pointer text-xs ${
                phoneFrameMode
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs font-semibold'
                  : 'bg-white text-zinc-600 hover:text-zinc-900 border-zinc-200'
              }`}
            >
              {phoneFrameMode ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{phoneFrameMode ? 'Phone Frame' : 'Wide'}</span>
            </button>

            {/* Paywall Unlock Pill */}
            {!isPaid && !isSample ? (
              <button
                onClick={() => setShowPaywallModal(true)}
                className="px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-medium inline-flex items-center gap-1 text-[11px] shadow-2xs transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Unlock ($4.99)</span>
              </button>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] inline-flex items-center gap-1">
                <Unlock className="w-2.5 h-2.5 text-emerald-600" />
                <span>Unlocked</span>
              </span>
            )}

            {/* Share Link */}
            <button
              onClick={handleCopyShareLink}
              className="hover:text-zinc-900 transition-colors inline-flex items-center gap-1 cursor-pointer px-2 py-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            {/* Export PDF Button (opens modal) */}
            <button
              onClick={() => setShowExportModal(true)}
              className="hover:text-zinc-900 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full transition-colors inline-flex items-center gap-1.5 cursor-pointer px-3 py-1 font-sans font-medium text-xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Story Progress Bar (Visible in 'slides' mode) */}
        {viewMode === 'slides' && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1.5 w-full">
              {Array.from({ length: TOTAL_SLIDES }).map((_, idx) => {
                const isLocked = !isPaid && !isSample && idx >= 3;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectSlide(idx)}
                    className="flex-1 h-1.5 rounded-full overflow-hidden bg-zinc-200 cursor-pointer transition-colors relative"
                    title={isLocked ? `Slide ${idx + 1} (Locked - Tap to Unlock)` : `Slide ${idx + 1}`}
                  >
                    <div
                      className={`h-full transition-all duration-300 ${
                        idx < currentSlide
                          ? 'bg-zinc-900 w-full'
                          : idx === currentSlide
                          ? isLocked
                            ? 'bg-amber-500 w-full'
                            : 'bg-zinc-900 w-full'
                          : 'w-0'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1">
                <span>Slide {currentSlide + 1} of {TOTAL_SLIDES}</span>
                {!isPaid && !isSample && currentSlide >= 3 && (
                  <span className="text-amber-600 font-semibold inline-flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" /> Premium
                  </span>
                )}
              </span>
              <span>
                {currentSlide === 0 && 'Heatmap Archive'}
                {currentSlide === 1 && 'Talk & Initiation Ratios'}
                {currentSlide === 2 && 'Cadence & Records'}
                {currentSlide === 3 && 'Vocabulary & Emojis'}
                {currentSlide === 4 && 'Brandon’s Monologue'}
                {currentSlide === 5 && 'The Personnel File'}
                {currentSlide === 6 && 'Complete Dossier'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Slide Container OR Continuous Dossier */}
      <div className="w-full flex-1 flex flex-col justify-center">
        {viewMode === 'dossier' ? (
          /* ========================================================= */
          /* FULL DOSSIER VIEW (Continuous Scrollable Magazine Layout) */
          /* ========================================================= */
          renderFullDossier(true)
        ) : (
          <>
            {/* ========================================================= */}
            {/* SLIDE-BY-SLIDE STORY MODE (Slides 1 to 7) */}
            {/* ========================================================= */}
            <div
              className={`no-print w-full transition-all duration-300 ${
              phoneFrameMode
                ? 'max-w-[430px] mx-auto border-4 border-zinc-800 rounded-[44px] p-4 sm:p-5 bg-zinc-950/5 shadow-2xl relative my-3'
                : ''
            }`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {phoneFrameMode && (
              <div className="w-24 h-3.5 bg-zinc-800 rounded-full mx-auto mb-4 shrink-0 shadow-inner" />
            )}
            {/* SLIDE 1: "Your years, day by day." (Dark Navy Heatmap) */}
            {currentSlide === 0 && (
              <div className="w-full bg-[#0C1222] text-white rounded-3xl p-7 sm:p-10 shadow-xl border border-slate-800 flex flex-col justify-between min-h-[500px]">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                    <span>01 / TIMELINE ARCHIVE</span>
                    <span>{stats.dateRange}</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-editorial text-amber-100/90 tracking-tight leading-tight">
                    “Your years, day by day.”
                  </h1>
                  <p className="mt-3 text-sm text-slate-300 max-w-xl font-light">
                    {stats.activeDaysCount || 71} active talking days across {stats.totalDays} calendar days. Every gold square marks a day you exchanged words.
                  </p>
                </div>

                <div className="my-8 bg-[#070B14] p-5 sm:p-6 rounded-2xl border border-slate-800/80 overflow-x-auto">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3">
                    <span>16-Week Heatmap</span>
                    <span className="flex items-center gap-1">
                      <span>Quiet</span>
                      <span className="w-2.5 h-2.5 rounded-xs bg-slate-800 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-xs bg-amber-900/50 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-xs bg-amber-600 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-xs bg-amber-200 inline-block" />
                      <span>Non-stop</span>
                    </span>
                  </div>

                  <div className="grid grid-rows-7 grid-flow-col gap-1.5 w-max mx-auto py-2">
                    {(stats.heatmapDays || []).slice(0, 112).map((d, i) => {
                      const levelClasses = [
                        'bg-slate-800/60',
                        'bg-amber-900/60',
                        'bg-amber-600',
                        'bg-amber-400',
                        'bg-amber-200 shadow-xs shadow-amber-300/40',
                      ];
                      return (
                        <div
                          key={i}
                          title={`${d.date}: ${d.count} messages`}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-xs transition-transform hover:scale-125 ${
                            levelClasses[d.level] || 'bg-slate-800/60'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 font-mono tabular-nums text-xs">
                  <div>
                    <p className="text-slate-400">Total Volume</p>
                    <p className="text-lg font-semibold text-white mt-0.5">{stats.totalMessages.toLocaleString()} msgs</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Active Rate</p>
                    <p className="text-lg font-semibold text-amber-300 mt-0.5">
                      {Math.round(((stats.activeDaysCount || 71) / Math.max(1, stats.totalDays)) * 100)}% of days
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Peak Month</p>
                    <p className="text-lg font-semibold text-white mt-0.5">{stats.monthlyTimeline?.[0]?.month || 'Jan 2026'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 2: "Who talks, who starts." (Lavender & Green Cards) */}
            {currentSlide === 1 && (
              <div className="w-full space-y-6">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-mono text-zinc-400">02 / TALK & INITIATION RATIOS</span>
                  <h1 className="text-3xl sm:text-5xl font-editorial text-zinc-900 tracking-tight mt-1">
                    “Who talks, who starts.”
                  </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Lavender Card: Donut Chart - Who Talks More */}
                  <div className="bg-[#EAE6F8] rounded-3xl p-7 flex flex-col justify-between border border-purple-200/60 shadow-xs">
                    <div>
                      <span className="text-xs font-mono text-purple-800 uppercase tracking-wider font-semibold">Message Distribution</span>
                      <h2 className="text-2xl font-editorial text-zinc-900 mt-1">Who fills the screen</h2>
                      <p className="text-xs text-zinc-600 mt-1">Total words and overall message share</p>
                    </div>

                    <div className="my-6 flex items-center justify-center relative">
                      <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="38" stroke="#0D9488" strokeWidth="16" fill="none" />
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke="#8B5CF6"
                          strokeWidth="16"
                          fill="none"
                          strokeDasharray="238.76"
                          strokeDashoffset={238.76 * (p1MsgPct / 100)}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-xs font-mono text-zinc-500 uppercase">Leader</span>
                        <span className="text-2xl font-semibold font-mono text-zinc-900">{p1.name}</span>
                        <span className="text-xs font-mono text-teal-700 font-semibold">{p1MsgPct}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-purple-200/50 text-xs font-mono tabular-nums">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-teal-600 shrink-0" />
                        <div>
                          <p className="font-semibold text-zinc-900">{p1.name}</p>
                          <p className="text-zinc-500">{p1.messageCount} msgs ({p1MsgPct}%)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />
                        <div>
                          <p className="font-semibold text-zinc-900">{p2.name}</p>
                          <p className="text-zinc-500">{p2.messageCount} msgs ({p2MsgPct}%)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mint/Green Card: Horizontal Progress Bars - Who Starts */}
                  <div className="bg-[#E6F4EA] rounded-3xl p-7 flex flex-col justify-between border border-emerald-200/60 shadow-xs">
                    <div>
                      <span className="text-xs font-mono text-emerald-800 uppercase tracking-wider font-semibold">Conversation Starters</span>
                      <h2 className="text-2xl font-editorial text-zinc-900 mt-1">Who breaks the silence</h2>
                      <p className="text-xs text-zinc-600 mt-1">New threads started after 6+ hours of radio silence</p>
                    </div>

                    <div className="my-8 space-y-6">
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-2">
                          <span className="flex items-center gap-2 text-zinc-900">
                            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                            <span>{p1.name}</span>
                          </span>
                          <span className="font-mono text-teal-800">{p1.initiationPercent}% ({p1.initiationCount} starts)</span>
                        </div>
                        <div className="w-full h-4 bg-emerald-200/60 rounded-full overflow-hidden p-0.5">
                          <div
                            className="h-full bg-teal-600 rounded-full transition-all duration-500"
                            style={{ width: `${p1.initiationPercent}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-2">
                          <span className="flex items-center gap-2 text-zinc-900">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                            <span>{p2.name}</span>
                          </span>
                          <span className="font-mono text-purple-800">{p2.initiationPercent}% ({p2.initiationCount} starts)</span>
                        </div>
                        <div className="w-full h-4 bg-emerald-200/60 rounded-full overflow-hidden p-0.5">
                          <div
                            className="h-full bg-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${p2.initiationPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white/70 rounded-xl border border-emerald-200/70 text-xs text-zinc-700">
                      <span className="font-semibold text-emerald-950">Brandon Note:</span> {p1.name} initiates{' '}
                      <span className="font-semibold text-teal-800 font-mono">{p1.initiationPercent}%</span> of conversations.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 3: "Your rhythm." (Medals, Record Day, Streak vs Silence, Hourly Chart) */}
            {currentSlide === 2 && (
              <div className="w-full space-y-6">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-mono text-zinc-400">03 / CADENCE & RECORD HIGHS</span>
                  <h1 className="text-3xl sm:text-5xl font-editorial text-zinc-900 tracking-tight mt-1">
                    “Your rhythm.”
                  </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Medal Cards: Speed Rankings */}
                  <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-mono text-zinc-500">SPEED RANKINGS</span>
                      <h3 className="text-lg font-editorial text-zinc-900 mt-1">Average Reply Latency</h3>
                    </div>

                    <div className="space-y-3.5 my-4">
                      <div className="p-3 rounded-2xl bg-[#FFFBEB] border border-amber-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">🥇</span>
                          <div>
                            <p className="text-xs font-semibold text-zinc-900">{p1.name}</p>
                            <p className="text-[11px] text-amber-800">Lightning Reflexes</p>
                          </div>
                        </div>
                        <span className="font-mono text-base font-semibold text-amber-900">{p1.avgReplyMinutes} min</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">🥈</span>
                          <div>
                            <p className="text-xs font-semibold text-zinc-900">{p2.name}</p>
                            <p className="text-[11px] text-zinc-500">Deliberate Pacing</p>
                          </div>
                        </div>
                        <span className="font-mono text-base font-semibold text-zinc-700">{p2.avgReplyMinutes} min</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-500">
                      {p2.name} takes <span className="font-semibold text-zinc-800 font-mono">{Math.round(p2.avgReplyMinutes / Math.max(1, p1.avgReplyMinutes))}x longer</span> to reply on average.
                    </p>
                  </div>

                  {/* Side-by-Side: Record Day + Streak / Longest Silence */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div className="bg-[#FEF3C7] rounded-3xl p-5 border border-amber-300/70 shadow-xs flex-1 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-amber-900 font-semibold">RECORD DAY 🔥</span>
                        <span className="text-xs font-mono text-amber-800">{stats.recordDay?.date || 'Peak Night'}</span>
                      </div>
                      <div className="my-2">
                        <p className="text-3xl font-semibold font-mono tabular-nums text-zinc-900">
                          {stats.recordDay?.count || 186} msgs
                        </p>
                        <p className="text-xs text-amber-950 mt-1">Most intense single 24-hour exchange</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">Longest Streak</span>
                        <p className="text-2xl font-semibold font-mono text-emerald-600 my-1">
                          {stats.longestStreakDays || 24} days
                        </p>
                        <span className="text-[10px] text-zinc-500">Consecutive days</span>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">Max Silence</span>
                        <p className="text-2xl font-semibold font-mono text-rose-600 my-1">
                          {stats.longestSilenceHours || 74}h
                        </p>
                        <span className="text-[10px] text-zinc-500">Longest cold gap</span>
                      </div>
                    </div>
                  </div>

                  {/* By Hour Bar Chart */}
                  <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-mono text-zinc-500">BY HOUR</span>
                      <h3 className="text-lg font-editorial text-zinc-900 mt-1">When You Talk</h3>
                      <p className="text-xs text-zinc-500">Peak: {stats.peakHourLabel}</p>
                    </div>

                    <div className="grid grid-cols-6 gap-2 items-end h-28 my-4">
                      {(stats.hourlyDistribution || []).map((slot) => {
                        const heightPct = Math.max(12, Math.round((slot.count / maxHourlyCount) * 100));
                        return (
                          <div key={slot.hour} className="flex flex-col items-center gap-1.5 h-full justify-end">
                            <div className="w-full bg-zinc-100 rounded-md h-16 flex items-end overflow-hidden">
                              <div
                                className="w-full bg-zinc-900 rounded-md transition-all duration-300"
                                style={{ height: `${heightPct}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-zinc-500">{slot.hour}</span>
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-[11px] text-zinc-500 font-mono">
                      {stats.lateNightPercent}% of all messages arrive between 11 PM and 4 AM.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 4: "Your words." (Mint Card Word List + Yellow Emoji Row) */}
            {currentSlide === 3 && (
              <div className="w-full space-y-6">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-mono text-zinc-400">04 / VOCABULARY & REACTION DNA</span>
                  <h1 className="text-3xl sm:text-5xl font-editorial text-zinc-900 tracking-tight mt-1">
                    “Your words.”
                  </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mint Card: Ranked Word List */}
                  <div className="bg-[#D1FAE5] rounded-3xl p-7 border border-emerald-300/70 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-mono text-emerald-900 uppercase font-semibold">SHARED VOCABULARY</span>
                      <h2 className="text-2xl font-editorial text-zinc-900 mt-1">Most recurring words</h2>
                      <p className="text-xs text-emerald-950 mt-1">Filtered for conversational nouns and recurring callbacks</p>
                    </div>

                    <div className="my-6 space-y-2.5">
                      {(stats.topSharedWords || []).slice(0, 6).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-white/70 rounded-xl border border-emerald-200/60 font-mono text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-emerald-700 font-bold">#{idx + 1}</span>
                            <span className="font-semibold text-zinc-900 capitalize">“{item.word}”</span>
                          </div>
                          <span className="text-zinc-600 tabular-nums">{item.count} times</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-emerald-900 italic">
                      Words that appear in every single weekend confirmation.
                    </p>
                  </div>

                  {/* Yellow Card: Large Emoji Row & Autopsy */}
                  <div className="bg-[#FEF08A] rounded-3xl p-7 border border-yellow-300/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-mono text-yellow-950 uppercase font-semibold">EMOJI AUTOPSY</span>
                      <h2 className="text-2xl font-editorial text-zinc-900 mt-1">Your emotional punctuation</h2>
                      <p className="text-xs text-yellow-950 mt-1">Top emojis used to cushion boundaries or fake casualness</p>
                    </div>

                    <div className="my-6 flex items-center justify-around p-4 bg-white/80 rounded-2xl border border-yellow-300/60">
                      {((p1.topEmojis || []).slice(0, 2)).concat((p2.topEmojis || []).slice(0, 2)).map((e, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <span className="text-4xl sm:text-5xl hover:scale-125 transition-transform cursor-default">{e.emoji}</span>
                          <span className="font-mono text-xs font-semibold text-zinc-700 mt-1">{e.count}x</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-white/80 rounded-xl border border-yellow-300/60 text-xs text-zinc-800 leading-relaxed">
                      <span className="font-semibold text-zinc-900">Read:</span> {report.emojiAutopsy?.overallRead || 'Heavy use of buffer emojis to avoid asking direct questions.'}
                    </div>

                    <button
                      onClick={() => handleSelectSlide(4)}
                      className="mt-4 w-full py-3 bg-zinc-900 text-white rounded-full text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer inline-flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>See Brandon’s Monologue →</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 5: Editorial Monologue Slide (Pure Serif Prose + "— ♦ —" divider) */}
            {currentSlide === 4 && (
              <div className="w-full bg-[#FAF8F5] rounded-3xl p-8 sm:p-14 border border-zinc-200 shadow-md text-center max-w-2xl mx-auto flex flex-col justify-between min-h-[540px]">
                <div>
                  <div className="w-16 h-16 rounded-full p-1 bg-white border border-zinc-200 mx-auto mb-5 shadow-xs">
                    <img
                      src={indusAvatar}
                      alt="Brandon"
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>

                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">CHAPTER 05 · BRANDON’S MONOLOGUE</span>

                  <h1 className="text-3xl sm:text-4xl font-editorial text-zinc-900 mt-3 tracking-tight font-normal">
                    {report.headline}
                  </h1>

                  <div className="my-6 text-zinc-400 font-editorial tracking-widest text-lg select-none">
                    — ♦ —
                  </div>

                  <p className="text-base sm:text-lg font-editorial text-zinc-800 leading-relaxed text-left sm:text-center italic">
                    “{report.overview}”
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-200/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>{p1.name} & {p2.name}</span>
                  <button
                    onClick={() => handleSelectSlide(5)}
                    className="text-zinc-900 font-semibold underline underline-offset-4 hover:text-zinc-600 transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Read The Personnel File →</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* SLIDE 6: The Personnel File / Character Profiles (2nd Person + WhatsApp Green Bubbles) */}
            {currentSlide === 5 && (
              <div className="w-full space-y-6">
                {renderCharacterProfilesSection()}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleSelectSlide(6)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Read The Complete Dossier →</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* SLIDE 7: The Complete Deep Dossier */}
            {currentSlide === 6 && (
              <div className="w-full space-y-8 pb-8">
                <div className="text-center sm:text-left pb-4 border-b border-zinc-200">
                  <span className="text-xs font-mono text-zinc-400">07 / THE FULL DOSSIER</span>
                  <h1 className="text-3xl sm:text-5xl font-editorial text-zinc-900 tracking-tight mt-1">
                    The Complete Relationship Autopsy
                  </h1>
                  <p className="mt-2 text-sm text-zinc-600">
                    All deep-dive chapters: subtext reader, conflict patterns, compatibility breakdown, attachment styles, and soundtrack.
                  </p>
                </div>

                {renderDeepDossierContent()}
              </div>
            )}
          </div>

          {/* Always-mounted printable dossier for PDF generation & native print */}
          <div className="fixed -left-[9999px] top-0 w-[820px] pointer-events-none opacity-100 print:static print:left-auto print:w-full print:block">
            {renderFullDossier(true)}
          </div>
        </>
      )}
    </div>

    {/* 3. Bottom Slide-by-Slide Navigation Bar (in 'slides' mode) */}
      {viewMode === 'slides' && (
        <div className="w-full pt-6 border-t border-zinc-200/80 flex items-center justify-between no-print mt-6">
          <button
            onClick={handlePrevSlide}
            disabled={currentSlide === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 disabled:opacity-30 disabled:hover:text-zinc-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <button
                key={i}
                onClick={() => handleSelectSlide(i)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  i === currentSlide ? 'bg-zinc-900 w-5' : 'bg-zinc-300 hover:bg-zinc-400'
                }`}
                title={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {currentSlide < TOTAL_SLIDES - 1 ? (
            <button
              onClick={handleNextSlide}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer shadow-xs"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('/setup')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer shadow-xs"
            >
              <span>Analyze Another Chat →</span>
            </button>
          )}
        </div>
      )}

      {/* Paywall Unlock Modal */}
      {showPaywallModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-zinc-200 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-semibold block">
                  WHATARWE FULL PASS
                </span>
                <h3 className="text-2xl font-editorial text-zinc-900 mt-1 font-semibold">
                  Unlock Full Relationship Dossier
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Access all 18 chapters, verbatim WhatsApp evidence bubbles, and printable PDF archive.
                </p>
              </div>
              <button
                onClick={() => setShowPaywallModal(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-[#FAF9F6] p-4 rounded-2xl border border-zinc-200 text-xs text-zinc-700">
              <p className="font-semibold text-zinc-900 text-xs">Included in the Full Pass:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>The Personnel File</strong> with inline WhatsApp green bubbles & double ticks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>The Subtext Reader</strong> (what was texted vs what was felt)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>The Vibe Timeline & The Shift</strong> turning point analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Compatibility Score Gauge & Soundtrack</strong> playlist</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Multi-Page A4 PDF Export</strong> with Analysis Grade letterhead</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Unlimited Follow-Up Q&A</strong> with Brandon</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={handleUnlockPaidReport}
                disabled={isUnlocking}
                className="w-full py-3.5 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isUnlocking ? 'Unlocking Dossier...' : 'Unlock Full Access — $4.99 One-Time'}</span>
              </button>
              <button
                onClick={handleUnlockPaidReport}
                className="w-full py-2.5 px-4 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Instant Demo Unlock (Free Preview Pass)</span>
              </button>
            </div>

            <div className="text-[10px] text-zinc-400 font-mono text-center pt-2 border-t border-zinc-100">
              One-time purchase · No recurring charges · 30-day private archive access
            </div>
          </div>
        </div>
      )}

      {/* 4. Export PDF Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-zinc-200 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-semibold block">
                  OFFICIAL EXPORT
                </span>
                <h3 className="text-2xl font-editorial text-zinc-900 mt-1 font-semibold">
                  Export Dossier PDF
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Complete 18-section relationship autopsy formatted for multi-page A4 document.
                </p>
              </div>
              <button
                onClick={() => !isPdfExporting && setShowExportModal(false)}
                disabled={isPdfExporting}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-full cursor-pointer disabled:opacity-30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isPdfExporting ? (
              <div className="py-6 space-y-4 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-900 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-zinc-900">{pdfProgress.stage}</p>
                  <p className="text-xs font-mono text-zinc-500">{pdfProgress.percent}% completed</p>
                </div>
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 transition-all duration-300"
                    style={{ width: `${pdfProgress.percent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {pdfErrorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
                    {pdfErrorMessage}
                  </div>
                )}
                {/* Option 1: Direct File Download */}
                <button
                  onClick={handleDownloadPdf}
                  className="w-full p-4 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors flex items-center justify-between text-left cursor-pointer group shadow-sm"
                >
                  <div className="space-y-0.5">
                    <span className="text-sm font-semibold block flex items-center gap-1.5">
                      <span>Download PDF File (.pdf)</span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
                        Recommended
                      </span>
                    </span>
                    <span className="text-xs text-zinc-300 block">
                      Multi-page vector & canvas document saved directly to your device
                    </span>
                  </div>
                  <Download className="w-5 h-5 text-white/80 group-hover:scale-110 transition-transform shrink-0 ml-3" />
                </button>

                {/* Option 2: Browser Print / Save as PDF */}
                <button
                  onClick={handleNativePrint}
                  className="w-full p-4 rounded-2xl bg-[#FAF9F6] border border-zinc-200 hover:bg-zinc-100 text-zinc-900 transition-colors flex items-center justify-between text-left cursor-pointer group"
                >
                  <div className="space-y-0.5">
                    <span className="text-sm font-semibold block">Print / Save as PDF</span>
                    <span className="text-xs text-zinc-500 block">
                      Opens your system print dialogue with custom A4 margin formatting
                    </span>
                  </div>
                  <Printer className="w-5 h-5 text-zinc-600 group-hover:scale-110 transition-transform shrink-0 ml-3" />
                </button>
              </div>
            )}

            <div className="pt-3 border-t border-zinc-100 text-[11px] text-zinc-400 font-mono text-center">
              Includes all 18 chapters · Verbatim WhatsApp bubbles · Timestamp analytics
            </div>
          </div>
        </div>
      )}

      {/* 5. Interactive Hot Take Deep Dive / Conspiracy Theory Modal */}
      {selectedHotTake && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 no-print animate-in fade-in duration-200">
          <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border-2 border-orange-300 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header Stamp & Close Button */}
            <div className="flex items-start justify-between gap-4 border-b border-orange-200/80 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                  <Flame className="w-3 h-3 text-orange-600" />
                  <span>DECLASSIFIED CONSPIRACY DOSSIER 🕵️‍♂️</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-editorial text-zinc-900 font-semibold tracking-tight">
                  The Deeper Dynamic Read
                </h3>
              </div>
              <button
                onClick={() => setSelectedHotTake(null)}
                className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-full hover:bg-orange-100/60 transition-colors cursor-pointer"
                title="Close Dossier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* The Original Quoted Hot Take */}
            <div className="p-4 rounded-2xl bg-white border border-orange-200 shadow-2xs space-y-1.5">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-semibold block">
                ORIGINAL EXHIBIT TAKE
              </span>
              <p className="font-editorial text-base sm:text-lg text-zinc-900 italic font-medium leading-snug">
                “{selectedHotTake}”
              </p>
            </div>

            {/* Modal Body: Loading State or Deeper Dive */}
            {isGeneratingTheory ? (
              <div className="py-10 space-y-4 text-center">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full p-1 bg-white border-2 border-orange-300 shadow-md animate-pulse">
                    <img
                      src={indusAvatar}
                      alt="Brandon analyzing"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <Sparkles className="w-5 h-5 text-orange-500 absolute -top-1 -right-1 animate-spin" />
                </div>
                <div className="space-y-1.5 max-w-sm mx-auto">
                  <p className="text-sm font-semibold text-zinc-900">
                    Connecting psychological dots...
                  </p>
                  <p className="text-xs text-zinc-500 font-mono">
                    Brandon is analyzing unread receipts and calculating the exact ratio of plausible deniability...
                  </p>
                </div>
                <div className="w-48 mx-auto h-1.5 bg-orange-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full animate-pulse w-2/3" />
                </div>
              </div>
            ) : theoryData ? (
              <div className="space-y-5">
                {/* Conspiracy Title */}
                <div>
                  <span className="text-[10px] font-mono text-orange-700 uppercase tracking-widest font-bold">
                    THEORY CODENAME
                  </span>
                  <h4 className="text-xl sm:text-2xl font-editorial font-bold text-zinc-900 mt-0.5">
                    {theoryData.conspiracyTitle}
                  </h4>
                </div>

                {/* The Theory Exposition */}
                <div className="space-y-3 text-xs sm:text-sm text-zinc-700 leading-relaxed font-sans bg-white/80 p-4 sm:p-5 rounded-2xl border border-zinc-200/80 shadow-2xs">
                  {theoryData.theory.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>

                {/* Evidence Points */}
                {theoryData.evidencePoints && theoryData.evidencePoints.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">
                      SUPPORTING RECEIPTS & BEHAVIORAL EXHIBITS
                    </span>
                    <div className="space-y-2">
                      {theoryData.evidencePoints.map((point, ptIdx) => (
                        <div
                          key={ptIdx}
                          className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/70 text-xs text-zinc-800 flex items-start gap-2.5"
                        >
                          <span className="font-mono font-bold text-orange-600 shrink-0 text-[11px]">
                            #{ptIdx + 1}
                          </span>
                          <span className="leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* The Uncomfortable Truth Callout */}
                {theoryData.uncomfortableTruth && (
                  <div className="p-4 rounded-2xl bg-zinc-900 text-white space-y-1 shadow-md">
                    <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                      <span>🔑 THE UNCOMFORTABLE TRUTH</span>
                    </div>
                    <p className="text-xs sm:text-sm italic font-editorial leading-relaxed text-zinc-100">
                      “{theoryData.uncomfortableTruth}”
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5 border-t border-orange-200/80">
                  <button
                    onClick={() => handleAskAboutHotTake(selectedHotTake)}
                    className="flex-1 py-2.5 px-4 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask Brandon About This</span>
                  </button>

                  <button
                    onClick={handleCopyTheory}
                    className="py-2.5 px-4 rounded-full bg-white hover:bg-orange-50 border border-orange-200 text-zinc-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {theoryCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
                    <span>{theoryCopied ? 'Copied Dossier!' : 'Copy Theory'}</span>
                  </button>
                </div>
              </div>
            ) : null}

            {/* Footer Notice */}
            <div className="pt-2 text-[10px] font-mono text-zinc-400 text-center border-t border-orange-100">
              Generated by Brandon's behavioral model · Grounded in uploaded message timestamps
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
