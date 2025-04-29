'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface VoteResult {
  song_url: string;
  votes: number;
}

const DisplayResultsComponent = () => {
  const [results, setResults] = useState<VoteResult[]>([]);
  const pathname = usePathname();
  const urlSegments = pathname.split('/').filter(Boolean); // remove empty parts
  const groupId = urlSegments[urlSegments.length - 2];

  useEffect(() => {
    const fetchResults = async () => {
      const response = await fetch(`/api/votes/${groupId}`);
      const data = await response.json();
      if (response.ok) {
        const voteCount: { [key: string]: number } = {};
        data.forEach((vote: { song_url: string }) => {
          voteCount[vote.song_url] = (voteCount[vote.song_url] || 0) + 1;
        });

        const formattedResults = Object.entries(voteCount).map(([song_url, votes]) => ({ song_url, votes }));
        setResults(formattedResults);
      }
    };

    fetchResults();
  }, [groupId]);

  return (
    <div>
      <h2>Results</h2>
      <ul>
        {results.map(result => (
          <li key={result.song_url}>
            {result.song_url} - {result.votes} votes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayResultsComponent;
