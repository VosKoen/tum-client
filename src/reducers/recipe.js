import { SET_RANDOM_RECIPE, SET_RECIPE_IMAGE, SET_IS_SELECTED_RECIPE } from "../actions/recipes";
import { imagePlaceholder } from "../constants"

export default (state = {imageUrl: imagePlaceholder, positiveRating: null}, action = {}) => {
  switch (action.type) {
    case SET_RANDOM_RECIPE:
      return { ...state, ...action.payload,
        isSelectedRecipe: false  };
    case SET_RECIPE_IMAGE:
    return { ...state, 
      ...action.payload }
    case SET_IS_SELECTED_RECIPE:
    return { ...state, 
      isSelectedRecipe: true }
    default:
      return state;
  }
};
