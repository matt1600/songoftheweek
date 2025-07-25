'use client';
import { useState, useEffect } from 'react';
import AddSongVoteComponent from '@/components/AddSongVoteComponent';
import GroupAdminButton from '@/components/GroupAdminButton';
import styles from './group-client-component.module.css';
import { useRouter, usePathname } from 'next/navigation';


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

interface Props {
  groupId: string;
}

export default function GroupClientComponent({ groupId }: Props) {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${pathname}`
    : '';

  useEffect(() => {
    const username = localStorage.getItem('userName');
    const loadMembers = async () => {
      try {
        const fetchedMembers = await fetchGroupMembers(groupId);
        setMembers(fetchedMembers);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const joinGroup = async () => {
      try {
        await fetch(`/api/groups/${groupId}/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_name: username }),
        });
      } catch (error) {
        console.error('Failed to add user to group:', error);
      }
    };

    const rerouteIfFinished = async () => {
      try {
        const groupStatus = await fetch(`/api/groups/${groupId}/status`, {
          method: 'GET'
        });

        if (groupStatus.ok) {
          const data = await groupStatus.json();
          if (data.is_finished) {
            router.push(`/groups/${groupId}/results`);
          } else {
            console.log('Group is not yet finished.');
          }
        } else {
          console.error('Failed to fetch group status:', groupStatus.status);
        }

      } catch (error) {
        console.error('Failed to check group status:', error);
      }
    };

    joinGroup().then(loadMembers).then(rerouteIfFinished);
  }, [groupId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) return <div className={styles.container}>Loading group...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.homeButtonContainer}>
          <button onClick={() => router.push('/')} className={styles.homeButton}>
            Home
          </button>
        </div>
        <h1 className={styles.heading}>Song of the Week 🎵</h1>
        <div className={styles.groupBadge}>{groupId}</div>
  
        <div className={styles.actionsContainer}>
          <AddSongVoteComponent />
        </div>
  
        <GroupAdminButton />
  
        <div className={styles.shareContainer}>
          <p>Invite a friend to join this group:</p>
          <div className={styles.shareLinkBox}>
            <input
              type="text"
              readOnly
              value={shareUrl}
              className={styles.shareInput}
            />
            <button onClick={handleCopy} className={styles.shareButton}>
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
  
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
      </div>
    </div>
  );
}