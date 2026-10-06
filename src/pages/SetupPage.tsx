import React, { useState, useRef, useEffect } from 'react';
import { Upload, Lock, ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import indusAvatar from '../assets/images/avatar_indus_friend_1791121741937.jpg';
import { RelationshipType, StoredReport } from '../types';
import { parseChatExport } from '../utils/chatParser';
import { SAMPLE_CHAT_EXPORTS } from '../data/sampleChats';

interface SetupPageProps {
  initialRelationshipType: RelationshipType;
  onReportGenerated: (report: StoredReport) => void;
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
  'Cross-referencing your 2am texts with your 10am energy.',
  'Calculating who cared more down to three decimal places.',
  'Measuring the awkwardness of that 14-hour reply gap.',
  'Auditing your emoji usage for emotional deflection...',
  'Flagging all messages sent from an Uber after midnight.',
  'Checking if "haha yeah totally" meant "I am devastated".',
  'Drafting unvarnished character assessments for the personnel file...',
  'Composing the closing verdict and life advice...',
];

export const SetupPage: React.FC<SetupPageProps> = ({ initialRelationshipType, onReportGenerated }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleFileSelection = async (file: File) => {
    setErrorMsg(null);
    if (!file.name.endsWith('.txt') && !file.type.includes('text')) {
      setErrorMsg('Please upload a .txt chat export file (or load one of the instant sample exports below).');
      return;
    }
    const text = await file.text();
    setFileName(file.name);
    setRawText(text);
  };

  const handleLoadSample = (key: 'situationship' | 'ex' | 'groupchat') => {
    const sample = SAMPLE_CHAT_EXPORTS[key];
    setPlatform(sample.platform);
    setRelationshipType(sample.type as RelationshipType);
    setFileName(`${key}_export.txt`);
    setRawText(sample.rawText);
    setErrorMsg(null);
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

    try {
      const parsed = parseChatExport(rawText, platform);
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

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="w-24 h-24 rounded-full p-1 bg-white border border-zinc-200 shadow-sm animate-pulse">
            <img
              src={indusAvatar}
              alt="Indus reading your chat"
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        <p className="text-xs font-mono text-zinc-500 tabular-nums">
          STREAMING LIVE REPORT · {streamChars > 0 ? `${streamChars} CHARS DRAFTED` : 'PARSING TIMESTAMPS'}
        </p>

        <h1 className="mt-3 text-3xl sm:text-4xl font-editorial text-zinc-900">
          {LOADING_MESSAGES[loadingMsgIdx]}
        </h1>

        <p className="mt-3 text-sm text-zinc-500 max-w-md mx-auto">
          Reading your {relationshipType} export and scoring emotional availability, reply gaps, and unspoken subtext.
        </p>

        <div className="mt-8 max-w-md mx-auto h-1.5 bg-zinc-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-900 transition-transform duration-200 origin-left"
            style={{
              transform: `scaleX(${Math.min(0.95, Math.max(0.15, streamChars / 3200))})`,
            }}
          />
        </div>

        {streamPreview && (
          <div className="mt-8 max-w-lg mx-auto bg-white border border-zinc-200/80 rounded-xl p-4 text-left">
            <p className="text-[11px] font-mono text-zinc-400 mb-1">LIVE DRAFT STREAM</p>
            <p className="text-xs font-mono text-zinc-600 truncate">{streamPreview}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-500 mb-3">
          <button
            onClick={() => setStep(1)}
            className={`cursor-pointer transition-colors ${step >= 1 ? 'text-zinc-900 font-semibold' : ''}`}
          >
            01. Platform & Vibe
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setStep(2)}
            className={`cursor-pointer transition-colors ${step >= 2 ? 'text-zinc-900 font-semibold' : ''}`}
          >
            02. How to Export
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setStep(3)}
            className={`cursor-pointer transition-colors ${step === 3 ? 'text-zinc-900 font-semibold' : ''}`}
          >
            03. Upload & Analyze
          </button>
        </div>
        <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-900 transition-transform duration-200 origin-left"
            style={{ transform: `scaleX(${step / 3})` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/90 p-7 sm:p-10 shadow-2xs">
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-medium text-zinc-500">Step 1 of 3</p>
              <h1 className="mt-1 text-3xl font-editorial text-zinc-900">
                Choose your platform & chat dynamic
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                Tell Indus where the messages come from and what kind of dynamic he’s walking into.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-3">
                Messaging Platform
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPlatform('whatsapp')}
                  className={`p-5 rounded-xl border text-left transition-colors cursor-pointer flex items-start justify-between ${
                    platform === 'whatsapp'
                      ? 'border-zinc-900 bg-zinc-900/3'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <p className="text-base font-semibold text-zinc-900">WhatsApp</p>
                    <p className="text-xs text-zinc-500 mt-1">Standard .txt export (Mobile or Desktop)</p>
                  </div>
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      platform === 'whatsapp' ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-300'
                    }`}
                  >
                    {platform === 'whatsapp' && <Check className="w-3 h-3" />}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlatform('imessage')}
                  className={`p-5 rounded-xl border text-left transition-colors cursor-pointer flex items-start justify-between ${
                    platform === 'imessage'
                      ? 'border-zinc-900 bg-zinc-900/3'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <p className="text-base font-semibold text-zinc-900">iMessage</p>
                    <p className="text-xs text-zinc-500 mt-1">Mac/iOS conversation export (.txt)</p>
                  </div>
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      platform === 'imessage' ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-300'
                    }`}
                  >
                    {platform === 'imessage' && <Check className="w-3 h-3" />}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-3">
                What is this chat?
              </label>
              <div className="flex flex-wrap gap-2">
                {RELATIONSHIP_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setRelationshipType(opt)}
                    className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                      relationshipType === opt
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <span>Next: Export Guide</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-medium text-zinc-500">Step 2 of 3</p>
              <h1 className="mt-1 text-3xl font-editorial text-zinc-900">
                How to export your {platform === 'whatsapp' ? 'WhatsApp' : 'iMessage'} chat in 20 seconds
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                Follow these 3 visual steps on your phone or laptop—always choose “Without Media” so the export is instant.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-[#FAF9F6] border border-zinc-200/80 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-mono text-zinc-500">STEP 01</p>
                  <p className="text-sm font-semibold text-zinc-900 mt-1">
                    {platform === 'whatsapp' ? 'Tap Contact or Group Name' : 'Open Messages on Mac or iOS'}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    {platform === 'whatsapp'
                      ? 'Open the WhatsApp thread and tap the person or group header at the very top of your screen.'
                      : 'Open the iMessage thread you want Indus to analyze and scroll up so recent months load.'}
                  </p>
                </div>
                <div className="mt-5 bg-white rounded-lg border border-zinc-200 p-3 shadow-2xs">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-100">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                      J
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] font-semibold text-zinc-900">Julian 🌀</p>
                      <p className="text-[9px] text-emerald-600">Tap header for Info →</p>
                    </div>
                  </div>
                  <div className="pt-2 space-y-1.5">
                    <div className="h-2 w-2/3 bg-zinc-100 rounded" />
                    <div className="h-2 w-1/2 bg-emerald-50 rounded ml-auto" />
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#FAF9F6] border border-zinc-200/80 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-mono text-zinc-500">STEP 02</p>
                  <p className="text-sm font-semibold text-zinc-900 mt-1">Select “Export Chat”</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Scroll to the bottom of the Contact Info screen and tap Export Chat.
                  </p>
                </div>
                <div className="mt-5 bg-white rounded-lg border border-zinc-200 p-3 space-y-1.5 shadow-2xs">
                  <div className="px-2 py-1 text-[10px] text-zinc-400 border-b border-zinc-100">Starred Messages</div>
                  <div className="px-2 py-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded flex items-center justify-between">
                    <span>Export Chat</span>
                    <span>↗</span>
                  </div>
                  <div className="px-2 py-1 text-[10px] text-rose-400">Clear Chat</div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#FAF9F6] border border-zinc-200/80 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-mono text-zinc-500">STEP 03</p>
                  <p className="text-sm font-semibold text-zinc-900 mt-1">Choose “Without Media”</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Select Without Media and save the `.txt` file to Files or AirDrop it to your computer.
                  </p>
                </div>
                <div className="mt-5 bg-white rounded-lg border border-zinc-200 p-3 space-y-1.5 text-center shadow-2xs">
                  <p className="text-[10px] text-zinc-400">Include media?</p>
                  <div className="py-1 text-[10px] text-zinc-400 border border-zinc-100 rounded">Attach Media</div>
                  <div className="py-1.5 text-[11px] font-semibold text-white bg-zinc-900 rounded">Without Media ✓</div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <span>I Have My Chat File →</span>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-7">
            <div>
              <p className="text-xs font-medium text-zinc-500">Step 3 of 3 · {relationshipType}</p>
              <h1 className="mt-1 text-3xl font-editorial text-zinc-900">
                Upload your chat export
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                Drag and drop your `.txt` export file below, paste a transcript, or test immediately with a sample chat.
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
                  ? 'border-zinc-900 bg-zinc-900/5'
                  : fileName
                  ? 'border-emerald-600/50 bg-emerald-50/30'
                  : 'border-zinc-300 hover:border-zinc-400 bg-[#FAF9F6]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,text/plain"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelection(f);
                }}
              />
              <div className="w-11 h-11 rounded-full bg-white border border-zinc-200 mx-auto flex items-center justify-center mb-3">
                <Upload className="w-5 h-5 text-zinc-700" />
              </div>
              {fileName ? (
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{fileName} loaded</p>
                  <p className="text-xs text-zinc-500 mt-1 font-mono tabular-nums">
                    {rawText.split(/\r?\n/).filter(Boolean).length} lines ready for Indus · Click to replace
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    Click to upload or drag & drop your `.txt` file
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Supports WhatsApp & iMessage `.txt` exports up to 15MB
                  </p>
                </div>
              )}
            </div>

            <div className="bg-[#FAF9F6] rounded-xl p-4 border border-zinc-200/80">
              <p className="text-xs font-medium text-zinc-600 mb-2.5">
                Don’t have a `.txt` export handy right now? Load a realistic chat transcript to test live AI analysis:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadSample('situationship')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-800 hover:border-zinc-400 transition-colors cursor-pointer"
                >
                  Load Situationship 🌀 (Maya & Julian)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('ex')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-800 hover:border-zinc-400 transition-colors cursor-pointer"
                >
                  Load Ex 💔 (Chloe & Liam)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('groupchat')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-800 hover:border-zinc-400 transition-colors cursor-pointer"
                >
                  Load Boys Group 🐐 (Lisbon Trip)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                Or paste / inspect chat text directly:
              </label>
              <textarea
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  if (!fileName) setFileName('pasted_chat.txt');
                }}
                rows={4}
                placeholder="[03/09/26, 12:01:15 AM] Maya: Julian I feel like we only ever hang out after 11pm lately..."
                className="w-full rounded-xl border border-zinc-200 bg-[#FAF9F6] p-3.5 text-xs font-mono text-zinc-800 focus:outline-none focus:border-zinc-900"
              />
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleAnalyzeChat}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-zinc-900 text-white text-sm font-semibold rounded-full hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              >
                <span>Analyze my chat →</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-zinc-200/80 p-6">
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-4 h-4 text-zinc-700" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-900 font-sans">
              What happens to my data? (We don’t store your raw chat)
            </h2>
            <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed">
              Your `.txt` file is parsed for message counts and timestamps right in your browser, truncated to the most recent 50,000 tokens, and sent over encrypted HTTPS to generate Indus’s report. The moment your report finishes streaming, the raw chat transcript is permanently discarded from memory. Only the generated report summary and its shareable ID are kept so you can send the link to your friends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
