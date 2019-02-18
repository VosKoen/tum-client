import {
  SET_RANDOM_RECIPE,
  SET_RECIPE_IMAGE,
  SET_IS_SELECTED_RECIPE,
  SET_OPENED_RECIPE,
  SET_DELETE_RECIPE_SUCCESS,
  SET_MY_RECIPES
} from "../actions/recipes";
import { SET_RECIPE_USER_RATING } from "../actions/ratings";
import { imagePlaceholder } from "../constants";

const initialState = { imageUrl: imagePlaceholder, recipeIsLiked: null, deleteRecipeSuccess: false }

export default (
  state = {...initialState},
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
    case SET_DELETE_RECIPE_SUCCESS:
      return { ...initialState, deleteRecipeSuccess: true };
      case SET_MY_RECIPES:
      return { ...state, deleteRecipeSuccess: false };   
    default:
      return state;
  }
};
