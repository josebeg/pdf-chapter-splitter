
export interface Chapter {
  id: string;
  title: string;
  startPage: number; // 1-indexed
  endPage: number;   // 1-indexed
  indexCode?: string; // e.g., "1.2.0"
  mainChapterTitle?: string; // The parent main chapter name
}

export type Granularity = 1 | 2 | 3;

export interface PDFMetadata {
  name: string;
  pageCount: number;
  chapters: Chapter[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  STAGED = 'STAGED',
  ANALYZING = 'ANALYZING',
  REVIEWING = 'REVIEWING',
  SPLITTING = 'SPLITTING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
