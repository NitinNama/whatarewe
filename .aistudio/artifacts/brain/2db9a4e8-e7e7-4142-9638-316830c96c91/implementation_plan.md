# Whatarewe (Indus / What Brandon Thinks) — Conversational Autopsy

Comprehensive architectural and design plan to complete the full-stack relationship autopsy web application, synthesizing the dual-phase experience (Phase 1: 7-Slide Story Deck + Phase 2: 19-Chapter Confidential Relationship Dossier), instant multi-archive sample chat exploration, and client-side zip/txt parsing.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following directions have been confirmed and will guide the implementation:
> - **Commentary Persona & Tone**: Brandon delivers an unfiltered, razor-sharp observational roast backed by deep emotional intelligence and psychological acuity, exposing micro-patterns (2 AM vs 11 AM energy, double-text ratios, bill-splitting avoidance) without generic bot platitudes.
> - **Dual Output Priority**: Equal, seamless delivery of both the vertical mobile-first story slide deck (`1 of 7` progress bar with native Instagram card download) and the continuous long-form confidential dossier report with printable, unclipped PDF export.
> - **Instant Sample Exploration**: Three distinct pre-computed, realistic sample archives (Romantic Situationship, Boys Group Trip, and Ex Checking-In) available directly from the Landing Page and Setup Page with zero file upload needed.
> - **Brand Cohesion**: Retaining the master moniker **Whatarewe** (with Brandon as the lead investigative persona / dossier author) across all share cards, letterheads, and navigation zones.

---

### 1. Overview & Core Concept

- **What It Does**: Users upload raw WhatsApp or iMessage chat exports (`.txt` or `.zip`). An opinionated AI persona, **Brandon**, reads every message, parses chronological timestamps, calculates forensic messaging metrics, and generates a two-phase relationship autopsy:
  1. **Phase 1: Instagram Story Slides (1 to 7)** featuring calendar contribution heatmaps, participation donut charts, response speed podiums, record streaks/silences, and top vocabulary.
  2. **Phase 2: The Confidential Relationship Dossier** comprising 19 distinct chapters including Character Dossiers with verbatim WhatsApp evidence bubbles, The Vibe Timeline, The Shift Turning Point, Who Cares More Meter, The Unsaid Things Subtext Reader, Plan Conversion Funnel, Ghosting Index, 3 AM vs 11 AM Persona Split, and an interactive "Ask Brandon" Q&A console.
- **Target Audience / Persona**: Anyone questioning where they stand in a romantic connection, friend group dynamic, ex check-in, or family thread who wants unvarnished truth over polite platitudes.
- **Key Value**: Delivers undeniable clarity and cathartic humor by anchoring psychological commentary directly to mathematical receipts and timestamped evidence.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Landing Page (`/`)**:
   - **Hero Section**: Pulsing Brandon avatar, high-impact serif headline (*"Upload a chat. Brandon tells you what’s really going on."*), looping marquee of relationship tags, and category tabs (`All`, `Relationship`, `Friends & Groups`, `Family`, `iMessage`).
   - **Interactive Preview Widget**: Switch instantly between 3 sample chats (Maya & Julian Situationship, Class 12 / Lisbon Boys Group, and Chloe & Liam Ex Check-in) to inspect their dossier immediately.
   - **Verified Proof Strip & Testimonials**: Editorial quotes with verified participant avatars and message counts.
2. **Setup & Contact Cleaner (`/setup`)**:
   - **Step 1 — Platform Selection**: WhatsApp vs. iMessage toggle.
   - **Step 2 — Illustrated Export Guide**: Visual steps for exporting chats without media.
   - **Step 3 — File Upload**: Drag-and-drop zone accepting `.txt` and `.zip` files (extracting the primary `_chat.txt` in-browser), plus instant sample load triggers.
   - **Step 4 — Contact Cleaner**: Auto-detects raw phone numbers and unrecognized handles, allowing inline renaming to nicknames before LLM synthesis.
   - **Step 5 — Generation Screen**: Real-time rotating observational status copy with animated avatar radar pulse and stream preview.
3. **Phase 1: Story Slides (`/report?view=slides`)**:
   - Full-screen mobile card deck with top `X of 7` segmented progress indicator, keyboard/touch swipe navigation, and desktop phone mockup framing toggle.
   - **Slide 1**: GitHub-style calendar contribution heatmap in dark navy (`#0d1b2a`) with gold (`#f5c842`) volume density.
   - **Slide 2**: Mathematical SVG donut of message distribution + horizontal initiation split bars.
   - **Slide 3**: Response latency podiums (🥇, 🥈, 🥉), 24h hourly distribution, record volume day, longest streak vs longest silence.
   - **Slide 4**: Vocabulary autopsy with top 5 filtered words and 5 primary emojis.
   - **Slides 5–6**: Brandon's Opening Monologue and Character Highlights.
   - **Slide 7**: Final Grade summary leading into the full dossier via high-contrast CTA (*"See the report →"*).
4. **Phase 2: Confidential Dossier (`/report?view=dossier`)**:
   - Editorial broadsheet reading canvas (`EB Garamond` display headers, `Plus Jakarta Sans` body, `Geist Mono` accession stamps).
   - Chapters 1 through 19 rendered with authentic light green WhatsApp exhibits (`#e7ffdb`, blue double ticks `✓✓`), 3 AM vs 11 AM side-by-side contrast cards, venture-capital style Plan Conversion Funnels, Ghosting/Left-on-Read exhibits, and 1-click Instagram story export card.

