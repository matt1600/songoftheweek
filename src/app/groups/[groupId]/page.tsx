import GroupClientComponent from '@/components/GroupClientComponent';
import { NextPage } from 'next';

interface PageParams {
  groupId: string;
}

interface Props {
  params: PageParams;
}

const GroupPage: NextPage<Props> = ({ params }) => {
  return <GroupClientComponent groupId={params.groupId} />;
};

export default GroupPage;