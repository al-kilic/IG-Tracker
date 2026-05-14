'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { useSnapshotStore } from '@/lib/store';
import { useSnapshotList, deleteSnapshot, FREE_SNAPSHOT_LIMIT, type SnapshotRecord } from '@/hooks/useSnapshots';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { T } from '@/components/landing/tokens';
import { Icon } from '@/components/landing/atoms';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HistoryPage() {
  const router       = useRouter();
  const setSnapshot  = useSnapshotStore(s => s.setSnapshot);
  const snapshots    = useSnapshotList();
  const [deletingId, setDeletingId]     = useState<number | null>(null);
  const [compareBaseId, setCompareBase] = useState<number | null>(null);

  function handleView(record: SnapshotRecord) {
    setSnapshot(record.data);
    router.push('/results');
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    await deleteSnapshot(id);
    setDeletingId(null);
  }

  function handleCompare(baseId: number, targetId: number) {
    const base   = snapshots.find(s => s.id === baseId);
    const target = snapshots.find(s => s.id === targetId);
    if (!base || !target) return;
    const [old, cur] = base.exportedAt <= target.exportedAt ? [base, target] : [target, base];
    router.push(`/compare?old=${old.id}&current=${cur.id}`);
  }

  const slotsUsed = snapshots.length;
  const slotsLeft = FREE_SNAPSHOT_LIMIT - slotsUsed;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-4 sm:px-8 py-4 sticky top-0 z-50"
        style={{ borderBottom: `1px solid ${T.border1}`, backdropFilter: 'blur(14px)', background: T.navBg }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="WhoUnfollowed Logo" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6" style={{ fontSize: 13 }}>
          <Link href="/dashboard" style={{
            color: T.tealLight, textDecoration: 'none', fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 12px', borderRadius: 8,
            background: 'rgba(2,136,143,0.1)', border: '1px solid rgba(2,136,143,0.25)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.tealLight, display: 'inline-block' }} />
            Radar
          </Link>
          <Link href="/results" className="hidden sm:inline" style={{ color: T.inkDim, textDecoration: 'none' }}>Snapshot</Link>
          <Link href="/" className="hidden sm:inline" style={{ color: T.inkDim, textDecoration: 'none' }}>Home</Link>
          <ThemeToggle />
        </div>
      </nav>

      <main className="px-4 sm:px-8 py-10 sm:py-12" style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 12 }}>SNAPSHOT HISTORY</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink }}>
            Your snapshots.
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, marginTop: 10 }}>
            Upload exports over time to track who unfollowed you between each snapshot.
          </p>
        </div>

        {/* Slot indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderRadius: 12,
          background: slotsLeft === 0 ? 'rgba(168,75,47,0.06)' : 'rgba(244,240,232,0.02)',
          border: `1px solid ${slotsLeft === 0 ? 'rgba(168,75,47,0.25)' : 'rgba(244,240,232,0.06)'}`,
          marginBottom: 28,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: FREE_SNAPSHOT_LIMIT }).map((_, i) => (
                <div key={i} style={{ width: 28, height: 8, borderRadius: 4, background: i < slotsUsed ? T.tealMid : 'rgba(244,240,232,0.08)', transition: 'background 0.3s' }} />
              ))}
            </div>
            <span style={{ fontSize: 13, color: T.inkDim, fontFamily: T.mono }}>
              {slotsUsed} of {FREE_SNAPSHOT_LIMIT} free slots used
            </span>
          </div>
          {slotsLeft === 0 ? (
            <span style={{ fontSize: 12, color: T.terra, fontFamily: T.mono }}>Upgrade to Pro for unlimited history</span>
          ) : (
            <Link href="/" style={{
              fontSize: 13, fontWeight: 600, fontFamily: T.sans,
              color: T.cream, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '8px 16px', borderRadius: 10,
              background: T.teal, border: `1px solid rgba(2,136,143,0.5)`,
            }}>
              <Icon.upload size={13} color={T.cream} />
              Add New Snapshot
            </Link>
          )}
        </div>

        {/* Empty state */}
        {snapshots.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '80px 40px', borderRadius: 20, border: '1px dashed rgba(244,240,232,0.1)', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(244,240,232,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke={T.inkMute} strokeWidth="1.5"/>
                <path d="M8 2 V6 M16 2 V6 M3 10 H21" stroke={T.inkMute} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, marginBottom: 6 }}>No snapshots yet</div>
              <div style={{ fontSize: 14, color: T.inkDim }}>Upload your first Instagram export to get started.</div>
            </div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', borderRadius: 10, background: T.teal, color: T.cream, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans }}>
              <Icon.upload size={14} color={T.cream} />Upload ZIP
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {snapshots.map(record => (
              <SnapshotCard
                key={record.id}
                record={record}
                allSnapshots={snapshots}
                compareBaseId={compareBaseId}
                isDeleting={deletingId === record.id}
                onView={() => handleView(record)}
                onDelete={() => record.id != null && handleDelete(record.id)}
                onSetCompareBase={() => setCompareBase(compareBaseId === record.id ? null : (record.id ?? null))}
                onCompareWith={(targetId) => record.id != null && handleCompare(record.id, targetId)}
              />
            ))}
          </div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
}

