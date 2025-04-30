'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import YouTubeVideoCard from '@/components/YoutubeVideoCard';
import styles from './add-song-vote.module.css'; // Import CSS module
import '@/styles/globals.css';

interface Song {
  song_url: string;
}

const AddSongVoteComponent = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [newSongUrl, setNewSongUrl] = useState('');
  const [votedSongs, setVotedSongs] = useState<string[]>([]);
  const pathname = usePathname();
  const groupId = pathname.split('/').pop();

  useEffect(() => {
    fetchSongs();
  }, [groupId]); // Fetch songs when groupId changes (important for dynamic routes)

  const fetchSongs = async () => {
    if (!groupId) return;
    const response = await fetch(`/api/songs/${groupId}`);
    const data = await response.json();
    if (response.ok) setSongs(data);
  };

  const addSong = async () => {
    const username = localStorage.getItem('userName');
    if (!newSongUrl.trim() || !username || !groupId) return;

    const response = await fetch(`/api/songs/${groupId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submitting_user: username, song_url: newSongUrl })
    });

    if (response.ok) {
      setNewSongUrl('');
      fetchSongs();
    } else {
      console.error('Failed to add song');
    }
  };

  const voteSong = async (url: string) => {
    const username = localStorage.getItem('userName');
    if (!groupId || !username) return;

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
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          value={newSongUrl}
          onChange={(e) => setNewSongUrl(e.target.value)}
          placeholder="YouTube URL"
        />
        <button className={styles.addButton} onClick={addSong}>Add Song</button>
      </div>

      <ul className={styles.songsList}>
        {songs.map(song => (
          <li key={song.song_url} className={styles.listItem}>
            <YouTubeVideoCard videoUrl={song.song_url} />
            <button
              className={styles.voteButton}
              onClick={() => voteSong(song.song_url)}
              disabled={votedSongs.includes(song.song_url)}
            >
              {votedSongs.includes(song.song_url) ? 'Voted' : 'Vote'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddSongVoteComponent;