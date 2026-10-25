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
    planConversionFunnel: {
      hangoutsProposed: 21,
      initialEnthusiasmPercent: 71,
      dateBudgetAgreedPercent: 24,
      actuallyOccurredPercent: 5,
      actuallyOccurredCount: 1,
      verdict:
        'A 4.7% conversion hit rate. You have better odds of getting a prime table at Carbone without a reservation than getting Julian to confirm a daylight weekend plan.',
      summary:
        'Maya floated 21 distinct outings (Metrograph screenings, bakery runs, gallery openings). Initial responses were 71% enthusiastic ("1000% down!", "Need this!"), but collapsed the instant calendar dates required locking in.',
    },
    ghostingIndex: {
      mostLeftOnReadPerson: 'Maya',
      unansweredCount: 14,
      longestSilenceExhibit: {
        sender: 'Maya',
        timestamp: 'Feb 18, 06:30 PM',
        message:
          'Hey! My friends are doing dinner for my birthday next Saturday at 8, would love for you to come if you\'re around',
        hoursIgnored: 16.5,
      },
      analysis:
        'Julian left Maya’s birthday invitation hanging for 16.5 hours before countering with a speculative "might have to be in Boston for family stuff" non-commitment.',
    },
    nightVsDayPersona: {
      contrasts: [
        {
          name: 'Maya',
          nightMessage: {
            timestamp: '01:16 AM',
            text: 'Just finishing a chapter, yeah why?',
            subtext: 'I was half asleep but I will revive myself for a crumb of your attention.',
          },
          dayMessage: {
            timestamp: '11:07 AM',
            text: 'Oh okay! Hopefully you can make it, everyone keeps asking if you actually exist 😂',
            subtext: 'I am using self-deprecating humor to mask how deeply embarrassing this avoidance is.',
          },
          analysis:
            'Maya plays the effortlessly nonchalant art director by day, saving her unpadded emotional truth for midnight.',
        },
        {
          name: 'Julian',
          nightMessage: {
            timestamp: '02:05 AM',
            text: 'Heading back to my place in Williamsburg, come over?',
            subtext: 'My intimacy barriers drop exclusively between 1:00 AM and sunrise.',
          },
          dayMessage: {
            timestamp: '02:40 PM',
            text: 'Honestly my head is just completely underwater with the studio launch right now',
            subtext: 'I am establishing an impenetrable busy-person defense perimeter before you ask for weekend plans.',
          },
          analysis:
            'Julian exists in two completely separate time zones: a spontaneous midnight romantic and a daytime corporate recluse.',
        },
      ],
      overallInsight:
        'The relationship lives entirely in the twilight zone between 11 PM and 2 AM, completely evaporating when exposed to broad daylight.',
    },
  },
};

