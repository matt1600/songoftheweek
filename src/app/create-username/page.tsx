'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';

const CreateUsernamePage = () => {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const storedUsername = localStorage.getItem('userName');
    if (storedUsername) {
      const redirect = searchParams.get('redirect') || '/groups';
      router.push(redirect);
    }
  }, [router, searchParams]);

  const saveUsername = () => {
    if (username.trim()) {
      localStorage.setItem('userName', username.trim());
      const redirect = searchParams.get('redirect') || '/groups';
      router.push(redirect);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Choose a Username</h1>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <button className={styles.button} onClick={saveUsername}>Save</button>
      </div>
    </div>
  );
};

export default CreateUsernamePage;