'use client';

import { useRef, useState, useCallback, useId, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Upload, FileX, CheckCircle, AlertCircle } from 'lucide-react';
import {
  parseInstagramZip,
  InvalidZipError,
  MissingFilesError,
  SchemaValidationError,
  MixedFormatError,
  type ParsedSnapshot,
} from '@ig-tracker/core';
import { useSnapshotStore } from '@/lib/store';
import {
  useSnapshotList,
  saveSnapshot,
  deleteSnapshot,
  FREE_SNAPSHOT_LIMIT,
} from '@/hooks/useSnapshots';
import { UpgradeDialog } from '@/components/UpgradeDialog';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

type UploadState =
  | { status: 'idle' }
  | { status: 'dragging' }
  | { status: 'processing'; progress: number }
  | { status: 'error'; message: string }
  | { status: 'success' };

function userMessage(err: unknown): string {
  if (err instanceof MissingFilesError) return err.message;
  if (err instanceof InvalidZipError) return err.message;
  if (err instanceof SchemaValidationError) return err.message;
  if (err instanceof MixedFormatError) return err.message;
  if (err instanceof Error) return err.message;
  return 'Something went wrong parsing your file. Make sure you uploaded the correct Instagram ZIP.';
}

export function UploadZone() {
  const router = useRouter();
  const setSnapshot = useSnapshotStore((s) => s.setSnapshot);
  const snapshots = useSnapshotList();
  const [state, setState] = useState<UploadState>({ status: 'idle' });
  const [pendingSnapshot, setPendingSnapshot] = useState<ParsedSnapshot | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneId = useId();
  const statusId = useId();

  const commitSnapshot = useCallback(
    async (snapshot: ParsedSnapshot) => {
      await saveSnapshot(snapshot);
      setSnapshot(snapshot);
      setState({ status: 'success' });
      router.push('/results');
    },
    [router, setSnapshot],
  );

  const processFile = useCallback(
    async (file: File) => {
      if (
        !file.name.toLowerCase().endsWith('.zip') &&
        file.type !== 'application/zip' &&
        file.type !== 'application/x-zip-compressed'
      ) {
        setState({
          status: 'error',
          message: 'Please upload a .zip file — the one Instagram emailed you.',
        });
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setState({
          status: 'error',
          message: `File is too large (${Math.round(file.size / 1024 / 1024)} MB). Maximum is 500 MB.`,
        });
        return;
      }

      setState({ status: 'processing', progress: 0 });

      let tick = 0;
      const interval = setInterval(() => {
        tick += 1;
        setState((prev) =>
          prev.status === 'processing'
            ? { status: 'processing', progress: Math.min(85, tick * 3) }
            : prev,
        );
      }, 80);

      try {
        const snapshot = await parseInstagramZip(file);
        clearInterval(interval);
        setState({ status: 'processing', progress: 100 });
        await new Promise((r) => setTimeout(r, 300));

        if (snapshots.length >= FREE_SNAPSHOT_LIMIT) {
          setState({ status: 'idle' });
          setPendingSnapshot(snapshot);
        } else {
          await commitSnapshot(snapshot);
        }
      } catch (err) {
        clearInterval(interval);
        setState({ status: 'error', message: userMessage(err) });
      }
    },
    [snapshots.length, commitSnapshot],
  );

  const handleDeleteOldest = useCallback(async () => {
    if (!pendingSnapshot) return;
    const oldest = [...snapshots].sort((a, b) => a.savedAt - b.savedAt)[0];
    if (oldest?.id != null) await deleteSnapshot(oldest.id);
    await commitSnapshot(pendingSnapshot);
    setPendingSnapshot(null);
  }, [pendingSnapshot, snapshots, commitSnapshot]);

  const handleUpgrade = useCallback(async () => {
    // During beta: PAYMENTS_ENABLED=false → save without enforcing limit
    if (!pendingSnapshot) return;
    await commitSnapshot(pendingSnapshot);
    setPendingSnapshot(null);
  }, [pendingSnapshot, commitSnapshot]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
      else setState({ status: 'idle' });
    },
    [processFile],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState((prev) =>
      prev.status === 'idle' || prev.status === 'error' ? { status: 'dragging' } : prev,
    );
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setState((prev) => (prev.status === 'dragging' ? { status: 'idle' } : prev));
    }
  }, []);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = '';
    },
    [processFile],
  );

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  }, []);

  const isProcessing = state.status === 'processing';
  const isDragging = state.status === 'dragging';
  const oldest = [...snapshots].sort((a, b) => a.savedAt - b.savedAt)[0];

  // Mount-tracking for safe portal usage
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Portal to document.body so fixed backdrop escapes any stacking-context ancestors */}
      {mounted &&
        pendingSnapshot &&
        oldest &&
        createPortal(
          <UpgradeDialog
            oldestLabel={oldest.label}
            onDeleteOldest={handleDeleteOldest}
            onUpgrade={handleUpgrade}
            onClose={() => setPendingSnapshot(null)}
          />,
          document.body,
        )}

      <div className="w-full max-w-lg mx-auto flex flex-col gap-4">
        <input
          ref={inputRef}
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          onChange={onFileChange}
          disabled={isProcessing}
        />

        <div
          id={dropZoneId}
          role="button"
          tabIndex={isProcessing ? -1 : 0}
          aria-label="Upload Instagram ZIP file. Press Enter or Space to open file picker."
          aria-describedby={statusId}
          aria-disabled={isProcessing}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onKeyDown={onKeyDown}
          onClick={() => !isProcessing && inputRef.current?.click()}
          className={cn(
            'relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all duration-200 outline-none select-none',
            'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-foreground/20 hover:border-primary/60 hover:bg-foreground/[0.02]',
            isProcessing && 'cursor-default pointer-events-none',
            state.status === 'error' && 'border-red-400/50',
          )}
        >
          <DropZoneIcon status={state.status} />

          <div className="text-center">
            {state.status === 'processing' ? (
              <p className="font-medium">Parsing your export…</p>
            ) : isDragging ? (
              <p className="font-medium text-primary">Drop it here</p>
            ) : (
              <>
                <p className="font-medium">Drop your Instagram ZIP here</p>
                <p className="text-sm text-foreground/50 mt-1">or click to browse</p>
              </>
            )}
          </div>

          {state.status === 'processing' && <ProgressBar progress={state.progress} />}
        </div>

        <div id={statusId} aria-live="polite" aria-atomic="true" className="sr-only">
          {state.status === 'processing' && `Processing file, ${state.progress}% complete`}
          {state.status === 'success' && 'File parsed successfully. Redirecting to results.'}
          {state.status === 'error' && `Error: ${state.message}`}
        </div>

        {state.status === 'error' && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{state.message}</span>
          </div>
        )}

        <p className="text-center text-xs text-foreground/40">
          Max 500 MB · processed entirely in your browser · nothing is uploaded
        </p>

        {!isProcessing && (
          <Button variant="outline" className="mx-auto" onClick={() => inputRef.current?.click()}>
            Browse files
          </Button>
        )}
      </div>
    </>
  );
}

function DropZoneIcon({ status }: { status: UploadState['status'] }) {
  const base = 'size-12 transition-all duration-200';
  if (status === 'error') return <FileX className={cn(base, 'text-red-400')} />;
  if (status === 'success') return <CheckCircle className={cn(base, 'text-primary')} />;
  if (status === 'processing')
    return (
      <div
        className={cn(
          base,
          'rounded-full border-2 border-primary/30 border-t-primary animate-spin',
        )}
      />
    );
  if (status === 'dragging') return <Upload className={cn(base, 'text-primary -translate-y-1')} />;
  return <Upload className={cn(base, 'text-foreground/30')} />;
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-foreground/10 overflow-hidden">
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-full rounded-full bg-primary transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