export const SAMPLE_REPORT_BOYS_GROUP: StoredReport = {
  id: 'boys-group-sample',
  createdAt: '2026-10-06T12:00:00.000Z',
  relationshipType: 'Boys group 🐐',
  platform: 'whatsapp',
  isSample: true,
  stats: {
    totalMessages: 6410,
    totalWords: 52980,
    totalDays: 140,
    activeDaysCount: 92,
    dateRange: 'Jan 02, 2026 – May 21, 2026',
    platform: 'whatsapp',
    peakHourLabel: '1 PM – 3 PM & 10 PM',
    peakDayLabel: 'Thursday',
    longestSilenceHours: 168.0,
    avgResponseOverallMinutes: 110,
    lateNightPercent: 34,
    participants: [
      {
        name: 'Marcus',
        messageCount: 2310,
        wordCount: 24200,
        avgLengthWords: 10.5,
        initiationCount: 68,
        initiationPercent: 48,
        avgReplyMinutes: 12,
        doubleTextCount: 84,
        topEmojis: [
          { emoji: '💀', count: 120 },
          { emoji: '😭', count: 94 },
          { emoji: '🤦‍♂️', count: 45 },
          { emoji: '✈️', count: 32 },
          { emoji: '📊', count: 21 },
        ],
        questionCount: 380,
      },
      {
        name: 'Devon',
        messageCount: 1680,
        wordCount: 12400,
        avgLengthWords: 7.4,
        initiationCount: 32,
        initiationPercent: 23,
        avgReplyMinutes: 45,
        doubleTextCount: 18,
        topEmojis: [
          { emoji: '🔥', count: 85 },
          { emoji: '🤝', count: 44 },
          { emoji: '👀', count: 39 },
          { emoji: '🍻', count: 28 },
          { emoji: '😬', count: 19 },
        ],
        questionCount: 110,
      },
      {
        name: 'Leo',
        messageCount: 1420,
        wordCount: 9600,
        avgLengthWords: 6.7,
        initiationCount: 25,
        initiationPercent: 18,
        avgReplyMinutes: 92,
        doubleTextCount: 14,
        topEmojis: [
          { emoji: '🔥', count: 140 },
          { emoji: '🐐', count: 68 },
          { emoji: '😂', count: 58 },
          { emoji: '🫡', count: 35 },
          { emoji: '🏎️', count: 18 },
        ],
        questionCount: 75,
      },
      {
        name: 'Tariq',
        messageCount: 1000,
        wordCount: 6780,
        avgLengthWords: 6.8,
        initiationCount: 15,
        initiationPercent: 11,
        avgReplyMinutes: 180,
        doubleTextCount: 6,
        topEmojis: [
          { emoji: '😂', count: 72 },
          { emoji: '💤', count: 38 },
          { emoji: '🎓', count: 22 },
          { emoji: '🤷‍♂️', count: 18 },
          { emoji: '💵', count: 12 },
        ],
        questionCount: 42,
      },
    ],
    recordDay: { date: '2026-02-01', count: 412 },
    longestStreakDays: 34,
    hourlyDistribution: [
      { hour: '00:00', count: 240 },
      { hour: '02:00', count: 80 },
      { hour: '08:00', count: 110 },
      { hour: '10:00', count: 320 },
      { hour: '12:00', count: 650 },
      { hour: '14:00', count: 890 },
      { hour: '16:00', count: 710 },
      { hour: '18:00', count: 620 },
      { hour: '20:00', count: 850 },
      { hour: '22:00', count: 1120 },
    ],
    dayOfWeekDistribution: [
      { day: 'Mon', count: 820 },
      { day: 'Tue', count: 910 },
      { day: 'Wed', count: 1020 },
      { day: 'Thu', count: 1280 },
      { day: 'Fri', count: 1140 },
      { day: 'Sat', count: 680 },
      { day: 'Sun', count: 560 },
    ],
    monthlyTimeline: [
      { month: 'Jan 2026', count: 1420, avgReplyMinutes: 95 },
      { month: 'Feb 2026', count: 2680, avgReplyMinutes: 65 },
      { month: 'Mar 2026', count: 1210, avgReplyMinutes: 140 },
      { month: 'Apr 2026', count: 650, avgReplyMinutes: 190 },
      { month: 'May 2026', count: 450, avgReplyMinutes: 240 },
    ],
    heatmapDays: Array.from({ length: 70 }, (_, i) => ({
      date: `2026-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
      dayOfWeek: i % 7,
      weekIndex: Math.floor(i / 7),
      count: (i * 37) % 115,
      level: ((i * 37) % 115) > 80 ? 4 : ((i * 37) % 115) > 50 ? 3 : ((i * 37) % 115) > 20 ? 2 : 1,
    })),
    topSharedWords: [
      { word: 'flights', count: 118, usedBy: 'Marcus' },
      { word: 'locked', count: 84, usedBy: 'Devon' },
      { word: 'villa', count: 67, usedBy: 'Leo' },
      { word: 'sheet', count: 59, usedBy: 'Marcus' },
      { word: 'maybe', count: 52, usedBy: 'Tariq' },
    ],
  },
  report: {
    headline: 'The Grand Delusion: 4 Airbnb Tabs, 0 Booked Flights, and Devon’s Cousin',
    subheadline: 'A masterclass in high-testosterone group trip enthusiasm systematically defeated by Google Sheets aversion.',
    overview:
      'I read all 6,410 messages in this group. Marcus is functioning as an unpaid travel agency director on the verge of a stress-induced cardiac event. Devon drops instant "1000% locked in" promises before remembering mandatory weddings, Leo votes fire emojis on car rental spreadsheets, and Tariq appears exclusively to ask if middle school graduations conflict with Europe.',
    characterChapterTitle: 'The Personnel Dossier: Unpaid Agents & Logistical Delinquents',
    characterProfiles: [
      {
        name: 'Marcus',
        funnyTitle: 'Marcus — Minister of Emotional Labor & Unpaid Custody 🫂',
        personalitySummary:
          'Marcus treats the group chat like an airport traffic control tower on the brink of total radar failure. He does the math, tracks airfare swings, and slowly watches his sanity leave his body while three adult men pretend they do not possess passports. Every single booking in this thread happened solely because Marcus refused to let group inertia win.',
        signatureMove: 'Pasting the updated flight price with passive-aggressive dollar deltas',
        bestMoment: 'Finding $540 roundtrip flights within 14 minutes of opening Skyscanner',
        worstMoment: 'Typing an all-caps monologue comparing the group to a failing municipal transit board',
        storyBlocks: [
          {
            type: 'prose',
            content: 'Marcus, you have spent 140 days acting as an unpaid Expedia concierge for three adult men who cannot locate their own passport expiry dates:',
          },
          {
            type: 'bubble',
            bubble: { text: 'Update: Flights are now $690 because nobody sent me their passport numbers on Friday.' },
          },
          {
            type: 'prose',
            content: 'And every time you tried to set a hard logistical deadline, the group responded with unconditional enthusiasm and zero financial execution:',
          },
          {
            type: 'bubble',
            bubble: { text: 'I made a Google Sheet with 4 Airbnb options with a pool. Please vote by tonight.' },
          },
          {
            type: 'prose',
            content: 'You did not choose to become the group chaperone; you were drafted into unpaid emotional custody by a committee of logistical delinquents.',
          },
        ],
        scores: {
          emotionallyAvailable: 4,
          responseSpeed: 5,
          vulnerability: 3,
          doubleTextEnergy: 5,
          pettyPotential: 3,
          humorIndex: 4,
        },
      },
      {
        name: 'Devon',
        funnyTitle: 'Devon — Minister of Broken Plans & Theoretical Hangouts 🗓️🚫',
        personalitySummary:
          'Devon possesses an Olympic-level enthusiasm for events that are scheduled at least six weeks in advance, paired with an incurable paralysis the day of. He drops instant "1000% locked in" promises before remembering mandatory weddings and second-cousin obligations. He does not actually hate traveling with the boys; he simply loves the abstract dopamine of trip planning far more than boarding a flight.',
        signatureMove: 'Typing "Locked. Putting PTO in right now" followed three weeks later by a mandatory family conflict',
        bestMoment: 'Hyping the group during the initial Lisbon brainstorm with unmatched golden retriever energy',
        worstMoment: 'Revealing the Vermont wedding conflict three hours after flights jumped by $150',
        storyBlocks: [
          {
            type: 'prose',
            content: 'Devon, your commitment timeline operates strictly in hypothetical parallel dimensions:',
          },
          {
            type: 'bubble',
            bubble: { text: 'Locked. Putting PTO in right now.' },
          },
          {
            type: 'prose',
            content: 'And the moment non-refundable credit card transactions were requested, the sudden scheduling anomaly materialized out of thin air:',
          },
          {
            type: 'bubble',
            bubble: { text: 'Ah man my girl just told me her cousin has that Vermont wedding in June...' },
          },
          {
            type: 'prose',
            content: 'You are the ultimate theoretical adventurer: unbeatable in the group chat brainstorm, utterly missing at the departure terminal.',
          },
        ],
        scores: {
          emotionallyAvailable: 2,
          responseSpeed: 4,
          vulnerability: 2,
          doubleTextEnergy: 1,
          pettyPotential: 4,
          humorIndex: 5,
        },
      },
      {
        name: 'Leo',
        funnyTitle: 'Leo — Minister of Treasury & Financial Evasion 💸📉',
        personalitySummary:
          'Leo treats every shared bill like a diplomatic negotiation between sovereign nations facing severe austerity sanctions. He brings immaculate vibes and zero visual literacy to every proposed itinerary. He is genuinely fond of everyone present, provided Marcus fronts the credit card and nobody asks him to open the rental car spreadsheet tab.',
        signatureMove: 'Reacting with 🔥 to spreadsheets he has not opened while assuming someone else paid the deposit',
        bestMoment: 'Offering to cover the deposit if Marcus fronted the card for 48 hours',
        worstMoment: 'Mistaking a Hertz compact sedan breakdown for an infinity pool ocean villa',
        storyBlocks: [
          {
            type: 'prose',
            content: 'Leo, your confidence in financial and geographical matters is an inspiration to unregulated hedge fund managers everywhere:',
          },
          {
            type: 'bubble',
            bubble: { text: '1000% in, nothing stopping me this year' },
          },
          {
            type: 'prose',
            content: 'And when asked to inspect the carefully constructed cost breakdown, your analytical rigor spoke for itself:',
          },
          {
            type: 'bubble',
            bubble: { text: 'Option 2 goes crazy 🔥🔥 (it was the rental car tab)' },
          },
          {
            type: 'prose',
            content: 'You navigate group travel purely on faith, vibes, and Marcus’s credit limit.',
          },
        ],
        scores: {
          emotionallyAvailable: 3,
          responseSpeed: 3,
          vulnerability: 1,
          doubleTextEnergy: 2,
          pettyPotential: 5,
          humorIndex: 4,
        },
      },
      {
        name: 'Tariq',
        funnyTitle: 'Tariq — Minister of Ghost Protocol & Selective Amnesia 🥷👻',
        personalitySummary:
          'Tariq moves through this group chat like a classified nuclear submarine running in silent mode beneath the Arctic ice cap. He reads every single message, observes every flight price increase, and witnesses every logistical meltdown without leaving a single fingerprint. When he finally emerges after days of radio silence, it is exclusively to ask if a middle school graduation conflicts with Europe.',
        signatureMove: 'Appearing after 200 unread messages exclusively to raise an absurd scheduling objection',
        bestMoment: 'Quietly showing up to the airport with valid luggage when everyone assumed he was ghosting',
        worstMoment: 'Asking if the group can delay the entire Portugal departure because his 14-year-old cousin is finishing 8th grade',
        storyBlocks: [
          {
            type: 'prose',
            content: 'Tariq, you have weaponized the art of silent lurking into an impenetrable personal shield:',
          },
          {
            type: 'bubble',
            bubble: { text: 'Wait which weekend in June? My cousin might have a graduation party' },
          },
          {
            type: 'prose',
            content: 'And after the entire room dismantled your middle school graduation defense, your response was breathtaking:',
          },
          {
            type: 'bubble',
            bubble: { text: '👍' },
          },
          {
            type: 'prose',
            content: 'You are the phantom passenger of this trip: never confirming, never denying, forever lurking on double blue ticks.',
          },
        ],
        scores: {
          emotionallyAvailable: 1,
          responseSpeed: 1,
          vulnerability: 1,
          doubleTextEnergy: 1,
          pettyPotential: 2,
          humorIndex: 4,
        },
      },
    ],
    theShift: {
      period: 'Mid-February 2026',
      headline: 'The $150 Fare Hike & The Vermont Wedding',
      analysis:
        'Once flights jumped from $540 to $690 due to missed deadlines, Devon revealed his girlfriend’s Vermont family wedding, detonating the calendar consensus.',
      metricChange: 'Daily group chat volume plummeted by 76% in two weeks',
    },
    vibeTimeline: [
      { month: 'Jan 2026', temperature: 'Boiling 🔥', degrees: 94, summary: 'Pure optimism, Pinterest villa screenshots.' },
      { month: 'Feb 2026', temperature: 'Volatile ⚡', degrees: 78, summary: 'Google Sheet drop, passport deadline war.' },
      { month: 'Mar 2026', temperature: 'Lukewarm ☁️', degrees: 48, summary: 'Vermont wedding excuse, silent postponements.' },
      { month: 'Apr 2026', temperature: 'Freezing ❄️', degrees: 28, summary: 'Only Instagram memes, zero trip mentions.' },
    ],
    loveLanguages: {
      breakdown: [
        {
          name: 'Marcus',
          primaryLanguage: 'Acts of Service (Spreadsheets)',
          secondaryLanguage: 'Quality Time',
          expressionScore: 92,
          notes: 'Shows love by finding Airbnb coupon codes and organizing rental insurance.',
        },
        {
          name: 'The Rest of the Group',
          primaryLanguage: 'Words of Affirmation (Empty Promises)',
          secondaryLanguage: 'Shared Laughter',
          expressionScore: 40,
          notes: 'Shows love by hyping up plans they secretly know they will never attend.',
        },
      ],
      mismatchAnalysis: 'Marcus operates on Swiss rail logistics; the rest of the group operates on jazz improvisation.',
    },
    theUnsaidThings: {
      subtextAnalysis: 'Everyone wants the group photo in Portugal; nobody wants to actually Venmo Marcus $800 upfront.',
      unspokenThoughts: [
        {
          person: 'Devon',
          whatTheyTexted: ' Sarah just reminded me we have a wedding in Vermont June 14th',
          whatTheyActuallyFelt: 'I cannot afford both Europe and my girlfriend’s summer vacation, and I chose survival.',
        },
        {
          person: 'Marcus',
          whatTheyTexted: 'All good man, let’s look at July then!',
          whatTheyActuallyFelt: 'I am never organizing anything for you clowns ever again.',
        },
      ],
    },
    whoCaresMore: {
      personA: 'Marcus',
      personAPercent: 82,
      personB: 'The Group',
      personBPercent: 18,
      evidence: [
        'Marcus built 4 Google Sheets and 2 Notion boards.',
        'Marcus initiated 48% of messages.',
        'Marcus checked flight prices 6 times a day for 3 weeks.',
      ],
      verdict: 'Marcus is the captain of a ghost ship sailing toward Lisbon.',
    },
    conflictReport: {
      fightPatterns: 'Logistical nudges met with radio silence and meme deflections.',
      whoInstigates: 'Marcus by posting hard deadlines.',
      whoDeEscalates: 'Leo by posting funny reels.',
      conflictResolutionStyle: 'Total collective amnesia until someone suggests Montreal next fall.',
    },
    flags: {
      greenFlags: [
        'Genuine camaraderie and hilarious banter.',
        'Zero malice or genuine spite.',
        'Would defend each other in a bar fight without hesitation.',
      ],
      redFlags: [
        '0% booking follow-through on non-local plans.',
        'Severe inability to look at a calendar before committing.',
      ],
    },
    emojiAutopsy: {
      overallRead: 'A heavy reliance on skulls and tears to deflect from broken promises.',
      items: [
        { emoji: '💀', count: 120, userReads: 'Deflecting genuine embarrassment after missing a payment cutoff.', trendOverTime: 'Spikes every Friday.' },
        { emoji: '🔥', count: 140, userReads: 'Empty hype fuel.', trendOverTime: 'Drops after ticket purchase prompts.' },
      ],
    },
    hotTakes: [
      'Devon knew about the Vermont wedding in November.',
      'Leo still thinks Option 2 had an infinity pool.',
      'The Lisbon trip will eventually happen in 2031 with baby strollers.',
    ],
    attachmentStyles: [
      { name: 'Marcus', style: 'Anxious Preoccupied 🌊', evidence: 'Needs calendar confirmation to feel brotherhood.', textingBehavior: 'Triple-texts with flight screenshots.' },
      { name: 'Devon', style: 'Dismissive Avoidant 🛡️', evidence: 'Blames romantic partner to evade financial commitments.', textingBehavior: 'Disappears for 72 hours when cards are drawn.' },
    ],
    iconicMoment: {
      quoteSnippet: 'Marcus: "Option 2 is the rental car tab."\nLeo: "Still fire though bro"',
      context: 'The exact moment the European dream died.',
      whyItMatters: 'Captures the irreducible essence of male group chat dynamics.',
    },
    compatibility: {
      overallScore: 78,
      dimensions: [
        { dimension: 'Banter & Laughs', score: 98 },
        { dimension: 'Travel Logistics', score: 14 },
        { dimension: 'Financial Accountability', score: 42 },
        { dimension: 'Loyalty in Crisis', score: 94 },
        { dimension: 'Calendar Realism', score: 20 },
      ],
      summary: 'Legendary friends for beers and PlayStation; catastrophic business or travel partners.',
    },
    playlist: [
      { title: 'Stayin’ Alive', artist: 'Bee Gees', reason: 'For Marcus attempting to keep the itinerary pulse beating.' },
      { title: 'Money Trees', artist: 'Kendrick Lamar', reason: 'For everyone dreaming of Portugal on a student budget.' },
      { title: 'Go Your Own Way', artist: 'Fleetwood Mac', reason: 'For Devon going to Vermont instead.' },
      { title: 'Wish You Were Here', artist: 'Pink Floyd', reason: 'For the empty Airbnb in Lisbon.' },
      { title: 'See You Again', artist: 'Wiz Khalifa', reason: 'Until the next delusional group trip proposal.' },
    ],
    movie: {
      genre: 'Buddy Comedy / Financial Absurdism',
      tagline: 'Four passports. Two airlines. One Google Sheet nobody opened.',
      casting: [
        { person: 'Marcus', actor: 'Jonah Hill', roleDescription: 'The exasperated travel agent with an Excel spreadsheet.' },
        { person: 'Leo', actor: 'Glen Powell', roleDescription: 'The charming guy who loves rental car formulas.' },
      ],
      plotEnding: 'The boys end up eating tacos at a local diner 15 minutes from Marcus’s house, having the best time of their lives.',
    },
    awards: [
      { recipient: 'Marcus', title: 'The Unpaid Travel Agent Cross 🎖️', reason: 'For keeping the spreadsheet open for 14 straight weeks.' },
      { recipient: 'Leo', title: 'The Rental Car Enthusiast 🚗', reason: 'For recognizing greatness in vehicle lease terms.' },
    ],
    verdict: 'Stop trying to book Lisbon. Book a cabin four hours away where nobody needs a passport, Marcus can bring a grill, and nobody has to look at Skyscanner.',
    whatToDoNext: [
      'Delete the Lisbon Google Sheet from Google Drive.',
      'Book a weekend lake house cabin with a $50 deposit per person.',
      'Make Devon bring the steaks to make up for Vermont.',
    ],
    planConversionFunnel: {
      hangoutsProposed: 14,
      initialEnthusiasmPercent: 100,
      dateBudgetAgreedPercent: 35,
      actuallyOccurredPercent: 7,
      actuallyOccurredCount: 1,
      verdict:
        'A 7.1% conversion hit rate. Your group follow-through would fail Seed round pitch meetings inside 45 seconds.',
      summary:
        '14 group plans proposed (Lisbon, Vegas, golf trips, paintball). 100% greeted with fire emojis. 1 trip actually happened: bowling on a rainy Thursday.',
    },
    ghostingIndex: {
      mostLeftOnReadPerson: 'Marcus',
      unansweredCount: 38,
      longestSilenceExhibit: {
        sender: 'Marcus',
        timestamp: 'Feb 10, 06:21 PM',
        message: 'I made a Google Sheet with 4 Airbnb options with a pool. Please vote by tonight.',
        hoursIgnored: 52,
      },
      analysis:
        '52 consecutive hours of complete silence from three functioning adults, interrupted only by Leo sending an Instagram clip of a drift car.',
    },
    nightVsDayPersona: {
      contrasts: [
        {
          name: 'Marcus',
          nightMessage: {
            timestamp: '01:30 AM',
            text: 'I honestly just want us to have one trip before everyone starts having kids man',
            subtext: 'I am terrified our friendship group is slowly dissolving into adulthood.',
          },
          dayMessage: {
            timestamp: '11:45 AM',
            text: 'Tickets up another $30. Good job boys.',
            subtext: 'Channeling my fear of growing apart into financial sarcasm.',
          },
          analysis:
            'Marcus uses logistical nagging during the day as a surrogate for how much he actually loves his friends.',
        },
      ],
      overallInsight:
        'Daytime banter masks deep nostalgia for the time when hanging out required zero calendars and zero deposits.',
    },
  },
};

export const SAMPLE_REPORT_EX_CHECKIN: StoredReport = {
  id: 'ex-checkin-sample',
  createdAt: '2026-10-07T15:00:00.000Z',
  relationshipType: 'Ex 💔',
  platform: 'imessage',
  isSample: true,
  stats: {
    totalMessages: 2930,
    totalWords: 34100,
    totalDays: 210,
    activeDaysCount: 78,
    dateRange: 'Aug 10, 2025 – Mar 12, 2026',
    platform: 'imessage',
    peakHourLabel: '10 PM – 12 AM',
    peakDayLabel: 'Sunday',
    longestSilenceHours: 504.0,
    avgResponseOverallMinutes: 180,
    lateNightPercent: 62,
    participants: [
      {
        name: 'Liam',
        messageCount: 1680,
        wordCount: 19800,
        avgLengthWords: 11.8,
        initiationCount: 42,
        initiationPercent: 64,
        avgReplyMinutes: 95,
        doubleTextCount: 29,
        topEmojis: [
          { emoji: '😭', count: 48 },
          { emoji: '🍜', count: 24 },
          { emoji: '🎶', count: 18 },
          { emoji: '☕', count: 15 },
          { emoji: '🤍', count: 12 },
        ],
        questionCount: 142,
      },
      {
        name: 'Chloe',
        messageCount: 1250,
        wordCount: 14300,
        avgLengthWords: 11.4,
        initiationCount: 24,
        initiationPercent: 36,
        avgReplyMinutes: 240,
        doubleTextCount: 8,
        topEmojis: [
          { emoji: '😂', count: 52 },
          { emoji: '🙄', count: 22 },
          { emoji: '📦', count: 16 },
          { emoji: '☀️', count: 14 },
          { emoji: '🙏', count: 10 },
        ],
        questionCount: 65,
      },
    ],
    recordDay: { date: '2026-02-14', count: 88 },
    longestStreakDays: 12,
    hourlyDistribution: [
      { hour: '00:00', count: 310 },
      { hour: '02:00', count: 90 },
      { hour: '08:00', count: 40 },
      { hour: '10:00', count: 120 },
      { hour: '12:00', count: 210 },
      { hour: '14:00', count: 250 },
      { hour: '16:00', count: 280 },
      { hour: '18:00', count: 340 },
      { hour: '20:00', count: 520 },
      { hour: '22:00', count: 770 },
    ],
    dayOfWeekDistribution: [
      { day: 'Mon', count: 240 },
      { day: 'Tue', count: 220 },
      { day: 'Wed', count: 290 },
      { day: 'Thu', count: 310 },
      { day: 'Fri', count: 380 },
      { day: 'Sat', count: 420 },
      { day: 'Sun', count: 1070 },
    ],
    monthlyTimeline: [
      { month: 'Oct 2025', count: 980, avgReplyMinutes: 65 },
      { month: 'Nov 2025', count: 620, avgReplyMinutes: 110 },
      { month: 'Dec 2025', count: 480, avgReplyMinutes: 180 },
      { month: 'Jan 2026', count: 350, avgReplyMinutes: 240 },
      { month: 'Feb 2026', count: 310, avgReplyMinutes: 260 },
      { month: 'Mar 2026', count: 190, avgReplyMinutes: 320 },
    ],
    heatmapDays: Array.from({ length: 70 }, (_, i) => ({
      date: `2026-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
      dayOfWeek: i % 7,
      weekIndex: Math.floor(i / 7),
      count: (i * 29) % 65,
      level: ((i * 29) % 65) > 45 ? 3 : ((i * 29) % 65) > 20 ? 2 : 1,
    })),
    topSharedWords: [
      { word: 'remember', count: 74, usedBy: 'Liam' },
      { word: 'menus', count: 38, usedBy: 'Chloe' },
      { word: 'storage', count: 29, usedBy: 'Liam' },
      { word: 'moving', count: 25, usedBy: 'Chloe' },
      { word: 'vinyl', count: 22, usedBy: 'Liam' },
    ],
  },
  report: {
    headline: 'Nostalgia Breadcrumb Leasing: The 11:58 PM Pho Menu Check-In',
    subheadline: 'A post-breakup purgatory sustained by retained espresso machines and late-night Khruangbin vinyl records.',
    overview:
      'Liam broke up with Chloe to "figure out his career in Chicago," yet texts her every three weeks exclusively on Sunday nights about laminated soup menus and dog breeds. Chloe responds with clear boundaries, yet keeps the thread active to avoid the finality of grief.',
    characterChapterTitle: 'The Personnel Dossier: Ghosts of Relationships Past',
    characterProfiles: [
      {
        name: 'Liam',
        funnyTitle: 'Liam — Minister of Retained Kitchen Appliances & 11:58 PM Vinyl Texts ☕',
        personalitySummary: 'Wants the freedom of single life with the emotional safety net of his ex’s unconditional validation.',
        signatureMove: 'Mentioning old shared restaurants when lonely on Sunday evening',
        bestMoment: 'Admitting he still keeps her winter coat safely stored',
        worstMoment: 'Texting "Weird not talking to you every day" on Valentine’s Day night',
        storyBlocks: [
          {
            type: 'prose',
            content: 'Liam, you chose to terminate the lease on this relationship, yet you continue to squat in Chloe’s notifications:',
          },
          {
            type: 'bubble',
            bubble: { text: 'Listening to that Khruangbin vinyl we bought in Montreal. Weird not talking to you every day.' },
          },
        ],
        scores: {
          emotionallyAvailable: 2,
          responseSpeed: 3,
          vulnerability: 3,
          doubleTextEnergy: 3,
          pettyPotential: 3,
          humorIndex: 4,
        },
      },
      {
        name: 'Chloe',
        funnyTitle: 'Chloe — Boundary Negotiator & 4th-Floor Apartment Survivor 📦',
        personalitySummary: 'Trying her best to heal while navigating unexpected nostalgia landmines dropped into her phone.',
        signatureMove: 'Calling out the exact hypocrisy of his texts with surgical precision',
        bestMoment: 'Reminding him that he was the one who asked for space',
        worstMoment: 'Agreeing to discuss the espresso machine in person',
        storyBlocks: [
          {
            type: 'prose',
            content: 'Chloe, you delivered the single most devastating reality check in the entire archive:',
          },
          {
            type: 'bubble',
            bubble: { text: 'It makes it really hard for me to move on when you text me nostalgic stuff late at night every three weeks.' },
          },
        ],
        scores: {
          emotionallyAvailable: 4,
          responseSpeed: 3,
          vulnerability: 5,
          doubleTextEnergy: 1,
          pettyPotential: 1,
          humorIndex: 4,
        },
      },
    ],
    theShift: {
      period: 'February 15, 2026',
      headline: 'The Post-Valentine’s Confrontation',
      analysis:
        'When Liam dropped late-night sentimental vinyl references on Feb 14th, Chloe officially called out the emotional toll of his intermittent nostalgia drops.',
      metricChange: 'Sunday late-night texts stopped for 24 days',
    },
    vibeTimeline: [
      { month: 'Oct 2025', temperature: 'Warm ☀️', degrees: 68, summary: 'Polite post-breakup logistics.' },
      { month: 'Nov 2025', temperature: 'Lukewarm ☁️', degrees: 45, summary: 'Occasional pet updates.' },
      { month: 'Dec 2025', temperature: 'Freezing ❄️', degrees: 30, summary: 'Holiday radio silence.' },
      { month: 'Jan 2026', temperature: 'Volatile ⚡', degrees: 65, summary: 'Pho restaurant reopening ping.' },
      { month: 'Feb 2026', temperature: 'Boiling 🔥', degrees: 82, summary: 'Valentine vinyl standoff and boundary speech.' },
    ],
    loveLanguages: {
      breakdown: [
        {
          name: 'Liam',
          primaryLanguage: 'Nostalgic Shared Memories',
          secondaryLanguage: 'Physical Presence (Coffee proposals)',
          expressionScore: 70,
          notes: 'Reaches out when feeling disconnected from his own identity.',
        },
        {
          name: 'Chloe',
          primaryLanguage: 'Clean Space & Consistency',
          secondaryLanguage: 'Honest Truth',
          expressionScore: 85,
          notes: 'Wants either full commitment or complete peace.',
        },
      ],
      mismatchAnalysis: 'Liam wants a gentle ghost; Chloe wants a clean break.',
    },
    theUnsaidThings: {
      subtextAnalysis: 'The espresso machine is not about coffee; it is the final tether to her life.',
      unspokenThoughts: [
        {
          person: 'Liam',
          whatTheyTexted: 'I have two boxes of your winter coats and your espresso machine',
          whatTheyActuallyFelt: 'If I give you back these boxes, I have no legitimate reason to ever see you again.',
        },
        {
          person: 'Chloe',
          whatTheyTexted: 'I can drop by Saturday?',
          whatTheyActuallyFelt: 'Please just leave them with the building super so I do not have to look at you.',
        },
      ],
    },
    whoCaresMore: {
      personA: 'Liam (Initiation)',
      personAPercent: 64,
      personB: 'Chloe (Boundaries)',
      personBPercent: 36,
      evidence: [
        'Liam initiates 64% of threads.',
        'Liam sends 85% of his texts after 9:30 PM on Sundays.',
        'Chloe sets the emotional terms and demands space.',
      ],
      verdict: 'Liam misses having someone who knows him; Chloe is doing the hard work of healing.',
    },
    conflictReport: {
      fightPatterns: 'Late-night sentimental outreach followed by daytime boundary defense.',
      whoInstigates: 'Liam with nostalgia triggers.',
      whoDeEscalates: 'Chloe by stating her needs clearly.',
      conflictResolutionStyle: 'Acknowledge, set distance, silence for 3 weeks.',
    },
    flags: {
      greenFlags: ['Deep mutual respect.', 'Honest communication when confronted.'],
      redFlags: ['Using past memories as emotional pacifiers.', 'Delayed exchange of belongings.'],
    },
    emojiAutopsy: {
      overallRead: 'A heavy Sunday-night nostalgia footprint.',
      items: [
        { emoji: '😭', count: 48, userReads: 'Deflecting painful memories into humor.', trendOverTime: 'Constant.' },
        { emoji: '🍜', count: 24, userReads: 'Pho restaurant inside joke.', trendOverTime: 'Spikes in January.' },
      ],
    },
    hotTakes: [
      'He does not miss the relationship; he misses Sunday nights without loneliness.',
      'That espresso machine has been packed in that box since September.',
      'Never accept a coffee invite from an ex holding your winter coat hostage.',
    ],
    attachmentStyles: [
      { name: 'Liam', style: 'Dismissive Avoidant 🛡️', evidence: 'Leaves to pursue autonomy, circles back when lonely.', textingBehavior: 'Late-night nostalgic pings.' },
      { name: 'Chloe', style: 'Secure ⚓', evidence: 'Directly articulates emotional boundaries without cruelty.', textingBehavior: 'Measured daylight responses.' },
    ],
    iconicMoment: {
      quoteSnippet: 'Chloe: "It makes it really hard for me to move on when you text me nostalgic stuff late at night every three weeks."',
      context: 'The definitive boundary drawn on February 15.',
      whyItMatters: 'The moment the situationship breadcrumbing was rendered powerless.',
    },
    compatibility: {
      overallScore: 54,
      dimensions: [
        { dimension: 'History & Chemistry', score: 88 },
        { dimension: 'Timing & Life Goals', score: 28 },
        { dimension: 'Communication Hygiene', score: 48 },
        { dimension: 'Closure Execution', score: 32 },
        { dimension: 'Healing Respect', score: 62 },
      ],
      summary: 'Past partners whose story has ended, but whose closure is still being actively negotiated.',
    },
    playlist: [
      { title: 'Texas Sun', artist: 'Leon Bridges & Khruangbin', reason: 'For the Montreal vinyl memories.' },
      { title: 'Somebody That I Used to Know', artist: 'Gotye', reason: 'For the transition from best friend to stranger.' },
      { title: 'Motion Sickness', artist: 'Phoebe Bridgers', reason: 'For the emotional whiplash of 3-week check-ins.' },
      { title: 'The Night We Met', artist: 'Lord Huron', reason: 'For Sunday midnight regret.' },
      { title: 'Happier', artist: 'Olivia Rodrigo', reason: 'For the eventual clean release.' },
    ],
    movie: {
      genre: 'Autumnal Post-Breakup Drama',
      tagline: 'When is a breakup actually finished?',
      casting: [
        { person: 'Chloe', actor: 'Florence Pugh', roleDescription: 'The architect who wants her apartment and life back.' },
        { person: 'Liam', actor: 'Nicholas Hoult', roleDescription: 'The well-meaning ex who cannot let go of the keys.' },
      ],
      plotEnding: 'Liam drops the boxes with her building doorman on a sunny Tuesday. Chloe brews coffee, unpacks her coats, and doesn’t text.',
    },
    awards: [
      { recipient: 'Chloe', title: 'The Boundary Queen 👑', reason: 'For calling out late-night nostalgic breadcrumbs.' },
      { recipient: 'Liam', title: 'The Espresso Hostage Negotiator ☕', reason: 'For holding coffee equipment for seven consecutive months.' },
    ],
    verdict: 'Have him courier the boxes or leave them with the building concierge. Do not sit down for coffee. Closure is what you give yourself, not what an ex hands you over cold brew.',
    whatToDoNext: [
      'Arrange an indirect handoff for the remaining boxes (doorman or friend).',
      'Mute or archive the thread for 90 days after the belongings are returned.',
      'Treat the Pho restaurant as your place now—order #14 with zero hesitation.',
    ],
    planConversionFunnel: {
      hangoutsProposed: 8,
      initialEnthusiasmPercent: 37,
      dateBudgetAgreedPercent: 12,
      actuallyOccurredPercent: 0,
      actuallyOccurredCount: 0,
      verdict:
        'A 0.0% conversion rate. You are both emotionally smart enough to propose coffee and wise enough to never actually meet.',
      summary:
        '8 tentative coffee or "drop off" meetups proposed over 7 months. Zero have occurred. The espresso machine remains in storage.',
    },
    ghostingIndex: {
      mostLeftOnReadPerson: 'Liam',
      unansweredCount: 16,
      longestSilenceExhibit: {
        sender: 'Liam',
        timestamp: 'Dec 24, 11:15 PM',
        message: 'Merry Christmas Chloe, thinking of you and hoping your family is good 🤍',
        hoursIgnored: 504,
      },
      analysis:
        'A full 21 days (504 hours) of silence from Chloe over the holidays, demonstrating pristine detachment discipline.',
    },
    nightVsDayPersona: {
      contrasts: [
        {
          name: 'Liam',
          nightMessage: {
            timestamp: '11:58 PM',
            text: 'Weird not talking to you every day.',
            subtext: 'I am alone on my couch and seeking instant comfort from the past.',
          },
          dayMessage: {
            timestamp: '05:15 PM',
            text: 'I can drop by Saturday? Maybe we could grab a quick coffee, no pressure.',
            subtext: 'Attempting to disguise late-night emotional weakness as polite daytime logistics.',
          },
          analysis:
            'Nighttime Liam is mournful and sentimental; daytime Liam pretends he is merely returning winter coats like a professional courier.',
        },
      ],
      overallInsight:
        'Late-night texts are attempts to reopen closed doors; daytime messages are polite apologies for trying.',
    },
  },
};

export const ALL_SAMPLE_REPORTS: Record<string, StoredReport> = {
  'maya-julian-sample': PREBUILT_SAMPLE_REPORT,
  'boys-group-sample': SAMPLE_REPORT_BOYS_GROUP,
  'ex-checkin-sample': SAMPLE_REPORT_EX_CHECKIN,
};

