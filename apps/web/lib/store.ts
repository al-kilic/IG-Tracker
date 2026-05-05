'use client';

import { create } from 'zustand';
import type { ParsedSnapshot } from '@ig-tracker/core';

interface SnapshotStore {
  currentSnapshot: ParsedSnapshot | null;
  setSnapshot: (s: ParsedSnapshot) => void;
  clearSnapshot: () => void;
}

export const useSnapshotStore = create<SnapshotStore>((set) => ({
  currentSnapshot: null,
  setSnapshot: (s) => set({ currentSnapshot: s }),
  clearSnapshot: () => set({ currentSnapshot: null }),
}));
