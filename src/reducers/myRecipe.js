import {
  ADD_NEW_INGREDIENT,
  ADD_NEW_STEP,
  DELETE_INGREDIENT,
  DELETE_STEP,
  ADD_IMAGE_TO_RECIPE,
  RESET_MY_RECIPE,
  SET_EDIT_MODE_YES,
  PREFILL_RECIPE_TO_EDIT,
  CHANGE_INGREDIENT
} from "../actions/recipes";
import { imagePlaceholder } from "../constants";

const initialState = {
  ingredients: [],
  steps: [],
  image: imagePlaceholder,
  editMode: false
};

export default (
  state = JSON.parse(JSON.stringify(initialState)),
  action = []
) => {
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
        ingredient => ingredient.id !== action.payload
      );
      return { ...state, ingredients };

    case DELETE_STEP:
      const steps = [...state.steps];
      steps.splice(action.payload, 1);
      return { ...state, steps };

    case CHANGE_INGREDIENT:
      const newIngredientArray = [...state.ingredients];
      newIngredientArray[action.payload.arrayIndex] =
        action.payload.newIngredient;

      return { ...state, ingredients: newIngredientArray };

    case ADD_IMAGE_TO_RECIPE:
      return { ...state, image: action.payload };

    case RESET_MY_RECIPE:
      return JSON.parse(JSON.stringify(initialState));

    case SET_EDIT_MODE_YES:
      return { ...state, editMode: true };

    case PREFILL_RECIPE_TO_EDIT:
      return {
        ...state,
        ingredients: action.payload.ingredients,
        steps: action.payload.steps
      };

    default:
      return state;
  }
};
