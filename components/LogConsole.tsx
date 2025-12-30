
import React from 'react';

interface LogConsoleProps {
    logs: string[];
}

const LogConsole: React.FC<LogConsoleProps> = ({ logs }) => {
    return (
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
                    <span className="text-[#5c6370]">Theme:</span> <span className="text-[#e5c07b]">OneDark_v2</span>
                    <span className="text-[#5c6370]">Memory:</span> <span className="text-[#98c379]">OPTIMAL</span>
                    <span className="text-[#5c6370]">IO:</span> <span className="text-[#61afef]">ACTIVE</span>
                </div>
            </div>
        </aside>
    );
};

export default LogConsole;
