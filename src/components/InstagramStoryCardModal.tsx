import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  Flame,
  Clock,
  MessageCircle,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import indusAvatar from '../assets/images/avatar_indus_friend_1791121741937.jpg';
import { StoredReport } from '../types';

interface InstagramStoryCardModalProps {
  reportData: StoredReport;
  isOpen: boolean;
  onClose: () => void;
}

type CardTheme = 'midnight' | 'editorial' | 'lavender' | 'mint';

interface ThemeConfig {
  id: CardTheme;
  name: string;
  bg: string;
  text: string;
  cardBg: string;
  cardBorder: string;
  accent: string;
  subtext: string;
  badgeBg: string;
  badgeText: string;
}

const THEMES: Record<CardTheme, ThemeConfig> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Navy',
    bg: '#0C1222',
    text: '#FFFFFF',
    cardBg: '#131D38',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    accent: '#F59E0B',
    subtext: '#94A3B8',
    badgeBg: 'rgba(245, 158, 11, 0.18)',
    badgeText: '#FCD34D',
  },
  editorial: {
    id: 'editorial',
    name: 'Warm Editorial',
    bg: '#FAF8F5',
    text: '#18181B',
    cardBg: '#FFFFFF',
    cardBorder: 'rgba(24, 24, 27, 0.12)',
    accent: '#09090B',
    subtext: '#71717A',
    badgeBg: '#F4F4F5',
    badgeText: '#18181B',
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender Dream',
    bg: '#EAE6F8',
    text: '#1E1B4B',
    cardBg: '#FFFFFF',
    cardBorder: 'rgba(124, 58, 237, 0.18)',
    accent: '#7C3AED',
    subtext: '#6B7280',
    badgeBg: '#DDD6FE',
    badgeText: '#5B21B6',
  },
  mint: {
    id: 'mint',
    name: 'Toxic Mint',
    bg: '#D1FAE5',
    text: '#064E3B',
    cardBg: '#FFFFFF',
    cardBorder: 'rgba(5, 150, 105, 0.2)',
    accent: '#059669',
    subtext: '#047857',
    badgeBg: '#A7F3D0',
    badgeText: '#065F46',
  },
};

