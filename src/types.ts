export type RelationshipType =
  | 'Situationship 🌀'
  | 'Ex 💔'
  | 'Boyfriend 💌'
  | 'Best friend 🤝'
  | 'Boys group 🐐'
  | 'Family group 🏠'
  | 'Husband 💍'
  | 'Girls group 💅'
  | 'Crush 👀'
  | 'Siblings 👫'
  | 'Talking stage 💬'
  | 'Uni group 🎓';

export interface SenderStats {
  name: string;
  messageCount: number;
  wordCount: number;
  avgLengthWords: number;
  initiationCount: number;
  initiationPercent: number;
  avgReplyMinutes: number;
  doubleTextCount: number;
  topEmojis: { emoji: string; count: number }[];
  questionCount: number;
}

export interface MonthlyActivity {
  month: string;
  count: number;
  avgReplyMinutes: number;
}

export interface DayOfWeekStat {
  day: string;
  count: number;
}

export interface HeatmapDay {
  date: string;
  dayOfWeek: number;
  weekIndex: number;
  count: number;
  level: number;
}

export interface RankedWord {
  word: string;
  count: number;
  usedBy?: string;
}

export interface ParsedChatStats {
  totalMessages: number;
  totalWords: number;
  totalDays: number;
  activeDaysCount: number;
  dateRange: string;
  platform: 'whatsapp' | 'imessage';
  participants: SenderStats[];
  peakHourLabel: string;
  peakDayLabel: string;
  recordDay: { date: string; count: number };
  longestStreakDays: number;
  longestSilenceHours: number;
  avgResponseOverallMinutes: number;
  hourlyDistribution: { hour: string; count: number }[];
  dayOfWeekDistribution: DayOfWeekStat[];
  monthlyTimeline: MonthlyActivity[];
  lateNightPercent: number;
  heatmapDays: HeatmapDay[];
  topSharedWords: RankedWord[];
  truncatedText: string;
}

export interface InlineEvidenceBubble {
  text: string;
  timestamp?: string;
}

export interface CharacterProfileBlock {
  type: 'prose' | 'bubble';
  content?: string; // prose paragraph (2nd-person)
  bubble?: InlineEvidenceBubble; // WhatsApp green bubble with blue double tick
}

export interface CharacterProfile {
  name: string;
  funnyTitle: string; // e.g. "The Undercover Snake & Drama Manufacturer 🐍"
  personalitySummary: string;
  signatureMove: string;
  bestMoment: string;
  worstMoment: string;
  storyBlocks: CharacterProfileBlock[];
  scores: {
    emotionallyAvailable: number; // 1-5
    responseSpeed: number; // 1-5
    vulnerability: number; // 1-5
    doubleTextEnergy: number; // 1-5
    pettyPotential: number; // 1-5
    humorIndex: number; // 1-5
  };
}

export interface VibeTimelineItem {
  month: string;
  temperature: 'Boiling 🔥' | 'Warm ☀️' | 'Lukewarm ☁️' | 'Freezing ❄️' | 'Volatile ⚡';
  degrees: number;
  summary: string;
}

export interface LoveLanguagePerson {
  name: string;
  primaryLanguage: string;
  secondaryLanguage: string;
  expressionScore: number;
  notes: string;
}

export interface LoveLanguageSection {
  breakdown: LoveLanguagePerson[];
  mismatchAnalysis: string;
}

export interface UnsaidThingsSection {
  subtextAnalysis: string;
  unspokenThoughts: {
    person: string;
    whatTheyTexted: string;
    whatTheyActuallyFelt: string;
  }[];
}

export interface WhoCaresMoreSection {
  personA: string;
  personAPercent: number;
  personB: string;
  personBPercent: number;
  evidence: string[];
  verdict: string;
}

export interface ConflictSection {
  fightPatterns: string;
  whoInstigates: string;
  whoDeEscalates: string;
  conflictResolutionStyle: string;
}

export interface GreenRedFlagsSection {
  greenFlags: string[];
  redFlags: string[];
}

export interface EmojiAutopsyItem {
  emoji: string;
  count: number;
  userReads: string;
  trendOverTime: string;
}

export interface EmojiAutopsySection {
  overallRead: string;
  items: EmojiAutopsyItem[];
}

export interface AttachmentStylePerson {
  name: string;
  style: 'Secure ⚓' | 'Anxious Preoccupied 🌊' | 'Dismissive Avoidant 🛡️' | 'Fearful Avoidant 🌪️';
  evidence: string;
  textingBehavior: string;
}

export interface IconicMomentSection {
  quoteSnippet: string;
  context: string;
  whyItMatters: string;
}

export interface CompatibilityDimension {
  dimension: string;
  score: number;
}

export interface CompatibilitySection {
  overallScore: number;
  dimensions: CompatibilityDimension[];
  summary: string;
}

export interface TrackItem {
  title: string;
  artist: string;
  reason: string;
}

export interface MovieSection {
  genre: string;
  tagline: string;
  casting: {
    person: string;
    actor: string;
    roleDescription: string;
  }[];
  plotEnding: string;
}

export interface AwardItem {
  recipient: string;
  title: string;
  reason: string;
}

export interface IndusReportContent {
  headline: string;
  subheadline: string;
  overview: string;
  characterChapterTitle?: string; // e.g. "The Personnel File: Delinquents, Frauds, and Ghost Agents"
  characterProfiles: CharacterProfile[];
  theShift: {
    period: string;
    headline: string;
    analysis: string;
    metricChange: string;
  };
  vibeTimeline: VibeTimelineItem[];
  loveLanguages: LoveLanguageSection;
  theUnsaidThings: UnsaidThingsSection;
  whoCaresMore: WhoCaresMoreSection;
  conflictReport: ConflictSection;
  flags: GreenRedFlagsSection;
  emojiAutopsy: EmojiAutopsySection;
  hotTakes: string[];
  attachmentStyles: AttachmentStylePerson[];
  iconicMoment: IconicMomentSection;
  compatibility: CompatibilitySection;
  playlist: TrackItem[];
  movie: MovieSection;
  awards: AwardItem[];
  verdict: string;
  whatToDoNext: string[];
}

export interface StoredReport {
  id: string;
  createdAt: string;
  relationshipType: string;
  platform: 'whatsapp' | 'imessage';
  stats: Omit<ParsedChatStats, 'truncatedText'>;
  report: IndusReportContent;
  isSample?: boolean;
}
