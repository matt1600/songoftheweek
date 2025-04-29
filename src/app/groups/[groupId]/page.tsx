'use client';
import AddSongVoteComponent from '@/components/AddSongVoteComponent';
import GroupAdminButton from '@/components/GroupAdminButton';
import styles from './page.module.css'; // Import CSS module
import { useState, useEffect } from 'react';
import React from 'react';

interface GroupMember {
  user_name: string;
}

async function fetchGroupMembers(groupId: string): Promise<GroupMember[]> {
  const res = await fetch(`/api/groups/${groupId}/members`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch group members');
  }

  return res.json();
}

interface PageProps {
  params: {
    groupId: string;
  };
}

export default function GroupPage({ params }: PageProps) {
  const { groupId } = params;
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedMembers = await fetchGroupMembers(groupId);
        setMembers(fetchedMembers);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [groupId]);

  if (loading) {
    return <div className={styles.container}>Loading members...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error loading members: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome to {groupId}</h1>
      <section className={styles.membersSection}>
        <h2 className={styles.membersHeading}>Group Members:</h2>
        {members.length > 0 ? (
          <ul className={styles.membersList}>
            {members.map((member, index) => (
              <li key={index} className={styles.memberItem}>{member.user_name}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.noMembers}>No members found.</p>
        )}
      </section>
      <div className={styles.actionsContainer}>
        <AddSongVoteComponent />
      </div>
      <GroupAdminButton />
    </div>
  );
}