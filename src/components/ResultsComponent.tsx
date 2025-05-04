'use client';
import { useEffect, useState } from 'react';
import YouTubeVideoCard from '@/components/YoutubeVideoCard';

interface VoteResult {
  song_url: string;
  votes: number;
  submitting_user: string;
  is_winner?: boolean;
}

interface ResultsComponentProps {
  groupId: string;
}

export default function ResultsComponent({ groupId }: ResultsComponentProps) {
  const [results, setResults] = useState<VoteResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}/results`);
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [groupId]);

  if (loading) return <div>Loading results...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="results-container">
      <h2>Voting Results</h2>
      {results.length > 0 ? (
        <div className="results-list">
          {results.map((result, index) => (
            <div key={index} className={`result-item ${result.is_winner ? 'winner' : ''}`}>
              {result.is_winner && <div className="winner-badge">Winner! 🏆</div>}
              <YouTubeVideoCard videoUrl={result.song_url} />
              <div className="vote-count">Votes: {result.votes}</div>
            </div>
          ))}
        </div>
      ) : (
        <p>No votes have been cast yet.</p>
      )}
    </div>
  );
} 