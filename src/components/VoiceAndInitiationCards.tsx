import React, { useMemo } from 'react';
import { SenderStats } from '../types';
import { PARTICIPANT_COLORS, calculateNormalizedPercentages } from '../utils/chartHelpers';

interface VoiceAndInitiationCardsProps {
  participants?: SenderStats[];
  totalMessages?: number;
  isPhoneFrame?: boolean;
}

interface CountUpSpanProps {
  value: number;
  suffix?: string;
  durationMs?: number;
  className?: string;
  style?: React.CSSProperties;
  delayMs?: number;
}

export const CountUpSpan: React.FC<CountUpSpanProps> = ({
  value,
  suffix = '%',
  durationMs = 950,
  className = '',
  style = {},
  delayMs = 0,
}) => {
  const [currentValue, setCurrentValue] = React.useState<number>(0);
  const [hasStarted, setHasStarted] = React.useState<boolean>(false);
  const spanRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setHasStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(el);

      const fallbackTimer = setTimeout(() => {
        setHasStarted(true);
      }, 150 + delayMs);

      return () => {
        observer.disconnect();
        clearTimeout(fallbackTimer);
      };
    } else {
      setHasStarted(true);
    }
  }, [delayMs]);

  React.useEffect(() => {
    if (!hasStarted) return;

    let rafId: number;
    let startTimestamp: number | null = null;
    const startVal = 0;
    const targetVal = Number(value) || 0;

    const step = (now: number) => {
      if (startTimestamp === null) startTimestamp = now;
      const elapsed = now - startTimestamp;
      const progress = Math.min(elapsed / durationMs, 1);
      // Smooth easeOutCubic curve
      const ease = 1 - Math.pow(1 - progress, 3);
      const nextVal = Math.round(startVal + (targetVal - startVal) * ease);
      setCurrentValue(nextVal);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    const delayTimer = setTimeout(() => {
      rafId = requestAnimationFrame(step);
    }, delayMs);

    return () => {
      clearTimeout(delayTimer);
      cancelAnimationFrame(rafId);
    };
  }, [hasStarted, value, durationMs, delayMs]);

  return (
    <span
      ref={spanRef}
      className={`inline-block ${className} ${hasStarted ? 'animate-drop-from-top' : 'opacity-0 -translate-y-4'}`}
      style={{
        ...style,
        animationDelay: `${delayMs}ms`,
      }}
    >
      {currentValue}
      {suffix}
    </span>
  );
};

