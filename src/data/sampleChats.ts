import { StoredReport } from '../types';

export const SAMPLE_CHAT_EXPORTS: Record<
  string,
  { label: string; type: string; platform: 'whatsapp' | 'imessage'; rawText: string }
> = {
  situationship: {
    label: 'The 7-Month Situationship (Maya & Julian)',
    type: 'Situationship 🌀',
    platform: 'whatsapp',
    rawText: `[01/12/26, 11:42:10 PM] Maya: Wait are you still at the gallery opening or did you guys leave already?
[01/12/26, 11:44:02 PM] Julian: Just stepped outside for air, come through if you're nearby
[01/12/26, 11:45:19 PM] Maya: Leaving Soho now, give me 15 mins!!
[01/13/26, 10:15:30 AM] Maya: Yesterday was so fun lol I still can't believe your friend tried to buy the display table
[01/13/26, 12:48:11 PM] Julian: Hahaha yeah Sam is unhinged after two mezcal negronis
[01/13/26, 12:49:05 PM] Maya: Are you free Thursday night? There's that screening at Metrograph I told you about
[01/13/26, 04:12:44 PM] Julian: Thursday might be tough with this pitch deck deadline, let me play it by ear?
[01/13/26, 04:14:10 PM] Maya: Totally! No rush at all just lmk whenever 🤍
[02/04/26, 09:20:15 PM] Maya: Hey stranger, how did the Berlin presentation go??
[02/04/26, 09:22:40 PM] Maya: Also I walked past that bakery with the cardamom buns and thought of you
[02/05/26, 01:15:09 AM] Julian: Survived it barely. Exhausted. You up?
[02/05/26, 01:16:22 AM] Maya: Just finishing a chapter, yeah why?
[02/05/26, 01:18:50 AM] Julian: Heading back to my place in Williamsburg, come over?
[02/18/26, 06:30:00 PM] Maya: Hey! My friends are doing dinner for my birthday next Saturday at 8, would love for you to come if you're around
[02/19/26, 11:05:12 AM] Julian: Ah man I might have to be in Boston that weekend for family stuff, let me check the train schedule and get back to you
[02/19/26, 11:07:45 AM] Maya: Oh okay! Hopefully you can make it, everyone keeps asking if you actually exist 😂
[03/08/26, 08:10:12 PM] Maya: Have you seen your jacket? You left the olive corduroy one here last week
[03/08/26, 11:54:30 PM] Julian: Keep it warm for me, crazy week at the studio
[03/09/26, 12:01:15 AM] Maya: Julian I feel like we only ever hang out after 11pm lately. Like I genuinely really like spending time with you but I'm getting a little confused about what we're doing here?
[03/09/26, 12:03:02 AM] Maya: Not trying to make it heavy over text, I just value being honest with you
[03/09/26, 02:40:18 PM] Julian: Hey sorry fell asleep early last night. I really value our time together too Maya, honestly my head is just completely underwater with the studio launch right now and I don't feel like I can give anyone the bandwidth they deserve
[03/09/26, 02:45:09 PM] Maya: I get that work is crazy, I guess it just feels like you have bandwidth when it's convenient at 1am on a Tuesday though?
[03/09/26, 08:19:55 PM] Julian: That's fair. I'm really not trying to string you along, you mean a lot to me. Let's grab proper dinner this week and talk in person?`,
  },
  ex: {
    label: 'The "Checking In" Ex (Chloe & Liam)',
    type: 'Ex 💔',
    platform: 'imessage',
    rawText: `[01/20/26, 09:12:00 PM] Liam: Saw that Pho place on 4th street finally reopened and immediately thought of you. Hope you've been well Chloe.
[01/20/26, 10:04:15 PM] Chloe: Aw wait no way! Did they keep the same laminated menus? Hope you're doing good too Liam.
[01/20/26, 10:06:40 PM] Liam: Literally the exact same menus with the typo on #14 😭 How's the new apartment treating you?
[01/20/26, 10:18:12 PM] Chloe: Loving the sunlight, hating the 4th floor walkup lol. How's your sister's dog?
[02/14/26, 11:58:02 PM] Liam: Listening to that Khruangbin vinyl we bought in Montreal. Weird not talking to you every day.
[02/15/26, 09:30:10 AM] Chloe: Liam you were the one who said you needed space to figure out if you wanted to move to Chicago remember?
[02/15/26, 09:42:55 AM] Liam: I know. And I stand by needing to figure my career out, it just doesn't mean I stopped missing my best friend.
[02/15/26, 10:01:20 AM] Chloe: It makes it really hard for me to move on when you text me nostalgic stuff late at night every three weeks.
[03/10/26, 05:15:40 PM] Liam: Hey, I still have two boxes of your winter coats and your espresso machine in my storage unit. I can drop them by Saturday?
[03/10/26, 05:18:02 PM] Liam: Maybe we could grab a quick coffee when I drop them off? No pressure at all.`,
  },
  groupchat: {
    label: 'The Delusional Trip-Planning Group (Boys Group)',
    type: 'Boys group 🐐',
    platform: 'whatsapp',
    rawText: `[02/01/26, 01:15:00 PM] Marcus: Gentlemen. Lisbon & Lagos in June. Found flights for $540 roundtrip if we book by Friday. Drop a 👍 if you're 100% locked in.
[02/01/26, 01:16:12 PM] Devon: Locked. Putting PTO in right now.
[02/01/26, 01:17:45 PM] Leo: 1000% in, nothing stopping me this year
[02/01/26, 04:50:11 PM] Tariq: Wait which weekend in June? My cousin might have a graduation party
[02/01/26, 04:52:00 PM] Marcus: Tariq your cousin is 14, he's graduating middle school. Book the flight.
[02/10/26, 06:20:00 PM] Marcus: Update: Flights are now $690 because nobody sent me their passport numbers on Friday.
[02/10/26, 06:21:05 PM] Marcus: I made a Google Sheet with 4 Airbnb options with a pool. Please vote by tonight.
[02/10/26, 09:12:33 PM] Leo: Option 2 goes crazy 🔥🔥
[02/10/26, 09:14:00 PM] Marcus: Leo you didn't even open the link, Option 2 is the rental car tab.
[03/02/26, 11:05:19 AM] Devon: Boys don't kill me... Sarah just reminded me we have a wedding in Vermont June 14th.`,
  },
};

