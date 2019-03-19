import user from "./user";
import login from "./login";
import recipe from "./recipe";
import myRecipes from "./myRecipes";
import myRecipe from "./myRecipe";
import referenceData from "./referenceData";
import recipeHistory from "./recipeHistory";
import filters from './filters'
import { combineReducers } from "redux";

export default combineReducers({
  user,
  login,
  recipe,
  myRecipes,
  myRecipe,
  referenceData,
  recipeHistory,
  filters
});
