import SongVotingApp from '@/components/SongVotingApp';

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
    const { groupId } = params; // ✅ just use it, no await needed
  
    let members: GroupMember[] = [];
  
    try {
      members = await fetchGroupMembers(groupId);
    } catch (error) {
      return <div>Error loading members: {(error as Error).message}</div>;
    }
  
    return (
      <div>
        <h1>Welcome to {groupId}</h1>
        <h2>Group Members:</h2>
        {members.length > 0 ? (
          <ul>
            {members.map((member, index) => (
              <li key={index}>{member.user_name}</li>
            ))}
          </ul>
        ) : (
          <p>No members found.</p>
        )}
        <div style={{ marginTop: '40px' }}>
            <SongVotingApp />
        </div>
      </div>
    );
  }
  