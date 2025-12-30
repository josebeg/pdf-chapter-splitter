
import React from 'react';
import { FileUp, Settings2, ChevronRight } from 'lucide-react';
import { AppStatus, Granularity } from '../types';

interface FileUploaderProps {
    status: AppStatus;
    granularity: Granularity;
    onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSetGranularity: (g: Granularity) => void;
    onStartAnalysis: () => void;
    onReset: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
    status,
    granularity,
    onFileSelect,
    onSetGranularity,
    onStartAnalysis,
    onReset
}) => {
    if (status === AppStatus.IDLE) {
        return (
            <div className="h-full flex flex-col items-center justify-center border border-dashed border-[#3e4451] rounded bg-[#21252b]/50 group relative cursor-pointer hover:bg-[#21252b] transition-all">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={onFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="text-[#c678dd] mb-4 animate-pulse">
                    <FileUp size={48} />
                </div>
                <h3 className="text-[#abb2bf] font-bold text-xl uppercase tracking-wider mb-2">INITIALIZE_UPLOAD</h3>
                <p className="text-[#5c6370] text-sm text-center">DRAG_DROP_FILE OR CLICK_TO_BROWSE.PDF</p>
                <div className="mt-8 px-4 py-1 border border-[#61afef] text-[#61afef] text-xs font-bold animate-bounce">WAITING_FOR_INPUT...</div>
            </div>
        );
    }

    if (status === AppStatus.STAGED) {
        return (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="mb-6 border-l-4 border-[#e5c07b] bg-[#21252b] p-4">
                    <h3 className="text-[#e5c07b] font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Settings2 size={16} /> SETUP_PARAMETERS
                    </h3>
                    <p className="text-[#5c6370] text-xs italic">Define splitting granularity for internal engine.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {[1, 2, 3].map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => onSetGranularity(lvl as Granularity)}
                            className={`p-4 rounded border text-left transition-all ${granularity === lvl
                                ? 'border-[#61afef] bg-[#61afef]/10 shadow-[0_0_15px_rgba(97,175,239,0.2)]'
                                : 'border-[#3e4451] bg-transparent hover:border-[#abb2bf]'
                                }`}
                        >
                            <div className="text-[10px] font-bold text-[#5c6370] uppercase mb-1">MODULE_LVL_0{lvl}</div>
                            <div className={`font-bold uppercase ${granularity === lvl ? 'text-[#61afef]' : 'text-[#abb2bf]'}`}>
                                {lvl === 1 ? 'Main' : lvl === 2 ? 'Sub' : 'Deep'}
                            </div>
                            <p className="text-[10px] text-[#5c6370] mt-2 leading-tight uppercase">
                                {lvl === 1 && 'Logic: High-level chapters only.'}
                                {lvl === 2 && 'Logic: Medium precision analysis.'}
                                {lvl === 3 && 'Logic: Maximum segment detection.'}
                            </p>
                        </button>
                    ))}
                </div>

                <div className="flex gap-4">
                    <button onClick={onReset} className="px-6 py-2 border border-[#e06c75] text-[#e06c75] font-bold text-xs uppercase hover:bg-[#e06c75]/10 transition-all">
                        ABORT_TASK
                    </button>
                    <button onClick={onStartAnalysis} className="flex-grow px-8 py-2 bg-[#61afef] text-[#282c34] font-black text-xs uppercase flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                        EXECUTE_ANALYSIS <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default FileUploader;
