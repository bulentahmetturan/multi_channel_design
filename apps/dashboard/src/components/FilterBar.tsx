import type { CandidateFilters, Channel } from '../lib/types';

const TRIGGER_TYPES = [
  'SCHEDULED_OBSERVANCE',
  'NEWS_EVENT',
  'CONTENT_PLANNER',
  'EVERGREEN_TOPIC',
  'RESEARCH_EVENT',
  'PRODUCT_CONTENT',
  'MANUAL_REQUEST',
  'CHANNEL_EVENT',
];
const CONTENT_STATUSES = ['NOT_STARTED', 'DRAFT', 'CONTENT_READY', 'BLOCKED'];
const DESIGN_STATUSES = ['NOT_STARTED', 'GENERATING', 'DESIGN_READY', 'BLOCKED', 'REVISION_REQUIRED'];
const REVIEW_STATUSES = ['NOT_READY', 'READY_FOR_REVIEW', 'APPROVED', 'REJECTED', 'REVISION_REQUESTED'];

interface Props {
  channels: Channel[];
  filters: CandidateFilters;
  onChange: (next: CandidateFilters) => void;
}

// The Content Queue's primary filters (Batch P1 section 11/12/13). The
// post-archetype options resolve from the SELECTED channel's own
// configuration -- never a global assumed list.
export function FilterBar({ channels, filters, onChange }: Props) {
  const selectedChannel = channels.find((c) => c.channelId === filters.channelId);

  function set<K extends keyof CandidateFilters>(key: K, value: string) {
    onChange({ ...filters, [key]: value || undefined, ...(key === 'channelId' ? { postArchetypeId: undefined } : {}) });
  }

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="filter-bar" role="search" aria-label="Candidate filters">
      <select aria-label="Channel" value={filters.channelId ?? ''} onChange={(e) => set('channelId', e.target.value)}>
        <option value="">All Channels</option>
        {channels.map((c) => (
          <option key={c.channelId} value={c.channelId}>
            {c.name}
          </option>
        ))}
      </select>

      <select aria-label="Post Archetype" value={filters.postArchetypeId ?? ''} onChange={(e) => set('postArchetypeId', e.target.value)} disabled={!selectedChannel}>
        <option value="">All Post Types</option>
        {(selectedChannel?.archetypes ?? []).map((a) => (
          <option key={a.id} value={a.id}>
            {String(a.order).padStart(2, '0')} · {a.label}
          </option>
        ))}
      </select>

      <select aria-label="Trigger Type" value={filters.triggerType ?? ''} onChange={(e) => set('triggerType', e.target.value)}>
        <option value="">All Triggers</option>
        {TRIGGER_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select aria-label="Content Status" value={filters.contentStatus ?? ''} onChange={(e) => set('contentStatus', e.target.value)}>
        <option value="">All Content Status</option>
        {CONTENT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select aria-label="Design Status" value={filters.designStatus ?? ''} onChange={(e) => set('designStatus', e.target.value)}>
        <option value="">All Design Status</option>
        {DESIGN_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select aria-label="Review Status" value={filters.reviewStatus ?? ''} onChange={(e) => set('reviewStatus', e.target.value)}>
        <option value="">All Review Status</option>
        {REVIEW_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <input aria-label="From date" type="date" value={filters.fromDate ?? ''} onChange={(e) => set('fromDate', e.target.value)} />
      <input aria-label="To date" type="date" value={filters.toDate ?? ''} onChange={(e) => set('toDate', e.target.value)} />

      <input aria-label="Search" type="text" placeholder="Search trigger/topic…" value={filters.search ?? ''} onChange={(e) => set('search', e.target.value)} />

      {hasFilters && (
        <button className="clear" onClick={() => onChange({})}>
          Clear filters
        </button>
      )}
    </div>
  );
}
