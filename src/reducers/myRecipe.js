import {
  ADD_NEW_INGREDIENT,
  ADD_NEW_STEP,
  DELETE_INGREDIENT
} from "../actions/recipes";

const initialState = {
  title: null,
  description: null,
  ingredients: [],
  steps: []
};

export default (state = initialState, action = []) => {
  switch (action.type) {
    case ADD_NEW_INGREDIENT:
      const stateWithNewIngredient = { ...state };
      stateWithNewIngredient.ingredients.push(action.payload);
      return stateWithNewIngredient;

    case ADD_NEW_STEP:
      const stateWithNewStep = { ...state };
      stateWithNewStep.steps.push(action.payload);
      return stateWithNewStep;

    case DELETE_INGREDIENT:
      const ingredients = state.ingredients.filter(
        ingredient => ingredient.ingredientId !== action.payload
      );
      return { ...state, ingredients };

    default:
      return state;
  }
};
