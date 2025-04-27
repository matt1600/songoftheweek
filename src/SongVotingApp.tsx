import React, { useState, useEffect } from 'react';
import './App.css';

interface Song {
  id: number;
  title: string;
  votes: number;
}

const SongVotingApp: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [newSong, setNewSong] = useState<string>('');
  const [votedSongIds, setVotedSongIds] = useState<number[]>([]);

  // Load from localStorage on app start
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

  // Save votedSongIds to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('votedSongIds', JSON.stringify(votedSongIds));
  }, [votedSongIds]);

  // Save songs to localStorage whenever songs change
  useEffect(() => {
    localStorage.setItem('songs', JSON.stringify(songs));
  }, [songs]);

  const addSong = () => {
    if (newSong.trim() === '') return;
    const song: Song = {
      id: Date.now(),
      title: newSong,
      votes: 0,
    };
    setSongs(prevSongs => [...prevSongs, song]);
    setNewSong('');
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
    }
  };

  return (
    <div className="App">
      <h1>Song of the Week 🎵</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter a song title"
          value={newSong}
          onChange={(e) => setNewSong(e.target.value)}
          style={{ padding: '8px', width: '250px', marginRight: '10px' }}
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
            {song.title} - {song.votes} votes
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
    </div>
  );
};

export default SongVotingApp;
