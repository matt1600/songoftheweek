'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css'; // Import CSS module
import '@/styles/globals.css'

const CreateGroupPage = () => {
  const [groupName, setGroupName] = useState('');
  const router = useRouter();

  const createGroup = async () => {
    const username = localStorage.getItem('userName');
    if (!groupName.trim() || !username) return;

    const response = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group_id: groupName, created_by: username })
    });

    const data = await response.json();
    if (response.ok) {
      router.push(`/groups/${data.group_id}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create Group</h1>
      <input
        className={styles.input}
        value={groupName}
        onChange={(e) => {
          const input = e.target.value.toUpperCase();
          const filtered = input.replace(/[^A-Z0-9_]/g, '');
        setGroupName(filtered);}}
        placeholder="Group Name"
      />
      <button className={styles.button} onClick={createGroup}>Create</button>
    </div>
  );
};

export default CreateGroupPage;