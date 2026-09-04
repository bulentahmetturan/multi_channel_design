import { useEffect, useState } from 'react';
import { fetchCandidates, fetchChannels } from './api';
import type { CandidateLabel, Channel, CandidateFilters } from './types';

export function useCandidates(filters: CandidateFilters, reloadKey = 0) {
  const [candidates, setCandidates] = useState<CandidateLabel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCandidates(filters)
      .then((data) => {
        if (!cancelled) {
          setCandidates(data);
          setError(null);
        }
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters), reloadKey]);

  return { candidates, loading, error };
}

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChannels()
      .then(setChannels)
      .finally(() => setLoading(false));
  }, []);

  return { channels, loading };
}
