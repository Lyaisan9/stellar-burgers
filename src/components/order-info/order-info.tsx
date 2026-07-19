import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchOrderByNumber,
  selectOrdersIsLoading,
  selectOrders
} from '../../services/slices/orderSlice';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { Modal } from '@components';
import styles from '../ui/order-info/order-info.module.css';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const ordersNumber = Number(number);
  const dispatch = useDispatch();
  const location = useLocation();
  const isModalView = location.state?.background;

  useEffect(() => {
    dispatch(fetchOrderByNumber(ordersNumber));
  }, []);

  const orders = useSelector(selectOrders);
  const orderData = orders.find((order) => order);

  const ingredients: TIngredient[] = useSelector(selectIngredients);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return (
    <div className={`${styles.page} ${!isModalView ? styles.standalone : ''}`}>
      {!isModalView && (
        <h2 className='text text_type_digits-default mb-10'>
          #{orderInfo.number}
        </h2>
      )}
      <OrderInfoUI orderInfo={orderInfo} />
    </div>
  );
};
