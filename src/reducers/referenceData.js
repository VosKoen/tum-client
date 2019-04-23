import { SET_INGREDIENT_LIST } from "../actions/ingredients";
import { SET_LABEL_LIST } from "../actions/labels";

export default (state = {ingredients: [], labels: []}, action = {}) => {
  switch (action.type) {
    case SET_INGREDIENT_LIST:
    return {...state, ingredients: [...action.payload]} 
    case SET_LABEL_LIST:
    return {...state, labels: [...action.payload]}
    default:
      return state;
  }
};
