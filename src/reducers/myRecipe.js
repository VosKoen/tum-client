import {
  ADD_NEW_INGREDIENT,
  ADD_NEW_STEP,
  ADD_NEW_LABEL,
  DELETE_INGREDIENT,
  DELETE_STEP,
  RESET_MY_RECIPE,
  SET_EDIT_MODE_YES,
  PREFILL_RECIPE_TO_EDIT,
  CHANGE_INGREDIENT,
  CHANGE_STEP,
  DELETE_LABEL
} from "../actions/recipes";
import { imagePlaceholder } from "../constants";

const initialState = {
  ingredients: [],
  steps: [],
  labels: [],
  imageUrl: imagePlaceholder,
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

    case ADD_NEW_LABEL:
      const stateWithNewLabel = { ...state };
      stateWithNewLabel.labels.push(action.payload);
      return stateWithNewLabel;

    case DELETE_INGREDIENT:
      const ingredients = state.ingredients.filter(
        ingredient => ingredient.ingredientId !== action.payload
      );
      return { ...state, ingredients };

    case DELETE_STEP:
      const steps = [...state.steps];
      steps.splice(action.payload, 1);
      return { ...state, steps };

    case DELETE_LABEL:
      const labels = state.labels.filter(label => label.labelId !== action.payload);
      return { ...state, labels };

    case CHANGE_INGREDIENT:
      const newIngredientArray = [...state.ingredients];
      newIngredientArray[action.payload.arrayIndex] =
        action.payload.newIngredient;

      return { ...state, ingredients: newIngredientArray };

    case CHANGE_STEP:
      const newStepArray = [...state.steps];
      newStepArray[action.payload.arrayIndex] = action.payload.newStep;

      return { ...state, steps: newStepArray };

    case RESET_MY_RECIPE:
      return JSON.parse(JSON.stringify(initialState));

    case SET_EDIT_MODE_YES:
      return { ...state, editMode: true };

    case PREFILL_RECIPE_TO_EDIT:
      return {
        ...state,
        ingredients: action.payload.ingredients,
        steps: action.payload.steps,
        labels: action.payload.labels,
        id: action.payload.id,
        imageUrl: action.payload.imageUrl
      };

    default:
      return state;
  }
};
