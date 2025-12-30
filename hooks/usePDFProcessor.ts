
import React, { useState, useCallback, useRef } from 'react';
import { AppStatus, Chapter, Granularity } from '../types';
import { PDFProcessor } from '../services/pdfService';

export function usePDFProcessor() {
    const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
    const [file, setFile] = useState<File | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [logs, setLogs] = useState<string[]>(['$ system.boot()', '$ loading dependencies...', '$ app.ready()']);
    const [granularity, setGranularity] = useState<Granularity>(1);
    const [progress, setProgress] = useState(0);
    const [resultZip, setResultZip] = useState<Blob | null>(null);

    const processorRef = useRef<PDFProcessor | null>(null);

    const addLog = useCallback((msg: string) => {
        setLogs(prev => [...prev.slice(-12), `$ ${msg}`]);
    }, []);

    const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile || selectedFile.type !== 'application/pdf') {
            addLog('error: invalid file format');
            return;
        }
        setFile(selectedFile);
        setStatus(AppStatus.STAGED);
        addLog(`file.staged("${selectedFile.name}")`);

        processorRef.current = new PDFProcessor(selectedFile);
    }, [addLog]);

    const startAnalysis = useCallback(async () => {
        if (!file || !processorRef.current) return;

        setStatus(AppStatus.ANALYZING);
        addLog(`system.detect_chapters("${file.name}", granularity=${granularity})`);

        try {
            const detectedChapters = await processorRef.current.detectChapters(granularity);
            setChapters(detectedChapters);
            addLog(`detection.complete(found=${detectedChapters.length})`);
            setStatus(AppStatus.REVIEWING);
        } catch (error: any) {
            addLog(`error: ${error.message || 'Detection failure'}`);
            setStatus(AppStatus.ERROR);
        }
    }, [file, granularity, addLog]);

    const startSplitting = useCallback(async () => {
        if (!file || !processorRef.current || chapters.length === 0) return;

        setStatus(AppStatus.SPLITTING);
        setProgress(0);
        addLog(`system.split_init(segments=${chapters.length})`);

        try {
            const zipBlob = await processorRef.current.splitPdfByChapters(
                chapters,
                granularity,
                (p) => setProgress(p)
            );
            setResultZip(zipBlob);
            addLog("splitting.complete()");
            setStatus(AppStatus.COMPLETED);
        } catch (error: any) {
            addLog("error: splitting failure");
            setStatus(AppStatus.ERROR);
        }
    }, [file, chapters, granularity, addLog]);

    const updateChapter = useCallback((id: string, updates: Partial<Chapter>) => {
        setChapters(prev => prev.map(ch => ch.id === id ? { ...ch, ...updates } : ch));
    }, []);

    const addChapter = useCallback(() => {
        const newChapter: Chapter = {
            id: `manual-${Date.now()}`,
            title: 'MANUAL_SEGMENT',
            startPage: 1,
            endPage: 1,
            indexCode: `${chapters.length + 1}.0.0`
        };
        setChapters(prev => [...prev, newChapter]);
    }, [chapters]);

    const removeChapter = useCallback((id: string) => {
        const updated = chapters.filter(ch => ch.id !== id);
        setChapters(updated);
        addLog(`segment.removed()`);
    }, [chapters, addLog]);

    const downloadZip = useCallback(() => {
        if (!resultZip || !file) return;
        const url = URL.createObjectURL(resultZip);
        const link = document.createElement('a');
        const bookName = file.name.replace(/\.pdf$/i, '');
        link.href = url;
        link.download = `${bookName}-Splited.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        addLog("output.downloaded()");
    }, [resultZip, file, addLog]);

    const reset = useCallback(() => {
        setFile(null);
        setChapters([]);
        setStatus(AppStatus.IDLE);
        setProgress(0);
        setResultZip(null);
        processorRef.current = null;
        addLog("system.reboot()");
    }, [addLog]);

    return {
        status,
        file,
        chapters,
        logs,
        granularity,
        progress,
        resultZip,
        handleFileSelect,
        startAnalysis,
        startSplitting,
        updateChapter,
        addChapter,
        removeChapter,
        downloadZip,
        reset,
        setGranularity
    };
}
