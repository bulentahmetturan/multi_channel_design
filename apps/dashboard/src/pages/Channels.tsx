import { Link } from 'react-router-dom';
import { useChannels, useCandidates } from '../lib/hooks';

// Channel overview -- visibility only, no config editing (Batch P1 section 33).
export function Channels() {
  const { channels, loading: channelsLoading } = useChannels();
  const { candidates, loading: candidatesLoading } = useCandidates({});

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Channels</h1>
          <div className="page-subtitle">What is happening in each project</div>
        </div>
      </div>
      {channelsLoading || candidatesLoading ? (
        <div className="empty-state">Loading…</div>
      ) : channels.length === 0 ? (
        <div className="empty-state">No channels registered yet.</div>
      ) : (
        <div className="channel-grid">
          {channels.map((ch) => {
            const chCandidates = candidates.filter((c) => c.channelId === ch.channelId);
            const readyForReview = chCandidates.filter((c) => c.reviewStatus === 'READY_FOR_REVIEW').length;
            const upcoming = chCandidates.filter((c) => c.prepDate || c.publishDate).length;
            const approved = chCandidates.filter((c) => c.reviewStatus === 'APPROVED').length;
            return (
              <Link key={ch.channelId} to={`/queue?channelId=${ch.channelId}`} className="channel-tile">
                <h3>{ch.name}</h3>
                <div className="stat-row">
                  <span>Candidates</span>
                  <span>{chCandidates.length}</span>
                </div>
                <div className="stat-row">
                  <span>Ready for review</span>
                  <span>{readyForReview}</span>
                </div>
                <div className="stat-row">
                  <span>Upcoming</span>
                  <span>{upcoming}</span>
                </div>
                <div className="stat-row">
                  <span>Approved / ready to schedule</span>
                  <span>{approved}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
