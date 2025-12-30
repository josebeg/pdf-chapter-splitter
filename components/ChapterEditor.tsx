
import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { Chapter } from '../types';

interface ChapterEditorProps {
    chapters: Chapter[];
    onUpdateChapter: (id: string, updates: Partial<Chapter>) => void;
    onRemoveChapter: (id: string) => void;
    onAddChapter: () => void;
    onStartSplitting: () => void;
    onReset: () => void;
}

const ChapterEditor: React.FC<ChapterEditorProps> = ({
    chapters,
    onUpdateChapter,
    onRemoveChapter,
    onAddChapter,
    onStartSplitting,
    onReset
}) => {
    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#3e4451]">
                <h3 className="text-[#98c379] font-bold uppercase tracking-widest flex items-center gap-2">
                    <FileText size={16} /> SEGMENTS_DETECTED
                </h3>
                <button
                    onClick={onAddChapter}
                    className="text-[10px] font-bold text-[#61afef] border border-[#61afef] px-2 py-1 hover:bg-[#61afef]/10 uppercase transition-all"
                >
                    + NEW_NODE
                </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {chapters.map((chapter, idx) => (
                    <div key={chapter.id} className="group flex items-center gap-3 p-2 bg-[#21252b] border border-[#3e4451] hover:border-[#61afef] transition-all">
                        <div className="text-[10px] font-mono text-[#5c6370] w-12 shrink-0 border-r border-[#3e4451] pr-2">
                            [{chapter.indexCode || `${idx + 1}.0.0`}]
                        </div>
                        <input
                            className="flex-grow bg-transparent border-none text-[#abb2bf] text-xs font-mono focus:ring-0 outline-none uppercase"
                            value={chapter.title}
                            onChange={(e) => onUpdateChapter(chapter.id, { title: e.target.value })}
                        />
                        <div className="flex items-center gap-1 shrink-0 bg-[#282c34] px-2 py-1 border border-[#3e4451]">
                            <span className="text-[9px] text-[#5c6370] uppercase">Pg</span>
                            <input
                                type="number"
                                className="w-10 bg-transparent text-[#61afef] text-[11px] font-bold border-none p-0 focus:ring-0 outline-none"
                                value={chapter.startPage}
                                onChange={(e) => onUpdateChapter(chapter.id, { startPage: parseInt(e.target.value) || 0 })}
                            />
                            <span className="text-[#3e4451] mx-1">-</span>
                            <input
                                type="number"
                                className="w-10 bg-transparent text-[#61afef] text-[11px] font-bold border-none p-0 focus:ring-0 outline-none"
                                value={chapter.endPage}
                                onChange={(e) => onUpdateChapter(chapter.id, { endPage: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <button
                            onClick={() => onRemoveChapter(chapter.id)}
                            className="text-[#5c6370] hover:text-[#e06c75] transition-colors p-1"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#3e4451] flex gap-3">
                <button onClick={onReset} className="px-6 py-2 border border-[#e06c75] text-[#e06c75] text-[10px] font-black uppercase tracking-widest">
                    RESET
                </button>
                <button onClick={onStartSplitting} className="flex-grow py-2 bg-[#98c379] text-[#282c34] text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(152,195,121,0.2)]">
                    EXECUTE_SPLIT_SEQUENCES
                </button>
            </div>
        </div>
    );
};

export default ChapterEditor;
