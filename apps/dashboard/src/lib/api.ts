import type { CandidateLabel, Channel, CandidateFilters } from './types';

// All writes go through channel-content-os's /api/* boundary -- this file
// never mutates candidate state directly (no localStorage as canonical
// state, no direct D1 access from the browser).
async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? `request failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchChannels(): Promise<Channel[]> {
  const res = await fetch('/api/channels');
  const data = await json<{ channels: Channel[] }>(res);
  return data.channels;
}

export async function fetchCandidates(filters: CandidateFilters = {}): Promise<CandidateLabel[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  const res = await fetch(`/api/candidates?${params.toString()}`);
  const data = await json<{ candidates: CandidateLabel[] }>(res);
  return data.candidates;
}

export async function fetchCandidate(id: string): Promise<CandidateLabel> {
  const res = await fetch(`/api/candidates/${encodeURIComponent(id)}`);
  const data = await json<{ candidate: CandidateLabel }>(res);
  return data.candidate;
}

export async function submitReview(id: string, verdict: 'accept' | 'revise' | 'reject', reason?: string): Promise<CandidateLabel> {
  const res = await fetch(`/api/candidates/${encodeURIComponent(id)}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ verdict, reason }),
  });
  const data = await json<{ candidate: CandidateLabel }>(res);
  return data.candidate;
}

export async function markReadyToSchedule(id: string): Promise<CandidateLabel> {
  const res = await fetch(`/api/candidates/${encodeURIComponent(id)}/ready-to-schedule`, { method: 'POST' });
  const data = await json<{ candidate: CandidateLabel }>(res);
  return data.candidate;
}
