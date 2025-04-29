'use client';
import AddSongVoteComponent from '@/components/AddSongVoteComponent';
import GroupAdminButton from '@/components/GroupAdminButton';
import styles from './page.module.css'; // Import CSS module

interface GroupMember {
  user_name: string;
}

async function fetchGroupMembers(groupId: string): Promise<GroupMember[]> {
  const res = await fetch(`http://localhost:3000/api/groups/${groupId}/members`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch group members');
  }

  return res.json();
}

export default async function GroupPage({ params }: { params: { groupId: string } }) {
  const { groupId } = params;

  let members: GroupMember[] = [];

  try {
    members = await fetchGroupMembers(groupId);
  } catch (error) {
    return <div className={styles.container}>Error loading members: {(error as Error).message}</div>;
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
        <GroupAdminButton />
      </div>
    </div>
  );
}