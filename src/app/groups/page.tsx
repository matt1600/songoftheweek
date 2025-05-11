'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './page.module.css'; // Import the CSS module

const GroupLandingPage = () => {
  const [myGroups, setMyGroups] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem('userName');
    if (!username) {
      router.push('/create-username');
      return;
    }

    const fetchGroups = async () => {
      const response = await fetch(`/api/users/${username}/groups`);
      const data = await response.json();
      if (response.ok) {
        setMyGroups(data.map((g: { group_id: string }) => g.group_id));
      }
    };

    fetchGroups();
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.heading}>Song of the Week 🎵</h1>
        <div className={styles.buttonContainer}>
          <button className={styles.actionButton} onClick={() => router.push('/groups/create')}>Create Group</button>
          <button className={styles.actionButton} onClick={() => router.push('/groups/join')}>Join Group</button>
        </div>
        <div className={styles.groupContainer}>
          <h2 className={styles.myGroupsTitle}>My Groups</h2>
          {myGroups.map(groupId => (
            <div key={groupId}>
              <button className={styles.groupButton} onClick={() => router.push(`/groups/${groupId}`)}>{groupId}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupLandingPage;