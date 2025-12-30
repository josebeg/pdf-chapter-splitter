
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { Chapter, Granularity } from '../types';

/**
 * Robustly resolve PDF.js exports. 
 */
const pdfjs: any = pdfjsLib;
const getDocument = pdfjs.getDocument || pdfjs.default?.getDocument;
const GlobalWorkerOptions = pdfjs.GlobalWorkerOptions || pdfjs.default?.GlobalWorkerOptions;

if (GlobalWorkerOptions) {
  GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}


export async function extractTextSummary(file: File): Promise<{ pageCount: number; pageSummaries: string[] }> {
  if (typeof getDocument !== 'function') {
    throw new Error('PDF.js getDocument function not found. Please check library initialization.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pageSummaries: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const textItems = textContent.items.map((item: any) => item.str);
    // Take a small snippet from the start of the page for "summary" logs
    const summary = textItems.slice(0, 15).join(' ').substring(0, 200);
    pageSummaries.push(`Page ${i}: ${summary}`);
  }

  return { pageCount: numPages, pageSummaries };
}

/**
 * Detects chapters using internal bookmarks (Track A) or heuristic rules (Track B).
 */
export async function detectChapters(file: File, granularity: Granularity): Promise<Chapter[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  // 1. Try to extract from bookmarks (Track A)
  const outline = await pdf.getOutline();
  if (outline && outline.length > 0) {
    const chaptersFromBookmarks = await extractChaptersFromOutline(pdf, outline, granularity);
    if (chaptersFromBookmarks.length > 0) {
      return normalizeChapters(chaptersFromBookmarks, numPages);
    }
  }

  // 2. Fallback to heuristic rules (Track B)
  return await detectChaptersByRules(pdf, granularity);
}

/**
 * Converts PDF outline hierarchical structure into flat Chapter array based on granularity.
 */
async function extractChaptersFromOutline(pdf: any, outline: any[], granularity: Granularity): Promise<Chapter[]> {
  const chapters: Chapter[] = [];

  async function traverse(items: any[], currentLevel: number, parentIndex: string, parentTitle: string) {
    if (currentLevel > granularity) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const indexCode = parentIndex ? `${parentIndex}.${i + 1}` : `${i + 1}`;

      let pageNumber = -1;
      if (item.dest) {
        // Resolve destination to page number
        const dest = typeof item.dest === 'string' ? await pdf.getDestination(item.dest) : item.dest;
        if (dest) {
          const pageRef = Array.isArray(dest) ? dest[0] : dest;
          try {
            pageNumber = (await pdf.getPageIndex(pageRef)) + 1;
          } catch (e) {
            console.warn("Could not resolve page index for bookmark:", item.title);
          }
        }
      }

      if (pageNumber > 0) {
        chapters.push({
          id: `bookmark-${chapters.length}`,
          title: item.title,
          startPage: pageNumber,
          endPage: pageNumber, // Placeholder, normalized later
          indexCode: padIndexCode(indexCode),
          mainChapterTitle: parentTitle || item.title
        });
      }

      if (item.items && item.items.length > 0) {
        // Only recurse if we are below requested granularity
        await traverse(item.items, currentLevel + 1, indexCode, parentTitle || item.title);
      }
    }
  }

  await traverse(outline, 1, "", "");
  return chapters;
}

/**
 * Pads index codes like "1.2" to "01.02.00" based on depth.
 */
function padIndexCode(code: string): string {
  const parts = code.split('.');
  const p1 = parts[0]?.padStart(2, '0') || '01';
  const p2 = parts[1]?.padStart(2, '0') || '00';
  const p3 = parts[2]?.padStart(2, '0') || '00';
  return `${p1}.${p2}.${p3}`;
}

/**
 * Normalizes start/end pages so they are continuous and cover the whole doc.
 */
function normalizeChapters(chapters: Chapter[], totalPages: number): Chapter[] {
  if (chapters.length === 0) return [];

  // Sort by start page
  const sorted = [...chapters].sort((a, b) => a.startPage - b.startPage);

  // Force first chapter to start at 1
  if (sorted[0]) sorted[0].startPage = 1;

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];
    if (next) {
      current.endPage = next.startPage - 1;
    } else {
      current.endPage = totalPages;
    }

    // Safety check
    if (current.endPage < current.startPage) {
      current.endPage = current.startPage;
    }
  }

  return sorted;
}

/**
 * Heuristic-based detection (Track B)
 */
