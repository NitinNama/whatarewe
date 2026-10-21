# Implementation Plan: Smart Element-Aware Page Breaks for A4 PDF

Eliminate mid-card and mid-sentence vertical slicing across page breaks in downloaded A4 PDFs by implementing smart, element-aware pagination boundaries that respect card margins.

---

## 1. Problem Analysis & Root Cause

1. **Blind Pixel-Height Slicing**:
   - In `src/utils/pdfExporter.ts`, the multi-page generator previously sliced the single long canvas into fixed-height chunks using purely geometric math:
     `pageHeightPx = Math.floor(canvas.width * (printableHeightMm / printableWidthMm))`.
   - When a card, quote bubble, character dossier, or trait meter lands across `pageHeightPx`, the canvas cutter cuts directly through the middle of the element, rendering the top half at the bottom of Page $N$ and the bottom half at the top of Page $N+1$.
2. **User Confirmation**:
   - The user clarified that the clipping error is **cards and text sliced across page breaks**.
   - Preferred solution: **Smart page breaks so cards never split across pages**.

---

## 2. Proposed Technical Architecture

### A. Element-Aware DOM Coordinate Mapping (`src/utils/pdfExporter.ts`)
- **Query Breakable Units**:
  Inside the cloned DOM tree (`#temp-pdf-render-canvas-target`), query all atomic report components:
  - `.avoid-break`, `[class*="rounded-3xl"]`, `[class*="rounded-2xl"]`, `article`, `section`, `.character-profile-card`, `hr`, and direct chapter children of `#printable-dossier`.
- **Compute Scaled Pixel Geometry**:
  Calculate relative vertical coordinates for each block:
  ```ts
  const cloneRect = clone.getBoundingClientRect();
  const cardBounds = Array.from(cards).map((el) => {
    const r = el.getBoundingClientRect();
    return {
      top: Math.floor((r.top - cloneRect.top) * scale),
      bottom: Math.ceil((r.bottom - cloneRect.top) * scale),
      height: Math.ceil(r.height * scale),
    };
  }).filter(b => b.height > 20).sort((a, b) => a.top - b.top);
  ```

### B. Smart Pagination Algorithm
- **Dynamic Cut Line Calculation**:
  Instead of cutting blindly at `currentY + maxPageHeightPx`:
  1. Set tentative page bottom: `targetEndY = currentY + maxPageHeightPx`.
  2. If `targetEndY >= canvas.height`, this is the final page.
  3. Otherwise, inspect all elements in `cardBounds` that overlap `targetEndY` (`block.top < targetEndY && block.bottom > targetEndY`).
  4. If an overlapping card began on the current page (`block.top > currentY + minContentBuffer`), dynamically push the cut line upward to `block.top - bufferPx`.
  5. The entire card moves cleanly to the top of the next page without being sliced.
  6. If a card is exceptionally tall (exceeding an entire A4 page), allow it to split gracefully to prevent infinite loops.

### C. Canvas Slicing & PDF Page Assembly
- **Variable-Height Slicing**:
  Create each page canvas based on its exact calculated `sliceHeightPx`:
  ```ts
  pageCanvas.width = canvas.width;
  pageCanvas.height = sliceHeightPx;
  ctx.drawImage(canvas, 0, pageCut.startY, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);
  ```
- **Proportional PDF Placement**:
  - `sliceHeightMm = (sliceHeightPx * printableWidthMm) / canvas.width`.
  - Maintain the established 20mm safe margins (`marginX = 20mm`, `marginTop = 20mm`).
  - Running footer remains consistently positioned at `Y = 286mm` (`Page X of Y`).
  - Running header remains at `Y = 12mm`.

### D. CSS Print Parity (`src/index.css`)
- Ensure all cards and sections in the dossier carry explicit `break-inside: avoid !important; page-break-inside: avoid !important;` so browser print preview (`Ctrl+P`) mirrors the smart pagination of the PDF download.

---

## 3. Verification Plan

1. **Compilation & Linting**: Verify `lint_applet` and `compile_applet` pass with 0 errors.
2. **Export Testing**: Trigger PDF download of the comprehensive sample report (Maya & Julian) containing:
   - Heatmap Calendar
   - Share of Voice & Initiation Cards
   - Character Profiles with 6 Trait Score Meters
   - The Shift Turning Point Card
   - Who Cares More Meter
   - Closing Verdict
3. **Visual Inspection**: Ensure no cards or text lines are split horizontally across page breaks, and all pages have clean 20mm margins.
