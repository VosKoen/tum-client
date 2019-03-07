import { SET_RECIPE_HISTORY } from "../actions/recipes";

export default (state = [], action = {}) => {
  switch (action.type) {
    case SET_RECIPE_HISTORY:
    return { ...action.payload };

    default:
      return state;
  }
};
