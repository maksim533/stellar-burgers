import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '@store';
import { useParams } from 'react-router-dom';
import { selectIngredients } from '@slices';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const params = useParams().id;
  const selector = useSelector(selectIngredients);
  const ingredientData = selector.find(
    (ingredient) => ingredient._id === params
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
