
import React from 'react';
import {
  Terminal,
  Command
} from 'lucide-react';
import { AppStatus } from './types';
import { usePDFProcessor } from './hooks/usePDFProcessor';
import FileUploader from './components/FileUploader';
import LogConsole from './components/LogConsole';
import ChapterEditor from './components/ChapterEditor';
import StatusDisplay from './components/StatusDisplay';

const App: React.FC = () => {
  const {
    status,
    chapters,
    logs,
    granularity,
    progress,
    handleFileSelect,
    startAnalysis,
    startSplitting,
    updateChapter,
    addChapter,
    removeChapter,
    downloadZip,
    reset,
    setGranularity
  } = usePDFProcessor();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#1e2227] font-mono">
      {/* OS Simulation Header */}
      <header className="max-w-5xl w-full mb-8 flex justify-between items-end border-b border-[#3e4451] pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#E7E7E7] flex items-center gap-3">
            <Terminal size={32} />
            PDF SPLITTER v1.0.6
          </h1>
          <p className="text-[#5c6370] text-xs mt-1">Authorized User: splitter-admin</p>
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

            {(status === AppStatus.IDLE || status === AppStatus.STAGED) && (
              <FileUploader
                status={status}
                granularity={granularity}
                onFileSelect={handleFileSelect}
                onSetGranularity={setGranularity}
                onStartAnalysis={startAnalysis}
                onReset={reset}
              />
            )}

            {status === AppStatus.REVIEWING && (
              <ChapterEditor
                chapters={chapters}
                onUpdateChapter={updateChapter}
                onRemoveChapter={removeChapter}
                onAddChapter={addChapter}
                onStartSplitting={startSplitting}
                onReset={reset}
              />
            )}

            {(status === AppStatus.ANALYZING || status === AppStatus.SPLITTING || status === AppStatus.COMPLETED || status === AppStatus.ERROR) && (
              <StatusDisplay
                status={status}
                progress={progress}
                error={status === AppStatus.ERROR ? "CORE_DUMP: Process failed." : null}
                onDownload={downloadZip}
                onReset={reset}
              />
            )}

          </div>

          <LogConsole logs={logs} />
        </div>
      </main>

      {/* OS Simulation Footer */}
      <footer className="mt-10 flex flex-col items-center">
        <div className="flex items-center gap-4 text-[#5c6370] text-[10px] font-bold tracking-[0.2em] uppercase">
          <span>{`{ ZERO_SERVER_IO }`}</span>
          <span className="w-1 h-1 bg-[#3e4451] rounded-full"></span>
          <span>{`{ CORE: HEURISTIC_v2 }`}</span>
        </div>
        <div className="mt-4 text-[#3e4451] text-[8px] italic opacity-50">
          WARNING: UNAUTHORIZED DATA EXTRACTION IS LOGGED BY KERNEL.
        </div>
      </footer>
    </div>
  );
};

export default App;
