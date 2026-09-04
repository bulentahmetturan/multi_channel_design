import type { CandidateLabel } from './types';

// Batch P1 section 6: label presentation contract. Structured metadata is
// resolved into display strings HERE, at render time -- never stored as
// formatted text anywhere upstream.
const TRIGGER_TYPE_LABELS: Record<string, string> = {
  SCHEDULED_OBSERVANCE: 'Scheduled Observance',
  NEWS_EVENT: 'News Event',
  CONTENT_PLANNER: 'Content Planner',
  EVERGREEN_TOPIC: 'Evergreen Topic',
  RESEARCH_EVENT: 'Research Event',
  RESEARCH_PUBLICATION_EVENT: 'Research Publication Event',
  HISTORICAL_RESEARCH_DISCOVERY: 'Historical Research Discovery',
  PRODUCT_CONTENT: 'Product Content',
  MANUAL_REQUEST: 'Manual Request',
  CHANNEL_EVENT: 'Channel Event',
};

const REVIEW_STATUS_LABELS: Record<string, string> = {
  NOT_READY: 'Not Ready',
  READY_FOR_REVIEW: 'Ready for Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  REVISION_REQUESTED: 'Revision Requested',
};

const CONTENT_STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: 'Content Not Started',
  DRAFT: 'Content Draft',
  CONTENT_READY: 'Content Ready',
  BLOCKED: 'Content Blocked',
};

const DESIGN_STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: 'Design Not Started',
  GENERATING: 'Design Generating',
  DESIGN_READY: 'Design Ready',
  BLOCKED: 'Design Blocked',
  REVISION_REQUIRED: 'Design Revision Required',
};

const PUBLISH_STATUS_LABELS: Record<string, string> = {
  NOT_READY: 'Not Ready',
  READY_TO_SCHEDULE: 'Ready to Schedule',
  SCHEDULED: 'Scheduled',
  PUBLISHED: 'Published',
  CANCELLED: 'Cancelled',
};

function titleCase(s: string): string {
  return s
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function channelDisplayName(channelId: string, knownName?: string): string {
  return knownName ?? titleCase(channelId);
}

export function archetypeOrderLabel(candidate: Pick<CandidateLabel, 'postArchetypeOrder' | 'postArchetypeLabel' | 'postArchetypeId'>): string {
  const label = candidate.postArchetypeLabel ?? candidate.postArchetypeId ?? 'Unlabeled';
  if (candidate.postArchetypeOrder == null) return label;
  return `${String(candidate.postArchetypeOrder).padStart(2, '0')} · ${label}`;
}

export function subtypeLabel(postSubtype: string | null): string | null {
  if (!postSubtype) return null;
  return titleCase(postSubtype);
}

export function triggerTypeLabel(triggerType: string | null): string | null {
  if (!triggerType) return null;
  return TRIGGER_TYPE_LABELS[triggerType] ?? titleCase(triggerType.toLowerCase().replace(/_/g, '-'));
}

export function reviewStatusLabel(reviewStatus: string): string {
  return REVIEW_STATUS_LABELS[reviewStatus] ?? reviewStatus;
}
export function contentStatusLabel(contentStatus: string): string {
  return CONTENT_STATUS_LABELS[contentStatus] ?? contentStatus;
}
export function designStatusLabel(designStatus: string): string {
  return DESIGN_STATUS_LABELS[designStatus] ?? designStatus;
}
export function publishStatusLabel(publishStatus: string): string {
  return PUBLISH_STATUS_LABELS[publishStatus] ?? publishStatus;
}

export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}
