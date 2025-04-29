import GroupClientComponent from '@/components/GroupClientComponent';

interface PageParams {
  groupId: string;
}

export default function GroupPage({ params }: { params: PageParams }) {
  return <GroupClientComponent groupId={params.groupId} />;
}