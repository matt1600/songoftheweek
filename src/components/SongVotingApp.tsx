'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import '../styles/App.css';

interface Song {
  submitting_user: string;
  song_url: string;
}

const SongVotingApp: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [newUrl, setNewUrl] = useState<string>('');
  const [votedSongUrls, setVotedSongUrls] = useState<string[]>([]);
  const [showWinner, setShowWinner] = useState<boolean>(false);
  const [winner, setWinner] = useState<Song | null>(null);
  const pathname = usePathname();
  const groupId = pathname.split('/').pop();

  useEffect(() => {
    fetchSongs();

    const storedVotes = localStorage.getItem('votedSongUrls');
    if (storedVotes) {
      setVotedSongUrls(JSON.parse(storedVotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('votedSongUrls', JSON.stringify(votedSongUrls));
  }, [votedSongUrls]);

  const fetchSongs = async () => {
    try {
      const response = await fetch(`/api/songs/${groupId}`);
      const data = await response.json();
      if (response.ok) {
        setSongs(data);
      } else {
        console.error('Error fetching songs:', data.error);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const addSong = async () => {
    if (newUrl.trim() === '') return;

    const formattedUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;

    try {
      const response = await fetch('/api/songs/group1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submitting_user: 'Anonymous', // or ask for name if you want
          song_url: formattedUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewUrl('');
        fetchSongs(); // refresh the song list after adding
        setShowWinner(false);
        setWinner(null);
      } else {
        console.error('Error adding song:', data.error);
      }
    } catch (error) {
      console.error('Error adding song:', error);
    }
  };

  const voteSong = (url: string) => {
    if (votedSongUrls.includes(url)) return;
    setVotedSongUrls(prev => [...prev, url]);
  };

  const resetApp = () => {
    const confirmReset = window.confirm('Are you sure you want to reset your votes?');
    if (confirmReset) {
      setVotedSongUrls([]);
      localStorage.removeItem('votedSongUrls');
      setShowWinner(false);
      setWinner(null);
    }
  };

  const revealWinner = () => {
    if (songs.length === 0) return;

    const votedSongs = songs.filter(song => votedSongUrls.includes(song.song_url));
    const randomWinner = votedSongs[Math.floor(Math.random() * votedSongs.length)];
    setWinner(randomWinner);
    setShowWinner(true);
  };

  return (
    <div className="App">
      <h1>Song of the Week 🎵</h1>

      {/* ADD SONG INPUT */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter song URL"
          value={newUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewUrl(e.target.value)}
          style={{ padding: '8px', width: '400px', marginRight: '10px' }}
        />
        <button
          onClick={addSong}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Add Song
        </button>
      </div>

      {/* SONG LIST */}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {songs.map(song => (
          <li key={song.song_url} style={{ marginBottom: '10px' }}>
            <a
              href={song.song_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginRight: '10px',
                textDecoration: 'none',
                color: winner && winner.song_url === song.song_url ? 'green' : 'blue',
                fontWeight: winner && winner.song_url === song.song_url ? 'bold' : 'normal'
              }}
            >
              {song.song_url} {winner && winner.song_url === song.song_url && '🏆'}
            </a>
            <button
              onClick={() => voteSong(song.song_url)}
              disabled={votedSongUrls.includes(song.song_url)}
              style={{
                marginLeft: '10px',
                padding: '5px 10px',
                backgroundColor: votedSongUrls.includes(song.song_url) ? '#aaa' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: votedSongUrls.includes(song.song_url) ? 'not-allowed' : 'pointer'
              }}
            >
              {votedSongUrls.includes(song.song_url) ? 'Voted' : 'Vote'}
            </button>
          </li>
        ))}
      </ul>

      {/* BUTTONS */}
      {songs.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <button
            onClick={revealWinner}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Reveal Winner
          </button>
          <button
            onClick={resetApp}
            style={{
              backgroundColor: 'red',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Reset All
          </button>
        </div>
      )}

      {/* WINNER */}
      {showWinner && winner && (
        <div style={{ marginTop: '20px' }}>
          <h2>🏆 Winner:</h2>
          <a
            href={winner.song_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '18px', textDecoration: 'none', color: 'green' }}
          >
            {winner.song_url}
          </a>
        </div>
      )}
    </div>
  );
};

export default SongVotingApp;