async function detectChaptersByRules(pdf: any, granularity: Granularity): Promise<Chapter[]> {
  const numPages = pdf.numPages;
  const candidates: { title: string, page: number, size: number }[] = [];

  // Heuristic patterns
  const patterns = [
    { regex: /^Chapter\s+\d+/i, weight: 10 },
    { regex: /^\d+(\.\d+)?(\.\d+)?\s+[A-Z]/, weight: 8 },
    { regex: /^Section\s+\d+/i, weight: 5 }
  ];

  for (let i = 1; i <= numPages; i++) { // No longer limiting scan to 300 pages
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    const topItems = textContent.items.slice(0, 15) as any[];

    for (const item of topItems) {
      const text = item.str.trim();
      if (!text || text.length < 3) continue;

      const fontSize = Math.abs(item.transform[0] || item.transform[3] || item.height || 10);

      let weight = 0;
      if (fontSize > 16) weight += 5;
      if (fontSize > 20) weight += 10;

      for (const p of patterns) {
        if (p.regex.test(text)) weight += p.weight;
      }

      // If it looks like a heading and is near the top of the page
      const isNearTop = item.transform[5] > 400; // Increased range for Y-coordinate

      if (weight >= 10 && isNearTop) {
        // Simple de-duplication: don't add if we already have a heading on this page
        if (!candidates.find(c => c.page === i)) {
          candidates.push({ title: text, page: i, size: fontSize });
        }
      }
    }
  }

  // Map candidates to chapters
  const chapters = candidates.map((c, idx) => ({
    id: `rule-${idx}`,
    title: c.title,
    startPage: c.page,
    endPage: c.page,
    indexCode: padIndexCode(String(idx + 1)),
    mainChapterTitle: c.title
  }));

  // If no chapters found, return one big chapter
  if (chapters.length === 0) {
    return [{
      id: "fallback-0",
      title: "Document Core",
      startPage: 1,
      endPage: numPages,
      indexCode: "01.00.00",
      mainChapterTitle: "Document"
    }];
  }

  return normalizeChapters(chapters, numPages);
}

function sanitizeFileName(name: string): string {
  // Replaces non-alphanumeric chars with underscore, removes duplicates, trims underscores
  return name.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

/**
 * Pads a string number to at least 2 digits (e.g. "1" -> "01", "10" -> "10")
 */
function pad(s: string): string {
  const n = parseInt(s, 10);
  return isNaN(n) ? s : n.toString().padStart(2, '0');
}

export async function splitPdfByChapters(
  file: File,
  chapters: Chapter[],
  granularity: Granularity,
  onProgress: (progress: number) => void
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const mainPdfDoc = await PDFDocument.load(arrayBuffer);
  const zip = new JSZip();
  const bookName = sanitizeFileName(file.name.replace(/\.pdf$/i, ''));

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const newPdfDoc = await PDFDocument.create();

    const pageIndices: number[] = [];
    const start = Math.max(1, chapter.startPage);
    const end = Math.min(mainPdfDoc.getPageCount(), chapter.endPage);

    for (let p = start - 1; p < end; p++) {
      pageIndices.push(p);
    }

    if (pageIndices.length > 0) {
      const copiedPages = await newPdfDoc.copyPages(mainPdfDoc, pageIndices);
      copiedPages.forEach(page => newPdfDoc.addPage(page));

      const pdfBytes = await newPdfDoc.save();

      // indexCode provided by AI or rule-based is usually in format "1.2.3" or "01.02.00"
      const rawIndex = chapter.indexCode || `${i + 1}.0.0`;
      const indexParts = rawIndex.split('.');

      const p1 = pad(indexParts[0] || String(i + 1));
      const p2 = pad(indexParts[1] || '0');
      const p3 = pad(indexParts[2] || '0');

      let formattedIndex = "";
      if (granularity === 1) {
        // [MainChapterNum]
        formattedIndex = p1;
      } else if (granularity === 2) {
        // [MainChapterNum].[SubChapterNum]
        formattedIndex = `${p1}.${p2}`;
      } else {
        // [MainChapterNum].[SubChapterNum].[SubSectionNum]
        formattedIndex = `${p1}.${p2}.${p3}`;
      }

      // We use the specific chapter title as the name part of the file
      const chapterName = sanitizeFileName(chapter.title);

      // Convention: [IndexCode]-[BookName]-[ChapterName].pdf
      const fileName = `${formattedIndex}-${bookName}-${chapterName}.pdf`;
      zip.file(fileName, pdfBytes);
    }

    onProgress(Math.round(((i + 1) / chapters.length) * 100));
  }

  // Final Zip naming is handled in App.tsx: [BookName]-Splited.zip
  return await zip.generateAsync({ type: "blob" });
}

