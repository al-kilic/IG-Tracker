'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import type { ParsedSnapshot } from '@ig-tracker/core';
import { db, type SnapshotRecord } from '@/lib/db';
export type { SnapshotRecord };

export const FREE_SNAPSHOT_LIMIT = 1;

export function useSnapshotList(): SnapshotRecord[] {
  return useLiveQuery(() => db.snapshots.orderBy('exportedAt').reverse().toArray(), [], []) ?? [];
}

export async function saveSnapshot(data: ParsedSnapshot, label?: string): Promise<number> {
  const autoLabel = `Upload ${format(new Date(data.exportedAt * 1000), 'MMM d, yyyy HH:mm')}`;
  return db.snapshots.add({
    label: label ?? autoLabel,
    exportedAt: data.exportedAt,
    savedAt: Math.floor(Date.now() / 1000),
    data,
  });
}

export async function deleteSnapshot(id: number): Promise<void> {
  return db.snapshots.delete(id);
}

export async function getSnapshot(id: number): Promise<SnapshotRecord | undefined> {
  return db.snapshots.get(id);
}

export async function updateSnapshotLabel(id: number, label: string): Promise<void> {
  await db.snapshots.update(id, { label });
}

export async function redateSnapshot(id: number, oldExportedAt: number, newExportedAt: number): Promise<void> {
  await db.transaction('rw', db.snapshots, db.triageStates, async () => {
    await db.snapshots.update(id, { exportedAt: newExportedAt });
    const records = await db.triageStates.where('snapshotKey').equals(oldExportedAt).toArray();
    for (const r of records) {
      if (r.id != null) await db.triageStates.update(r.id, { snapshotKey: newExportedAt });
    }
  });
}
