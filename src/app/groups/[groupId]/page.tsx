import GroupClientComponent from '@/components/GroupClientComponent';

interface PageParams {
  groupId: string;
}

export default async function GroupPage({
  params,
}: {
  params: PageParams;
}) {
  // even if you don't await anything here, that's fine
  return <GroupClientComponent groupId={params.groupId} />;
}
