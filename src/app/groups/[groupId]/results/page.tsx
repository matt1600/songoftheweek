'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './page.module.css'; // Import CSS module
import '@/styles/globals.css';

interface VoteResult {
  song_url: string;
  votes: number;
}

const DisplayResultsComponent = () => {
  const [results, setResults] = useState<VoteResult[]>([]);
  const pathname = usePathname();
  const urlSegments = pathname.split('/').filter(Boolean);
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
    <div className={styles.container}>
      <h2 className={styles.heading}>Results</h2>
      <ul className={styles.resultsList}>
        {results.map(result => (
          <li key={result.song_url} className={styles.listItem}>
            <span className={styles.songUrl}>{result.song_url}</span>
            <span className={styles.votes}>{result.votes} votes</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayResultsComponent;