import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCandidate, submitReview, markReadyToSchedule } from '../lib/api';
import type { CandidateLabel } from '../lib/types';
import {
  channelDisplayName,
  archetypeOrderLabel,
  subtypeLabel,
  triggerTypeLabel,
  contentStatusLabel,
  designStatusLabel,
  reviewStatusLabel,
  publishStatusLabel,
  formatDate,
} from '../lib/labels';
import { StatusPill } from '../components/StatusPill';

export function CandidateDetail() {
  const { id = '' } = useParams();
  const [candidate, setCandidate] = useState<CandidateLabel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revisionReason, setRevisionReason] = useState('');
  const [showRevisionInput, setShowRevisionInput] = useState(false);

  function load() {
    setLoading(true);
    fetchCandidate(id)
      .then(setCandidate)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function act(verdict: 'accept' | 'revise' | 'reject', reason?: string) {
    setError(null);
    try {
      const updated = await submitReview(id, verdict, reason);
      setCandidate(updated);
      setShowRevisionInput(false);
      setRevisionReason('');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function schedule() {
    setError(null);
    try {
      const updated = await markReadyToSchedule(id);
      setCandidate(updated);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (loading) return <div className="empty-state">Loading…</div>;
  if (!candidate) return <div className="empty-state">Candidate not found.</div>;

  const subtype = subtypeLabel(candidate.postSubtype);
  const trigger = triggerTypeLabel(candidate.triggerType);
  const isReadyForReview = candidate.reviewStatus === 'READY_FOR_REVIEW';

  return (
    <div>
      <div className="page-header">
        <div>
          <Link className="open-link" to="/queue">
            ← Back to Queue
          </Link>
          <h1 className="page-title" style={{ marginTop: 8 }}>
            {candidate.triggerLabel ?? 'Untitled candidate'}
            {candidate.isDemo && <span className="demo-badge">DEMO</span>}
          </h1>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="detail-grid">
        <div>
          <div className="detail-section">
            <h3>Identity</h3>
            <Field k="Channel" v={channelDisplayName(candidate.channelId)} />
            <Field k="Post Archetype" v={archetypeOrderLabel(candidate)} />
            {subtype && <Field k="Subtype" v={subtype} />}
          </div>

          <div className="detail-section">
            <h3>Trigger</h3>
            <Field k="Type" v={trigger ?? '—'} />
            {candidate.triggerId && <Field k="Reference" v={candidate.triggerId} />}
            <Field k="Label" v={candidate.triggerLabel ?? '—'} />
          </div>

          <div className="detail-section">
            <h3>Timing</h3>
            <Field k="Prep Date" v={formatDate(candidate.prepDate) ?? 'Not applicable'} />
            <Field k="Publish Date" v={formatDate(candidate.publishDate) ?? 'Not applicable'} />
          </div>

          {candidate.researchMeta && (
            <div className="detail-section">
              <h3>Research Paper</h3>
              <Field k="Study Type" v={candidate.researchMeta.studyType} />
              <Field k="Research Affinity" v={candidate.researchMeta.researchAffinity} />
              <Field k="Access Level" v={candidate.researchMeta.accessLevel} />
              <Field k="Peer Review Status" v={candidate.researchMeta.peerReviewStatus} />
              <Field k="Integrity Status" v={candidate.researchMeta.integrityStatus} />
              <Field k="Publication Date" v={formatDate(candidate.researchMeta.publicationDate) ?? candidate.researchMeta.publicationDate} />
              <Field k="Discovered At" v={formatDate(candidate.researchMeta.discoveredAt) ?? candidate.researchMeta.discoveredAt} />
              {candidate.researchMeta.doi && <Field k="DOI" v={candidate.researchMeta.doi} />}
              {candidate.researchMeta.pmid && <Field k="PMID" v={candidate.researchMeta.pmid} />}
            </div>
          )}

          {(candidate.evidenceStatus || candidate.sourcesUsed) && (
            <div className="detail-section">
              <h3>Evidence</h3>
              {candidate.evidenceStatus && <Field k="Status" v={candidate.evidenceStatus} />}
              {candidate.sourcesUsed && candidate.sourcesUsed.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  {candidate.sourcesUsed.map((s) => (
                    <div key={s.sourceId} className="detail-field">
                      <span>{s.sourceName}</span>
                      <span className="k">{s.sourceRole}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="detail-section">
            <h3>Design</h3>
            {candidate.renderUrl ? (
              <div className="render-preview">Render: {candidate.renderUrl}</div>
            ) : (
              <div className="render-preview">DESIGN NOT GENERATED</div>
            )}
          </div>
        </div>

        <div>
          <div className="detail-section">
            <h3>Status</h3>
            <div className="candidate-status-row" style={{ marginBottom: 8 }}>
              <StatusPill kind="content" value={candidate.contentStatus} label={contentStatusLabel(candidate.contentStatus)} />
            </div>
            <div className="candidate-status-row" style={{ marginBottom: 8 }}>
              <StatusPill kind="design" value={candidate.designStatus} label={designStatusLabel(candidate.designStatus)} />
            </div>
            <div className="candidate-status-row" style={{ marginBottom: 8 }}>
              <StatusPill kind="review" value={candidate.reviewStatus} label={reviewStatusLabel(candidate.reviewStatus)} />
            </div>
            <div className="candidate-status-row">
              <StatusPill kind="publish" value={candidate.publishStatus} label={publishStatusLabel(candidate.publishStatus)} />
            </div>
          </div>

          <div className="detail-section">
            <h3>Human Review</h3>
            {!isReadyForReview && candidate.reviewStatus !== 'APPROVED' && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Not ready for review yet.</p>
            )}
            <div className="review-actions">
              <button className="btn btn-approve" disabled={!isReadyForReview} onClick={() => act('accept')}>
                Approve
              </button>
              <button className="btn" disabled={!isReadyForReview} onClick={() => setShowRevisionInput((s) => !s)}>
                Request Revision
              </button>
              <button className="btn btn-reject" disabled={!isReadyForReview} onClick={() => act('reject')}>
                Reject
              </button>
            </div>
            {showRevisionInput && (
              <div>
                <textarea
                  className="revision-input"
                  rows={3}
                  placeholder="e.g. Başlık çok küçük."
                  value={revisionReason}
                  onChange={(e) => setRevisionReason(e.target.value)}
                />
                <button className="btn" style={{ marginTop: 6 }} disabled={!revisionReason.trim()} onClick={() => act('revise', revisionReason)}>
                  Submit Revision Request
                </button>
              </div>
            )}
            {candidate.reviewStatus === 'APPROVED' && candidate.publishStatus === 'NOT_READY' && (
              <button className="btn" style={{ marginTop: 12 }} onClick={schedule}>
                Move to Publish Queue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="detail-field">
      <span className="k">{k}</span>
      <span>{v}</span>
    </div>
  );
}
