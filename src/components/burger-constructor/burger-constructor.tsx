import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectBurgerConstructorItems,
  selectConstructorBun,
  selectConstructorIngredientsArray,
  clearConstructor
} from '../../services/slices/constructorSlice';
import { selectIsAuthenticated } from '../../services/slices/userSlice';
import {
  fetchOrderBurgerApi,
  clearOrder,
  selectOrderIsLoading,
  selectOrder
} from '../../services/slices/currentOrderSlice';
import { BurgerConstructorUI } from '@ui';
import { Preloader } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bun = useSelector(selectConstructorBun);
  const ingredients = useSelector(selectConstructorIngredientsArray);

  const constructorItems = { bun, ingredients };

  const orderIsLoading = useSelector(selectOrderIsLoading);
  const orderModalData = useSelector(selectOrder);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
      return;
    }
    if (!bun) {
      return;
    }
    const orderData = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];
    dispatch(fetchOrderBurgerApi(orderData))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    navigate('/');
  };

  const price = bun
    ? bun.price * 2 + ingredients.reduce((acc, item) => acc + item.price, 0)
    : 0;

  return (
    <BurgerConstructorUI
      price={price}
      constructorItems={constructorItems}
      orderRequest={orderIsLoading}
      orderModalData={orderModalData ?? null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
