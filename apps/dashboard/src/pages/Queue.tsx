import { useState } from 'react';
import { useCandidates, useChannels } from '../lib/hooks';
import { FilterBar } from '../components/FilterBar';
import { CandidateCard } from '../components/CandidateCard';
import type { CandidateFilters } from '../lib/types';

interface Props {
  title: string;
  subtitle: string;
  fixedFilters?: CandidateFilters;
}

// Shared list view backing /queue, /review, /publish (each just fixes a
// different baseline filter) -- Batch P1 section 10/11.
export function Queue({ title, subtitle, fixedFilters = {} }: Props) {
  const { channels } = useChannels();
  const [filters, setFilters] = useState<CandidateFilters>({});
  const { candidates, loading, error } = useCandidates({ ...filters, ...fixedFilters });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <div className="page-subtitle">{subtitle}</div>
        </div>
      </div>
      <FilterBar channels={channels} filters={filters} onChange={setFilters} />
      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : candidates.length === 0 ? (
        <div className="empty-state">No candidates match these filters.</div>
      ) : (
        <div className="candidate-list">
          {candidates.map((c) => (
            <CandidateCard key={c.candidateId} candidate={c} channelName={channels.find((ch) => ch.channelId === c.channelId)?.name} />
          ))}
        </div>
      )}
    </div>
  );
}
