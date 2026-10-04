import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PdfExportOptions {
  element: HTMLElement;
  filename: string;
  reportTitle?: string;
  onProgress?: (progress: number, stage: string) => void;
}

/**
 * High-resolution multi-page PDF exporter for Indus Chat Reports.
 * Accurately chunks the rendered dossier into standard A4 pages with
 * consistent margins, crisp text rendering, and page numbering.
 */
export async function generatePdfFromElement({
  element,
  filename,
  reportTitle = 'Indus Chat Dossier',
  onProgress,
}: PdfExportOptions): Promise<void> {
  try {
    onProgress?.(10, 'Preparing high-resolution snapshot...');

    // Render target DOM element to high-DPI canvas
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution for retina/print sharpness
      useCORS: true,
      logging: false,
      backgroundColor: '#FAF9F6',
      windowWidth: element.scrollWidth,
      onclone: (clonedDoc) => {
        // Ensure all images in cloned document are rendered
        const clonedEl = clonedDoc.getElementById(element.id);
        if (clonedEl) {
          clonedEl.style.width = '800px';
          clonedEl.style.margin = '0 auto';
        }
      },
    });

    onProgress?.(50, 'Formatting A4 pagination...');

    const imgWidth = 190; // A4 width 210mm - 20mm margins
    const pageHeight = 277; // A4 height 297mm - 20mm margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    let position = 10; // Top margin
    let pageNumber = 1;

    // First page
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 0.95),
      'JPEG',
      10, // Left margin
      position,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );

    // Add subtle footer on first page
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`${reportTitle} · Page ${pageNumber}`, 105, 290, { align: 'center' });

    heightLeft -= pageHeight;

    onProgress?.(75, 'Assembling multi-page dossier...');

    // Subsequent pages
    while (heightLeft > 0) {
      pageNumber++;
      position = 10 - pageHeight * (pageNumber - 1);
      pdf.addPage();

      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        10,
        position,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );

      // Page footer
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`${reportTitle} · Page ${pageNumber}`, 105, 290, { align: 'center' });

      heightLeft -= pageHeight;
    }

    onProgress?.(95, 'Finalizing download...');
    pdf.save(filename);
    onProgress?.(100, 'Complete!');
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  }
}
