'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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
    <div>
      <h1>Song of the Week</h1>
      <button onClick={() => router.push('/groups/create')}>Create Group</button>
      <button onClick={() => router.push('/groups/join')}>Join Group</button>

      <h2>My Groups</h2>
      {myGroups.map(groupId => (
        <div key={groupId}>
          <button onClick={() => router.push(`/groups/${groupId}`)}>{groupId}</button>
        </div>
      ))}
    </div>
  );
};

export default GroupLandingPage;
