import type { Account } from '@ig-tracker/core';

function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function buildCsv(accounts: Account[]): string {
  const header = ['username', 'profile_url', 'followed_at'];
  const rows = accounts.map((a) => [
    a.username,
    a.href,
    a.followedAt ? new Date(a.followedAt * 1000).toISOString() : '',
  ]);
  return [header, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n');
}

export function downloadCsv(accounts: Account[], filename: string): void {
  const csv = buildCsv(accounts);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
