import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import type { CandidateLabel, Channel } from './lib/types';
import * as api from './lib/api';

const KADUSE_CHANNEL: Channel = {
  channelId: 'kaduse-medikal',
  name: 'Kaduse Medikal',
  archetypes: [
    { id: 'product-promotion', order: 1, label: 'Product Promotion' },
    { id: 'kaduse-news', order: 4, label: 'Kaduse News' },
  ],
};

// A second, structurally different synthetic channel proving the UI is not
// Kaduse-hardcoded (Batch P1 section 41) -- test-only, never real production data.
const SYNTHETIC_CHANNEL_B: Channel = {
  channelId: 'test-only-channel-b',
  name: 'Test Channel B',
  archetypes: [{ id: 'match-recap', order: 1, label: 'Match Recap' }],
};

function candidate(overrides: Partial<CandidateLabel> = {}): CandidateLabel {
  return {
    candidateId: 'demo-1',
    channelId: 'kaduse-medikal',
    postArchetypeId: 'special-day',
    postArchetypeOrder: 4,
    postArchetypeLabel: 'Special Day',
    postSubtype: 'healthcare-profession-recognition',
    triggerType: 'SCHEDULED_OBSERVANCE',
    triggerId: 'kaduse-tip-bayrami',
    triggerLabel: '14 Mart — Tıp Bayramı',
    contentStatus: 'CONTENT_READY',
    designStatus: 'DESIGN_READY',
    reviewStatus: 'READY_FOR_REVIEW',
    publishStatus: 'NOT_READY',
    prepDate: '2027-03-08',
    publishDate: '2027-03-14',
    isDemo: true,
    renderUrl: null,
    evidenceStatus: null,
    sourcesUsed: null,
    createdAt: '2026-09-04T00:00:00.000Z',
    updatedAt: '2026-09-04T00:00:00.000Z',
    ...overrides,
  };
}

