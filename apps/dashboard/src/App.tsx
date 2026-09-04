import { NavLink, Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Queue } from './pages/Queue';
import { Upcoming } from './pages/Upcoming';
import { Calendar } from './pages/Calendar';
import { Channels } from './pages/Channels';
import { CandidateDetail } from './pages/CandidateDetail';

const NAV = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/upcoming', label: 'Upcoming' },
  { to: '/queue', label: 'Content Queue' },
  { to: '/review', label: 'Ready for Review' },
  { to: '/approved', label: 'Approved' },
  { to: '/revision', label: 'Revision Requested' },
  { to: '/publish', label: 'Publish Queue' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/channels', label: 'Channels' },
];

export default function App() {
  return (
    <div className="app-shell">
      <nav className="sidebar">
        <div className="sidebar-title">Content Operations</div>
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/queue" element={<Queue title="Content Queue" subtitle="All candidates across all channels" />} />
          <Route
            path="/review"
            element={<Queue title="Ready for Review" subtitle="Candidates awaiting a human decision" fixedFilters={{ reviewStatus: 'READY_FOR_REVIEW' }} />}
          />
          <Route
            path="/approved"
            element={<Queue title="Approved" subtitle="Human-approved candidates" fixedFilters={{ reviewStatus: 'APPROVED' }} />}
          />
          <Route
            path="/revision"
            element={<Queue title="Revision Requested" subtitle="Candidates sent back with feedback" fixedFilters={{ reviewStatus: 'REVISION_REQUESTED' }} />}
          />
          <Route
            path="/publish"
            element={
              <Queue
                title="Publish Queue"
                subtitle="Approved candidates on their way to a future publish adapter — no Instagram/Graph API integration exists yet"
                fixedFilters={{ reviewStatus: 'APPROVED' }}
              />
            }
          />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/channels" element={<Channels />} />
          <Route path="/candidate/:id" element={<CandidateDetail />} />
        </Routes>
      </main>
    </div>
  );
}
