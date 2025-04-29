'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CreateUsernamePage = () => {
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem('userName');
    if (storedUsername) {
      router.push('/groups');
    }
  }, [router]);

  const saveUsername = () => {
    if (username.trim()) {
      localStorage.setItem('userName', username.trim());
      router.push('/groups');
    }
  };

  return (
    <div>
      <h1>Choose a Username</h1>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <button onClick={saveUsername}>Save</button>
    </div>
  );
};

export default CreateUsernamePage;
