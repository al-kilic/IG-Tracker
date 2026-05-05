import Dexie, { type Table } from 'dexie';
import type { ParsedSnapshot } from '@ig-tracker/core';

export interface SnapshotRecord {
  id?: number;
  label: string;
  exportedAt: number;
  savedAt: number;
  data: ParsedSnapshot;
}

class IgTrackerDb extends Dexie {
  snapshots!: Table<SnapshotRecord, number>;

  constructor() {
    super('ig-tracker');
    this.version(1).stores({
      snapshots: '++id, exportedAt, savedAt',
    });
  }
}

export const db = new IgTrackerDb();
