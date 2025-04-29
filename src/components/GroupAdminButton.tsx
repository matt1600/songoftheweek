'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import styles from './group-admin-button.module.css'; // Import CSS module

const GroupAdminButton = () => {
  const pathname = usePathname();
  const groupId = pathname.split('/').pop();
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkOwner = async () => {
      const username = localStorage.getItem('userName');
      if (!groupId || !username) return;
      const response = await fetch(`/api/groups/${groupId}/members`);
      const data = await response.json();
      if (response.ok) {
        const owner = data.find((member: { user_name: string, is_owner: boolean }) => member.user_name === username && member.is_owner);
        setIsOwner(!!owner);
      }
    };
    checkOwner();
  }, [groupId]);

  const endVoting = async () => {
    if (!isOwner) {
      alert('Only owner can end voting.');
      return;
    }

    if (!groupId) return;

    const response = await fetch(`/api/groups/${groupId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ended' })
    });

    if (response.ok) {
      router.push(`/groups/${groupId}/results`);
    } else {
      console.error('Failed to end voting.');
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={endVoting}
        disabled={!isOwner}
      >
        {isOwner ? 'End Voting' : 'Only Owner Can End'}
      </button>
    </div>
  );
};

export default GroupAdminButton;