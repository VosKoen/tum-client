import {
  SET_RANDOM_RECIPE,
  SET_RECIPE_IMAGE,
  SET_IS_SELECTED_RECIPE,
  SET_OPENED_RECIPE
} from "../actions/recipes";
import { SET_RECIPE_USER_RATING } from "../actions/ratings";
import { imagePlaceholder } from "../constants";

export default (
  state = { imageUrl: imagePlaceholder, recipeIsLiked: null },
  action = {}
) => {
  switch (action.type) {
    case SET_RANDOM_RECIPE:
      return { ...state, ...action.payload, isSelectedRecipe: false, isOpenedRecipe: false };
    case SET_OPENED_RECIPE:
      return { ...state, ...action.payload, isSelectedRecipe: false, isOpenedRecipe: true  };
    case SET_RECIPE_IMAGE:
      return { ...state, ...action.payload };
    case SET_IS_SELECTED_RECIPE:
      return { ...state, isSelectedRecipe: true };
    case SET_RECIPE_USER_RATING:
      return { ...state, recipeIsLiked: action.payload };
    default:
      return state;
  }
};
