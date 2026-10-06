import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export interface PdfExportOptions {
  element: HTMLElement;
  filename: string;
  reportTitle?: string;
  onProgress?: (progress: number, stage: string) => void;
}

/**
 * Safely converts any modern oklch / lab CSS color declarations into
 * standard rgb/rgba values using the browser's 2D canvas context.
 */
function sanitizeOklchColors(doc: Document) {
  const dummyCanvas = document.createElement('canvas');
  dummyCanvas.width = 1;
  dummyCanvas.height = 1;
  const ctx = dummyCanvas.getContext('2d');
  if (!ctx) return;

  const colorProperties = [
    'color',
    'backgroundColor',
    'borderColor',
    'borderTopColor',
    'borderBottomColor',
    'borderLeftColor',
    'borderRightColor',
    'outlineColor',
  ];

  const allElements = doc.querySelectorAll('*');
  allElements.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    const computed = window.getComputedStyle(el);
    colorProperties.forEach((prop) => {
      const val = (computed as any)[prop];
      if (typeof val === 'string' && val.includes('oklch')) {
        try {
          ctx.fillStyle = val;
          (el.style as any)[prop] = ctx.fillStyle;
        } catch {}
      }
    });
  });
}

/**
 * Production-grade multi-page PDF exporter for Whatarewe Chat Reports.
 * Accurately clones the target element into a normalized offscreen viewport (820px width),
 * awaits image and font rendering, captures with html2canvas-pro (with native oklch support),
 * and slices cleanly into standard A4 pages with crisp margins and running headers/footers.
 */
export async function generatePdfFromElement({
  element,
  filename,
  reportTitle = 'Whatarewe · Chat Dossier',
  onProgress,
}: PdfExportOptions): Promise<void> {
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
        sanitizeOklchColors(clonedDoc);
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
    // Always clean up the temporary clone
    if (clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
  }
}
