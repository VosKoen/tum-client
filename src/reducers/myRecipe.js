import { ADD_NEW_INGREDIENT } from "../actions/recipes";

const initialState = {
  title: null,
  description: null,
  ingredients: [],
  steps: []
};

export default (state = initialState, action = []) => {
  switch (action.type) {
    case ADD_NEW_INGREDIENT:
      const stateWithNewIngredient = { ...state }
      stateWithNewIngredient.ingredients.push(action.payload);
      return stateWithNewIngredient;

    default:
      return state;
  }
};
