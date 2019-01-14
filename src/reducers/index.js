import user from "./user";
import login from "./login";
import recipe from "./recipe";
import myRecipes from "./myRecipes";
import { combineReducers } from "redux";

export default combineReducers({
  user,
  login,
  recipe,
  myRecipes
});
