'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinGroupForm() {
  const [groupId, setGroupId] = useState('');
  const [userName, setUserName] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupId || !userName) {
      setResponse('Please fill in both fields.');
      return;
    }

    localStorage.setItem('userName', userName);

    try {
      const res = await fetch(`/api/groups/${groupId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name: userName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResponse(`Error: ${data.error || 'Unknown error'}`);
      } else {
        router.push(`/groups/${groupId}`);
      }
    } catch (error) {
      setResponse(`Request failed: ${(error as Error).message}`);
    }
  };

  return (
    <div>
      <h2>Add User to Group</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Group ID:</label>
          <input
            type="text"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          />
        </div>
        <div>
          <label>User Name:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <button type="submit">
          Submit
        </button>
      </form>
      {response && <p>{response}</p>}
    </div>
  );
}