'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

const GroupAdminButton = () => {
  const pathname = usePathname();
  const groupId = pathname.split('/').pop();
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkOwner = async () => {
      const username = localStorage.getItem('userName');
      const response = await fetch(`/api/groups/${groupId}/members`);
      const data = await response.json();
      console.log(`data: ${JSON.stringify(data, null, 2)}`)
      if (response.ok) {
        const owner = data.find((member: { user_name: string, is_owner: boolean }) => member.user_name === username && member.is_owner);
        setIsOwner(!!owner);
        console.log(`owner: ${owner}`)
      }
    };
    checkOwner();
  }, [groupId]);

  const endVoting = async () => {
    if (!isOwner) {
      alert('Only owner can end voting.');
      return;
    }

    await fetch(`/api/groups/${groupId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ended' })
    });

    router.push(`/groups/${groupId}/results`)
  };

  return (
    <div>
      <button onClick={endVoting}>End Voting</button>
    </div>
  );
};

export default GroupAdminButton;
