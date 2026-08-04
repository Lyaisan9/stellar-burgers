import { ingredientsReducer, fetchIngredients } from '../ingredientsSlice';

const mockIngredients = [
    { _id: '1', name: 'Булка', type: 'bun', price: 10, proteins: 1, fat: 1, carbohydrates: 1, calories: 1, image: '', image_mobile: '', image_large: '' },
    { _id: '2', name: 'Соус', type: 'sauce', price: 20, proteins: 1, fat: 1, carbohydrates: 1, calories: 1, image: '', image_mobile: '', image_large: '' }
];

describe('ingredientsSlice', () => {
    test('должен возвращать начальное состояние', () => {
        const initialState = {
            ingredients: [],
            isIngredientsLoading: false,
            error: undefined
        };
        expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
    });

    test('должен обрабатывать fetchIngredients.pending', () => {
        const state = ingredientsReducer(undefined, fetchIngredients.pending('', undefined));
        expect(state.isIngredientsLoading).toBe(true);
    });

    test('должен обрабатывать fetchIngredients.fulfilled', () => {
        const state = ingredientsReducer(undefined, fetchIngredients.fulfilled(mockIngredients, '', undefined));
        expect(state.ingredients).toEqual(mockIngredients);
        expect(state.isIngredientsLoading).toBe(false);
    });

    test('должен обрабатывать fetchIngredients.rejected', () => {
        const state = ingredientsReducer(undefined, fetchIngredients.rejected(new Error('Ошибка'), '', undefined));
        expect(state.isIngredientsLoading).toBe(false);
        expect(state.error).toBe('Ошибка');
    });
});