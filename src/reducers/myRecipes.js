import { SET_MY_RECIPES } from "../actions/recipes";

export default (state = [], action = {}) => {
  switch (action.type) {
    case SET_MY_RECIPES:
      return { ...action.payload };

    default:
      return state;
  }
};