export const PREBUILT_SAMPLE_REPORT: StoredReport = {
  id: 'maya-julian-sample',
  createdAt: '2026-10-04T06:00:00.000Z',
  relationshipType: 'Situationship 🌀',
  platform: 'whatsapp',
  isSample: true,
  stats: {
    totalMessages: 1842,
    totalWords: 26270,
    totalDays: 84,
    dateRange: 'Jan 12, 2026 – Apr 05, 2026',
    platform: 'whatsapp',
    peakHourLabel: '11 PM – 1 AM',
    peakDayLabel: 'Friday',
    longestSilenceHours: 74.5,
    avgResponseOverallMinutes: 48,
    lateNightPercent: 46,
    participants: [
      {
        name: 'Maya',
        messageCount: 1124,
        wordCount: 19450,
        avgLengthWords: 17.3,
        initiationCount: 41,
        initiationPercent: 72,
        avgReplyMinutes: 6,
        doubleTextCount: 38,
        topEmojis: [
          { emoji: '🤍', count: 64 },
          { emoji: '😂', count: 51 },
          { emoji: '😭', count: 29 },
          { emoji: '✨', count: 18 },
          { emoji: '☕', count: 14 },
        ],
        questionCount: 214,
      },
      {
        name: 'Julian',
        messageCount: 718,
        wordCount: 6820,
        avgLengthWords: 9.5,
        initiationCount: 16,
        initiationPercent: 28,
        avgReplyMinutes: 84,
        doubleTextCount: 5,
        topEmojis: [
          { emoji: '🔥', count: 19 },
          { emoji: '🙏', count: 12 },
          { emoji: '😅', count: 9 },
          { emoji: '🥃', count: 7 },
          { emoji: '👀', count: 6 },
        ],
        questionCount: 62,
      },
    ],
    hourlyDistribution: [
      { hour: '12a–4a', count: 490 },
      { hour: '4a–8a', count: 28 },
      { hour: '8a–12p', count: 210 },
      { hour: '12p–4p', count: 315 },
      { hour: '4p–8p', count: 279 },
      { hour: '8p–12a', count: 520 },
    ],
    dayOfWeekDistribution: [
      { day: 'Sun', count: 260 },
      { day: 'Mon', count: 140 },
      { day: 'Tue', count: 190 },
      { day: 'Wed', count: 220 },
      { day: 'Thu', count: 310 },
      { day: 'Fri', count: 412 },
      { day: 'Sat', count: 310 },
    ],
    monthlyTimeline: [
      { month: 'Jan 2026', count: 780, avgReplyMinutes: 18 },
      { month: 'Feb 2026', count: 640, avgReplyMinutes: 52 },
      { month: 'Mar 2026', count: 422, avgReplyMinutes: 114 },
    ],
    activeDaysCount: 71,
    recordDay: { date: 'Jan 13, 2026', count: 186 },
    longestStreakDays: 24,
    topSharedWords: [
      { word: 'dinner', count: 74, usedBy: 'Maya' },
      { word: 'studio', count: 68, usedBy: 'Julian' },
      { word: 'weekend', count: 52, usedBy: 'Maya' },
      { word: 'tonight', count: 49, usedBy: 'Both' },
      { word: 'sorry', count: 44, usedBy: 'Julian' },
      { word: 'tomorrow', count: 39, usedBy: 'Both' },
      { word: 'around', count: 35, usedBy: 'Maya' },
      { word: 'exhausted', count: 31, usedBy: 'Julian' },
    ],
    heatmapDays: Array.from({ length: 112 }, (_, i) => {
      const level = (i % 7 === 5 || i % 7 === 6 || (i > 20 && i < 45 && i % 3 === 0)) ? (i % 4) + 1 : (i % 2 === 0 ? 1 : 0);
      return {
        date: `2026-0${Math.floor(i / 30) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
        dayOfWeek: i % 7,
        weekIndex: Math.floor(i / 7),
        count: level * 8,
        level,
      };
    }),
  },
  report: {
    headline: 'A Daylight Girl Stuck in a Midnight Lease',
    subheadline: 'Maya is building a shared life in the margins of Julian’s Google Calendar.',
    characterChapterTitle: 'The Personnel File: Delinquents, Frauds, and Ghost Agents',
    overview:
      "I read all 1,842 messages, and I need you to take a deep breath before you read this: Maya, you are acting as the full-time social director, emotional anchor, and chief archivist of a relationship that Julian treats like a late-night speakeasy. There is genuine chemistry here—when the two of you are actually in the same room, the banter is sharp and warm—but look at the architecture of how you talk. Maya plans five days ahead with movie screenings and birthday dinners; Julian operates strictly in 45-minute increments after 11:00 PM.",
    characterProfiles: [
      {
        name: 'Maya',
        funnyTitle: 'Minister of Daylight Logistics & Preemptive Apologies 📋',
        personalitySummary:
          'Warm, attentive, and chronically preemptive with her own disappointment. Maya treats coordination like an Olympic sport, cushioning every basic human request so the other person never feels cornered.',
        signatureMove: 'Following a vulnerable question with "totally fine either way lol no pressure!!"',
        bestMoment: 'Her March 9th midnight confrontation calling out the convenient 1:00 AM pattern with zero apology.',
        worstMoment: 'Accepting the "let me check train schedules" excuse on February 19th and pretending she wasn’t hurt.',
        storyBlocks: [
          {
            type: 'prose',
            content: 'Maya, you are the most dangerous archetype in modern dating: the hyper-competent social architect who preemptively apologizes for existing. For three straight months, every time you asked for a basic plan in the daylight, you immediately disarmed yourself before he could even reply:',
          },
          {
            type: 'bubble',
            bubble: {
              text: 'Are you free Thursday night? There\'s that screening at Metrograph I told you about',
            },
          },
          {
            type: 'prose',
            content: 'And before he even had 90 seconds to check his schedule, you threw in the safety net so he wouldn\'t feel any obligation whatsoever:',
          },
          {
            type: 'bubble',
            bubble: {
              text: 'Totally! No rush at all just lmk whenever 🤍',
            },
          },
          {
            type: 'bubble',
            bubble: {
              text: 'Everyone keeps asking if you actually exist 😂',
            },
          },
          {
            type: 'prose',
            content: 'You didn\'t treat this connection as a mutual partnership; you treated it like a delicate hostage negotiation where your own standards were the ransom.',
          },
        ],
        scores: {
          emotionallyAvailable: 5,
          responseSpeed: 5,
          vulnerability: 4,
          doubleTextEnergy: 5,
          pettyPotential: 2,
          humorIndex: 4,
        },
      },
      {
        name: 'Julian',
        funnyTitle: 'CEO of "Let Me Play It By Ear" & Nocturnal Speakeasies 🍸',
        personalitySummary:
          'Charismatic, chronically "underwater with the studio launch," and allergic to calendar invites beyond a 6-hour horizon. He treats work exhaustion as a diplomatic immunity card whenever commitment enters the chat.',
        signatureMove: 'Sending "You up?" between 12:45 AM and 1:30 AM from the back of an Uber in Williamsburg.',
        bestMoment: 'Immediately admitting "That\'s fair. I\'m really not trying to string you along" once called out.',
        worstMoment: 'Leaving his olive corduroy jacket at her apartment like an emotional collateral deposit.',
        storyBlocks: [
          {
            type: 'prose',
            content: 'Julian, you are the classic evasive nomad: a man who claims he has zero bandwidth for a 7:30 PM dinner on a Tuesday, yet miraculously experiences a full energetic resurrection the moment the clock strikes 11:45 PM.',
          },
          {
            type: 'bubble',
            bubble: {
              text: 'Thursday might be tough with this pitch deck deadline, let me play it by ear?',
            },
          },
          {
            type: 'prose',
            content: 'And then, like clockwork, after 18 hours of silence, the nocturnal check-in drops from the back of an Uber:',
          },
          {
            type: 'bubble',
            bubble: {
              text: 'Survived it barely. Exhausted. You up?',
            },
          },
          {
            type: 'bubble',
            bubble: {
              text: 'Heading back to my place in Williamsburg, come over?',
            },
          },
          {
            type: 'bubble',
            bubble: {
              text: 'Keep it warm for me, crazy week at the studio',
            },
          },
          {
            type: 'prose',
            content: 'You don\'t want to lose her company, but you want to keep it at the exact clearance-rack price point of a 1:00 AM Uber. The schedule doesn\'t lie, Julian.',
          },
        ],
        scores: {
          emotionallyAvailable: 2,
          responseSpeed: 2,
          vulnerability: 2,
          doubleTextEnergy: 1,
          pettyPotential: 3,
          humorIndex: 4,
        },
      },
    ],
    theShift: {
      period: 'Mid-February 2026 (The Birthday Dinner Invite)',
      headline: 'The Great Calendar Retreat',
      analysis:
        'In January, Julian was replying in 18 minutes and bantering in the middle of the afternoon. The exact inflection point happened around February 18th when Maya invited him to her birthday dinner with her friends. Introducing friends means becoming "real" in daylight. Since that text, Julian’s average reply time slowed by 118%, and 68% of his initiations shifted to after 11:30 PM.',
      metricChange: 'Reply speed dropped from 18m avg → 114m avg (-118%)',
    },
    vibeTimeline: [
      {
        month: 'Jan 2026',
        temperature: 'Boiling 🔥',
        degrees: 88,
        summary: 'Peak dopamine stage. Fast afternoon banter, inside jokes about mezcal negronis, and zero hesitation.',
      },
      {
        month: 'Feb 2026',
        temperature: 'Lukewarm ☁️',
        degrees: 54,
        summary: 'The commitment chill begins after the birthday dinner invite. Reply windows stretch, excuses appear.',
      },
      {
        month: 'Mar 2026',
        temperature: 'Volatile ⚡',
        degrees: 68,
        summary: 'High tension and late-night confrontation over the 1 AM visits, culminating in the proper dinner standoff.',
      },
    ],
    loveLanguages: {
      breakdown: [
        {
          name: 'Maya',
          primaryLanguage: 'Quality Time (Daylight)',
          secondaryLanguage: 'Words of Affirmation',
          expressionScore: 92,
          notes: 'Expresses affection through remembering cardamom buns, planning gallery visits, and gentle verbal care.',
        },
        {
          name: 'Julian',
          primaryLanguage: 'Physical Proximity (Nocturnal)',
          secondaryLanguage: 'Receiving Chill',
          expressionScore: 41,
          notes: 'Wants the comfort of intimacy without the daytime labor of coordinating shared schedules.',
        },
      ],
      mismatchAnalysis:
        'Maya gives love by creating space on her calendar; Julian accepts love by entering that space only when his day is completely empty. Maya interprets Julian’s scheduling hesitation as a lack of affection; Julian interprets Maya’s invites as pressure.',
    },
    theUnsaidThings: {
      subtextAnalysis:
        'A masterclass in high-context emotional diplomacy. Both people know exactly what is happening, but spend 80% of their words maintaining the illusion that work schedules are the only barrier.',
      unspokenThoughts: [
        {
          person: 'Maya',
          whatTheyTexted: 'Totally! No rush at all just lmk whenever 🤍',
          whatTheyActuallyFelt: 'If I act like I do not care whether you show up, maybe you won’t pull away.',
        },
        {
          person: 'Julian',
          whatTheyTexted: 'Let me play it by ear?',
          whatTheyActuallyFelt: 'I want to see if better plans open up, but I want to keep you as my guaranteed safety net.',
        },
        {
          person: 'Maya',
          whatTheyTexted: 'Everyone keeps asking if you actually exist 😂',
          whatTheyActuallyFelt: 'I feel deeply embarrassed that I am investing so much into someone who hides from my friends.',
        },
        {
          person: 'Julian',
          whatTheyTexted: 'Keep the jacket warm for me, crazy week at the studio',
          whatTheyActuallyFelt: 'I am leaving a tangible reason to text you next week without committing to a date.',
        },
      ],
    },
    whoCaresMore: {
      personA: 'Maya',
      personAPercent: 72,
      personB: 'Julian',
      personBPercent: 28,
      evidence: [
        'Maya initiated 72% of all conversations and asked 77% of all follow-up questions.',
        'Maya replied in an average of 6 minutes, compared to Julian’s 84-minute average.',
        'Maya double-texted 38 times to soften silences; Julian double-texted only 5 times.',
      ],
      verdict:
        'Maya is carrying the emotional mortgage on a house Julian is merely subletting on weekends.',
    },
    conflictReport: {
      fightPatterns:
        'Zero direct yelling; maximum passive compliance followed by sudden late-night boundary explosions.',
      whoInstigates: 'Julian instigates through avoidant neglect and slow-rolling replies.',
      whoDeEscalates: 'Maya historically de-escalates with premature apologies ("lol sorry to make it heavy"), though March 9th broke the seal.',
      conflictResolutionStyle:
        'The "Dinner Promise Reset": whenever Maya confronts Julian, Julian avoids defense, validates her feelings, and promises an in-person dinner to reset the clock.',
    },
    flags: {
      greenFlags: [
        'High natural conversational wit and effortless mutual banter in real time.',
        'When Maya directly asserted herself on March 9th, Julian did not gaslight or insult her.',
        'No manipulative name-calling or score-keeping across 1,842 messages.',
      ],
      redFlags: [
        'Chronic 11 PM+ nocturnal gravity (46% of all texts sent in vampire hours).',
        'Systematic evasion of daylight plans involving friends or social integration.',
        'Weaponized work busyness used as an excuse for 84-minute reply delays to simple questions.',
      ],
    },
    emojiAutopsy: {
      overallRead: 'A contrast between Maya’s delicate emotional buffering and Julian’s low-investment reactions.',
      items: [
        {
          emoji: '🤍',
          count: 64,
          userReads: 'Maya’s signature peace-offering emoji. Used whenever she asks a question to make sure she sounds 0% demanding.',
          trendOverTime: 'Used heavily in Jan/Feb, dropped completely in March as frustration peaked.',
        },
        {
          emoji: '🔥',
          count: 19,
          userReads: 'Julian’s minimal-effort acknowledgement. Sent in place of actual sentences when Maya shares something exciting.',
          trendOverTime: 'Steady throughout the entire 3 months.',
        },
        {
          emoji: '😂',
          count: 60,
          userReads: 'Shared nervous-system defense. Both use it to neutralize tense moments and pretend things are lighter than they are.',
          trendOverTime: 'Spikes right before and after awkward scheduling delays.',
        },
      ],
    },
    hotTakes: [
      'Julian is not "bad at texting"—a man with a startup knows how to reply to an email in 90 seconds.',
      'The olive corduroy jacket spent more daytime hours in Maya’s apartment than Julian ever did.',
      'If you have to type "no rush at all" three times in one week, you are rushing someone who does not want to run.',
      'Calling someone at 1:15 AM from an Uber is not romantic spontaneous passion; it is convenience.',
    ],
    attachmentStyles: [
      {
        name: 'Maya',
        style: 'Anxious Preoccupied 🌊',
        evidence: 'Chronically scans the chat for tone shifts, replies within 6 minutes, and cushions boundaries to avoid abandonment.',
        textingBehavior: 'Hyper-responsive, high word count, preemptive apologies, constant questions to maintain contact.',
      },
      {
        name: 'Julian',
        style: 'Dismissive Avoidant 🛡️',
        evidence: 'Pulls away immediately when intimacy scales (the birthday dinner invite), retreats into work identity as a shield.',
        textingBehavior: 'Hypo-responsive, short 9-word average texts, late-night reach-outs when emotional stakes are lowest.',
      },
    ],
    iconicMoment: {
      quoteSnippet: 'Maya: "Julian I feel like we only ever hang out after 11pm lately..."\nJulian: "Hey sorry fell asleep early last night. I really value our time together too Maya, honestly my head is just completely underwater..."',
      context: 'March 9th standoff after Julian left his jacket and disappeared for another crazy studio week.',
      whyItMatters: 'It encapsulates the entire dynamic: Maya speaking clear, grounded emotional reality, and Julian deflecting behind the honorable shield of career exhaustion.',
    },
    compatibility: {
      overallScore: 61,
      dimensions: [
        { dimension: 'Humor & Banter Alignment', score: 91 },
        { dimension: 'Emotional Pacing & Availability', score: 32 },
        { dimension: 'Texting Rhythm Synchronicity', score: 44 },
        { dimension: 'Conflict Repair & Maturity', score: 71 },
        { dimension: 'Long-term Trajectory Match', score: 38 },
      ],
      summary:
        'A 9/10 comedy duo with a 3/10 calendar alignment. They have effortless chemistry in conversation, but fundamentally incompatible timelines for what a relationship should cost in daylight.',
    },
    playlist: [
      {
        title: 'Marvins Room',
        artist: 'Drake',
        reason: 'For Julian’s recurring 1:15 AM "You up?" texts from the Williamsburg Bridge.',
      },
      {
        title: 'Motion Sickness',
        artist: 'Phoebe Bridgers',
        reason: 'For Maya giving 72% of the effort while pretending she’s cool with playing it by ear.',
      },
      {
        title: 'Supercut',
        artist: 'Lorde',
        reason: 'For the idealized version of them in Soho galleries that only lives in Maya’s head.',
      },
      {
        title: 'Cardigan',
        artist: 'Taylor Swift',
        reason: 'Dedicated to the olive corduroy jacket held hostage in Maya’s closet.',
      },
      {
        title: 'Hard to Explain',
        artist: 'The Strokes',
        reason: 'The official soundtrack to Julian’s vague "underwater with pitch decks" explanations.',
      },
    ],
    movie: {
      genre: 'Sundance Romantic Dramedy / Mumblecore Standoff',
      tagline: 'Two people who look great under gallery lights, but terrible on a Tuesday afternoon.',
      casting: [
        {
          person: 'Maya',
          actor: 'Greta Lee',
          roleDescription: 'A sharp, self-aware creative director who knows better, but lets herself hope anyway.',
        },
        {
          person: 'Julian',
          actor: 'Paul Mescal',
          roleDescription: 'A handsome, soft-spoken architect who looks tortured whenever anyone asks what he’s doing on Saturday.',
        },
      ],
      plotEnding:
        'They finally go to the 7:30 PM dinner. Julian arrives 20 minutes late with messy hair and genuine apologies. Halfway through the main course, Maya realizes that having his full attention isn’t actually magical—it’s just normal. She leaves first, calls her friends, and leaves his corduroy jacket on the back of the restaurant chair.',
    },
    awards: [
      {
        recipient: 'Maya',
        title: 'The Pre-Emptive Apology Laureate 🏆',
        reason: 'For typing "No pressure at all totally lmk!!" within 90 seconds of asking a completely normal question.',
      },
      {
        recipient: 'Julian',
        title: 'The Vampire Hours Fellowship 🧛',
        reason: 'For miraculous recovery from "studio exhaustion" the exact moment the clock strikes 11:45 PM.',
      },
      {
        recipient: 'The Olive Corduroy Jacket',
        title: 'Most Committed Participant 🧥',
        reason: 'For spending more consecutive daylight hours inside Maya’s apartment in March than Julian did.',
      },
    ],
    verdict:
      "Maya, your March 9th message calling out the 1:00 AM pattern was the healthiest, most grounded thing in this entire transcript—and notice how immediately Julian offered a proper dinner the second you stopped cushioning him. You don't need to dramatize this or block him, but you do need to retire the 'chill girl' safety net. Let him meet you at 7:30 PM in the daylight, or let him keep his jacket at his own place.",
    whatToDoNext: [
      'Hold the line on the dinner he just offered: let him pick the restaurant, the day, and the time before 8:00 PM.',
      'Retire the phrase "no rush at all" from your keyboard for the next 30 days.',
      'Put a quiet 11:00 PM curfew on last-minute hangouts—if it wasn’t planned before dinner, you’re already asleep.',
    ],
  },
};
