import GroupClientComponent from '@/components/GroupClientComponent';
import { PageProps } from 'next/types'; // Import the built-in PageProps

export default function GroupPage({ params }: PageProps<{ groupId: string }>) {
  return <GroupClientComponent groupId={params.groupId} />;
}