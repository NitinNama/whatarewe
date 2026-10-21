import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export interface PdfExportOptions {
  element: HTMLElement;
  filename: string;
  reportTitle?: string;
  onProgress?: (progress: number, stage: string) => void;
}

function oklchToRgb(L: number, C: number, H: number, alpha = 1): string {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const rLinear = +4.0767434772 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLinear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLinear = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  function toSRGB(c: number): number {
    const clamped = Math.max(0, Math.min(1, c));
    return clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  }

  const r = Math.round(toSRGB(rLinear) * 255);
  const g = Math.round(toSRGB(gLinear) * 255);
  const bVal = Math.round(toSRGB(bLinear) * 255);

  const safeAlpha = Math.max(0, Math.min(1, alpha));
  if (safeAlpha < 1) {
    return `rgba(${r}, ${g}, ${bVal}, ${safeAlpha.toFixed(2)})`;
  }
  return `rgb(${r}, ${g}, ${bVal})`;
}

function parseRgbOrHex(s: string): [number, number, number, number] | null {
  if (!s) return null;
  const str = s.trim();
  if (str === 'transparent') return [0, 0, 0, 0];
  if (str === 'white') return [255, 255, 255, 1];
  if (str === 'black') return [0, 0, 0, 1];

  const rgbaM = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)/i);
  if (rgbaM) {
    const r = parseInt(rgbaM[1], 10);
    const g = parseInt(rgbaM[2], 10);
    const b = parseInt(rgbaM[3], 10);
    let a = 1;
    if (rgbaM[4]) {
      a = rgbaM[4].endsWith('%') ? parseFloat(rgbaM[4]) / 100 : parseFloat(rgbaM[4]);
    }
    return [r, g, b, a];
  }

  if (str.startsWith('#')) {
    let hex = str.slice(1);
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    if (hex.length === 4) hex = hex.split('').map((c) => c + c).join('');
    if (hex.length === 6) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
        1,
      ];
    }
    if (hex.length === 8) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
        parseInt(hex.slice(6, 8), 16) / 255,
      ];
    }
  }

  return null;
}

/**
 * Robust color converter that converts modern CSS color formats
 * (oklch, lab, oklab, lch, color-mix) to standard hex or rgb/rgba values using
 * mathematical color-space conversion and canvas fallback.
 */
