import {
  SET_RECIPE,
  SET_RECIPE_IMAGE,
  SET_IS_SELECTED_RECIPE,
  SET_OPENED_RECIPE,
  SET_DELETE_RECIPE_SUCCESS,
  SET_MY_RECIPES,
  SET_RECIPE_IMAGE_IS_USER,
  RESET_RECIPE
} from "../actions/recipes";
import { SET_RECIPE_USER_RATING } from "../actions/ratings";

const initialState = {
  imageUrl: null,
  recipeIsLiked: null,
  deleteRecipeSuccess: false
};

export default (state = { ...initialState }, action = {}) => {
  switch (action.type) {
    case SET_RECIPE:
      return {
        ...state,
        ...action.payload,
        isSelectedRecipe: false,
        isOpenedRecipe: false
      };
    case SET_OPENED_RECIPE:
      return { ...state, isSelectedRecipe: false, isOpenedRecipe: true };

    case SET_IS_SELECTED_RECIPE:
      return { ...state, isSelectedRecipe: true, isOpenedRecipe: false };
    case SET_RECIPE_IMAGE:
      return { ...state, ...action.payload };
    case SET_RECIPE_IMAGE_IS_USER:
      return { ...state, recipeImageFromUser: action.payload };
    case SET_RECIPE_USER_RATING:
      return {
        ...state,
        recipeIsLiked: action.payload.recipeIsLiked,
        rating: action.payload.newRating
      };
    case SET_DELETE_RECIPE_SUCCESS:
      return { ...initialState, deleteRecipeSuccess: true };
    case SET_MY_RECIPES:
      return { ...state, deleteRecipeSuccess: false };
      case RESET_RECIPE:
      return { ...initialState };
    default:
      return state;
  }
};