#### Visual Identity & Palette
- **Canvas & Backing**: Warm Alabaster (`#FAF9F6`), Pure White cards (`#FFFFFF`), whisper hairline dividers (`border-zinc-200/80`).
- **Accent Tints**:
  - Initiation / Voice: Lavender (`#e8e0f7`)
  - Starters / Unsaid: Soft Pink (`#fce4ec`)
  - Record Day / Hot Takes: Peach & Warm Amber (`#fde8d8`, `#fef3c0`)
  - Streak / Health: Mint Green (`#d0f0e8`, `#d4f5e0`)
  - WhatsApp Bubbles: Authentic green (`#e7ffdb`) with border (`#d0f0c0`) and sky blue double checkmarks (`#38bdf8`)
- **Participant Cycling**: Teal (`#2dd4bf`), Blue (`#60a5fa`), Purple (`#a78bfa`), Orange (`#fb923c`), Emerald (`#4ade80`).
- **Typography**: Classical editorial serif for headers and pull quotes, crisp geometric sans for controls and paragraphs, tabular monospace for timestamps and percentages (`tabular-nums`).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Completion of Chapters 16, 17, and 18 in Dossier and LLM Schema**:
  - *Chosen Approach*: Add `planConversionFunnel`, `ghostingIndex`, and `nightVsDayPersona` to the TypeScript interfaces, the Gemini structured response schema in `server.ts`, the mock fallback generator, and the React dossier renderer in `ReportPage.tsx`.
  - *Why*: Ensures 100% adherence to the 19-chapter master prompt specification without missing forensic analyses.
  - *Alternatives Considered*: Folding these into general hot takes was rejected because the master prompt explicitly requires dedicated visual components (visual funnel chart, unanswered monologue exhibit, and side-by-side 2 AM vs 11 AM comparisons).
- **Decision 2: Client-Side ZIP Unpacking (`JSZip`)**:
  - *Chosen Approach*: Parse `.zip` archives directly in the browser via `jszip` to extract `_chat.txt` without uploading heavy media files to the server.
  - *Why*: Protects user privacy, eliminates network upload timeouts, and keeps AI token consumption focused strictly on text transcripts.
- **Decision 3: Triple Curated Sample Reports**:
  - *Chosen Approach*: Expand `sampleChats.ts` with 3 fully generated static dossier archives (Maya & Julian Situationship, Lisbon Boys Trip, and Chloe & Liam Ex Check-in) so users can experience both Phase 1 slides and Phase 2 dossiers instantly with zero friction.
- **Decision 4: Resilient In-Memory and PDF Layout Isolation**:
  - *Chosen Approach*: The printable dossier uses strict CSS print isolation rules (`break-inside: avoid;`, `break-after: avoid;`, `-webkit-print-color-adjust: exact;`), hiding interactive controls like the "Ask Brandon" input during export.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATION (VITE + REACT)               │
├──────────────────┬──────────────────────┬──────────────────────────────┤
│  Landing Page    │   Setup & Cleaner    │   Report View (Dual Mode)    │
│  - Hero & Pulse  │   - Platform Toggle  │   - Phase 1: 7 Story Slides  │
│  - 3 Sample Tabs │   - Drag & Drop Zip  │   - Phase 2: 19 Chapters     │
│  - Marquee Tags  │   - Contact Renamer  │   - 9:16 Instagram Exporter  │
│  - Testimonials  │   - Status Radar     │   - Clean PDF Generator      │
└─────────┬────────┴──────────┬───────────┴──────────────┬───────────────┘
          │                   │                          │
          ▼                   ▼                          ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────────────────┐
│ In-Browser Zip   │ │ Chat Parser &    │ │ State Management & Storage   │
│ & TXT Extractor  │ │ Stats Generator  │ │ - Active Report State        │
│ (JSZip / Regex)  │ │ (Timestamps, 24h)│ │ - Local / Server Fallbacks   │
└─────────┬────────┘ └────────┬─────────┘ └──────────────┬───────────────┘
          │                   │                          │
          └───────────────────┼──────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        EXPRESS BACKEND (server.ts)                     │
├────────────────────────────────────────────────────────────────────────┤
│  POST /api/analyze-chat  ──> Google GenAI SDK (gemini-3.8-flash)       │
│                              • Strict REPORT_RESPONSE_SCHEMA           │
│                              • Chapters 1-19 Typed ContentBlocks       │
│  POST /api/chat-qa       ──> Conversational Brandon Follow-Up          │
│  POST /api/hot-take-deep ──> Interactive Conspiracy Theory Expansion   │
│  GET  /api/reports/:id   ──> In-Memory Reports Store                   │
└────────────────────────────────────────────────────────────────────────┘
```

#### Data Entities & Schema Updates
- **`PlanConversionFunnel`**: `hangoutsProposedCount`, `hangoutsAgreedCount`, `hangoutsOccurredCount`, `conversionRatePercent`, `verdict`.
- **`GhostingIndex`**: `mostLeftOnReadPerson`, `unansweredMonologuesCount`, `longestSilenceExhibit`: `{ sender: string; timestamp: string; message: string; daysIgnored: number }`, `analysis`.
- **`NightVsDayPersona`**: List of participant comparisons: `{ name: string; nightMessage: { time: string; text: string; subtext: string }; dayMessage: { time: string; text: string; subtext: string }; analysis: string }`.

#### Verification Plan
1. **Compilation**: Run `compile_applet` to ensure TypeScript types and component imports build cleanly.
2. **Linting**: Execute `lint_applet` to verify no unused variables or syntax anomalies.
3. **Interactive Testing**: Verify 7-slide deck transitions, 19-chapter dossier rendering, PDF export, hot take expansions, and contact renamer in the running dev server.