export const VoiceAndInitiationCards: React.FC<VoiceAndInitiationCardsProps> = ({
  participants,
  totalMessages,
  isPhoneFrame = false,
}) => {
  // Ensure every participant is present, with safe fallbacks for empty states
  const validParticipants = useMemo(() => {
    if (participants && participants.length > 0) {
      return participants;
    }
    return [
      {
        name: 'Person A',
        messageCount: 100,
        wordCount: 600,
        avgLengthWords: 6,
        initiationCount: 65,
        initiationPercent: 65,
        avgReplyMinutes: 6,
        doubleTextCount: 2,
        topEmojis: [],
        questionCount: 3,
      },
      {
        name: 'Person B',
        messageCount: 50,
        wordCount: 300,
        avgLengthWords: 6,
        initiationCount: 35,
        initiationPercent: 35,
        avgReplyMinutes: 60,
        doubleTextCount: 0,
        topEmojis: [],
        questionCount: 1,
      },
    ];
  }, [participants]);

  // ==========================================
  // CARD 1: Share of Voice (Message Distribution)
  // ==========================================
  // 1. Strictly sort by messageCount descending so the person with the most messages is #1
  const messageDistributionData = useMemo(() => {
    const sorted = [...validParticipants].sort((a, b) => b.messageCount - a.messageCount);
    // 2. Strict Largest-Remainder normalization: Σ(Percentages) == 100% and strictly monotonic
    const normalizedPcts = calculateNormalizedPercentages(
      sorted.map((p) => ({ count: p.messageCount }))
    );

    return sorted.map((p, idx) => ({
      ...p,
      rank: idx + 1,
      color: PARTICIPANT_COLORS[idx % PARTICIPANT_COLORS.length],
      percentage: normalizedPcts[idx],
    }));
  }, [validParticipants]);

  // Color lookup map based on participant name so colors remain 100% consistent across cards
  const participantColorMap = useMemo(() => {
    const map = new Map<string, string>();
    messageDistributionData.forEach((p) => {
      map.set(p.name, p.color);
    });
    return map;
  }, [messageDistributionData]);

  const messageLeader = messageDistributionData[0] || {
    name: 'Leader',
    percentage: 100,
    messageCount: 0,
    color: PARTICIPANT_COLORS[0],
    rank: 1,
  };

  // SVG Donut geometry
  const donutRadius = 38;
  const circumference = 2 * Math.PI * donutRadius; // ~238.761

  // ==========================================
  // CARD 2: Who Starts the Conversation (Conversation Starters)
  // ==========================================
  // Render every participant in the group, sorted by initiationCount descending
  const conversationStartersData = useMemo(() => {
    const sorted = [...validParticipants].sort(
      (a, b) => (b.initiationCount ?? 0) - (a.initiationCount ?? 0)
    );
    const normalizedInitPcts = calculateNormalizedPercentages(
      sorted.map((p) => ({ count: Math.max(0, p.initiationCount ?? 0) }))
    );

    return sorted.map((p, idx) => ({
      ...p,
      rank: idx + 1,
      color: participantColorMap.get(p.name) || PARTICIPANT_COLORS[idx % PARTICIPANT_COLORS.length],
      initiationCount: Math.max(0, p.initiationCount ?? 0),
      initiationPercent: normalizedInitPcts[idx],
    }));
  }, [validParticipants, participantColorMap]);

  const topInitiator = conversationStartersData[0] || {
    name: 'Initiator',
    initiationPercent: 100,
    initiationCount: 0,
    color: PARTICIPANT_COLORS[0],
  };

  // Keep track of accumulated stroke offset for multi-segment SVG donut
  let donutAccumulatedOffset = 0;

  return (
    <div className={`grid grid-cols-1 ${isPhoneFrame ? '' : 'md:grid-cols-2'} gap-6 avoid-break w-full`}>
      {/* ======================================================== */}
      {/* CARD 1 — "Share of voice" (Message Distribution)        */}
      {/* ======================================================== */}
      <div className="bg-[#EAE6F8] dark:bg-[#1a1429] rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-[#d8b4fe] dark:border-purple-900/60 shadow-xs">
        <div>
          <span className="text-xs font-mono text-purple-800 dark:text-purple-300 uppercase tracking-wider font-semibold">
            Message Distribution
          </span>
          <h2 className="text-2xl font-editorial text-zinc-900 dark:text-zinc-100 mt-1">
            Share of voice
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
            Who fills the screen · Total messages and overall conversation share
          </p>
        </div>

        {/* Stacked layout: Top = Centered Donut Chart, Bottom = Full-width ranked legend rows */}
        <div className="my-6 flex flex-col items-center justify-center gap-6 w-full">
          {/* Top/Center: Custom SVG Donut Chart with EVERY participant */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Subtle background track */}
              <circle
                cx="50"
                cy="50"
                r={donutRadius}
                stroke="#D8B4FE"
                strokeWidth="14"
                fill="none"
                opacity="0.35"
              />

              {/* Slices for EVERY participant in the chat */}
              {messageDistributionData.map((segment) => {
                if (segment.percentage <= 0) return null;
                const strokeLength = (segment.percentage / 100) * circumference;
                const currentOffset = donutAccumulatedOffset;
                donutAccumulatedOffset += strokeLength;

                return (
                  <circle
                    key={segment.name}
                    cx="50"
                    cy="50"
                    r={donutRadius}
                    stroke={segment.color}
                    strokeWidth="14"
                    fill="none"
                    strokeDasharray={`${strokeLength} ${circumference}`}
                    strokeDashoffset={-currentOffset}
                    strokeLinecap="butt"
                    className="transition-all duration-700 ease-out"
                  />
                );
              })}
            </svg>

            {/* Center of Donut: Displays the leader's name and their exact message percentage */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none select-none">
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-semibold">
                Leader
              </span>
              <span
                className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100 truncate max-w-[85px] px-1"
                title={messageLeader.name}
              >
                {messageLeader.name}
              </span>
              <CountUpSpan
                value={messageLeader.percentage}
                suffix="%"
                delayMs={120}
                className="text-xs sm:text-sm font-mono font-bold"
                style={{ color: messageLeader.color }}
              />
            </div>
          </div>

          {/* Bottom: Ranked legend list with color dot for ALL participants */}
          <div className="w-full flex flex-col gap-2.5">
            {messageDistributionData.map((p) => (
              <div
                key={p.name}
                className="w-full flex items-center justify-between gap-3 text-xs font-mono tabular-nums px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-800/90 border border-[#e9d5ff] dark:border-purple-900/40 shadow-2xs transition-colors box-border"
                style={{ minHeight: '44px' }}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: p.color }}
                    aria-hidden="true"
                  />
                  <span className="text-zinc-500 dark:text-zinc-400 font-normal shrink-0">#{p.rank}</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate min-w-0" title={p.name}>
                    {p.name}
                  </span>
                </div>
                <div className="shrink-0 text-right whitespace-nowrap pl-2 flex items-baseline justify-end gap-1.5 font-mono">
                  <CountUpSpan
                    value={p.percentage}
                    suffix="%"
                    delayMs={p.rank * 80}
                    className="font-bold text-zinc-900 dark:text-zinc-100"
                  />
                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                    ({p.messageCount.toLocaleString()} msgs)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistical Integrity Stamp */}
        <div className="pt-3 border-t border-[#d8b4fe] dark:border-purple-900/60 flex items-center justify-between text-[11px] font-mono text-purple-900/80 dark:text-purple-300">
          <span>Σ Share of Voice = 100%</span>
          <span>
            {messageDistributionData.length} participant
            {messageDistributionData.length !== 1 ? 's' : ''} tracked
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CARD 2 — "Who starts the conversation" (Conversation Starters) */}
      {/* ======================================================== */}
      <div className="bg-[#E6F4EA] dark:bg-[#11241a] rounded-3xl p-7 flex flex-col justify-between border border-[#a7f3d0] dark:border-emerald-900/60 shadow-xs">
        <div>
          <span className="text-xs font-mono text-emerald-800 dark:text-emerald-300 uppercase tracking-wider font-semibold">
            Conversation Starters
          </span>
          <h2 className="text-2xl font-editorial text-zinc-900 dark:text-zinc-100 mt-1">
            Who starts the conversation
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
            Who breaks the silence · New threads started after 6+ hours of radio silence
          </p>
        </div>

        {/* Render a row for EVERY participant in the group */}
        <div className="my-6 space-y-4">
          {conversationStartersData.map((p) => (
            <div key={p.name} className="flex items-center gap-3">
              {/* Name on left with color dot */}
              <div
                className="w-24 sm:w-28 shrink-0 flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate"
                title={p.name}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: p.color }}
                  aria-hidden="true"
                />
                <span className="truncate">{p.name}</span>
              </div>

              {/* Horizontal pill progress bar with their unique color */}
              <div className="flex-1 h-3.5 bg-[#a7f3d0] dark:bg-emerald-950/80 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(p.initiationCount > 0 ? 4 : 0, p.initiationPercent)}%`,
                    backgroundColor: p.color,
                  }}
                />
              </div>

              {/* "XX% (YY starts)" on right */}
              <div className="shrink-0 font-mono text-xs tabular-nums text-right text-zinc-800 dark:text-zinc-200 min-w-[95px] whitespace-nowrap">
                <CountUpSpan
                  value={p.initiationPercent}
                  suffix="%"
                  delayMs={p.rank * 80}
                  className="font-bold"
                  style={{ color: p.color }}
                />{' '}
                <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                  ({p.initiationCount} starts)
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Callout: Indus's note highlighting who initiates the most conversations */}
        <div className="p-3.5 bg-white dark:bg-zinc-800/90 rounded-xl border border-[#a7f3d0] dark:border-emerald-900/40 text-xs text-zinc-700 dark:text-zinc-300">
          <span className="font-semibold text-emerald-950 dark:text-emerald-300">Indus Note:</span>{' '}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{topInitiator.name}</span> initiates{' '}
          <CountUpSpan
            value={topInitiator.initiationPercent}
            suffix="%"
            delayMs={200}
            className="font-semibold font-mono"
            style={{ color: topInitiator.color }}
          />{' '}
          of conversations ({topInitiator.initiationCount} starts), breaking the silence most
          frequently.
        </div>
      </div>
    </div>
  );
};
