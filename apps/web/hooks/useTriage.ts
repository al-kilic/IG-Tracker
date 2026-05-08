'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type TriageState, type TriageRecord } from '@/lib/db';

export type { TriageState };

export type TriageMap = Map<string, TriageState>;

export function useTriage(snapshotKey: number) {
  const records = useLiveQuery(
    () => db.triageStates.where('snapshotKey').equals(snapshotKey).toArray(),
    [snapshotKey],
    [] as TriageRecord[],
  );

  const triage: TriageMap = new Map(records.map(r => [r.username, r.state]));

  const setTriageState = useCallback(
    async (username: string, state: TriageState | null) => {
      if (state === null) {
        await db.triageStates
          .where('[snapshotKey+username]')
          .equals([snapshotKey, username])
          .delete();
      } else {
        const existing = await db.triageStates
          .where('[snapshotKey+username]')
          .equals([snapshotKey, username])
          .first();
        if (existing?.id != null) {
          await db.triageStates.update(existing.id, { state, updatedAt: Date.now() });
        } else {
          await db.triageStates.add({ snapshotKey, username, state, updatedAt: Date.now() });
        }
      }
    },
    [snapshotKey],
  );

  const bulkImportTriage = useCallback(
    async (entries: { username: string; state: TriageState }[]) => {
      const now = Date.now();
      const toAdd: TriageRecord[] = [];
      const toUpdate: { id: number; state: TriageState }[] = [];

      for (const { username, state } of entries) {
        const existing = await db.triageStates
          .where('[snapshotKey+username]')
          .equals([snapshotKey, username])
          .first();
        if (existing?.id != null) {
          toUpdate.push({ id: existing.id, state });
        } else {
          toAdd.push({ snapshotKey, username, state, updatedAt: now });
        }
      }

      await db.transaction('rw', db.triageStates, async () => {
        if (toAdd.length) await db.triageStates.bulkAdd(toAdd);
        for (const { id, state } of toUpdate) {
          await db.triageStates.update(id, { state, updatedAt: now });
        }
      });
    },
    [snapshotKey],
  );

  return { triage, setTriageState, bulkImportTriage };
}

export interface PriorSnapshotOption {
  snapshotKey: number;
  label: string;
  matchCount: number;
}

export function usePreviousTriage(
  currentSnapshotKey: number,
  usernames: Set<string>,
) {
  const [options, setOptions]           = useState<PriorSnapshotOption[]>([]);
  const [selectedKey, setSelectedKey]   = useState<number | null>(null);
  const [matches, setMatches]           = useState<Map<string, TriageState>>(new Map());
  const [loading, setLoading]           = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Load all prior snapshots with their match counts
  useEffect(() => {
    if (usernames.size === 0) { setLoading(false); return; }

    async function loadOptions() {
      const allSnapshots = await db.snapshots.orderBy('exportedAt').reverse().toArray();
      const priors = allSnapshots.filter(s => s.exportedAt !== currentSnapshotKey);
      if (!priors.length) { setLoading(false); return; }

      const opts: PriorSnapshotOption[] = await Promise.all(
        priors.map(async s => {
          const records = await db.triageStates.where('snapshotKey').equals(s.exportedAt).toArray();
          const matchCount = records.filter(r => usernames.has(r.username)).length;
          return { snapshotKey: s.exportedAt, label: s.label, matchCount };
        }),
      );

      const withMatches = opts.filter(o => o.matchCount > 0);
      setOptions(withMatches);
      if (withMatches.length > 0) setSelectedKey(withMatches[0]!.snapshotKey);
      setLoading(false);
    }

    void loadOptions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSnapshotKey]);

  // Load matches whenever selected snapshot changes
  useEffect(() => {
    if (selectedKey === null) { setMatches(new Map()); return; }
    setLoadingMatches(true);

    db.triageStates.where('snapshotKey').equals(selectedKey).toArray().then(records => {
      const map = new Map<string, TriageState>();
      for (const r of records) {
        if (usernames.has(r.username)) map.set(r.username, r.state);
      }
      setMatches(map);
      setLoadingMatches(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  return { options, selectedKey, setSelectedKey, matches, loading, loadingMatches };
}
