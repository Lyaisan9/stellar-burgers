import { FC } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import styles from '../ui/ingredient-details/ingredient-details.module.css';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const ingredients = useSelector(selectIngredients);
  const ingredientData = ingredients.find((ing) => ing._id === id) || null;

  const isModalView = location.state?.background;

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <div className={`${styles.page} ${!isModalView ? styles.standalone : ''}`}>
      {!isModalView && (
        <h2 className='text text_type_main-large mt-10 mb-5'>
          Детали ингредиента
        </h2>
      )}
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