beforeEach(() => {
  vi.restoreAllMocks();
});

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe('Content Operations UI (Batch P1)', () => {
  it('1. dashboard renders', async () => {
    vi.spyOn(api, 'fetchCandidates').mockResolvedValue([candidate()]);
    vi.spyOn(api, 'fetchChannels').mockResolvedValue([KADUSE_CHANNEL]);
    renderAt('/');
    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByTestId('metric-tile').length).toBeGreaterThan(0));
  });

  it('2. queue renders candidate cards', async () => {
    vi.spyOn(api, 'fetchCandidates').mockResolvedValue([candidate()]);
    vi.spyOn(api, 'fetchChannels').mockResolvedValue([KADUSE_CHANNEL]);
    renderAt('/queue');
    const card = await screen.findByTestId('candidate-card');
    expect(within(card).getByText('Kaduse Medikal')).toBeInTheDocument();
    expect(within(card).getByText('04 · Special Day')).toBeInTheDocument();
    expect(within(card).getByText('14 Mart — Tıp Bayramı')).toBeInTheDocument();
  });

  it('3. channel filter narrows the candidates request', async () => {
    const spy = vi.spyOn(api, 'fetchCandidates').mockResolvedValue([candidate()]);
    vi.spyOn(api, 'fetchChannels').mockResolvedValue([KADUSE_CHANNEL]);
    renderAt('/queue');
    await screen.findByTestId('candidate-card');
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText('Channel'), 'kaduse-medikal');
    await waitFor(() => {
      const lastCall = spy.mock.calls[spy.mock.calls.length - 1][0];
      expect(lastCall?.channelId).toBe('kaduse-medikal');
    });
  });

  it('4. post archetype filter works once a channel is selected', async () => {
    const spy = vi.spyOn(api, 'fetchCandidates').mockResolvedValue([candidate()]);
    vi.spyOn(api, 'fetchChannels').mockResolvedValue([KADUSE_CHANNEL]);
    renderAt('/queue');
    await screen.findByTestId('candidate-card');
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText('Channel'), 'kaduse-medikal');
    await user.selectOptions(screen.getByLabelText('Post Archetype'), 'kaduse-news');
    await waitFor(() => {
      const lastCall = spy.mock.calls[spy.mock.calls.length - 1][0];
      expect(lastCall?.postArchetypeId).toBe('kaduse-news');
    });
  });

  it('5. trigger filter works', async () => {
    const spy = vi.spyOn(api, 'fetchCandidates').mockResolvedValue([candidate()]);
    vi.spyOn(api, 'fetchChannels').mockResolvedValue([KADUSE_CHANNEL]);
    renderAt('/queue');
    await screen.findByTestId('candidate-card');
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText('Trigger Type'), 'SCHEDULED_OBSERVANCE');
    await waitFor(() => {
      const lastCall = spy.mock.calls[spy.mock.calls.length - 1][0];
      expect(lastCall?.triggerType).toBe('SCHEDULED_OBSERVANCE');
    });
  });

  it('6. review-status filter works', async () => {
    const spy = vi.spyOn(api, 'fetchCandidates').mockResolvedValue([candidate()]);
    vi.spyOn(api, 'fetchChannels').mockResolvedValue([KADUSE_CHANNEL]);
    renderAt('/queue');
    await screen.findByTestId('candidate-card');
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText('Review Status'), 'APPROVED');
    await waitFor(() => {
      const lastCall = spy.mock.calls[spy.mock.calls.length - 1][0];
      expect(lastCall?.reviewStatus).toBe('APPROVED');
    });
  });

  it('7/8. candidate detail opens and shows channel, post type, subtype, trigger, statuses, timing', async () => {
    vi.spyOn(api, 'fetchCandidate').mockResolvedValue(candidate());
    renderAt('/candidate/demo-1');
    expect(await screen.findByRole('heading', { name: /14 Mart/ })).toBeInTheDocument();
    expect(screen.getByText('Kaduse Medikal')).toBeInTheDocument();
    expect(screen.getByText('04 · Special Day')).toBeInTheDocument();
    expect(screen.getByText('Healthcare Profession Recognition')).toBeInTheDocument();
    expect(screen.getByText('Scheduled Observance')).toBeInTheDocument();
    expect(screen.getByText('08 Mar')).toBeInTheDocument();
    expect(screen.getByText('14 Mar')).toBeInTheDocument();
    expect(screen.getByText('Content Ready')).toBeInTheDocument();
    expect(screen.getByText('Design Ready')).toBeInTheDocument();
    // 'Ready for Review' also matches the sidebar nav link -- assert at least one match, not exactly one.
    expect(screen.getAllByText('Ready for Review').length).toBeGreaterThan(0);
  });

  it('9. Approve action calls the API boundary and updates review status', async () => {
    vi.spyOn(api, 'fetchCandidate').mockResolvedValue(candidate());
    const submitSpy = vi.spyOn(api, 'submitReview').mockResolvedValue(candidate({ reviewStatus: 'APPROVED' }));
    renderAt('/candidate/demo-1');
    const user = userEvent.setup();
    await screen.findByRole('heading', { name: /14 Mart/ });
    await user.click(screen.getByRole('button', { name: 'Approve' }));
    await waitFor(() => expect(submitSpy).toHaveBeenCalledWith('demo-1', 'accept', undefined));
    expect(await screen.findAllByText('Approved')).not.toHaveLength(0);
  });

  it('10. Revision request stores the revision reason', async () => {
    vi.spyOn(api, 'fetchCandidate').mockResolvedValue(candidate());
    const submitSpy = vi.spyOn(api, 'submitReview').mockResolvedValue(candidate({ reviewStatus: 'REVISION_REQUESTED' }));
    renderAt('/candidate/demo-1');
    const user = userEvent.setup();
    await screen.findByRole('heading', { name: /14 Mart/ });
    await user.click(screen.getByRole('button', { name: 'Request Revision' }));
    await user.type(screen.getByPlaceholderText(/Başlık/), 'Başlık çok küçük.');
    await user.click(screen.getByRole('button', { name: 'Submit Revision Request' }));
    await waitFor(() => expect(submitSpy).toHaveBeenCalledWith('demo-1', 'revise', 'Başlık çok küçük.'));
  });

  it('11. Reject does not delete the candidate -- it remains visible with REJECTED status', async () => {
    vi.spyOn(api, 'fetchCandidate').mockResolvedValue(candidate());
    vi.spyOn(api, 'submitReview').mockResolvedValue(candidate({ reviewStatus: 'REJECTED' }));
    renderAt('/candidate/demo-1');
    const user = userEvent.setup();
    await screen.findByRole('heading', { name: /14 Mart/ });
    await user.click(screen.getByRole('button', { name: 'Reject' }));
    expect(await screen.findByRole('heading', { name: /14 Mart/ })).toBeInTheDocument();
    expect(await screen.findAllByText('Rejected')).not.toHaveLength(0);
  });

  it('12. Publish Queue excludes unapproved candidates (fixed filter forces reviewStatus=APPROVED)', async () => {
    const spy = vi.spyOn(api, 'fetchCandidates').mockResolvedValue([]);
    vi.spyOn(api, 'fetchChannels').mockResolvedValue([KADUSE_CHANNEL]);
    renderAt('/publish');
    await waitFor(() => expect(spy).toHaveBeenCalled());
    const lastCall = spy.mock.calls[spy.mock.calls.length - 1][0];
    expect(lastCall?.reviewStatus).toBe('APPROVED');
  });

  it('13. real preview appears when a render artifact exists', async () => {
    vi.spyOn(api, 'fetchCandidate').mockResolvedValue(candidate({ renderUrl: 'resource-abc123' }));
    renderAt('/candidate/demo-1');
    expect(await screen.findByText(/Render: resource-abc123/)).toBeInTheDocument();
  });

  it('14. missing render shows a clear DESIGN NOT GENERATED state', async () => {
    vi.spyOn(api, 'fetchCandidate').mockResolvedValue(candidate({ renderUrl: null }));
    renderAt('/candidate/demo-1');
    expect(await screen.findByText('DESIGN NOT GENERATED')).toBeInTheDocument();
  });

  it('multi-channel proof: same UI code renders a structurally different channel B without any Kaduse-specific code path', async () => {
    vi.spyOn(api, 'fetchCandidates').mockResolvedValue([
      candidate({ candidateId: 'b-1', channelId: 'test-only-channel-b', postArchetypeId: 'match-recap', postArchetypeOrder: 1, postArchetypeLabel: 'Match Recap', triggerLabel: 'Derby recap' }),
    ]);
    vi.spyOn(api, 'fetchChannels').mockResolvedValue([SYNTHETIC_CHANNEL_B]);
    renderAt('/queue');
    const card = await screen.findByTestId('candidate-card');
    // channelName is resolved from the /api/channels response (Channel.name),
    // never guessed by title-casing the raw channelId.
    expect(within(card).getByText('Test Channel B')).toBeInTheDocument();
    expect(within(card).getByText('01 · Match Recap')).toBeInTheDocument();
  });

  describe('Batch CE1: Clinical Education candidate display', () => {
    const ceCandidate = candidate({
      candidateId: 'ce-1',
      postArchetypeId: 'clinical-education',
      postArchetypeOrder: 5,
      postArchetypeLabel: 'Clinical Education / Auscultation Education',
      postSubtype: 'auscultation-education',
      triggerType: 'EVERGREEN_TOPIC',
      triggerId: 'ce-bell-vs-diaphragm',
      triggerLabel: 'Bell ve Diyafram Ne Zaman Kullanılır?',
      prepDate: null,
      publishDate: '2027-04-05',
      evidenceStatus: 'VERIFIED',
      sourcesUsed: [
        { sourceId: 'stanford-medicine-25', sourceName: 'Stanford Medicine 25', sourceRole: 'ACADEMIC_EXAM_EDUCATION', sourceUrl: 'https://med.stanford.edu/stanfordmedicine25/the25.html' },
        { sourceId: 'merck-manual-professional-cardiac', sourceName: 'Merck Manual Professional -- Cardiac Auscultation', sourceRole: 'PROFESSIONAL_CLINICAL_REFERENCE', sourceUrl: 'https://www.merckmanuals.com/professional/cardiovascular-disorders/approach-to-the-cardiac-patient/cardiac-auscultation' },
      ],
    });

    it('1/2/3. Clinical Education card renders with Kaduse channel tag and 05 · Clinical Education tag', async () => {
      vi.spyOn(api, 'fetchCandidates').mockResolvedValue([ceCandidate]);
      vi.spyOn(api, 'fetchChannels').mockResolvedValue([KADUSE_CHANNEL]);
      renderAt('/queue');
      const card = await screen.findByTestId('candidate-card');
      expect(within(card).getByText('Kaduse Medikal')).toBeInTheDocument();
      expect(within(card).getByText('05 · Clinical Education / Auscultation Education')).toBeInTheDocument();
    });

    it('4/5. subtype and trigger visible', async () => {
      vi.spyOn(api, 'fetchCandidates').mockResolvedValue([ceCandidate]);
      vi.spyOn(api, 'fetchChannels').mockResolvedValue([KADUSE_CHANNEL]);
      renderAt('/queue');
      const card = await screen.findByTestId('candidate-card');
      expect(within(card).getByText('Auscultation Education')).toBeInTheDocument();
      expect(within(card).getByText('Evergreen Topic')).toBeInTheDocument();
    });

    it('6/7. evidence status and source count visible on the card', async () => {
      vi.spyOn(api, 'fetchCandidates').mockResolvedValue([ceCandidate]);
      vi.spyOn(api, 'fetchChannels').mockResolvedValue([KADUSE_CHANNEL]);
      renderAt('/queue');
      const card = await screen.findByTestId('candidate-card');
      expect(within(card).getByText('Evidence: VERIFIED')).toBeInTheDocument();
      expect(within(card).getByText('Sources: 2')).toBeInTheDocument();
    });

    it('8. candidate detail shows the sources list', async () => {
      vi.spyOn(api, 'fetchCandidate').mockResolvedValue(ceCandidate);
      renderAt('/candidate/ce-1');
      await screen.findByRole('heading', { name: /Bell ve Diyafram/ });
      expect(screen.getByText('Stanford Medicine 25')).toBeInTheDocument();
      expect(screen.getByText('Merck Manual Professional -- Cardiac Auscultation')).toBeInTheDocument();
      expect(screen.getByText('ACADEMIC_EXAM_EDUCATION')).toBeInTheDocument();
    });

    it('9/10/11. channel + archetype filters still work; no separate Clinical Education app was created (same Queue component)', async () => {
      const spy = vi.spyOn(api, 'fetchCandidates').mockResolvedValue([ceCandidate]);
      vi.spyOn(api, 'fetchChannels').mockResolvedValue([{ ...KADUSE_CHANNEL, archetypes: [...KADUSE_CHANNEL.archetypes, { id: 'clinical-education', order: 5, label: 'Clinical Education / Auscultation Education' }] }]);
      renderAt('/queue');
      await screen.findByTestId('candidate-card');
      const user = userEvent.setup();
      await user.selectOptions(screen.getByLabelText('Channel'), 'kaduse-medikal');
      await user.selectOptions(screen.getByLabelText('Post Archetype'), 'clinical-education');
      await waitFor(() => {
        const lastCall = spy.mock.calls[spy.mock.calls.length - 1][0];
        expect(lastCall?.postArchetypeId).toBe('clinical-education');
      });
    });
  });
});
