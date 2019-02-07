import {
  ADD_NEW_INGREDIENT,
  ADD_NEW_STEP,
  DELETE_INGREDIENT,
  ADD_IMAGE_TO_RECIPE
} from "../actions/recipes";
import { imagePlaceholder } from "../constants";

const initialState = {
  ingredients: [],
  steps: [],
  image: imagePlaceholder,
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

    case ADD_IMAGE_TO_RECIPE:
        return {...state, image: action.payload}

    default:
      return state;
  }
};
