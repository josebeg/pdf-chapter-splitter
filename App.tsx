
import React, { useState, useEffect } from 'react';
import {
  Terminal,
  FileText,
  Split,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Trash2,
  Settings2,
  FileUp,
  X,
  Minus,
  Maximize2,
  Command
} from 'lucide-react';
import { AppStatus, Chapter, Granularity } from './types';
import { extractTextSummary, splitPdfByChapters, detectChapters } from './services/pdfService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [file, setFile] = useState<File | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [granularity, setGranularity] = useState<Granularity>(1);
  const [logs, setLogs] = useState<string[]>(['$ system.boot()', '$ loading dependencies...', '$ app.ready()']);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-12), `$ ${msg}`]);
  };

  const handleStartAnalysis = async () => {
    if (!file) return;
    setStatus(AppStatus.ANALYZING);
    addLog(`system.detect_chapters("${file.name}", granularity=${granularity})`);

    try {
      const detectedChapters = await detectChapters(file, granularity);
      setChapters(detectedChapters);
      setStatus(AppStatus.REVIEWING);
      addLog(`detection.complete(found=${detectedChapters.length})`);
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.message || 'Detection failure';
      setError(`FATAL_ERROR: ${errorMsg}`);
      addLog(`error: ${errorMsg}`);
      setStatus(AppStatus.ERROR);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile || selectedFile.type !== 'application/pdf') {
      setError('ERROR: Invalid PDF file format.');
      addLog('error: invalid file format');
      return;
    }
    setFile(selectedFile);
    setError(null);
    setStatus(AppStatus.STAGED);
    addLog(`file.staged("${selectedFile.name}")`);
  };

  const handleStartSplitting = async () => {
    if (!file || chapters.length === 0) return;
    setStatus(AppStatus.SPLITTING);
    addLog(`system.split_init(segments=${chapters.length})`);

    try {
      const blob = await splitPdfByChapters(file, chapters, granularity, (p) => {
        setProgress(p);
      });
      setZipBlob(blob);
      setStatus(AppStatus.COMPLETED);
      addLog('splitting.complete()');
    } catch (err: any) {
      console.error(err);
      setError('CORE_DUMP: Splitting failed.');
      addLog('error: splitting failure');
      setStatus(AppStatus.ERROR);
    }
  };

  const updateChapter = (id: string, updates: Partial<Chapter>) => {
    setChapters(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const removeChapter = (id: string) => {
    setChapters(prev => prev.filter(c => c.id !== id));
    addLog('segment.removed()');
  };

  const downloadZip = () => {
    if (!zipBlob || !file) return;
    const bookName = file.name.replace(/\.pdf$/i, '');
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${bookName}-Splited.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog('output.downloaded()');
  };

  const reset = () => {
    setFile(null);
    setChapters([]);
    setZipBlob(null);
    setProgress(0);
    setError(null);
    setStatus(AppStatus.IDLE);
    addLog('system.reboot()');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#1e2227] font-mono">
      {/* OS Simulation Header */}
      <header className="max-w-5xl w-full mb-8 flex justify-between items-end border-b border-[#3e4451] pb-4">
        <div>
          <h1 className="text-3xl font-black text-[#E7E7E7] flex items-center gap-3 italic">
            <Terminal size={32} />
            PDF SPLITTER v1.0.6
          </h1>
          <p className="text-[#5c6370] text-sm mt-1">Authorized User: splitter-admin</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[#98c379] text-xs font-bold uppercase tracking-widest">SYSTEM_STATUS: {status}</p>
          <p className="text-[#5c6370] text-[10px] tabular-nums">{new Date().toISOString()}</p>
        </div>
      </header>

      {/* Terminal Window Container */}
      <main className="max-w-5xl w-full bg-[#282c34] rounded-lg shadow-2xl border border-[#3e4451] overflow-hidden flex flex-col relative crt">
        <div className="scanline"></div>

        {/* Terminal Title Bar */}
        <div className="bg-[#21252b] px-4 py-2 flex items-center justify-between border-b border-[#181a1f]">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#e06c75] opacity-80"></div>
            <div className="w-3 h-3 rounded-full bg-[#e5c07b] opacity-80"></div>
            <div className="w-3 h-3 rounded-full bg-[#98c379] opacity-80"></div>
          </div>
          <div className="text-[#5c6370] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <Command size={10} />
            /usr/bin/pdf-splitter --interactive
          </div>
          <div className="w-12"></div>
        </div>

        <div className="flex flex-col lg:flex-row h-[500px]">

          {/* Main Console Content */}
          <div className="flex-grow flex flex-col p-6 overflow-y-auto custom-scrollbar relative">

            {/* 1. IDLE: Initial Upload */}
            {status === AppStatus.IDLE && (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-[#3e4451] rounded bg-[#21252b]/50 group relative cursor-pointer hover:bg-[#21252b] transition-all">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="text-[#c678dd] mb-4 animate-pulse">
                  <FileUp size={48} />
                </div>
                <h3 className="text-[#abb2bf] font-bold text-xl uppercase tracking-wider mb-2">INITIALIZE_UPLOAD</h3>
                <p className="text-[#5c6370] text-sm text-center">DRAG_DROP_FILE OR CLICK_TO_BROWSE.PDF</p>
                <div className="mt-8 px-4 py-1 border border-[#61afef] text-[#61afef] text-xs font-bold animate-bounce">WAITING_FOR_INPUT...</div>
              </div>
            )}

            {/* 2. STAGED: Configuration */}
            {status === AppStatus.STAGED && (
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
                      onClick={() => setGranularity(lvl as Granularity)}
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
                  <button onClick={reset} className="px-6 py-2 border border-[#e06c75] text-[#e06c75] font-bold text-xs uppercase hover:bg-[#e06c75]/10 transition-all">
                    ABORT_TASK
                  </button>
                  <button onClick={handleStartAnalysis} className="flex-grow px-8 py-2 bg-[#61afef] text-[#282c34] font-black text-xs uppercase flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                    EXECUTE_ANALYSIS <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* 3. ANALYZING: Loading */}
            {status === AppStatus.ANALYZING && (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-[#c678dd]" size={48} />
                <div className="text-center font-mono">
                  <p className="text-[#abb2bf] uppercase tracking-widest font-bold">ANALYZING_STRUCTURE</p>
                  <p className="text-[#5c6370] text-[10px] mt-1 animate-pulse italic">CORE_ENGINE: EXTRACTING_METADATA...</p>
                </div>
              </div>
            )}

            {/* 4. REVIEWING: Chapter List */}
            {status === AppStatus.REVIEWING && (
              <div className="flex flex-col h-full animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#3e4451]">
                  <h3 className="text-[#98c379] font-bold uppercase tracking-widest flex items-center gap-2">
                    <FileText size={16} /> SEGMENTS_DETECTED
                  </h3>
                  <button
                    onClick={() => setChapters([...chapters, { id: `manual-${Date.now()}`, title: 'MANUAL_SEGMENT', startPage: 1, endPage: 1, indexCode: `${chapters.length + 1}.0.0` }])}
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
                        onChange={(e) => updateChapter(chapter.id, { title: e.target.value })}
                      />
                      <div className="flex items-center gap-1 shrink-0 bg-[#282c34] px-2 py-1 border border-[#3e4451]">
                        <span className="text-[9px] text-[#5c6370] uppercase">Pg</span>
                        <input
                          type="number"
                          className="w-10 bg-transparent text-[#61afef] text-[11px] font-bold border-none p-0 focus:ring-0 outline-none"
                          value={chapter.startPage}
                          onChange={(e) => updateChapter(chapter.id, { startPage: parseInt(e.target.value) || 0 })}
                        />
                        <span className="text-[#3e4451] mx-1">-</span>
                        <input
                          type="number"
                          className="w-10 bg-transparent text-[#61afef] text-[11px] font-bold border-none p-0 focus:ring-0 outline-none"
                          value={chapter.endPage}
                          onChange={(e) => updateChapter(chapter.id, { endPage: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <button
                        onClick={() => removeChapter(chapter.id)}
                        className="text-[#5c6370] hover:text-[#e06c75] transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-[#3e4451] flex gap-3">
                  <button onClick={reset} className="px-6 py-2 border border-[#e06c75] text-[#e06c75] text-[10px] font-black uppercase tracking-widest">
                    RESET
                  </button>
                  <button onClick={handleStartSplitting} className="flex-grow py-2 bg-[#98c379] text-[#282c34] text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(152,195,121,0.2)]">
                    EXECUTE_SPLIT_SEQUENCES
                  </button>
                </div>
              </div>
            )}

            {/* 5. SPLITTING: Progress */}
            {status === AppStatus.SPLITTING && (
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
            )}

            {/* 6. COMPLETED: Download */}
            {status === AppStatus.COMPLETED && (
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
                    onClick={downloadZip}
                    className="py-4 bg-[#61afef] text-[#282c34] font-black text-sm uppercase flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[0_10px_20px_rgba(97,175,239,0.2)]"
                  >
                    <Download size={20} />
                    EXPORT_ZIP_ARCHIVE
                  </button>
                  <button
                    onClick={reset}
                    className="py-3 border border-[#3e4451] text-[#5c6370] font-bold text-[10px] uppercase hover:bg-[#3e4451]/20 transition-all"
                  >
                    RE-INITIALIZE_SYSTEM
                  </button>
                </div>
              </div>
            )}

            {/* 7. ERROR */}
            {status === AppStatus.ERROR && (
              <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                <div className="text-[#e06c75] mb-6 animate-bounce">
                  <AlertCircle size={64} strokeWidth={1} />
                </div>
                <h3 className="text-xl font-black text-[#e06c75] uppercase tracking-widest underline decoration-wavy">SYSTEM_FAILURE</h3>
                <div className="mt-4 p-4 border border-[#e06c75]/30 bg-[#e06c75]/5 rounded max-w-md w-full">
                  <p className="text-[#e06c75] font-mono text-[10px] break-words uppercase">{error}</p>
                </div>
                <button
                  onClick={reset}
                  className="mt-10 px-10 py-3 bg-[#e06c75] text-[#282c34] font-black text-xs uppercase tracking-widest hover:brightness-110"
                >
                  REBOOT_AND_CLEAR_CACHE
                </button>
              </div>
            )}

          </div>

          {/* Console Sidebar (Logs) */}
          <aside className="w-full lg:w-72 bg-[#21252b] border-t lg:border-t-0 lg:border-l border-[#181a1f] p-4 font-mono text-[10px] flex flex-col">
            <div className="text-[#5c6370] font-bold mb-3 uppercase flex items-center gap-2 border-b border-[#181a1f] pb-2">
              <span className="w-2 h-2 rounded-full bg-[#98c379] animate-pulse"></span>
              Live_Output
            </div>
            <div className="flex-grow space-y-1.5 overflow-hidden">
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-2 ${i === logs.length - 1 ? 'text-[#abb2bf]' : 'text-[#5c6370]'}`}>
                  <span className="shrink-0 text-[#61afef] opacity-50">[{i}]</span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
              <div className="flex gap-2 items-center">
                <span className="shrink-0 text-[#61afef] opacity-50">[{logs.length}]</span>
                <span className="w-1.5 h-3 bg-[#abb2bf] cursor-blink inline-block"></span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#181a1f]">
              <div className="text-[9px] text-[#5c6370] uppercase font-bold mb-2">Node_Metadata</div>
              <div className="grid grid-cols-2 gap-y-1 text-[8px] uppercase tracking-tighter">
                <span className="text-[#5c6370]">Kernel:</span> <span className="text-[#e5c07b]">OneDark_v2</span>
                <span className="text-[#5c6370]">Memory:</span> <span className="text-[#98c379]">OPTIMAL</span>
                <span className="text-[#5c6370]">IO:</span> <span className="text-[#61afef]">ACTIVE</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* OS Simulation Footer */}
      <footer className="mt-10 flex flex-col items-center">
        <div className="flex items-center gap-4 text-[#5c6370] text-[10px] font-bold tracking-[0.2em] uppercase">
          <span>{`{ ZERO_SERVER_IO }`}</span>
          <span className="w-1 h-1 bg-[#3e4451] rounded-full"></span>
          <span>{`{ CORE: HEURISTIC_v2 }`}</span>
          <span className="w-1 h-1 bg-[#3e4451] rounded-full"></span>
          <span>{`{ LIB: PDF_JS_ENV }`}</span>
        </div>
        <div className="mt-4 text-[#3e4451] text-[8px] italic opacity-50">
          WARNING: UNAUTHORIZED DATA EXTRACTION IS LOGGED BY KERNEL.
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #21252b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3e4451;
          border-radius: 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #61afef;
        }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        .crt {
          box-shadow: inset 0 0 100px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default App;
