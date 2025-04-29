'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div>
      <h1>Join Group</h1>
      <input value={groupId} onChange={(e) => setGroupId(e.target.value)} placeholder="Group ID" />
      <button onClick={joinGroup}>Join</button>
    </div>
  );
};

export default JoinGroupPage;
