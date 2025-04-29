'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

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
  }, []);

  const fetchSongs = async () => {
    const response = await fetch(`/api/songs/${groupId}`);
    const data = await response.json();
    if (response.ok) setSongs(data);
  };

  const addSong = async () => {
    const username = localStorage.getItem('userName');
    if (!newSongUrl.trim() || !username) return;

    await fetch(`/api/songs/${groupId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submitting_user: username, song_url: newSongUrl })
    });

    setNewSongUrl('');
    fetchSongs();
  };

  const voteSong = async (url: string) => {
    const username = localStorage.getItem('userName');
    if (votedSongs.includes(url) || !username) return;

    await fetch(`/api/votes/${groupId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voting_user: username, song_url: url })
    });

    setVotedSongs([...votedSongs, url]);
  };

  return (
    <div>
      <h2>Songs</h2>
      <input value={newSongUrl} onChange={(e) => setNewSongUrl(e.target.value)} placeholder="Song URL" />
      <button onClick={addSong}>Add Song</button>

      <ul>
        {songs.map(song => (
          <li key={song.song_url}>
            <a href={song.song_url} target="_blank">{song.song_url}</a>
            <button onClick={() => voteSong(song.song_url)} disabled={votedSongs.includes(song.song_url)}>
              {votedSongs.includes(song.song_url) ? 'Voted' : 'Vote'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddSongVoteComponent;
