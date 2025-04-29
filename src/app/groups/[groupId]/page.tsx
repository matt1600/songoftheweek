import GroupClientComponent from '@/components/GroupClientComponent';

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const resolvedParams = await params;
  return <GroupClientComponent groupId={resolvedParams.groupId} />;
}