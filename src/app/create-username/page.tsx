'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css'; // Import the CSS module

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
    <div className={styles.container}> {/* Use the container style */}
      <h1 className={styles.heading}>Choose a Username</h1> {/* Use the heading style */}
      <div className={styles.inputContainer}>
        <input
          className={styles.input} // Use the input style
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <button className={styles.button} onClick={saveUsername}>Save</button> {/* Use the button style */}
      </div>
    </div>
  );
};

export default CreateUsernamePage;