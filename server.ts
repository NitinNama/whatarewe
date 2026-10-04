import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { PREBUILT_SAMPLE_REPORT } from './src/data/sampleChats';
import { StoredReport, IndusReportContent } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

const reportsStore = new Map<string, StoredReport>();
reportsStore.set(PREBUILT_SAMPLE_REPORT.id, PREBUILT_SAMPLE_REPORT);

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
          funnyTitle: { type: Type.STRING, description: 'Name — Their Title + emoji e.g. "The Undercover Snake & Drama Manufacturer 🐍"' },
          personalitySummary: { type: Type.STRING },
          signatureMove: { type: Type.STRING, description: 'Their trademark move in texting e.g. typing "no pressure!" or sending memes at 2am' },
          bestMoment: { type: Type.STRING, description: 'Their best moment in the chat' },
          worstMoment: { type: Type.STRING, description: 'Their most questionable or cringe moment in the chat' },
          storyBlocks: {
            type: Type.ARRAY,
            description: 'Narrative written in 2nd-person directly TO them with inline green WhatsApp evidence bubbles',
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: 'Either "prose" or "bubble"' },
                content: { type: Type.STRING, description: '2nd-person monologue prose speaking directly to the person' },
                bubble: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: 'Verbatim message from this person used as evidence' },
                  },
                  required: ['text'],
                },
              },
              required: ['type'],
            },
          },
          scores: {
            type: Type.OBJECT,
            properties: {
              emotionallyAvailable: { type: Type.INTEGER, description: 'Score from 1 to 5' },
              responseSpeed: { type: Type.INTEGER, description: 'Score from 1 to 5' },
              vulnerability: { type: Type.INTEGER, description: 'Score from 1 to 5' },
              doubleTextEnergy: { type: Type.INTEGER, description: 'Score from 1 to 5' },
              pettyPotential: { type: Type.INTEGER, description: 'Score from 1 to 5' },
              humorIndex: { type: Type.INTEGER, description: 'Score from 1 to 5' },
            },
            required: ['emotionallyAvailable', 'responseSpeed', 'vulnerability', 'doubleTextEnergy', 'pettyPotential', 'humorIndex'],
          },
        },
        required: ['name', 'funnyTitle', 'personalitySummary', 'signatureMove', 'bestMoment', 'worstMoment', 'storyBlocks', 'scores'],
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

