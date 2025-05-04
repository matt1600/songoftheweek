'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css'; // Import CSS module
import '@/styles/globals.css'

const CreateGroupPage = () => {
  const [groupName, setGroupName] = useState('');
  const [votingEndTime, setVotingEndTime] = useState('');
  const router = useRouter();

  // Get time X hours from now in local timezone
  const getTimeFromNow = (hoursToAdd: number) => {
    const now = new Date();
    now.setHours(now.getHours() + hoursToAdd);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Set default end time when component mounts
  useEffect(() => {
    setVotingEndTime(getTimeFromNow(1));
  }, []);

  const createGroup = async () => {
    const username = localStorage.getItem('userName');
    if (!groupName.trim() || !username || !votingEndTime) return;

    // Convert local datetime to ISO string for storage
    const localDateTime = new Date(votingEndTime);
    const isoDateTime = localDateTime.toISOString();

    const response = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        group_id: groupName, 
        created_by: username,
        voting_end_time: isoDateTime 
      })
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
          setGroupName(filtered);
        }}
        placeholder="Group Name"
      />
      <label htmlFor="voting-end-time" className={styles.label}>Set the deadline for voting</label>
      <input
        id="voting-end-time"
        type="datetime-local"
        className={styles.input}
        value={votingEndTime}
        onChange={(e) => setVotingEndTime(e.target.value)}
        min={getTimeFromNow(0)}
      />
      <button 
        className={styles.button} 
        onClick={createGroup}
        disabled={!groupName}
      >
        Create
      </button>
    </div>
  );
};

export default CreateGroupPage;