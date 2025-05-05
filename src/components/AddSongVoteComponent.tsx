'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import YouTubeVideoCard from '@/components/YoutubeVideoCard';
import styles from './add-song-vote.module.css'; // Import CSS module
import '@/styles/globals.css';

interface Song {
  song_url: string;
  submitting_user: string;
  submitted_at: string;
}

const AddSongVoteComponent = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [newSongUrl, setNewSongUrl] = useState('');
  const [votedSongs, setVotedSongs] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(true);
  const pathname = usePathname();
  const groupId = pathname.split('/').pop();
  const username = localStorage.getItem('userName');

  useEffect(() => {
    fetchSongs();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [groupId]);

  const updateTimer = async () => {
    if (!groupId) return;
    
    const response = await fetch(`/api/groups/${groupId}/status`);
    const data = await response.json();
    
    if (response.ok && data.start_time) {
      const startTime = new Date(data.start_time);
      const currentTime = new Date();
      const timeDiff = startTime.getTime() + (60 * 60 * 1000) - currentTime.getTime();
      
      if (timeDiff <= 0) {
        setTimeLeft('Time is up!');
        setIsSubmissionOpen(false);
        return;
      }
      
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }
  };

  const fetchSongs = async () => {
    if (!groupId) return;
    const response = await fetch(`/api/songs/${groupId}`);
    const data = await response.json();
    if (response.ok) setSongs(data);
  };

  const addSong = async () => {
    if (!newSongUrl.trim() || !username || !groupId || !isSubmissionOpen) return;

    const response = await fetch(`/api/songs/${groupId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submitting_user: username, song_url: newSongUrl })
    });

    if (response.ok) {
      setNewSongUrl('');
      fetchSongs();
    } else {
      const data = await response.json();
      alert(data.error || 'Failed to add song');
    }
  };

  const voteSong = async (url: string, submittingUser: string) => {
    if (!groupId || !username || submittingUser === username) return;

    try {
      const response = await fetch(`/api/votes/${groupId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voting_user: username, song_url: url })
      });

      const data = await response.json();

      if (response.ok) {
        setVotedSongs([...votedSongs, url]);
      } else {
        alert(data.error || 'Failed to vote for song');
      }
    } catch (error) {
      console.error('Error voting for song:', error);
      alert('An error occurred while voting');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Songs</h2>
      <div className={styles.timer}>Time Left: {timeLeft}</div>
      {isSubmissionOpen && (
        <div className={styles.inputContainer}>
          <input
            className={styles.input}
            value={newSongUrl}
            onChange={(e) => setNewSongUrl(e.target.value)}
            placeholder="Youtube URL"
          />
          <button className={styles.addButton} onClick={addSong}>Add Song</button>
        </div>
      )}

      <ul className={styles.songsList}>
        {songs.map(song => (
          <li key={song.song_url} className={styles.listItem}>
            <YouTubeVideoCard videoUrl={song.song_url}/>
            <div className={styles.songInfo}>
              <span>Submitted by: {song.submitting_user}</span>
              <button
                className={styles.voteButton}
                onClick={() => voteSong(song.song_url, song.submitting_user)}
                disabled={votedSongs.includes(song.song_url) || song.submitting_user === username}
              >
                {votedSongs.includes(song.song_url) ? 'Voted' : 
                 song.submitting_user === username ? 'Your Song' : 'Vote'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddSongVoteComponent;