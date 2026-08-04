import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds, selectFeedOrders } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  const handleGetFeeds = () => {
    console.log('Кнопка нажата!');
    dispatch(fetchFeeds())
      .unwrap()
      .then((res) => console.log('Данные получены:', res))
      .catch((err) => console.error('Ошибка запроса:', err));
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