function createColorConverter() {
  const dummyCanvas = document.createElement('canvas');
  dummyCanvas.width = 1;
  dummyCanvas.height = 1;
  const ctx = dummyCanvas.getContext('2d');

  function resolveColorMix(colorStr: string): string {
    const trans1 = colorStr.match(
      /color-mix\s*\(\s*in\s+[\w-]+\s*,\s*(.+?)\s+(\d+(?:\.\d+)?)%\s*,\s*transparent(?:\s+\d+%?)?\s*\)/i
    );
    if (trans1) {
      const baseColor = resolveSingleColor(trans1[1]);
      const alpha = parseFloat(trans1[2]) / 100;
      const parsed = parseRgbOrHex(baseColor);
      if (parsed) {
        return `rgba(${parsed[0]}, ${parsed[1]}, ${parsed[2]}, ${(parsed[3] * alpha).toFixed(2)})`;
      }
      return baseColor;
    }

    const trans2 = colorStr.match(
      /color-mix\s*\(\s*in\s+[\w-]+\s*,\s*transparent(?:\s+(\d+(?:\.\d+)?)%)?\s*,\s*(.+?)(?:\s+(\d+(?:\.\d+)?)%)?\s*\)/i
    );
    if (trans2) {
      const baseColor = resolveSingleColor(trans2[2]);
      const alpha = trans2[3]
        ? parseFloat(trans2[3]) / 100
        : trans2[1]
        ? 1 - parseFloat(trans2[1]) / 100
        : 1;
      const parsed = parseRgbOrHex(baseColor);
      if (parsed) {
        return `rgba(${parsed[0]}, ${parsed[1]}, ${parsed[2]}, ${(parsed[3] * alpha).toFixed(2)})`;
      }
      return baseColor;
    }

    const generalMix = colorStr.match(
      /color-mix\s*\(\s*in\s+[\w-]+\s*,\s*(.+?)(?:\s+(\d+(?:\.\d+)?)%)?\s*,\s*(.+?)(?:\s+(\d+(?:\.\d+)?)%)?\s*\)/i
    );
    if (generalMix) {
      const c1 = resolveSingleColor(generalMix[1]);
      const c2 = resolveSingleColor(generalMix[3]);
      const p1 = generalMix[2]
        ? parseFloat(generalMix[2]) / 100
        : generalMix[4]
        ? 1 - parseFloat(generalMix[4]) / 100
        : 0.5;
      const rgb1 = parseRgbOrHex(c1);
      const rgb2 = parseRgbOrHex(c2);
      if (rgb1 && rgb2) {
        const r = Math.round(rgb1[0] * p1 + rgb2[0] * (1 - p1));
        const g = Math.round(rgb1[1] * p1 + rgb2[1] * (1 - p1));
        const b = Math.round(rgb1[2] * p1 + rgb2[2] * (1 - p1));
        const a = (rgb1[3] * p1 + rgb2[3] * (1 - p1)).toFixed(2);
        return `rgba(${r}, ${g}, ${b}, ${a})`;
      }
      return c1;
    }

    return colorStr;
  }

  function resolveSingleColor(colorStr: string): string {
    if (!colorStr || typeof colorStr !== 'string') return colorStr;
    const s = colorStr.trim();

    if (s === 'transparent') return 'rgba(0, 0, 0, 0)';
    if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(s)) return s;
    if (/^rgba?\(/i.test(s) && !/(oklch|oklab|color-mix|lab|lch)/i.test(s)) return s;

    // 1. color-mix
    if (/color-mix\s*\(/i.test(s)) {
      return resolveColorMix(s);
    }

    // 2. oklch(L C H [/ alpha])
    if (/oklch\s*\(/i.test(s)) {
      const m = s.match(
        /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/i
      );
      if (m) {
        const L = m[1].endsWith('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
        const C = parseFloat(m[2]);
        const H = parseFloat(m[3]);
        const alpha = m[4]
          ? m[4].endsWith('%')
            ? parseFloat(m[4]) / 100
            : parseFloat(m[4])
          : 1;
        return oklchToRgb(L, C, H, alpha);
      }
    }

    // 3. oklab(L a b [/ alpha])
    if (/oklab\s*\(/i.test(s)) {
      const m = s.match(
        /oklab\(\s*([\d.]+%?)\s+([-\d.]+)\s+([-\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/i
      );
      if (m) {
        const L = m[1].endsWith('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
        const a = parseFloat(m[2]);
        const b = parseFloat(m[3]);
        const alpha = m[4]
          ? m[4].endsWith('%')
            ? parseFloat(m[4]) / 100
            : parseFloat(m[4])
          : 1;
        const C = Math.sqrt(a * a + b * b);
        const H = (Math.atan2(b, a) * 180) / Math.PI;
        return oklchToRgb(L, C, H < 0 ? H + 360 : H, alpha);
      }
    }

    // 4. Try native Canvas 2D resolver if supported by current browser
    if (ctx) {
      try {
        ctx.fillStyle = 'rgba(1, 2, 3, 0.4)';
        ctx.fillStyle = s;
        if (ctx.fillStyle !== 'rgba(1, 2, 3, 0.4)' && ctx.fillStyle !== '#010203') {
          return ctx.fillStyle;
        }
      } catch {}
    }

    // 5. Clean, safe light fallbacks (NEVER pitch black #27272a!)
    if (/white/i.test(s)) return 'rgba(255, 255, 255, 0.9)';
    if (/transparent/i.test(s)) return 'rgba(0, 0, 0, 0)';

    return 'rgba(255, 255, 255, 0.9)';
  }

  return function convertColor(rawString: string): string {
    if (!rawString || typeof rawString !== 'string') return rawString;
    if (!/(oklch|oklab|color-mix|lab|lch)\s*\(/i.test(rawString)) {
      return rawString;
    }

    let current = rawString;
    let iterations = 0;
    while (/(?:oklch|oklab|color-mix|lab|lch)\s*\(/i.test(current) && iterations < 8) {
      iterations++;
      // Resolve innermost color functions first
      const regex = /(?:oklch|oklab|color-mix|lab|lch)\s*\(/gi;
      let match: RegExpExecArray | null;
      let lastMatch: RegExpExecArray | null = null;
      while ((match = regex.exec(current)) !== null) {
        lastMatch = match;
      }
      if (!lastMatch) break;

      const startIndex = lastMatch.index;
      let depth = 1;
      let i = startIndex + lastMatch[0].length;
      while (i < current.length && depth > 0) {
        if (current[i] === '(') depth++;
        else if (current[i] === ')') depth--;
        i++;
      }

      const fullColorFunc = current.slice(startIndex, i);
      const resolved = resolveSingleColor(fullColorFunc);
      current = current.slice(0, startIndex) + resolved + current.slice(i);
    }

    return current;
  };
}

/**
 * Deeply sanitizes all stylesheets, style tags, and inline styles
 * inside a cloned document to guarantee zero `oklch` / `color-mix` functions exist.
 */
function sanitizeDocumentStyles(doc: Document, convertColor: (c: string) => string) {
  // 1. Sanitize all <style> elements
  const styleTags = doc.querySelectorAll('style');
  styleTags.forEach((styleTag) => {
    if (styleTag.textContent && /(oklch|oklab|color-mix|lab|lch)\s*\(/i.test(styleTag.textContent)) {
      try {
        styleTag.textContent = convertColor(styleTag.textContent);
      } catch {}
    }
  });

  // 2. Sanitize all elements' inline style attributes & common CSS properties
  const cssColorProps = [
    'color',
    'backgroundColor',
    'borderColor',
    'borderTopColor',
    'borderBottomColor',
    'borderLeftColor',
    'borderRightColor',
    'outlineColor',
    'textDecorationColor',
    'boxShadow',
    'textShadow',
    'caretColor',
    'accentColor',
    'fill',
    'stroke',
  ];

  const allElements = doc.querySelectorAll('*');
  allElements.forEach((el) => {
    if (!(el instanceof HTMLElement || el instanceof SVGElement)) return;
    const styleObj = (el as HTMLElement).style;
    if (!styleObj) return;

    // Check style attribute text directly
    if (el.hasAttribute('style')) {
      const rawStyle = el.getAttribute('style');
      if (rawStyle && /(oklch|oklab|color-mix|lab|lch)\s*\(/i.test(rawStyle)) {
        try {
          el.setAttribute('style', convertColor(rawStyle));
        } catch {}
      }
    }

    // Check computed styles and override if needed
    try {
      const defaultView = doc.defaultView || window;
      const computed = defaultView.getComputedStyle(el);
      cssColorProps.forEach((prop) => {
        try {
          const val = (computed as any)[prop];
          if (typeof val === 'string' && /(oklch|oklab|color-mix|lab|lch)\s*\(/i.test(val)) {
            (styleObj as any)[prop] = convertColor(val);
          }
        } catch {}
      });
    } catch {}
  });
}

/**
 * Production-grade multi-page PDF exporter for Whatarewe Chat Reports.
 * Accurately clones the target element into a normalized offscreen viewport (820px width),
 * intercepts any oklch color parsing that triggers html2canvas errors,
 * captures with high DPI resolution, and slices cleanly into standard A4 pages
 * with running headers/footers.
 */
export async function generatePdfFromElement({
  element,
  filename,
  reportTitle = 'Whatarewe · Chat Dossier',
  onProgress,
}: PdfExportOptions): Promise<void> {
  const convertColor = createColorConverter();

  // Create an offscreen isolated clone attached to document.body at (0, 0)
  // positioned behind the main interface (zIndex: -99999) so html2canvas
  // renders full layout with zero viewport clipping or coordinate offset bugs.
  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = 'temp-pdf-render-canvas-target';
  clone.style.position = 'fixed';
  clone.style.left = '0px';
  clone.style.top = '0px';
  clone.style.width = '820px';
  clone.style.maxWidth = '820px';
  clone.style.zIndex = '-99999';
  clone.style.opacity = '1';
  clone.style.visibility = 'visible';
  clone.style.pointerEvents = 'none';
  clone.style.backgroundColor = '#FAF9F6';
  clone.style.boxShadow = 'none';
  clone.style.transform = 'none';
  clone.style.margin = '0 auto';
  clone.style.padding = '24px 28px';
  clone.style.boxSizing = 'border-box';

  // Completely remove interactive and no-print UI elements from the PDF export DOM
  clone.querySelectorAll('.no-print').forEach((el) => el.remove());

  document.body.appendChild(clone);

  // Hook window.getComputedStyle during the capture lifecycle so that ANY
  // property lookup during html2canvas's parseTree returns valid sRGB/hex
  const originalGetComputedStyle = window.getComputedStyle;
  const patchedGetComputedStyle = function (
    elt: Element,
    pseudoElt?: string | null
  ): CSSStyleDeclaration {
    const orig = originalGetComputedStyle.call(window, elt, pseudoElt);
    if (!orig) return orig;

    return new Proxy(orig, {
      get(target, prop) {
        if (prop === 'getPropertyValue') {
          return (propertyName: string) => {
            try {
              const val = target.getPropertyValue(propertyName);
              if (typeof val === 'string' && /(oklch|oklab|color-mix|lab|lch)\s*\(/i.test(val)) {
                return convertColor(val);
              }
              return val;
            } catch {
              return '';
            }
          };
        }

        let val: any;
        try {
          // CRITICAL FIX: Pass `target` as receiver (3rd argument to Reflect.get)
          // instead of the Proxy receiver. This ensures native WebIDL accessor getters
          // (such as .length, .cssText, .parentRule) execute with `this === target`,
          // preventing the browser engine from throwing "TypeError: Illegal invocation".
          val = Reflect.get(target, prop, target);
        } catch {
          val = (target as any)[prop];
        }

        if (typeof val === 'function') {
          return val.bind(target);
        }

        if (typeof val === 'string' && /(oklch|oklab|color-mix|lab|lch)\s*\(/i.test(val)) {
          return convertColor(val);
        }

        return val;
      },
    });
  };

  try {
    onProgress?.(15, 'Preparing exhibits and font assets...');

    // Wait for all images inside the clone to finish loading
    const images = clone.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    // Wait for document fonts if supported
    if (document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {}
    }

    onProgress?.(35, 'Generating high-resolution snapshot...');

    // Temporarily apply the getComputedStyle patch to prevent oklch exceptions in html2canvas
    window.getComputedStyle = patchedGetComputedStyle as any;

    // Render cloned DOM tree to high-DPI canvas
    const canvas = await html2canvas(clone, {
      scale: 2, // 2x resolution for print sharpness
      useCORS: true,
      logging: false,
      backgroundColor: '#FAF9F6',
      width: 820,
      windowWidth: 820,
      scrollY: 0,
      scrollX: 0,
      onclone: (clonedDoc) => {
        // Disable any running CSS transitions/animations in cloned doc for freeze-frame fidelity
        try {
          const disableAnimationsStyle = clonedDoc.createElement('style');
          disableAnimationsStyle.textContent = `
            *, *::before, *::after {
              animation: none !important;
              transition: none !important;
            }
          `;
          clonedDoc.head?.appendChild(disableAnimationsStyle);
        } catch {}

        // Deeply sanitize all <style> elements and attributes in the cloned document
        sanitizeDocumentStyles(clonedDoc, convertColor);

        // Also patch clonedDoc's defaultView getComputedStyle if present
        if (clonedDoc.defaultView) {
          clonedDoc.defaultView.getComputedStyle = patchedGetComputedStyle as any;
        }
      },
    });

    onProgress?.(60, 'Calculating smart element-aware page breaks...');

    // Standard A4 dimensions in mm: 210mm wide x 297mm high
    // User-selected 20mm standard safe margins to guarantee zero edge clipping
    const marginX = 20; // 20mm side margins
    const marginTop = 20; // 20mm top margin
    const marginBottom = 20; // 20mm bottom margin
    const printableWidthMm = 210 - marginX * 2; // 170mm printable width
    const printableHeightMm = 297 - marginTop - marginBottom; // 257mm printable height
    const maxPageHeightPx = Math.floor(canvas.width * (printableHeightMm / printableWidthMm));

    // Measure atomic card components in cloned DOM to detect exact boundary coordinates
    const cloneRect = clone.getBoundingClientRect();
    const scaleRatio = canvas.width / Math.max(1, cloneRect.width);

    const breakAvoidSelectors = [
      '.avoid-break',
      '.avoid-page-break',
      '[class*="rounded-3xl"]',
      '[class*="rounded-2xl"]',
      '[class*="rounded-xl"]',
      'article',
      'section',
      'hr',
      '.border-b-2',
      '.grid',
    ].join(', ');

    const cardElements = clone.querySelectorAll(breakAvoidSelectors);
    const cardBounds: { top: number; bottom: number; height: number }[] = [];

    cardElements.forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const r = el.getBoundingClientRect();
      const top = Math.floor((r.top - cloneRect.top) * scaleRatio);
      const bottom = Math.ceil((r.bottom - cloneRect.top) * scaleRatio);
      const height = bottom - top;
      // Filter out tiny elements or massive wrappers larger than 85% of an A4 page
      if (height > 40 && height < maxPageHeightPx * 0.85) {
        cardBounds.push({ top, bottom, height });
      }
    });

    cardBounds.sort((a, b) => a.top - b.top);

    // Calculate smart page cuts so no card is sliced across page boundaries
    interface PageCut {
      startY: number;
      endY: number;
    }
    const pageCuts: PageCut[] = [];
    let currentY = 0;
    const safetyBufferPx = Math.round(14 * scaleRatio); // Visual cushion above the split card

    while (currentY < canvas.height - 20) {
      let tentativeEndY = currentY + maxPageHeightPx;

      if (tentativeEndY >= canvas.height) {
        pageCuts.push({ startY: currentY, endY: canvas.height });
        break;
      }

      // Check which cards would be sliced by tentativeEndY
      let bestCutY = tentativeEndY;
      const candidates: number[] = [];

      for (const card of cardBounds) {
        // If this card is intersected by tentativeEndY
        if (card.top < tentativeEndY && card.bottom > tentativeEndY) {
          // If this card started with enough room on the current page, it can be pushed to next page
          if (card.top >= currentY + 120) {
            candidates.push(card.top - safetyBufferPx);
          }
        }
      }

      if (candidates.length > 0) {
        // Pick the earliest cut point among all split cards so that NO split card is clipped!
        const earliestCut = Math.min(...candidates);
        if (earliestCut > currentY + 100) {
          bestCutY = earliestCut;
        }
      }

      // Safeguard: guarantee forward progress of at least 100px
      if (bestCutY <= currentY + 100) {
        bestCutY = tentativeEndY;
      }

      pageCuts.push({ startY: currentY, endY: bestCutY });
      currentY = bestCutY;
    }

    const totalPages = Math.max(1, pageCuts.length);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    onProgress?.(75, 'Assembling multi-page dossier with smart page breaks...');

    for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
      const cut = pageCuts[pageIdx];
      const sliceHeightPx = cut.endY - cut.startY;

      // Create an exact canvas slice for this page
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeightPx;

      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FAF9F6';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0,
          cut.startY,
          canvas.width,
          sliceHeightPx,
          0,
          0,
          canvas.width,
          sliceHeightPx
        );
      }

      const sliceHeightMm = (sliceHeightPx * printableWidthMm) / canvas.width;
      const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);

      if (pageIdx > 0) {
        pdf.addPage();
      }

      pdf.addImage(
        imgData,
        'JPEG',
        marginX,
        marginTop,
        printableWidthMm,
        sliceHeightMm,
        undefined,
        'FAST'
      );

      // Running page header in the 20mm top margin zone (at 12mm)
      // Clean non-ASCII and emoji chars from running header so standard jsPDF Helvetica font renders cleanly
      const cleanHeaderTitle = reportTitle
        .replace(/[^\x20-\x7E]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toUpperCase();

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(160, 160, 160);
      pdf.text(
        cleanHeaderTitle,
        marginX,
        12,
        { align: 'left' }
      );
      pdf.text(
        'CONFIDENTIAL DOSSIER',
        210 - marginX,
        12,
        { align: 'right' }
      );

      // Running page footer safely placed in the 20mm bottom margin zone (at 286mm)
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(140, 140, 140);
      pdf.text(
        `Page ${pageIdx + 1} of ${totalPages}`,
        105,
        286,
        { align: 'center' }
      );
    }

    onProgress?.(95, 'Finalizing download...');
    pdf.save(filename);
    onProgress?.(100, 'Complete!');
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  } finally {
    // Restore original window.getComputedStyle
    window.getComputedStyle = originalGetComputedStyle;

    // Always clean up the temporary clone
    if (clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
  }
}
