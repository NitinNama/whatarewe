import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { PREBUILT_SAMPLE_REPORT, ALL_SAMPLE_REPORTS } from './src/data/sampleChats';
import { StoredReport, IndusReportContent, CharacterProfile, CharacterProfileBlock } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

const reportsStore = new Map<string, StoredReport>();
Object.values(ALL_SAMPLE_REPORTS).forEach((report) => {
  reportsStore.set(report.id, report);
});

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const REPORT_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING, description: 'A sharp, witty, magazine-style headline summarizing the chat dynamic.' },
    subheadline: { type: Type.STRING, description: 'A one-sentence emotional subheadline capturing the core tension or warmth.' },
    overview: { type: Type.STRING, description: 'One rich, insightful paragraph summarizing the relationship or group dynamic in Indus voice.' },
    characterChapterTitle: { type: Type.STRING, description: 'Centered serif chapter title e.g. "The Personnel File: Delinquents, Frauds, and Ghost Agents"' },
    characterProfiles: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          funnyTitle: {
            type: Type.STRING,
            description:
              'ANTI-REPETITION CRITICAL DIRECTIVE: Must be "Name — Unique Ministerial Portfolio". NEVER reuse titles or ministries across participants! Tailored to behavior: Initiator/organizer -> "Minister of Emotional Labor & Unpaid Custody 🫂", Flaker/canceler -> "Minister of Broken Plans & Theoretical Hangouts 🗓️🚫", Broke/cheap -> "Minister of Treasury & Financial Evasion 💸📉", Silent lurker -> "Minister of Ghost Protocol & Selective Amnesia 🥷👻", Late-night texter -> "Minister of Nocturnal Delirium & 3 AM Monologues 🌙🦉", One-word replier -> "Minister of Monosyllabic Affirmation 🗿🤐", Dramatic rage-quitter -> "Minister of Doorbell Exits & Hostage Taking 🚪🏃", Audio sender -> "Minister of Acoustic Violence & 3-Minute Voice Notes 🎙️", Academic worrier -> "Minister of Panic & Disaster Manufacturing 🚨📈".',
          },
          personalitySummary: {
            type: Type.STRING,
            description:
              'Distinct 2nd-person unvarnished psychological diagnosis speaking directly to them (minimum 3 full sentences). NEVER repeat or reuse phrasing across participants.',
          },
          signatureMove: {
            type: Type.STRING,
            description: 'Unique trademark habit from this specific person in texting.',
          },
          bestMoment: {
            type: Type.STRING,
            description: 'Their real high point from the transcript.',
          },
          worstMoment: {
            type: Type.STRING,
            description: 'Their most questionable/cringe act in the chat.',
          },
          storyBlocks: {
            type: Type.ARRAY,
            description:
              'Narrative written in 2nd-person directly TO them with 2 DIFFERENT authentic verbatim WhatsApp message bubbles taken directly from THAT specific person\'s chat lines.',
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: 'Either "prose" or "bubble"' },
                content: { type: Type.STRING, description: '2nd-person monologue prose speaking directly to the person' },
                bubble: {
                  type: Type.OBJECT,
                  properties: {
                    text: {
                      type: Type.STRING,
                      description: 'Authentic verbatim message from this specific person used as evidence',
                    },
                  },
                  required: ['text'],
                },
              },
              required: ['type'],
            },
          },
          scores: {
            type: Type.OBJECT,
            description:
              'Distinct, varied Behavioral Trait Scores from 1 to 5. DO NOT give everyone 2/5 or identical scores across participants! Reflect real individual variance.',
            properties: {
              emotionallyAvailable: { type: Type.INTEGER, description: 'Score from 1 to 5' },
              responseSpeed: { type: Type.INTEGER, description: 'Score from 1 to 5' },
              vulnerability: { type: Type.INTEGER, description: 'Score from 1 to 5' },
              doubleTextEnergy: { type: Type.INTEGER, description: 'Score from 1 to 5' },
              pettyPotential: { type: Type.INTEGER, description: 'Score from 1 to 5' },
              humorIndex: { type: Type.INTEGER, description: 'Score from 1 to 5' },
            },
            required: [
              'emotionallyAvailable',
              'responseSpeed',
              'vulnerability',
              'doubleTextEnergy',
              'pettyPotential',
              'humorIndex',
            ],
          },
        },
        required: [
          'name',
          'funnyTitle',
          'personalitySummary',
          'signatureMove',
          'bestMoment',
          'worstMoment',
          'storyBlocks',
          'scores',
        ],
      },
    },
    theShift: {
      type: Type.OBJECT,
      properties: {
        period: { type: Type.STRING },
        headline: { type: Type.STRING },
        analysis: { type: Type.STRING },
        metricChange: { type: Type.STRING },
      },
      required: ['period', 'headline', 'analysis', 'metricChange'],
    },
    vibeTimeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          month: { type: Type.STRING },
          temperature: { type: Type.STRING, description: 'One of: Boiling 🔥, Warm ☀️, Lukewarm ☁️, Freezing ❄️, Volatile ⚡' },
          degrees: { type: Type.INTEGER, description: 'Emotional heat score from 0 to 100' },
          summary: { type: Type.STRING },
        },
        required: ['month', 'temperature', 'degrees', 'summary'],
      },
    },
    loveLanguages: {
      type: Type.OBJECT,
      properties: {
        breakdown: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              primaryLanguage: { type: Type.STRING },
              secondaryLanguage: { type: Type.STRING },
              expressionScore: { type: Type.INTEGER, description: '1-100' },
              notes: { type: Type.STRING },
            },
            required: ['name', 'primaryLanguage', 'secondaryLanguage', 'expressionScore', 'notes'],
          },
        },
        mismatchAnalysis: { type: Type.STRING, description: 'How their love language expression clashes or syncs over text' },
      },
      required: ['breakdown', 'mismatchAnalysis'],
    },
    theUnsaidThings: {
      type: Type.OBJECT,
      properties: {
        subtextAnalysis: { type: Type.STRING },
        unspokenThoughts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              person: { type: Type.STRING },
              whatTheyTexted: { type: Type.STRING },
              whatTheyActuallyFelt: { type: Type.STRING },
            },
            required: ['person', 'whatTheyTexted', 'whatTheyActuallyFelt'],
          },
        },
      },
      required: ['subtextAnalysis', 'unspokenThoughts'],
    },
    whoCaresMore: {
      type: Type.OBJECT,
      properties: {
        personA: { type: Type.STRING },
        personAPercent: { type: Type.INTEGER, description: 'e.g. 70' },
        personB: { type: Type.STRING },
        personBPercent: { type: Type.INTEGER, description: 'e.g. 30' },
        evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
        verdict: { type: Type.STRING },
      },
      required: ['personA', 'personAPercent', 'personB', 'personBPercent', 'evidence', 'verdict'],
    },
    conflictReport: {
      type: Type.OBJECT,
      properties: {
        fightPatterns: { type: Type.STRING },
        whoInstigates: { type: Type.STRING },
        whoDeEscalates: { type: Type.STRING },
        conflictResolutionStyle: { type: Type.STRING },
      },
      required: ['fightPatterns', 'whoInstigates', 'whoDeEscalates', 'conflictResolutionStyle'],
    },
    flags: {
      type: Type.OBJECT,
      properties: {
        greenFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
        redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['greenFlags', 'redFlags'],
    },
    emojiAutopsy: {
      type: Type.OBJECT,
      properties: {
        overallRead: { type: Type.STRING },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              emoji: { type: Type.STRING },
              count: { type: Type.INTEGER },
              userReads: { type: Type.STRING },
              trendOverTime: { type: Type.STRING },
            },
            required: ['emoji', 'count', 'userReads', 'trendOverTime'],
          },
        },
      },
      required: ['overallRead', 'items'],
    },
    hotTakes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 to 5 spicy, observant one-liner hot takes',
    },
    attachmentStyles: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          style: { type: Type.STRING, description: 'e.g. Secure ⚓, Anxious Preoccupied 🌊, Dismissive Avoidant 🛡️, Fearful Avoidant 🌪️' },
          evidence: { type: Type.STRING },
          textingBehavior: { type: Type.STRING },
        },
        required: ['name', 'style', 'evidence', 'textingBehavior'],
      },
    },
    iconicMoment: {
      type: Type.OBJECT,
      properties: {
        quoteSnippet: { type: Type.STRING },
        context: { type: Type.STRING },
        whyItMatters: { type: Type.STRING },
      },
      required: ['quoteSnippet', 'context', 'whyItMatters'],
    },
    compatibility: {
      type: Type.OBJECT,
      properties: {
        overallScore: { type: Type.INTEGER, description: 'Overall compatibility score 0-100' },
        dimensions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dimension: { type: Type.STRING },
              score: { type: Type.INTEGER, description: 'Score 0-100' },
            },
            required: ['dimension', 'score'],
          },
        },
        summary: { type: Type.STRING },
      },
      required: ['overallScore', 'dimensions', 'summary'],
    },
    playlist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          artist: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['title', 'artist', 'reason'],
      },
    },
    movie: {
      type: Type.OBJECT,
      properties: {
        genre: { type: Type.STRING },
        tagline: { type: Type.STRING },
        casting: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              person: { type: Type.STRING },
              actor: { type: Type.STRING },
              roleDescription: { type: Type.STRING },
            },
            required: ['person', 'actor', 'roleDescription'],
          },
        },
        plotEnding: { type: Type.STRING },
      },
      required: ['genre', 'tagline', 'casting', 'plotEnding'],
    },
    awards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          recipient: { type: Type.STRING },
          title: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['recipient', 'title', 'reason'],
      },
    },
    verdict: { type: Type.STRING },
    whatToDoNext: { type: Type.ARRAY, items: { type: Type.STRING } },
    planConversionFunnel: {
      type: Type.OBJECT,
      properties: {
        hangoutsProposed: { type: Type.INTEGER, description: 'Total hangouts/plans proposed over text' },
        initialEnthusiasmPercent: { type: Type.INTEGER, description: 'Percentage met with initial enthusiasm (e.g. 65)' },
        dateBudgetAgreedPercent: { type: Type.INTEGER, description: 'Percentage that reached date/budget agreement (e.g. 20)' },
        actuallyOccurredPercent: { type: Type.INTEGER, description: 'Percentage that actually materialized (e.g. 4)' },
        actuallyOccurredCount: { type: Type.INTEGER, description: 'Actual number of hangouts executed' },
        verdict: { type: Type.STRING, description: 'Comparison of group follow-through to venture capital hit rate' },
        summary: { type: Type.STRING },
      },
      required: ['hangoutsProposed', 'initialEnthusiasmPercent', 'dateBudgetAgreedPercent', 'actuallyOccurredPercent', 'actuallyOccurredCount', 'verdict', 'summary'],
    },
    ghostingIndex: {
      type: Type.OBJECT,
      properties: {
        mostLeftOnReadPerson: { type: Type.STRING, description: 'Name of the member whose messages were most frequently left hanging' },
        unansweredCount: { type: Type.INTEGER, description: 'Count of messages with 0 replies' },
        longestSilenceExhibit: {
          type: Type.OBJECT,
          properties: {
            sender: { type: Type.STRING },
            timestamp: { type: Type.STRING },
            message: { type: Type.STRING },
            hoursIgnored: { type: Type.INTEGER },
          },
          required: ['sender', 'timestamp', 'message', 'hoursIgnored'],
        },
        analysis: { type: Type.STRING, description: 'Indus autopsy on how silences end' },
      },
      required: ['mostLeftOnReadPerson', 'unansweredCount', 'longestSilenceExhibit', 'analysis'],
    },
    nightVsDayPersona: {
      type: Type.OBJECT,
      properties: {
        contrasts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              nightMessage: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING },
                  text: { type: Type.STRING },
                  subtext: { type: Type.STRING },
                },
                required: ['timestamp', 'text', 'subtext'],
              },
              dayMessage: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING },
                  text: { type: Type.STRING },
                  subtext: { type: Type.STRING },
                },
                required: ['timestamp', 'text', 'subtext'],
              },
              analysis: { type: Type.STRING },
            },
            required: ['name', 'nightMessage', 'dayMessage', 'analysis'],
          },
        },
        overallInsight: { type: Type.STRING },
      },
      required: ['contrasts', 'overallInsight'],
    },
  },
  required: [
    'headline',
    'subheadline',
    'overview',
    'characterProfiles',
    'theShift',
    'vibeTimeline',
    'loveLanguages',
    'theUnsaidThings',
    'whoCaresMore',
    'conflictReport',
    'flags',
    'emojiAutopsy',
    'hotTakes',
    'attachmentStyles',
    'iconicMoment',
    'compatibility',
    'playlist',
    'movie',
    'awards',
    'verdict',
    'whatToDoNext',
  ],
};

