import { Link } from 'react-router-dom';
import type { CandidateLabel } from '../lib/types';
import {
  channelDisplayName,
  archetypeOrderLabel,
  subtypeLabel,
  triggerTypeLabel,
  contentStatusLabel,
  designStatusLabel,
  reviewStatusLabel,
  formatDate,
} from '../lib/labels';
import { StatusPill } from './StatusPill';

export function CandidateCard({ candidate, channelName }: { candidate: CandidateLabel; channelName?: string }) {
  const subtype = subtypeLabel(candidate.postSubtype);
  const trigger = triggerTypeLabel(candidate.triggerType);
  return (
    <div className="candidate-card" data-testid="candidate-card">
      <div>
        <div className="candidate-channel">{channelDisplayName(candidate.channelId, channelName)}</div>
        <div className="candidate-archetype">{archetypeOrderLabel(candidate)}</div>
      </div>
      <div>
        <div className="candidate-title">
          {candidate.triggerLabel ?? 'Untitled candidate'}
          {candidate.isDemo && <span className="demo-badge">DEMO</span>}
        </div>
        <div className="candidate-meta">
          {subtype && <span>{subtype}</span>}
          {trigger && <span>{trigger}</span>}
          {candidate.researchMeta && <span>{candidate.researchMeta.researchAffinity}</span>}
          {candidate.researchMeta && <span>{candidate.researchMeta.accessLevel}</span>}
        </div>
        <div className="candidate-status-row">
          <StatusPill kind="content" value={candidate.contentStatus} label={contentStatusLabel(candidate.contentStatus)} />
          <StatusPill kind="design" value={candidate.designStatus} label={designStatusLabel(candidate.designStatus)} />
          <StatusPill kind="review" value={candidate.reviewStatus} label={reviewStatusLabel(candidate.reviewStatus)} />
          {candidate.evidenceStatus && (
            <StatusPill kind="review" value={candidate.evidenceStatus === 'VERIFIED' ? 'APPROVED' : candidate.evidenceStatus === 'BLOCKED' ? 'BLOCKED' : 'NOT_READY'} label={`Evidence: ${candidate.evidenceStatus}`} />
          )}
          {candidate.sourcesUsed && <span className="pill pill-not-ready">Sources: {candidate.sourcesUsed.length}</span>}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="candidate-dates">
          {candidate.publishDate && <div>Publish: {formatDate(candidate.publishDate)}</div>}
          {candidate.prepDate && <div>Prep: {formatDate(candidate.prepDate)}</div>}
        </div>
        <Link className="open-link" to={`/candidate/${candidate.candidateId}`}>
          Open →
        </Link>
      </div>
    </div>
  );
}
