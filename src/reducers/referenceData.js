import { SET_INGREDIENT_LIST, SET_INGREDIENT_AMOUNT_TYPE_UNIT_LIST } from "../actions/ingredients";

export default (state = {ingredients: [], ingredientAmountTypeUnits: []}, action = {}) => {
  switch (action.type) {
    case SET_INGREDIENT_LIST:
    return {...state, ingredients: [...action.payload]} 
    case SET_INGREDIENT_AMOUNT_TYPE_UNIT_LIST:
    return {...state, ingredientAmountTypeUnits: [...action.payload]} 
    default:
      return state;
  }
};
