import Dexie, { type Table } from 'dexie';
import type { ParsedSnapshot } from '@ig-tracker/core';

export interface SnapshotRecord {
  id?: number;
  label: string;
  exportedAt: number;
  savedAt: number;
  data: ParsedSnapshot;
}

export type TriageState = 'not_a_fan' | 'let_it_slide' | 'done' | 'check_later' | 'deactivated';

export interface TriageRecord {
  id?: number;
  snapshotKey: number; // exportedAt timestamp
  username: string;
  state: TriageState;
  updatedAt: number;
}

class IgTrackerDb extends Dexie {
  snapshots!: Table<SnapshotRecord, number>;
  triageStates!: Table<TriageRecord, number>;

  constructor() {
    super('ig-tracker');
    this.version(1).stores({
      snapshots: '++id, exportedAt, savedAt',
    });
    this.version(2).stores({
      snapshots: '++id, exportedAt, savedAt',
      triageStates: '++id, [snapshotKey+username], snapshotKey',
    });
  }
}

export const db = new IgTrackerDb();
