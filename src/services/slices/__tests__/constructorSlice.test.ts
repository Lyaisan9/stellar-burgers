import {
    burgerConstructorReducer,
    addIngredient,
    removeIngredient,
    clearConstructor,
    selectConstructorBurger,
    selectConstructorBun,
    selectConstructorIngredientsArray
} from '../constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

// Вспомогательная функция для создания мокового ингредиента с id
const createMockIngredient = (overrides: Partial<TIngredient> = {}): TIngredient => ({
    _id: overrides._id || '1',
    name: overrides.name || 'Ингредиент',
    type: overrides.type || 'main',
    price: overrides.price || 10,
    proteins: 1, fat: 1, carbohydrates: 1, calories: 1,
    image: '', image_mobile: '', image_large: '',
    ...overrides
});

describe('Тестирование burgerConstructorSlice', () => {
    const initialState = {
        constructorItems: {
            bun: null,
            ingredients: []
        },
        isIngredientsLoading: false,
        error: null
    };

    test('должен возвращать корректное начальное состояние', () => {
        expect(burgerConstructorReducer(undefined, { type: '' })).toEqual(initialState);
    });

    test('должен возвращать текущее состояние при неизвестном экшене', () => {
        const state = burgerConstructorReducer(undefined, { type: 'UNKNOWN_ACTION' });
        expect(state).toEqual(initialState);
    });

    describe('addIngredient', () => {
        test('должен добавлять булку', () => {
            const bun = createMockIngredient({ type: 'bun', name: 'Булка' });
            const action = addIngredient(bun);
            const state = burgerConstructorReducer(undefined, action);
            expect(state.constructorItems.bun).toMatchObject({ name: 'Булка', type: 'bun' });
            expect(state.constructorItems.bun).toHaveProperty('id');
        });

        test('должен заменять булку при добавлении новой', () => {
            const bun1 = createMockIngredient({ type: 'bun', name: 'Булка 1' });
            const bun2 = createMockIngredient({ type: 'bun', name: 'Булка 2' });
            let state = burgerConstructorReducer(undefined, addIngredient(bun1));
            state = burgerConstructorReducer(state, addIngredient(bun2));
            expect(state.constructorItems.bun?.name).toBe('Булка 2');
            expect(state.constructorItems.ingredients.length).toBe(0);
        });

        test('должен добавлять начинку или соус в ingredients', () => {
            const sauce = createMockIngredient({ type: 'sauce', name: 'Соус' });
            const state = burgerConstructorReducer(undefined, addIngredient(sauce));
            expect(state.constructorItems.ingredients).toHaveLength(1);
            expect(state.constructorItems.ingredients[0]).toHaveProperty('id');
            expect(state.constructorItems.ingredients[0].name).toBe('Соус');
        });
    });

    describe('removeIngredient', () => {
        test('должен удалять ингредиент по id', () => {
            const sauce = createMockIngredient({ type: 'sauce', name: 'Соус' });
            // Сначала добавляем ингредиент, чтобы получить его id
            let state = burgerConstructorReducer(undefined, addIngredient(sauce));
            const ingredientToRemove = state.constructorItems.ingredients[0];

            // Удаляем
            state = burgerConstructorReducer(state, removeIngredient(ingredientToRemove));
            expect(state.constructorItems.ingredients).toHaveLength(0);
        });
    });

    describe('clearConstructor', () => {
        test('должен очищать булку и ингредиенты', () => {
            const bun = createMockIngredient({ type: 'bun' });
            const sauce = createMockIngredient({ type: 'sauce' });
            let state = burgerConstructorReducer(undefined, addIngredient(bun));
            state = burgerConstructorReducer(state, addIngredient(sauce));
            state = burgerConstructorReducer(state, clearConstructor());
            expect(state.constructorItems.bun).toBeNull();
            expect(state.constructorItems.ingredients).toEqual([]);
        });
    });

    describe('Селекторы', () => {
        test('selectConstructorBurger должен возвращать весь объект конструктора', () => {
            const state = burgerConstructorReducer(undefined, { type: '' });
            const selected = selectConstructorBurger({ burgerConstructor: state });
            expect(selected).toEqual(state);
        });

        test('selectConstructorBun должен возвращать булку или null', () => {
            const state = burgerConstructorReducer(undefined, { type: '' });
            const bun = selectConstructorBun({ burgerConstructor: state });
            expect(bun).toBeNull();
        });

        test('selectConstructorIngredientsArray должен возвращать массив ингредиентов', () => {
            const sauce = createMockIngredient({ type: 'sauce' });
            const state = burgerConstructorReducer(undefined, addIngredient(sauce));
            const ingredients = selectConstructorIngredientsArray({ burgerConstructor: state });
            expect(ingredients.length).toBe(1);
        });
    });
});