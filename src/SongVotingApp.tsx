import React, { useState, useEffect } from 'react';
import './App.css';

interface Song {
  id: number;
  url: string;
  votes: number;
}

const SongVotingApp: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [newUrl, setNewUrl] = useState<string>('');
  const [votedSongIds, setVotedSongIds] = useState<number[]>([]);
  const [showWinner, setShowWinner] = useState<boolean>(false);
  const [winner, setWinner] = useState<Song | null>(null);

  useEffect(() => {
    const storedVotes = localStorage.getItem('votedSongIds');
    if (storedVotes) {
      setVotedSongIds(JSON.parse(storedVotes));
    }
    const storedSongs = localStorage.getItem('songs');
    if (storedSongs) {
      setSongs(JSON.parse(storedSongs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('votedSongIds', JSON.stringify(votedSongIds));
  }, [votedSongIds]);

  useEffect(() => {
    localStorage.setItem('songs', JSON.stringify(songs));
  }, [songs]);

  const addSong = () => {
    if (newUrl.trim() === '') return;

    const formattedUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;

    const song: Song = {
      id: Date.now(),
      url: formattedUrl,
      votes: 0,
    };
    setSongs(prevSongs => [...prevSongs, song]);
    setNewUrl('');
    setShowWinner(false);
    setWinner(null);
  };

  const voteSong = (id: number) => {
    if (votedSongIds.includes(id)) return;
    setSongs(prevSongs =>
      prevSongs.map(song =>
        song.id === id ? { ...song, votes: song.votes + 1 } : song
      )
    );
    setVotedSongIds(prev => [...prev, id]);
  };

  const resetApp = () => {
    const confirmReset = window.confirm('Are you sure you want to reset all songs and votes?');
    if (confirmReset) {
      setSongs([]);
      setVotedSongIds([]);
      localStorage.removeItem('songs');
      localStorage.removeItem('votedSongIds');
      setShowWinner(false);
      setWinner(null);
    }
  };

  const revealWinner = () => {
    if (songs.length === 0) return;
    const highest = songs.reduce((prev, current) => (prev.votes > current.votes ? prev : current));
    setWinner(highest);
    setShowWinner(true);
  };

  return (
    <div className="App">
      <h1>Song of the Week 🎵</h1>
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

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {songs.map(song => (
          <li key={song.id} style={{ marginBottom: '10px' }}>
            <a
              href={song.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginRight: '10px',
                textDecoration: 'none',
                color: winner && song.id === winner.id ? 'green' : 'blue', // 🔥 Color winner green
                fontWeight: winner && song.id === winner.id ? 'bold' : 'normal' // 🔥 Bold winner
              }}
            >
              {song.url} {winner && song.id === winner.id && '🏆'} {/* 🔥 Add trophy emoji */}
            </a>
            <button
              onClick={() => voteSong(song.id)}
              disabled={votedSongIds.includes(song.id)}
              style={{
                marginLeft: '10px',
                padding: '5px 10px',
                backgroundColor: votedSongIds.includes(song.id) ? '#aaa' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: votedSongIds.includes(song.id) ? 'not-allowed' : 'pointer'
              }}
            >
              {votedSongIds.includes(song.id) ? 'Voted' : 'Vote'}
            </button>
          </li>
        ))}
      </ul>

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

      {showWinner && winner && (
        <div style={{ marginTop: '20px' }}>
          <h2>🏆 Winner:</h2>
          <a
            href={winner.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '18px', textDecoration: 'none', color: 'green' }}
          >
            {winner.url}
          </a>
          <p style={{ fontWeight: 'bold' }}>{winner.votes} votes</p>
        </div>
      )}
    </div>
  );
};

export default SongVotingApp;
