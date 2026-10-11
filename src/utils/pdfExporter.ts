import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export interface PdfExportOptions {
  element: HTMLElement;
  filename: string;
  reportTitle?: string;
  onProgress?: (progress: number, stage: string) => void;
}

/**
 * Robust canvas color converter that converts modern CSS color formats
 * (oklch, lab, oklab, lch, color-mix) to standard hex or rgb/rgba values using
 * the browser's 2D canvas context.
 */
function createColorConverter() {
  const dummyCanvas = document.createElement('canvas');
  dummyCanvas.width = 1;
  dummyCanvas.height = 1;
  const ctx = dummyCanvas.getContext('2d');

  function resolveSingleColor(colorStr: string): string {
    if (!ctx) return '#27272a';
    try {
      ctx.fillStyle = '#27272a';
      ctx.fillStyle = colorStr.trim();
      const resolved = ctx.fillStyle;
      return resolved || '#27272a';
    } catch {
      return '#27272a';
    }
  }

  return function convertColor(rawString: string): string {
    if (!rawString || typeof rawString !== 'string') return rawString;
    if (!/(oklch|oklab|color-mix|lab|lch)\s*\(/i.test(rawString)) {
      return rawString;
    }

    // Match nested parenthesis color expressions accurately
    // Handles expressions like: oklch(0.7 0.15 150) or color-mix(in oklab, oklch(...) 50%, white)
    const regex = /(?:oklch|oklab|color-mix|lab|lch)\s*\(/gi;
    let result = '';
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(rawString)) !== null) {
      const startIndex = match.index;
      result += rawString.slice(lastIndex, startIndex);

      let depth = 1;
      let i = regex.lastIndex;
      while (i < rawString.length && depth > 0) {
        if (rawString[i] === '(') depth++;
        else if (rawString[i] === ')') depth--;
        i++;
      }

      const fullColorFunc = rawString.slice(startIndex, i);
      result += resolveSingleColor(fullColorFunc);
      lastIndex = i;
      regex.lastIndex = i;
    }

    result += rawString.slice(lastIndex);
    return result;
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
  clone.style.margin = '0';
  clone.style.padding = '24px';
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

    onProgress?.(60, 'Formatting A4 pagination & margins...');

    // Standard A4 dimensions in mm: 210mm wide x 297mm high
    const marginX = 10;
    const marginTop = 10;
    const printableWidthMm = 190; // 210 - 20mm margins
    const printableHeightMm = 272; // 297 - 25mm margins

    // Calculate canvas height corresponding to one A4 printable page
    const pageHeightPx = Math.floor(canvas.width * (printableHeightMm / printableWidthMm));
    const totalPages = Math.max(1, Math.ceil(canvas.height / pageHeightPx));

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    onProgress?.(75, 'Assembling multi-page dossier...');

    for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
      const srcY = pageIdx * pageHeightPx;
      const sliceHeightPx = Math.min(pageHeightPx, canvas.height - srcY);

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
          srcY,
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

      // Running page footer
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(140, 140, 140);
      pdf.text(
        `${reportTitle} · Page ${pageIdx + 1} of ${totalPages}`,
        105,
        290,
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
