import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '@store';
import { selectedUser } from '@slices';

export const AppHeader: FC = () => {
  const user = useSelector(selectedUser).user?.name;
  return <AppHeaderUI userName={user} />;
};
