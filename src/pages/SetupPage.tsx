import React, { useState, useRef, useEffect } from 'react';
import { Upload, Lock, ArrowRight, ArrowLeft, Check, AlertCircle, Phone, UserCheck, Sparkles, Edit3 } from 'lucide-react';
import JSZip from 'jszip';
import indusAvatar from '../assets/images/avatar_indus_friend_1791121741937.jpg';
import { RelationshipType, StoredReport } from '../types';
import { parseChatExport } from '../utils/chatParser';
import { SAMPLE_CHAT_EXPORTS } from '../data/sampleChats';

interface SetupPageProps {
  initialRelationshipType: RelationshipType;
  onReportGenerated: (report: StoredReport) => void;
}

export interface DetectedContact {
  originalName: string;
  cleanName: string;
  isPhoneNumber: boolean;
  messageCount: number;
}

const RELATIONSHIP_OPTIONS: RelationshipType[] = [
  'Situationship 🌀',
  'Ex 💔',
  'Boyfriend 💌',
  'Best friend 🤝',
  'Boys group 🐐',
  'Girls group 💅',
  'Crush 👀',
  'Talking stage 💬',
  'Husband 💍',
  'Siblings 👫',
  'Family group 🏠',
  'Uni group 🎓',
];

const LOADING_MESSAGES = [
  'Reading chat transcripts and timestamps...',
  'Finding the week it all changed...',
  'Cross-referencing your 2am texts with your 10am energy...',
  'Drafting roasts, awards, and unfiltered truths...',
  'Calculating who cared more down to three decimal places...',
  'Measuring the awkwardness of that 14-hour reply gap...',
  'Auditing your emoji usage for emotional deflection...',
  'Checking if "haha yeah totally" meant "I am devastated"...',
  'Composing the closing verdict and life advice...',
];

function extractParticipants(text: string, platform: 'whatsapp' | 'imessage'): DetectedContact[] {
  const counts: Record<string, number> = {};
  const lines = text.split(/\r?\n/);

  const waRegex1 = /^\[?\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}[,\s]+\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?\]?\s*[-–—]?\s*([^:]+?):\s*(.*)$/;
  const waRegex2 = /^\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4},\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?\s*-\s*([^:]+?):\s*(.*)$/i;
  const imRegex = /^([^:\n]{1,35}):\s+(.+)$/;

  for (const line of lines) {
    let sender: string | null = null;
    const m1 = line.match(waRegex1);
    if (m1 && m1[1]) {
      sender = m1[1].trim();
    } else {
      const m2 = line.match(waRegex2);
      if (m2 && m2[1]) {
        sender = m2[1].trim();
      } else if (platform === 'imessage') {
        const m3 = line.match(imRegex);
        if (m3 && m3[1] && !m3[1].includes('http') && !m3[1].startsWith('[')) {
          sender = m3[1].trim();
        }
      }
    }

    if (sender && !sender.toLowerCase().includes('messages and calls') && !sender.toLowerCase().includes('omitted')) {
      counts[sender] = (counts[sender] || 0) + 1;
    }
  }

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return entries.map(([name, count]) => {
    const isPhone = /^(\+|00)?[0-9\s\-()]{7,}$/.test(name) || /\+\d{1,4}\s*\d{4,}/.test(name);
    return {
      originalName: name,
      cleanName: isPhone ? name.replace(/[^\d+]/g, ' ').trim() : name,
      isPhoneNumber: isPhone,
      messageCount: count,
    };
  });
}

