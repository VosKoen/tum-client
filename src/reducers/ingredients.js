import { SET_INGREDIENT_LIST } from "../actions/ingredients";

export default (state = [], action = {}) => {
  switch (action.type) {
    case SET_INGREDIENT_LIST:
    return [...action.payload] 
    default:
      return state;
  }
};
