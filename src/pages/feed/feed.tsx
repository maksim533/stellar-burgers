import { useDispatch, useSelector } from '@store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { feedsApi, selectedFeed } from '@slices';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  const getFeeds = () => {
    dispatch(feedsApi());
  };

  useEffect(() => {
    getFeeds();
  }, [dispatch]);

  const orders: TOrder[] = useSelector(selectedFeed).orderData.orders;

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={getFeeds} />;
};