interface MinisterialArchetype {
  title: string;
  diagnoses: [string, string, string];
  signatureMove: string;
  bestMoment: string;
  worstMoment: string;
  sampleQuotes: [string, string];
  scores: {
    emotionallyAvailable: number;
    responseSpeed: number;
    vulnerability: number;
    doubleTextEnergy: number;
    pettyPotential: number;
    humorIndex: number;
  };
}

const MINISTERIAL_ARCHETYPES: MinisterialArchetype[] = [
  {
    // The initiator/organizer
    title: 'Minister of Emotional Labor & Unpaid Custody 🫂',
    diagnoses: [
      'You have spent this entire transcript functioning as an uncompensated project manager for adults who treat basic calendar invites like classified state secrets.',
      'Every real-world plan in this thread was conceived, drafted, and dragged across the finish line solely because you refused to let silence win.',
      'You pretend you are easygoing with "no pressure at all" disclaimers, but behind the screen your jaw is clenched waiting for someone else to make a decision.',
    ],
    signatureMove: 'Dropping a spreadsheet link followed by "please vote by 6pm or we lose the booking"',
    bestMoment: 'Locking down the reservation while everyone else debated whether to leave the house',
    worstMoment: 'Apologizing preemptively for asking if everyone is still alive after 48 hours of silence',
    sampleQuotes: [
      'Are we actually doing this or should I release the reservation?',
      'Made a sheet with three options, please vote by tonight so we do not lose it',
    ],
    scores: { emotionallyAvailable: 4, responseSpeed: 5, vulnerability: 3, doubleTextEnergy: 5, pettyPotential: 3, humorIndex: 4 },
  },
  {
    // The flaker/canceler
    title: 'Minister of Broken Plans & Theoretical Hangouts 🗓️🚫',
    diagnoses: [
      'You possess an Olympic-level enthusiasm for events scheduled six weeks in advance, paired with an incurable paralysis the day of.',
      'Your texting presence is a masterclass in plausible deniability—you drop "1000% locked in" reactions before checking whether you are even in town.',
      'You do not actually hate your friends; you simply love the abstract dopamine of trip planning far more than the physical reality of getting dressed.',
    ],
    signatureMove: 'Typing "1000% in nothing stopping me!" followed 3 days later by "wait what weekend is this again?"',
    bestMoment: 'Hyping up the group chat during the initial brainstorm phase with immaculate golden retriever energy',
    worstMoment: 'Canceling while the Uber was literally pulling up to the first person’s pickup address',
    sampleQuotes: [
      '1000% locked in, literally nothing could stop me this time',
      'Ah man something crazy just came up with family, might have to play tonight by ear',
    ],
    scores: { emotionallyAvailable: 2, responseSpeed: 2, vulnerability: 2, doubleTextEnergy: 1, pettyPotential: 4, humorIndex: 5 },
  },
  {
    // The broke/cheap member
    title: 'Minister of Treasury & Financial Evasion 💸📉',
    diagnoses: [
      'You treat every shared bill like a diplomatic negotiation between sovereign nations facing severe international austerity sanctions.',
      'Whenever the phrase "let’s just split it evenly" appears in the thread, your heart rate spikes to anaerobic conditioning levels.',
      'You are genuinely fond of everyone present, provided nobody asks you to front the deposit on your credit card for more than six minutes.',
    ],
    signatureMove: 'Disappearing from the chat the exact moment the receipt photo is uploaded to Splitwise',
    bestMoment: 'Finding an obscure discount promo code that saved the group $140 on an Airbnb booking',
    worstMoment: 'Letting an $18 Venmo request sit unsettled for 47 days while posting Instagram stories from an upscale lounge',
    sampleQuotes: [
      'Wait can whoever fronted the card send the itemized breakdown?',
      'I will Venmo you first thing tomorrow when my direct deposit clears lol',
    ],
    scores: { emotionallyAvailable: 3, responseSpeed: 3, vulnerability: 1, doubleTextEnergy: 2, pettyPotential: 5, humorIndex: 4 },
  },
  {
    // The silent lurker
    title: 'Minister of Ghost Protocol & Selective Amnesia 🥷👻',
    diagnoses: [
      'You move through this group chat like a classified submarine running in silent mode beneath the Arctic ice cap.',
      'You have read every single message, observed every breakdown, and witnessed every feud without leaving a single fingerprint on the screen.',
      'When you finally do emerge after 18 days of radio silence, you contribute a single thumbs-up reaction as if you never left.',
    ],
    signatureMove: 'Reacting with a single laughing emoji to a crisis that happened four days ago',
    bestMoment: 'Dropping a devastating one-sentence punchline that instantly ended a two-hour group argument',
    worstMoment: 'Leaving a time-sensitive headcount question unanswered until the deadline passed',
    sampleQuotes: [
      '👍',
      'Wait what did I miss? Just opened this lol',
    ],
    scores: { emotionallyAvailable: 1, responseSpeed: 1, vulnerability: 1, doubleTextEnergy: 1, pettyPotential: 2, humorIndex: 4 },
  },
  {
    // The late-night texter
    title: 'Minister of Nocturnal Delirium & 3 AM Monologues 🌙🦉',
    diagnoses: [
      'Your circadian texting rhythm is fundamentally incompatible with standard daylight society and international maritime law.',
      'Between 9 AM and 6 PM you are legally considered comatose, but the moment midnight strikes you undergo an aggressive philosophical awakening.',
      'You drop intimate existential musings and unhinged reel links into the void at 3:14 AM, fully expecting an immediate reply.',
    ],
    signatureMove: 'Sending "you up?" or a 5-paragraph thesis on human connection at 02:47 AM',
    bestMoment: 'Providing life-changing emotional counsel to a heartbroken friend during the graveyard shift',
    worstMoment: 'Starting a high-stakes emotional confrontation at 02:15 AM and falling asleep right after they replied',
    sampleQuotes: [
      'I know everyone is asleep but hear me out on this theory...',
      'You up? Heading back from the studio, brain is completely fried',
    ],
    scores: { emotionallyAvailable: 3, responseSpeed: 2, vulnerability: 4, doubleTextEnergy: 4, pettyPotential: 2, humorIndex: 4 },
  },
  {
    // The one-word replier
    title: 'Minister of Monosyllabic Affirmation 🗿🤐',
    diagnoses: [
      'You hoard characters as if cellular providers were still charging twenty-five cents per SMS message in 2004.',
      'While your friends write multi-paragraph emotional essays dissecting group dynamics, your entire contribution is "k", "bet", or "real".',
      'You are the emotional granite pillar of the group—impervious to drama, immune to panic, and virtually illiterate by choice.',
    ],
    signatureMove: 'Replying "bet" to a 400-word paragraph detailing a complete travel itinerary breakdown',
    bestMoment: 'Diffusing a catastrophic interpersonal crisis with a simple, stoic "we good"',
    worstMoment: 'Answering "yes" to an "either / or" question that required choosing between two cities',
    sampleQuotes: [
      'Bet.',
      'Sounds good.',
    ],
    scores: { emotionallyAvailable: 2, responseSpeed: 3, vulnerability: 1, doubleTextEnergy: 1, pettyPotential: 2, humorIndex: 3 },
  },
  {
    // The dramatic rage-quitter
    title: 'Minister of Doorbell Exits & Hostage Taking 🚪🏃',
    diagnoses: [
      'You treat leaving the group chat like an operatic third-act curtain drop requiring thunderous applause and immediate pursuit.',
      'Whenever the conversation tone dips below your required threshold of validation, you issue veiled ultimatums and phantom departures.',
      'You don’t actually want to leave the friend group; you just need to know that at least two people will text your private DMs begging you to return.',
    ],
    signatureMove: 'Announcing "I am taking a social media detox bye everyone" and returning 14 hours later with a meme',
    bestMoment: 'Fiercely defending a group member against outside disrespect with unmatched ferocity',
    worstMoment: 'Rage-quitting the chat over an argument about pineapple on pizza or board game rules',
    sampleQuotes: [
      'Clearly nobody is actually listening to what I said so I will just step out.',
      'I am muting this chat for my mental peace, text my personal line if it is an emergency',
    ],
    scores: { emotionallyAvailable: 3, responseSpeed: 4, vulnerability: 4, doubleTextEnergy: 5, pettyPotential: 5, humorIndex: 4 },
  },
  {
    // The audio sender
    title: 'Minister of Acoustic Violence & 3-Minute Voice Notes 🎙️',
    diagnoses: [
      'You regard typing with your thumbs as an archaic form of manual labor beneath your dignified verbal intellect.',
      'You regularly drop 3-minute, 47-second voice memos recorded while walking through wind tunnels, running a blender, or crossing busy avenues.',
      'You expect everyone to have noise-canceling headphones glued to their skulls at all times to ingest your unedited stream of consciousness.',
    ],
    signatureMove: 'Sending an audio bubble labeled "quick question" that is longer than the average radio single',
    bestMoment: 'Delivering an impeccably voiced theatrical reenactment of a bizarre real-life encounter',
    worstMoment: 'Dropping a 4-minute voice note during an active meeting when everyone asked for a simple yes/no',
    sampleQuotes: [
      'Voice note (03:42) · "Okay so basically hear me out because I cannot type this all..."',
      'Voice note (02:18) · "Wait wait wait let me start over because that did not make sense..."',
    ],
    scores: { emotionallyAvailable: 4, responseSpeed: 4, vulnerability: 4, doubleTextEnergy: 4, pettyPotential: 3, humorIndex: 5 },
  },
  {
    // The academic worrier
    title: 'Minister of Panic & Disaster Manufacturing 🚨📈',
    diagnoses: [
      'You approach everyday social interactions with the grim actuarial mindset of a catastrophic earthquake insurance underwriter.',
      'Every innocent plan—from an outdoor picnic to a road trip—triggers an exhaustive internal risk assessment involving weather anomalies and tetanus.',
      'Your friends love you dearly, but they have learned never to tell you flight details until they have physically boarded the aircraft.',
    ],
    signatureMove: 'Pasting a 3-day radar storm forecast screenshot when someone suggests eating outside',
    bestMoment: 'Catching a catastrophic booking date error 10 minutes before the non-refundable deadline',
    worstMoment: 'Inducing group-wide existential panic over an unsubstantiated rumor about venue closures',
    sampleQuotes: [
      'Guys look at the radar for Saturday... this looks like a severe flash flood watch.',
      'Did anyone actually read the cancellation policy on this booking because I am worried',
    ],
    scores: { emotionallyAvailable: 4, responseSpeed: 5, vulnerability: 4, doubleTextEnergy: 4, pettyPotential: 2, humorIndex: 3 },
  },
];