// ─── Snapshot card ────────────────────────────────────────────────────────────

interface CardProps {
  record: SnapshotRecord;
  allSnapshots: SnapshotRecord[];
  compareBaseId: number | null;
  isDeleting: boolean;
  onView: () => void;
  onDelete: () => void;
  onSetCompareBase: () => void;
  onCompareWith: (targetId: number) => void;
}

function SnapshotCard({ record, allSnapshots, compareBaseId, isDeleting, onView, onDelete, onSetCompareBase, onCompareWith }: CardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isCompareBase = compareBaseId === record.id;
  const others        = allSnapshots.filter(s => s.id !== record.id);
  const followers     = record.data.followers.length;
  const following     = record.data.following.length;
  const followerSet   = new Set(record.data.followers.map(f => f.username));
  const nonFollowers  = record.data.following.filter(f => !followerSet.has(f.username)).length;

  return (
    <div style={{
      padding: '20px 24px', borderRadius: 16,
      background: isCompareBase ? 'rgba(2,136,143,0.06)' : 'rgba(244,240,232,0.02)',
      border: `1px solid ${isCompareBase ? 'rgba(2,136,143,0.3)' : 'rgba(244,240,232,0.06)'}`,
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(2,136,143,0.1)', border: '1px solid rgba(2,136,143,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke={T.tealMid} strokeWidth="1.5"/>
              <path d="M8 2 V6 M16 2 V6 M3 10 H21" stroke={T.tealMid} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.serif, fontSize: 19, color: T.ink, letterSpacing: '-0.01em', marginBottom: 4 }}>{record.label}</div>
            <div style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono }}>
              {followers.toLocaleString()} followers · {following.toLocaleString()} following · saved {format(new Date(record.savedAt * 1000), 'MMM d, yyyy')}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: T.serif, fontSize: 26, color: T.tealLight, letterSpacing: '-0.02em', lineHeight: 1 }}>{nonFollowers.toLocaleString()}</div>
          <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.06em', marginTop: 2 }}>NON-FOLLOWERS</div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        <button onClick={onView} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(244,240,232,0.12)', background: 'transparent', color: T.ink, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>
          View results
        </button>

        {!isCompareBase && others.length > 0 ? (
          compareBaseId == null ? (
            <button onClick={onSetCompareBase} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(244,240,232,0.12)', background: 'transparent', color: T.inkDim, fontSize: 12, cursor: 'pointer', fontFamily: T.sans }}>
              Compare
            </button>
          ) : (
            <button onClick={() => onCompareWith(compareBaseId)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: `1px solid rgba(2,136,143,0.4)`, background: 'rgba(2,136,143,0.08)', color: T.tealLight, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>
              Compare with selected
            </button>
          )
        ) : isCompareBase ? (
          <span style={{ fontSize: 12, color: T.tealLight, fontFamily: T.mono }}>Selected. Pick another to compare.</span>
        ) : null}

        <div style={{ marginLeft: 'auto' }}>
          {confirmDelete ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: T.inkDim }}>Delete?</span>
              <button onClick={() => setConfirmDelete(false)} style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid rgba(244,240,232,0.12)', background: 'transparent', color: T.inkDim, fontSize: 12, cursor: 'pointer', fontFamily: T.sans }}>Cancel</button>
              <button onClick={onDelete} disabled={isDeleting} style={{ padding: '6px 12px', borderRadius: 7, border: `1px solid rgba(168,75,47,0.4)`, background: 'rgba(168,75,47,0.12)', color: T.terra, fontSize: 12, fontWeight: 600, cursor: isDeleting ? 'not-allowed' : 'pointer', fontFamily: T.sans }}>
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              aria-label={`Delete ${record.label}`}
              style={{ padding: '8px', borderRadius: 8, border: 'none', background: 'transparent', color: T.inkMute, cursor: 'pointer', display: 'flex' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = T.terra; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = T.inkMute; }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 4 H13 M5 4 V2.5 A0.5 0.5 0 0 1 5.5 2 H9.5 A0.5 0.5 0 0 1 10 2.5 V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M4 4 L5 13 H10 L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
