'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import '@/styles/globals.css';

const JoinGroupPage = () => {
  const [groupId, setGroupId] = useState('');
  const router = useRouter();

  const joinGroup = async () => {
    const username = localStorage.getItem('userName');
    if (!groupId.trim() || !username) return;

    const response = await fetch(`/api/groups/${groupId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name: username })
    });

    if (response.ok) {
      router.push(`/groups/${groupId}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Join Group</h1>
      <input
        className={styles.input}
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
        placeholder="Group ID"
      />
      <button className={styles.button} onClick={joinGroup}>Join</button>
    </div>
  );
};

export default JoinGroupPage;