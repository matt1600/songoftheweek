import GroupClientComponent from '@/components/GroupClientComponent';

interface PageProps {
  params: {
    groupId: string;
  };
}

export default async function GroupPage({ params }: PageProps) {
  return <GroupClientComponent groupId={params.groupId} />;
}