export const SetupPage: React.FC<SetupPageProps> = ({ initialRelationshipType, onReportGenerated }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [platform, setPlatform] = useState<'whatsapp' | 'imessage'>('whatsapp');
  const [relationshipType, setRelationshipType] = useState<RelationshipType>(initialRelationshipType);
  const [rawText, setRawText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [streamPreview, setStreamPreview] = useState<string>('');
  const [streamChars, setStreamChars] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 4: Contact Cleaner State
  const [detectedContacts, setDetectedContacts] = useState<DetectedContact[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleFileSelection = async (file: File) => {
    setErrorMsg(null);
    try {
      if (file.name.endsWith('.zip') || file.type.includes('zip')) {
        const jszip = new JSZip();
        const zip = await jszip.loadAsync(await file.arrayBuffer());
        const txtKey = Object.keys(zip.files).find(
          (k) => k.toLowerCase().endsWith('.txt') && !k.startsWith('__MACOSX') && !k.startsWith('.')
        );
        if (!txtKey) {
          setErrorMsg('No .txt chat transcript found inside the ZIP archive. Please export as text.');
          return;
        }
        const text = await zip.files[txtKey].async('text');
        setFileName(`${file.name} (${txtKey})`);
        setRawText(text);
        const contacts = extractParticipants(text, platform);
        setDetectedContacts(contacts);
        return;
      }

      if (!file.name.endsWith('.txt') && !file.type.includes('text')) {
        setErrorMsg('Please upload a .txt or .zip chat export file (or load one of the instant sample chats).');
        return;
      }
      const text = await file.text();
      setFileName(file.name);
      setRawText(text);

      const contacts = extractParticipants(text, platform);
      setDetectedContacts(contacts);
    } catch (err: any) {
      setErrorMsg('Failed to read file: ' + (err.message || 'Unknown format'));
    }
  };

  const handleLoadSample = (key: 'situationship' | 'ex' | 'groupchat') => {
    const sample = SAMPLE_CHAT_EXPORTS[key];
    setPlatform(sample.platform);
    setRelationshipType(sample.type as RelationshipType);
    setFileName(`${key}_export.txt`);
    setRawText(sample.rawText);
    setErrorMsg(null);

    const contacts = extractParticipants(sample.rawText, sample.platform);
    setDetectedContacts(contacts);
  };

  const handleGoToContactCleaner = () => {
    if (!rawText.trim()) {
      setErrorMsg('Please upload a .txt chat file or select a sample chat first.');
      return;
    }
    setErrorMsg(null);
    const contacts = extractParticipants(rawText, platform);
    setDetectedContacts(contacts);
    setStep(4);
  };

  const handleUpdateContactName = (index: number, newName: string) => {
    setDetectedContacts((prev) =>
      prev.map((c, i) => (i === index ? { ...c, cleanName: newName } : c))
    );
  };

  const handleAnalyzeChat = async () => {
    if (!rawText.trim()) {
      setErrorMsg('Please upload a .txt chat file or select one of our sample chats first.');
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);
    setStreamChars(0);
    setStreamPreview('');

    // Apply any Contact Cleaner renames to the text
    let processedText = rawText;
    detectedContacts.forEach((contact) => {
      const clean = contact.cleanName.trim();
      if (clean && clean !== contact.originalName) {
        processedText = processedText.split(contact.originalName).join(clean);
      }
    });

    try {
      const parsed = parseChatExport(processedText, platform);
      const { truncatedText, ...cleanStats } = parsed;

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: cleanStats,
          truncatedText,
          relationshipType,
          platform,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Analysis request failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const evtBlock of events) {
          const lines = evtBlock.split('\n');
          let eventType = 'message';
          let dataStr = '';
          for (const line of lines) {
            if (line.startsWith('event:')) eventType = line.slice(6).trim();
            if (line.startsWith('data:')) dataStr = line.slice(5).trim();
          }
          if (!dataStr) continue;
          try {
            const payload = JSON.parse(dataStr);
            if (eventType === 'chunk') {
              setStreamChars(payload.partialLength || 0);
              setStreamPreview(payload.preview || '');
            } else if (eventType === 'complete') {
              setRawText('');
              onReportGenerated(payload as StoredReport);
              return;
            }
          } catch {
            // continue reading stream
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Something went wrong while analyzing your chat. Please try again.');
      setIsAnalyzing(false);
    }
  };

  // STEP 5: Live Real-time Generation Screen
  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="relative inline-flex items-center justify-center mb-8">
          {/* Multi-layered pulsating ripples */}
          <div className="absolute inset-0 rounded-full bg-zinc-900/10 dark:bg-white/10 pointer-events-none animate-avatar-ripple-1" />
          <div className="absolute inset-0 rounded-full bg-zinc-900/15 dark:bg-white/15 pointer-events-none animate-avatar-ripple-2" />

          {/* Primary avatar container with custom glowing pulse */}
          <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1.5 bg-white dark:bg-zinc-800 border-2 border-zinc-900/40 dark:border-zinc-700 shadow-xl animate-avatar-pulse">
            <img
              src={indusAvatar}
              alt="Whatarewe reading your chat"
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="absolute -bottom-1 z-20 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-white dark:border-zinc-800 shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Whatarewe
          </span>
        </div>

        <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 tabular-nums uppercase tracking-wider">
          LIVE DOSSIER STREAM · {streamChars > 0 ? `${streamChars.toLocaleString()} CHARS WRITTEN` : 'PARSING TRANSCRIPT'}
        </p>

        <h1 className="mt-3 text-3xl sm:text-4xl font-editorial text-zinc-900 dark:text-zinc-100 leading-snug">
          {LOADING_MESSAGES[loadingMsgIdx]}
        </h1>

        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          Scrutinizing every message in your {relationshipType} transcript for reply gaps, emotional investment, and unspoken subtext.
        </p>

        <div className="mt-8 max-w-md mx-auto h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300 origin-left"
            style={{
              width: `${Math.min(95, Math.max(18, Math.round((streamChars / 3600) * 100)))}%`,
            }}
          />
        </div>

        {streamPreview && (
          <div className="mt-8 max-w-lg mx-auto bg-white dark:bg-[#18181b] border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-4 text-left shadow-xs">
            <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
              LIVE VERDICT PREVIEW
            </p>
            <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 truncate">{streamPreview}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Wizard Step Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-3">
          <button
            onClick={() => setStep(1)}
            className={`cursor-pointer transition-colors ${step >= 1 ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : ''}`}
          >
            01. Platform
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setStep(2)}
            className={`cursor-pointer transition-colors ${step >= 2 ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : ''}`}
          >
            02. How to Export
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setStep(3)}
            className={`cursor-pointer transition-colors ${step >= 3 ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : ''}`}
          >
            03. Upload Chat
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => {
              if (rawText) handleGoToContactCleaner();
            }}
            className={`cursor-pointer transition-colors ${step === 4 ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : ''}`}
          >
            04. Contact Cleaner
          </button>
        </div>
        <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-900 dark:bg-zinc-100 transition-transform duration-200 origin-left"
            style={{ transform: `scaleX(${step / 4})` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-7 sm:p-10 shadow-2xs">
        {/* STEP 1: Platform & Dynamic */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Step 1 of 4</p>
              <h1 className="mt-1 text-3xl font-editorial text-zinc-900 dark:text-zinc-100">
                Choose your platform & chat dynamic
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Tell Indus where the messages come from and what dynamic he’s analyzing.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                Messaging Platform
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPlatform('whatsapp')}
                  className={`p-5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    platform === 'whatsapp'
                      ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 fill-[#25D366]" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-semibold">WhatsApp</p>
                      <p className={`text-xs ${platform === 'whatsapp' ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}`}>
                        .txt export (Chat settings → Export Chat)
                      </p>
                    </div>
                  </div>
                  {platform === 'whatsapp' && <Check className="w-5 h-5 text-white dark:text-zinc-900" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPlatform('imessage')}
                  className={`p-5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    platform === 'imessage'
                      ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-[#007AFF]/20 flex items-center justify-center shrink-0">
                      <span className="text-base font-bold text-[#007AFF]">💬</span>
                    </span>
                    <div>
                      <p className="text-sm font-semibold">iMessage</p>
                      <p className={`text-xs ${platform === 'imessage' ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}`}>
                        Exported transcript or text file
                      </p>
                    </div>
                  </div>
                  {platform === 'imessage' && <Check className="w-5 h-5 text-white dark:text-zinc-900" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                Relationship Dynamic
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {RELATIONSHIP_OPTIONS.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRelationshipType(type)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                      relationshipType === type
                        ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-800 dark:text-zinc-200 bg-[#FAF9F6] dark:bg-zinc-800/60'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-white text-sm font-semibold rounded-full transition-colors cursor-pointer"
              >
                <span>Continue to Export Guide →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: How to Export Guide */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Step 2 of 4</p>
              <h1 className="mt-1 text-3xl font-editorial text-zinc-900 dark:text-zinc-100">
                How to export your chat without media
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Always select <span className="font-semibold text-zinc-900 dark:text-zinc-100">“Without Media”</span> so your export is instantaneous and contains only text timestamps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-[#FAF9F6] dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">STEP 01</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">Open Chat Info</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    Tap the contact or group name at the top of the chat in WhatsApp.
                  </p>
                </div>
                <div className="mt-5 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 space-y-1 text-center shadow-2xs">
                  <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 mx-auto" />
                  <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Chat Info</p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#FAF9F6] dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">STEP 02</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">Tap “Export Chat”</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    Scroll to the bottom of the contact page and select Export Chat.
                  </p>
                </div>
                <div className="mt-5 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 space-y-1 text-center shadow-2xs">
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Export Chat ↗</p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#FAF9F6] dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">STEP 03</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">Choose “Without Media”</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    Save the `.txt` export to your Files or send it directly to your laptop.
                  </p>
                </div>
                <div className="mt-5 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 space-y-1.5 text-center shadow-2xs">
                  <div className="py-1 text-[10px] text-zinc-400 border border-zinc-100 dark:border-zinc-700 rounded">Attach Media</div>
                  <div className="py-1.5 text-[11px] font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded">Without Media ✓</div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-white text-sm font-semibold rounded-full transition-colors cursor-pointer"
              >
                <span>Upload Chat File →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Upload Chat File / Sample Chats */}
        {step === 3 && (
          <div className="space-y-7">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Step 3 of 4 · {relationshipType}</p>
              <h1 className="mt-1 text-3xl font-editorial text-zinc-900 dark:text-zinc-100">
                Upload your chat export
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Drag and drop your `.txt` export file, or load one of our realistic sample chats immediately.
              </p>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const droppedFile = e.dataTransfer.files?.[0];
                if (droppedFile) handleFileSelection(droppedFile);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
                isDragging
                  ? 'border-zinc-900 bg-zinc-900/5 dark:border-zinc-100 dark:bg-zinc-100/5'
                  : fileName
                  ? 'border-emerald-600/50 bg-emerald-50/30 dark:border-emerald-500/40 dark:bg-emerald-950/20'
                  : 'border-zinc-300 hover:border-zinc-400 bg-[#FAF9F6] dark:border-zinc-700 dark:hover:border-zinc-600 dark:bg-zinc-900/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.zip,text/plain,application/zip,application/x-zip-compressed"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelection(f);
                }}
              />
              <div className="w-11 h-11 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 mx-auto flex items-center justify-center mb-3">
                <Upload className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
              </div>
              {fileName ? (
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{fileName} loaded</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono tabular-nums">
                    {rawText.split(/\r?\n/).filter(Boolean).length} lines detected · Click to replace
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Click to upload or drag & drop your `.txt` or `.zip` file
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Supports WhatsApp `.txt` or `.zip` (with `_chat.txt`) and iMessage exports up to 15MB
                  </p>
                </div>
              )}
            </div>

            <div className="bg-[#FAF9F6] dark:bg-zinc-900/60 rounded-xl p-4 border border-zinc-200/80 dark:border-zinc-800">
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2.5">
                Don’t have a chat export handy right now? Load a realistic transcript to test Indus immediately:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadSample('situationship')}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors cursor-pointer"
                >
                  Load Situationship 🌀 (Maya & Julian)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('ex')}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors cursor-pointer"
                >
                  Load Ex 💔 (Chloe & Liam)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('groupchat')}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors cursor-pointer"
                >
                  Load Boys Group 🐐 (Lisbon Trip)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
                Or inspect / paste raw transcript text directly:
              </label>
              <textarea
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  if (!fileName) setFileName('pasted_chat.txt');
                  const contacts = extractParticipants(e.target.value, platform);
                  setDetectedContacts(contacts);
                }}
                rows={3}
                placeholder="[03/09/26, 12:01:15 AM] Maya: Julian I feel like we only ever hang out after 11pm lately..."
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-[#FAF9F6] dark:bg-zinc-900 p-3 text-xs font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100"
              />
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleGoToContactCleaner}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-white text-sm font-semibold rounded-full transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              >
                <span>Continue to Contact Cleaner →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Contact & Phone Cleaner */}
        {step === 4 && (
          <div className="space-y-7">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Step 4 of 4 · Contact Cleaner</p>
              <h1 className="mt-1 text-3xl font-editorial text-zinc-900 dark:text-zinc-100">
                Confirm & clean participant names
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Indus writes much sharper commentary when he knows real names or nicknames instead of raw phone numbers (e.g. <span className="font-mono text-xs text-zinc-800 dark:text-zinc-200">+91 75310 01050</span>).
              </p>
            </div>

            {detectedContacts.length > 0 ? (
              <div className="space-y-4">
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono">
                  Detected Chat Participants ({detectedContacts.length})
                </p>

                <div className="space-y-3">
                  {detectedContacts.map((contact, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAF9F6] dark:bg-zinc-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                            {contact.originalName}
                          </span>
                          {contact.isPhoneNumber ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-[10px] font-mono font-bold">
                              <Phone className="w-2.5 h-2.5" />
                              <span>Phone Number Detected</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 text-[10px] font-mono font-medium">
                              <UserCheck className="w-2.5 h-2.5" />
                              <span>Identified</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                          {contact.messageCount.toLocaleString()} messages in export
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0 font-medium">
                          Use name:
                        </label>
                        <input
                          type="text"
                          value={contact.cleanName}
                          onChange={(e) => handleUpdateContactName(idx, e.target.value)}
                          placeholder="e.g. Maya or Julian"
                          className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 w-44 shadow-2xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Participants will be parsed directly from the transcript.
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Ready to proceed with live AI analysis.
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleAnalyzeChat}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-white text-sm font-semibold rounded-full transition-colors cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400 dark:text-amber-500" />
                <span>Start Whatarewe’s Autopsy →</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Guarantee Box */}
      <div className="mt-8 bg-white dark:bg-[#18181b] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6">
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
              What happens to my data? (Zero raw transcripts stored)
            </h2>
            <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Your `.txt` export is parsed in memory on your browser, and only the summarized stats and conversational sample are transmitted over encrypted HTTPS to generate Whatarewe’s autopsy. The moment the report is created, all raw chat transcripts are discarded. Only the generated analytical report is preserved under your private link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
