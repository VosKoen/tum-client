import { SET_RANDOM_RECIPE, SET_RECIPE_IMAGE } from "../actions/recipes";

export default (state = {}, action = {}) => {
  switch (action.type) {
    case SET_RANDOM_RECIPE:
      return { ...state, ...action.payload, imageUrl: null };
    case SET_RECIPE_IMAGE:
    return { ...state, 
      ...action.payload }
    default:
      return state;
  }
};
