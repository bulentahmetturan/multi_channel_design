import { useCandidates } from '../lib/hooks';

function count(candidates: ReturnType<typeof useCandidates>['candidates'], pred: (c: (typeof candidates)[number]) => boolean) {
  return candidates.filter(pred).length;
}

// Operations dashboard: "what needs my attention?" -- compact actionable
// metrics, not a BI chart wall (Batch P1 section 9).
export function Dashboard() {
  const { candidates, loading, error } = useCandidates({});

  const upcoming = count(candidates, (c) => !!(c.prepDate || c.publishDate));
  const contentReady = count(candidates, (c) => c.contentStatus === 'CONTENT_READY');
  const designReady = count(candidates, (c) => c.designStatus === 'DESIGN_READY');
  const readyForReview = count(candidates, (c) => c.reviewStatus === 'READY_FOR_REVIEW');
  const revisionRequested = count(candidates, (c) => c.reviewStatus === 'REVISION_REQUESTED');
  const approved = count(candidates, (c) => c.reviewStatus === 'APPROVED');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <div className="page-subtitle">What needs attention across all channels</div>
        </div>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : (
        <div className="metrics-row">
          <Metric value={upcoming} label="Upcoming candidates" />
          <Metric value={contentReady} label="Content ready" />
          <Metric value={designReady} label="Designs ready" />
          <Metric value={readyForReview} label="Ready for review" />
          <Metric value={revisionRequested} label="Revision requested" />
          <Metric value={approved} label="Approved / ready to schedule" />
        </div>
      )}
    </div>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="metric-tile" data-testid="metric-tile">
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
    </div>
  );
}
