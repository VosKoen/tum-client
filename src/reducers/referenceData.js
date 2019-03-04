import { SET_INGREDIENT_LIST } from "../actions/ingredients";

export default (state = {ingredients: [], ingredientAmountTypeUnits: []}, action = {}) => {
  switch (action.type) {
    case SET_INGREDIENT_LIST:
    return {...state, ingredients: [...action.payload]} 
    default:
      return state;
  }
};
