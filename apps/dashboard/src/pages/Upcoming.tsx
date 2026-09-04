import { useCandidates } from '../lib/hooks';
import { Link } from 'react-router-dom';
import { channelDisplayName, archetypeOrderLabel, formatDate } from '../lib/labels';

// Date-prioritized view (Batch P1 section 14) -- works off candidate data
// already available; no scheduler/cron.
export function Upcoming() {
  const { candidates, loading, error } = useCandidates({});

  const rows = candidates
    .flatMap((c) => {
      const entries: { date: string; label: string; candidateId: string }[] = [];
      if (c.prepDate) entries.push({ date: c.prepDate, label: `${archetypeOrderLabel(c)} — ${c.triggerLabel ?? 'Untitled'} preparation begins`, candidateId: c.candidateId });
      if (c.publishDate) entries.push({ date: c.publishDate, label: `${archetypeOrderLabel(c)} — ${c.triggerLabel ?? 'Untitled'} publish target`, candidateId: c.candidateId });
      return entries.map((e) => ({ ...e, channel: channelDisplayName(c.channelId) }));
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Upcoming</h1>
          <div className="page-subtitle">Candidates with an approaching prep or publish date</div>
        </div>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="empty-state">Nothing upcoming yet.</div>
      ) : (
        <div className="upcoming-list">
          {rows.map((r, i) => (
            <Link key={i} className="upcoming-row" to={`/candidate/${r.candidateId}`}>
              <div className="upcoming-date">{formatDate(r.date)}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{r.channel}</div>
                <div style={{ color: 'var(--text-muted)' }}>{r.label}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
