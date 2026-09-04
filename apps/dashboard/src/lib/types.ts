// Mirrors channel-content-os's mcp-server/src/candidates/schemas.ts
// (CandidateLabel). This app owns NO canonical truth -- these are view
// types for data fetched over HTTP from that Worker's /api/* routes.
export type TriggerType =
  | 'SCHEDULED_OBSERVANCE'
  | 'NEWS_EVENT'
  | 'CONTENT_PLANNER'
  | 'EVERGREEN_TOPIC'
  | 'RESEARCH_EVENT'
  | 'PRODUCT_CONTENT'
  | 'MANUAL_REQUEST'
  | 'CHANNEL_EVENT';

export type ContentStatus = 'NOT_STARTED' | 'DRAFT' | 'CONTENT_READY' | 'BLOCKED';
export type DesignStatus = 'NOT_STARTED' | 'GENERATING' | 'DESIGN_READY' | 'BLOCKED' | 'REVISION_REQUIRED';
export type ReviewStatus = 'NOT_READY' | 'READY_FOR_REVIEW' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';
export type PublishStatus = 'NOT_READY' | 'READY_TO_SCHEDULE' | 'SCHEDULED' | 'PUBLISHED' | 'CANCELLED';

export interface CandidateLabel {
  candidateId: string;
  channelId: string;
  postArchetypeId: string | null;
  postArchetypeOrder: number | null;
  postArchetypeLabel: string | null;
  postSubtype: string | null;
  triggerType: TriggerType | null;
  triggerId: string | null;
  triggerLabel: string | null;
  contentStatus: ContentStatus;
  designStatus: DesignStatus;
  reviewStatus: ReviewStatus;
  publishStatus: PublishStatus;
  prepDate: string | null;
  publishDate: string | null;
  isDemo: boolean;
  renderUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelArchetype {
  id: string;
  order: number;
  label: string;
}

export interface Channel {
  channelId: string;
  name: string;
  archetypes: ChannelArchetype[];
}

export interface CandidateFilters {
  channelId?: string;
  postArchetypeId?: string;
  triggerType?: string;
  reviewStatus?: string;
  contentStatus?: string;
  designStatus?: string;
  publishStatus?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
}