export const InstagramStoryCardModal: React.FC<InstagramStoryCardModalProps> = ({
  reportData,
  isOpen,
  onClose,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('midnight');
  const [isCapturing, setIsCapturing] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const { stats, report, relationshipType } = reportData;
  const p1 = stats.participants[0] || { name: 'Person A', messageCount: 100, initiationPercent: 65, avgReplyMinutes: 5 };
  const p2 = stats.participants[1] || { name: 'Person B', messageCount: 50, initiationPercent: 35, avgReplyMinutes: 35 };

  const theme = THEMES[selectedTheme];

  const captureCardToBlob = async (): Promise<Blob> => {
    if (!cardRef.current) throw new Error('Story card element not found');

    const originalGetComputedStyle = window.getComputedStyle;
    const patchedGetComputedStyle = function (
      elt: Element,
      pseudoElt?: string | null
    ): CSSStyleDeclaration {
      const orig = originalGetComputedStyle.call(window, elt, pseudoElt);
      return new Proxy(orig, {
        get(target, prop, receiver) {
          if (prop === 'getPropertyValue') {
            return (propertyName: string) => {
              const val = target.getPropertyValue(propertyName);
              if (typeof val === 'string' && (val.includes('oklch') || val.includes('lab('))) {
                return '#27272a';
              }
              return val;
            };
          }
          const val = Reflect.get(target, prop, receiver);
          if (typeof val === 'string' && (val.includes('oklch') || val.includes('lab('))) {
            return '#27272a';
          }
          return typeof val === 'function' ? val.bind(target) : val;
        },
      });
    };

    try {
      window.getComputedStyle = patchedGetComputedStyle as any;

      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // 3x scale produces 1080px wide story quality
        useCORS: true,
        logging: false,
        backgroundColor: theme.bg,
        onclone: (clonedDoc) => {
          // Neutralize oklch in cloned styles
          clonedDoc.querySelectorAll('style').forEach((tag) => {
            if (tag.textContent && (tag.textContent.includes('oklch') || tag.textContent.includes('lab('))) {
              tag.textContent = tag.textContent
                .replace(/oklch\([^)]+\)/gi, '#27272a')
                .replace(/lab\([^)]+\)/gi, '#27272a');
            }
          });
          if (clonedDoc.defaultView) {
            clonedDoc.defaultView.getComputedStyle = patchedGetComputedStyle as any;
          }
        },
      });

      return await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas export failed to produce image blob'));
        }, 'image/png');
      });
    } finally {
      window.getComputedStyle = originalGetComputedStyle;
    }
  };

  const handleDownloadImage = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setErrorMessage(null);

    try {
      const blob = await captureCardToBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `whatarewe-story-${p1.name.toLowerCase()}-${p2.name.toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (err: any) {
      console.error('Failed to capture story card:', err);
      setErrorMessage(err?.message || 'Could not export image directly.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCopyImage = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setErrorMessage(null);

    try {
      const blob = await captureCardToBlob();
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
      } else {
        // Fallback: Copy share link
        const shareUrl = `${window.location.origin}/?report=${reportData.id}`;
        await navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      const shareUrl = `${window.location.origin}/?report=${reportData.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleNativeShare = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setErrorMessage(null);

    try {
      const blob = await captureCardToBlob();
      const file = new File([blob], `whatarewe-story.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Whatarewe · ${relationshipType}`,
          text: `Whatarewe just ran an autopsy on our chat: "${report.headline}"`,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `Whatarewe · ${relationshipType}`,
          text: `Whatarewe just ran an autopsy on our chat: "${report.headline}"`,
          url: `${window.location.origin}/?report=${reportData.id}`,
        });
      } else {
        await handleDownloadImage();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        await handleDownloadImage();
      }
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print animate-in fade-in duration-200">
      <div className="bg-[#FAF9F6] dark:bg-[#18181b] rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-mono text-[10px] font-semibold tracking-wider uppercase mb-1">
              <Sparkles className="w-3 h-3 text-amber-400 dark:text-amber-500" />
              <span>9:16 Instagram Story Card</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-editorial font-bold text-zinc-900 dark:text-zinc-100">
              Share Your Chat Autopsy
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              High-contrast vertical graphic formatted for Instagram Stories, WhatsApp Status, and DMs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Picker */}
        <div className="py-3 flex items-center justify-between gap-2 overflow-x-auto">
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider shrink-0">Theme:</span>
          <div className="flex items-center gap-2">
            {(Object.keys(THEMES) as CardTheme[]).map((tKey) => {
              const th = THEMES[tKey];
              const isSelected = selectedTheme === tKey;
              return (
                <button
                  key={tKey}
                  type="button"
                  onClick={() => setSelectedTheme(tKey)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                      : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: th.bg }}
                  />
                  <span>{th.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Story Card Preview Wrapper */}
        <div className="flex items-center justify-center py-2">
          {/* THE 9:16 CAPTURE TARGET */}
          <div
            ref={cardRef}
            id="instagram-story-capture-card"
            style={{
              backgroundColor: theme.bg,
              color: theme.text,
              width: '360px',
              minHeight: '640px',
              boxSizing: 'border-box',
            }}
            className="rounded-[32px] p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden select-none border border-black/10"
          >
            {/* Background subtle noise/glow */}
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30"
              style={{ backgroundColor: theme.accent }}
            />

            {/* Top Brand Stamp */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full p-0.5 bg-white/20 border border-white/30 overflow-hidden shadow-xs">
                    <img
                      src={indusAvatar}
                      alt="Indus"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-editorial text-sm font-bold tracking-tight block leading-tight">
                      WHATAREWE
                    </span>
                    <span className="text-[10px] font-mono opacity-70 block">
                      Chat Autopsy · Dossier #{reportData.id.slice(0, 6)}
                    </span>
                  </div>
                </div>

                <span
                  style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold"
                >
                  {relationshipType}
                </span>
              </div>

              {/* Headline Roast */}
              <div className="mt-3">
                <p className="text-[10px] font-mono uppercase tracking-widest opacity-60 mb-1">
                  OFFICIAL VERDICT
                </p>
                <h2 className="text-2xl font-editorial font-bold leading-tight tracking-tight">
                  “{report.headline}”
                </h2>
                <p className="text-xs font-editorial italic mt-2 opacity-85 leading-relaxed line-clamp-3">
                  {report.overview}
                </p>
              </div>
            </div>

            {/* Middle Stats Grid */}
            <div className="relative z-10 my-4 space-y-2.5">
              {/* Talk Split Bar */}
              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                  color: theme.text === '#FFFFFF' ? '#FFFFFF' : '#18181B',
                }}
                className="p-3.5 rounded-2xl border shadow-xs"
              >
                <div className="flex items-center justify-between text-[11px] font-mono font-semibold mb-1.5">
                  <span className="truncate max-w-[130px]">{p1.name}</span>
                  <span className="opacity-60 text-[10px]">INITIATION SPLIT</span>
                  <span className="truncate max-w-[130px]">{p2.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
                  <span style={{ color: theme.accent }}>{p1.initiationPercent}%</span>
                  <span className="opacity-80">{p2.initiationPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-black/10 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${p1.initiationPercent}%`, backgroundColor: theme.accent }}
                    className="h-full rounded-l-full"
                  />
                  <div
                    style={{ width: `${p2.initiationPercent}%` }}
                    className="h-full bg-zinc-400 rounded-r-full"
                  />
                </div>
              </div>

              {/* Two mini bento cards */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor: theme.cardBorder,
                    color: theme.text === '#FFFFFF' ? '#FFFFFF' : '#18181B',
                  }}
                  className="p-3 rounded-2xl border shadow-xs"
                >
                  <span className="text-[10px] font-mono opacity-60 block">REPLY GAP</span>
                  <span className="text-base font-mono font-bold block mt-0.5">
                    {p1.avgReplyMinutes}m vs {p2.avgReplyMinutes}m
                  </span>
                  <span className="text-[10px] opacity-75">
                    {p2.name} takes {Math.round(p2.avgReplyMinutes / Math.max(1, p1.avgReplyMinutes))}x longer
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor: theme.cardBorder,
                    color: theme.text === '#FFFFFF' ? '#FFFFFF' : '#18181B',
                  }}
                  className="p-3 rounded-2xl border shadow-xs"
                >
                  <span className="text-[10px] font-mono opacity-60 block">AFTER 11 PM</span>
                  <span
                    style={{ color: theme.accent }}
                    className="text-base font-mono font-bold block mt-0.5"
                  >
                    {stats.lateNightPercent}%
                  </span>
                  <span className="text-[10px] opacity-75">Late-night texting</span>
                </div>
              </div>

              {/* Who Cares More Meter */}
              {report.whoCaresMore && (
                <div
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor: theme.cardBorder,
                    color: theme.text === '#FFFFFF' ? '#FFFFFF' : '#18181B',
                  }}
                  className="p-3 rounded-2xl border shadow-xs text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono opacity-60 mb-1">
                    <span>INVESTMENT METER</span>
                    <span>RECEIPT CHECK</span>
                  </div>
                  <p className="font-editorial text-xs italic font-medium leading-snug">
                    “{report.whoCaresMore.verdict}”
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Watermark & Verification Stamp */}
            <div className="relative z-10 pt-3 border-t border-black/10 flex items-center justify-between text-[10px] font-mono opacity-80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified by Indus</span>
              </div>
              <span className="tracking-wider uppercase font-semibold">whatarewe.app</span>
            </div>
          </div>
        </div>

        {/* Error message callout */}
        {errorMessage && (
          <div className="my-2 p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {errorMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isCapturing}
            className="flex-1 py-3 px-5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
          >
            {isCapturing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Download Story Card (.png)</span>
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            disabled={isCapturing}
            className="py-3 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" />
            <span>Share to Story / DM</span>
          </button>

          <button
            type="button"
            onClick={handleCopyImage}
            disabled={isCapturing}
            className="py-3 px-4 rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            {copiedImage || copiedLink ? (
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            )}
            <span>{copiedImage ? 'Image Copied!' : copiedLink ? 'Link Copied!' : 'Copy'}</span>
          </button>
        </div>

        <div className="mt-3 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 text-center">
          Rendered directly in your browser with high-DPI canvas capture · Ready for 1080×1920 stories
        </div>
      </div>
    </div>
  );
};
