'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateGroupPage = () => {
  const [groupName, setGroupName] = useState('');
  const router = useRouter();

  const createGroup = async () => {
    const username = localStorage.getItem('userName');
    if (!groupName.trim() || !username) return;

    const response = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group_name: groupName, created_by: username })
    });

    const data = await response.json();
    if (response.ok) {
      router.push(`/groups/${data.group_id}`);
    }
  };

  return (
    <div>
      <h1>Create Group</h1>
      <input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Group Name" />
      <button onClick={createGroup}>Create</button>
    </div>
  );
};

export default CreateGroupPage;