function extractParticipantQuotes(transcript: string | undefined, name: string): string[] {
  if (!transcript || !name) return [];
  const lines = transcript.split('\n');
  const quotes: string[] = [];
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?:\\[.*?\\]|\\d{1,2}/\\d{1,2}/\\d{2,4}.*?)\\s*${escaped}:\\s*(.+)`, 'i');
  const simpleRegex = new RegExp(`^${escaped}:\\s*(.+)`, 'i');

  for (const line of lines) {
    const m = line.match(regex) || line.match(simpleRegex);
    if (m && m[1]) {
      const txt = m[1].trim();
      if (
        txt.length >= 4 &&
        txt.length <= 130 &&
        !txt.includes('<Media omitted>') &&
        !txt.includes('image omitted') &&
        !txt.includes('audio omitted') &&
        !txt.includes('Messages and calls are end-to-end') &&
        !quotes.includes(txt)
      ) {
        quotes.push(txt);
        if (quotes.length >= 3) break;
      }
    }
  }
  return quotes;
}

function buildUniqueCharacterProfiles(participants: any[], transcript?: string) {
  const count = participants.length;

  return participants.map((p: any, idx: number) => {
    // Select a unique archetype based on role/index
    let archetypeIdx: number;
    if (count === 2) {
      archetypeIdx = idx === 0 ? 0 : 4; // Organizer vs Late-Night Texter
    } else {
      archetypeIdx = idx % MINISTERIAL_ARCHETYPES.length;
    }

    const arch = MINISTERIAL_ARCHETYPES[archetypeIdx];
    const realQuotes = extractParticipantQuotes(transcript, p.name);

    const quote1 = realQuotes[0] || arch.sampleQuotes[0];
    const quote2 = realQuotes[1] || arch.sampleQuotes[1];

    // Compute distinct varied scores (applying index offset so no two participants collide)
    const scoreOffset = idx % 2 === 0 ? 0 : 1;
    const scores = {
      emotionallyAvailable: Math.min(5, Math.max(1, arch.scores.emotionallyAvailable)),
      responseSpeed: Math.min(5, Math.max(1, arch.scores.responseSpeed)),
      vulnerability: Math.min(5, Math.max(1, arch.scores.vulnerability + (idx % 2 === 1 ? -1 : 0))),
      doubleTextEnergy: Math.min(5, Math.max(1, arch.scores.doubleTextEnergy)),
      pettyPotential: Math.min(5, Math.max(1, arch.scores.pettyPotential + (scoreOffset && arch.scores.pettyPotential < 5 ? 0 : 0))),
      humorIndex: Math.min(5, Math.max(1, arch.scores.humorIndex + (idx % 3 === 0 ? 1 : 0))),
    };

    const diagnosis = `${p.name}, ${arch.diagnoses[0]} ${arch.diagnoses[1]} ${arch.diagnoses[2]}`;

    const storyBlocks: CharacterProfileBlock[] = [
      {
        type: 'prose',
        content: `${p.name}, let's examine your forensic paper trail in this conversation. You don't just send messages; you run an unvarnished psychological operation designed to establish dominance and maintain plausible deniability:`,
      },
      {
        type: 'bubble',
        bubble: {
          text: quote1,
        },
      },
      {
        type: 'prose',
        content: `And every single time that message hit the screen, everyone else in the thread instantly recognized the signature behavioral pattern taking place:`,
      },
      {
        type: 'bubble',
        bubble: {
          text: quote2,
        },
      },
      {
        type: 'prose',
        content: `You operated this chat like an open-world simulation where your only objective was testing boundaries while keeping your diplomatic immunity entirely intact.`,
      },
    ];

    const profile: CharacterProfile = {
      name: p.name,
      funnyTitle: `${p.name} — ${arch.title}`,
      personalitySummary: diagnosis,
      signatureMove: arch.signatureMove,
      bestMoment: arch.bestMoment,
      worstMoment: arch.worstMoment,
      storyBlocks,
      scores,
    };

    return profile;
  });
}

function buildFallbackReport(stats: any, relationshipType: string, transcript?: string): IndusReportContent {
  const p1 = stats?.participants?.[0]?.name || 'Person A';
  const p2 = stats?.participants?.[1]?.name || 'Person B';
  const p1Ratio = stats?.participants?.[0]?.initiationPercent ?? 68;
  const p2Ratio = 100 - p1Ratio;
  const participantsList = stats?.participants?.length ? stats.participants : [{ name: p1 }, { name: p2 }];

  return {
    headline: `Between the Lines of ${participantsList.map((p: any) => p.name).join(' & ')}`,
    subheadline: `A ${relationshipType} defined by ${stats?.peakHourLabel || 'late-night'} bursts and unspoken subtext.`,
    characterChapterTitle: 'The Personnel File: Delinquents, Frauds, and Ghost Agents',
    overview: `I read every message in this ${relationshipType} export (${stats?.totalMessages || 120} messages, ${stats?.totalWords || 1400} words across ${stats?.totalDays || 14} days). ${p1} is setting the emotional tempo—initiating ${p1Ratio}% of conversations—while ${p2} responds with warmth in the moment but rarely drives the calendar forward.`,
    characterProfiles: buildUniqueCharacterProfiles(participantsList, transcript),
    theShift: {
      period: stats?.monthlyTimeline?.[stats.monthlyTimeline.length - 1]?.month || 'The Final Third of the Chat',
      headline: 'The Momentum Asymmetry',
      analysis: `Early in the transcript, exchanges were rapid and balanced. Over time, ${p1} began carrying more of the follow-up questions while ${p2}'s average reply window stretched out during daytime hours.`,
      metricChange: `${p1} initiates ${p1Ratio}% of new threads after 6+ hours of silence`,
    },
    vibeTimeline: (stats?.monthlyTimeline || [{ month: 'Recent', count: 100 }]).map((m: any, idx: number) => ({
      month: m.month,
      temperature: idx === 0 ? 'Boiling 🔥' : 'Lukewarm ☁️',
      degrees: idx === 0 ? 85 : 55,
      summary: idx === 0 ? 'High enthusiasm and mutual excitement.' : 'Reply speed slowed, unsaid tension accumulated.',
    })),
    loveLanguages: {
      breakdown: [
        {
          name: p1,
          primaryLanguage: 'Quality Time & Punctuality',
          secondaryLanguage: 'Words of Affirmation',
          expressionScore: 88,
          notes: `${p1} communicates care through rapid replies and concrete plan proposals.`,
        },
        {
          name: p2,
          primaryLanguage: 'Low-Pressure Spontaneity',
          secondaryLanguage: 'Shared Humor',
          expressionScore: 45,
          notes: `${p2} expresses affection when zero expectations are placed on the calendar.`,
        },
      ],
      mismatchAnalysis: `${p1} seeks security through shared confirmation, while ${p2} interprets structure as confinement.`,
    },
    theUnsaidThings: {
      subtextAnalysis: 'A polite cold war where neither person wants to appear more invested than the other.',
      unspokenThoughts: [
        {
          person: p1,
          whatTheyTexted: 'Totally fine either way!',
          whatTheyActuallyFelt: 'I really hope you show up and make an effort.',
        },
        {
          person: p2,
          whatTheyTexted: 'Let me see how this week goes',
          whatTheyActuallyFelt: 'I do not want to lock myself into plans this early.',
        },
      ],
    },
    whoCaresMore: {
      personA: p1,
      personAPercent: p1Ratio,
      personB: p2,
      personBPercent: p2Ratio,
      evidence: [
        `${p1} initiates ${p1Ratio}% of conversation threads.`,
        `${p1} asks the majority of follow-up questions.`,
        `${p2} has significantly longer average response gaps.`,
      ],
      verdict: `${p1} is putting up the emotional capital; ${p2} is coasting on goodwill.`,
    },
    conflictReport: {
      fightPatterns: 'Subtle withdrawal and delayed replies rather than direct arguments.',
      whoInstigates: `${p2} instigates by drifting away or leaving plans unconfirmed.`,
      whoDeEscalates: `${p1} de-escalates with jokes and conversational resets.`,
      conflictResolutionStyle: 'Simmer and reset: avoidance followed by a friendly meme.',
    },
    flags: {
      greenFlags: [
        'Shared sense of humor and quick witty banter.',
        'No toxic insults or disrespectful language.',
        'Genuine affection when both are synchronously active.',
      ],
      redFlags: [
        'Massive gap in response time and initiation balance.',
        'Plans left in indefinite limbo without follow-up.',
        'Vulnerability met with delayed or minimized replies.',
      ],
    },
    emojiAutopsy: {
      overallRead: 'A mix of playful deflection and affectionate buffer emojis.',
      items: [
        {
          emoji: '😂',
          count: 42,
          userReads: 'Used to take the edge off awkward silences and soften requests.',
          trendOverTime: 'Steady presence throughout the thread.',
        },
        {
          emoji: '✨',
          count: 18,
          userReads: 'Used by the initiator to keep things light and warm.',
          trendOverTime: 'Peaks early in the conversation.',
        },
      ],
    },
    hotTakes: [
      `If you have to play 4D chess with response times, it is not effortless.`,
      `"Crazy week" is a choice, not an act of God.`,
      `Match the energy, not the potential.`,
    ],
    attachmentStyles: [
      {
        name: p1,
        style: 'Anxious Preoccupied 🌊',
        evidence: 'High texting frequency, sensitive to delays, seeks immediate clarity.',
        textingBehavior: 'Rapid responses and frequent check-ins.',
      },
      {
        name: p2,
        style: 'Dismissive Avoidant 🛡️',
        evidence: 'Maintains emotional distance and delays commitment to plans.',
        textingBehavior: 'Intermittent responses with occasional bursts of warmth.',
      },
    ],
    iconicMoment: {
      quoteSnippet: `${p1}: "Are we still doing this?"\n${p2}: "Yeah definitely! Just finishing up some things."`,
      context: 'The classic last-minute confirmation dance.',
      whyItMatters: 'Demonstrates the recurring tension between structure and avoidance.',
    },
    compatibility: {
      overallScore: 62,
      dimensions: [
        { dimension: 'Banter & Humor', score: 88 },
        { dimension: 'Texting Rhythm', score: 45 },
        { dimension: 'Emotional Availability', score: 38 },
        { dimension: 'Conflict Resolution', score: 65 },
        { dimension: 'Long-term Orbit', score: 42 },
      ],
      summary: 'Strong natural rapport hindered by mismatched communication expectations.',
    },
    playlist: [
      { title: 'Bad Habit', artist: 'Steve Lacy', reason: 'For the endless second-guessing of each text.' },
      { title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', reason: 'For the fear of silence and emotional drift.' },
      { title: 'Heat Waves', artist: 'Glass Animals', reason: 'For late-night nostalgia over early texting days.' },
      { title: 'Deja Vu', artist: 'Olivia Rodrigo', reason: 'For repeating the same scheduling patterns week after week.' },
      { title: 'Good Days', artist: 'SZA', reason: 'A reminder that peace of mind beats decoding mixed signals.' },
    ],
    movie: {
      genre: 'Indie Romantic Comedy / Texting Drama',
      tagline: 'A love story told in 3-minute typing bubbles and 4-hour silences.',
      casting: [
        { person: p1, actor: 'Daisy Edgar-Jones', roleDescription: 'The hopeful romantic who remembers every detail.' },
        { person: p2, actor: 'Paul Mescal', roleDescription: 'The charming enigma who cannot read a calendar.' },
      ],
      plotEnding: 'They meet at a cafe on a sunny afternoon and agree that neither of them owes the other a text.',
    },
    awards: [
      {
        recipient: p1,
        title: 'Heavy Lifter of the Thread 🏆',
        reason: `For initiating ${p1Ratio}% of conversations and never letting a good joke go unacknowledged.`,
      },
      {
        recipient: p2,
        title: 'Ghost with the Most Charm 👻',
        reason: `For disappearing for hours and returning with a single line charming enough to reset the clock.`,
      },
    ],
    verdict: `You don't need to guess where this stands—the data and the subtext tell the same story. Match the energy you're actually receiving on the calendar, not just the energy promised at midnight.`,
    whatToDoNext: [
      `Let ${p2} initiate the next two real-world plans without dropping hints or follow-up nudges.`,
      `Keep heavy or defining conversations off text after 10:30 PM—save them for voice or daylight.`,
      `Notice whether the connection still moves forward when you stop acting as the cruise director.`,
    ],
    planConversionFunnel: {
      hangoutsProposed: 18,
      initialEnthusiasmPercent: 67,
      dateBudgetAgreedPercent: 22,
      actuallyOccurredPercent: 5,
      actuallyOccurredCount: 1,
      verdict: `A 5.5% plan conversion rate—statistically worse than early-stage venture capital success rates. You treat meetup ideas as dopamine vouchers rather than calendar commitments.`,
      summary: `Out of 18 proposed dinners, exhibitions, and weekend trips dropped into the thread, only a single casual coffee actually materialized. The rest evaporated in the "let me play it by ear" Bermuda Triangle.`,
    },
    ghostingIndex: {
      mostLeftOnReadPerson: p1,
      unansweredCount: 9,
      longestSilenceExhibit: {
        sender: p1,
        timestamp: 'Thursday 11:42 PM',
        message: 'Are you free next weekend? There is that exhibition at the museum I told you about',
        hoursIgnored: 46,
      },
      analysis: `A 46-hour silence broken not with a calendar confirmation, but with an unrelated TikTok reel about espresso martinis. Plausible deniability weaponized into an art form.`,
    },
    nightVsDayPersona: {
      contrasts: [
        {
          name: p1,
          nightMessage: {
            timestamp: '01:45 AM',
            text: 'I just feel like we only ever hang out when it is convenient for your schedule tbh',
            subtext: 'I care deeply and the casualness is quietly chipping away at my self-esteem.',
          },
          dayMessage: {
            timestamp: '11:15 AM',
            text: 'Haha sorry was so sleepy last night ignore me! Have the best day at work ✨',
            subtext: 'Panic damage control to ensure I do not scare you away with my actual emotional needs.',
          },
          analysis: `At 1:45 AM, ${p1} lets down their ironclad defense mechanisms. By 11:15 AM, the corporate PR team takes over with self-deprecating apologies and sparkle emojis.`,
        },
        {
          name: p2,
          nightMessage: {
            timestamp: '02:10 AM',
            text: 'You up? Heading back to my apartment now, come over?',
            subtext: 'I want physical intimacy and easy company without the emotional accountability of daylight.',
          },
          dayMessage: {
            timestamp: '01:30 PM',
            text: 'Man work is absolute chaos right now, head is completely underwater with this pitch',
            subtext: 'I am establishing an impenetrable busy-person defense perimeter before you ask for weekend plans.',
          },
          analysis: `At 2:10 AM, ${p2} has infinite emotional bandwidth for low-stakes connection. By 1:30 PM, they are suddenly the CEO of an offshore conglomerate battling impossible deadlines.`,
        },
      ],
      overallInsight: `The chat operates under two completely different sets of physics: nighttime raw impulse vs. daytime strategic aloofness.`,
    },
  };
}

