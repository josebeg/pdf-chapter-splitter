
import React from 'react';
import { Loader2, CheckCircle, Download, AlertCircle } from 'lucide-react';
import { AppStatus } from '../types';

interface StatusDisplayProps {
    status: AppStatus;
    progress: number;
    error: string | null;
    onDownload: () => void;
    onReset: () => void;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({
    status,
    progress,
    error,
    onDownload,
    onReset
}) => {
    // 3. ANALYZING: Loading
    if (status === AppStatus.ANALYZING) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-[#c678dd]" size={48} />
                <div className="text-center font-mono">
                    <p className="text-[#abb2bf] uppercase tracking-widest font-bold">ANALYZING_STRUCTURE</p>
                    <p className="text-[#5c6370] text-[10px] mt-1 animate-pulse italic">CORE_ENGINE: EXTRACTING_METADATA...</p>
                </div>
            </div>
        );
    }

    // 5. SPLITTING: Progress
    if (status === AppStatus.SPLITTING) {
        return (
            <div className="h-full flex flex-col items-center justify-center py-12">
                <div className="w-full max-w-md border border-[#3e4451] p-1 mb-6">
                    <div className="bg-[#21252b] h-6 relative overflow-hidden">
                        <div
                            className="bg-[#61afef] h-full transition-all duration-300 ease-out flex items-center justify-center overflow-hidden"
                            style={{ width: `${progress}%` }}
                        >
                            <span className="text-[10px] font-black text-[#282c34] whitespace-nowrap">
                                {progress >= 20 ? `PROCESSING_PACKETS: ${progress}%` : ''}
                            </span>
                        </div>
                        {progress < 20 && (
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#5c6370]">
                                PROCESSING_PACKETS: {progress}%
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-[#5c6370] text-[10px] uppercase font-bold tracking-widest animate-pulse">
                    Splitting_Binaries... Please_Wait...
                </div>
            </div>
        );
    }

    // 6. COMPLETED: Download
    if (status === AppStatus.COMPLETED) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
                <div className="w-24 h-24 border-2 border-[#98c379] text-[#98c379] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(152,195,121,0.15)]">
                    <CheckCircle size={56} strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-black text-[#abb2bf] uppercase tracking-tighter mb-2 italic underline underline-offset-8 decoration-[#98c379]">TASK_READY_FOR_EXPORT</h3>
                <p className="text-[#5c6370] text-xs max-w-xs mx-auto mb-10 leading-relaxed uppercase">
                    PDF_CORE verified. Segments validated. Target binary mapped for extraction.
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <button
                        onClick={onDownload}
                        className="py-4 bg-[#61afef] text-[#282c34] font-black text-sm uppercase flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[0_10px_20px_rgba(97,175,239,0.2)]"
                    >
                        <Download size={20} />
                        EXPORT_ZIP_ARCHIVE
                    </button>
                    <button
                        onClick={onReset}
                        className="py-3 border border-[#3e4451] text-[#5c6370] font-bold text-[10px] uppercase hover:bg-[#3e4451]/20 transition-all"
                    >
                        RE-INITIALIZE_SYSTEM
                    </button>
                </div>
            </div>
        );
    }

    // 7. ERROR
    if (status === AppStatus.ERROR) {
        return (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                <div className="text-[#e06c75] mb-6 animate-bounce">
                    <AlertCircle size={64} strokeWidth={1} />
                </div>
                <h3 className="text-xl font-black text-[#e06c75] uppercase tracking-widest underline decoration-wavy">SYSTEM_FAILURE</h3>
                <div className="mt-4 p-4 border border-[#e06c75]/30 bg-[#e06c75]/5 rounded max-w-md w-full">
                    <p className="text-[#e06c75] font-mono text-[10px] break-words uppercase">{error}</p>
                </div>
                <button
                    onClick={onReset}
                    className="mt-10 px-10 py-3 bg-[#e06c75] text-[#282c34] font-black text-xs uppercase tracking-widest hover:brightness-110"
                >
                    REBOOT_AND_CLEAR_CACHE
                </button>
            </div>
        );
    }

    return null;
};

export default StatusDisplay;