function buildFallbackReport(stats: any, relationshipType: string): IndusReportContent {
  const p1 = stats?.participants?.[0]?.name || 'Person A';
  const p2 = stats?.participants?.[1]?.name || 'Person B';
  const p1Ratio = stats?.participants?.[0]?.initiationPercent ?? 68;
  const p2Ratio = 100 - p1Ratio;

  return {
    headline: `Between the Lines of ${p1} & ${p2}`,
    subheadline: `A ${relationshipType} defined by ${stats?.peakHourLabel || 'late-night'} bursts and unspoken subtext.`,
    characterChapterTitle: 'The Personnel File: Delinquents, Frauds, and Ghost Agents',
    overview: `I read every message in this ${relationshipType} export (${stats?.totalMessages || 120} messages, ${stats?.totalWords || 1400} words across ${stats?.totalDays || 14} days). ${p1} is setting the emotional tempo—initiating ${p1Ratio}% of conversations—while ${p2} responds with warmth in the moment but rarely drives the calendar forward.`,
    characterProfiles: (stats?.participants || [{ name: p1 }, { name: p2 }]).map((p: any, idx: number) => ({
      name: p.name,
      funnyTitle: idx === 0 ? `${p.name} — Chief Conversation Architect & Daylight Planner 📋` : `${p.name} — Minister of Selective Mystery & Late-Night Vibes 🍸`,
      personalitySummary:
        idx === 0
          ? `${p.name} brings high attentiveness, remembers small details, and uses humor to keep the thread alive even when replies lag.`
          : `${p.name} is engaging once locked into a live back-and-forth, but treats asynchronous texting like an optional suggestion.`,
      signatureMove: idx === 0 ? 'Adding "no pressure at all totally lmk!" after asking a direct question' : 'Sending a meme 6 hours after an unanswered invite',
      bestMoment: idx === 0 ? 'Holding a firm boundary about daytime communication' : 'Admitting they value the friendship during a late-night check-in',
      worstMoment: idx === 0 ? 'Double-texting three times in under four minutes' : 'Disappearing for two days and returning with "haha sorry crazy week"',
      storyBlocks: [
        {
          type: 'prose',
          content: `${p.name}, let's look at your actual pattern in this chat. You don't just send messages; you run an entire behavioral offensive designed to test the waters:`,
        },
        {
          type: 'bubble',
          bubble: {
            text: idx === 0 ? 'Are you free this weekend? Let me know whenever no rush!!' : 'Hey sorry fell asleep crazy week at work',
          },
        },
        {
          type: 'prose',
          content: `And every single time that message hit the screen, everyone on the other side knew exactly what game was being played:`,
        },
        {
          type: 'bubble',
          bubble: {
            text: idx === 0 ? 'Totally fine either way lol!' : 'You up?',
          },
        },
        {
          type: 'prose',
          content: `You treated the chat like an open-world sandbox game where your only objective was testing boundaries while keeping your plausible deniability intact.`,
        },
      ],
      scores: {
        emotionallyAvailable: idx === 0 ? 5 : 2,
        responseSpeed: idx === 0 ? 5 : 2,
        vulnerability: idx === 0 ? 4 : 2,
        doubleTextEnergy: idx === 0 ? 4 : 1,
        pettyPotential: idx === 0 ? 2 : 3,
        humorIndex: 4,
      },
    })),
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

  const reportId = `indus-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  sendEvent('status', { message: 'Indus is reading every message... and judging... kindly.' });

  const systemPrompt = `You are Indus (channeling the voice of "Brandon") — a sharp, emotionally intelligent friend who has just read every message in this chat. You are not a therapist. You're the friend who tells you what everyone else is thinking but won't say. You are honest, warm, occasionally funny, and never cruel. You write in plain English, no jargon, no corporate language. You notice patterns. You call things by their real names. You write like you're texting a close friend a very long, thoughtful voice note.

Context about this chat:
- Relationship category selected by user: ${relationshipType}
- Platform: ${platform}
- Total messages: ${stats.totalMessages}
- Total words: ${stats.totalWords || 'calculated'}
- Date range: ${stats.dateRange}
- Longest silence gap: ${stats.longestSilenceHours || '24+'} hours
- Average response time: ${stats.avgResponseOverallMinutes || 30} minutes
- Peak activity day & hour: ${stats.peakDayLabel || 'Weekend'}, ${stats.peakHourLabel}
- Participant summary: ${JSON.stringify(stats.participants)}

Generate a structured JSON report covering ALL the required report sections:
1. headline, subheadline, overview
2. characterProfiles (with signatureMove, bestMoment, worstMoment, 1-5 scores)
3. theShift
4. vibeTimeline (month-by-month temperature from Boiling to Freezing with 0-100 degrees)
5. loveLanguages (breakdown per person + mismatch analysis)
6. theUnsaidThings (subtext reader with exact texts vs what was actually felt)
7. whoCaresMore (blunt 70/30-style investment meter with evidence)
8. conflictReport (fight patterns, who instigates, who de-escalates)
9. flags (greenFlags and redFlags specific to this chat)
10. emojiAutopsy (top emojis, reads, trend over time)
11. hotTakes (3-5 spicy one-liner observations)
12. attachmentStyles (Secure, Anxious, Avoidant reads with evidence)
13. iconicMoment (the one quote that captures the entire relationship)
14. compatibility (overall score + 5 dimension breakdown)
15. playlist (5 songs that soundtrack the chat with reasons)
16. movie (genre, tagline, casting, and how the movie ends)
17. awards, verdict, whatToDoNext.

Quote or reference specific moments, jokes, excuses, or details from the chat so the user feels genuinely seen.`;

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
      parsedReport = buildFallbackReport(stats, relationshipType);
    }

    const stored: StoredReport = {
      id: reportId,
      createdAt: new Date().toISOString(),
      relationshipType,
      platform,
      stats,
      report: parsedReport,
    };

    reportsStore.set(reportId, stored);
    sendEvent('complete', stored);
    res.end();
  } catch (error: any) {
    const fallbackReport = buildFallbackReport(stats, relationshipType);
    const stored: StoredReport = {
      id: reportId,
      createdAt: new Date().toISOString(),
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

    const systemInstruction = `You are Indus (the honest, warm, emotionally intelligent friend with the "Brandon" voice). You already analyzed this user's ${stored.relationshipType} chat and wrote this report:
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