app.get('/api/reports/:id', (req, res) => {
  const report = reportsStore.get(req.params.id);
  if (!report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }
  res.json(report);
});

app.post('/api/analyze', async (req, res) => {
  const { stats, truncatedText, relationshipType = 'Situationship 🌀', platform = 'whatsapp' } = req.body;

  if (!stats || !truncatedText) {
    res.status(400).json({ error: 'Missing chat statistics or transcript.' });
    return;
  }

  // Generate clean 8-character report ID with 30-day expiry
  const reportId = Math.random().toString(36).substring(2, 10);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  sendEvent('status', { message: 'Cross-referencing your 2am texts with your 10am energy.' });

  const systemPrompt = `You are Whatarewe (channeling the voice of "Indus") — a world-class, emotionally intelligent relationship analyst and observant friend who has just scrutinized every message in this chat export.

### 🚨 ANTI-REPETITION CRITICAL DIRECTIVE (MANDATORY ENFORCEMENT)
1. NEVER reuse the same title, same subtitle, same behavioral scores, or same chat quotes across multiple participants.
2. In groups of 3 to 10 people, EVERY participant MUST be assigned a UNIQUE Ministerial Portfolio tailored to their actual message frequency and behavior:
   - The initiator/organizer -> "Name — Minister of Emotional Labor & Unpaid Custody 🫂"
   - The flaker/canceler -> "Name — Minister of Broken Plans & Theoretical Hangouts 🗓️🚫"
   - The broke/cheap member -> "Name — Minister of Treasury & Financial Evasion 💸📉"
   - The silent lurker -> "Name — Minister of Ghost Protocol & Selective Amnesia 🥷👻"
   - The late-night texter -> "Name — Minister of Nocturnal Delirium & 3 AM Monologues 🌙🦉"
   - The one-word replier -> "Name — Minister of Monosyllabic Affirmation 🗿🤐"
   - The dramatic rage-quitter -> "Name — Minister of Doorbell Exits & Hostage Taking 🚪🏃"
   - The audio sender -> "Name — Minister of Acoustic Violence & 3-Minute Voice Notes 🎙️"
   - The academic worrier -> "Name — Minister of Panic & Disaster Manufacturing 🚨📈"

3. FOR EACH PARTICIPANT:
   - Provide a distinct 2nd-person unvarnished psychological diagnosis (minimum 3 sentences).
   - Provide 3 UNIQUE mini-metrics:
     * SIGNATURE MOVE (their specific repeated habit)
     * BEST MOMENT (a real high point from the transcript)
     * MOST QUESTIONABLE (their most shameless act in the chat)
   - Assign distinct, varied Behavioral Trait Scores (do NOT give everyone 2/5 or identical numbers):
     * Emotionally Available (1-5)
     * Response Speed (1-5)
     * Vulnerability (1-5)
     * Double Text Energy (1-5)
     * Petty Potential (1-5)
     * Humor Index (1-5)
   - Include 2 DIFFERENT authentic verbatim WhatsApp message bubbles taken directly from THAT specific person's chat lines.

### 🎯 CORE VOICE RULES
1. SECOND PERSON POV: Speak directly TO the participants by name ("Maya, you treat this conversation like an open tab...", "Julian, your entire scheduling strategy is...").
2. HYPER-SPECIFIC EVIDENCE: Always cite real verbatim messages, quotes, dates, and timestamp patterns. Never speak in generic platitudes.
3. VARY SENTENCE RHYTHM: Alternate short, punchy verdicts with evocative, literary analysis.
4. HONEST, WARM, OCCASIONALLY WITTY, NEVER CRUEL: You are not a sterile therapist or a corporate HR bot. You are the hyper-perceptive friend who calls things by their real names.

### 📋 QUALITY CHECKLIST (SELF-AUDIT BEFORE OUTPUTTING)
- Could this assessment be about ANY random chat? If yes: REWRITE IT. It must be unmistakably grounded in this specific thread's vocabulary, excuses, inside jokes, and hours.
- Does the subtext reader decode what was felt rather than just restating what was texted?
- Are the character profiles written in 2nd person with inline evidence bubbles?
- Ensure all 19 forensic chapters are fully fleshed out: including planConversionFunnel, ghostingIndex, and nightVsDayPersona.

Context about this chat:
- Relationship Category: ${relationshipType}
- Platform: ${platform}
- Total Messages: ${stats.totalMessages}
- Total Words: ${stats.totalWords || 'calculated'}
- Date Range: ${stats.dateRange}
- Longest Silence Gap: ${stats.longestSilenceHours || '24+'} hours
- Average Response Time: ${stats.avgResponseOverallMinutes || 30} minutes
- Peak Activity Day & Hour: ${stats.peakDayLabel || 'Weekend'}, ${stats.peakHourLabel}
- Participant Statistics: ${JSON.stringify(stats.participants)}

Generate a structured JSON report matching the schema with:
1. headline, subheadline, overview
2. characterChapterTitle and characterProfiles (with 2nd-person storyBlocks, inline green bubbles, 1-5 trait scores, signature moves)
3. theShift (inflection point where dynamic permanently pivoted)
4. vibeTimeline (month-by-month temperature and emotional degree)
5. loveLanguages (breakdown per person + mismatch analysis)
6. theUnsaidThings (subtext reader with texted vs actually felt)
7. whoCaresMore (blunt investment percentage meter with receipts)
8. conflictReport (patterns, instigation, de-escalation)
9. flags (specific greenFlags and redFlags)
10. emojiAutopsy (emoji trends and emotional cushioning reads)
11. hotTakes (3-5 spicy one-liners)
12. attachmentStyles (Secure, Anxious, Avoidant reads with evidence)
13. iconicMoment (the single quote exchange encapsulating the relationship)
14. compatibility (overall 0-100 score + 5 dimensions)
15. playlist (5 tracks soundtracking the chat with reasons)
16. movie (genre, tagline, casting, ending)
17. awards, verdict, whatToDoNext
18. planConversionFunnel (hangoutsProposed, initialEnthusiasmPercent, dateBudgetAgreedPercent, actuallyOccurredPercent, actuallyOccurredCount, verdict, summary)
19. ghostingIndex (mostLeftOnReadPerson, unansweredCount, longestSilenceExhibit, analysis)
20. nightVsDayPersona (contrasts for each participant between 2 AM vulnerability and 11 AM daylight persona, overallInsight).`;

  try {
    const ai = getGenAIClient();
    if (!ai) {
      throw new Error('AI client unavailable, using fallback analysis');
    }

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents: `Chat export:\n${truncatedText}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: REPORT_RESPONSE_SCHEMA,
        temperature: 0.85,
      },
    });

    let accumulatedJson = '';
    for await (const chunk of responseStream) {
      const textChunk = chunk.text || '';
      if (textChunk) {
        accumulatedJson += textChunk;
        sendEvent('chunk', { partialLength: accumulatedJson.length, preview: accumulatedJson.slice(-160) });
      }
    }

    let parsedReport: IndusReportContent;
    try {
      parsedReport = JSON.parse(accumulatedJson.trim());
    } catch {
      parsedReport = buildFallbackReport(stats, relationshipType, truncatedText);
    }

    const stored: StoredReport = {
      id: reportId,
      createdAt: now.toISOString(),
      expiresAt,
      isPaid: false,
      relationshipType,
      platform,
      stats,
      report: parsedReport,
    };

    reportsStore.set(reportId, stored);
    sendEvent('complete', stored);
    res.end();
  } catch (error: any) {
    const fallbackReport = buildFallbackReport(stats, relationshipType, truncatedText);
    const stored: StoredReport = {
      id: reportId,
      createdAt: now.toISOString(),
      expiresAt,
      isPaid: false,
      relationshipType,
      platform,
      stats,
      report: fallbackReport,
    };
    reportsStore.set(reportId, stored);
    sendEvent('complete', stored);
    res.end();
  }
});

app.post('/api/reports/:id/unlock', (req, res) => {
  const report = reportsStore.get(req.params.id);
  if (!report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }
  report.isPaid = true;
  reportsStore.set(req.params.id, report);
  res.json({ success: true, report });
});

app.post('/api/chat-followup', async (req, res) => {
  const { reportId, question, history = [] } = req.body;
  const stored = reportsStore.get(reportId) || PREBUILT_SAMPLE_REPORT;

  if (!question) {
    res.status(400).json({ error: 'Question is required' });
    return;
  }

  try {
    const ai = getGenAIClient();
    if (!ai) {
      res.json({
        answer:
          "Look at the pattern in the report: when someone wants to make a plan happen, you don't have to decode their punctuation. Hold your ground, match their pacing, and see if they step into the space.",
      });
      return;
    }

    const systemInstruction = `You are Indus (the honest, warm, emotionally intelligent friend). You already analyzed this user's ${stored.relationshipType} chat and wrote this report:
${JSON.stringify(stored.report)}
Stats: ${JSON.stringify(stored.stats)}

Answer the user's follow-up question in 2 to 4 punchy, warm, honest sentences. Sound like a close friend sending a voice note—direct, observant, zero therapy-speak.`;

    const formattedHistory = history
      .slice(-6)
      .map((m: { role: string; text: string }) => `${m.role === 'user' ? 'Friend' : 'Indus'}: ${m.text}`)
      .join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${formattedHistory}\nFriend: ${question}\nIndus:`,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    res.json({
      answer:
        response.text ||
        "Honestly? Trust the pattern over the potential. You already know what the schedule says.",
    });
  } catch (err: any) {
    res.json({
      answer:
        "Here's my honest read: don't over-explain yourself in a three-paragraph text. Step back, let the silence sit for a beat, and pay attention to what they actually initiate.",
    });
  }
});

function generateFallbackConspiracy(hotTake: string, p1: string, p2: string, relationshipType: string) {
  const isNocturnal = hotTake.toLowerCase().includes('2am') || hotTake.toLowerCase().includes('night') || hotTake.toLowerCase().includes('midnight');
  const isGhosting = hotTake.toLowerCase().includes('disappear') || hotTake.toLowerCase().includes('gap') || hotTake.toLowerCase().includes('reply') || hotTake.toLowerCase().includes('hours');
  
  if (isNocturnal) {
    return {
      conspiracyTitle: `Operation Moonlight Alibi: The Nocturnal Diplomacy Protocol`,
      theory: `Here is the deeper game neither of you will put on the record: daytime texting represents real-world integration, which requires stakes and social accountability. Late-night texting, however, exists in an offshore emotional tax haven where promises don't carry compound interest.\n\n${p1} uses midnight warmth as proof of underlying chemistry, while ${p2} treats nighttime enthusiasm as an interest payment to keep the connection active without ever having to schedule brunch during daylight hours.`,
      evidencePoints: [
        `The Time Paradox: 70% of high-vulnerability disclosures happen after 11:30 PM, but zero daytime calendar invites are confirmed during the same week.`,
        `The Plausible Deniability Cloak: Every intense late-night exchange can conveniently be retroactively excused as "sorry was just delirious and tired lol" if daylight stakes get too high.`,
        `The Silence Re-entry: The following morning invariably begins with a generic meme or neutral check-in to reset emotional temperature back to room level.`
      ],
      uncomfortableTruth: `You both pretend you're nocturnal soulmates because acknowledging daylight incompatibility would force a decision neither wants to make.`
    };
  }

  if (isGhosting) {
    return {
      conspiracyTitle: `The Tactical Latency Initiative: Emotional Standoff Theory`,
      theory: `Nobody is actually "too busy" for 18 consecutive hours—everyone looks at their phone between unlock screens 96 times a day. The prolonged reply gap isn't negligence; it's a calibrated psychological poker move designed to reset power dynamics.\n\n${p2} holds off replying until the exact moment ${p1}'s anxiety transitions into detachment, then drops a charming one-liner to pull them right back into the queue. It's a closed feedback loop of anticipation and validation.`,
      evidencePoints: [
        `The Re-Engagement Hook: After long silences, replies rarely answer the original question directly; they pivot with an inside joke or flattering tangent.`,
        `The Double-Text Deterrent: ${p1} has learned to hoard follow-up thoughts because previous double-texts were met with even longer latency penalties.`,
        `Social Media Interleaving: Active presence on other apps during the silence period confirms the delay is communicative, not logistical.`
      ],
      uncomfortableTruth: `The person who waits 4 hours to reply isn't busy; they're spending 3 hours and 58 minutes thinking about when to reply.`
    };
  }

  return {
    conspiracyTitle: `Operation Mutual Plausible Deniability: The ${p1} & ${p2} Files`,
    theory: `Neither of you is actually confused about where this ${relationshipType} stands. You are both running an unspoken psychological hedge to avoid the risk of rejection.\n\n${p1} pretends that framing requests as "totally no pressure either way!" preserves independence, while ${p2} uses agreeable ambiguity to maintain access to emotional intimacy without signing any relationship contract. You've both secretly agreed that living in purgatory is more comfortable than having an uncomfortable 10-minute honest conversation.`,
    evidencePoints: [
      `The Softened Mandate: Direct questions are followed within 60 seconds by self-sabotaging buffer clauses ("or whenever honestly!", "no worries at all!").`,
      `The Asymmetric Labor Trap: One party coordinates logistics, remembers milestones, and monitors energy, while the other simply shows up and acts charming.`,
      `The Shared Delusion: Both participants tell their respective friends completely conflicting versions of what this dynamic actually is.`
    ],
    uncomfortableTruth: `You aren't waiting for clarity; you're waiting for the other person to be the one who takes the emotional hit first.`
  };
}

