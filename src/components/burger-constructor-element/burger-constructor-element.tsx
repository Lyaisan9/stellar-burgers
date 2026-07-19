import { FC, memo } from 'react';
import { useDispatch } from '../../services/store';
import {
  ingredientsToDown,
  ingredientsToUp,
  removeIngredient
} from '../../services/slices/constructorSlice';

import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(ingredientsToDown(index));
    };

    const handleMoveUp = () => {
      dispatch(ingredientsToUp(index));
    };
    const handleClose = () => {
      dispatch(removeIngredient(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
