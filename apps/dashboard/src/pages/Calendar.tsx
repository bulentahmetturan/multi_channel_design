import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCandidates } from '../lib/hooks';
import { channelDisplayName, archetypeOrderLabel } from '../lib/labels';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Visibility, not a calendar product (Batch P1 section 15): month grid with
// candidate markers on their prep/publish date. No drag-and-drop, no
// external calendar integration.
export function Calendar() {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const { candidates, loading } = useCandidates({});

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first

  const eventsByDate: Record<string, { label: string; candidateId: string }[]> = {};
  for (const c of candidates) {
    for (const [dateField, kind] of [
      ['prepDate', 'Prep'],
      ['publishDate', 'Publish'],
    ] as const) {
      const date = c[dateField];
      if (!date) continue;
      const d = new Date(date + 'T00:00:00');
      if (d.getFullYear() === year && d.getMonth() === month) {
        (eventsByDate[date] ??= []).push({
          label: `${kind}: ${channelDisplayName(c.channelId)} · ${archetypeOrderLabel(c)}`,
          candidateId: c.candidateId,
        });
      }
    }
  }

  const cells: (number | null)[] = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendar</h1>
          <div className="page-subtitle">
            {cursor.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div>
          <button className="btn" onClick={() => setCursor(new Date(year, month - 1, 1))}>
            ← Prev
          </button>{' '}
          <button className="btn" onClick={() => setCursor(new Date(year, month + 1, 1))}>
            Next →
          </button>
        </div>
      </div>
      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : (
        <div className="calendar-month">
          {WEEKDAYS.map((d) => (
            <div key={d} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            if (day == null) return <div key={i} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const events = eventsByDate[dateStr] ?? [];
            return (
              <div key={i} className="calendar-day">
                <div className="calendar-day-num">{day}</div>
                {events.map((e, j) => (
                  <Link key={j} to={`/candidate/${e.candidateId}`} className="calendar-event" style={{ display: 'block' }}>
                    {e.label}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