app.post('/api/hot-take-deep-dive', async (req, res) => {
  const { reportId, hotTake } = req.body;
  const stored = reportsStore.get(reportId) || PREBUILT_SAMPLE_REPORT;

  if (!hotTake) {
    res.status(400).json({ error: 'hotTake is required' });
    return;
  }

  const p1 = stored.stats?.participants?.[0]?.name || 'Person A';
  const p2 = stored.stats?.participants?.[1]?.name || 'Person B';
  const relType = stored.relationshipType || 'Relationship';

  try {
    const ai = getGenAIClient();
    if (!ai) {
      res.json(generateFallbackConspiracy(hotTake, p1, p2, relType));
      return;
    }

    const systemInstruction = `You are Whatarewe (the signature voice of "Indus" — the razor-sharp, emotionally brilliant friend who analyzes chats like a CIA profiler).
You are expanding on a spicy Hot Take from a relationship analysis report.

Context of this chat:
- Relationship Dynamic: ${relType}
- Participants: ${p1} and ${p2}
- Total Messages: ${stored.stats?.totalMessages || 500}
- Longest Silence: ${stored.stats?.longestSilenceHours || 24} hours
- Key theme: ${stored.report?.headline || 'Complex subtext and shifting pacing'}

Analyze this specific Hot Take:
"${hotTake}"

Generate a hilarious, razor-sharp, deeply psychological "CONSPIRACY THEORY / DEEP DIVE" examining the secret psychological game, subconscious motives, and unspoken agreements operating under the surface.

Return valid JSON with this exact schema:
{
  "conspiracyTitle": "A catchy, classified-dossier title (e.g. 'Operation Daylight Deflection' or 'The 11:42 PM Tax Haven')",
  "theory": "2 to 3 punchy, evocative paragraphs revealing what is REALLY going on between ${p1} and ${p2}. Ground your analysis in behavioral psychology, texting patterns, and their dynamic. Sound like a brilliantly observant friend breaking down the hidden truth.",
  "evidencePoints": [
    "Exhibit A with a specific behavioral indicator or texting habit citation",
    "Exhibit B detailing the psychological payoff for both participants",
    "Exhibit C revealing the unwritten rule they both obey"
  ],
  "uncomfortableTruth": "One single devastating, witty, crystallizing sentence stating what both people know but neither will dare to text."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Produce the classified deep-dive conspiracy dossier for this Hot Take:\n"${hotTake}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.85,
      },
    });

    let data;
    try {
      data = JSON.parse(response.text?.trim() || '{}');
    } catch {
      data = generateFallbackConspiracy(hotTake, p1, p2, relType);
    }

    if (!data.conspiracyTitle || !data.theory || !data.evidencePoints) {
      data = generateFallbackConspiracy(hotTake, p1, p2, relType);
    }

    res.json(data);
  } catch (err: any) {
    res.json(generateFallbackConspiracy(hotTake, p1, p2, relType));
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Indus server listening on http://localhost:${PORT}`);
  });
}

startServer();
